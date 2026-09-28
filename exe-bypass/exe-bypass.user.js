// ==UserScript==
// @name         Exe.io & Exeygo Bypass — Fast, Anti-Ad & Auto Countdown
// @namespace    https://github.com/ArvindSaini978/userscripts/
// @version      1.1.0
// @description  Fast and safe automated bypass for exe.io, exey.io and exeygo.com. Blocks persistent clickjack overlays, accelerates the final countdown timer, auto-submits Cloudflare Turnstile with manual fallback, and updates tab titles with real-time progress.
// @author       ArvindSaini978
// @license      MIT
// @homepageURL  https://github.com/ArvindSaini978/userscripts
// @supportURL   https://github.com/ArvindSaini978/userscripts/issues
// @match        *://*.exe.io/*
// @match        *://*.exey.io/*
// @match        *://*.exeygo.com/*
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

    // Fast-decode embedded Base64 URLs
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
