# 🔀 Plan de consolidation — « mixer les deux » (NOVA-HUB × NAVLYS-BETA-)

## Constat
Bruno a plusieurs dépôts. Le **navlys.com live** (chat SAV + `/partenaires`) vient de
**`NAVLYS-BETA-`** ou du privé **`bpartouche46-sys-navlys-com`** — **pas** de NOVA-HUB.
L'agent (session verrouillée sur `nova-hub`) **ne peut pas lire** ces dépôts : « access denied ».

## Objectif
**UN seul dépôt source de vérité = `NOVA-HUB`**, qui contient le meilleur des deux :
- de NOVA-HUB : ciné-scroll, **vrai SAV Claude** (`api/sav.js`), skills, garde-fous CI, voix off.
- de NAVLYS-BETA- / navlys-com : la page **/partenaires**, le widget SAV live, et toute page/section
  présente en ligne mais absente ici.

## Étape 0 — débloquer l'accès (à faire par Bruno, sur ordinateur, 1 fois)
Ajouter à la session de l'agent l'accès aux dépôts :
- `bpartouche46-sys/NAVLYS-BETA-`
- `bpartouche46-sys/bpartouche46-sys-navlys-com` (privé)
(via les paramètres de session / “add repo”). Sans ça, l'agent ne voit que NOVA-HUB.

## Étape 1 — inventaire (agent, une fois l'accès donné)
- Lister l'arbo des 2 dépôts, comparer avec `sites/*` de NOVA-HUB.
- Repérer : pages en plus (ex. `/partenaires`), assets, wiring SAV, différences de contenu/branding.

## Étape 2 — mix dans NOVA-HUB (agent)
- Porter les **pages/sections manquantes** dans le bon `sites/<site>/`.
- Garder **le SAV Claude de NOVA-HUB** (`api/sav.js` + `navlys-sav.js`) — supérieur au placeholder live.
- Réappliquer le **ciné-scroll** aux nouvelles pages (skill `navlys-cine-layout`).
- Passer **`navlys-guardrails`** avant chaque push. PR → CI verte → merge.

## Étape 3 — déploiement unique (skill `navlys-deploy-vercel`)
- Importer **NOVA-HUB** dans Vercel, y brancher les 4 domaines, ajouter `ANTHROPIC_API_KEY`.
- Débrancher les anciens projets une fois le nouveau live confirmé.

## Résultat
navlys.com (et les 3 autres) servis depuis **NOVA-HUB** : design + SAV opérationnel + auto-deploy.
Fin de la divergence « live ≠ dépôt ».
