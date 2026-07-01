---
name: navlys-deploy-vercel
description: Met les sites NAVLYS en ligne sur Vercel sans erreur. À utiliser quand on veut déployer NOVA-HUB, brancher les domaines, ou diagnostiquer pourquoi « ce n'est pas en ligne ». Capture la procédure exacte + tous les pièges rencontrés.
---

# NAVLYS — Déploiement Vercel (1 dépôt → 1 projet → auto-deploy)

## Modèle cible
**UN seul projet Vercel** importé depuis le dépôt `bpartouche46-sys/NOVA-HUB`.
Le routage par domaine est dans `vercel.json` (host rewrites) :
`brunopartouche.com`→`sites/brunopartouche`, `navlys.com`→`sites/navlys-core`,
`navbiolife.com`→`sites/navbiolife`, `navlys.io`→`sites/navlys-io`, `/_shared/*`, `/api/*`.

## Ce que l'agent PEUT et NE PEUT PAS faire (vérifié)
- ❌ **Connecteur Vercel natif (MCP)** = LECTURE seule (`list_projects`, `list_deployments`, `web_fetch_vercel_url`). **Pas de déploiement.**
- ❌ **CLI** `vercel` : absent de l'environnement remote, pas de token.
- ✅ **Zapier → Vercel** (`create_project`, `create_deployment`) = **seul moyen programmatique** — nécessite que Bruno connecte Zapier↔Vercel **une fois** (token PAT).
- 🔑 **Incontournable** : créer un projet/déployer exige l'accès au **compte Vercel de Bruno** (sa sécurité). 1 clic, pas un blocage « pour rien ».

## Procédure (la plus simple : dashboard, depuis un ordinateur)
1. vercel.com → équipe **NAVLYS** → **Add New… → Project** → **Import** `bpartouche46-sys/NOVA-HUB` → Framework **Other** (statique, pas de build) → **Deploy**.
2. **Settings → Environment Variables** : `ANTHROPIC_API_KEY` = clé `sk-ant-…` (pour le SAV `/api/sav`). Sans elle, le SAV bascule proprement sur WhatsApp.
3. **Settings → Domains** : ajouter `brunopartouche.com`, `navlys.com`, `navbiolife.com`, `navlys.io` (+ `www.`) → accepter le **Move/Transfer** depuis les anciens projets.
4. Supprimer les anciens projets éclatés UNE FOIS le nouveau confirmé live.

## Procédure alternative (par l'agent, via Zapier) — après connexion Zapier↔Vercel
- Connexion : page Zapier « Connect to Vercel » → **Vercel API Token** (créé sur `vercel.com/account/tokens`, scope NAVLYS, no expiration) + **Team ID** `team_nBtY5FOQMPIT4J8Bmf7wvBSC`.
- Puis : `create_project` (gitProvider=github, gitRepo=`bpartouche46-sys/NOVA-HUB`) → `create_deployment` (target=production).
- Limite : Zapier Vercel ne gère **ni la variable d'env, ni les domaines** → ces 2 restent au dashboard.

## Vérifier que c'est live
- `list_projects` (team NAVLYS) → un projet **nova-hub** doit apparaître (sinon l'import n'a pas eu lieu).
- `web_fetch_vercel_url` sur l'URL `.vercel.app` → vérifier le ciné-scroll + tester `/api/sav`.
- ⚠️ Sur une URL `.vercel.app` (sans domaine), les host-rewrites ne matchent pas → c'est le hub racine qui s'affiche. Le routage par site n'apparaît qu'avec les **vrais domaines**.

## Pièges appris
- `deploy_to_vercel` (MCP) ne déploie pas : il renvoie juste « lance `vercel deploy` ».
- Les déploiements existants `brunopartouche` etc. sont faits **en CLI local** (compte claudenavlys) → **hors** du dépôt NOVA-HUB. Live ≠ dépôt tant que l'import n'est pas fait.
