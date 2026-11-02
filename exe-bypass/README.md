---

#### Exe.io & Exeygo Bypass — Fast, Anti-Ad & Auto Countdown
A lightweight, fully automated userscript to bypass `exe.io`, `exey.io`, and `exeygo.com`. It safely accelerates mandatory wait times, blocks clickjack ads, and navigates steps seamlessly in the background.

> **Important Usage Note:** Please process or open only **1 link at a time**. Opening multiple `exe.io` or `exeygo` tabs simultaneously will trigger session conflicts and send you into Cloudflare anti-bot loops.

---

### Features

* **Safe Timer Acceleration:** Compresses the countdown using 650ms ticks (~3.9s total) to clear server validation at the fastest possible speed.
* **Smart Captcha Fallback:** Auto-submits Cloudflare Turnstile, with a 7.5-second timeout that alerts you via the tab title to click manually if it hangs.
* **Dynamic Tab Titles:** Mirrors real-time progress directly to your browser tab (e.g., `⏳ 4s • Auto Bypass | Exe`), letting you monitor it in the background.
* **Background Execution:** Spoofs visibility states to prevent the browser from throttling the timer when the tab is out of focus.
* **Ad & Clickjack Shield:** Neutralizes invisible overlay ads and intercepts known pop-under scripts before they load.

---

### Supported Domains

* `*.exe.io`
* `*.exey.io`
* `*.exeygo.com`

---

### About & Maintenance

This is a personal hobby project that I originally built for my own day-to-day use. I decided to publish it on Greasy Fork so other users could benefit from it as well. 

Because it is a personal hobby project, updates will not follow a regular schedule. I will maintain and update it whenever I have free time or when changes affect my own usage.

---

### License

This userscript is released under the [MIT License](https://github.com/ArvindSaini978/userscripts/blob/main/LICENSE).
