// ==UserScript==
// @name         Senpa Delta Dual Helper for Delt.io
// @namespace    https://senpadelta.vercel.app
// @version      1.1.0
// @description  Dual / Multibox helpers for Delta servers on delt.io (fast multi spawn + dual nicks + auto server)
// @author       Senpa Delta
// @match        https://delt.io/*
// @match        https://*.delt.io/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  const CONFIG = {
    // السيرفر المطلوب (EU - Delta FFA 2)
    preferredServerName: 'EU - Delta FFA 2',
    preferredHost: 'eu.mi.com:2001',
    // بديل لو FFA 2 مش موجود
    fallbackServerName: 'EU - Multibox',
    // تفعيل 1P+2P تلقائي
    autoEnableDual: true,
    // نيك الخلية التانية
    cell2Suffix: '-2',
  };

  const log = (...args) => console.log('%c[SenpaDelta]', 'color:#e67bbe;font-weight:bold', ...args);

  // ---------- Helpers ----------
  function waitFor(selector, timeout = 15000) {
    return new Promise((resolve, reject) => {
      const el = document.querySelector(selector);
      if (el) return resolve(el);
      const obs = new MutationObserver(() => {
        const found = document.querySelector(selector);
        if (found) {
          obs.disconnect();
          resolve(found);
        }
      });
      obs.observe(document.documentElement, { childList: true, subtree: true });
      setTimeout(() => {
        obs.disconnect();
        reject(new Error('timeout: ' + selector));
      }, timeout);
    });
  }

  function clickEl(el) {
    if (!el) return false;
    el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    el.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    return true;
  }

  // ---------- Dual nickname (Cell 1 + Cell 2) ----------
  function setupDualNicks() {
    // Delta عادة بيستخدم input واحد للنيك
    const nickInput =
      document.querySelector('input[placeholder*="ick" i]') ||
      document.querySelector('input[name="nick"]') ||
      document.querySelector('#nick') ||
      document.querySelector('.nick input') ||
      Array.from(document.querySelectorAll('input[type="text"]')).find((i) =>
        /nick|name|tag/i.test(i.placeholder || i.name || i.id || '')
      );

    if (!nickInput || nickInput.dataset.senpaDual) return;
    nickInput.dataset.senpaDual = '1';

    // خانة نيك الخلية التانية
    const cell2 = nickInput.cloneNode(true);
    cell2.id = 'senpa-cell2-nick';
    cell2.placeholder = 'Cell 2 nickname';
    cell2.style.marginLeft = '6px';
    cell2.value = localStorage.getItem('senpa_cell2_nick') || (nickInput.value || 'Player') + CONFIG.cell2Suffix;

    cell2.addEventListener('input', () => {
      localStorage.setItem('senpa_cell2_nick', cell2.value);
      window.__connNicks = [nickInput.value || '', cell2.value || ''];
    });

    nickInput.addEventListener('input', () => {
      window.__connNicks = [nickInput.value || '', cell2.value || ''];
    });

    // حط الخانة جنب النيك الأصلي
    if (nickInput.parentNode) {
      nickInput.parentNode.style.display = 'flex';
      nickInput.parentNode.style.gap = '6px';
      nickInput.parentNode.appendChild(cell2);
    }

    window.__connNicks = [nickInput.value || '', cell2.value || ''];
    log('Dual nick inputs ready');
  }

  // ---------- Auto enable 1P+2P (Multibox) ----------
  function enableDualToggle() {
    if (!CONFIG.autoEnableDual) return;

    // أزرار 1P / 1P+2P في واجهة Delta
    const candidates = Array.from(document.querySelectorAll('button, div, span, label, a'));
    const dualBtn = candidates.find((el) => {
      const t = (el.textContent || '').trim();
      return t === '1P+2P' || t === '2P' || /multi.?box/i.test(t);
    });

    if (dualBtn && !dualBtn.dataset.senpaClicked) {
      dualBtn.dataset.senpaClicked = '1';
      clickEl(dualBtn);
      log('Enabled 1P+2P / Multibox');
    }
  }

  // ---------- Select preferred server ----------
  function selectPreferredServer() {
    const items = Array.from(document.querySelectorAll('div, li, span, option, button'));
    let target =
      items.find((el) => (el.textContent || '').trim() === CONFIG.preferredServerName) ||
      items.find((el) => (el.textContent || '').includes(CONFIG.preferredServerName)) ||
      items.find((el) => (el.textContent || '').trim() === CONFIG.fallbackServerName);

    if (target && !target.dataset.senpaSelected) {
      target.dataset.senpaSelected = '1';
      clickEl(target);
      log('Selected server:', target.textContent.trim());
      return true;
    }
    return false;
  }

  // ---------- Fill Connect box with host ----------
  function fillConnectHost() {
    const connectInput =
      document.querySelector('input[value*="wss://"]') ||
      document.querySelector('input[placeholder*="wss"]') ||
      Array.from(document.querySelectorAll('input')).find((i) =>
        /wss:\/\//.test(i.value || '')
      );

    if (connectInput) {
      const desired = 'wss://' + CONFIG.preferredHost;
      if (connectInput.value !== desired) {
        connectInput.value = desired;
        connectInput.dispatchEvent(new Event('input', { bubbles: true }));
        connectInput.dispatchEvent(new Event('change', { bubbles: true }));
        log('Set connect host to', desired);
      }
    }
  }

  // ---------- UI badge ----------
  function injectBadge() {
    if (document.getElementById('senpa-delta-badge')) return;
    const badge = document.createElement('div');
    badge.id = 'senpa-delta-badge';
    badge.textContent = 'Senpa Dual ●';
    Object.assign(badge.style, {
      position: 'fixed',
      bottom: '12px',
      left: '12px',
      zIndex: '999999',
      background: 'rgba(230, 123, 190, 0.9)',
      color: '#111',
      font: '600 12px/1 Rajdhani, sans-serif',
      padding: '6px 10px',
      borderRadius: '6px',
      pointerEvents: 'none',
      boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
    });
    document.body.appendChild(badge);
  }

  // ---------- Main loop ----------
  function tick() {
    try {
      setupDualNicks();
      enableDualToggle();
      selectPreferredServer();
      fillConnectHost();
      injectBadge();
    } catch (e) {
      console.warn('[SenpaDelta] tick error', e);
    }
  }

  // ابدأ بعد تحميل الصفحة
  function start() {
    log('Loaded on', location.href);
    tick();
    setInterval(tick, 1500);

    // راقب تغييرات الواجهة
    const obs = new MutationObserver(() => tick());
    obs.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
