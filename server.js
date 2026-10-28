// ClearWords backend: serves the static UI and proxies one LLM call so the API key never reaches the browser.
// No database, no logging of user text, nothing persisted.

const express = require("express");
const path = require("path");
const { DEMO_RESULTS } = require("./demo");

const PORT = process.env.PORT || 3000;
// Provider order: Gemini (has a free tier) -> Anthropic -> demo mode.
const GEMINI_KEY = process.env.GEMINI_API_KEY || "";
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || "";
const PROVIDER = GEMINI_KEY ? "gemini" : ANTHROPIC_KEY ? "anthropic" : "demo";
const API_KEY = PROVIDER !== "demo";
const MODEL =
  process.env.CLEARWORDS_MODEL || (PROVIDER === "gemini" ? "gemini-3.6-flash" : "claude-haiku-5-5");
const MAX_CHARS = 6000;
const RATE_LIMIT_PER_MIN = 10;

const LANGUAGES = {
  en: "English",
  pcm: "Nigerian Pidgin",
  yo: "Yoruba",
  ig: "Igbo",
  ha: "Hausa",
};

const app = express();
app.set("trust proxy", 1);
app.use(express.json({ limit: "50kb" }));
app.use(express.static(path.join(__dirname, "public")));

// Very small in-memory rate limiter (per IP, per minute).
const hits = new Map();
function rateLimit(req, res, next) {
  const now = Date.now();
  const key = req.ip;
  const recent = (hits.get(key) || []).filter((t) => now - t < 60_000);
  if (recent.length >= RATE_LIMIT_PER_MIN) {
    return res.status(429).json({ error: "Too many requests. Please wait a minute and try again." });
  }
  recent.push(now);
  hits.set(key, recent);
  next();
}
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of hits) {
    const recent = v.filter((t) => now - t < 60_000);
    if (recent.length) hits.set(k, recent);
    else hits.delete(k);
  }
}, 60_000).unref();

function buildSystemPrompt(langName) {
  return `You are ClearWords, a careful health-literacy assistant. A patient or caregiver pastes text from a clinic note, pathology report, scan report or discharge summary related to cancer. Your job is to explain it in simple, warm, plain language in ${langName}.

Hard rules:
- Explain only what is in the text. Never invent results, stages, numbers or prognosis.
- Do NOT diagnose, do NOT say whether the person will recover or how long they have, do NOT recommend or advise against any treatment or medicine.
- If the text is unclear, incomplete or not medical, say so in the summary and keep the other fields short.
- Use short sentences and everyday words, at roughly a 6th-grade reading level. Keep medical terms in their original form in "term" and explain them in "meaning".
- Be kind and calm. Do not alarm the reader and do not falsely reassure them.
- "questions_for_doctor" must be 4 to 6 specific, useful questions the person can ask their care team, based on the text.
- "when_to_get_help" must be general safety advice only: tell them to contact their care team or go to the nearest hospital if they have severe pain, heavy bleeding, difficulty breathing, fever, or anything that worries them.
- Write all text values in ${langName}. If you are not fully confident in the quality of ${langName}, set "language_confidence" to "low", otherwise "high".

Respond with ONLY valid JSON, no markdown fences, in exactly this shape:
{
  "summary": "2-4 sentence plain explanation of what the text says",
  "key_terms": [{"term": "original medical term", "meaning": "simple explanation"}],
  "questions_for_doctor": ["..."],
  "when_to_get_help": "...",
  "language_confidence": "high" | "low"
}
"key_terms" should contain at most 8 items.`;
}

function extractJson(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON in model output");
  return JSON.parse(text.slice(start, end + 1));
}

function validate(obj) {
  const str = (v) => (typeof v === "string" ? v : "");
  return {
    summary: str(obj.summary),
    key_terms: Array.isArray(obj.key_terms)
      ? obj.key_terms
          .filter((t) => t && typeof t.term === "string" && typeof t.meaning === "string")
          .slice(0, 8)
      : [],
    questions_for_doctor: Array.isArray(obj.questions_for_doctor)
      ? obj.questions_for_doctor.filter((q) => typeof q === "string").slice(0, 8)
      : [],
    when_to_get_help: str(obj.when_to_get_help),
    language_confidence: obj.language_confidence === "low" ? "low" : "high",
  };
}

async function callGemini(text, lang) {
  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(MODEL)}:generateContent`,
    {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": GEMINI_KEY },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: buildSystemPrompt(LANGUAGES[lang]) }] },
        contents: [{ role: "user", parts: [{ text: `Text to explain:\n\n${text}` }] }],
        generationConfig: { responseMimeType: "application/json", maxOutputTokens: 2500, temperature: 0.3 },
      }),
      signal: AbortSignal.timeout(45_000),
    }
  );
  if (!resp.ok) throw new Error(`Upstream error ${resp.status}`);
  const data = await resp.json();
  const parts = data.candidates?.[0]?.content?.parts || [];
  const out = parts.map((p) => p.text || "").join("");
  return validate(extractJson(out));
}

async function callModel(text, lang) {
  if (PROVIDER === "gemini") return callGemini(text, lang);
  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": ANTHROPIC_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1800,
      system: buildSystemPrompt(LANGUAGES[lang]),
      messages: [{ role: "user", content: `Text to explain:\n\n${text}` }],
    }),
    signal: AbortSignal.timeout(45_000),
  });
  if (!resp.ok) {
    throw new Error(`Upstream error ${resp.status}`);
  }
  const data = await resp.json();
  const out = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("");
  return validate(extractJson(out));
}

app.get("/api/status", (_req, res) => {
  res.json({ mode: API_KEY ? "live" : "demo", languages: LANGUAGES, maxChars: MAX_CHARS });
});

app.post("/api/explain", rateLimit, async (req, res) => {
  const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
  const lang = typeof req.body?.lang === "string" ? req.body.lang : "en";

  if (!LANGUAGES[lang]) return res.status(400).json({ error: "Unsupported language." });
  if (text.length < 20) return res.status(400).json({ error: "Please paste a bit more text (at least a sentence or two)." });
  if (text.length > MAX_CHARS) {
    return res.status(400).json({ error: `That's too long. Please paste up to ${MAX_CHARS} characters at a time.` });
  }

  if (!API_KEY) {
    // Demo mode: only the built-in sample report is supported, so we never show an explanation of a different report.
    if (!/invasive ductal carcinoma/i.test(text)) {
      return res.status(400).json({
        error: "Demo mode can only explain the sample report (tap \"Use a sample report\"). Add an API key to explain any text.",
      });
    }
    return res.json({ mode: "demo", ...(DEMO_RESULTS[lang] || DEMO_RESULTS.en) });
  }

  try {
    const result = await callModel(text, lang);
    if (!result.summary) throw new Error("Empty summary");
    res.json({ mode: "live", ...result });
  } catch (err) {
    console.error("explain failed:", err.message); // message only, never the user's text
    res.status(502).json({ error: "Sorry, we couldn't explain that right now. Please try again in a moment." });
  }
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`ClearWords running on http://localhost:${PORT} (${API_KEY ? `live: ${PROVIDER}/${MODEL}` : "DEMO mode"})`);
  });
}

module.exports = app;
