// ==UserScript==
// @name         HiddenX on Delt.io (Senpa Delta)
// @namespace    https://senpadelta.vercel.app
// @version      2.2.0
// @description  HiddenX UI on delt.io domain (fixes asset paths + wasm)
// @author       Senpa Delta
// @match        *://delt.io/*
// @match        *://*.delt.io/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  if (window.__hiddenxBooted) return;
  window.__hiddenxBooted = true;

  const CDN = 'https://senpadelta.vercel.app';
  const SERVER = {
    id: 0,
    num_players: 0,
    max_players: 200,
    num_spectators: 0,
    count: 'Delta Dual EU',
    host: 'eu.mi.com:2001',
    name: 'Delta Dual EU',
    region: 'EU',
    mode: 'dual',
    mode_name: 'Dual',
    version: 'Delta',
  };

  const log = (...a) => console.log('%c[HiddenX→Delta]', 'color:#e67bbe;font-weight:bold', ...a);

  // ---------- tracker intercept ----------
  const originalFetch = window.fetch.bind(window);
  window.fetch = function (input, init) {
    try {
      let url = typeof input === 'string' ? input : (input && input.url) || '';

      // tracker
      if (url.includes('/api/tracker') || /\/tracker(\?|$)/i.test(url)) {
        log('tracker → Delta Dual EU');
        return Promise.resolve(
          new Response(JSON.stringify([SERVER]), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        );
      }

      // أعد توجيه الأصول النسبية لملفات HiddenX إلى CDN
      // أمثلة: /img/..., /build/..., /static/..., /bundle.wasm, /v7/bundle.wasm
      const abs = new URL(url, location.href);
      const path = abs.pathname;
      if (
        path.endsWith('.wasm') ||
        path.startsWith('/img/') ||
        path.startsWith('/build/') ||
        path.startsWith('/static/') ||
        path.startsWith('/resources/') ||
        /bundle\.wasm$/i.test(path) ||
        /\/(shield|logo-med|food-bg|rainbow|no-skin)\.png$/i.test(path)
      ) {
        const redirected = CDN + path.replace(/^\/v7/, '');
        log('asset redirect', path, '→', redirected);
        return originalFetch(redirected, init);
      }
    } catch (_) {}
    return originalFetch(input, init);
  };

  // ---------- helpers ----------
  function loadCss(href) {
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = href;
    document.head.appendChild(l);
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.async = false;
      s.onload = () => resolve();
      s.onerror = (e) => reject(new Error('script fail: ' + src));
      document.head.appendChild(s);
    });
  }

  function boot() {
    log('Boot v2.2 — replacing UI');

    // base href يخلي المسارات النسبية تروح لـ Vercel
    let base = document.querySelector('base');
    if (!base) {
      base = document.createElement('base');
      document.head.insertBefore(base, document.head.firstChild);
    }
    base.href = CDN + '/';

    document.title = 'HiddenX · Delta Dual';
    document.body.innerHTML = '';
    document.body.style.cssText =
      'margin:0;padding:0;overflow:hidden;background:#111;height:100vh;width:100vw';

    loadCss('https://fonts.googleapis.com/css?family=Rajdhani:400,500,600|Rubik|Ubuntu:400,500|Roboto:300,400,500,700');
    loadCss('https://use.fontawesome.com/releases/v5.11.1/css/all.css');
    loadCss(CDN + '/static/css/main.b6296d95.css');

    const style = document.createElement('style');
    style.textContent = `
      html,body{margin:0;padding:0;height:100%;overflow:hidden;background:#111!important}
      #captcha-overlay{align-items:center;background:rgba(0,0,0,.55);display:flex;height:100%;justify-content:center;left:0;position:fixed;top:0;visibility:hidden;width:100%;z-index:10000}
      #captcha-overlay.visible{visibility:visible!important}
      #cf-turnstile,.cf-turnstile{background:#1a1a1a;border-radius:8px;padding:16px}
      #senpa-badge{position:fixed;bottom:10px;left:10px;z-index:999999;background:rgba(230,123,190,.95);color:#111;font:600 12px Rajdhani,sans-serif;padding:6px 10px;border-radius:6px;pointer-events:none}
      #primary-inputs{display:flex;gap:6px;overflow:visible}
      #primary-inputs input#name,#primary-inputs input[data-cell2]{flex:1 1 0;min-width:0;max-width:calc(50% - 3px)}
      canvas.screen{position:fixed;inset:0;width:100%;height:100%}
    `;
    document.head.appendChild(style);

    const canvas = document.createElement('canvas');
    canvas.id = 'screen';
    canvas.className = 'screen';
    document.body.appendChild(canvas);

    const ui = document.createElement('div');
    ui.id = 'ui-root';
    document.body.appendChild(ui);

    const captcha = document.createElement('div');
    captcha.id = 'captcha-overlay';
    document.body.appendChild(captcha);

    const badge = document.createElement('div');
    badge.id = 'senpa-badge';
    badge.textContent = 'HiddenX on delt.io · Dual';
    document.body.appendChild(badge);

    // Dual nick
    const nickScript = document.createElement('script');
    nickScript.textContent = `
      (function(){
        const P=(k)=>"cell2Nick:"+k; let last="";
        const f=()=>{
          const i=document.querySelector("#primary-inputs input#name");
          if(!i||i.dataset.cell2) return;
          i.dataset.cell2=1;
          const j=i.cloneNode(true);
          j.placeholder="Cell 2 nickname";
          j.style.marginLeft="6px";
          const norm=(s)=>typeof s==="string"&&s.length?s:"";
          const apply=()=>queueMicrotask(()=>{
            const a=norm(i.value); if(!a||a===last) return; last=a;
            const b=norm(localStorage.getItem(P(a))||a+"-2");
            j.value=b; window.__connNicks=[a,b];
          });
          j.oninput=()=>{const a=norm(i.value),b=norm(j.value); if(!a||!b)return;
            localStorage.setItem(P(a),b); window.__connNicks=[a,b];};
          i.parentNode&&i.parentNode.appendChild(j);
          setInterval(apply,150); apply();
        };
        new MutationObserver(f).observe(document.body,{childList:true,subtree:true});
      })();
    `;
    document.body.appendChild(nickScript);

    (async () => {
      try {
        log('Loading main...');
        await loadScript(CDN + '/static/js/main.8569eac9.js');
        log('Loading vendors...');
        await loadScript(CDN + '/build/vendors.js');
        log('Loading senpaobs...');
        await loadScript(CDN + '/build/senpaobs.js');
        log('Ready. Press Play.');
      } catch (e) {
        console.error('[HiddenX→Delta]', e);
        badge.textContent = 'Load error — check Console';
        badge.style.background = '#c0392b';
        badge.style.color = '#fff';
      }
    })();
  }

  if (document.body) boot();
  else document.addEventListener('DOMContentLoaded', boot, { once: true });
})();
