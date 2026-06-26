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

## Constantes de marque

### Domaines → dossiers
| Domaine | Dossier |
|---|---|
| `brunopartouche.com` | `sites/brunopartouche` |
| `navlys.com` | `sites/navlys-core` |
| `navbiolife.com` | `sites/navbiolife` |
| `navlys.io` | `sites/navlys-io` |

### Palette navlys-core / navbiolife
```css
--noir: #05060a   /* fond principal */
--ice:  #5fe0ff   /* bleu glacé */
--or:   #e9d3a0   /* or doux */
--rouge:#ff2a1f   /* rouge vif */
--vin:  #7a1f2b   /* bordeaux */
--perle:#eef0f6   /* texte clair */
--mut:  #9fb3c8   /* gris atténué */
```

## Workflow Git
- Développer sur une branche `claude/<sujet>`, ouvrir une **PR** vers `main`, attendre la **CI verte**, puis merge.
- **Toujours terminer une session Coding Agent** par `report_progress` + `create_pull_request`, même pour de petites modifications.
- Voir aussi `SECURITY.md`, `STATUS.md`, `docs/MISE_EN_LIGNE_VERCEL.md`.

## Bonnes pratiques de session

- **Batcher les tâches** : lister toutes les micro-tâches avant d'ouvrir une session et les donner en un seul prompt — évite le surcoût de setup par session.
- **Préférer `grep`** à `view` pour localiser une constante, un élément ou un pattern dans les fichiers HTML nombreux.
- **Code Review** : utile pour du JS/logique ; optionnel pour des pages HTML/CSS/doc purement statiques (la CI couvre déjà les erreurs critiques).
- **`store_memory`** : mémoriser toute constante ou convention découverte en session (couleurs, URLs, règles) pour ne pas la rés-expliquer à chaque fois.
