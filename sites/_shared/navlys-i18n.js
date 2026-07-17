/**
 * NAVLYS — Moteur i18n multilingue (sites statiques nova-hub)
 * ----------------------------------------------------------------------------
 * 15 langues, sans framework, 100 % navigateur.
 *   fr en es pt it de nl wa ru zh hi bn ar he ur   (ar/he/ur = RTL)
 *
 * Principe (identique au moteur navlys.com d'origine) :
 *   - le FR est la SOURCE ; aucune clé à poser dans le HTML ;
 *   - le moteur parcourt les nœuds de texte + quelques attributs et remplace
 *     le texte trouvé par sa traduction (dictionnaire FR → langue) ;
 *   - langue par défaut = préférence enregistrée (nv-lang) sinon la langue du
 *     navigateur, sinon FR ;
 *   - RTL automatique (dir=rtl) pour arabe / hébreu / ourdou.
 *
 * Les traductions vivent dans « navlys-i18n-data.js » (chargé AVANT ce fichier)
 * qui pose window.NAVLYS_I18N_DATA = { en:{...}, es:{...}, … }.
 * Le FR n'a pas de dictionnaire : c'est le texte d'origine des pages.
 */
(function () {
  'use strict';

  // Registre des langues : code → { nom natif, rtl }
  var LANGS = [
    { code: 'fr', name: 'Français',   rtl: false },
    { code: 'en', name: 'English',    rtl: false },
    { code: 'es', name: 'Español',    rtl: false },
    { code: 'pt', name: 'Português',  rtl: false },
    { code: 'it', name: 'Italiano',   rtl: false },
    { code: 'de', name: 'Deutsch',    rtl: false },
    { code: 'nl', name: 'Nederlands', rtl: false },
    { code: 'wa', name: 'Walon',      rtl: false },
    { code: 'ru', name: 'Русский',    rtl: false },
    { code: 'zh', name: '中文',        rtl: false },
    { code: 'hi', name: 'हिन्दी',       rtl: false },
    { code: 'bn', name: 'বাংলা',       rtl: false },
    { code: 'ar', name: 'العربية',     rtl: true  },
    { code: 'he', name: 'עברית',       rtl: true  },
    { code: 'ur', name: 'اردو',        rtl: true  }
  ];
  var BY_CODE = {};
  LANGS.forEach(function (l) { BY_CODE[l.code] = l; });

  var DATA = (typeof window !== 'undefined' && window.NAVLYS_I18N_DATA) || {};
  var STORE_KEY = 'nv-lang';

  // --- Détection de la langue de départ ---------------------------------
  function normLang(raw) {
    if (!raw) return null;
    var c = String(raw).toLowerCase().slice(0, 2);
    return BY_CODE[c] ? c : null;
  }
  function detectLang() {
    var saved = null;
    try { saved = localStorage.getItem(STORE_KEY); } catch (e) { /* privé */ }
    if (normLang(saved)) return normLang(saved);
    var navs = (navigator.languages && navigator.languages.length)
      ? navigator.languages : [navigator.language || navigator.userLanguage];
    for (var i = 0; i < navs.length; i++) {
      var n = normLang(navs[i]);
      if (n) return n;
    }
    return 'fr';
  }

  var current = 'fr';

  // --- Dictionnaire de la langue courante -------------------------------
  function dictFor(lang) {
    return (lang && lang !== 'fr' && DATA[lang]) ? DATA[lang] : null;
  }

  // --- Traduction d'un texte (préserve les espaces de bord) -------------
  function translate(dict, original) {
    if (!dict) return original;              // FR : texte d'origine
    var key = original.trim();
    if (!key) return original;
    var val = dict[key];
    if (val == null) return original;        // pas de trad → on garde le FR
    var lead = original.match(/^\s*/)[0];
    var tail = original.match(/\s*$/)[0];
    return lead + val + tail;
  }

  var SKIP_TAGS = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, CODE: 1, PRE: 1 };

  // Mémorise le texte FR d'origine pour pouvoir re-traduire / revenir au FR
  function orig(node) {
    if (node.__nvOrig == null) node.__nvOrig = node.nodeValue;
    return node.__nvOrig;
  }
  function origAttr(el, attr) {
    var k = '__nv_' + attr;
    if (el[k] == null) el[k] = el.getAttribute(attr) || '';
    return el[k];
  }

  // --- Parcours des nœuds de texte --------------------------------------
  function walkText(root, dict) {
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        var p = n.parentNode;
        while (p && p.nodeType === 1) {
          if (SKIP_TAGS[p.tagName]) return NodeFilter.FILTER_REJECT;
          if (p.getAttribute && p.getAttribute('data-noi18n') != null) return NodeFilter.FILTER_REJECT;
          p = p.parentNode;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var n;
    while ((n = walker.nextNode())) {
      var o = orig(n);
      var t = translate(dict, o);
      if (t !== n.nodeValue) n.nodeValue = t;
    }
  }

  // --- Attributs traduisibles -------------------------------------------
  var ATTRS = ['placeholder', 'title', 'aria-label', 'alt', 'value'];
  function walkAttrs(root, dict) {
    ATTRS.forEach(function (attr) {
      var sel = '[' + attr + ']';
      var els = root.querySelectorAll(sel);
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        if (attr === 'value' && el.tagName !== 'BUTTON' && el.tagName !== 'INPUT') continue;
        if (attr === 'value' && el.tagName === 'INPUT' &&
            !/^(button|submit|reset)$/i.test(el.type || '')) continue;
        if (el.closest && el.closest('[data-noi18n]')) continue;
        var o = origAttr(el, attr);
        if (!o || !o.trim()) continue;
        var t = translate(dict, o);
        if (t !== el.getAttribute(attr)) el.setAttribute(attr, t);
      }
    });
  }

  // --- <title> + méta description / OG ----------------------------------
  function walkMeta(dict) {
    if (document.title) {
      if (document.__nvTitle == null) document.__nvTitle = document.title;
      document.title = translate(dict, document.__nvTitle);
    }
    var metas = document.querySelectorAll(
      'meta[name="description"],meta[property="og:title"],meta[property="og:description"],meta[name="twitter:title"],meta[name="twitter:description"]'
    );
    for (var i = 0; i < metas.length; i++) {
      var m = metas[i];
      var o = origAttr(m, 'content');
      if (!o) continue;
      m.setAttribute('content', translate(dict, o));
    }
  }

  // --- Nœuds ajoutés après coup (ex. calque « cine ») : on les traduit ---
  var observer = null;
  function startObserver() {
    if (observer || typeof MutationObserver === 'undefined') return;
    observer = new MutationObserver(function (muts) {
      var dict = dictFor(current);
      if (!dict) return;                     // FR : rien à faire
      for (var i = 0; i < muts.length; i++) {
        var added = muts[i].addedNodes;
        for (var j = 0; j < added.length; j++) {
          var node = added[j];
          if (node.nodeType === 1) {         // élément → sous-arbre
            if (node.getAttribute && node.getAttribute('data-noi18n') != null) continue;
            walkText(node, dict);
            walkAttrs(node, dict);
          } else if (node.nodeType === 3) {  // texte isolé
            var o = orig(node);
            var t = translate(dict, o);
            if (t !== node.nodeValue) node.nodeValue = t;
          }
        }
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // --- Application d'une langue ------------------------------------------
  function apply(lang) {
    lang = normLang(lang) || 'fr';
    current = lang;
    var dict = dictFor(lang);
    var meta = BY_CODE[lang] || BY_CODE.fr;
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', meta.rtl ? 'rtl' : 'ltr');
    walkText(document.body, dict);
    walkAttrs(document.body, dict);
    walkMeta(dict);
    updateMenu();
    try { localStorage.setItem(STORE_KEY, lang); } catch (e) { /* privé */ }
    try {
      window.dispatchEvent(new CustomEvent('navlys:lang', { detail: { lang: lang, rtl: meta.rtl } }));
    } catch (e) { /* vieux navigateurs */ }
  }

  // --- Sélecteur de langue (globe, coin haut) ---------------------------
  var menuEl = null, listEl = null, btnEl = null;
  function buildMenu() {
    if (menuEl) return;
    var css = document.createElement('style');
    css.textContent =
      '.nv-lang{position:fixed;top:14px;right:14px;z-index:9999;font-family:Lora,Georgia,serif}' +
      '.nv-lang__btn{display:flex;align-items:center;justify-content:center;cursor:pointer;' +
      'width:38px;height:38px;border:1px solid rgba(95,224,255,.35);' +
      'background:rgba(5,6,10,.72);color:#eef0f6;border-radius:50%;font-size:1.15rem;line-height:1;' +
      'backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}' +
      '.nv-lang__btn:hover{border-color:#5fe0ff;color:#5fe0ff}' +
      '.nv-lang__glb{font-size:1.15rem;line-height:1}' +
      '.nv-lang__list{position:absolute;top:110%;right:0;min-width:168px;max-height:min(70vh,420px);overflow:auto;' +
      'background:rgba(5,6,10,.96);border:1px solid rgba(95,224,255,.3);border-radius:14px;padding:6px;' +
      'box-shadow:0 18px 44px rgba(0,0,0,.5);display:none}' +
      '.nv-lang__list.open{display:block}' +
      '.nv-lang__it{display:block;width:100%;text-align:left;background:none;border:0;color:#cfe0f2;cursor:pointer;' +
      'font:inherit;font-size:.9rem;padding:8px 12px;border-radius:9px}' +
      '.nv-lang__it:hover{background:rgba(95,224,255,.12);color:#fff}' +
      '.nv-lang__it[aria-current="true"]{color:#e9d3a0}' +
      '.nv-lang__it[aria-current="true"]::after{content:" ✓"}' +
      'html[dir="rtl"] .nv-lang{right:auto;left:14px}' +
      'html[dir="rtl"] .nv-lang__list{right:auto;left:0}';
    document.head.appendChild(css);

    menuEl = document.createElement('div');
    menuEl.className = 'nv-lang';
    menuEl.setAttribute('data-noi18n', '');
    btnEl = document.createElement('button');
    btnEl.className = 'nv-lang__btn';
    btnEl.type = 'button';
    btnEl.setAttribute('aria-haspopup', 'true');
    btnEl.setAttribute('aria-expanded', 'false');
    btnEl.innerHTML = '<span class="nv-lang__glb">🌐</span><span class="nv-lang__cur"></span>';
    listEl = document.createElement('div');
    listEl.className = 'nv-lang__list';
    listEl.setAttribute('role', 'menu');
    LANGS.forEach(function (l) {
      var b = document.createElement('button');
      b.className = 'nv-lang__it';
      b.type = 'button';
      b.setAttribute('role', 'menuitem');
      b.setAttribute('data-lang', l.code);
      b.textContent = l.name;
      b.onclick = function () { apply(l.code); close(); };
      listEl.appendChild(b);
    });
    menuEl.appendChild(btnEl);
    menuEl.appendChild(listEl);
    document.body.appendChild(menuEl);

    btnEl.onclick = function (e) {
      e.stopPropagation();
      var open = listEl.classList.toggle('open');
      btnEl.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    document.addEventListener('click', function (e) {
      if (menuEl && !menuEl.contains(e.target)) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }
  function close() {
    if (listEl) { listEl.classList.remove('open'); btnEl.setAttribute('aria-expanded', 'false'); }
  }
  function updateMenu() {
    if (!menuEl) return;
    var cur = BY_CODE[current] || BY_CODE.fr;
    menuEl.querySelector('.nv-lang__cur').textContent = cur.name;
    var items = listEl.querySelectorAll('.nv-lang__it');
    for (var i = 0; i < items.length; i++) {
      items[i].setAttribute('aria-current', items[i].getAttribute('data-lang') === current ? 'true' : 'false');
    }
  }

  // --- Démarrage --------------------------------------------------------
  function init() {
    buildMenu();
    apply(detectLang());
    startObserver();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // --- API publique -----------------------------------------------------
  window.NAVLYS_I18N = {
    set: apply,
    get: function () { return current; },
    langs: function () { return LANGS.slice(); },
    isRtl: function (l) { var m = BY_CODE[l || current]; return !!(m && m.rtl); },
    t: function (frText) { return translate(dictFor(current), frText); }
  };
})();
