# NAVLYS — Socle unique des sites (monorepo)

Dépôt **source de vérité** pour les sites de la famille NAVLYS, avec **un core central**
et un **routage multi-domaines** depuis un seul projet Vercel racine.

## Structure

```
sites/
  _shared/
    navlys-family-theme.css   # thème commun Ice Blue / or / bronze
    navlys-fond.js            # fond unifié : vidéo bateau + écusson géant
    navlys-reveal.js          # apparition au scroll (auto, sans classes)
    hero-bg-slideshow.js      # diaporama d'images (fallback)
  brunopartouche/             # site multi-pages animé
    index.html  biographie.html  parcours.html  univers.html
    journal.html  navlys-next-gen.html  demo-animee.html  mentions-legales.html
    vercel.json               # cleanUrls
    assets/                   # vidéos/écusson/poster (à déposer)
  navlys-core/                # core central servi sur navlys.com
    index.html  next-gen.html  finance.html  navlex.html  bientot.html  mentions-legales.html
  navbiolife/                 # NAVLYS NEXT GEN
  navlys-io/                  # vitrine navlys.io
  navlys/                     # brouillon « méthode 90/10 » (hors routage domaine)
    index.html  methode.html  tarifs.html  alpaca.html  mentions-legales.html  vercel.json
docs/MISE_EN_LIGNE_VERCEL.md  # guide de connexion Vercel (méthode sûre)
scripts/check_internal_links.py  # contrôle anti-404 (CI)
STATUS.md                     # carte d'état détaillée
.github/workflows/claude.yml  # intégration Claude Code (@claude)
```

## CI (GitHub Actions — « Sites check »)
Chaque PR/commit sur `main` vérifie automatiquement : socle présent · **aucun NAVBIO** ·
HTML valide · **liens internes (anti-404)**. Tout doit être **vert** pour merger.

## Claude Code
- Workflow dédié : `.github/workflows/claude.yml`
- Mentionner `@claude` dans une issue/PR/commentaire pour déclencher l’agent
- Nécessite l’app Claude installée et le secret `ANTHROPIC_API_KEY`

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
⚠️ Le Root Directory doit rester la **racine du dépôt** (pas `sites/...`).
