// ==UserScript==
// @name         DramaDay Suite — Shortlink Bypasser, Base64 Decoder & Anti-Ad Shield
// @namespace    https://github.com/ArvindSaini978/userscripts/
// @version      1.0.0
// @description  Fast automated bypasser for DramaDay, Exe.io, Exey, Cuty.io, Ouo.io, and Riviwi. Skips countdown timers, neutralizes ad popups/clickjacks, solves Turnstile, and decodes Base64 download links instantly.
// @author       ArvindSaini978
// @match        *://*.dramaday.me/*
// @match        *://dramaday.me/*
// @match        *://*.exe.io/*
// @match        *://*.exey.io/*
// @match        *://*.exeygo.com/*
// @match        *://*.cuty.io/*
// @match        *://*.cuttty.com/*
// @match        *://*.ouo.io/*
// @match        *://*.ouo.press/*
// @match        *://*.riviwi.com/*
// @match        *://riviwi.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

/*
 * MIT License
 *
 * Copyright (c) 2026 Arvind Saini
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const host = window.location.hostname;

/* =========================================================================
   1. DRAMADAY.ME — BASE64 REWRITER (Optimized with Tick Marks)
   ========================================================================= */
if (host.includes('dramaday.me')) {
    (function() {
        'use strict';

        const URL_PATTERN = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;

        function tryDecode(encodedStr) {
            if (!encodedStr || typeof encodedStr !== 'string') return null;
            let str = encodedStr.trim();
            for (let i = 0; i < 3; i++) {
                try {
                    let cleaned = decodeURIComponent(str).trim().replace(/-/g, '+').replace(/_/g, '/');
                    while (cleaned.length % 4 !== 0) cleaned += '=';

                    const decoded = atob(cleaned);
                    if (URL_PATTERN.test(decoded)) return decoded;
                    str = decoded;
                } catch (e) {
                    break;
                }
            }
            return null;
        }

        function extractCleanUrl(urlStr) {
            if (!urlStr) return null;
            try {
                const parsed = new URL(urlStr, window.location.href);

                for (const param of ['url', 'link', 'dest', 'target', 'go', 'dl']) {
                    const val = parsed.searchParams.get(param);
                    if (val) {
                        const decoded = tryDecode(val);
                        if (decoded) return decoded;
                    }
                }

                const candidatePool = `${parsed.search} ${parsed.pathname} ${parsed.hash}`;
                const matches = candidatePool.match(/[A-Za-z0-9+/=_-]{16,}/g);
                if (matches) {
                    for (const match of matches) {
                        const decoded = tryDecode(match);
                        if (decoded) return decoded;
                    }
                }
            } catch (e) {}
            return null;
        }

        function rewriteAnchors() {
            const anchors = document.querySelectorAll('a:not([data-b64-decoded])');
            anchors.forEach(a => {
                const href = a.getAttribute('href');
                if (!href) return;

                const cleanUrl = extractCleanUrl(href);
                if (cleanUrl) {
                    a.href = cleanUrl;
                    a.dataset.b64Decoded = "true";
                    a.title = `Direct Target: ${cleanUrl}`;

                    const badge = document.createElement('span');
                    badge.textContent = ' ✓';
                    badge.style.cssText = 'color:#4ade80;font-weight:bold;font-size:0.85em;margin-left:3px;';
                    badge.title = 'Decoded direct link';
                    a.appendChild(badge);
                }
            });
        }

        const runRewrite = () => {
            rewriteAnchors();
            let debounceTimer = null;
            const observer = new MutationObserver(() => {
                if (debounceTimer) clearTimeout(debounceTimer);
                debounceTimer = setTimeout(rewriteAnchors, 200);
            });

            if (document.body) {
                observer.observe(document.body, { childList: true, subtree: true });
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', runRewrite);
        } else {
            runRewrite();
        }

        window.addEventListener('click', (e) => {
            const a = e.target.closest('a');
            if (a && a.href && !a.dataset.b64Decoded) {
                const cleanUrl = extractCleanUrl(a.href);
                if (cleanUrl) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    a.href = cleanUrl;
                    a.dataset.b64Decoded = "true";
                    window.open(cleanUrl, a.target === '_blank' ? '_blank' : '_self');
                }
            }
        }, true);
    })();
}

/* =========================================================================
   2. CUTY.IO & CUTTTY.COM — PRODUCTION BLOCK (Host Safe-List & Anti-Ad)
   ========================================================================= */
