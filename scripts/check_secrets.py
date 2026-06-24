#!/usr/bin/env python3
"""Garde-fou anti-secret : échoue (exit 1) si une clé/secret à haute confiance
est commise dans le dépôt (qui est PUBLIC). Patterns volontairement ciblés pour
éviter les faux positifs. Le script s'exclut lui-même du scan.

Cas spécial Supabase : seules les clés *service_role* (secrètes) sont signalées ;
les clés *anon* (publiques, destinées au navigateur) sont autorisées — on décode
le JWT pour distinguer les deux."""
import os, re, sys, base64

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SELF = os.path.abspath(__file__)
SKIP_DIRS = {".git", "node_modules"}
# Extensions binaires / médias ignorées
SKIP_EXT = {".png", ".jpg", ".jpeg", ".gif", ".webp", ".mp4", ".webm", ".mov",
            ".ico", ".woff", ".woff2", ".ttf", ".otf", ".pdf", ".zip"}

PATTERNS = {
    "Clé privée":         re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----"),
    "AWS access key":     re.compile(r"\bAKIA[0-9A-Z]{16}\b"),
    "GitHub token":       re.compile(r"\b(ghp|gho|ghs|ghr)_[A-Za-z0-9]{36}\b"),
    "GitHub PAT (fine)":  re.compile(r"\bgithub_pat_[A-Za-z0-9_]{22,}\b"),
    "Slack token":        re.compile(r"\bxox[baprs]-[A-Za-z0-9-]{10,}\b"),
    "Stripe live key":    re.compile(r"\bsk_live_[A-Za-z0-9]{16,}\b"),
    "Google API key":     re.compile(r"\bAIza[0-9A-Za-z_\-]{35}\b"),
    "Clé Anthropic":      re.compile(r"\bsk-ant-[A-Za-z0-9_\-]{20,}\b"),
    "Clé OpenAI (projet)":re.compile(r"\bsk-proj-[A-Za-z0-9_\-]{20,}\b"),
    "Clé OpenAI":         re.compile(r"\bsk-[A-Za-z0-9]{32,}\b"),
}

# JWT générique (header.payload.signature) — on ne signale QUE service_role.
JWT_RE = re.compile(r"\beyJ[A-Za-z0-9_\-]{8,}\.[A-Za-z0-9_\-]{8,}\.[A-Za-z0-9_\-]{6,}\b")


def jwt_is_service_role(token):
    """True si le payload du JWT contient role=service_role (clé Supabase secrète)."""
    try:
        payload = token.split(".")[1]
        payload += "=" * (-len(payload) % 4)  # padding base64url
        data = base64.urlsafe_b64decode(payload).decode("utf-8", "ignore")
        return "service_role" in data
    except Exception:
        return False


hits = []
for dirpath, dirnames, filenames in os.walk(ROOT):
    dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
    for fn in filenames:
        path = os.path.join(dirpath, fn)
        if os.path.abspath(path) == SELF:
            continue
        if os.path.splitext(fn)[1].lower() in SKIP_EXT:
            continue
        try:
            with open(path, "r", encoding="utf-8", errors="ignore") as f:
                text = f.read()
        except Exception:
            continue
        rel = os.path.relpath(path, ROOT)
        for label, rx in PATTERNS.items():
            if rx.search(text):
                hits.append(f"{label} dans {rel}")
        for m in JWT_RE.finditer(text):
            if jwt_is_service_role(m.group()):
                hits.append(f"Clé Supabase service_role (JWT) dans {rel}")
                break

# Fichiers sensibles qui ne devraient jamais être commis
for dirpath, dirnames, filenames in os.walk(ROOT):
    dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
    for fn in filenames:
        if fn.startswith(".env") or fn.endswith((".pem", ".key")) or fn.startswith("id_rsa"):
            rel = os.path.relpath(os.path.join(dirpath, fn), ROOT)
            hits.append(f"Fichier sensible commis : {rel}")

if hits:
    print("❌ Secret(s) potentiel(s) détecté(s) dans le dépôt PUBLIC :")
    for h in sorted(set(hits)):
        print("  -", h)
    print("\nRetire le secret, régénère-le côté service, et ne commite jamais de clé.")
    sys.exit(1)
print("✅ Aucun secret détecté. Le dépôt public est propre.")
