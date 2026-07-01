---
name: navlys-guardrails
description: À lancer AVANT chaque push/PR sur NOVA-HUB. Vérifie les 3 garde-fous (anti-404 liens internes, anti-secret, anti-NAVBIO) et l'alignement de branche, pour ne jamais casser la CI. Utiliser dès qu'on a modifié des fichiers HTML/JS/config du dépôt NAVLYS.
---

# NAVLYS — Garde-fous avant push

But : **ne jamais pousser quelque chose qui casse la CI** (« Sites check » + « Secret scan »).

## Checklist (toujours, dans l'ordre)
```bash
python3 scripts/check_internal_links.py     # anti-404 liens internes
python3 scripts/check_secrets.py            # anti-secret (service_role, sk-…, tokens)
grep -rln --include='*.html' -e 'NAVBIO' .  # DOIT ne rien renvoyer (renommé NAVLYS NEXT GEN)
```
Les 3 doivent être **verts/vides** avant `git add`.

## Pièges appris (à éviter)
- **« NAVBIO » = échec CI immédiat.** Toujours écrire **« NAVLYS NEXT GEN »**.
- **Secrets** : clé Supabase `anon` OK (publique) ; `service_role` JAMAIS. Clés API → **variables d'env**, jamais dans le dépôt. (`check_secrets.py` décode les JWT et bloque `service_role`.)
- **Base de branche périmée** : avant de partir d'une vieille branche, vérifier
  `git diff --stat origin/main..HEAD`. Si des fichiers non touchés (README, STATUS, CLAUDE.md)
  apparaissent en **suppressions**, la branche est en retard → **reconstruire sur `origin/main`**
  (reset --hard origin/main + reposer ses ajouts) pour ne PAS régresser le travail des autres PR.
- **Assets binaires manquants** (`/assets/*.mp4`, `ecusson.png`) ne cassent PAS la CI (le checker ne vérifie que les liens HTML internes) — un `<video>` retombe sur son `poster`.

## Après vérif
`git add … && git commit && git push -u origin <branche>` puis ouvrir une **PR brouillon**.
