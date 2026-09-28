# DramaDay Suite — Shortlink Bypasser, Base64 Decoder & Anti-Ad Shield

A lightweight, zero-wait automation suite designed for **DramaDay.me** and major URL shorteners. It automatically decodes embedded download links directly on the page, bypasses multi-step countdown shortlinks, neutralizes clickjacking popunder overlays, and auto-submits Cloudflare Turnstile verification challenges.

[![Install Directly](https://img.shields.io/badge/Install%20with-Userscript%20Manager-blue?style=for-the-badge&logo=tampermonkey)](https://raw.githubusercontent.com/ArvindSaini978/userscripts/main/dramaday-suite/dramaday-suite.user.js)

---

## ⚡ Installation

### Option 1: Install from Greasy Fork (Recommended)

Get the script directly with automatic update checks:

👉 **[Install from Greasy Fork](https://greasyfork.org/en/scripts/597754)**

---

### Option 2: Direct Install via GitHub Raw

If your userscript manager has link interception enabled:

👉 **[Install dramaday-suite.user.js](https://raw.githubusercontent.com/ArvindSaini978/userscripts/main/dramaday-suite/dramaday-suite.user.js)**

---

### Option 3: Manual URL Install (Fallback)

If direct clicking displays plain text instead of opening your script manager:

1. Copy this raw script URL:  
   ```
   https://raw.githubusercontent.com/ArvindSaini978/userscripts/main/dramaday-suite/dramaday-suite.user.js
   ```
2. Open your userscript manager dashboard (Tampermonkey, Violentmonkey, etc.).
3. Choose **Install from URL**, paste the link, and confirm.

---

## Features

* **Instant Base64 Rewriter:** Decodes embedded destination URLs directly inside DramaDay download tables up to 3 layers deep, placing clean, unobtrusive `✓` indicators without distorting layouts.
* **Zero-Wait Step Skipping:** Automatically clears multi-step landing pages on Exe, Cuty, Ouo, and Riviwi, revealing hidden action buttons and auto-clicking target redirects.
* **Anti-Clickjack & Overlay Shield:** Defuses full-screen invisible clickjack traps (`pointer-events: none`), dummy container layers, and rogue click events.
* **Ad-Network Script Killer:** Neutralizes tracking networks, aggressive popunders, and rogue redirects (`llvpn`, `cleverwebserver`, `abscloud`, `doubleclick`) right at script injection.
* **Safe Host Verification:** Validates target endpoints against trusted lockers and cloud storage providers (Google Drive, Mega.nz, Mediafire, PixelDrain, FileCrypt, etc.) while blocking shortener loops.
* **Turnstile Auto-Submission:** Proactively detects Cloudflare Turnstile / Captcha completion and automatically forwards to the next step with automatic manual fallbacks.
* **Anti-Sleep Background Engine:** Spoofs page visibility (`document.hidden`, `visibilityState`) so timers and bypass triggers proceed uninterrupted in background tabs.
* **Real-Time HUD & Title Tracker:** Displays compact floating status badges and live countdown updates in tab titles.

---

## Supported Domains

| Platform | Supported Domains / Mirrors | Action Taken |
| :--- | :--- | :--- |
| **DramaDay** | `dramaday.me` | Automatic Base64 parameter and query string decoding |
| **Exe.io Network** | `exe.io`, `exey.io`, `exeygo.com` | Timer acceleration, Turnstile submission, and `Get Link` skip |
| **Cuty.io Network** | `cuty.io`, `cuttty.com` | Multi-step form forward, anti-ad overlay blocker, and timer skip |
| **Ouo Network** | `ouo.io`, `ouo.press` | Instant `form-go` bypass and reactive Turnstile solving |
| **Riviwi** | `riviwi.com` | Instant CSS button reveal, timer zeroing, and automated multi-step clicks |

---

## License

This userscript is distributed under the [MIT License](https://github.com/ArvindSaini978/userscripts/blob/main/LICENSE).
