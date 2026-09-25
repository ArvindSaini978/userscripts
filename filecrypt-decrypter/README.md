# Filecrypt Instant Decrypter & Auto-Resolver

A high-speed, automated link decrypter for Filecrypt containers. Built with native WebCrypto AES-CBC decryption for Click'n'Load (CNL) containers, multi-worker parallel queuing, early-abort network inspection, and isolated per-task retry logic.

[![Install Directly](https://img.shields.io/badge/Install%20with-Userscript%20Manager-blue?style=for-the-badge&logo=tampermonkey)](https://raw.githubusercontent.com/ArvindSaini978/userscripts/main/filecrypt-decrypter/filecrypt-decrypter.user.js)

---

## ⚡ Installation

### Option 1: 1-Click Install
If your userscript manager has link-interception enabled, click below:

👉 **[Install filecrypt-decrypter.user.js](https://raw.githubusercontent.com/ArvindSaini978/userscripts/main/filecrypt-decrypter/filecrypt-decrypter.user.js)**

---

### Option 2: Install via URL (Recommended if 1-Click Fails)
If clicking opens plain text or fails to prompt an installation dialog:

1. Copy this raw URL:
   ```text
   https://raw.githubusercontent.com/ArvindSaini978/userscripts/main/filecrypt-decrypter/filecrypt-decrypter.user.js
   ```

---

## 📸 Preview

### Before (Standard Filecrypt)
![Standard Filecrypt UI](https://raw.githubusercontent.com/ArvindSaini978/userscripts/main/filecrypt-decrypter/screenshot-1.png)

### After (With Instant Decrypter & Auto-Resolver)
![Enhanced Decrypted UI](https://raw.githubusercontent.com/ArvindSaini978/userscripts/main/filecrypt-decrypter/screenshot-2.png)

---

## Features

- **Instant Click'n'Load (CNL) Decryption:** Decrypts hidden AES-CBC payload packages directly in the browser via `crypto.subtle` without queuing or waiting.
- **High-Speed Queue Engine:** Uses 5 asynchronous parallel workers to process links rapidly when CNL is unavailable.
- **Early-Abort Header Interception:** Detects HTTP `Location:` redirects at `readyState === 2` (Headers Received) and immediately aborts the body download to reduce network bandwidth and response time.
- **Isolated Per-Task Auto-Retries:** Stalled or throttled links receive an isolated 2-pass automatic retry without interfering with other links or creating infinite loops.
- **Smart Automated Host Decryption:** Automatically handles high-priority hosts (like Mega and Pixeldrain) without requiring manual interaction.
- **Direct Clipboard Export:** 1-click batch copy controls for single hosts, including automatic link formatting for Pixeldrain CDN mirrors.

---

## Supported Domains

- `filecrypt.cc`
- `filecrypt.to`
- `filecrypt.co`
- `filecrypt.org`
- `filecrypt.is`

---

## How It Works

| Mode | Trigger Condition | Behavior |
| :--- | :--- | :--- |
| **Instant CNL** | Valid `CNLPOP` / encrypted inputs found | Decrypts container payload instantly via WebCrypto and maps resolved URLs to all rows in milliseconds. |
| **Auto-Resolver** | Total links in container $\le$ 10 | Automatically queues and resolves all links simultaneously. |
| **Queue Resolver** | Total links in container $>$ 10 | Automatically resolves Mega and Pixeldrain mirrors; leaves other hosts accessible via 1-click row triggers. |

---

## Interface Controls

- **⚡ Decrypt:** Triggers decryption for an individual row.
- **📋 Copy:** Copies the resolved URL for a single row to your clipboard.
- **Decrypt Host:** Starts bulk resolution for the host selected in the dropdown.
- **Copy Links:** Copies all resolved URLs for the chosen host, with support for Pixeldrain direct CDN format (`cdn.pixeldrain.eu.cc`).
- **↻ Retry Failed:** Re-queues failed links once automated retry sweeps are exhausted.

---

## License

This userscript is distributed under the [MIT License](https://github.com/ArvindSaini978/userscripts/blob/main/LICENSE).
