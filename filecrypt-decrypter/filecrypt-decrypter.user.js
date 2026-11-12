// ==UserScript==
// @name         Filecrypt Instant Decrypter, Bypass & Auto-Resolver (CNL + High Speed)
// @namespace    https://github.com/ArvindSaini978/userscripts/
// @description  Instantly bypasses, decrypts, and resolves Filecrypt containers. Features AES Click'n'Load decryption, multi-worker queues, auto-retry for dead/slow links, and 1-click batch copy.
// @version      2.4.0
// @author       ArvindSaini978
// @license      MIT
// @homepageURL  https://github.com/ArvindSaini978/userscripts
// @supportURL   https://github.com/ArvindSaini978/userscripts/issues
// @match        *://*.filecrypt.cc/*
// @match        *://*.filecrypt.to/*
// @match        *://*.filecrypt.co/*
// @match        *://*.filecrypt.org/*
// @match        *://*.filecrypt.is/*
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @connect      *
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

(function() {
    'use strict';

    // 1. Injected Styles
    const style = document.createElement('style');
    style.textContent = `
        /* Unified Dark Theme across all Filecrypt containers */
        html, body, #page, .content.big, .box.small {
            background-color: #0b0f17 !important;
            color: #f1f5f9 !important;
        }
        .window.container {
            background-color: rgba(15, 23, 42, 0.75) !important;
            border: 1px solid rgba(255, 255, 255, 0.08) !important;
            border-radius: 10px !important;
            padding: 16px 24px !important;
            color: #f8fafc !important;
        }
        .window.container h2,
        .window.container p,
        .window.container small,
        tbody tr td,
        tbody tr td[title] {
            color: #e2e8f0 !important;
        }
        tbody tr > td {
            background-color: rgba(15, 23, 42, 0.65) !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06) !important;
        }

        td a.button.download::after,
        td a.button.download::before {
            content: none !important;
            display: none !important;
        }

        /* High-Visibility Host Labels */
        a.external_link,
        td[title] span a,
        td[title] small {
            color: #fbbf24 !important;
            font-size: 11px !important;
            font-weight: 700 !important;
            opacity: 1 !important;
            letter-spacing: 0.3px !important;
            text-decoration: none !important;
            display: inline-block !important;
            margin-top: 2px !important;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8) !important;
        }
        tbody tr:hover a.external_link {
            color: #fde68a !important;
            text-decoration: underline !important;
        }

        table {
            border-collapse: separate !important;
            border-spacing: 0 !important;
        }
        #page, #box_content, .box_small, .div_window_container,
        .content.big, .box.small, .window.container {
            overflow: visible !important;
        }

        tbody tr {
            position: relative !important;
            cursor: pointer;
            transition: background 0.15s ease !important;
        }
        tbody tr:hover > td {
            background-color: rgba(255, 255, 255, 0.035) !important;
            border-bottom: 2px solid #38bdf8 !important;
        }
        tbody tr.fc-row-pinned > td {
            background-color: rgba(16, 185, 129, 0.06) !important;
            border-bottom: 2px solid #10b981 !important;
        }
        tbody tr.fc-episode-start > td {
            border-top: 2px solid rgba(255, 255, 255, 0.12) !important;
        }

        td.action-cell {
            position: relative !important;
            padding: 6px 10px !important;
            white-space: nowrap !important;
            text-align: right !important;
        }

        .fc-btn-base {
            display: inline-flex;
            align-items: center !important;
            justify-content: center !important;
            border-radius: 6px !important;
            box-sizing: border-box !important;
            user-select: none !important;
            transition: all 0.18s cubic-bezier(0.4, 0, 0.2, 1) !important;
            text-align: center !important;
            font-family: inherit !important;
        }
        .fc-btn-base:not(:disabled):hover {
            filter: brightness(1.15) !important;
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35) !important;
        }
        .fc-btn-base:not(:disabled):active {
            transform: translateY(0) scale(0.98) !important;
            filter: brightness(0.95) !important;
        }

        .fc-main-btn,
        .container table a.fc-main-btn {
            flex-direction: column !important;
            height: 40px !important;
            min-width: 140px !important;
            padding: 2px 14px !important;
            text-decoration: none !important;
            color: #ffffff !important;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6) !important;
            border: none !important;
            line-height: 1.2 !important;
            opacity: 1 !important;
        }
        .fc-main-btn .fc-dl-top {
            font-size: 11px !important;
            font-weight: 600 !important;
            color: #ffffff !important;
            opacity: 1 !important;
        }
        .fc-main-btn .fc-dl-host {
            font-size: 12px !important;
            font-weight: 800 !important;
            color: #ffffff !important;
            opacity: 1 !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            max-width: 130px !important;
        }

        @keyframes fcPulse {
            0% { opacity: 0.85; filter: brightness(0.95); }
            50% { opacity: 1; filter: brightness(1.25); }
            100% { opacity: 0.85; filter: brightness(0.95); }
        }
        .fc-main-resolving {
            animation: fcPulse 1.4s infinite ease-in-out !important;
        }

        .fc-side-slot {
            position: absolute !important;
            left: 100% !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            margin-left: 8px !important;
            display: inline-flex !important;
            z-index: 10 !important;
        }

        .fc-side-btn {
            height: 40px !important;
            line-height: 40px !important;
            border-radius: 6px !important;
            padding: 0 4px !important;
            width: 86px !important;
            min-width: 86px !important;
            max-width: 86px !important;
            cursor: pointer !important;
            font-size: 11.5px !important;
            font-weight: 600 !important;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3) !important;
        }

        .fc-decrypt-single {
            background: linear-gradient(135deg, #4f46e5, #4338ca) !important;
            color: #ffffff !important;
            border: 1px solid #6366f1 !important;
        }
        .fc-decrypt-single:hover {
            background: linear-gradient(135deg, #6366f1, #4f46e5) !important;
            border-color: #818cf8 !important;
        }

        .fc-resolving-btn {
            background: #0f172a !important;
            color: #f59e0b !important;
            border: 1px dashed #d97706 !important;
            cursor: wait !important;
            letter-spacing: 2px !important;
            font-size: 14px !important;
            animation: fcPulse 1s infinite ease-in-out !important;
        }

        .fc-copy-btn {
            background: #0f231c !important;
            color: #6ee7b7 !important;
            border: 1px solid #059669 !important;
        }
        .fc-copy-btn:hover {
            background: #133328 !important;
            color: #a7f3d0 !important;
            border-color: #10b981 !important;
        }
        .fc-copy-btn.copied {
            background: #16a34a !important;
            border-color: #22c55e !important;
            color: #ffffff !important;
        }

        .fc-select {
            height: 36px;
            background: #1e293b;
            color: #f8fafc;
            border: 1px solid #334155;
            border-radius: 6px;
            padding: 0 10px;
            font-size: 12px;
            font-weight: 500;
            outline: none;
            cursor: pointer;
            transition: all 0.15s ease;
        }
        .fc-select:hover {
            border-color: #475569;
            background: #243248;
        }

        .fc-status-pill {
            display: inline-flex !important;
            align-items: center !important;
            font-size: 11px !important;
            padding: 4px 10px !important;
            border-radius: 6px !important;
            background: #0f172a;
            color: #38bdf8;
            border: 1px solid #0284c7;
            font-weight: 600 !important;
            letter-spacing: 0.2px !important;
            transition: all 0.2s ease;
        }

        #fc-native-toolbar {
            position: sticky !important;
            top: 0 !important;
            z-index: 9999 !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            width: 100% !important;
            box-sizing: border-box !important;
            margin: 15px 0 12px 0 !important;
            padding: 10px 14px !important;
            background: rgba(11, 15, 23, 0.3) !important;
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
            border-radius: 8px !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.45) !important;
            font-family: system-ui, -apple-system, sans-serif !important;
            flex-wrap: wrap !important;
            gap: 12px !important;
        }

        #fc-retry-all-btn {
            height: 36px;
            padding: 0 14px;
            background: #b45309;
            color: #fff;
            border: none;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
            display: none !important;
        }
        #fc-retry-all-btn:hover:not(:disabled) {
            background: #d97706 !important;
        }

        #fc-decrypt-btn {
            height: 36px;
            padding: 0 14px;
            background: #4f46e5;
            color: #ffffff;
            border: none;
            cursor: pointer;
            font-size: 12px;
            font-weight: 600;
        }
        #fc-decrypt-btn:hover:not(:disabled) {
            background: #4338ca !important;
        }

        #fc-copy-btn {
            height: 36px;
            padding: 0 16px;
            font-size: 12px;
            font-weight: 600;
            border: none;
        }
        #fc-copy-btn.fc-enabled {
            background: #16a34a !important;
            color: #ffffff !important;
            cursor: pointer !important;
        }
        #fc-copy-btn.fc-enabled:hover {
            background: #15803d !important;
        }
        #fc-copy-btn.fc-disabled {
            background: #334155 !important;
            color: #94a3b8 !important;
            cursor: not-allowed !important;
            filter: none !important;
            transform: none !important;
            box-shadow: none !important;
        }
    `;
    document.head.appendChild(style);

    // Initialization loop to handle slow loading pages / Cloudflare
    function initTracker() {
        const targetTable = document.querySelector('.window.container table, .box.small table, table');
        if (!targetTable) {
            setTimeout(initTracker, 300);
            return;
        }
        if (targetTable.dataset.fcInitialized) return;
        targetTable.dataset.fcInitialized = "true";
        startScript(targetTable);
    }

    function startScript(targetTable) {
        const CONCURRENCY = 4;
        const MAX_RETRIES = 3;
        const MAX_AUTO_RETRY_PASSES = 2; // Auto-retries per task

        // 2. Keep "n/a" and "undefined" rows intact — only remove empty spacer rows without download buttons
        targetTable.querySelectorAll('tbody tr, tr').forEach(row => {
            const hasDownloadAction = row.querySelector('a[href*="/Link/"], a.button.download, button.download');
            if (!hasDownloadAction && row.querySelector('td')) {
                row.remove();
            }
        });

        // 3. Host Helpers
        function cleanHostName(rawHost) {
            if (rawHost === 'pixeldrain-cdn') return 'CDN Pixeldrain';
            const base = rawHost.split('.')[0];
            return base.charAt(0).toUpperCase() + base.slice(1);
        }

        function parseHostFromRow(row) {
            const extLink = row.querySelector('a.external_link, td[title] span a');
            if (extLink) {
                const linkText = (extLink.textContent || '').trim().toLowerCase();
                if (linkText) return linkText;
                try {
                    return new URL(extLink.getAttribute('href')).hostname.replace('www.', '').toLowerCase();
                } catch (e) {}
            }
            const rowText = (row.textContent || '').toLowerCase();
            if (rowText.includes('mega')) return 'mega.nz';
            if (rowText.includes('pixeldrain')) return 'pixeldrain';
            if (rowText.includes('send.now')) return 'send.now';
            if (rowText.includes('terabytez')) return 'terabytez.org';
            if (rowText.includes('filestore')) return 'filestore.me';
            if (rowText.includes('datanodes')) return 'datanodes.to';
            if (rowText.includes('fuckingfast')) return 'fuckingfast.co';
            return 'Other';
        }

        function getHostColor(host) {
            const h = host.toLowerCase();
            if (h.includes('mega')) return '#dc2626';        // Vibrant Red
            if (h.includes('pixeldrain')) return '#0284c7';  // Vibrant Sky Blue
            if (h.includes('akirabox')) return '#4f46e5';    // Vibrant Indigo
            if (h.includes('buzzheavier')) return '#ea580c'; // Vibrant Orange
            if (h.includes('fileq')) return '#7c3aed';       // Vibrant Violet
            if (h.includes('send')) return '#059669';        // Vibrant Emerald
            if (h.includes('datanodes')) return '#0d9488';   // Vibrant Teal
            if (h.includes('fuckingfast')) return '#db2777'; // Vibrant Pink
            if (h.includes('filestore')) return '#2563eb';   // Vibrant Royal Blue
            if (h.includes('terabytez')) return '#9333ea';   // Vibrant Purple
            if (h.includes('gofile')) return '#16a34a';      // Vibrant Green
            if (h.includes('1fichier')) return '#f97316';    // Bright Orange
            if (h.includes('rapidgator')) return '#e11d48';  // Vibrant Crimson
            if (h.includes('katfile')) return '#0891b2';     // Vibrant Cyan

            // Mid-tone vibrant fallback palette for any unknown host
            const vibrantPalette = [
                '#dc2626', '#db2777', '#9333ea', '#7c3aed',
                '#4f46e5', '#2563eb', '#0284c7', '#0891b2',
                '#0d9488', '#059669', '#ea580c', '#e11d48'
            ];
            let hash = 0;
            for (let i = 0; i < h.length; i++) {
                hash = h.charCodeAt(i) + ((hash << 5) - hash);
            }
            return vibrantPalette[Math.abs(hash) % vibrantPalette.length];
        }

        // 4. Scan valid rows & configure layout (including "undefined" and "n/a" rows)
        const validRows = targetTable.querySelectorAll('tr');
        const hostRegistry = {};
        const allRowTasks = [];
        let lastEpisodeKey = '';

        validRows.forEach((row) => {
            const linkElem = row.querySelector('a[href*="/Link/"], a.button.download');
            if (!linkElem) return;

            const rawHref = linkElem.getAttribute('href');
            if (!rawHref) return;

            const titleTd = row.querySelector('td[title]');
            const rawTitle = titleTd ? (titleTd.getAttribute('title') || '').trim() : '';
            const isPlaceholderTitle = !rawTitle || rawTitle.toLowerCase() === 'undefined' || rawTitle.toLowerCase() === 'n/a';

            if (!isPlaceholderTitle) {
                const epMatch = rawTitle.match(/S\d+E\d+/i);
                const epKey = epMatch ? epMatch[0].toUpperCase() : rawTitle;
                if (epKey && epKey !== lastEpisodeKey) {
                    row.classList.add('fc-episode-start');
                    lastEpisodeKey = epKey;
                }
            }

            row.addEventListener('click', (e) => {
                if (e.target.closest('a, button, select')) return;
                document.querySelectorAll('tr.fc-row-pinned').forEach(r => {
                    if (r !== row) r.classList.remove('fc-row-pinned');
                });
                row.classList.toggle('fc-row-pinned');
            });

            const host = parseHostFromRow(row);
            const displayName = cleanHostName(host);

            if (!hostRegistry[host]) {
                hostRegistry[host] = {
                    total: 0,
                    completed: 0,
                    items: [],
                    color: getHostColor(host),
                    isRunning: false
                };
            }

            const cell = linkElem.closest('td');
            cell.className = 'action-cell';
            cell.innerHTML = '';

            const mainBtn = document.createElement('a');
            mainBtn.className = 'fc-btn-base fc-main-btn';
            mainBtn.style.background = hostRegistry[host].color;
            mainBtn.innerHTML = `
                <span class="fc-dl-top">Download</span>
                <span class="fc-dl-host">(${displayName})</span>
            `;
            mainBtn.href = rawHref;
            cell.appendChild(mainBtn);

            const sideSlot = document.createElement('div');
            sideSlot.className = 'fc-side-slot';
            cell.appendChild(sideSlot);

            const itemObj = {
                url: new URL(rawHref, window.location.origin).href,
                finalUrl: null,
                host: host,
                displayName: displayName,
                mainBtn: mainBtn,
                sideSlot: sideSlot,
                isResolving: false,
                isFailed: false,
                autoRetriesLeft: MAX_AUTO_RETRY_PASSES
            };

            renderSingleDecryptBtn(itemObj);

            hostRegistry[host].total++;
            hostRegistry[host].items.push(itemObj);
            allRowTasks.push(itemObj);
        });

        const hostList = Object.keys(hostRegistry);

        // 5. Always Render Top Toolbar (Even if 1 link or 0 links are detected)
        const toolbar = document.createElement('div');
        toolbar.id = 'fc-native-toolbar';

        toolbar.innerHTML = `
            <!-- Left Side: Status & Retry Failed Button (Always Visible) -->
            <div id="fc-left-controls" style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
                <span id="fc-mode-badge" class="fc-status-pill">Detecting Mode...</span>
                <button id="fc-retry-all-btn" type="button" class="fc-btn-base">↻ Retry Failed (0)</button>
            </div>

            <!-- Right Side: Decrypt Host Group + Universal Copy Group -->
            <div id="fc-right-controls" style="display: ${hostList.length > 0 ? 'flex' : 'none'}; gap: 12px; align-items: center; flex-wrap: wrap; margin-left: auto;">
                <div id="fc-decrypt-group" style="display: none; gap: 6px; align-items: center;">
                    <select id="fc-decrypt-select" class="fc-select"></select>
                    <button id="fc-decrypt-btn" type="button" class="fc-btn-base">Decrypt Host</button>
                </div>

                <div id="fc-copy-group" style="display: flex; gap: 6px; align-items: center;">
                    <select id="fc-copy-select" class="fc-select"></select>
                    <button id="fc-copy-btn" disabled type="button" class="fc-btn-base fc-disabled">Copy Links</button>
                </div>
            </div>
        `;
        targetTable.parentNode.insertBefore(toolbar, targetTable);

        const modeBadge = document.getElementById('fc-mode-badge');
        const retryAllBtn = document.getElementById('fc-retry-all-btn');

        const decryptGroup = document.getElementById('fc-decrypt-group');
        const decryptSelect = document.getElementById('fc-decrypt-select');
        const decryptBtn = document.getElementById('fc-decrypt-btn');

        const copySelect = document.getElementById('fc-copy-select');
        const copyBtn = document.getElementById('fc-copy-btn');

        function buildDecryptDropdown() {
            decryptSelect.innerHTML = '';
            hostList.forEach(host => {
                const opt = document.createElement('option');
                opt.value = host;
                opt.id = `opt-dec-${host.replace(/[^a-zA-Z0-9]/g, '_')}`;
                opt.textContent = `${cleanHostName(host)} (${hostRegistry[host].completed}/${hostRegistry[host].total})`;
                decryptSelect.appendChild(opt);
            });
        }
        buildDecryptDropdown();

        function buildCopyDropdown() {
            copySelect.innerHTML = '';
            hostList.forEach(host => {
                const opt = document.createElement('option');
                opt.value = host;
                opt.id = `opt-copy-${host.replace(/[^a-zA-Z0-9]/g, '_')}`;
                opt.textContent = `${cleanHostName(host)} (0/${hostRegistry[host].total})`;
                copySelect.appendChild(opt);

                if (host.includes('pixeldrain')) {
                    const optCdn = document.createElement('option');
                    optCdn.value = 'pixeldrain-cdn';
                    optCdn.id = 'opt-copy-pixeldrain_cdn';
                    optCdn.textContent = `CDN Pixeldrain (0/${hostRegistry[host].total})`;
                    copySelect.appendChild(optCdn);
                }
            });
        }
        buildCopyDropdown();

        // 6. Styled Row Decrypt and Copy Buttons
        function renderSingleDecryptBtn(task) {
            task.sideSlot.innerHTML = '';
            const decBtn = document.createElement('button');
            decBtn.type = 'button';
            decBtn.className = 'fc-btn-base fc-side-btn fc-decrypt-single';
            decBtn.textContent = '⚡ Decrypt';

            decBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (task.isResolving || task.finalUrl) return;

                task.autoRetriesLeft = MAX_AUTO_RETRY_PASSES;
                await processTask(task);
                checkAutoRetryPass();
            });
            task.sideSlot.appendChild(decBtn);
        }

        function applySuccessToTask(task, finalUrl) {
            task.finalUrl = task.host.includes('pixeldrain') ? finalUrl.split('#')[0] : finalUrl;
            task.isFailed = false;
            task.autoRetriesLeft = 0;
            hostRegistry[task.host].completed++;

            task.mainBtn.classList.remove('fc-main-resolving');
            task.mainBtn.href = task.finalUrl;
            task.mainBtn.target = '_blank';
            task.mainBtn.style.background = hostRegistry[task.host].color;
            task.mainBtn.innerHTML = `
                <span class="fc-dl-top">Download</span>
                <span class="fc-dl-host">(${task.displayName})</span>
            `;

            task.sideSlot.innerHTML = '';
            const singleCopy = document.createElement('button');
            singleCopy.type = 'button';
            singleCopy.className = 'fc-btn-base fc-side-btn fc-copy-btn';
            singleCopy.textContent = '📋 Copy';

            singleCopy.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                copyTextToClipboard(task.finalUrl);
                singleCopy.classList.add('copied');
                singleCopy.textContent = '✓ Copied';
                setTimeout(() => {
                    singleCopy.classList.remove('copied');
                    singleCopy.textContent = '📋 Copy';
                }, 1500);
            });
            task.sideSlot.appendChild(singleCopy);
        }

        // 7. High-Speed Task Processor
        async function processTask(task) {
            if (task.isResolving || task.finalUrl) return;
            task.isResolving = true;
            task.isFailed = false;

            task.mainBtn.classList.add('fc-main-resolving');
            task.mainBtn.innerHTML = `
                <span class="fc-dl-top">Resolving...</span>
                <span class="fc-dl-host">...</span>
            `;

            task.sideSlot.innerHTML = '';
            const resolvingPill = document.createElement('button');
            resolvingPill.type = 'button';
            resolvingPill.disabled = true;
            resolvingPill.className = 'fc-btn-base fc-side-btn fc-resolving-btn';
            resolvingPill.textContent = '•••';
            task.sideSlot.appendChild(resolvingPill);

            let resolved = null;
            for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
                resolved = await resolveLinkHop(task.url, task.host);
                if (resolved) break;
                if (attempt < MAX_RETRIES) {
                    await new Promise(r => setTimeout(r, 1000));
                }
            }

            task.isResolving = false;
            task.mainBtn.classList.remove('fc-main-resolving');

            if (resolved) {
                applySuccessToTask(task, resolved);
            } else {
                task.isFailed = true;
                task.mainBtn.innerHTML = `
                    <span class="fc-dl-top">Failed</span>
                    <span class="fc-dl-host">(${task.displayName})</span>
                `;
                task.mainBtn.style.background = '#991b1b';

                task.sideSlot.innerHTML = '';
                const retryBtn = document.createElement('button');
                retryBtn.type = 'button';
                retryBtn.className = 'fc-btn-base fc-side-btn';
                retryBtn.textContent = '↻ Retry';
                retryBtn.style.background = '#eab308';
                retryBtn.style.color = '#000';

                retryBtn.addEventListener('click', async (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (task.isResolving || task.finalUrl) return;
                    task.autoRetriesLeft = 0;
                    await processTask(task);
                    checkFailedTasks();
                });
                task.sideSlot.appendChild(retryBtn);
            }
            updateToolbarState();
        }

        // Global Managed Task Queue
        const globalQueue = [];
        let activeWorkers = 0;

        async function queueWorker() {
            activeWorkers++;
            while (globalQueue.length > 0) {
                const task = globalQueue.shift();
                await processTask(task);
                if (globalQueue.length > 0) {
                    const jitter = Math.floor(Math.random() * 150) + 200;
                    await new Promise(r => setTimeout(r, jitter));
                }
            }
            activeWorkers--;

            // Sync host running states
            Object.keys(hostRegistry).forEach(h => {
                const hData = hostRegistry[h];
                if (hData.isRunning) {
                    const hasPending = hData.items.some(i => !i.finalUrl && (i.isResolving || globalQueue.includes(i)));
                    if (!hasPending) {
                        hData.isRunning = false;
                    }
                }
            });

            updateToolbarState();
            checkDecryptBtnState();
            checkAutoRetryPass();
        }

        function enqueueTasks(taskList) {
            let addedCount = 0;
            taskList.forEach(task => {
                if (!task.finalUrl && !task.isResolving && !globalQueue.includes(task)) {
                    task.autoRetriesLeft = MAX_AUTO_RETRY_PASSES;
                    globalQueue.push(task);
                    addedCount++;
                }
            });

            const neededWorkers = Math.min(CONCURRENCY, globalQueue.length + activeWorkers) - activeWorkers;
            for (let i = 0; i < neededWorkers; i++) {
                queueWorker();
            }
            return addedCount;
        }

        function runHostQueue(host) {
            const hData = hostRegistry[host];
            if (!hData) return;
            hData.isRunning = true;
            const pendingItems = hData.items.filter(i => !i.finalUrl);
            enqueueTasks(pendingItems);
            checkDecryptBtnState();
        }

        // 8. Isolated Per-Task Auto-Retry Sweep
        let isAutoRetrying = false;
        function checkAutoRetryPass() {
            const isAnyRunning = Object.values(hostRegistry).some(h => h.isRunning) || allRowTasks.some(t => t.isResolving);
            if (isAnyRunning || isAutoRetrying) return;

            const eligibleTasks = allRowTasks.filter(t => t.isFailed && !t.finalUrl && !t.isResolving && t.autoRetriesLeft > 0);

            if (eligibleTasks.length > 0) {
                isAutoRetrying = true;
                eligibleTasks.forEach(t => { t.autoRetriesLeft--; });

                const originalBadgeText = modeBadge.textContent;
                modeBadge.textContent = `Auto-Retrying (${eligibleTasks.length})...`;
                modeBadge.style.background = '#854d0e';
                modeBadge.style.borderColor = '#eab308';
                modeBadge.style.color = '#fef08a';

                setTimeout(() => {
                    isAutoRetrying = false;
                    modeBadge.textContent = originalBadgeText;
                    enqueueTasks(eligibleTasks);
                }, 1500);
            } else {
                checkFailedTasks();
            }
        }

        // 9. Toolbar State Updates & Strict Failed-Task Hiding
        function checkDecryptBtnState() {
            if (!decryptSelect || !decryptBtn) return;
            const host = decryptSelect.value;
            const hData = hostRegistry[host];

            if (!hData) return;

            if (hData.completed === hData.total && hData.total > 0) {
                decryptBtn.disabled = true;
                decryptBtn.textContent = 'All Decrypted';
                decryptBtn.style.opacity = '0.6';
                decryptBtn.style.cursor = 'not-allowed';
            } else if (hData.isRunning) {
                decryptBtn.disabled = true;
                decryptBtn.textContent = 'Decrypting...';
                decryptBtn.style.opacity = '0.7';
                decryptBtn.style.cursor = 'wait';
            } else {
                decryptBtn.disabled = false;
                decryptBtn.textContent = 'Decrypt Host';
                decryptBtn.style.opacity = '1';
                decryptBtn.style.cursor = 'pointer';
            }
        }

        function updateToolbarState() {
            const pdKey = Object.keys(hostRegistry).find(h => h.includes('pixeldrain'));
            const pd = pdKey ? hostRegistry[pdKey] : null;

            hostList.forEach(host => {
                const hInfo = hostRegistry[host];

                const optCopy = document.getElementById(`opt-copy-${host.replace(/[^a-zA-Z0-9]/g, '_')}`);
                if (optCopy) optCopy.textContent = `${cleanHostName(host)} (${hInfo.completed}/${hInfo.total})`;

                const optDec = document.getElementById(`opt-dec-${host.replace(/[^a-zA-Z0-9]/g, '_')}`);
                if (optDec) optDec.textContent = `${cleanHostName(host)} (${hInfo.completed}/${hInfo.total})`;
            });

            if (pd) {
                const optCdn = document.getElementById('opt-copy-pixeldrain_cdn');
                if (optCdn) optCdn.textContent = `CDN Pixeldrain (${pd.completed}/${pd.total})`;
            }

            checkCopyBtnState();
            checkDecryptBtnState();
            checkFailedTasks();
        }

        function checkFailedTasks() {
            const failedTasks = allRowTasks.filter(t => t.isFailed && !t.finalUrl && !t.isResolving);
            if (failedTasks.length > 0) {
                retryAllBtn.style.setProperty('display', 'inline-flex', 'important');
                retryAllBtn.textContent = `↻ Retry Failed (${failedTasks.length})`;
                retryAllBtn.disabled = false;
            } else {
                retryAllBtn.style.setProperty('display', 'none', 'important');
            }
        }

        function checkCopyBtnState() {
            if (!copySelect) return;
            const selectedValue = copySelect.value;
            let count = 0;
            let total = 0;

            if (selectedValue === 'pixeldrain-cdn') {
                const pdKey = hostList.find(h => h.includes('pixeldrain'));
                if (pdKey) {
                    count = hostRegistry[pdKey].completed;
                    total = hostRegistry[pdKey].total;
                }
            } else if (hostRegistry[selectedValue]) {
                count = hostRegistry[selectedValue].completed;
                total = hostRegistry[selectedValue].total;
            }

            if (count > 0) {
                copyBtn.disabled = false;
                copyBtn.className = 'fc-btn-base fc-enabled';
                copyBtn.textContent = `Copy Links (${count}/${total})`;
            } else {
                copyBtn.disabled = true;
                copyBtn.className = 'fc-btn-base fc-disabled';
                copyBtn.textContent = 'Copy Links';
            }
        }

        if (copySelect) copySelect.addEventListener('change', checkCopyBtnState);
        if (decryptSelect) decryptSelect.addEventListener('change', checkDecryptBtnState);

        // 10. Toolbar Click Handlers
        retryAllBtn.addEventListener('click', () => {
            const failedTasks = allRowTasks.filter(t => t.isFailed && !t.finalUrl && !t.isResolving);
            if (failedTasks.length === 0) return;

            retryAllBtn.disabled = true;
            retryAllBtn.textContent = 'Retrying...';

            failedTasks.forEach(t => { t.isFailed = false; });
            enqueueTasks(failedTasks);
        });

        decryptBtn.addEventListener('click', () => {
            const host = decryptSelect.value;
            if (!host) return;
            const hData = hostRegistry[host];
            if (hData && hData.completed === hData.total && hData.total > 0) return;

            runHostQueue(host);
        });

        copyBtn.addEventListener('click', () => {
            const selectedValue = copySelect.value;
            let urls = [];

            if (selectedValue === 'pixeldrain-cdn') {
                const pdKey = hostList.find(h => h.includes('pixeldrain'));
                urls = pdKey ? hostRegistry[pdKey].items
                    .map(i => i.finalUrl).filter(Boolean)
                    .map(url => url.replace('https://pixeldrain.com/u/', 'https://cdn.pixeldrain.eu.cc/')) : [];
            } else if (hostRegistry[selectedValue]) {
                urls = hostRegistry[selectedValue].items.map(i => i.finalUrl).filter(Boolean);
            }

            if (!urls.length) return;

            copyTextToClipboard(urls.join('\n'));
            copyBtn.textContent = '✓ Copied!';
            setTimeout(checkCopyBtnState, 2000);
        });

        // 11. Native AES-CBC Decryption for CNL
        function hexToUint8Array(hexString) {
            const clean = hexString.replace(/[^0-9a-fA-F]/g, '');
            const bytes = new Uint8Array(clean.length / 2);
            for (let i = 0; i < clean.length; i += 2) {
                bytes[i / 2] = parseInt(clean.substring(i, i + 2), 16);
            }
            return bytes;
        }

        function base64ToUint8Array(base64) {
            const binaryString = window.atob(base64);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            return bytes;
        }

        async function decryptCNLPayload(keyHex, ivHex, cryptedB64) {
            try {
                const keyBytes = hexToUint8Array(keyHex);
                const ivBytes = hexToUint8Array(ivHex);
                const cipherBytes = base64ToUint8Array(cryptedB64);

                const cryptoKey = await window.crypto.subtle.importKey(
                    "raw", keyBytes, { name: "AES-CBC" }, false, ["decrypt"]
                );

                const decryptedBuffer = await window.crypto.subtle.decrypt(
                    { name: "AES-CBC", iv: ivBytes }, cryptoKey, cipherBytes
                );

                const decoder = new TextDecoder();
                const text = decoder.decode(decryptedBuffer);
                return text.split(/[\r\n]+/).map(s => s.trim()).filter(s => /^https?:\/\//i.test(s));
            } catch (err) {
                console.error('CNL Decrypt Failed:', err);
                return [];
            }
        }

        // 12. Distribute Decrypted URLs across all hosts
        function distributeDecryptedUrls(urls) {
            if (!urls || urls.length === 0) return 0;
            let matchedCount = 0;
            const remainingUrls = [...urls];

            allRowTasks.forEach(task => {
                if (task.finalUrl || task.host === 'Other') return;
                const hostKeyword = task.host.split('.')[0].toLowerCase();
                const idx = remainingUrls.findIndex(u => u.toLowerCase().includes(hostKeyword));
                if (idx !== -1) {
                    const foundUrl = remainingUrls.splice(idx, 1)[0];
                    applySuccessToTask(task, foundUrl);
                    matchedCount++;
                }
            });

            allRowTasks.forEach(task => {
                if (!task.finalUrl && remainingUrls.length > 0) {
                    const foundUrl = remainingUrls.shift();
                    applySuccessToTask(task, foundUrl);
                    matchedCount++;
                }
            });

            updateToolbarState();
            return matchedCount;
        }

        // 13. Locate Click'n'Load Data in DOM
        async function tryClickNLoad() {
            let keyHex = null;
            let cryptedB64 = null;

            const cnlSources = [
                ...document.querySelectorAll('form[onsubmit*="CNLPOP"]'),
                ...document.querySelectorAll('button[onclick*="CNLPOP"]'),
                ...document.querySelectorAll('a[onclick*="CNLPOP"]'),
                ...document.querySelectorAll('script')
            ];

            for (const el of cnlSources) {
                const text = el.tagName.toLowerCase() === 'script' ? el.textContent : (el.getAttribute('onsubmit') || el.getAttribute('onclick') || '');
                if (text && text.includes('CNLPOP')) {
                    const match = text.match(/CNLPOP\s*\(\s*['"][^'"]+['"]\s*,\s*['"]([0-9a-fA-F]{32})['"]\s*,\s*['"]([^'"]+)['"]/);
                    if (match) {
                        keyHex = match[1];
                        cryptedB64 = match[2];
                        break;
                    }
                }
            }

            if (!keyHex || !cryptedB64) {
                const cryptedInput = document.querySelector('input[name="crypted"]');
                const jkInput = document.querySelector('input[name="jk"]');
                if (cryptedInput && jkInput) {
                    cryptedB64 = cryptedInput.value;
                    const jkVal = jkInput.value;

                    const exactMatch = jkVal.match(/return\s*['"]([0-9a-fA-F]{32})['"]/);
                    const fallbackMatch = jkVal.match(/([0-9a-fA-F]{32})/);

                    if (exactMatch) {
                        keyHex = exactMatch[1];
                    } else if (fallbackMatch) {
                        keyHex = fallbackMatch[1];
                    }
                }
            }

            if (!keyHex || !cryptedB64) return null;

            const decryptedLinks = await decryptCNLPayload(keyHex, keyHex, cryptedB64);
            return decryptedLinks.length > 0 ? decryptedLinks : null;
        }

        // 14. Decryption Coordinator
        async function startDecryptionSuite() {
            modeBadge.textContent = 'Checking CNL...';

            try {
                const cnlLinks = await tryClickNLoad();
                if (cnlLinks && cnlLinks.length > 0) {
                    modeBadge.textContent = 'Mode: Instant CNL';
                    modeBadge.style.background = '#064e3b';
                    modeBadge.style.color = '#34d399';
                    modeBadge.style.borderColor = '#10b981';

                    if (decryptGroup) decryptGroup.style.display = 'none';

                    distributeDecryptedUrls(cnlLinks);
                    return;
                }
            } catch (e) {
                console.warn('CNL check failed, running fallback...', e);
            }

            // Fallback: Queue Resolver Mode
            modeBadge.textContent = hostList.length > 0 ? 'Mode: Ready (Select Host)' : 'Mode: Active (No Standard Links)';
            modeBadge.style.background = '#450a0a';
            modeBadge.style.color = '#f87171';
            modeBadge.style.borderColor = '#b91c1c';

            if (decryptGroup && hostList.length > 0) {
                decryptGroup.style.display = 'flex';
            }
        }

        // Modern Clipboard Fallback implementation
        function copyTextToClipboard(text) {
            if (typeof GM_setClipboard !== 'undefined') {
                GM_setClipboard(text, 'text');
            } else if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(text).catch(err => {
                    console.error('Clipboard fallback failed:', err);
                });
            } else {
                const temp = document.createElement('textarea');
                temp.value = text;
                temp.style.position = 'fixed';
                temp.style.opacity = '0';
                document.body.appendChild(temp);
                temp.select();
                try {
                    document.execCommand('copy');
                } catch(e) {
                    console.error('ExecCommand copy failed', e);
                }
                document.body.removeChild(temp);
            }
        }

        // Streamlined Early-Abort Resolver
        function resolveLinkHop(linkUrl, targetHost) {
            return new Promise((resolve) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: linkUrl,
                    timeout: 3000,
                    headers: { 'Referer': window.location.href },
                    onload: function(res) {
                        const html = res.responseText || '';
                        const goMatch = html.match(/['"](https?:\/\/[^'"]+\/Go\/[^'"]+|\/Go\/[^'"]+)['"]/i);

                        if (!goMatch) return resolve(null);

                        const goUrl = new URL(goMatch[1], window.location.origin).href;
                        let settled = false;

                        const client = GM_xmlhttpRequest({
                            method: 'GET',
                            url: goUrl,
                            timeout: 3000,
                            headers: { 'Referer': linkUrl },
                            onreadystatechange: function(stateRes) {
                                if (!settled && stateRes.readyState >= 2 && stateRes.responseHeaders) {
                                    const headerMatch = stateRes.responseHeaders.match(/location:\s*(.+)/i);
                                    if (headerMatch) {
                                        settled = true;
                                        try { client.abort(); } catch(e) {}
                                        return resolve(headerMatch[1].trim());
                                    }
                                }
                            },
                            onload: function(goRes) {
                                if (settled) return;
                                settled = true;

                                let target = '';
                                if (goRes.responseHeaders) {
                                    const headerMatch = goRes.responseHeaders.match(/location:\s*(.+)/i);
                                    if (headerMatch) target = headerMatch[1].trim();
                                }
                                if (!target && goRes.finalUrl && !goRes.finalUrl.includes('/Go/') && !goRes.finalUrl.includes('/Link/')) {
                                    target = goRes.finalUrl;
                                }
                                if (!target && goRes.responseText) {
                                    const base = targetHost.split('.')[0];
                                    const urlPattern = new RegExp(`https?:\\/\\/[^"'\\s<>]+${base}[^"'\\s<>]*`, 'i');
                                    const match = goRes.responseText.match(urlPattern);
                                    if (match) target = match[0];
                                }
                                resolve(target || null);
                            },
                            onerror: function(errRes) {
                                if (settled) return;
                                settled = true;
                                let target = '';
                                if (errRes && errRes.finalUrl && !errRes.finalUrl.includes('/Go/') && !errRes.finalUrl.includes('/Link/')) {
                                    target = errRes.finalUrl;
                                }
                                resolve(target || null);
                            },
                            ontimeout: () => {
                                if (!settled) { settled = true; resolve(null); }
                            }
                        });
                    },
                    onerror: () => resolve(null),
                    ontimeout: () => resolve(null)
                });
            });
        }

        startDecryptionSuite();
    }

    // Launch the init tracker
    initTracker();
})();
