# NAVLYS — Socle unique des sites (monorepo)

Dépôt **source de vérité** pour les sites de la famille NAVLYS. Objectif :
sortir du déploiement manuel (Vercel CLI) et passer à **un dépôt → Vercel → déploiement automatique**,
avec une **identité visuelle unifiée** et des pages animées (apparition au scroll, offre visible).

## Structure

```
sites/
  _shared/
    navlys-family-theme.css   # thème commun Ice Blue / or / bronze
    navlys-fond.js            # fond unifié : vidéo bateau + écusson géant
    navlys-reveal.js          # apparition au scroll (auto, sans classes)
    hero-bg-slideshow.js      # diaporama d'images (fallback)
  brunopartouche/             # site multi-pages animé (le plus avancé)
    index.html  biographie.html  parcours.html  univers.html
    journal.html  navlys-next-gen.html  demo-animee.html  mentions-legales.html
    vercel.json               # cleanUrls
    assets/                   # vidéos/écusson/poster (à déposer)
  navlys/                     # brouillon « méthode 90/10 » (≠ navlys.com live)
    index.html  methode.html  tarifs.html  alpaca.html  mentions-legales.html  vercel.json
docs/MISE_EN_LIGNE_VERCEL.md  # guide de connexion Vercel (méthode sûre)
scripts/check_internal_links.py  # contrôle anti-404 (CI)
STATUS.md                     # carte d'état détaillée
```

## CI (GitHub Actions — « Sites check »)
Chaque PR/commit sur `main` vérifie automatiquement : socle présent · **aucun NAVBIO** ·
HTML valide · **liens internes (anti-404)**. Tout doit être **vert** pour merger.

## Fond unifié — une seule ligne par page
```html
<script src="/_shared/navlys-fond.js"
        data-video="/assets/navlys-bateau.mp4"
        data-ecusson="/assets/ecusson.png"
        data-poster="/assets/bg-1.jpg"></script>
```

## Règle de nommage
**NAVBIO → NAVLYS NEXT GEN** partout (vérifié par la CI ; routes `/navbio` → `/navlys-next-gen`).

## Mise en ligne
Voir **`docs/MISE_EN_LIGNE_VERCEL.md`** — méthode sûre : projet d'aperçu Vercel
(Root Directory `sites/brunopartouche`), validation, **puis** bascule du domaine.
⚠️ Ne pas écraser navlys.com (NAVLYS CORE) par le brouillon `sites/navlys`.
