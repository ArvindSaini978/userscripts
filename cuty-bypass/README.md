---

#### Cuty.io & Cuttty Bypass — Fast, Anti-Ad & Auto Countdown

A precision-timed automated bypass for `cuty.io` and `cuttty.com`. It safely navigates backend anti-bot thresholds and custom JavaScript events while keeping your clicks safe from hidden ad overlays.

---

### Features

- **Calibrated Acceleration:** Uses 750ms ticks (~6.0s total) to bypass the countdown safely without triggering Cuty's strict server-side resets.
- **Native Event Navigation:** Simulates real `.click()` events to ensure Cuty's required token-generation scripts fire correctly before routing.
- **Smart Captcha Fallback:** Auto-solves Turnstile and visually alerts/scrolls to the widget if manual intervention is needed after 7.5 seconds.
- **Dynamic Tab Titles:** Tracks bypass states directly in the tab title (e.g., `⚡ Verifying • Auto Bypass | Cuty` or `✅ Done! • Auto Bypass | Cuty`).
- **Background Execution:** Overrides sleep events so the countdown finishes seamlessly even when the tab is minimized.
- **Clickjack Shield:** Disables pointer events on hidden ad containers to protect your interactions during the bypass cycle.

---

### Supported Domains

- `*.cuty.io`
- `*.cuttty.com`

---

### About & Maintenance

This is a personal hobby project that I originally built for my own day-to-day use. I decided to publish it on Greasy Fork so other users could benefit from it as well. 

Because it is a personal hobby project, updates will not follow a regular schedule. I will maintain and update it whenever I have free time or when changes affect my own usage.

---

### License

This userscript is distributed under the [MIT License](https://github.com/ArvindSaini978/userscripts/blob/main/LICENSE).
