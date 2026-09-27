// ==UserScript==
// @name         Cuty.io & Cuttty Bypass — Fast, Anti-Ad & Auto Countdown
// @namespace    https://github.com/ArvindSaini978/userscripts/
// @version      1.0.0
// @description  Fast, safe automated bypass for cuty.io and cuttty.com shortlinks. Neutralizes clickjack ad overlays, accelerates the countdown timer safely, auto-submits Cloudflare Turnstile with manual fallback alerts, and updates tab titles with real-time progress.
// @author       ArvindSaini978
// @license      MIT
// @homepageURL  https://github.com/ArvindSaini978/userscripts
// @supportURL   https://github.com/ArvindSaini978/userscripts/issues
// @match        *://*.cuty.io/*
// @match        *://*.cuttty.com/*
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

    // Fast-decode embedded Base64 URLs if present
    const TARGET_PATTERN = /(pixeldrain\.[a-z]{2,}\/u\/|filecrypt\.[a-z]{2,}\/|dramaday\.[a-z]{2,}\/)/i;
    try {
        const params = new URLSearchParams(window.location.search);
        if (params.has('url')) {
            let encoded = params.get('url');
            while (encoded.length % 4 !== 0) encoded += '=';
            const decoded = atob(encoded);
            if (TARGET_PATTERN.test(decoded)) {
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

            if (TARGET_PATTERN.test(window.location.href)) {
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
                        // Takes too long: Scroll to it and prompt manual user click
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
