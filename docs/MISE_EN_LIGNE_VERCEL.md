# Mettre les sites en ligne via ce dépôt (connexion Vercel)

> But : passer du déploiement manuel (Vercel CLI) à **dépôt GitHub → Vercel → déploiement automatique**.
> À faire **une seule fois** par site. Ensuite, chaque commit = mise en ligne automatique.

## Principe
Ce dépôt est un **monorepo** : un dossier par site sous `sites/`. On connecte chaque
projet Vercel existant à ce dépôt, en lui indiquant **son dossier racine**.

| Domaine | Projet Vercel | Dossier racine (Root Directory) |
|---|---|---|
| brunopartouche.com | `brunopartouche` | `sites/brunopartouche` |
| navlys.com | `navlys-app` | `sites/navlys-com` |
| navlys.io | `navlys-io` | `sites/navlys-io` |
| navbiolife.com | `navbio` | `sites/navbiolife` |

## Étapes (pour brunopartouche, à répéter)
1. **vercel.com** → équipe **NAVLYS** → projet **brunopartouche**.
2. **Settings → Git** → **Connect Git Repository** → choisir `bpartouche46-sys/NOVA-HUB`.
3. **Settings → Build & Development → Root Directory** → mettre `sites/brunopartouche`.
   - Framework Preset : **Other** (site statique, pas de build).
4. **Settings → Git → Production Branch** → `main`.
5. Déposer les assets dans `sites/brunopartouche/assets/` (vidéo, écusson, poster).
6. Faire un commit sur `main` (ou merger la PR) → Vercel déploie automatiquement.

## Vérifier
- Onglet **Deployments** du projet : un déploiement « Ready » doit apparaître après chaque push.
- Le domaine (brunopartouche.com) sert alors la version du dépôt.

## Important
- Tant que la connexion Git n'est pas faite, les sites restent servis par les anciens
  déploiements CLI (rien n'est cassé).
- Une fois connecté, **ne plus déployer via CLI** pour le même projet (sinon conflit).
