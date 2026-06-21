/* ============================================================
   NAVLYS — REVEAL AU SCROLL (animation d'apparition partagée)
   ------------------------------------------------------------
   UNE seule ligne à inclure sur n'importe quelle page :
     <script src="/_shared/navlys-reveal.js" defer></script>

   - Sélectionne automatiquement sections & cartes et les fait
     apparaître au défilement (fondu + translation).
   - Aucune classe à ajouter à la main.
   - Sécurités : si IntersectionObserver absent OU mouvement réduit
     OU souci quelconque → tout est affiché normalement (jamais de
     contenu invisible). Filet de sécurité : tout est révélé après 1.4s.
   ============================================================ */
(function () {
  "use strict";
  var reduce = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Sélecteurs de blocs à animer (cartes & sections de contenu)
  var SEL = [
    "main section", "main article", "section > .glass",
    ".ice-card", ".journal-card", ".glass", ".prod-card",
    ".tl-item", ".step", ".block", ".vframe", ".faq-item"
  ].join(",");

  function run() {
    // Pas d'animation si mouvement réduit ou pas d'IO : on ne touche à rien.
    if (reduce || !("IntersectionObserver" in window)) return;

    var nodes = [];
    try { nodes = Array.prototype.slice.call(document.querySelectorAll(SEL)); }
    catch (e) { return; }
    if (!nodes.length) return;

    // Évite d'animer un élément contenu dans un autre déjà animé (double effet).
    nodes = nodes.filter(function (n) {
      return !nodes.some(function (m) { return m !== n && m.contains(n); });
    });

    var css = document.createElement("style");
    css.textContent =
      ".nv-reveal{opacity:0;transform:translateY(30px);" +
      "transition:opacity .8s cubic-bezier(.2,.7,.2,1),transform .8s cubic-bezier(.2,.7,.2,1)}" +
      ".nv-reveal.nv-in{opacity:1;transform:none}";
    document.head.appendChild(css);

    nodes.forEach(function (n, i) {
      n.classList.add("nv-reveal");
      n.style.transitionDelay = ((i % 4) * 0.08) + "s";
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("nv-in");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    nodes.forEach(function (n) { io.observe(n); });

    // Filet de sécurité : rien ne doit rester caché.
    setTimeout(function () {
      nodes.forEach(function (n) { n.classList.add("nv-in"); });
    }, 1400);

    // Révèle aussi tout ce qui est déjà visible au chargement.
    requestAnimationFrame(function () {
      nodes.forEach(function (n) {
        var r = n.getBoundingClientRect();
        if (r.top < (window.innerHeight || 0) * 0.92) n.classList.add("nv-in");
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else { run(); }
})();
