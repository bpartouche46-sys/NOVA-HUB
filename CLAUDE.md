# CLAUDE.md — Guide du dépôt NOVA-HUB (famille NAVLYS)

Contexte pour Claude (et toute personne contribuant) quand on travaille sur ce dépôt.

## Nature du projet
- **Monorepo de sites statiques** (HTML/CSS/JS navigateur). Pas de framework, pas de build serveur.
- Un dossier par site sous `sites/` ; ressources communes dans `sites/_shared/` ; **hub** = `index.html` racine.
- Contenu **en français**, ton chaleureux et sobre (tutoiement).

## Déploiement
- **UN seul projet Vercel** à la racine. Le routage par domaine est dans `vercel.json`
  (`brunopartouche.com`→`sites/brunopartouche`, `navlys.com`→`sites/navlys-core`,
  `navbiolife.com`→`sites/navbiolife`, `navlys.io`→`sites/navlys-io`, `/_shared/*`→`sites/_shared/*`).
- Les pages se référencent en **URLs propres** (`/biographie`) et le socle en `../_shared/…`.

## Règles impératives
- **Ne jamais écrire « NAVBIO »** (ancien nom) — renommé en **« NAVLYS NEXT GEN »**. La CI échoue sinon.
- **Aucun secret** dans le dépôt (il est **public**). Clés Supabase `anon` OK (publiques) ; `service_role` jamais.
- Numéro WhatsApp unique : `972537082746`.
- Chaque page reste **autonome** (HTML complet) ; favicon en data-URI SVG ; OG + canonical par site.

## Garde-fous CI (doivent rester verts)
Workflow `Sites check` + `Secret scan`. **Avant de pousser**, lancer en local :
```bash
python3 scripts/check_internal_links.py     # anti-404 liens internes
python3 scripts/check_secrets.py            # anti-secret
grep -rln --include='*.html' -e 'NAVBIO' .  # doit ne rien renvoyer
```
- Tailwind est **compilé** (`scripts/build_tailwind.sh` → `sites/_shared/tailwind.css`) — pas de CDN runtime.
- Images OG : `scripts/gen_og_images.py` (placeholders, remplaçables).

## Workflow Git
- Développer sur une branche `claude/<sujet>`, ouvrir une **PR** vers `main`, attendre la **CI verte**, puis merge.
- Voir aussi `SECURITY.md`, `STATUS.md`, `docs/MISE_EN_LIGNE_VERCEL.md`.
