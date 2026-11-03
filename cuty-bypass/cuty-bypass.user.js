// ==UserScript==
// @name         Cuty.io & Cuttty Bypass — Fast, Anti-Ad & Auto Countdown
// @namespace    https://github.com/ArvindSaini978/userscripts/
// @version      1.2.0
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
    const AD_DOMAINS = [
        'vaudona.com',
        'wingsmob.com',
        'sads.adsboosters.xyz',
        'llvpn.com',
        'cleverwebserver.com',
        'abscloud.org',
        'doubleclick.net'
    ];
    const originalCreateElement = document.createElement;

    document.createElement = function(tagName, options) {
        const el = originalCreateElement.call(document, tagName, options);
        if (tagName && tagName.toLowerCase() === 'script') {
            const originalSetAttribute = el.setAttribute;
            el.setAttribute = function(name, val) {
                if (name === 'src' && AD_DOMAINS.some(d => String(val).includes(d))) return;
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

    // --- 2. SAFE TIMER ACCELERATOR (780ms ticks + server responseStart sync) ---
    const originalSetInterval = window.setInterval;
    window.setInterval = function(callback, delay, ...args) {
        if (delay === 1000 || (delay >= 900 && delay <= 1100)) {
            delay = 780;
        }
        return originalSetInterval(callback, delay, ...args);
    };

    // --- 3. CLICK-THROUGH SHIELD & INITIAL TIMER CAPTURE ---
    let initialTimerSeconds = null;

    const clickjackShield = document.createElement('style');
    clickjackShield.id = 'anti-clickjack-shield';
    clickjackShield.textContent = `
        html > div:not(#cuty-bypass-badge),
        html > iframe,
        div[style*="2147483647"]:not(#cuty-bypass-badge),
        .ad-element,
        .aspace,
        [id^="ad-"],
        [class*="ad-container"],
        .clever-core-ads-offerwall,
        .ads-core-ads-offerwall {
            pointer-events: none !important;
            opacity: 0 !important;
            display: none !important;
        }

        body,
        body *:not(.ad-element):not([class*="ad-container"]):not(.aspace):not(.clever-core-ads-offerwall):not(.ads-core-ads-offerwall) {
            pointer-events: auto !important;
        }

        #cuty-bypass-badge, #cuty-bypass-badge * {
            pointer-events: none !important;
        }
    `;
    (document.head || document.documentElement).appendChild(clickjackShield);

    const domObserver = new MutationObserver(() => {
        if (!document.getElementById('anti-clickjack-shield')) {
            (document.head || document.documentElement).appendChild(clickjackShield);
        }
        // Capture exact starting timer value as soon as HTML parses #timer
        if (initialTimerSeconds === null) {
            const tEl = document.getElementById('timer');
            if (tEl) {
                const parsed = parseInt(tEl.textContent.trim(), 10);
                if (!Number.isNaN(parsed) && parsed > 0) {
                    initialTimerSeconds = parsed;
                }
            }
        }
    });
    domObserver.observe(document.documentElement, { childList: true, subtree: true });

    // --- 4. ANTI-SLEEP / BACKGROUND EXECUTION ---
    try {
        Object.defineProperty(document, 'hidden', { get: () => false, configurable: true });
        Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true });
        Object.defineProperty(document, 'webkitVisibilityState', { get: () => 'visible', configurable: true });
        window.addEventListener('visibilitychange', e => e.stopImmediatePropagation(), true);
        window.addEventListener('webkitvisibilitychange', e => e.stopImmediatePropagation(), true);
        window.addEventListener('blur', e => e.stopImmediatePropagation(), true);
    } catch (e) {}

    // --- 5. ANTI-POPUP DEFUSERS & EMBEDDED URL DECODER ---
    window.open = () => null;
    window.canRunAds = true;
    window.isAdBlockActive = false;
    window.adblock = false;
    window.adBlockerDetected = false;

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

    // --- 6. STATUS HUD & TAB TITLE COMPONENT (Original v1.1.0 Design) ---
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
        if (shortTabMsg) setTabTitle(shortTabMsg);
    }

    function getElapsedSinceServerResponse() {
        const nav = performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
        const responseStart = (nav && nav.responseStart > 0) ? nav.responseStart : 0;
        return performance.now() - responseStart;
    }

    // --- 7. AUTOMATION ENGINE ---
    document.addEventListener('DOMContentLoaded', () => {
        createHUD();
        let lastActionTime = 0;
        let turnstileStartTime = null;
        let step3ReadyTime = null;

        const loop = originalSetInterval(() => {
            createHUD();

            if (!window.location.hostname.includes('cuty.io') && !window.location.hostname.includes('cuttty.com')) {
                clearInterval(loop);
                updateHUD("Target Reached!", "✅ Done!", "#22c55e");
                return;
            }

            const now = Date.now();

            // STEP 1: Initial "Continue with Ads"
            const step1Btn = document.querySelector('form#free-submit-form button[data-ref="first"]');
            if (step1Btn && !step1Btn.dataset.triggered) {
                step1Btn.dataset.triggered = 'true';
                updateHUD("Bypassing Initial Step...", "⚡ Step 1", "#38bdf8");
                step1Btn.click();
                lastActionTime = now;
                return;
            }

            // STEP 2: Cloudflare Turnstile Verification
            const step2Btn = document.querySelector('form#free-submit-form button[data-ref="captcha"]');
            const cfTokenInput = document.querySelector('[name="cf-turnstile-response"]');

            if (step2Btn) {
                if (!turnstileStartTime) turnstileStartTime = now;
                const tokenVal = cfTokenInput ? cfTokenInput.value.trim() : '';

                if (tokenVal && !step2Btn.dataset.triggered) {
                    step2Btn.dataset.triggered = 'true';
                    updateHUD("Turnstile Solved! Proceeding...", "⚡ Verifying", "#22c55e");
                    step2Btn.click();
                    lastActionTime = now;
                    return;
                } else if (!tokenVal) {
                    const elapsed = now - turnstileStartTime;
                    if (elapsed > 7500) {
                        updateHUD("Please click the Captcha manually!", "⚠️ Solve Captcha", "#ef4444");
                        const turnstileBox = document.getElementById('turnstile-container') || document.querySelector('.cf-turnstile');
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

            // STEP 3: Server-Synced Countdown & Final Redirect
            const step3Btn = document.querySelector('form#submit-form button[data-ref="show"]');
            const timerSpan = document.getElementById('timer');

            if (step3Btn) {
                const btnText = step3Btn.textContent.trim().toLowerCase();
                const isReady = !step3Btn.disabled &&
                                !step3Btn.hasAttribute('disabled') &&
                                !btnText.includes('wait') &&
                                (btnText.includes('go') || btnText.includes('->'));

                if (isReady && !step3Btn.dataset.triggered) {
                    if (!step3ReadyTime) step3ReadyTime = now;

                    // Ensure server Unix timestamp validation window (N - 1s + 300ms clock skew margin) is met
                    const elapsedFromServer = getElapsedSinceServerResponse();
                    const requiredServerMs = initialTimerSeconds
                        ? Math.max((initialTimerSeconds - 1) * 1000 + 300, initialTimerSeconds * 820)
                        : 0;
                    const fallbackReadyPassed = initialTimerSeconds ? true : (now - step3ReadyTime >= 350);

                    if (elapsedFromServer >= requiredServerMs && fallbackReadyPassed) {
                        step3Btn.dataset.triggered = 'true';
                        clearInterval(loop);
                        updateHUD("Clicking 'Go'...", "🚀 Redirecting", "#22c55e");
                        step3Btn.click();
                    } else {
                        updateHUD("Unlocking link...", "⚡ Unlocking", "#38bdf8");
                    }
                    return;
                }

                if (timerSpan) {
                    const seconds = timerSpan.textContent.trim().replace(/\D+/g, '');
                    if (seconds && seconds !== '0') {
                        updateHUD(`Waiting for timer: ${seconds}s`, `⏳ ${seconds}s`, "#f59e0b");
                    } else if (seconds === '0') {
                        updateHUD("Unlocking link...", "⚡ Unlocking", "#38bdf8");
                    }
                }
            }
        }, 150);
    });
})();
