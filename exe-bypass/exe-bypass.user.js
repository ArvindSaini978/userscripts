// ==UserScript==
// @name         Exe.io & Exeygo Bypass — Fast, Anti-Ad & Auto Countdown
// @namespace    https://github.com/ArvindSaini978/userscripts/
// @version      1.2.0
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

    // Exit immediately if running inside an ad or captcha iframe
    if (window.top !== window.self) return;

    // Block dynamically injected ad-network scripts from loading
    const AD_DOMAINS = ['llvpn.com', 'cleverwebserver.com', 'abscloud.org', 'doubleclick.net'];
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
                get() { return el.getAttribute('src') || ''; },
                configurable: true
            });
        }
        return el;
    };

    // Accelerate 1-second countdown intervals (1000ms -> 650ms) safely
    const originalSetInterval = window.setInterval;
    window.setInterval = function(callback, delay, ...args) {
        if (delay === 1000 || (delay >= 950 && delay <= 1050)) delay = 650;
        return originalSetInterval(callback, delay, ...args);
    };

    // Inject persistent CSS shield to block invisible full-screen ad overlays
    const clickjackShield = document.createElement('style');
    clickjackShield.id = 'anti-clickjack-shield';
    clickjackShield.textContent = `
        html > div:not(#exe-bypass-badge),
        html > iframe,
        div[style*="2147483647"]:not(#exe-bypass-badge),
        .ad-element, [id^="ad-"], [class*="ad-container"], [class*="clever-core"] {
            pointer-events: none !important;
            opacity: 0 !important;
            background: transparent !important;
        }
        body,
        body *:not(.ad-element):not([class*="ad-container"]):not([class*="clever-core"]):not([style*="2147483647"]),
        #exe-bypass-badge {
            pointer-events: auto !important;
        }
    `;
    (document.head || document.documentElement).appendChild(clickjackShield);

    // Re-attach CSS shield if page scripts strip it from the DOM
    new MutationObserver(() => {
        if (!document.getElementById('anti-clickjack-shield')) {
            (document.head || document.documentElement).appendChild(clickjackShield);
        }
    }).observe(document.documentElement, { childList: true, subtree: true });

    // Spoof tab visibility so timers keep running in background tabs
    try {
        Object.defineProperty(document, 'hidden', { get: () => false, configurable: true });
        Object.defineProperty(document, 'visibilityState', { get: () => 'visible', configurable: true });
        Object.defineProperty(document, 'webkitVisibilityState', { get: () => 'visible', configurable: true });
        window.addEventListener('visibilitychange', e => e.stopImmediatePropagation(), true);
        window.addEventListener('webkitvisibilitychange', e => e.stopImmediatePropagation(), true);
        window.addEventListener('blur', e => e.stopImmediatePropagation(), true);
    } catch (e) {}

    // Neutralize popup tabs, adblock flags, and back-button hijacks
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

    // Fast-redirect when destination link is already Base64-encoded in the URL query
    const TARGET_PATTERN = /(pixeldrain|filecrypt|dramaday|mega\.nz|drive\.google|mediafire|1fichier|krakenfiles|gofile|qiwi|rapidgator|ddownload|katfile|nitroflare|turbobit)/i;
    const AD_PATTERN = /(exe\.io|exey\.io|exeygo|cuty\.io|cuttty|adsterra|doubleclick|monetag|hilltopads|sowve\.com)/i;

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

    // Create and update the floating status HUD and tab title
    function createHUD() {
        if (document.getElementById('exe-bypass-badge')) return;
        const container = document.body || document.documentElement;
        if (!container) return;

        const hud = document.createElement('div');
        hud.id = 'exe-bypass-badge';
        hud.innerHTML = `
            <div style="display:flex;align-items:center;gap:10px;">
                <span id="exe-dot" style="width:10px;height:10px;border-radius:50%;background:#22c55e;box-shadow:0 0 10px #22c55e;"></span>
                <span id="exe-text">Detecting Step...</span>
            </div>
        `;
        hud.style.cssText = `
            position: fixed !important; top: 24px !important; right: 24px !important;
            background: rgba(30, 41, 59, 0.88) !important; backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important; color: #f1f5f9 !important;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
            font-size: 15px !important; font-weight: 600 !important; padding: 12px 20px !important;
            border-radius: 12px !important; border: 1px solid rgba(255, 255, 255, 0.16) !important;
            box-shadow: 0 12px 28px -4px rgba(0, 0, 0, 0.35) !important;
            z-index: 2147483647 !important; pointer-events: none !important;
        `;
        container.appendChild(hud);
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
        if (shortTabMsg) document.title = `${shortTabMsg} • Auto Bypass | Exe`;
    }

    // Block rogue click hijacks outside forms, buttons, and Turnstile widgets
    document.addEventListener('click', (e) => {
        const t = e.target;
        const isLegit = t.tagName === 'BUTTON' || t.tagName === 'INPUT' ||
                        t.closest('form') || t.closest('.cf-turnstile') || t.closest('#exe-bypass-badge');
        if (!isLegit) e.stopPropagation();
    }, true);

    // Main 3-step state machine engine
    document.addEventListener('DOMContentLoaded', () => {
        createHUD();
        let turnstileStartTime = null;

        const loop = setInterval(() => {
            createHUD();
            const now = Date.now();

            // Delete injected max z-index clickjack overlays from the DOM
            document.querySelectorAll('div[style*="2147483647"]').forEach(overlay => {
                if (overlay.id !== 'exe-bypass-badge') overlay.remove();
            });

            // Stop polling once redirected to the final target site
            if (!/(exe\.io|exey\.io|exeygo\.com)/i.test(window.location.hostname)) {
                clearInterval(loop);
                updateHUD("Target Reached!", "✅ Done!", "#22c55e");
                return;
            }

            const step1Form = document.getElementById('free-submit-form');
            const turnstileBox = document.querySelector('.cf-turnstile');
            const step3Form = document.getElementById('submit-form');
            const countdownEl = document.getElementById('countdown');

            // STEP 1: Submit initial "Continue with ads" form immediately
            if (step1Form && !turnstileBox) {
                if (!step1Form.dataset.triggered) {
                    step1Form.dataset.triggered = 'true';
                    updateHUD("Forcing Initial Step...", "⚡ Step 1", "#38bdf8");
                    HTMLFormElement.prototype.submit.call(step1Form);
                }
                return;
            }

            // STEP 2: Wait for Cloudflare Turnstile token, then submit form
            if (turnstileBox) {
                const cfToken = document.querySelector('[name="cf-turnstile-response"]');
                if (!turnstileStartTime) turnstileStartTime = now;

                if (cfToken && cfToken.value) {
                    const captchaForm = turnstileBox.closest('form') || step1Form;
                    if (captchaForm && !captchaForm.dataset.triggered) {
                        captchaForm.dataset.triggered = 'true';
                        updateHUD("Turnstile Solved! Instant Forward...", "⚡ Verifying", "#22c55e");
                        HTMLFormElement.prototype.submit.call(captchaForm);
                    }
                } else if (now - turnstileStartTime > 7500) {
                    updateHUD("Please click the Captcha manually!", "⚠️ Solve Captcha", "#ef4444");
                    if (!turnstileBox.dataset.scrolled) {
                        turnstileBox.dataset.scrolled = 'true';
                        turnstileBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                } else {
                    updateHUD("Waiting for Cloudflare Turnstile...", "🛡️ Captcha", "#f59e0b");
                }
                return;
            }

            // STEP 3: Wait for countdown completion, then click the unlocked submit button
            if (step3Form && countdownEl) {
                const state = countdownEl.getAttribute('data-state');
                const btn = document.getElementById('submit-button');

                if (state === 'done' && btn && !btn.disabled) {
                    if (!step3Form.dataset.triggered) {
                        step3Form.dataset.triggered = 'true';
                        clearInterval(loop);
                        updateHUD("Redirecting...", "🚀 Redirecting", "#22c55e");
                        btn.click();
                    }
                } else {
                    const secText = countdownEl.textContent.trim().replace(/\D+/g, '');
                    if (secText && secText !== '0') {
                        updateHUD(`Waiting for timer: ${secText}s`, `⏳ ${secText}s`, "#f59e0b");
                    } else {
                        updateHUD("Finalizing Link...", "⚡ Unlocking", "#f59e0b");
                    }
                }
                return;
            }
        }, 200);
    });
})();
