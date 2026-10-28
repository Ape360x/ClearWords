// Minimal smoke test. Runs the server in demo mode (no API key) and checks the main behaviours.
delete process.env.ANTHROPIC_API_KEY;
const assert = require("assert");
const app = require("./server");

const server = app.listen(0, async () => {
  const base = `http://localhost:${server.address().port}`;
  const post = (body) =>
    fetch(`${base}/api/explain`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  try {
    const status = await (await fetch(`${base}/api/status`)).json();
    assert.strictEqual(status.mode, "demo");

    for (const lang of ["en", "pcm", "yo", "ig", "ha"]) {
      const r = await post({ text: "Invasive ductal carcinoma, grade 2, margins clear.", lang });
      assert.strictEqual(r.status, 200, `lang ${lang}`);
      const d = await r.json();
      assert.ok(d.summary && d.key_terms.length && d.questions_for_doctor.length && d.when_to_get_help, `fields ${lang}`);
    }

    assert.strictEqual((await post({ text: "short", lang: "en" })).status, 400, "too short");
    assert.strictEqual((await post({ text: "x".repeat(6001), lang: "en" })).status, 400, "too long");
    assert.strictEqual((await post({ text: "a long enough piece of text here", lang: "fr" })).status, 400, "bad lang");

    // Rate limit: earlier requests count toward the 10/min budget, so we should hit 429 soon.
    let limited = false;
    for (let i = 0; i < 12; i++) {
      const r = await post({ text: "Invasive ductal carcinoma, grade 2, margins clear.", lang: "en" });
      if (r.status === 429) { limited = true; break; }
    }
    assert.ok(limited, "rate limit should trigger");

    const html = await (await fetch(`${base}/`)).text();
    assert.ok(html.includes("ClearWords"));
    console.log("All checks passed.");
    server.close();
  } catch (e) {
    console.error("FAILED:", e.message);
    server.close();
    process.exit(1);
  }
});