if (host.includes('cuty.io') || host.includes('cuttty.com')) {
    (() => {
        'use strict';

        if (window.top !== window.self) return;

        // --- 1. SCRIPT KILLER (Neutralizes popunder & tracking ad networks) ---
        const AD_DOMAINS = ['llvpn.com', 'cleverwebserver.com', 'abscloud.org', 'doubleclick.net'];
        const originalCreateElement = document.createElement;

        document.createElement = function(tagName, options) {
            const el = originalCreateElement.call(document, tagName, options);
            if (tagName && tagName.toLowerCase() === 'script') {
                const originalSetAttribute = el.setAttribute;
                el.setAttribute = function(name, val) {
                    if (name === 'src' && AD_DOMAINS.some(d => String(val).includes(d))) {
                        return;
                    }
                    return originalSetAttribute.apply(this, arguments);
                };
                Object.defineProperty(el, 'src', {
                    set(url) {
                        if (AD_DOMAINS.some(d => String(url).includes(d))) return;
                        el.setAttribute('src', url);
                    },
                    get() {
                        return el.getAttribute('src') || '';
                    },
                    configurable: true
                });
            }
            return el;
        };

        // --- 2. SAFE TIMER ACCELERATOR (750ms ticks clear backend validation bounds) ---
        const originalSetInterval = window.setInterval;
        window.setInterval = function(callback, delay, ...args) {
            if (delay === 1000 || (delay >= 950 && delay <= 1050)) {
                delay = 750;
            }
            return originalSetInterval(callback, delay, ...args);
        };

        // --- 3. CLICK-THROUGH SHIELD (Neutralizes full-page clickjack traps) ---
        const clickjackShield = document.createElement('style');
        clickjackShield.id = 'anti-clickjack-shield';
        clickjackShield.textContent = `
            html > div:not(#cuty-bypass-badge),
            html > iframe,
            div[style*="2147483647"]:not(#cuty-bypass-badge),
            .ad-element,
            .aspace,
            [id^="ad-"],
            [class*="ad-container"] {
                pointer-events: none !important;
                opacity: 0 !important;
                background: transparent !important;
            }

            body,
            body *:not(.ad-element):not([class*="ad-container"]):not(.aspace),
            #cuty-bypass-badge {
                pointer-events: auto !important;
            }
        `;
        (document.head || document.documentElement).appendChild(clickjackShield);

        const styleObserver = new MutationObserver(() => {
            if (!document.getElementById('anti-clickjack-shield')) {
                (document.head || document.documentElement).appendChild(clickjackShield);
            }
        });
        styleObserver.observe(document.documentElement, { childList: true, subtree: true });

        // --- 4. ANTI-SLEEP / BACKGROUND EXECUTION ---
        try {
            Object.defineProperty(document, 'hidden', { get: () => false, configurable: true });
            Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true });
            Object.defineProperty(document, 'webkitVisibilityState', { get: () => 'visible', configurable: true });
            window.addEventListener('visibilitychange', (e) => e.stopImmediatePropagation(), true);
            window.addEventListener('webkitvisibilitychange', (e) => e.stopImmediatePropagation(), true);
            window.addEventListener('blur', (e) => e.stopImmediatePropagation(), true);
        } catch (e) {}

        // --- 5. ANTI-POPUP DEFUSERS ---
        window.open = function() { return null; };
        window.canRunAds = true;
        window.isAdBlockActive = false;
        window.adblock = false;
        window.adBlockerDetected = false;

        // Expanded filehost pattern and ad-network blacklist guard
        const TARGET_PATTERN = /(pixeldrain|filecrypt|dramaday|mega\.nz|drive\.google|mediafire|1fichier|krakenfiles|gofile|qiwi|rapidgator|ddownload|katfile|nitroflare|turbobit)/i;
        const AD_PATTERN = /(cuty\.io|cuttty|exe\.io|exey|adsterra|doubleclick|monetag|hilltopads)/i;

        try {
            const params = new URLSearchParams(window.location.search);
            if (params.has('url')) {
                let cleaned = decodeURIComponent(params.get('url')).trim().replace(/-/g, '+').replace(/_/g, '/');
                while (cleaned.length % 4 !== 0) cleaned += '=';
                const decoded = atob(cleaned);
                if (TARGET_PATTERN.test(decoded) && !AD_PATTERN.test(decoded)) {
                    window.location.replace(decoded);
                    return;
                }
            }
        } catch (e) {}

        // --- 6. STATUS HUD & TAB TITLE COMPONENT ---
        function setTabTitle(statusBadge) {
            document.title = `${statusBadge} • Auto Bypass | Cuty`;
        }

        function createHUD() {
            if (document.getElementById('cuty-bypass-badge')) return;
            const targetContainer = document.body || document.documentElement;
            if (!targetContainer) return;

            const hud = document.createElement('div');
            hud.id = 'cuty-bypass-badge';
            hud.innerHTML = `
                <div style="display:flex;align-items:center;gap:10px;">
                    <span id="cuty-dot" style="width:10px;height:10px;border-radius:50%;background:#22c55e;box-shadow:0 0 10px #22c55e;"></span>
                    <span id="cuty-text">Detecting Step...</span>
                </div>
            `;
            hud.style.cssText = `
                position: fixed !important;
                top: 24px !important;
                right: 24px !important;
                background: rgba(30, 41, 59, 0.88) !important;
                backdrop-filter: blur(10px) !important;
                -webkit-backdrop-filter: blur(10px) !important;
                color: #f1f5f9 !important;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
                font-size: 15px !important;
                font-weight: 600 !important;
                padding: 12px 20px !important;
                border-radius: 12px !important;
                border: 1px solid rgba(255, 255, 255, 0.16) !important;
                box-shadow: 0 12px 28px -4px rgba(0, 0, 0, 0.35), 0 8px 12px -6px rgba(0, 0, 0, 0.2) !important;
                z-index: 2147483647 !important;
                letter-spacing: 0.35px !important;
                pointer-events: none !important;
                transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
            `;
            targetContainer.appendChild(hud);
        }

        function updateHUD(hudMsg, shortTabMsg, color) {
            createHUD();
            const txt = document.getElementById('cuty-text');
            const dot = document.getElementById('cuty-dot');
            if (txt) txt.textContent = hudMsg;
            if (dot && color) {
                dot.style.background = color;
                dot.style.boxShadow = `0 0 10px ${color}`;
            }
            if (shortTabMsg) {
                setTabTitle(shortTabMsg);
            }
        }

        document.addEventListener('click', function(e) {
            const target = e.target;
            const isLegit = target.tagName === 'BUTTON' ||
                            target.tagName === 'INPUT' ||
                            target.closest('form') ||
                            target.closest('.cf-turnstile') ||
                            target.closest('#cuty-bypass-badge');
            if (!isLegit) {
                e.stopPropagation();
            }
        }, true);

        function isElementVisible(el) {
            return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
        }

        // --- 7. AUTOMATION ENGINE ---
        document.addEventListener('DOMContentLoaded', () => {
            createHUD();
            let lastActionTime = 0;
            let turnstileStartTime = null;

            const loop = setInterval(() => {
                createHUD();

                if (!window.location.hostname.includes('cuty.io') && !window.location.hostname.includes('cuttty.com')) {
                    clearInterval(loop);
                    updateHUD("Target Reached!", "✅ Done!", "#22c55e");
                    return;
                }

                const now = Date.now();

                // Step 2: Cloudflare Turnstile / "I am not a robot"
                const cfToken = document.querySelector('[name="cf-turnstile-response"]');
                const robotBtn = document.querySelector('#submit-button, button[type="submit"]');
                const turnstileBox = document.querySelector('.cf-turnstile, [name="cf-turnstile-response"]');

                if (cfToken && robotBtn && robotBtn.textContent.toLowerCase().includes('robot')) {
                    if (!turnstileStartTime) turnstileStartTime = now;

                    if (cfToken.value && !robotBtn.dataset.triggered) {
                        robotBtn.dataset.triggered = 'true';
                        updateHUD("Turnstile Solved! Proceeding...", "⚡ Verifying", "#22c55e");
                        robotBtn.click();
                        lastActionTime = now;
                        return;
                    } else if (!cfToken.value) {
                        const elapsed = now - turnstileStartTime;
                        if (elapsed > 7500) {
                            updateHUD("Please click the Captcha manually!", "⚠️ Solve Captcha", "#ef4444");
                            if (turnstileBox && !turnstileBox.dataset.scrolled) {
                                turnstileBox.dataset.scrolled = 'true';
                                turnstileBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                        } else {
                            updateHUD("Waiting for Cloudflare Turnstile...", "🛡️ Captcha", "#f59e0b");
                        }
                        return;
                    }
                }

                if (now - lastActionTime < 600) return;

                // Step 1: "Continue with Ads" Form Bypass
                const freeSubmitBtn = document.querySelector('#free-submit-form #submit-button');
                if (freeSubmitBtn && !freeSubmitBtn.dataset.triggered) {
                    freeSubmitBtn.dataset.triggered = 'true';
                    updateHUD("Bypassing Initial Step...", "⚡ Step 1", "#38bdf8");
                    freeSubmitBtn.click();
                    lastActionTime = now;
                    return;
                }

                // Step 3: "Go ->" Final Redirect Button
                const submitBtn = document.getElementById('submit-button');
                const submitForm = document.getElementById('submit-form');
                if (submitForm && submitBtn) {
                    const btnText = submitBtn.textContent.trim().toLowerCase();
                    const isReady = !submitBtn.disabled &&
                                    submitBtn.getAttribute('aria-disabled') !== 'true' &&
                                    !btnText.includes('wait') &&
                                    (btnText.includes('go') || btnText.includes('->'));

                    if (isReady && !submitBtn.dataset.triggered) {
                        submitBtn.dataset.triggered = 'true';
                        clearInterval(loop);
                        updateHUD("Clicking 'Go'...", "🚀 Redirecting", "#22c55e");
                        submitBtn.click();
                        return;
                    }
                }

                // Step 3: Countdown Display Status
                const timerSpan = document.getElementById('timer');
                if (timerSpan && isElementVisible(timerSpan)) {
                    const rawSeconds = timerSpan.textContent.trim().replace(/\D+/g, '');
                    if (rawSeconds && rawSeconds !== '0') {
                        updateHUD(`Waiting for timer: ${rawSeconds}s`, `⏳ ${rawSeconds}s`, "#f59e0b");
                    } else if (rawSeconds === '0') {
                        updateHUD("Unlocking link...", "⚡ Unlocking", "#38bdf8");
                    }
                }
            }, 200);
        });
    })();
}

