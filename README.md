# ClearWords

Plain-language explanations of cancer-related medical text in **English, Nigerian Pidgin, Yoruba, Igbo and Hausa**.
Built for the 2026 CodeTheCure Hackathon, category: **Patient Experience & Support**.

Paste text from a pathology report, scan report or clinic note, pick a language, and get:
- a short plain-language summary
- a glossary of the medical terms in the report
- questions to ask your doctor
- general advice on when to get help quickly
- a read-aloud button (browser speech synthesis) and a print/save option

ClearWords never diagnoses, predicts outcomes, or recommends treatment. It only explains the text you paste.

## Run it

Requires Node 18+.

```bash
npm install
npm start          # http://localhost:3000
```

**Demo mode:** with no API key, the app returns a pre-written example result (matching the built-in sample report) so it always works for demos. A badge in the header shows "Demo mode".

Demo mode only explains the built-in sample report; any other text gets a message saying so.

**Live mode (free):** get a free Gemini key at https://aistudio.google.com/apikey and run:

```bash
export GEMINI_API_KEY=your_key_here
npm start
```

Prefer Claude? Set `ANTHROPIC_API_KEY` instead (paid). Gemini is used if both are set.

Optional: `CLEARWORDS_MODEL` (defaults: `gemini-3.6-flash` / `claude-haiku-5-5`), `PORT`.

```bash
npm test           # smoke tests (runs in demo mode)
```

## Deploy

Any Node host works (Render, Railway, Fly.io). Set `GEMINI_API_KEY` (or `ANTHROPIC_API_KEY`) as an environment variable in the host's dashboard, use `npm start` as the start command, and never commit a `.env` file.

## How it works

- `server.js`: Express server. `POST /api/explain` validates input (20 to 6000 characters, supported language), applies a per-IP rate limit (10 requests/minute), calls the model with a strict JSON schema prompt, validates the response shape, and returns it. Errors are logged without the user's text.
- `demo.js`: canned results for demo mode.
- `public/`: plain HTML, CSS and JavaScript. No framework or build step, so it is light on low bandwidth.

## Privacy and safety

- No accounts, no database, nothing saved, user text is never logged by ClearWords. Note: on Google's free Gemini tier, Google may use submitted content to improve its products, so check their current terms and don't paste real patient data into a public demo.
- The API key lives only on the server.
- The prompt forbids diagnosis, prognosis and treatment advice and tells the model to explain only what is in the text.
- Every result carries a "not medical advice" notice and general red-flag guidance.
- If the model flags low confidence in a language, the UI asks the user to have a fluent speaker check the result.

## Known limitations (be upfront about these in your pitch)

- Pidgin is strong; **Yoruba, Igbo and Hausa quality is lower**. The built-in demo text for those three is a draft and needs native-speaker review before real use.
- Pasted text only. No image/PDF upload or OCR yet.
- Browsers may not have Yoruba, Igbo or Hausa voices, so read-aloud can fall back to a default voice.
- Not a medical device and not clinically validated.

## Roadmap

OCR for photos of reports, WhatsApp delivery, clinician-reviewed translations, and a symptom/side-effect log with fixed red-flag rules.

## License

MIT
