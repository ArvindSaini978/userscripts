# Cuty.io & Cuttty Bypass — Fast, Anti-Ad & Auto Countdown

A precision-timed automated bypass for `cuty.io` and `cuttty.com`. It safely navigates backend anti-bot thresholds and custom JavaScript events while keeping your clicks safe from hidden ad overlays.

[![Install Directly](https://img.shields.io/badge/Install%20with-Userscript%20Manager-blue?style=for-the-badge&logo=tampermonkey)](https://raw.githubusercontent.com/ArvindSaini978/userscripts/main/cuty-bypass/cuty-bypass.user.js)

---

## ⚡ Installation

### Option 1: Install from Greasy Fork (Recommended)

Get the script directly with automatic update checks:

👉 **[Install from Greasy Fork](https://greasyfork.org/en/scripts/XXXXXX)**

---

### Option 2: Direct Install via GitHub Raw

If your userscript manager has link interception enabled:

👉 **[Install cuty-bypass.user.js](https://raw.githubusercontent.com/ArvindSaini978/userscripts/main/cuty-bypass/cuty-bypass.user.js)**

---

### Option 3: Manual URL Install (Fallback)

If direct clicking displays plain text instead of opening your script manager:

1. Copy this raw script URL:  
   ```
   https://raw.githubusercontent.com/ArvindSaini978/userscripts/main/cuty-bypass/cuty-bypass.user.js
   ```
2. Open your userscript manager dashboard (Tampermonkey, Violentmonkey, etc.).
3. Choose **Install from URL**, paste the link, and confirm.

---

## Features

- **Calibrated Acceleration:** Uses 750ms ticks (~6.0s total) to bypass the countdown safely without triggering Cuty's strict server-side resets.
- **Native Event Navigation:** Simulates real `.click()` events to ensure Cuty's required token-generation scripts fire correctly before routing.
- **Smart Captcha Fallback:** Auto-solves Turnstile and visually alerts/scrolls to the widget if manual intervention is needed after 7.5 seconds.
- **Dynamic Tab Titles:** Tracks bypass states directly in the tab title (e.g., `⚡ Verifying • Auto Bypass | Cuty` or `✅ Done! • Auto Bypass | Cuty`).
- **Background Execution:** Overrides sleep events so the countdown finishes seamlessly even when the tab is minimized.
- **Clickjack Shield:** Disables pointer events on hidden ad containers to protect your interactions during the bypass cycle.

---

## Supported Domains

- `*.cuty.io`
- `*.cuttty.com`

---

## License

This userscript is distributed under the [MIT License](https://github.com/ArvindSaini978/userscripts/blob/main/LICENSE).
