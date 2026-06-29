/* ============================================================
   NAVLYS — CINÉ-SCROLL (présentation mobile-app)
   ------------------------------------------------------------
   Vidéo NETTE plein-haut (≈3/4 écran, sans floutage) où défilent
   les clips NAVLYS en HD + son/voix, et le contenu qui glisse
   par-dessus en "sheet" (effet application). Mobile-first.

   Usage (une ligne, avant </body>) :
     <script src="../_shared/navlys-cine.js"
        data-video="/assets/navlys-bateau.mp4"
        data-poster="/assets/bg-1.jpg"
        data-voix="/assets/voix-intro.mp3"
        data-kicker="Sous-titre"
        data-title="TITRE <em>stylé</em>"
        data-tag="Accroche en italique."
        data-hide=".prelude,.hero"></script>

   - data-hide : sélecteur(s) de l'ancien hero à masquer (évite le doublon)
   - si la vidéo est absente, le poster s'affiche (structure prête).
   ============================================================ */
(function () {
  function init() {
    var me = document.currentScript ||
      document.querySelector('script[src*="navlys-cine"]');
    if (!me || document.getElementById('nv-cine')) return;
    var g = function (k, d) { return me.getAttribute('data-' + k) || d; };
    var video = g('video', ''), poster = g('poster', ''), voix = g('voix', '');
    var kicker = g('kicker', ''), title = g('title', ''), tag = g('tag', '');
    var hide = g('hide', '');

    // 1) CSS (couleurs via variables du site, avec fallbacks)
    var css = [
      'html{background:var(--noir,#02040a)}',
      '.nv-cine{position:fixed;top:0;left:0;right:0;height:var(--nv-cine-h,74vh);z-index:1;overflow:hidden;background:#000}',
      '.nv-cine video,.nv-cine .nv-poster{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}',
      '.nv-cine .nv-poster{background:#02040a center/cover no-repeat}',
      '.nv-cine .nv-grad{position:absolute;inset:0;z-index:2;pointer-events:none;background:linear-gradient(180deg,rgba(2,4,10,.28),transparent 26%,transparent 58%,rgba(2,4,10,.9) 100%)}',
      '.nv-cine .nv-stage{position:absolute;left:0;right:0;bottom:0;z-index:3;padding:0 20px 30px;text-align:center}',
      ".nv-cine .nv-kick{font-family:'Cinzel',serif;letter-spacing:.38em;text-transform:uppercase;font-size:11px;color:var(--or,#C9A961);margin-bottom:10px}",
      ".nv-cine .nv-title{font-family:'Cormorant Garamond',serif;font-weight:400;font-size:clamp(40px,11vw,86px);line-height:.95;color:#fff;text-shadow:0 6px 34px rgba(0,0,0,.65);margin-bottom:10px}",
      '.nv-cine .nv-title em{font-style:italic;color:var(--or,#C9A961)}',
      ".nv-cine .nv-tag{font-family:'Cormorant Garamond',serif;font-style:italic;font-size:clamp(17px,4.4vw,24px);color:var(--perle-doux,#bcc9d1);text-shadow:0 2px 16px rgba(0,0,0,.6)}",
      '.nv-cine .nv-sound{position:absolute;top:max(env(safe-area-inset-top),12px);right:14px;margin-top:54px;z-index:5;width:48px;height:48px;border-radius:50%;border:1.5px solid rgba(125,211,252,.5);background:rgba(2,4,10,.5);backdrop-filter:blur(8px);color:var(--ice-clair,#a8e3ff);font-size:19px;display:flex;align-items:center;justify-content:center;cursor:pointer;animation:nvpulse 2.6s ease-in-out infinite}',
      '@keyframes nvpulse{0%,100%{box-shadow:0 0 0 0 rgba(125,211,252,.4)}50%{box-shadow:0 0 0 10px rgba(125,211,252,0)}}',
      ".nv-cine .nv-hint{position:absolute;left:50%;bottom:14px;transform:translateX(-50%);z-index:3;font-family:'Cinzel',serif;font-size:10px;letter-spacing:.4em;text-transform:uppercase;color:var(--perle-doux,#bcc9d1);animation:nvbob 3s ease-in-out infinite}",
      '@keyframes nvbob{0%,100%{opacity:.35;transform:translateX(-50%) translateY(0)}50%{opacity:.95;transform:translateX(-50%) translateY(5px)}}',
      '.nv-sheet{position:relative;z-index:2;margin-top:calc(var(--nv-cine-h,74vh) - 26px);background:var(--noir,#02040a);border-radius:26px 26px 0 0;box-shadow:0 -26px 70px rgba(0,0,0,.7);border-top:1px solid rgba(125,211,252,.25);min-height:48vh}',
      '.nv-sheet::before{content:"";display:block;width:46px;height:5px;border-radius:3px;background:rgba(125,211,252,.4);margin:12px auto 4px}',
      '@media(min-width:980px){:root{--nv-cine-h:80vh}}',
      '@media(prefers-reduced-motion:reduce){.nv-cine .nv-sound,.nv-cine .nv-hint{animation:none}}'
    ].join('\n');
    var st = document.createElement('style'); st.id = 'nv-cine-css';
    st.textContent = css; document.head.appendChild(st);

    // 2) Masquer l'ancien hero pour éviter le doublon
    if (hide) {
      try { document.querySelectorAll(hide).forEach(function (el) { el.style.display = 'none'; }); }
      catch (e) {}
    }

    // 3) Construire la scène ciné
    var cine = document.createElement('div');
    cine.className = 'nv-cine'; cine.id = 'nv-cine';
    var html = '';
    if (video) {
      html += '<video autoplay muted loop playsinline ' +
        (poster ? 'poster="' + poster + '" ' : '') + 'id="nv-vid">' +
        '<source src="' + video + '" type="video/mp4"></video>';
    } else if (poster) {
      html += '<div class="nv-poster" style="background-image:url(\'' + poster + '\')"></div>';
    }
    html += '<div class="nv-grad"></div>';
    html += '<button class="nv-sound" id="nv-snd" aria-label="Activer le son et la voix">🔇</button>';
    if (voix) html += '<audio id="nv-voix" src="' + voix + '" preload="auto"></audio>';
    html += '<div class="nv-stage">';
    if (kicker) html += '<div class="nv-kick">' + kicker + '</div>';
    if (title) html += '<div class="nv-title">' + title + '</div>';
    if (tag) html += '<div class="nv-tag">' + tag + '</div>';
    html += '</div>';
    html += '<div class="nv-hint">↓ Faire défiler</div>';
    cine.innerHTML = html;

    // 4) Déplacer le contenu (non fixe) dans la "sheet"
    var sheet = document.createElement('main'); sheet.className = 'nv-sheet';
    Array.prototype.slice.call(document.body.children).forEach(function (el) {
      if (el === me || el.tagName === 'SCRIPT' || el.tagName === 'STYLE') return;
      var pos = '';
      try { pos = getComputedStyle(el).position; } catch (e) {}
      if (pos === 'fixed') return; // laisser navs + fonds fixes en place
      sheet.appendChild(el);
    });
    document.body.insertBefore(cine, document.body.firstChild);
    document.body.appendChild(sheet);

    // 5) Son + voix au tap (les navigateurs bloquent le son auto)
    var b = document.getElementById('nv-snd'),
        v = document.getElementById('nv-voix'),
        vid = document.getElementById('nv-vid'), on = false;
    if (b) b.addEventListener('click', function () {
      on = !on;
      if (on) { if (vid) vid.muted = false; if (v) { v.currentTime = 0; v.play()['catch'](function () {}); } b.textContent = '🔊'; }
      else { if (vid) vid.muted = true; if (v) v.pause(); b.textContent = '🔇'; }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
