# 🔍 Audit du dépôt NOVA-HUB — écosystème NAVLYS

> Audit réalisé le **2026-06-21**.
> **Périmètre : les fichiers présents dans ce dépôt** (`sites/navlys/*`, `sites/brunopartouche/*`, `sites/_shared/*`).
> ⚠️ Ce dépôt est le **socle de consolidation** ; il n'est **pas** (encore) la source des sites
> actuellement en ligne, qui sont déployés à part via **Vercel CLI** (cf. `STATUS.md`).
> Cet audit porte donc sur le **code du dépôt**, pas sur les versions live.

Pages auditées :
- **navlys.com** : `index.html`, `methode.html`, `tarifs.html`, `alpaca.html`
- **brunopartouche.com** : `biographie.html`, `journal.html`, `univers.html`
- **partagé** : `navlys-family-theme.css`, `navlys-fond.js`, `hero-bg-slideshow.js`

Légende priorités : 🟥 **P1** = bloquant · 🟧 **P2** = avant lancement · 🟨 **P3** = amélioration.

---

## 🟥 P1 — Bloquant (le rendu est cassé en l'état)

### 1. Assets de fond manquants → fond noir partout
Toutes les pages chargent `navlys-fond.js` avec :
```html
<script src="../_shared/navlys-fond.js"
        data-video="/assets/navlys-bateau.mp4"
        data-ecusson="/assets/ecusson.png"
        data-poster="/assets/bg-1.jpg"></script>
```
Or **aucun de ces fichiers n'existe** dans le dépôt :
- `sites/navlys/` → pas de dossier `assets/` du tout.
- `sites/brunopartouche/assets/` → contient seulement `README.md`.

**Conséquence :** pas de vidéo bateau, pas d'écusson en filigrane, pas de poster → fond noir uni.
`STATUS.md §2` confirme que ces assets sont « à déposer » (3 vidéos candidates sur Drive, « à confirmer laquelle »).

**Correctif :** déposer `navlys-bateau.mp4`, `ecusson.png`, `bg-1.jpg` dans
`sites/navlys/assets/` **et** `sites/brunopartouche/assets/` (les chemins sont absolus `/assets/…`,
donc chaque site déployé doit avoir son propre dossier `assets/`).

### 2. Liens morts dans le menu de brunopartouche.com
Le `<nav>` des 3 pages (et le CTA principal) pointent vers des pages **absentes du dépôt** :
| Lien | Cible | Existe ? |
|---|---|---|
| `/biographie` | biographie.html | ✅ |
| `/univers` | univers.html | ✅ |
| `/journal` | journal.html | ✅ |
| `/parcours` | parcours.html | ❌ **404** |
| `/navlys-next-gen` | navlys-next-gen.html | ❌ **404** |

Le bouton bleu d'en-tête **« Ma bio NAVLYS NEXT GEN » → `/navlys-next-gen`** mène donc à une 404,
de même que les CTA en bas de `biographie.html`. `STATUS.md §3` liste ces pages comme « à porter ».

**Correctif :** soit créer `parcours.html` + `navlys-next-gen.html`, soit retirer/désactiver
ces liens tant que les pages n'existent pas.

### 3. Pas de `vercel.json` pour brunopartouche.com → URLs propres non garanties
`sites/navlys/vercel.json` active `cleanUrls:true` (donc `/methode` → `methode.html`).
**`sites/brunopartouche/` n'a pas de `vercel.json`.** Tous ses liens internes sont pourtant
sans extension (`/biographie`, `/univers`, `/journal`). Sans `cleanUrls`, ils risquent de 404.

**Correctif :** ajouter `sites/brunopartouche/vercel.json` identique :
```json
{ "cleanUrls": true, "trailingSlash": false }
```

---

## 🟧 P2 — À corriger avant le lancement

### 4. Conflit de polices entre le thème partagé et les pages
`navlys-family-theme.css` impose en `!important` :
```css
body, p { font-family:'Cormorant Garamond', Georgia, serif !important; }
.btn, button, .cta { font-family:'Cinzel', serif !important; }
```
Mais chaque page définit son corps de texte en **`Inter`** (sans serif) et **ne charge jamais
`Cinzel`**. Comme le thème gagne (`!important`) :
- tout le texte courant passe en **serif** au lieu d'`Inter` (intention des pages non respectée) ;
- les boutons demandent `Cinzel`, police non importée → fallback navigateur.

