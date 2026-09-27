# Exe.io & Exeygo Bypass — Fast, Anti-Ad & Auto Countdown

A lightweight, fully automated userscript to bypass `exe.io`, `exey.io`, and `exeygo.com`. It safely accelerates mandatory wait times, blocks clickjack ads, and navigates steps seamlessly in the background.

[![Install Directly](https://img.shields.io/badge/Install%20with-Userscript%20Manager-blue?style=for-the-badge&logo=tampermonkey)](https://raw.githubusercontent.com/ArvindSaini978/userscripts/main/exe-bypass/exe-bypass.user.js)

---

## ⚡ Installation

### Option 1: Install from Greasy Fork (Recommended)

Get the script directly with automatic update checks:

👉 **[Install from Greasy Fork](https://greasyfork.org/en/scripts/XXXXX)**

---

### Option 2: Direct Install via GitHub Raw

If your userscript manager has link interception enabled:

👉 **[Install exe-bypass.user.js](https://raw.githubusercontent.com/ArvindSaini978/userscripts/main/exe-bypass/exe-bypass.user.js)**

---

### Option 3: Manual URL Install (Fallback)

If direct clicking displays plain text instead of opening your script manager:

1. Copy this raw script URL:  
   ```
   https://raw.githubusercontent.com/ArvindSaini978/userscripts/main/exe-bypass/exe-bypass.user.js
   ```
2. Open your userscript manager dashboard (Tampermonkey, Violentmonkey, etc.).
3. Choose **Install from URL**, paste the link, and confirm.

---

## Features

- **Safe Timer Acceleration:** Compresses the countdown using 650ms ticks (~3.9s total) to clear server validation at the fastest possible speed.
- **Smart Captcha Fallback:** Auto-submits Cloudflare Turnstile, with a 7.5-second timeout that alerts you via the tab title to click manually if it hangs.
- **Dynamic Tab Titles:** Mirrors real-time progress directly to your browser tab (e.g., `⏳ 4s • Auto Bypass | Exe`), letting you monitor it in the background.
- **Background Execution:** Spoofs visibility states to prevent the browser from throttling the timer when the tab is out of focus.
- **Ad & Clickjack Shield:** Neutralizes invisible overlay ads and intercepts known pop-under scripts before they load.

---

## Supported Domains

- `*.exe.io`
- `*.exey.io`
- `*.exeygo.com`

---

## License

This userscript is distributed under the [MIT License](https://github.com/ArvindSaini978/userscripts/blob/main/LICENSE).
