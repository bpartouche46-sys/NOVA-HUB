---
name: navlys-connectors
description: Brancher et utiliser les connecteurs (Zapier apps + MCP) pour NAVLYS sans perdre temps/argent. À utiliser pour activer/autoriser ElevenLabs, HeyGen, Runway, Vercel, Gmail… ou diagnostiquer une erreur d'auth/plan. Capture les pièges réels (plan payant, stream closed, param resolver, proxy).
---

# NAVLYS — Connecteurs : mode d'emploi + pièges

## Brancher une app via Zapier
1. `discover_zapier_actions(app="NomApp")` → récupérer `selected_api`.
2. `enable_zapier_action(selected_api)` → ajoute les actions ; renvoie souvent `needs_auth` + `auth_url`.
3. **Bruno** ouvre `auth_url` (1 clic, connexion à SON compte) — **incontournable**, c'est sa sécurité.
4. Tester avec une action READ légère (`execute_zapier_read_action`) avant d'écrire.

## État vérifié des connecteurs média
| Connecteur | Marche ? | Note |
|---|---|---|
| **ElevenLabs** (`App226160CLIAPI`) | ✅ **OUI** | `text_to_speech` ; voix de marque « navlys core » = `voice_id 6hUoby5ZAVW4JqvIJeri` ; modèle `eleven_multilingual_v2` |
| **HeyGen** (`HeyGenCLIAPI`) | 🟠 auth OK, **génération bloquée** | « OAuth integration apps require a paid plan » → **plan HeyGen API payant requis** |
| **Runway** (`App227006CLIAPI`) | 🟠 nécessite clé API | API **séparée** des crédits web → `dev.runwayml.com` (org + billing + API key) |
| **Vercel** (`App238032CLIAPI`) | needs token | `create_project`/`create_deployment` (cf. skill navlys-deploy-vercel) |

## Pièges qui coûtent (à connaître)
- **« stream closed » / « permission stream closed »** = instabilité Zapier, PAS une vraie erreur → **relancer 1 fois**, ça repart.
- **Param resolver qui « devine »** : Zapier peut remplacer un `id` fourni par une valeur devinée (status `llm-guess`) → pour les actions sensibles (archiver un mail), **vérifier `resolvedParams`** ; ne pas se fier au succès apparent.
- **Gmail tri** : `Find Email` renvoie **1 mail à la fois** → **inutilisable pour nettoyer 200 mails**. La vraie solution scalable = **filtre Gmail** (UI, 2 taps : `category:promotions` → Skip Inbox + Appliquer aux conversations). Pas de boucle API.
- **« API payante » ≠ crédits web** : HeyGen et Runway gatent leur API derrière un plan/billing distinct du site web.
- **Proxy egress** : le téléchargement depuis `export-download.canva.com` est **bloqué (403)** par la politique réseau. Ne pas contourner. Alternative : faire envoyer le fichier par Bruno, ou passer par un host autorisé (`zapier-dev-files.s3.amazonaws.com` passe).
- **MCP qui demande auth en session non-interactive** (Stripe, HyperFrames…) : impossible d'autoriser depuis l'agent → le signaler, Bruno autorise via ses réglages connecteurs.

## Réflexe MacGyver
Devant un blocage : chercher un **autre connecteur / outil / angle** avant de renvoyer la balle.
Seule exception non contournable = **login d'un compte tiers** (1 clic appartient à Bruno).
