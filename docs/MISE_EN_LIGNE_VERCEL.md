# Connecter NOVA-HUB à Vercel (déploiement automatique)

> But : passer du déploiement manuel (Vercel CLI) à **GitHub → Vercel → déploiement auto**.
> À faire **une seule fois**. Ensuite, chaque merge sur `main` = mise en ligne automatique.

---

## ⚠️ À lire avant tout — quel site peut être connecté ?

Connecter un domaine à ce dépôt fait que le domaine servira **la version du dépôt**.
Or le contenu du dépôt ne correspond pas toujours au site actuellement en ligne :

| Domaine live | Contenu actuellement en ligne | Contenu dans ce dépôt | Basculer le domaine ? |
|---|---|---|---|
| **brunopartouche.com** | landing animée (1 page) | site multi-pages animé (accueil, bio, parcours, univers, journal, NAVLYS NEXT GEN, démo) | ✅ Oui — version dépôt plus riche |
| **navlys.com** | **NAVLYS CORE** (univers IA : Finance, NAVLEX, Next Gen, Radio…) | méthode 90/10 (4 pages, plus simple) | ❌ **NON** — ne pas écraser le live |

> 👉 On connecte **brunopartouche** en premier. Pour navlys.com, on **n'écrase rien** :
> le dossier `sites/navlys` reste un brouillon tant qu'on n'a pas reconstruit l'univers complet.

---

## Méthode sûre : aperçu d'abord, bascule ensuite

### Étape 1 — Créer un projet d'aperçu (ne touche pas la prod)
1. **vercel.com** → équipe **NAVLYS** → **Add New → Project**.
2. **Import Git Repository** → `bpartouche46-sys/NOVA-HUB`
   (si demandé, autoriser Vercel à accéder au dépôt).
3. **Configure Project** :
   - **Root Directory** → `sites/brunopartouche`
   - **Framework Preset** → **Other** (site statique, aucun build)
   - **Project Name** → ex. `brunopartouche-hub` (nom différent de l'existant)
4. **Deploy**.
5. Vercel donne un lien **`https://brunopartouche-hub-xxxx.vercel.app`** → **clique pour voir le rendu animé**.

### Étape 2 — Vérifier l'aperçu
Ouvre sur le lien `.vercel.app` :
- `/` → accueil animé · `/demo-animee` → cadres vidéo + scroll
- `/biographie`, `/parcours`, `/univers`, `/journal`, `/navlys-next-gen`, `/mentions-legales`

Les vidéos restent en **placeholder** tant que les fichiers ne sont pas déposés (voir plus bas).

### Étape 3 — Basculer le domaine (seulement quand l'aperçu te convient)
Quand tu valides le rendu :
1. Dans le **nouveau projet** `brunopartouche-hub` → **Settings → Domains** → **Add** `brunopartouche.com` (+ `www`).
2. Vercel demandera de **retirer le domaine de l'ancien projet** `brunopartouche` → confirme.
3. Le domaine pointe désormais sur la version du dépôt. ✅ Auto-déploiement actif.

> Tant que tu ne fais pas l'étape 3, **brunopartouche.com reste inchangé** : aucun risque.

---

## Après connexion : le cycle automatique
- Chaque **merge sur `main`** → Vercel déploie tout seul.
- Chaque **PR** → Vercel crée un **lien de preview** automatique (pratique pour valider avant merge).
- **Ne plus déployer via CLI** sur ce projet (sinon conflit avec le Git).

## Assets à déposer (pour les vidéos / fonds)
Dans `sites/brunopartouche/assets/` :
- `navlys-bateau.mp4`, `ecusson.png`, `bg-1.jpg` (fond unifié + poster)
- `clip-1.mp4` … `clip-6.mp4` (cadres de la démo `/demo-animee`)

## Plus tard — navlys.io, navbiolife, et le vrai navlys.com
Ces sites ne sont **pas encore** reconstruits dans le dépôt. Quand ils le seront
(un dossier `sites/<site>` par site), on répétera l'**étape 1-2-3** pour chacun.
Pour navlys.com en particulier, il faudra d'abord **porter l'univers NAVLYS CORE**
dans le dépôt avant d'envisager toute bascule de domaine.
