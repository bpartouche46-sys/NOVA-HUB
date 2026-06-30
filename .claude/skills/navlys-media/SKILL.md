---
name: navlys-media
description: Générer les assets média NAVLYS (voix off, images/écusson, vidéos) avec les bons outils et sans gaspiller. À utiliser pour produire des voix off, un écusson, des visuels ou des clips pour la famille NAVLYS.
---

# NAVLYS — Production média

## 🎙️ Voix off (✅ OPÉRATIONNEL — ElevenLabs via Zapier)
```
execute_zapier_write_action(
  selected_api="App226160CLIAPI", action="text_to_speech",
  params={ text:"…", voice_id:"6hUoby5ZAVW4JqvIJeri",     // « navlys core » (voix de marque)
           model_id:"eleven_multilingual_v2", output_format:"mp3_44100_128" })
```
- Le résultat renvoie une URL `zapier-dev-files.s3.amazonaws.com` → **téléchargeable** (proxy OK).
- `curl -sS -L -o sites/<site>/assets/<nom>.mp3 "<url>"` puis commit.
- Si « stream closed » → relancer 1 fois.

## 🖼️ Images / écusson (Canva ou Adobe Firefly)
- Génération : `mcp__Canva__generate-design` (type `logo`) → candidats → `export-design` (PNG).
- ⚠️ **Le téléchargement Canva est bloqué par le proxy** (`export-download.canva.com` → 403).
  → Faire **télécharger le PNG par Bruno** puis le récupérer (chat / Dropbox), OU générer via Firefly.
- Fond transparent PNG = Canva **Pro** requis ; en gratuit, exporter fond plein (l'écusson est sur fond nuit `#02040a`, ça colle).

## 🎬 Vidéos (à débloquer)
- **HeyGen** : avatars/talking-head — **plan API payant** requis.
- **Runway** : texte→image→vidéo, Act Two (visage) — **clé API** `dev.runwayml.com` (billing séparé des crédits web).
- **HyperFrames (HeyGen)** : `render` désactivé pour un agent CLI → utiliser le skill local `npx skills add heygen-com/hyperframes` ou la version hébergée.
- Format cible NAVLYS : 1080p, 13 s, ralenti cinématique. Brief complet : `docs/VIDEOS_10_PROMPTS.md`.

## Constantes utiles
- Voix de marque : `6hUoby5ZAVW4JqvIJeri`.
- WhatsApp : `972537082746`.
- Charte : glacier `#7DD3FC`/`#BAE6FD`, nuit `#02040a`, or `#C9A961`.
