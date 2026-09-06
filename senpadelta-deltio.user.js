// ==UserScript==
// @name         HiddenX on Delt.io (Senpa Delta)
// @namespace    https://senpadelta.vercel.app
// @version      2.0.0
// @description  يشغّل واجهة HiddenX/Senpa جوه delt.io عشان الكابتشا والسيرفر يشتغلوا (Origin = delt.io)
// @author       Senpa Delta
// @match        https://delt.io/*
// @match        https://*.delt.io/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';

  // رابط ملفات الإضافة على Vercel
  const CDN = 'https://senpadelta.vercel.app';

  // السيرفر
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

  // ---------- 1) اعتراض /api/tracker قبل ما الكلاينت يطلبه ----------
  const originalFetch = window.fetch.bind(window);
  window.fetch = function (input, init) {
    const url = typeof input === 'string' ? input : (input && input.url) || '';
    if (url.includes('/api/tracker') || url.endsWith('tracker')) {
      log('tracker intercepted → Delta Dual EU');
      return Promise.resolve(
        new Response(JSON.stringify([SERVER]), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      );
    }
    return originalFetch(input, init);
  };

  // XMLHttpRequest كمان (لو الكلاينت بيستخدمه)
  const origOpen = XMLHttpRequest.prototype.open;
  const origSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    this.__senpaUrl = url;
    return origOpen.call(this, method, url, ...rest);
  };
  XMLHttpRequest.prototype.send = function (...args) {
    if (this.__senpaUrl && String(this.__senpaUrl).includes('tracker')) {
      Object.defineProperty(this, 'status', { get: () => 200 });
      Object.defineProperty(this, 'responseText', {
        get: () => JSON.stringify([SERVER]),
      });
      Object.defineProperty(this, 'response', {
        get: () => JSON.stringify([SERVER]),
      });
      setTimeout(() => {
        this.onload && this.onload();
        this.onreadystatechange && this.onreadystatechange();
      }, 0);
      return;
    }
    return origSend.apply(this, args);
  };

  // ---------- 2) بعد ما الصفحة تبدأ: امسح واجهة Delta وركّب HiddenX ----------
  function bootHiddenX() {
    log('Booting HiddenX UI on delt.io domain...');

    // امسح محتوى الصفحة وركّب هيكل HiddenX
    document.documentElement.innerHTML =
      '<head>' +
      '<meta charset="utf-8"/>' +
      '<meta name="viewport" content="minimal-ui,width=device-width,minimum-scale=1,initial-scale=1,maximum-scale=1,user-scalable=no"/>' +
      '<title>HiddenX · Delta Dual</title>' +
      '<link href="https://fonts.googleapis.com/css?family=Rajdhani:400,500,600|Rubik|Ubuntu:400,500|Roboto:300,400,500,700" rel="stylesheet"/>' +
      '<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.11.1/css/all.css" crossorigin="anonymous"/>' +
      '<link href="' + CDN + '/static/css/main.b6296d95.css" rel="stylesheet"/>' +
      '<style>' +
      'html,body{margin:0;padding:0;height:100%;overflow:hidden;background:#111}' +
      '#captcha-overlay{align-items:center;background:rgba(0,0,0,.55);display:flex;height:100%;justify-content:center;left:0;position:fixed;top:0;visibility:hidden;width:100%;z-index:10000}' +
      '#captcha-overlay.visible{visibility:visible!important}' +
      '#cf-turnstile,.cf-turnstile{background:#1a1a1a;border-radius:8px;padding:16px}' +
      '#senpa-badge{position:fixed;bottom:10px;left:10px;z-index:999999;background:rgba(230,123,190,.95);color:#111;font:600 12px Rajdhani,sans-serif;padding:6px 10px;border-radius:6px;pointer-events:none}' +
      '#primary-inputs{display:flex;gap:6px;overflow:visible}' +
      '#primary-inputs input#name,#primary-inputs input[data-cell2]{flex:1 1 0;min-width:0;max-width:calc(50% - 3px)}' +
      '</style></head><body>' +
      '<canvas id="screen" class="screen"></canvas>' +
      '<div id="ui-root"></div>' +
      '<div id="captcha-overlay" aria-hidden="true"></div>' +
      '<div id="senpa-badge">HiddenX on delt.io · Dual</div>' +
      '</body>';

    // Dual nick helper
    var nickScript = document.createElement('script');
    nickScript.textContent =
      '(function(){const P=(k)=>"cell2Nick:"+k;let last="";const f=()=>{const i=document.querySelector("#primary-inputs input#name");if(!i||i.dataset.cell2)return;i.dataset.cell2=1;const j=i.cloneNode(true);j.placeholder="Cell 2 nickname";j.style.marginLeft="6px";const norm=(s)=>typeof s==="string"&&s.length?s:"";const apply=()=>queueMicrotask(()=>{const a=norm(i.value);if(!a||a===last)return;last=a;const b=norm(localStorage.getItem(P(a))||a+"-2");j.value=b;window.__connNicks=[a,b];});j.oninput=()=>{const a=norm(i.value);const b=norm(j.value);if(!a||!b)return;localStorage.setItem(P(a),b);window.__connNicks=[a,b];};i.parentNode.appendChild(j);setInterval(apply,150);apply();};new MutationObserver(f).observe(document.body,{childList:true,subtree:true});})();';
    document.body.appendChild(nickScript);

    function loadScript(src) {
      return new Promise(function (resolve, reject) {
        var s = document.createElement('script');
        s.src = src;
        s.defer = true;
        s.onload = resolve;
        s.onerror = reject;
        document.body.appendChild(s);
      });
    }

    (async function () {
      try {
        await loadScript(CDN + '/static/js/main.8569eac9.js');
        await loadScript(CDN + '/build/vendors.js');
        await loadScript(CDN + '/build/senpaobs.js');
        log('HiddenX scripts loaded. Origin = delt.io → captcha/WS should work.');
      } catch (e) {
        console.error('[HiddenX→Delta] failed to load scripts', e);
        document.body.insertAdjacentHTML(
          'beforeend',
          '<div style="position:fixed;inset:0;background:#111;color:#e67bbe;display:flex;align-items:center;justify-content:center;font:18px Rajdhani;z-index:999999;text-align:center;padding:20px">فشل تحميل ملفات HiddenX من Vercel.<br/>تأكد إن https://senpadelta.vercel.app شغال.</div>'
        );
      }
    })();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootHiddenX, { once: true });
  } else {
    bootHiddenX();
  }
})();
