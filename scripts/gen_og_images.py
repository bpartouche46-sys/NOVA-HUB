#!/usr/bin/env python3
"""Génère des images Open Graph 1200x630 brandées (placeholders) pour chaque site.
Auto-fit du titre pour qu'il tienne dans le cadre. Remplaçables par un vrai visuel."""
from PIL import Image, ImageDraw, ImageFont
import pathlib, math

W, H = 1200, 630
NOIR = (2, 4, 10); OR = (201, 169, 97); ICE = (125, 211, 252)
PERLE = (231, 238, 242); MUT = (159, 179, 200)
MAXW = W - 200  # marge gauche/droite

def font(sz, bold=True):
    name = "DejaVuSans-Bold.ttf" if bold else "DejaVuSans.ttf"
    try: return ImageFont.truetype(name, sz)
    except Exception: return ImageFont.load_default()

def fit_font(text, start, bold=True, minsz=28):
    sz = start
    while sz > minsz:
        f = font(sz, bold)
        bb = f.getbbox(text)
        if (bb[2]-bb[0]) <= MAXW: return f
        sz -= 4
    return font(minsz, bold)

def center(d, y, text, fnt, fill):
    bb = d.textbbox((0,0), text, font=fnt)
    d.text(((W-(bb[2]-bb[0]))/2 - bb[0], y), text, font=fnt, fill=fill)

def gradient_bg(accent):
    img = Image.new("RGB", (W, H), NOIR); px = img.load()
    cx, cy = W*0.5, H*1.25; maxd = math.hypot(W, H); ar, ag, ab = accent
    for y in range(H):
        for x in range(0, W, 2):
            t = max(0.0, 0.42 - math.hypot(x-cx, y-cy)/maxd) * 0.5
            c = (int(NOIR[0]+(ar-NOIR[0])*t), int(NOIR[1]+(ag-NOIR[1])*t), int(NOIR[2]+(ab-NOIR[2])*t))
            px[x, y] = c
            if x+1 < W: px[x+1, y] = c
    return img

def make(path, kicker, brand, tagline, accent):
    img = gradient_bg(accent); d = ImageDraw.Draw(img)
    d.rectangle([24,24,W-24,H-24], outline=accent, width=2)
    center(d, 150, kicker, fit_font(kicker, 28, False), MUT)
    center(d, 215, brand, fit_font(brand, 100, True), OR)
    center(d, 372, tagline, fit_font(tagline, 38, False), PERLE)
    center(d, 480, "navlys", font(26, True), accent)
    p = pathlib.Path(path); p.parent.mkdir(parents=True, exist_ok=True)
    img.save(path, "JPEG", quality=88); print("OK", path)

make("sites/brunopartouche/assets/bg-1.jpg", "SKIPPER · FINANCE · METHODE 90/10",
     "BRUNO MARK PARTOUCHE", "L'exemple vivant.", OR)
make("sites/navlys-core/assets/og-core.jpg", "UN CERVEAU · UNE PERSONNE · UN UNIVERS",
     "NAVLYS", "L'IA est le vent, c'est toi qui tiens la barre.", ICE)
make("sites/navlys-core/assets/bg-1.jpg", "EDUCATION · VEILLE · 0 EUR",
     "NAVLYS", "La methode 90/10.", ICE)
make("sites/navlys/assets/bg-1.jpg", "EDUCATION · VEILLE",
     "NAVLYS", "La methode 90/10.", ICE)
make("sites/navlys-io/assets/og-io.jpg", "VITRINE LIVE · FAMILLE NAVLYS",
     "NAVLYS.IO", "Profils · Creations · Partenariats.", OR)

# navbiolife (NAVLYS NEXT GEN) — prêt pour le merge de la PR #11
make("sites/navbiolife/assets/og-nextgen.jpg", "BIOGRAPHIE VIVANTE · MEMOIRE · TRANSMISSION",
     "NAVLYS NEXT GEN", "Ta vie, racontee. Gardee. Transmise.", OR)
