# Connecter NOVA-HUB à Vercel (1 seul projet racine)

> But : passer du déploiement manuel (Vercel CLI) à **GitHub → Vercel → déploiement auto**.
> Modèle choisi : **UN seul projet Vercel** à la racine du dépôt, qui sert **tous les sites**.
> Le routage par domaine est géré par `vercel.json` (à la racine) — rien à configurer site par site.

---

## Comment ça marche
- **Root Directory = racine du dépôt** (pas `sites/...`).
- Le `vercel.json` racine route **chaque domaine vers son dossier** :

| Domaine | Dossier servi |
|---|---|
| `brunopartouche.com` (+ www) | `sites/brunopartouche/` |
| `navlys.com` (+ www) | `sites/navlys-core/` |
| `navbiolife.com` / `navbiolive.com` | `sites/navbiolife/` |
| `navlys.io` (+ www) | `sites/navlys-io/` |
| (n'importe quel domaine) `/_shared/…` | `sites/_shared/…` |

- L'URL d'aperçu `…vercel.app` (sans domaine attaché) affiche le **hub racine** (`index.html`).
- Le dossier `sites/navlys` (brouillon 90/10) est en **noindex** et n'est routé par aucun domaine — il ne sert pas.

---

## Étapes (une seule fois)

### 1. Importer le dépôt
1. **vercel.com** → équipe **NAVLYS** → **Add New → Project**.
2. **Import Git Repository** → `bpartouche46-sys/NOVA-HUB` (autoriser l'accès si demandé).
3. **Configure Project** :
   - **Root Directory** → **laisser la racine** (ne PAS mettre `sites/...`).
   - **Framework Preset** → **Other** (statique, aucun build).
   - **Project Name** → ex. `navlys-hub`.
4. **Deploy** → lien `…vercel.app` : tu vois le **hub** (les 4 mondes).

### 2. Vérifier l'aperçu
Sur le lien `.vercel.app` :
- `/` → hub racine.
- Les pages d'un site se voient en direct via `/sites/<site>/…` (ex. `/sites/brunopartouche/biographie`).
  > Note : sur l'URL d'aperçu, les liens internes d'un site (`/biographie`, `/parcours`) ne pointent juste que sur le bon domaine **une fois le domaine attaché** (étape 3) — c'est normal.

### 3. Attacher les domaines (quand l'aperçu te convient)
Dans le projet → **Settings → Domains → Add** :
- `brunopartouche.com` + `www.brunopartouche.com`
- `navlys.com` + `www.navlys.com`  *(⚠️ vérifie d'abord que `sites/navlys-core` correspond bien à ton NAVLYS CORE live avant d'attacher ce domaine)*
- `navbiolife.com`, `navbiolive.com`
- `navlys.io` + `www.navlys.io`

Vercel demandera de retirer chaque domaine de son **ancien projet** → confirme.
Le `vercel.json` route alors automatiquement chaque domaine vers son dossier. ✅ Auto-déploiement actif.

> Tant que tu n'attaches pas un domaine, le site live correspondant **reste inchangé**.

---

## Après connexion
- Chaque **merge sur `main`** → déploiement automatique.
- Chaque **PR** → **lien de preview** automatique.
- **Ne plus déployer via CLI** sur ces domaines (sinon conflit avec le Git).

## Assets à déposer
Dans `sites/<site>/assets/` : vidéos (`navlys-bateau.mp4`, `clip-1..6.mp4`), `ecusson.png`, `bg-1.jpg`, et les images Open Graph (`og-*.jpg`).

## Vérifier le routage (après 1er déploiement)
Le routage par domaine (`vercel.json`) ne peut se tester qu'**une fois un domaine attaché**. Si une page d'un site ne charge pas son thème/animation, vérifier que la requête `https://<domaine>/_shared/navlys-fond.js` renvoie bien le fichier (et non une 404) — c'est le signe que le rewrite `/_shared` fonctionne.