/* =========================================================================
   3. EXE.IO, EXEY.IO, EXEYGO.COM — PRODUCTION BLOCK (Host Safe-List & Anti-Ad)
   ========================================================================= */
if (host.includes('exe.io') || host.includes('exey.io') || host.includes('exeygo.com')) {
    (() => {
        'use strict';

        if (window.top !== window.self) return;

        // --- 1. SCRIPT KILLER (Neutralizes ad networks at the source) ---
        const AD_DOMAINS = ['llvpn.com', 'cleverwebserver.com', 'abscloud.org', 'doubleclick.net'];
        const originalCreateElement = document.createElement;

        document.createElement = function(tagName, options) {
            const el = originalCreateElement.call(document, tagName, options);
            if (tagName && tagName.toLowerCase() === 'script') {
                const originalSetAttribute = el.setAttribute;
                el.setAttribute = function(name, val) {
                    if (name === 'src' && AD_DOMAINS.some(d => String(val).includes(d))) {
                        return;
                    }
                    return originalSetAttribute.apply(this, arguments);
                };
                Object.defineProperty(el, 'src', {
                    set(url) {
                        if (AD_DOMAINS.some(d => String(url).includes(d))) return;
                        el.setAttribute('src', url);
                    },
                    get() {
                        return el.getAttribute('src') || '';
                    },
                    configurable: true
                });
            }
            return el;
        };

        // --- 2. SAFE TIMER ACCELERATOR (Accelerates countdown while passing token checks) ---
        const originalSetInterval = window.setInterval;
        window.setInterval = function(callback, delay, ...args) {
            if (delay === 1000 || (delay >= 950 && delay <= 1050)) {
                delay = 650;
            }
            return originalSetInterval(callback, delay, ...args);
        };

        // --- 3. CLICK-THROUGH SHIELD (Stops overlay ad clicks across all steps) ---
        const clickjackShield = document.createElement('style');
        clickjackShield.id = 'anti-clickjack-shield';
        clickjackShield.textContent = `
            html > div:not(#exe-bypass-badge),
            html > iframe,
            div[style*="2147483647"]:not(#exe-bypass-badge),
            .ad-element,
            [id^="ad-"],
            [class*="ad-container"],
            [class*="clever-core"] {
                pointer-events: none !important;
                opacity: 0 !important;
                background: transparent !important;
            }

            body,
            body *:not(.ad-element):not([class*="ad-container"]):not([class*="clever-core"]),
            #exe-bypass-badge {
                pointer-events: auto !important;
            }
        `;
        (document.head || document.documentElement).appendChild(clickjackShield);

        const styleObserver = new MutationObserver(() => {
            if (!document.getElementById('anti-clickjack-shield')) {
                (document.head || document.documentElement).appendChild(clickjackShield);
            }
        });
        styleObserver.observe(document.documentElement, { childList: true, subtree: true });

        // --- 4. ANTI-SLEEP / BACKGROUND EXECUTION ---
        try {
            Object.defineProperty(document, 'hidden', { get: () => false, configurable: true });
            Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true });
            Object.defineProperty(document, 'webkitVisibilityState', { get: () => 'visible', configurable: true });
            window.addEventListener('visibilitychange', (e) => e.stopImmediatePropagation(), true);
            window.addEventListener('webkitvisibilitychange', (e) => e.stopImmediatePropagation(), true);
            window.addEventListener('blur', (e) => e.stopImmediatePropagation(), true);
        } catch (e) {}

        // --- 5. ANTI-POPUP & HISTORY HIJACK DEFUSERS ---
        window.open = function() { return null; };
        window.canRunAds = true;
        window.isAdBlockActive = false;
        window.adblock = false;
        window.adBlockerDetected = false;
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.loaded = true;

        const originalPushState = history.pushState;
        history.pushState = function(state, title, url) {
            if (url && String(url).includes('justkoalas.com')) return;
            return originalPushState.apply(this, arguments);
        };

        // Expanded filehost pattern and ad-network blacklist guard
        const TARGET_PATTERN = /(pixeldrain|filecrypt|dramaday|mega\.nz|drive\.google|mediafire|1fichier|krakenfiles|gofile|qiwi|rapidgator|ddownload|katfile|nitroflare|turbobit)/i;
        const AD_PATTERN = /(exe\.io|exey\.io|exeygo|cuty\.io|cuttty|adsterra|doubleclick|monetag|hilltopads)/i;

        try {
            const params = new URLSearchParams(window.location.search);
            if (params.has('url')) {
                let cleaned = decodeURIComponent(params.get('url')).trim().replace(/-/g, '+').replace(/_/g, '/');
                while (cleaned.length % 4 !== 0) cleaned += '=';
                const decoded = atob(cleaned);
                if (TARGET_PATTERN.test(decoded) && !AD_PATTERN.test(decoded)) {
                    window.location.replace(decoded);
                    return;
                }
            }
        } catch (e) {}

        // --- 6. STATUS HUD & TAB TITLE COMPONENT ---
        function setTabTitle(shortStatus) {
            document.title = `${shortStatus} • Auto Bypass | Exe`;
        }

        function createHUD() {
            if (document.getElementById('exe-bypass-badge')) return;
            const targetContainer = document.body || document.documentElement;
            if (!targetContainer) return;

            const hud = document.createElement('div');
            hud.id = 'exe-bypass-badge';
            hud.innerHTML = `
                <div style="display:flex;align-items:center;gap:10px;">
                    <span id="exe-dot" style="width:10px;height:10px;border-radius:50%;background:#22c55e;box-shadow:0 0 10px #22c55e;"></span>
                    <span id="exe-text">Detecting Step...</span>
                </div>
            `;
            hud.style.cssText = `
                position: fixed !important;
                top: 24px !important;
                right: 24px !important;
                background: rgba(30, 41, 59, 0.88) !important;
                backdrop-filter: blur(10px) !important;
                -webkit-backdrop-filter: blur(10px) !important;
                color: #f1f5f9 !important;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
                font-size: 15px !important;
                font-weight: 600 !important;
                padding: 12px 20px !important;
                border-radius: 12px !important;
                border: 1px solid rgba(255, 255, 255, 0.16) !important;
                box-shadow: 0 12px 28px -4px rgba(0, 0, 0, 0.35), 0 8px 12px -6px rgba(0, 0, 0, 0.2) !important;
                z-index: 2147483647 !important;
                letter-spacing: 0.35px !important;
                pointer-events: none !important;
                transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
            `;
            targetContainer.appendChild(hud);
        }

        function updateHUD(hudMsg, shortTabMsg, color) {
            createHUD();
            const txt = document.getElementById('exe-text');
            const dot = document.getElementById('exe-dot');
            if (txt) txt.textContent = hudMsg;
            if (dot && color) {
                dot.style.background = color;
                dot.style.boxShadow = `0 0 10px ${color}`;
            }
            if (shortTabMsg) {
                setTabTitle(shortTabMsg);
            }
        }

        // Rogue click interceptor
        document.addEventListener('click', function(e) {
            const target = e.target;
            const isLegit = target.tagName === 'BUTTON' ||
                            target.tagName === 'INPUT' ||
                            target.closest('form') ||
                            target.closest('.cf-turnstile') ||
                            target.closest('#exe-bypass-badge');
            if (!isLegit) {
                e.stopPropagation();
            }
        }, true);

        function isElementVisible(el) {
            return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
        }

        function findMatchingElements(regex) {
            const all = Array.from(document.querySelectorAll('a, button, input, div, span'));
            return all.filter(el => {
                if (!isElementVisible(el)) return false;
                return regex.test((el.innerText || el.value || '').trim());
            });
        }

        // --- 7. AUTOMATION ENGINE ---
        document.addEventListener('DOMContentLoaded', () => {
            createHUD();
            let lastActionTime = 0;
            let turnstileStartTime = null;

            const loop = setInterval(() => {
                createHUD();

                if (!window.location.hostname.includes('exe.io') && !window.location.hostname.includes('exey.io') && !window.location.hostname.includes('exeygo.com')) {
                    clearInterval(loop);
                    updateHUD("Target Reached!", "✅ Done!", "#22c55e");
                    return;
                }

                const now = Date.now();

                // Step 2: Captcha / Cloudflare Turnstile Check
                const captchaForm = document.getElementById('link-view');
                const cfToken = document.querySelector('[name="cf-turnstile-response"]');
                const turnstileBox = document.querySelector('.cf-turnstile');

                if (captchaForm && cfToken) {
                    if (!turnstileStartTime) turnstileStartTime = now;

                    if (cfToken.value && !captchaForm.dataset.triggered) {
                        captchaForm.dataset.triggered = 'true';
                        updateHUD("Turnstile Solved! Instant Forward...", "⚡ Verifying", "#22c55e");
                        HTMLFormElement.prototype.submit.call(captchaForm);
                        lastActionTime = now;
                        return;
                    } else if (!cfToken.value) {
                        const elapsed = now - turnstileStartTime;
                        if (elapsed > 7500) {
                            updateHUD("Please click the Captcha manually!", "⚠️ Solve Captcha", "#ef4444");
                            if (turnstileBox && !turnstileBox.dataset.scrolled) {
                                turnstileBox.dataset.scrolled = 'true';
                                turnstileBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                        } else {
                            updateHUD("Waiting for Cloudflare Turnstile...", "🛡️ Captcha", "#f59e0b");
                        }
                        return;
                    }
                }

                if (now - lastActionTime < 500) return;

                // Step 1: Initial Exe.io Bypass
                const beforeCaptchaForm = document.getElementById('before-captcha');
                if (beforeCaptchaForm) {
                    if (!beforeCaptchaForm.dataset.triggered) {
                        beforeCaptchaForm.dataset.triggered = 'true';
                        updateHUD("Forcing Initial Step...", "⚡ Step 1", "#38bdf8");
                        HTMLFormElement.prototype.submit.call(beforeCaptchaForm);
                    }
                    lastActionTime = now;
                    return;
                }

                // Step 3: Natural countdown wait and automatic link clicking
                const getLinkMatches = findMatchingElements(/^get link$/i);
                if (getLinkMatches.length > 0) {
                    const getLink = getLinkMatches[getLinkMatches.length - 1];
                    const href = getLink.getAttribute('href');
                    if (href && TARGET_PATTERN.test(href) && !AD_PATTERN.test(href)) {
                        clearInterval(loop);
                        updateHUD("Redirecting...", "🚀 Redirecting", "#22c55e");
                        window.location.replace(href);
                        return;
                    }
                    updateHUD("Clicking 'Get Link'...", "🚀 Redirecting", "#38bdf8");
                    getLink.click();
                    lastActionTime = now;
                    return;
                }

                // Step 3 Timer Display Status
                const timerSpan = document.getElementById('timer');
                if (timerSpan && isElementVisible(timerSpan)) {
                    const rawSeconds = timerSpan.textContent.trim().replace(/\D+/g, '');
                    if (rawSeconds && rawSeconds !== '0') {
                        updateHUD(`Waiting for timer: ${rawSeconds}s`, `⏳ ${rawSeconds}s`, "#f59e0b");
                    } else if (rawSeconds === '0') {
                        updateHUD("Finalizing Link...", "⚡ Unlocking", "#38bdf8");
                    }
                }

                // Fallback continue buttons
                const continueMatches = findMatchingElements(/^continue$|click here to continue/i);
                if (continueMatches.length > 0) {
                    const cont = continueMatches[continueMatches.length - 1];
                    if (!cont.disabled && cont.getAttribute('aria-disabled') !== 'true') {
                        const parentForm = cont.closest('form');
                        if (parentForm) {
                            updateHUD("Submitting 'Continue' Form...", "⚡ Step 1", "#38bdf8");
                            HTMLFormElement.prototype.submit.call(parentForm);
                        } else {
                            updateHUD("Clicking 'Continue'...", "⚡ Step 1", "#38bdf8");
                            cont.click();
                        }
                        lastActionTime = now;
                        return;
                    }
                }
            }, 200);
        });
    })();
}

