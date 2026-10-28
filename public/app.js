(() => {
  const LANGS = [
    { code: "en", label: "English", voice: "en-NG" },
    { code: "pcm", label: "Pidgin", voice: "en-NG" }, // no Pidgin voice exists; Nigerian English is the closest
    { code: "yo", label: "Yorùbá", voice: "yo" },
    { code: "ig", label: "Igbo", voice: "ig" },
    { code: "ha", label: "Hausa", voice: "ha" },
  ];

  const SAMPLE_REPORT = `SURGICAL PATHOLOGY REPORT
Specimen: Left breast, wide local excision with axillary lymph node sampling.
Diagnosis: Invasive ductal carcinoma, Nottingham Grade 2. Tumour size 1.8 cm.
Margins: Clear. Closest margin 4 mm.
Lymph nodes: 1 of 12 nodes positive for metastatic carcinoma.
Receptor status: ER positive (90%), PR positive (60%), HER2 negative.`;

  const $ = (id) => document.getElementById(id);
  const textEl = $("text");
  const goBtn = $("go");
  let lang = "en";
  let lastLang = "en";

  // Language pills
  const langsEl = $("langs");
  LANGS.forEach((l, i) => {
    const label = document.createElement("label");
    label.className = "lang";
    label.innerHTML = `<input type="radio" name="lang" value="${l.code}" ${i === 0 ? "checked" : ""}><span>${l.label}</span>`;
    label.querySelector("input").addEventListener("change", () => (lang = l.code));
    langsEl.appendChild(label);
  });

  textEl.addEventListener("input", () => {
    $("count").textContent = `${textEl.value.length} / 6000`;
  });
  $("sample").addEventListener("click", () => {
    textEl.value = SAMPLE_REPORT;
    textEl.dispatchEvent(new Event("input"));
    textEl.focus();
  });
  $("clear").addEventListener("click", () => {
    textEl.value = "";
    textEl.dispatchEvent(new Event("input"));
    $("result").hidden = true;
    setStatus("");
    stopSpeaking();
  });
  $("print").addEventListener("click", () => window.print());

  function setStatus(msg, isError) {
    const s = $("status");
    s.hidden = !msg;
    s.textContent = msg || "";
    s.classList.toggle("error", !!isError);
  }

  fetch("/api/status")
    .then((r) => r.json())
    .then((d) => {
      if (d.mode === "demo") {
        const m = $("mode");
        m.hidden = false;
        m.textContent = "Demo mode";
        m.title = "No API key set. Only the sample report works.";
      }
    })
    .catch(() => {});

  goBtn.addEventListener("click", async () => {
    const text = textEl.value.trim();
    if (text.length < 20) {
      setStatus("Please paste a bit more text first (at least a sentence or two).", true);
      return;
    }
    stopSpeaking();
    goBtn.disabled = true;
    $("result").hidden = true;
    setStatus("Reading your report and writing a simple explanation…");
    try {
      const resp = await fetch("/api/explain", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text, lang }),
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      lastLang = lang;
      render(data);
      setStatus("");
      $("result").scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (e) {
      setStatus(e.message || "Network problem. Please check your connection and try again.", true);
    } finally {
      goBtn.disabled = false;
    }
  });

  function render(d) {
    $("summary").textContent = d.summary;
    $("help").textContent = d.when_to_get_help;

    const terms = $("terms");
    terms.replaceChildren();
    (d.key_terms || []).forEach((t) => {
      const dt = document.createElement("dt");
      dt.textContent = t.term;
      const dd = document.createElement("dd");
      dd.textContent = t.meaning;
      terms.append(dt, dd);
    });

    const qs = $("questions");
    qs.replaceChildren();
    (d.questions_for_doctor || []).forEach((q) => {
      const li = document.createElement("li");
      li.textContent = q;
      qs.appendChild(li);
    });

    const low = $("lowconf");
    if (d.language_confidence === "low") {
      low.hidden = false;
      low.textContent =
        "Our quality in this language is still improving. Please have someone who speaks it well check this, and rely on your care team for anything important.";
    } else {
      low.hidden = true;
    }
    $("result").hidden = false;
  }

  // Read aloud (browser speech synthesis: free, works offline on many devices)
  function stopSpeaking() {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    $("speak").textContent = "🔊 Read aloud";
  }
  $("speak").addEventListener("click", () => {
    if (!("speechSynthesis" in window)) {
      setStatus("Read aloud isn't supported on this browser.", true);
      return;
    }
    const synth = window.speechSynthesis;
    if (synth.speaking) {
      stopSpeaking();
      return;
    }
    const parts = [$("summary").textContent];
    $("questions").querySelectorAll("li").forEach((li) => parts.push(li.textContent));
    parts.push($("help").textContent);
    const u = new SpeechSynthesisUtterance(parts.join(". "));
    const cfg = LANGS.find((l) => l.code === lastLang);
    u.lang = cfg.voice;
    const voices = synth.getVoices();
    const match = voices.find((v) => v.lang.toLowerCase().startsWith(cfg.voice.split("-")[0].toLowerCase()));
    if (match) u.voice = match;
    else if (lastLang !== "en" && lastLang !== "pcm") {
      setStatus("Your device has no voice for this language, so the reading may sound wrong.", true);
    }
    u.onend = () => ($("speak").textContent = "🔊 Read aloud");
    $("speak").textContent = "⏹ Stop";
    synth.speak(u);
  });
})();
