// ==UserScript==
// @name         HiddenX on Delt.io
// @namespace    https://senpadelta.vercel.app
// @version      3.2.0
// @description  HiddenX full replace on delt.io via document.write
// @author       Senpa Delta
// @match        *://delt.io/*
// @match        *://*.delt.io/*
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
  'use strict';
  if (window.__hx32) return;
  window.__hx32 = true;

  const CDN = 'https://senpadelta.vercel.app';

  // امنع أي تنقل بعيد عن delt.io
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"/>
<base href="${CDN}/"/>
<title>HiddenX · FFA EU 2</title>
<link href="https://fonts.googleapis.com/css?family=Rajdhani:400,500,600|Rubik|Ubuntu:400,500|Roboto:300,400,500,700" rel="stylesheet"/>
<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.11.1/css/all.css" crossorigin="anonymous"/>
<link href="${CDN}/static/css/main.b6296d95.css" rel="stylesheet"/>
<style>
html,body{margin:0;height:100%;overflow:hidden;background:#111}
#captcha-overlay{align-items:center;background:rgba(0,0,0,.55);display:flex;height:100%;justify-content:center;left:0;position:fixed;top:0;visibility:hidden;width:100%;z-index:10000}
#captcha-overlay.visible{visibility:visible!important}
#cf-turnstile,.cf-turnstile{background:#1a1a1a;border-radius:8px;padding:16px}
#hx-badge{position:fixed;bottom:10px;left:10px;z-index:999999;background:rgba(230,123,190,.95);color:#111;font:600 12px Rajdhani,sans-serif;padding:6px 10px;border-radius:6px}
#primary-inputs{display:flex;gap:6px}
#primary-inputs input#name,#primary-inputs input[data-cell2]{flex:1;min-width:0;max-width:calc(50% - 3px)}
canvas.screen{position:fixed;inset:0;width:100%;height:100%}
</style>
</head>
<body>
<canvas id="screen" class="screen"></canvas>
<div id="ui-root"></div>
<div id="captcha-overlay"></div>
<div id="hx-badge">HiddenX · FFA EU 2</div>
<script>
(function(){
  var CDN = "${CDN}";
  var SERVER = [{id:0,num_players:0,max_players:200,num_spectators:0,count:"Delta Dual EU",host:"eu.mi.com:2001",name:"Delta Dual EU",region:"EU",mode:"dual",mode_name:"Dual",version:"Delta"}];
  var rf = window.fetch.bind(window);
  window.fetch = function(input, init){
    try {
      var url = typeof input === "string" ? input : (input && input.url) || "";
      if (/tracker/i.test(url)) {
        return Promise.resolve(new Response(JSON.stringify(SERVER), {status:200, headers:{"Content-Type":"application/json"}}));
      }
      var u = new URL(url, location.href);
      var p = u.pathname.replace(/^\\/v7/, "");
      if (/\\.wasm$/i.test(p) || /^\\/(img|build|static|resources)/i.test(p) || /bundle\\.wasm|shield|logo-med|food-bg|rainbow|no-skin/i.test(p)) {
        if (/\\.wasm$/i.test(p) && !/bundle\\.wasm/i.test(p)) p = "/bundle.wasm";
        return rf(CDN + p, init);
      }
    } catch(e) {}
    return rf(input, init);
  };
  // dual nick
  (function(){
    var P=function(k){return "cell2Nick:"+k}; var last="";
    var f=function(){
      var i=document.querySelector("#primary-inputs input#name");
      if(!i||i.dataset.cell2) return;
      i.dataset.cell2=1;
      var j=i.cloneNode(true);
      j.placeholder="Cell 2 nickname"; j.style.marginLeft="6px";
      var n=function(s){return typeof s==="string"&&s.length?s:""};
      var apply=function(){queueMicrotask(function(){
        var a=n(i.value); if(!a||a===last) return; last=a;
        var b=n(localStorage.getItem(P(a))||a+"-2");
        j.value=b; window.__connNicks=[a,b];
      })};
      j.oninput=function(){var a=n(i.value),b=n(j.value); if(!a||!b)return; localStorage.setItem(P(a),b); window.__connNicks=[a,b]};
      if(i.parentNode) i.parentNode.appendChild(j);
      setInterval(apply,150); apply();
    };
    new MutationObserver(f).observe(document.body,{childList:true,subtree:true});
  })();
  console.log("%c[HiddenX] document rewritten — loading app", "color:#e67bbe;font-weight:bold");
})();
</script>
<script defer src="${CDN}/static/js/main.8569eac9.js"></script>
<script defer src="${CDN}/build/vendors.js"></script>
</body>
</html>`;

  function rewrite() {
    try {
      document.open();
      document.write(html);
      document.close();
      console.log('%c[HiddenX] rewrite done', 'color:#e67bbe;font-weight:bold');
    } catch (e) {
      console.error('[HiddenX] rewrite failed', e);
    }
  }

  // نفّذ في أقرب فرصة
  if (document.readyState === 'loading') {
    // document-start: استنى لحظة قصيرة
    setTimeout(rewrite, 0);
  } else {
    rewrite();
  }
})();
