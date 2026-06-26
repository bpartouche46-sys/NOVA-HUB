# NAVLYS — Carte d'état du dépôt

> Mis à jour : 2026-06-26. Point complet aligné sur le core central NAVLYS et l’intégration Claude Code.

## 1) Architecture centrale en production (source dépôt)

- ✅ **Projet Vercel unique à la racine** (`/vercel.json`).
- ✅ Routage multi-domaines actif par host :
  - `brunopartouche.com` → `sites/brunopartouche/`
  - `navlys.com` → `sites/navlys-core/` (**core central NAVLYS**)
  - `navbiolife.com` (+ alias `navbiolive.com`) → `sites/navbiolife/`
  - `navlys.io` → `sites/navlys-io/`
  - `/_shared/*` → `sites/_shared/*`
- ✅ `cleanUrls: true` et `trailingSlash: false` au niveau racine.

## 2) État des sites présents dans le dépôt

| Espace | Dossier | Statut |
|---|---|---|
| NAVLYS CORE (central) | `sites/navlys-core/` | ✅ Actif pour `navlys.com` |
| Bruno Partouche | `sites/brunopartouche/` | ✅ Multi-pages complet |
| NAVLYS NEXT GEN | `sites/navbiolife/` | ✅ Présent et routé |
| Vitrine | `sites/navlys-io/` | ✅ Présent et routé |
| Brouillon 90/10 | `sites/navlys/` | ✅ Conservé hors routage domaine |
| Socle partagé | `sites/_shared/` | ✅ CSS/JS communs |

## 3) CI et sécurité

### Workflows actifs
- ✅ `Sites check` (`.github/workflows/sites-check.yml`)
  - présence du socle partagé
  - renommage imposé vers **NAVLYS NEXT GEN**
  - validation HTML basique
  - anti-404 interne via `scripts/check_internal_links.py`
- ✅ `Secret scan` (`.github/workflows/secret-scan.yml`)
  - scan anti-secrets via `scripts/check_secrets.py`

### Contrôles locaux à exécuter avant push
```bash
python3 scripts/check_internal_links.py
python3 scripts/check_secrets.py
grep -riln --include='*.html' -e 'NAVBIO' .  # doit ne rien renvoyer
```

## 4) Intégration Claude Code (GitHub Actions)

- ✅ Workflow `Claude` présent (`.github/workflows/claude.yml`).
- ✅ Déclenchement sur mentions `@claude` dans issues/PR/comments.
- ✅ Permissions configurées pour proposer des changements (`contents`, `pull-requests`, `issues` en write).
- ⚠️ Pré-requis à maintenir côté GitHub :
  - App Claude installée sur le dépôt
  - secret `ANTHROPIC_API_KEY` disponible

## 5) Points ouverts (priorités actuelles)

1. Déposer les assets médias définitifs par site (`/assets`) pour le rendu final.
2. Harmoniser la charte entre styles inline pages et socle partagé.
3. Finaliser les contenus métiers encore en placeholder (ex. tarifs selon décisions finales).
4. Continuer la convergence des pages secondaires vers le même niveau de finition.

## 6) Règles immuables du dépôt

- Ne jamais réintroduire l’ancien nom : utiliser uniquement **NAVLYS NEXT GEN**.
- Aucun secret dans le dépôt public.
- WhatsApp unique : `972537082746`.
- Pages autonomes (HTML complet) + favicon data-URI + OG/canonical par site.
