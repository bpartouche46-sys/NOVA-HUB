# NAVLYS — Carte d'état du dépôt

> Mis à jour : 2026-06-22. Source de vérité unique sur l'état du dépôt et ce qui reste.

## 1. Sites en ligne (Vercel — équipe NAVLYS)

| Domaine | Projet Vercel | En ligne (déployé via CLI) | Présent dans CE dépôt |
|---|---|---|---|
| navlys.com | navlys-app | ✅ NAVLYS CORE (univers IA) | brouillon « méthode 90/10 » (`sites/navlys`) — **≠ live** |
| brunopartouche.com | brunopartouche | ✅ landing animée 1 page | **site multi-pages animé** (`sites/brunopartouche`) |
| navbiolife.com | navbio | ✅ | non porté |
| navlys.io | navlys-io | ✅ | non porté |

⚠️ Les sites live sont déployés **via Vercel CLI**, sans lien Git. Ce dépôt n'est **pas encore**
connecté à Vercel → voir `docs/MISE_EN_LIGNE_VERCEL.md` (méthode sûre aperçu→bascule).

## 2. Contenu du dépôt (12 pages) — état

**brunopartouche** (`sites/brunopartouche/`)
- ✅ `index.html` — accueil animé (hero doré, 3 mondes, teaser vidéo, 90/10, offre)
- ✅ `biographie.html` (12 sections) · `parcours.html` (chronologie) · `univers.html` (4 piliers)
- ✅ `journal.html` · `navlys-next-gen.html` (4 paliers) · `demo-animee.html` (cadres vidéo)
- ✅ `mentions-legales.html` · `vercel.json` (cleanUrls)

**navlys** (`sites/navlys/`) — brouillon « méthode 90/10 »
- ✅ `index.html` · `methode.html` · `tarifs.html` · `alpaca.html` · `mentions-legales.html` · `vercel.json`

**socle** (`sites/_shared/`)
- ✅ `navlys-family-theme.css` · `navlys-fond.js` (vidéo+écusson) · `hero-bg-slideshow.js`
- ✅ `navlys-reveal.js` (apparition au scroll, inclus sur les pages de contenu)

## 3. CI (GitHub Actions — `Sites check`)
Garde-fous automatiques (vert requis) : socle présent · **aucun NAVBIO** · HTML valide · **liens internes (anti-404)**.

## 4. Reste à faire — bloqué sur des inputs externes
- ⛔ **Assets** : déposer `navlys-bateau.mp4`, `ecusson.png`, `bg-1.jpg`, et `clip-1..6.mp4`
  dans `sites/<site>/assets/` (fond + cadres démo).
- ⛔ **Tarifs** : montants Skipper/Capitaine (navlys) + paliers NAVLYS NEXT GEN.
- ⛔ **Vercel** : import du dépôt + Root Directory (action côté dashboard).

## 5. Reste à faire — réalisable côté dépôt
- ⏳ Reconstruire l'**univers NAVLYS CORE** dans `sites/navlys` avant toute bascule de navlys.com.
- ⏳ Porter **navlys.io** et **navbiolife → NAVLYS NEXT GEN**.
- ⏳ P3 audit : factorisation de charte, harmonisation nav/journal.

## 6. Règle de nommage GLOBALE
> **NAVBIO → NAVLYS NEXT GEN** partout (vérifié par la CI).
