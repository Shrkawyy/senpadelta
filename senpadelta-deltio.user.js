// ==UserScript==
// @name         HiddenX on Delt.io
// @namespace    https://senpadelta.vercel.app
// @version      3.1.0
// @description  HiddenX كامل على delt.io — FFA EU 2
// @author       Senpa Delta
// @match        *://delt.io/*
// @match        *://*.delt.io/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';
  if (window.__hx31) return;
  window.__hx31 = true;

  const CDN = 'https://senpadelta.vercel.app';
  const SERVER = [{
    id: 0, num_players: 0, max_players: 200, num_spectators: 0,
    count: 'Delta Dual EU', host: 'eu.mi.com:2001', name: 'Delta Dual EU',
    region: 'EU', mode: 'dual', mode_name: 'Dual', version: 'Delta',
  }];
  const log = (...a) => console.log('%c[HiddenX]', 'color:#e67bbe;font-weight:bold', ...a);

  // منع سكربتات Delta
  const bad = /f973b16c|script_cry|cachep2p|howler\.min|delt\.io\/v7/i;
  new MutationObserver((ms) => {
    ms.forEach((m) => m.addedNodes.forEach((n) => {
      if (n.tagName === 'SCRIPT') {
        const s = n.src || n.textContent || '';
        if (bad.test(s)) { n.type = 'text/plain'; n.remove(); }
      }
    }));
  }).observe(document.documentElement, { childList: true, subtree: true });

  // fetch: tracker + assets
  const rf = window.fetch.bind(window);
  window.fetch = function (input, init) {
    try {
      const url = typeof input === 'string' ? input : (input && input.url) || '';
      if (/tracker/i.test(url)) {
        return Promise.resolve(new Response(JSON.stringify(SERVER), {
          status: 200, headers: { 'Content-Type': 'application/json' },
        }));
      }
      const u = new URL(url, location.href);
      let p = u.pathname.replace(/^\/v7/, '');
      if (/\.wasm$/i.test(p) || /^\/(img|build|static|resources)/i.test(p) ||
          /bundle\.wasm|shield|logo-med|food-bg|rainbow|no-skin/i.test(p)) {
        if (/\.wasm$/i.test(p) && !/bundle\.wasm/i.test(p)) p = '/bundle.wasm';
        return rf(CDN + p, init);
      }
    } catch (_) {}
    return rf(input, init);
  };

  function css(href) {
    const l = document.createElement('link');
    l.rel = 'stylesheet'; l.href = href;
    document.head.appendChild(l);
  }
  function js(src) {
    return new Promise((ok, err) => {
      const s = document.createElement('script');
      s.src = src; s.onload = ok; s.onerror = () => err(new Error(src));
      document.head.appendChild(s);
    });
  }

  let booted = false;
  function boot() {
    if (booted) return;
    booted = true;
    log('Boot 3.1');

    // أوقف أي تايمرات/أنيميشن من Delta قدر الإمكان
    const highest = setTimeout(() => {}, 0);
    for (let i = 0; i < highest; i++) clearTimeout(i);

    let base = document.querySelector('base');
    if (!base) { base = document.createElement('base'); document.head.prepend(base); }
    base.href = CDN + '/';

    document.title = 'HiddenX · FFA EU 2';

    // امسح الصفحة بالكامل
    document.body.innerHTML = '';
    document.body.style.cssText = 'margin:0;background:#111;overflow:hidden;height:100vh;width:100vw';

    // امسح ستايلات Delta القديمة
    [...document.querySelectorAll('style, link[rel=stylesheet]')].forEach((el) => {
      const h = el.href || el.textContent || '';
      if (/delt|f973|v7/i.test(h) && !/senpadelta|fontawesome|googleapis|b6296d95/i.test(h)) el.remove();
    });

    css('https://fonts.googleapis.com/css?family=Rajdhani:400,500,600|Rubik|Ubuntu:400,500|Roboto:300,400,500,700');
    css('https://use.fontawesome.com/releases/v5.11.1/css/all.css');
    css(CDN + '/static/css/main.b6296d95.css');

    const st = document.createElement('style');
    st.id = 'hx-style';
    st.textContent = `
      html,body{margin:0!important;height:100%!important;overflow:hidden!important;background:#111!important}
      #captcha-overlay{align-items:center;background:rgba(0,0,0,.55);display:flex;height:100%;justify-content:center;
        left:0;position:fixed;top:0;visibility:hidden;width:100%;z-index:10000}
      #captcha-overlay.visible{visibility:visible!important}
      #cf-turnstile,.cf-turnstile{background:#1a1a1a;border-radius:8px;padding:16px}
      #hx-badge{position:fixed;bottom:10px;left:10px;z-index:999999;background:rgba(230,123,190,.95);
        color:#111;font:600 12px Rajdhani,sans-serif;padding:6px 10px;border-radius:6px}
      #primary-inputs{display:flex;gap:6px}
      #primary-inputs input#name,#primary-inputs input[data-cell2]{flex:1;min-width:0;max-width:calc(50% - 3px)}
      canvas.screen{position:fixed;inset:0;width:100%;height:100%;z-index:1}
      #ui-root{position:relative;z-index:2}
    `;
    document.head.appendChild(st);

    document.body.innerHTML = `
      <canvas id="screen" class="screen"></canvas>
      <div id="ui-root"></div>
      <div id="captcha-overlay"></div>
      <div id="hx-badge">HiddenX · FFA EU 2</div>
    `;

    // dual nick
    const ns = document.createElement('script');
    ns.textContent = `(function(){const P=k=>"cell2Nick:"+k;let last="";const f=()=>{const i=document.querySelector("#primary-inputs input#name");if(!i||i.dataset.cell2)return;i.dataset.cell2=1;const j=i.cloneNode(!0);j.placeholder="Cell 2 nickname";j.style.marginLeft="6px";const n=s=>typeof s==="string"&&s.length?s:"";const a=()=>queueMicrotask(()=>{const x=n(i.value);if(!x||x===last)return;last=x;const y=n(localStorage.getItem(P(x))||x+"-2");j.value=y;window.__connNicks=[x,y]});j.oninput=()=>{const x=n(i.value),y=n(j.value);if(!x||!y)return;localStorage.setItem(P(x),y);window.__connNicks=[x,y]};i.parentNode&&i.parentNode.appendChild(j);setInterval(a,150);a()};new MutationObserver(f).observe(document.body,{childList:!0,subtree:!0})})();`;
    document.body.appendChild(ns);

    // لو Delta حاول يرجع يرسم حاجة — امسحها
    const guard = new MutationObserver(() => {
      document.querySelectorAll('body > *:not(#screen):not(#ui-root):not(#captcha-overlay):not(#hx-badge):not(script):not(style)').forEach((el) => {
        const t = (el.textContent || '').trim();
        if (/^Delt\.io|Loading\.\.\./i.test(t) || el.id === 'loader') el.remove();
      });
    });
    guard.observe(document.body, { childList: true });

    (async () => {
      try {
        log('loading main...');
        await js(CDN + '/static/js/main.8569eac9.js');
        log('loading vendors...');
        await js(CDN + '/build/vendors.js');
        log('Ready — اضغط Play');
        // بعد ثانيتين تأكد إن الواجهة ظاهرة
        setTimeout(() => {
          const ui = document.getElementById('ui-root');
          if (ui && ui.children.length === 0) {
            log('UI root empty — retry mount hint');
          }
        }, 2000);
      } catch (e) {
        console.error('[HiddenX]', e);
        const b = document.getElementById('hx-badge');
        if (b) b.textContent = 'Load error';
      }
    })();
  }

  // شغّل بعد ما الصفحة تهدى شوية عشان Delta ميكملش تحميل
  function schedule() {
    if (document.body) {
      // استنى شوية ثم امسح
      setTimeout(boot, 800);
    } else {
      document.addEventListener('DOMContentLoaded', () => setTimeout(boot, 500), { once: true });
    }
  }
  schedule();
  // احتياطي
  setTimeout(() => { if (!booted) boot(); }, 4000);
})();
