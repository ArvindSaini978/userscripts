# Userscripts Collection

A curated collection of clean, high-performance, and open-source browser userscripts designed to automate repetitive workflows, bypass artificial friction, and enhance site usability.

---

## Available Scripts

| Script | Version | Description | Install |
| :--- | :---: | :--- | :--- |
| [**Filecrypt Decrypter**](filecrypt-decrypter/) | `v2.0.1` | Instantly decrypts and resolves Filecrypt containers via WebCrypto AES Click'n'Load and a 5-worker parallel queue engine. | [Greasy&nbsp;Fork](https://greasyfork.org/en/scripts/597407) <br> [Direct&nbsp;Raw](https://raw.githubusercontent.com/ArvindSaini978/userscripts/main/filecrypt-decrypter/filecrypt-decrypter.user.js) |
| [**ouo.io / ouo.press Bypass**](ouo-bypass/) | `v1.0.1` | Zero-wait bypass for ouo.io and ouo.press featuring reactive Turnstile activation and instant countdown skipping. |[Greasy&nbsp;Fork](https://greasyfork.org/en/scripts/597471) <br> [Direct&nbsp;Raw](https://raw.githubusercontent.com/ArvindSaini978/userscripts/main/ouo-bypass/ouo-bypass.user.js) |

---

## Installation Guide

To use these scripts, install a compatible userscript manager extension:

- **[Violentmonkey](https://violentmonkey.github.io/)** (Recommended — lightweight, open-source)
- **[Tampermonkey](https://www.tampermonkey.net/)**

### How to Install Any Script

1. **1-Click Install:** Choose **Greasy Fork** or **Direct** in the table above. Your extension will automatically intercept the link and prompt you to install.
2. **Install via URL (Manual Fallback):** If your browser displays the raw script code instead of prompting:
   - Right-click the **Direct** link and select **Copy link address**.
   - Open your userscript manager's dashboard.
   - Click the **`+`** icon, select **Install from URL** (or *New -> From URL*), paste the link, and confirm.

---

## Directory Organization

Each userscript is contained in its own folder following a consistent structure:

```text
userscripts/
├── <script-name>/
│   ├── <script-name>.user.js   # Production-ready source code
│   ├── README.md               # Script-specific documentation and previews
│   └── screenshot-*.png        # Visual assets and previews
├── LICENSE
└── README.md
```
---

## Standards

- **Audit-Friendly:** Scripts are distributed unminified and unobfuscated for transparency.
- **Native APIs:** Leverages modern browser capabilities (`crypto.subtle`) alongside standard userscript APIs (`GM_xmlhttpRequest`, `GM_setClipboard`).
- **Semantic Versioning:** Releases strictly follow [SemVer](https://semver.org/).

---

## License

All scripts in this repository are licensed under the [MIT License](https://github.com/ArvindSaini978/userscripts/blob/main/LICENSE).
