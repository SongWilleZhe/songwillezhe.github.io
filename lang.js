/* EN / DE 语言切换。页面里用 lang="en" 和 lang="de" 成对书写内容。
   链接末尾加 ?lang=de 可直接打开德语版。 */
(function () {
  var root = document.documentElement;
  var ok = function (v) { return v === 'en' || v === 'de'; };
  var fromUrl = new URLSearchParams(location.search).get('lang');
  var saved;
  try { saved = localStorage.getItem('lang'); } catch (e) {}
  var current = ok(fromUrl) ? fromUrl
    : ok(saved) ? saved
    : /^de/i.test(navigator.language) ? 'de' : 'en';

  var style = document.createElement('style');
  style.textContent = [
    'html[data-lang="en"] body [lang="de"], html[data-lang="de"] body [lang="en"] { display: none !important; }',
    '.navigation .nav-links, .navigation .back-link { margin-left: auto; }',
    '.lang-switch { display: flex; border: 1px solid #c5d0da; }',
    '.lang-switch button { background: none; border: 0; padding: 3px 10px; font: 500 12px "IBM Plex Sans", Arial, sans-serif; color: #52606d; cursor: pointer; }',
    '.lang-switch button[aria-pressed="true"] { background: #0b5cad; color: #fff; }',
    '.article h1 { margin-bottom: 40px; padding-bottom: 32px; border-bottom: 1px solid var(--line); }',
    '.article-body .lang-block + .lang-block { margin-top: 0; padding-top: 0; border-top: 0; }',
    '@media (max-width: 700px) { .navigation { flex-wrap: wrap; row-gap: 4px; } .navigation .lang-switch { order: 2; margin-left: auto; } .navigation .nav-links { order: 3; width: 100%; margin: 0; } .navigation .back-link { order: 3; width: 100%; margin: 0; padding-bottom: 8px; } }'
  ].join('\n');
  document.head.appendChild(style);

  var titleEn;
  function apply(lang) {
    current = lang;
    root.lang = lang;
    root.setAttribute('data-lang', lang);
    var titleDe = root.getAttribute('data-title-de');
    if (titleEn === undefined) titleEn = document.title;
    if (titleDe) document.title = lang === 'de' ? titleDe : titleEn;
    document.querySelectorAll('img[data-alt-de]').forEach(function (img) {
      if (!img.hasAttribute('data-alt-en')) img.setAttribute('data-alt-en', img.alt);
      img.alt = img.getAttribute('data-alt-' + lang);
    });
    document.querySelectorAll('.lang-switch button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.value === lang));
    });
    try { localStorage.setItem('lang', lang); } catch (e) {}
  }

  document.addEventListener('DOMContentLoaded', function () {
    var nav = document.querySelector('.navigation');
    if (nav) {
      var box = document.createElement('div');
      box.className = 'lang-switch';
      box.setAttribute('role', 'group');
      box.setAttribute('aria-label', 'Language / Sprache');
      ['en', 'de'].forEach(function (code) {
        var b = document.createElement('button');
        b.type = 'button';
        b.value = code;
        b.textContent = code.toUpperCase();
        b.addEventListener('click', function () {
          apply(code);
          var url = new URL(location.href);
          url.searchParams.set('lang', code);
          history.replaceState(null, '', url);
        });
        box.appendChild(b);
      });
      nav.appendChild(box);
    }
    apply(current);
  });

  apply(current);
})();