**Correctif :** décider d'une règle unique. Soit charger Cinzel + assumer le serif partout,
soit retirer ces `!important` du thème et laisser chaque page gérer sa typo.

### 5. Tarifs vides sur la page Tarifs
`tarifs.html` affiche pour Skipper et Capitaine : `— / mois*` (montants non renseignés),
avec la note « Tarifs indicatifs, à confirmer avant mise en ligne ».
**Correctif :** renseigner les prix (ou retirer la mention « LE PLUS CHOISI » tant que c'est vide).

### 6. SEO / partage social absent partout
Aucune page n'a de balises Open Graph / Twitter Card ni de favicon :
- pas de `og:title`, `og:description`, `og:image` ;
- pas de `twitter:card` ;
- pas de `<link rel="icon">`.

**Conséquence :** un partage WhatsApp/réseaux affiche un aperçu vide ou moche.
**Correctif :** ajouter un bloc meta OG + une image de partage + un favicon sur chaque page
(les `<meta name="description">` sont déjà présents, c'est une bonne base).

### 7. Mentions légales absentes sur brunopartouche.com
Les footers de `biographie/journal/univers` n'ont **pas** de lien « Mentions légales ».
`navlys.com` affiche bien un disclaimer (« Information éducative — pas un conseil… »),
mais brunopartouche non — alors que le contenu parle de finance et de statut « finfluenceur ».
`STATUS.md §3` liste `A1_MENTIONS_LEGALES` comme « à porter (footer) ».
**Correctif :** porter une page Mentions légales + lien footer, et reprendre le disclaimer financier.

---

## 🟨 P3 — Améliorations

### 8. Incohérence de navigation navlys.com ↔ journal
`tarifs.html` (offre Découverte) promet « Le journal / carnet de bord public », mais le menu
de navlys.com (`index/methode/tarifs/alpaca`) **n'a aucun lien vers un journal**.
Le journal existe côté brunopartouche (`/journal`) — clarifier où vit le carnet public et le lier.

### 9. Pages annoncées mais non encore portées (`STATUS.md`)
À suivre : `navlys.io/journal`, `navlys.io/ambassadeurs`, `brunopartouche/parcours`,
`navlys-next-gen`. Tant qu'elles manquent, voir P1-2 pour les liens.

### 10. Deux chartes graphiques se superposent
Les pages sont construites en **Tailwind + style inline** (variables `--ice`), tandis que
`navlys-family-theme.css` réapplique par-dessus une charte « famille » (bronze/or, cards
« respirantes » animées). Le résultat dépend de qui gagne les `!important`. À terme :
factoriser **une** charte au lieu de deux couches qui se marchent dessus.

### 11. Claims à étayer (NAVLYS NEXT GEN)
La bio annonce « chiffrés AES-256 », « local-first zero-knowledge », « jamais exploités
commercialement ». `STATUS.md §5` indique que le backend (Supabase, etc.) reste **à brancher**.
S'assurer que ces promesses sont tenues techniquement avant communication publique.

---

## ✅ Points déjà bons
- `navlys.com` : navigation interne cohérente (`/`, `/methode`, `/tarifs`, `/alpaca` existent tous) + `cleanUrls`.
- Disclaimer financier présent sur toutes les pages navlys.com.
- Numéro WhatsApp homogène partout : `972537082746`.
- `<meta name="description">` renseignée sur les 7 pages.
- `prefers-reduced-motion` géré dans `navlys-fond.js` (accessibilité animations).
- Rebrand **NAVBIO → NAVLYS NEXT GEN** correctement appliqué dans ce dépôt
  (le rename restant concerne le site live navbiolife.com, hors dépôt — cf. `STATUS.md §6`).

---

## 📌 Plan d'action conseillé (ordre)
1. Déposer les 3 assets de fond dans chaque `assets/` **(P1-1)**.
2. Créer/retirer `parcours` + `navlys-next-gen`, ajouter `vercel.json` brunopartouche **(P1-2, P1-3)**.
3. Trancher la typo (thème vs pages) **(P2-4)**.
4. Remplir les tarifs **(P2-5)**.
5. Ajouter OG + favicon + mentions légales **(P2-6, P2-7)**.
6. Harmoniser nav/journal et factoriser la charte **(P3)**.
