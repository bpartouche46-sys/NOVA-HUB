# Sécurité — NAVLYS / NOVA-HUB

> Principe : **garde-fous toujours actifs** + **authentification à 2 niveaux (2FA) partout où elle existe**.
> Accès prévu depuis : poste principal, mobile, ancien poste — **et rien d'autre**.

## 1. Garde-fous automatiques (CI — déjà actifs)
À chaque PR / push sur `main`, GitHub Actions vérifie :
- **Secret scan** (`scripts/check_secrets.py`) : la PR **échoue** si une clé privée, un token (GitHub, AWS, Slack, Stripe, Google, **OpenAI/Anthropic**, **Supabase `service_role`**) ou un fichier `.env` / `.pem` / `.key` est commis. Le dépôt est **public** → aucun secret ne doit y entrer. *(Les clés Supabase `anon`, publiques par conception, restent autorisées — le JWT est décodé pour distinguer `anon` de `service_role`.)*
- **Anti-NAVBIO**, **HTML valide**, **liens internes (anti-404)** (workflow `Sites check`).

## 2. Authentification à 2 niveaux (2FA) — À ACTIVER (action manuelle, une fois par compte)
La 2FA ne peut pas être activée par du code : à faire dans chaque compte. **Priorité haute.**

| Service | Où activer la 2FA | Sessions multi-appareils |
|---|---|---|
| **GitHub** | Settings → Password and authentication → Two-factor | Settings → Sessions |
| **Vercel** | Account Settings → Authentication / 2FA | Settings → Sessions |
| **Google** (bpartouche46@gmail.com) | Compte Google → Sécurité → Validation en 2 étapes | Sécurité → Vos appareils |
| **Supabase** | Account → Security → MFA | — |
| **Claude** (claude.ai) | Settings → Security | — |

Recommandé : une **app d'authentification** (Google Authenticator / Authy) plutôt que le SMS.

## 3. Accès multi-appareils (poste principal · mobile · ancien poste)
- Tout est **dans le cloud** → connexion via navigateur sur chaque appareil. Rien n'est lié à une machine.
- Utiliser un **gestionnaire de mots de passe** (trousseau Google/Apple ou Bitwarden) pour des accès identiques et sûrs sur les 3 appareils.
- **Ancien poste** : le garder verrouillé et à jour. En cas de cession → **« déconnecter tous les appareils »** dans GitHub / Google / Vercel.

## 4. Règles d'or
- **Jamais** de secret/clé/mot de passe dans le dépôt **ni dans un chat**.
- Une clé exposée = **compromise** → la **régénérer** côté service immédiatement.
- Limiter l'accès aux **5 comptes** ci-dessus ; ne rien ajouter d'autre.

## 5. Signaler un problème
Contact via WhatsApp (lien présent sur les sites). Ne jamais transmettre de secret en clair.
