# ouo.io & ouo.press Bypass — Direct & Instant

A lightweight, high-speed automated bypass userscript for ouo.io and ouo.press shortlinks. Designed with reactive Cloudflare Turnstile activation, zero-wait countdown skipping on Step 2, and background-tab keep-alive spoofing to prevent browser throttling.

[![Install Directly](https://img.shields.io/badge/Install%20with-Userscript%20Manager-blue?style=for-the-badge&logo=tampermonkey)](https://raw.githubusercontent.com/ArvindSaini978/userscripts/main/ouo-bypass/ouo-bypass.user.js)

---

## ⚡ Installation

### Option 1: Install from Greasy Fork (Recommended)

Get the script directly with automatic update checks:

👉 **[Install from Greasy Fork](https://greasyfork.org/en/scripts/597471)**

---

### Option 2: Direct Install via GitHub Raw

If your userscript manager has link interception enabled:

👉 **[Install ouo-bypass.user.js](https://raw.githubusercontent.com/ArvindSaini978/userscripts/main/ouo-bypass/ouo-bypass.user.js)**

---

### Option 3: Manual URL Install (Fallback)

If direct clicking displays plain text instead of opening your script manager:

1. Copy this raw script URL:  
   ```
   https://raw.githubusercontent.com/ArvindSaini978/userscripts/main/ouo-bypass/ouo-bypass.user.js
   ```
2. Open your userscript manager dashboard (Tampermonkey, Violentmonkey, etc.).
3. Choose **Install from URL**, paste the link, and confirm.

---

## Features

- **Reactive Turnstile Activation:** Triggers verification the instant Cloudflare finishes mounting its challenge container, avoiding deadlocks and artificial idle time.
- **Instant Step 2 Bypass:** Bypasses artificial client-side countdown timers on the destination page, unlocking and submitting the "Get Link" form immediately.
- **Background Tab Keep-Alive:** Spoofs page visibility states (`document.hidden`, `visibilityState`) to stop browsers from throttling or putting unfocused background tabs to sleep.
- **Clean Sandboxing:** Runs entirely with `@grant none`, avoiding invasive privilege requests and third-party dependencies.
- **Non-Intrusive HUD:** Displays a lightweight floating indicator in the top-right corner to keep you informed of current bypass progress and state transitions.

---

## Supported Domains

- `ouo.io`
- `ouo.press`

---

## How It Works

| Step | Page Phase | Bypass Behavior |
| :--- | :--- | :--- |
| **Step 1** | Captcha / Landing Form | Monitors the invisible Cloudflare Turnstile widget; immediately executes the verification flow once the challenge is bound. |
| **Step 2** | Destination Redirect Form | Detects `#form-go`, removes the disabled state from the redirect button, and submits immediately without waiting for the timer to count down. |

---

## License

This userscript is distributed under the [MIT License](https://github.com/ArvindSaini978/userscripts/blob/main/LICENSE).