/* =========================================================================
   4. OUO.IO & OUO.PRESS — EXACT PRODUCTION BLOCK
   ========================================================================= */
if (host.includes('ouo.io') || host.includes('ouo.press')) {
    (() => {
        'use strict';
        if (window.top !== window.self) return;

        // 1. Maintain background execution & bypass browser sleep/throttling
        try {
            Object.defineProperty(document, 'hidden', { get: () => false, configurable: true });
            Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true });
            Object.defineProperty(document, 'webkitVisibilityState', { get: () => 'visible', configurable: true });

            window.addEventListener('visibilitychange', (e) => e.stopImmediatePropagation(), true);
            window.addEventListener('webkitvisibilitychange', (e) => e.stopImmediatePropagation(), true);
        } catch (e) {}

        // 2. Status HUD
        function createHUD() {
            if (document.getElementById('ouo-bypass-badge')) return;

            const hud = document.createElement('div');
            hud.id = 'ouo-bypass-badge';
            hud.innerHTML = `
                <div style="display:flex;align-items:center;gap:10px;">
                    <span id="ouo-dot" style="width:10px;height:10px;border-radius:50%;background:#22c55e;box-shadow:0 0 10px #22c55e;"></span>
                    <span id="ouo-text">Detecting Step...</span>
                </div>
            `;
            hud.style.cssText = `
                position: fixed !important;
                top: 24px !important;
                right: 24px !important;
                background: rgba(30, 41, 59, 0.88) !important;
                backdrop-filter: blur(10px) !important;
                -webkit-backdrop-filter: blur(10px) !important;
                color: #f1f5f9 !important;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
                font-size: 15px !important;
                font-weight: 600 !important;
                padding: 12px 20px !important;
                border-radius: 12px !important;
                border: 1px solid rgba(255, 255, 255, 0.16) !important;
                box-shadow: 0 12px 28px -4px rgba(0, 0, 0, 0.35), 0 8px 12px -6px rgba(0, 0, 0, 0.2) !important;
                z-index: 2147483647 !important;
                letter-spacing: 0.35px !important;
                pointer-events: none !important;
                transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
            `;
            (document.body || document.documentElement).appendChild(hud);
        }

        function updateHUD(msg, color) {
            const txt = document.getElementById('ouo-text');
            const dot = document.getElementById('ouo-dot');
            if (txt) txt.textContent = msg;
            if (dot && color) {
                dot.style.background = color;
                dot.style.boxShadow = `0 0 10px ${color}`;
            }
        }

        const initOuo = () => {
            createHUD();

            let stepTriggered = false;
            let loop = null;

            function handleBypass() {
                if (stepTriggered) return;

                // --- STEP 2: Skip Timer & Submit Instantly ---
                const formGo = document.getElementById('form-go');
                if (formGo) {
                    const btnGo = formGo.querySelector('button, input[type="submit"]') || document.getElementById('btn-main');
                    if (btnGo) {
                        stepTriggered = true;
                        if (loop) clearInterval(loop);
                        updateHUD("Step 2: Instant Redirecting...", "#22c55e");
                        btnGo.removeAttribute('disabled');
                        btnGo.click();
                    }
                    return;
                }

                // --- STEP 1: Invisible Turnstile Challenge ---
                const formCaptcha = document.getElementById('form-captcha');
                const btnMain = document.getElementById('btn-main');

                if (formCaptcha && btnMain) {
                    const turnstileWidget = formCaptcha.querySelector('.cf-turnstile iframe, iframe[src*="cloudflare"]');
                    const turnstileDiv = formCaptcha.querySelector('.cf-turnstile');

                    if (turnstileWidget || turnstileDiv) {
                        stepTriggered = true;
                        if (loop) clearInterval(loop);
                        updateHUD("Triggering Verification...", "#38bdf8");

                        setTimeout(() => {
                            btnMain.removeAttribute('disabled');
                            btnMain.click();
                        }, 250);
                    } else {
                        updateHUD("Awaiting Challenge Widget...", "#f59e0b");
                    }
                }
            }

            handleBypass();

            loop = setInterval(() => {
                if (stepTriggered) {
                    clearInterval(loop);
                    return;
                }
                handleBypass();
            }, 100);

            // Failsafe stop after 20 seconds
            setTimeout(() => {
                if (loop) clearInterval(loop);
            }, 20000);
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initOuo);
        } else {
            initOuo();
        }
    })();
}

