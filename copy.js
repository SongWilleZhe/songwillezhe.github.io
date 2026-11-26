/* 邮箱 / 微信复制按钮。页面里写：<div class="copy-row" data-copy-buttons></div>
   邮箱或微信号有变化时，只改下面两行。 */
(function () {
  var items = [
    { name: 'Email', value: 'martina_song@163.com' },
    { name: 'WeChat', value: 'songzhe_martina' }
  ];

  var style = document.createElement('style');
  style.textContent = [
    '.copy-row { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 32px; }',
    '.copy-row.center { justify-content: center; }',
    '.copy-btn { position: relative; display: inline-flex; align-items: center; gap: 8px; max-width: 100%; cursor: pointer; border: 0; padding: 0; background: none; color: #16202b; font: 500 14px/1.2 "IBM Plex Sans", "Segoe UI", Arial, sans-serif; text-align: left; }',
    '.copy-name { color: #52606d; font: 400 12px/1.2 "IBM Plex Mono", Consolas, monospace; }',
    '.copy-value { overflow-wrap: anywhere; }',
    '.copy-btn svg { flex: none; width: 15px; height: 15px; fill: none; stroke: #0b5cad; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }',
    '.copy-btn:hover .copy-value { color: #0b5cad; }',
    '.copy-btn .check, .copy-btn.copied .pages { display: none; }',
    '.copy-btn.copied .check { display: inline; }',
    '.copy-tip { position: absolute; right: 0; bottom: calc(100% + 3px); padding: 2px 7px; border-radius: 4px; background: #16202b; color: #fff; font-size: 12px; font-weight: 400; white-space: nowrap; pointer-events: none; opacity: 0; transition: opacity .15s; }',
    '.copy-btn.copied .copy-tip { opacity: 1; }',
    '.cta-title + .copy-row, .footer-title + .copy-row { margin-top: 24px; }',
    '@media (max-width: 700px) { .copy-btn { padding: 5px 0; } .copy-row { gap: 2px 28px; } }'
  ].join('\n');
  document.head.appendChild(style);

  /* 旧浏览器或应用内浏览器的备用复制方法 */
  function fallback(text) {
    var box = document.createElement('textarea');
    box.value = text;
    box.setAttribute('readonly', '');
    box.style.position = 'fixed';
    box.style.opacity = '0';
    document.body.appendChild(box);
    box.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) {}
    document.body.removeChild(box);
    return ok;
  }

  function copy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(
        function () { return true; },
        function () { return fallback(text); });
    }
    return Promise.resolve(fallback(text));
  }

  function build(item) {
    var button = document.createElement('button');
    button.type = 'button';
    button.className = 'copy-btn';
    button.title = 'Copy / Kopieren';
    button.innerHTML = '<span class="copy-name"></span><span class="copy-value"></span>' +
      '<svg viewBox="0 0 16 16" aria-hidden="true">' +
      '<g class="pages"><rect x="5.5" y="5.5" width="8" height="8" rx="1.5"/><path d="M10.5 3.5v-.3c0-.7-.5-1.2-1.2-1.2H3.2C2.5 2 2 2.5 2 3.2v6.1c0 .7.5 1.2 1.2 1.2h.3"/></g>' +
      '<path class="check" d="M3 8.5l3.2 3.2L13 4.8"/></svg>' +
      '<span class="copy-tip" aria-live="polite"></span>';
    button.querySelector('.copy-name').textContent = item.name;
    button.querySelector('.copy-value').textContent = item.value;
    var tip = button.querySelector('.copy-tip');
    var timer;
    button.addEventListener('click', function () {
      copy(item.value).then(function (ok) {
        if (!ok) { window.prompt('Copy / Kopieren:', item.value); return; }
        tip.textContent = document.documentElement.lang === 'de' ? 'Kopiert' : 'Copied';
        button.classList.add('copied');
        clearTimeout(timer);
        timer = setTimeout(function () { button.classList.remove('copied'); tip.textContent = ''; }, 2000);
      });
    });
    return button;
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-copy-buttons]').forEach(function (row) {
      items.forEach(function (item) { row.appendChild(build(item)); });
    });
  });
})();
