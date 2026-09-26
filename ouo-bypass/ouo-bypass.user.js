// ==UserScript==
// @name         ouo.io & ouo.press Bypass — Direct & Instant
// @namespace    https://github.com/ArvindSaini978/userscripts/
// @version      1.0.1
// @description  Fast, zero-wait bypass for ouo.io, ouo.press, and ouo shortlinks. Skips countdowns, triggers reactive Turnstile verification, and prevents background tab sleep.
// @author       ArvindSaini978
// @license      MIT
// @match        *://*.ouo.io/*
// @match        *://*.ouo.press/*
// @run-at       document-end
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
})();
