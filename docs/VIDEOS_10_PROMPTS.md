# NAVLYS — Brief de production : 10 vidéos (13 s, 1080p, ralenti cinématique)

**Réglages communs**
- Résolution **1920×1080 (Full HD)**, **13 s**, **ralenti ~0,5×** (générer le mouvement lent à la source ou tourner 60 fps → retime ; viser fluide, fort bitrate, zéro artefact).
- **Voix** : voix clonée **« navlys core »** (ElevenLabs `eleven_multilingual_v2`).
- **Charte** : bleu glacier `#7DD3FC` / `#BAE6FD`, fonds nuit `#02040a`, sobre & premium, tutoiement chaleureux.
- **WhatsApp** : `972537082746`.
- **Blasons** : un écusson par app — `brunopartouche` · `navlys (core)` · `navlys next gen` · `navlys.io`.

**Outils de rendu (état réel)**
- Vidéos 6→10 (toi / visage cloné) = **HeyGen** → *nécessite ton plan HeyGen API payant*.
- Vidéos 1→5 (flotte cinématique) = moteur **texte→vidéo** (Runway / Kling / Sora / fal.ai) — *à connecter*, ou tes rushes que j'habille.
- Voix = **prête** (ElevenLabs ✅).

---

## PARTIE A — 5 vidéos « Flotte cinématique » (B-roll maritime)

### 🎬 Vidéo 1 — « La flotte au lever du jour »
- **Visuel** : un bateau amiral NAVLYS en tête, **3 bateaux derrière** en formation, chacun arborant un **blason d'app** sur la voile/coque (brunopartouche, navlys next gen, navlys.io). Mer bleu glacier, brume légère, soleil rasant.
- **Caméra** : travelling latéral lent + léger drone qui s'élève. Ralenti 0,5×.
- **Son** : clapot doux, vent léger, nappe cinématique ascendante.
- **Voix (off)** : « Une famille, un cap. NAVLYS avance — et toute la flotte suit. »

### 🎬 Vidéo 2 — « Le blason qui s'illumine »
- **Visuel** : macro sur l'écusson NAVLYS gravé sur la coque ; **gouttes d'eau en ultra-ralenti**, halo bleu glacier qui s'allume sur le blason.
- **Caméra** : focus rack lent, profondeur de champ courte.
- **Son** : goutte, réverbération cristalline, sub grave discret.
- **Voix (off)** : « Derrière chaque blason, une promesse : la tienne. »

### 🎬 Vidéo 3 — « Cap sur l'horizon »
- **Visuel** : vue **drone top-down** suivant le sillage ; la flotte en **V**, eau turquoise profonde.
- **Caméra** : descente verticale lente puis avance. Ralenti 0,5×.
- **Son** : souffle aérien, montée orchestrale légère.
- **Voix (off)** : « Cap sur ta liberté. Droit, net, serein. »

### 🎬 Vidéo 4 — « La vague et la sérénité »
- **Visuel** : étrave qui fend une eau calme, **embruns en slow-mo**, lumière dorée/bleutée premium.
- **Caméra** : plan rapproché bas, contre-jour.
- **Son** : eau fendue, respiration, piano feutré.
- **Voix (off)** : « La méthode, pas la précipitation. Avance avec sérénité. »

### 🎬 Vidéo 5 — « Nuit étoilée, phare NAVLYS »
- **Visuel** : bateau de nuit, **feux de navigation bleu glacier**, reflets sur l'eau noire, ciel étoilé ; au loin un phare.
- **Caméra** : panoramique lent, reflet miroir.
- **Son** : nuit marine, cloche lointaine, nappe profonde.
- **Voix (off)** : « NAVLYS NEXT GEN — protéger, transmettre, éclairer la route. »

---

## PARTIE B — 5 vidéos « Toi qui parles » (avatar / visage cloné HeyGen)

> Pré-requis communs : avatar HeyGen entraîné depuis tes **photos + vidéo de consentement**, voix « navlys core », cadrage buste, fond nuit + halo glacier, sous-titres FR optionnels.

### 🎬 Vidéo 6 — « Bienvenue — Bruno se présente » (brunopartouche)
- **Script (toi)** : « Je suis Bruno Mark Partouche. Homme de mer, bâtisseur de liberté. Bienvenue dans mon univers — entre, je t'explique tout. »
- **Plan** : buste, regard caméra, léger sourire. Blason brunopartouche en filigrane.

### 🎬 Vidéo 7 — « L'offre NAVLYS en 13 s » (navlys.com)
- **Script (toi)** : « Deux caps : Skipper, pour apprendre à naviguer ; Capitaine, pour viser plus loin. La méthode 90/10, simple et sereine. On embarque ? »
- **Plan** : buste, incrustation discrète « Skipper / Capitaine ».

### 🎬 Vidéo 8 — « NAVLYS NEXT GEN » (navbiolife)
- **Script (toi)** : « NAVLYS NEXT GEN, c'est la transmission : protéger ce que tu construis, et le faire grandir pour les tiens. La nouvelle génération commence ici. »
- **Plan** : buste, halo glacier, blason next gen.

### 🎬 Vidéo 9 — « Réponse SAV type » (gabarit avatar)
- **Script (toi)** : « Merci pour ton message ! Je regarde ça tout de suite. Pour aller plus vite, écris-moi sur WhatsApp — je te réponds en personne. »
- **Usage** : gabarit réutilisable pour le **bot SAV** (le texte sera dynamique).

### 🎬 Vidéo 10 — « WhatsApp — réponse express » (navlys.io)
- **Script (toi)** : « Une question ? Un clic, et on se parle sur WhatsApp. Réponse rapide, humaine, fiable. À tout de suite. »
- **Plan** : buste + bouton WhatsApp animé `972537082746`.

---

## Bot SAV / WhatsApp (visage + voix clonés)
Pipeline cible une fois HeyGen payant + WhatsApp Business connecté :
1. Message entrant (WhatsApp/site) → 2. Réponse texte rédigée → 3. **ElevenLabs** (voix navlys core) + **HeyGen** (avatar visage cloné) → 4. Vidéo-réponse personnalisée renvoyée.
