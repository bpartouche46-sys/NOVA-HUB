---
name: navlys-cine-layout
description: Appliquer le layout « ciné-scroll » NAVLYS (vidéo nette plein-haut + contenu en sheet qui glisse par-dessus, mobile-first) à un site. À utiliser pour intégrer ou ajuster ce design sur un site de la famille.
---

# NAVLYS — Layout ciné-scroll (mobile-app)

## Principe
- **Haut (74vh mobile / 80vh desktop)** : vidéo **nette, plein cadre, SANS floutage** + bouton son/voix.
- **Bas** : contenu en **« sheet »** qui glisse par-dessus la vidéo (effet application).
- Prêt à recevoir les vidéos ; en attendant, le `poster` s'affiche.

## Mise en œuvre (DRY — script partagé)
Inclure **une ligne** avant `</body>`, AVANT `navlys-reveal.js` :
```html
<script src="../_shared/navlys-cine.js"
   data-video="/assets/navlys-bateau.mp4"
   data-poster="/assets/<poster-du-site>.jpg"
   data-voix="/assets/<voix-du-site>.mp3"
   data-kicker="Sous-titre"
   data-title="TITRE"
   data-tag="Accroche."
   data-hide="<sélecteur de l'ancien hero>"></script>
```
`navlys-cine.js` injecte le CSS, construit la scène vidéo, déplace le contenu (non-fixe) dans une `.nv-sheet`, et masque l'ancien hero (`data-hide`) pour éviter le doublon. Branche le bouton son sur la voix off.

## ⚠️ Piège vérifié (ultrareview)
**Toujours passer `data-hide`** vers l'ancien hero, sinon **doublon de titre/tagline** sous la vidéo.
- brunopartouche : hero sur-mesure (fait main, vidéo + sheet directement dans le HTML).
- navlys-core : `data-hide=".intro,.tagline"` (garde l'emblème orbital + l'offre).
- navlys-io : `data-hide=".prelude,.hero"`.
- navbiolife : `data-hide="header"`.

## Posters/voix par site
| Site | poster | voix |
|---|---|---|
| brunopartouche | bg-1.jpg | voix-intro.mp3 |
| navlys-core | bg-1.jpg | voix-accueil.mp3 |
| navbiolife | og-nextgen.jpg | voix-intro.mp3 |
| navlys-io | og-io.jpg | voix-intro.mp3 |

Toujours finir par le skill **navlys-guardrails** avant push.
