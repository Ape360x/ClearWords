ClearWords is a free web tool that explains cancer-related medical text in plain language, in English, Nigerian Pidgin, Yoruba, Igbo and Hausa.

The problem: in Nigeria and much of Africa, patients receive pathology reports, scan results and clinic notes written in dense medical English. Many leave the appointment not understanding their own diagnosis. That confusion delays follow-up, increases fear, and makes it harder for families to help. Existing health-literacy tools are almost all English-only.

How it works: a patient or caregiver pastes text from a report and picks a language. ClearWords returns a short plain-language summary, a glossary of the medical terms in the report, a tailored list of questions to ask their doctor, and general advice on when to seek urgent help. A read-aloud button uses the browser's built-in speech synthesis for people who find reading difficult, and results can be printed for the next appointment.

Safety by design: ClearWords never diagnoses, predicts outcomes or recommends treatment. The model is instructed to explain only what is in the pasted text, and a "not medical advice" notice appears throughout. When quality in a language is lower, the app says so and asks the user to have a fluent speaker check it. There are no accounts, no text is stored or logged, and the API key stays on the server.

Technical approach: a lightweight Node/Express backend proxies one LLM call with a strict JSON schema validated server-side, plus input limits and rate limiting. The frontend is plain HTML, CSS and JavaScript, so it loads fast on low bandwidth and older phones. A demo mode works without an API key.

Impact: by turning jargon into a conversation, ClearWords helps patients arrive at appointments informed, ask better questions, and share their diagnosis with family in the language spoken at home.
