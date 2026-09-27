# Filecrypt Instant Decrypter, Bypass & Auto-Resolver

A high-speed, automated link decrypter for Filecrypt containers. Built with native WebCrypto AES-CBC decryption for Click'n'Load (CNL) containers, multi-worker parallel queuing, early-abort network inspection, and isolated per-task retry logic.

[![Install Directly](https://img.shields.io/badge/Install%20with-Userscript%20Manager-blue?style=for-the-badge&logo=tampermonkey)](https://raw.githubusercontent.com/ArvindSaini978/userscripts/main/filecrypt-decrypter/filecrypt-decrypter.user.js)

---

## ⚡ Installation

### Option 1: Install from Greasy Fork (Recommended)

Get the script directly with automatic update checks:

👉 **[Install from Greasy Fork](https://greasyfork.org/en/scripts/597407)**

---

### Option 2: Direct Install via GitHub Raw

If your userscript manager has link interception enabled:

👉 **[Install filecrypt-decrypter.user.js](https://raw.githubusercontent.com/ArvindSaini978/userscripts/main/filecrypt-decrypter/filecrypt-decrypter.user.js)**

---

### Option 3: Manual URL Install (Fallback)

If direct clicking displays plain text instead of opening your script manager:

1. Copy this raw URL:
   ```text
   https://raw.githubusercontent.com/ArvindSaini978/userscripts/main/filecrypt-decrypter/filecrypt-decrypter.user.js
   ```
2. Open your userscript manager dashboard (Tampermonkey, Violentmonkey, etc.).
3. Choose **Install from URL**, paste the link, and confirm.

---

## 📸 Preview

### Before (Standard Filecrypt)
![Standard Filecrypt UI](https://raw.githubusercontent.com/ArvindSaini978/userscripts/main/filecrypt-decrypter/screenshot-1.png)

### After (With Instant Decrypter & Auto-Resolver)
![Enhanced Decrypted UI](https://raw.githubusercontent.com/ArvindSaini978/userscripts/main/filecrypt-decrypter/screenshot-2.png)

---

## Features

* **Zero-Latency Click'n'Load (CNL) Engine:** Decrypts container packages entirely in-browser using native Web Crypto (`crypto.subtle` AES-CBC), unlocking links instantaneously with zero server requests.
* **4-Worker Multi-Threaded Queue:** Resolves fallback links via 4 parallel asynchronous workers, calibrated with randomized humanized jitter (`200ms–350ms`) to evade Cloudflare rate limits and HTTP 429 throttling.
* **Early-Abort Header Interception:** Intercepts HTTP `Location` headers at `readyState === 2` and aborts connections immediately, eliminating redundant HTML body downloads and reducing network overhead.
* **Isolated Per-Task Retry Pipeline:** Failed or throttled hops trigger an isolated 2-pass auto-retry cycle without blocking the main worker queue or triggering infinite loops.
* **Dynamic Host Grouping & Formatting:** Aggregates links by provider with color-coded tags and one-click bulk export, including native translation for Pixeldrain fast CDN mirrors (`cdn.pixeldrain.eu.cc`).
* **SPA & Cloudflare Resilient:** Features a self-polling DOM observer that initializes automatically once background security challenges or asynchronous table loads complete.

---

## Supported Domains

- `filecrypt.cc`
- `filecrypt.to`
- `filecrypt.co`
- `filecrypt.org`
- `filecrypt.is`

---

## Interface Controls

* **Mode Badge:** Real-time indicator of the script's current state (e.g., `Instant CNL`, `Auto-Retrying`, or `Ready`).
* **Batch Decrypt & Copy:** Select a specific host from the dropdown to decrypt only those links. Once resolved, 1-click copy exports them all (including pre-formatted Pixeldrain CDN links).
* **↻ Retry Failed:** Appears automatically to let you re-queue failed links without resetting your completed progress.
* **Individual Row Actions:** Use **⚡ Decrypt** or **📋 Copy** on specific rows for precision control, or click the main Download pill once it resolves.
* **Row Pinning:** Click anywhere on a row to highlight it for easy visual tracking across large lists.

---

## License

This userscript is distributed under the [MIT License](https://github.com/ArvindSaini978/userscripts/blob/main/LICENSE).
