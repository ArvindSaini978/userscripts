// ==UserScript==
// @name         Riviwi.com Bypass — Instant & Direct Link Fast Skip
// @namespace    https://github.com/ArvindSaini978/userscripts/
// @version      1.0.0
// @description  Fast, zero-wait bypass for Riviwi shorteners. Skips countdowns, exposes action buttons, and automates multi-step navigation instantly.
// @author       ArvindSaini978
// @license      MIT
// @homepageURL  https://github.com/ArvindSaini978/userscripts
// @supportURL   https://github.com/ArvindSaini978/userscripts/issues
// @match        *://*.riviwi.com/*
// @match        *://riviwi.com/*
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

    createHUD();

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
})();
