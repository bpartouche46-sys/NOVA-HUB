# NAVLYS — Socle unique des sites (monorepo)

Dépôt **source de vérité** pour tous les sites de la famille NAVLYS. Objectif :
sortir du déploiement manuel (Vercel CLI) et passer à **un dépôt → Vercel → déploiement automatique**,
avec une **identité visuelle unifiée** (fond vidéo bateau + écusson animé) et le contenu enrichi
par les anciennes pages.

## Structure

```
sites/
  _shared/
    navlys-family-theme.css   # thème commun Ice Blue / or / bronze
    hero-bg-slideshow.js      # diaporama d'images (fallback)
    navlys-fond.js            # FOND UNIFIÉ : vidéo bateau + écusson géant
  brunopartouche/             # SITE PILOTE
    biographie.html           # ✅ portée (Drive O1), NAVBIO→NAVLYS NEXT GEN
    assets/                   # navlys-bateau.mp4, ecusson.png, bg-1.jpg (à déposer)
  navlys-com/                 # à venir
  navlys-io/                  # à venir
  navbiolife/  (→ NAVLYS NEXT GEN)
STATUS.md                     # carte d'état : qui est à jour, quoi faire
```

## Fond unifié — une seule ligne par page

```html
<script src="/_shared/navlys-fond.js"
        data-video="/assets/navlys-bateau.mp4"
        data-ecusson="/assets/ecusson.png"
        data-poster="/assets/bg-1.jpg"></script>
```

## Règle de nommage

**NAVBIO → NAVLYS NEXT GEN** partout (textes, menus, CTA ; routes `/navbio` → `/navlys-next-gen`).

## Mise en ligne (étapes — à faire une fois)

1. Sur **vercel.com** → équipe NAVLYS → projet `brunopartouche` → **Settings → Git** → *Connect Git Repository* → ce dépôt, dossier racine `sites/brunopartouche`.
2. Répéter pour `navlys-app`, `navlys-io`, `navbio` (chacun pointant sur son dossier).
3. Déposer les assets (vidéo bateau confirmée + écusson) dans chaque `sites/<site>/assets/`.
4. Ensuite : **chaque modification commit = mise en ligne automatique**.

## Intégrations (phase backend, après le socle)

NAVLYS CORE = Supabase `navlys-core`. À brancher : WhatsApp 360, ElevenLabs, Zapier, Stripe, Resend.
