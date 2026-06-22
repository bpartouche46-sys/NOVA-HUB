#!/usr/bin/env python3
"""Vérifie que tous les liens internes (href="/...") pointent vers une page existante.
Sites plats : sites/<site>/<page>.html, et "/" => index.html.
Sortie code 1 si au moins un lien mort. Utilisé par la CI (sites-check)."""
import pathlib, re, sys

root = pathlib.Path("sites")
bad = []
for site in sorted(p for p in root.iterdir() if p.is_dir() and p.name != "_shared"):
    pages = {f.stem for f in site.glob("*.html")}
    for f in sorted(site.glob("*.html")):
        html = f.read_text(encoding="utf-8")
        for href in re.findall(r'href="(/[^"#?]*)"', html):
            if href.startswith("/assets") or href.endswith((".js", ".css")):
                continue
            seg = href.strip("/")
            if seg == "" or seg in pages:        # "/" -> index, "/page" -> page.html
                continue
            bad.append(f"{site.name}/{f.name}  ->  {href}")

if bad:
    print("Liens internes morts :")
    for b in bad:
        print("  DEAD ", b)
    sys.exit(1)
print("OK — aucun lien interne mort.")
