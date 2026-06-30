# 📈 Journal de bonification — Skills NAVLYS

Pour que Bruno **constate chaque jour** la montée en compétence de l'agent.
Chaque leçon dure (erreur évitée, temps/argent économisé) devient un **skill réutilisable**
dans `.claude/skills/`. On complète avec les skills existants et on propose les nouveautés en ligne.

## Bibliothèque actuelle (`.claude/skills/`)
| Skill | Sert à | Évite |
|---|---|---|
| **navlys-guardrails** | vérifier avant chaque push | casser la CI (NAVBIO, secret, 404, base périmée) |
| **navlys-deploy-vercel** | mettre en ligne sans erreur | tourner en rond sur le déploiement |
| **navlys-connectors** | brancher/utiliser Zapier+MCP | plan payant surprise, stream-closed, mauvais id |
| **navlys-cine-layout** | appliquer le ciné-scroll | doublon de hero, oublis data-hide |
| **navlys-media** | voix/écusson/vidéos | gaspiller des crédits, download bloqué |

## Journal

### 2026-06-30 — Jour 1 (fondation)
**Créé :** les 5 skills ci-dessus.
**Leçons gravées :**
- `@claude` : la clé `ANTHROPIC_API_KEY` arrivait vide → bascule sur **jeton d'abonnement OAuth** (`claude_code_oauth_token`). Le « Claude finished » + 404 compare = succès (le 404 est cosmétique quand pas de commit).
- **Voix off** : ElevenLabs marche (voix « navlys core »). HeyGen/Runway = plan API payant.
- **Branche périmée** : un ultrareview a évité de régresser README/STATUS/CLAUDE.md → reconstruire sur `origin/main`.
- **Ciné-scroll** : design vidéo-haut + sheet, propagé en 1 script partagé (`navlys-cine.js`).
- **SAV** : vrai bot Claude (`api/sav.js`) + widget, clé en variable d'env (zéro secret au dépôt).
- **Déploiement** : seul chemin programmatique = Zapier↔Vercel ; le reste exige le compte de Bruno (1 clic).
- **MacGyver** gravé : toujours chercher un contournement avant de renvoyer la balle.

### Prochaines entrées
- À faire : skill **navlys-sav-bot** (architecture serverless + prompt) une fois le SAV live et vérifié.
- À faire : skill **navlys-domains** (transfert des 4 domaines proprement).
- Rituel quotidien : passer en revue les skills Claude Code dispo en ligne et proposer ceux qui font gagner du temps à NAVLYS.
