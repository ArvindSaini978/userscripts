# Direct ouo.io & ouo.press Instant Fast Bypass

A lightweight, high-speed automated bypass userscript for ouo.io and ouo.press shortlinks. Designed with reactive Cloudflare Turnstile activation, zero-wait countdown skipping on Step 2, and background-tab keep-alive spoofing to prevent browser throttling.

[![Install Directly](https://img.shields.io/badge/Install%20with-Userscript%20Manager-blue?style=for-the-badge&logo=tampermonkey)](https://raw.githubusercontent.com/ArvindSaini978/userscripts/main/ouo-bypass/ouo-bypass.user.js)

---

## ⚡ Installation

### Option 1: 1-Click Install
If your userscript manager has link interception enabled, click below:

👉 **[Install ouo-bypass.user.js](https://raw.githubusercontent.com/ArvindSaini978/userscripts/main/ouo-bypass/ouo-bypass.user.js)**

---

### Option 2: Install via URL (Recommended if 1-Click Fails)

If clicking opens plain text or fails to open an installation dialog:

1. Copy this raw script URL:  
   ```
   https://raw.githubusercontent.com/ArvindSaini978/userscripts/main/ouo-bypass/ouo-bypass.user.js
   ```
3. Open your userscript manager dashboard (Tampermonkey, Violentmonkey, etc.).
4. Choose **Install from URL**, paste the link, and confirm.

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
