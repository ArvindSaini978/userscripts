---

#### ouo.io & ouo.press Bypass — Direct & Instant

A lightweight, high-speed automated bypass userscript for ouo.io and ouo.press shortlinks. Designed with reactive Cloudflare Turnstile activation, zero-wait countdown skipping on Step 2, and background-tab keep-alive spoofing to prevent browser throttling.

---

### Features

- **Reactive Turnstile Activation:** Triggers verification the instant Cloudflare finishes mounting its challenge container, avoiding deadlocks and artificial idle time.
- **Instant Step 2 Bypass:** Bypasses artificial client-side countdown timers on the destination page, unlocking and submitting the "Get Link" form immediately.
- **Background Tab Keep-Alive:** Spoofs page visibility states (`document.hidden`, `visibilityState`) to stop browsers from throttling or putting unfocused background tabs to sleep.
- **Clean Sandboxing:** Runs entirely with `@grant none`, avoiding invasive privilege requests and third-party dependencies.
- **Non-Intrusive HUD:** Displays a lightweight floating indicator in the top-right corner to keep you informed of current bypass progress and state transitions.

---

### Supported Domains

- `ouo.io`
- `ouo.press`

---

### About & Maintenance

This is a personal hobby project that I originally built for my own day-to-day use. I decided to publish it on Greasy Fork so other users could benefit from it as well. 

Because it is a personal hobby project, updates will not follow a regular schedule. I will maintain and update it whenever I have free time or when changes affect my own usage.

---

### License

This userscript is distributed under the [MIT License](https://github.com/ArvindSaini978/userscripts/blob/main/LICENSE).
