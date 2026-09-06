// ==UserScript==
// @name         HiddenX on Delt.io
// @namespace    https://senpadelta.vercel.app
// @version      3.0.0
// @description  يشغّل HiddenX كامل من جوه delt.io (Origin + Captcha)
// @author       Senpa Delta
// @match        *://delt.io/*
// @match        *://*.delt.io/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  if (window.__hx3) return;
  window.__hx3 = true;

  const CDN = 'https://senpadelta.vercel.app';
  const SERVER = [{
    id: 0, num_players: 0, max_players: 200, num_spectators: 0,
    count: 'Delta Dual EU', host: 'eu.mi.com:2001', name: 'Delta Dual EU',
    region: 'EU', mode: 'dual', mode_name: 'Dual', version: 'Delta',
  }];

  const log = (...a) => console.log('%c[HiddenX]', 'color:#e67bbe;font-weight:bold', ...a);

  // ---- امنع سكربتات Delta من التحميل ----
  const blocked = /f973b16c|delt\.io\/v7|script_cry|cachep2p|howler/i;
  const obs = new MutationObserver((muts) => {
    for (const m of muts) {
      m.addedNodes.forEach((n) => {
        if (n.tagName === 'SCRIPT') {
          const src = n.src || n.getAttribute('src') || '';
          if (blocked.test(src) || blocked.test(n.textContent || '')) {
            n.type = 'text/blocked';
            n.remove();
          }
        }
      });
    }
  });
  obs.observe(document.documentElement, { childList: true, subtree: true });

  // ---- tracker + assets من CDN ----
  const rawFetch = window.fetch.bind(window);
  window.fetch = function (input, init) {
    try {
      const url = typeof input === 'string' ? input : (input && input.url) || '';
      if (/tracker/i.test(url)) {
        return Promise.resolve(new Response(JSON.stringify(SERVER), {
          status: 200, headers: { 'Content-Type': 'application/json' },
        }));
      }
      const u = new URL(url, location.href);
      const p = u.pathname;
      if (
        /\.wasm$/i.test(p) ||
        /^\/(img|build|static|resources|bundle)/i.test(p) ||
        /\/(shield|logo|food|rainbow|no-skin|favicon)/i.test(p)
      ) {
        let path = p.replace(/^\/v7/, '');
        if (path.startsWith('/ff9') || /\.wasm$/i.test(path)) {
          // wasm الخاص بـ HiddenX
          if (!/bundle\.wasm/i.test(path)) path = '/bundle.wasm';
        }
        const redir = CDN + (path.startsWith('/') ? path : '/' + path);
        return rawFetch(redir, init);
      }
    } catch (_) {}
    return rawFetch(input, init);
  };

  function loadScript(src) {
    return new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = res;
      s.onerror = () => rej(new Error(src));
      document.head.appendChild(s);
    });
  }
  function loadCss(href) {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = href;
    document.head.appendChild(l);
  }

  function boot() {
    obs.disconnect();
    log('Boot 3.0 — HiddenX only');

    // base → CDN
    let base = document.querySelector('base');
    if (!base) {
      base = document.createElement('base');
      document.head.prepend(base);
    }
    base.href = CDN + '/';

    document.title = 'HiddenX · FFA EU 2';
    document.body.innerHTML = '';
    document.body.style.cssText = 'margin:0;background:#111;overflow:hidden;height:100vh;width:100vw';

    loadCss('https://fonts.googleapis.com/css?family=Rajdhani:400,500,600|Rubik|Ubuntu:400,500|Roboto:300,400,500,700');
    loadCss('https://use.fontawesome.com/releases/v5.11.1/css/all.css');
    loadCss(CDN + '/static/css/main.b6296d95.css');

    const st = document.createElement('style');
    st.textContent = `
      html,body{margin:0;height:100%;overflow:hidden;background:#111!important}
      #captcha-overlay{align-items:center;background:rgba(0,0,0,.55);display:flex;height:100%;justify-content:center;
        left:0;position:fixed;top:0;visibility:hidden;width:100%;z-index:10000}
      #captcha-overlay.visible{visibility:visible!important}
      #cf-turnstile,.cf-turnstile{background:#1a1a1a;border-radius:8px;padding:16px}
      #hx-badge{position:fixed;bottom:10px;left:10px;z-index:999999;background:rgba(230,123,190,.95);
        color:#111;font:600 12px Rajdhani,sans-serif;padding:6px 10px;border-radius:6px}
      #primary-inputs{display:flex;gap:6px}
      #primary-inputs input#name,#primary-inputs input[data-cell2]{flex:1;min-width:0;max-width:calc(50% - 3px)}
      canvas.screen{position:fixed;inset:0;width:100%;height:100%}
    `;
    document.head.appendChild(st);

    document.body.insertAdjacentHTML('beforeend', `
      <canvas id="screen" class="screen"></canvas>
      <div id="ui-root"></div>
      <div id="captcha-overlay"></div>
      <div id="hx-badge">HiddenX · FFA EU 2</div>
    `);

    // dual nick
    const ns = document.createElement('script');
    ns.textContent = `(function(){const P=k=>"cell2Nick:"+k;let last="";const f=()=>{const i=document.querySelector("#primary-inputs input#name");if(!i||i.dataset.cell2)return;i.dataset.cell2=1;const j=i.cloneNode(!0);j.placeholder="Cell 2 nickname";j.style.marginLeft="6px";const n=s=>typeof s==="string"&&s.length?s:"";const a=()=>queueMicrotask(()=>{const x=n(i.value);if(!x||x===last)return;last=x;const y=n(localStorage.getItem(P(x))||x+"-2");j.value=y;window.__connNicks=[x,y]});j.oninput=()=>{const x=n(i.value),y=n(j.value);if(!x||!y)return;localStorage.setItem(P(x),y);window.__connNicks=[x,y]};i.parentNode&&i.parentNode.appendChild(j);setInterval(a,150);a()};new MutationObserver(f).observe(document.body,{childList:!0,subtree:!0})})();`;
    document.body.appendChild(ns);

    (async () => {
      try {
        await loadScript(CDN + '/static/js/main.8569eac9.js');
        await loadScript(CDN + '/build/vendors.js');
        log('HiddenX ready — اضغط Play');
      } catch (e) {
        console.error(e);
        document.getElementById('hx-badge').textContent = 'خطأ تحميل — شوف Console';
      }
    })();
  }

  if (document.body) boot();
  else document.addEventListener('DOMContentLoaded', boot, { once: true });
  // احتياطي
  setTimeout(() => {
    if (!document.getElementById('hx-badge')) boot();
  }, 3000);
})();