/* =========================================================================
   5. RIVIWI.COM — EXACT PRODUCTION BLOCK
   ========================================================================= */
if (host.includes('riviwi.com')) {
    (function () {
        'use strict';

        if (window.top !== window.self) return;

        // Instant CSS Injection: Suppresses waiting spinners and exposes action buttons
        const style = document.createElement('style');
        style.textContent = `
            #lite-human-verif-wait,
            #lite-start-sora-wait,
            #lite-end-sora-wait {
                display: none !important;
            }
            #lite-human-verif-button,
            #lite-start-sora-a,
            #lite-end-sora-button {
                display: inline-block !important;
                visibility: visible !important;
                cursor: pointer !important;
            }
        `;
        (document.head || document.documentElement).appendChild(style);

        function createHUD() {
            if (document.getElementById('riviwi-bypass-badge')) return;

            const hud = document.createElement('div');
            hud.id = 'riviwi-bypass-badge';
            hud.innerHTML = `
                <div style="display:flex;align-items:center;gap:10px;">
                    <span style="width:10px;height:10px;border-radius:50%;background:#22c55e;box-shadow:0 0 10px #22c55e;"></span>
                    <span>Automatic Bypass Enabled</span>
                </div>
            `;
            hud.style.cssText = `
                position: fixed !important;
                top: 24px !important;
                right: 24px !important;
                background: #1e293b !important;
                color: #f1f5f9 !important;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
                font-size: 15px !important;
                font-weight: 600 !important;
                padding: 12px 20px !important;
                border-radius: 12px !important;
                border: 1px solid rgba(255, 255, 255, 0.16) !important;
                box-shadow: 0 12px 28px -4px rgba(0, 0, 0, 0.35), 0 8px 12px -6px rgba(0, 0, 0, 0.2) !important;
                z-index: 2147483647 !important;
                letter-spacing: 0.35px !important;
                pointer-events: none !important;
                transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
            `;
            document.documentElement.appendChild(hud);
        }

        function isCaptchaUnsolved() {
            const cf = document.querySelector('[name="cf-turnstile-response"]');
            const rc = document.querySelector('[name="g-recaptcha-response"]');
            const hc = document.querySelector('[name="h-captcha-response"]');

            if (cf && !cf.value.trim()) return true;
            if (rc && !rc.value.trim()) return true;
            if (hc && !hc.value.trim()) return true;
            return false;
        }

        function zeroTimer(id) {
            const el = document.getElementById(id);
            if (!el) return;
            const spans = el.getElementsByTagName('span');
            for (let i = 0; i < spans.length; i++) {
                if (/second/i.test(spans[i].textContent) || /^\d+$/.test(spans[i].textContent.trim())) {
                    spans[i].textContent = '0 Seconds';
                }
            }
        }

        function fireClick(el) {
            if (!el) return;

            el.style.display = 'inline-block';
            el.style.visibility = 'visible';
            el.removeAttribute('disabled');

            const anchor = el.closest('a') || (el.tagName === 'A' ? el : null);
            if (anchor) {
                anchor.setAttribute('target', '_self');
                anchor.setAttribute('rel', 'noopener noreferrer');
            }

            const opts = { bubbles: true, cancelable: true, view: window };
            el.dispatchEvent(new MouseEvent('mousedown', opts));
            el.dispatchEvent(new MouseEvent('mouseup', opts));
            el.dispatchEvent(new MouseEvent('click', opts));
            if (typeof el.click === 'function') el.click();
        }

        const initRiviwi = () => {
            createHUD();

            let page1Handled = false;
            let page2Handled = false;
            let attempts = 0;

            const tracker = setInterval(() => {
                attempts++;

                // ==========================================
                // PAGE 1: Human Verification
                // ==========================================
                if (!page1Handled) {
                    const btn1 = document.getElementById('lite-human-verif-button');
                    const wait1 = document.getElementById('lite-human-verif-wait');

                    if (btn1) {
                        if (isCaptchaUnsolved()) return;

                        page1Handled = true;
                        zeroTimer('soradodo');
                        zeroTimer('human-verif');
                        if (wait1) wait1.style.display = 'none';

                        fireClick(btn1);
                        return;
                    }
                }

                // ==========================================
                // PAGE 2: Step 2 Trigger -> Step 3 Destination
                // ==========================================
                if (!page2Handled) {
                    const startBtn = document.getElementById('lite-start-sora-a');
                    const startWait = document.getElementById('lite-start-sora-wait');

                    if (startBtn) {
                        page2Handled = true;
                        if (startWait) startWait.style.display = 'none';

                        fireClick(startBtn);

                        const endBtn = document.getElementById('lite-end-sora-button');
                        const endWait = document.getElementById('lite-end-sora-wait');

                        if (endWait) endWait.style.display = 'none';
                        zeroTimer('soradodo-end');
                        zeroTimer('sorabottom');
                        zeroTimer('end-sora');

                        if (endBtn) {
                            clearInterval(tracker);
                            endBtn.style.display = 'inline-block';
                            fireClick(endBtn);

                            const parentLink = endBtn.closest('a');
                            if (parentLink) fireClick(parentLink);
                            return;
                        }
                    }
                }

                // Fallback for Step 3 in case of DOM repaint lag
                const endBtn = document.getElementById('lite-end-sora-button');
                const endWait = document.getElementById('lite-end-sora-wait');
                if (endBtn) {
                    clearInterval(tracker);
                    if (endWait) endWait.style.display = 'none';
                    zeroTimer('soradodo-end');
                    zeroTimer('sorabottom');
                    zeroTimer('end-sora');

                    fireClick(endBtn);
                    const parentLink = endBtn.closest('a');
                    if (parentLink) fireClick(parentLink);
                    return;
                }

                if (attempts > 120) {
                    clearInterval(tracker);
                }
            }, 60);
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initRiviwi);
        } else {
            initRiviwi();
        }
    })();
}
