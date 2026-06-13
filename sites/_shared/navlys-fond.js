/* ============================================================
   NAVLYS — FOND UNIFIÉ "Présentation vidéo bateau + Écusson animé géant"
   ------------------------------------------------------------
   UN SEUL fichier à inclure sur TOUTES les pages de la famille NAVLYS
   pour obtenir partout le même fond : vidéo bateau en boucle + écusson
   animé géant en filigrane + voile sombre pour la lisibilité.

   Usage (une seule ligne à coller dans <head> ou avant </body>) :
     <script src="/_shared/navlys-fond.js"
             data-video="/assets/navlys-bateau.mp4"
             data-ecusson="/assets/ecusson.png"
             data-poster="/assets/bg-1.jpg"></script>

   - data-video   : la vidéo de fond (la présentation bateau NAVLYS)
   - data-ecusson : l'image de l'écusson animé géant (PNG transparent conseillé)
   - data-poster  : image affichée le temps que la vidéo charge (optionnel)
   - data-opacity : opacité de la vidéo (def. 0.45)

   Si aucune vidéo n'est fournie, bascule automatiquement sur le diaporama
   d'images (hero-bg-slideshow.js) s'il est présent.
   ============================================================ */
(function (global) {
  function init() {
    var me = document.currentScript ||
      document.querySelector('script[src*="navlys-fond"]');
    var cfg = (global.NV_FOND || {});
    var video   = cfg.video   || (me && me.getAttribute('data-video'))   || '';
    var ecusson = cfg.ecusson || (me && me.getAttribute('data-ecusson')) || '';
    var poster  = cfg.poster  || (me && me.getAttribute('data-poster'))  || '';
    var opacity = cfg.opacity || (me && me.getAttribute('data-opacity')) || 0.45;

    if (document.getElementById('nv-fond-css')) return; // une seule fois
    var style = document.createElement('style');
    style.id = 'nv-fond-css';
    style.textContent = [
      'html{background:#02040a}',
      '.nv-fond-video,.nv-fond-poster{position:fixed;inset:0;width:100%;height:100%;',
      '  object-fit:cover;z-index:-4;pointer-events:none}',
      '.nv-fond-video{opacity:' + opacity + ';transition:opacity 1.2s ease}',
      // voile sombre + vignette pour garder le texte lisible PARTOUT
      '.nv-fond-veil{position:fixed;inset:0;z-index:-3;pointer-events:none;',
      '  background:radial-gradient(ellipse at center,rgba(2,4,10,.35) 0%,rgba(2,4,10,.78) 75%,rgba(2,4,10,.95) 100%)}',
      // écusson animé géant en filigrane
      '.nv-fond-ecusson{position:fixed;top:50%;left:50%;width:min(78vw,900px);height:min(78vw,900px);',
      '  transform:translate(-50%,-50%);z-index:-2;pointer-events:none;opacity:.10;',
      '  background-size:contain;background-repeat:no-repeat;background-position:center;',
      '  filter:drop-shadow(0 0 60px rgba(125,211,252,.35));',
      '  animation:nv-ecusson-spin 90s linear infinite, nv-ecusson-breath 8s ease-in-out infinite alternate}',
      '@keyframes nv-ecusson-spin{to{transform:translate(-50%,-50%) rotate(360deg)}}',
      '@keyframes nv-ecusson-breath{0%{opacity:.06}100%{opacity:.16}}',
      '@media (prefers-reduced-motion: reduce){.nv-fond-ecusson{animation:nv-ecusson-breath 8s ease-in-out infinite alternate}}'
    ].join('\n');
    document.head.appendChild(style);

    // 1) Vidéo bateau (ou fallback diaporama)
    if (video) {
      if (poster) {
        var p = document.createElement('div');
        p.className = 'nv-fond-poster';
        p.style.background = "#02040a url('" + poster + "') center/cover no-repeat";
        document.body.appendChild(p);
      }
      var v = document.createElement('video');
      v.className = 'nv-fond-video';
      v.muted = true; v.loop = true; v.autoplay = true;
      v.setAttribute('playsinline', ''); v.setAttribute('aria-hidden', 'true');
      if (poster) v.setAttribute('poster', poster);
      var src = document.createElement('source');
      src.src = video; src.type = 'video/mp4';
      v.appendChild(src);
      document.body.appendChild(v);
      v.play().catch(function () {/* autoplay bloqué : le poster reste affiché */});
    } else if (typeof global.NV_HERO_BG === 'function') {
      global.NV_HERO_BG(['/assets/bg-1.jpg', '/assets/bg-2.jpg', '/assets/bg-3.jpg']);
    }

    // 2) Voile sombre
    var veil = document.createElement('div');
    veil.className = 'nv-fond-veil';
    document.body.appendChild(veil);

    // 3) Écusson animé géant
    if (ecusson) {
      var e = document.createElement('div');
      e.className = 'nv-fond-ecusson';
      e.style.backgroundImage = "url('" + ecusson + "')";
      document.body.appendChild(e);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})(window);
