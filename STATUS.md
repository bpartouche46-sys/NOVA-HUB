# NAVLYS — Carte d'état des sites & contenus

> Mis à jour : 2026-06-13. Source de vérité unique pour savoir **quel site est à jour et comment le faire évoluer**.

## 1. Sites en ligne (Vercel — équipe NAVLYS)

| Domaine | Projet Vercel | État | À faire évoluer |
|---|---|---|---|
| navlys.com | navlys-app | ✅ EN LIGNE | Ajouter pages : méthode, tarifs, Alpaca, journal |
| navlys.io | navlys-io | ✅ EN LIGNE (vitrine famille) | Ajouter page Journal/News, page Ambassadeurs |
| navbiolife.com | navbio | ✅ EN LIGNE | **Renommer NAVBIO → NAVLYS NEXT GEN** partout |
| brunopartouche.com | brunopartouche | ✅ EN LIGNE | **PILOTE** : fond unifié + pages bio/univers/journal + menus |

Doublon **résolu** : le projet Netlify `novafinanceclub` est désactivé ; brunopartouche.com est servi par Vercel.

> ⚠️ Tous déployés via **Vercel CLI**, sans lien GitHub. Objectif de ce dépôt : devenir la **source unique** connectée à Vercel pour rendre chaque site modifiable et auto-déployé.

## 2. Identité visuelle unifiée (à appliquer PARTOUT)

- **Thème** : `sites/_shared/navlys-family-theme.css` (Ice Blue + or/bronze, cards respirantes).
- **Fond unifié** : `sites/_shared/navlys-fond.js` → **vidéo bateau** + **écusson animé géant** en filigrane + voile sombre.
  - Assets attendus dans `sites/<site>/assets/` : `navlys-bateau.mp4`, `ecusson.png`, `bg-1.jpg`.
  - Vidéos bateau candidates (Google Drive › dossier `tri`) : `20250807_212540.mp4`, `20250702_081314.mp4`, `20250615_204300.mp4` — **à confirmer laquelle**.

## 3. Pages anciennes à réintégrer (Google Drive › « NOVA Finance Club - Bruno Partouche »)

| Page Drive | Destination | État |
|---|---|---|
| O1_brunopartouche_BIOGRAPHIE_12sections.html | brunopartouche/biographie.html | ✅ **portée** (rename appliqué) |
| O2_brunopartouche_UNIVERS.html | brunopartouche/univers.html | ⏳ à porter |
| O3_navlys_JOURNAL_COMMUNAUTE.html | navlys.io/journal.html | ⏳ à porter |
| W1_navlys_EN_method.html | navlys.com/methode.html | ⏳ |
| W2 / Z2_TARIFS | navlys.com/tarifs.html | ⏳ |
| W3 / AA1_ALPACA | navlys.com/alpaca.html | ⏳ |
| W4 / Y2_AMBASSADEURS | navlys.io/ambassadeurs.html | ⏳ |
| A1_MENTIONS_LEGALES | toutes (footer) | ⏳ |

## 4. Redondances détectées (à fusionner)

- Drive : plusieurs `index.html`, `journal_recherche` (×3), `veille_2026-06-01` (×2), `bastion-du-jour` (×2), `_NAVLYS_CARTE_MERE_J-10` (×3), `BB1_TEMPLATES_EMAILS_RESEND` (×2), `cockpit.html` (×2). → garder la version la plus récente, archiver le reste.
- Dépôts GitHub : `NOVA-HUB`, `NOVA-HUB-1`, `NAVLYS-BETA-`, `bpartouche46-sys-navlys-com`, `Ai-Suite-PRO`, `gdp-dashboard` (×3). → consolider en un seul socle (ce dépôt) + archiver les redondants.

## 5. Serveur mémoire central & cloud

- **NAVLYS CORE** = projet **Supabase** `navlys-core` (eu-west-3, actif). → base centrale des apps/données.
- **Google Workspace** = Drive (dossier maître à créer : `NAVLYS_CORE_MASTER`).
- Intégrations à brancher (phase backend) : Supabase, WhatsApp 360, ElevenLabs, Zapier, Stripe, Resend.

## 6. Règle de nommage GLOBALE

> **NAVBIO → NAVLYS NEXT GEN** partout (textes, titres, menus, CTA). Les routes `/navbio` deviennent `/navlys-next-gen`.
