#!/usr/bin/env python3
"""Generates the Commoner identity kit into assets/commoner/ (SVG, then PNG via resvg).

Created at the founder's direction on 2026-11-24 (documented exception to the
"agents create zero brand material" rule; see CREDITS.md). Not part of CI: the
output is committed. Run from the repo root:

  nix shell --impure --expr 'let p = import <nixpkgs> {}; in p.buildEnv { name = "kit"; paths = [ (p.python3.withPackages (ps: [ ps.fonttools ps.brotli ])) p.resvg ]; }' -c python3 tools/commoner-kit.py

Every shape is filled (no strokes, square corners), so nothing drifts with scale. Text is converted to outlines from the vendored
Atkinson Hyperlegible Mono (SIL OFL 1.1), so no file needs the font.
"""
import math, pathlib, subprocess, sys
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "commoner"
FONT = ROOT / "fonts" / "atkinson-hyperlegible-mono-latin.woff2"
INK, PAGE = "#000000", "#FFFFFF"
NAME, SITE = "Commoner", "commoner.letsimpl.fyi"
TAGLINE = "Explore the commons."
DESCRIPTOR = "Free. Free Software. Simple and Stupid."
LICENCE = "AGPL-3.0-or-later"

def n(v): return f"{v:.2f}".rstrip("0").rstrip(".")

# ---- the camera, on a 64-unit grid -----------------------------------------------
def pts(points): return "M" + "L".join(f"{n(x)} {n(y)}" for x, y in points) + "Z"

def circle(cx, cy, r): return f"M{n(cx - r)} {n(cy)}A{n(r)} {n(r)} 0 1 0 {n(cx + r)} {n(cy)}A{n(r)} {n(r)} 0 1 0 {n(cx - r)} {n(cy)}Z"

def ring(cx, cy, r_out, r_in): return circle(cx, cy, r_out) + circle(cx, cy, r_in)

def rect(x0, y0, x1, y1): return pts([(x0, y0), (x1, y0), (x1, y1), (x0, y1)])

def camera(small=False):
    """A fixed-lens rangefinder compact in the shape of a Fujifilm X100-style body (reference supplied by the founder):
    wide and low, a solid top plate with two dials rising on the left and cut-outs for the viewfinder and flash, an
    outlined body and one big lens right of centre. No marks, text or texture. One path filled with the even-odd rule, so
    the cut-outs and rings are clean holes. Corners are square; only the lens is round."""
    if not small:
        outer = [(4, 22), (8, 22), (8, 18), (15, 18), (15, 22), (17.5, 22), (17.5, 19.2), (27, 19.2), (27, 22), (60, 22), (60, 56), (4, 56)]
        hole = [(6, 29.5), (58, 29.5), (58, 54), (6, 54)]
        cut = rect(46.5, 24, 55.5, 27.8) + rect(31, 24, 38.5, 27.8)
        cx, cy = 37, 41.8
        return pts(outer) + pts(hole) + cut + ring(cx, cy, 10.5, 8.8) + circle(cx, cy, 6.2)
    # favicon: chunkier, fewer parts (a 2-unit wall disappears at 16 px)
    outer = [(3, 24), (10, 24), (10, 19), (22, 19), (22, 24), (61, 24), (61, 56), (3, 56)]
    hole = [(7.2, 32.5), (56.8, 32.5), (56.8, 51.8), (7.2, 51.8)]
    cut = rect(46, 26.5, 56, 30)
    return pts(outer) + pts(hole) + cut + ring(36, 42, 8.4, 5.4) + circle(36, 42, 2.6)

MARK = camera()
FAVICON = camera(small=True)
BBOX = (4, 18, 60, 56)          # visible extent of MARK in grid units: x0, y0, x1, y1

# ---- text outlines -----------------------------------------------------------------
_fonts = {}
def font(weight):
    if weight not in _fonts:
        _fonts[weight] = instantiateVariableFont(TTFont(FONT), {"wght": weight}, inplace=False)
    return _fonts[weight]

def text(s, size, weight, x, baseline, anchor="start"):
    f = font(weight); gs = f.getGlyphSet(); cmap = f.getBestCmap(); upm = f["head"].unitsPerEm
    scale = size / upm
    width = sum(f["hmtx"][cmap[ord(c)]][0] for c in s) * scale
    if anchor == "middle": x -= width / 2
    elif anchor == "end": x -= width
    pen = SVGPathPen(gs, ntos=lambda v: n(v)); cx = x
    for c in s:
        name = cmap[ord(c)]
        gs[name].draw(TransformPen(pen, (scale, 0, 0, -scale, cx, baseline)))
        cx += f["hmtx"][name][0] * scale
    return pen.getCommands(), width

def advance(s, size, weight):
    return text(s, size, weight, 0, 0)[1]

# ---- svg helpers -------------------------------------------------------------------
def svg(w, h, label, body, bg=None, extra=""):
    rect_bg = f'<rect width="{w}" height="{h}" fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" role="img" aria-label="{label}">'
            f'<title>{label}</title>{extra}{rect_bg}{body}</svg>\n')

def put(d, scale, tx, ty, fill): return f'<path transform="translate({n(tx)} {n(ty)}) scale({n(scale)})" d="{d}" fill="{fill}" fill-rule="evenodd"/>'
def glyph(d, fill): return f'<path d="{d}" fill="{fill}"/>'

def placed(d, height, left, baseline, fill):
    """Mark scaled so its visible height equals `height`, bottom on `baseline`, left edge at `left`."""
    x0, y0, x1, y1 = BBOX
    k = height / (y1 - y0)
    return put(d, k, left - x0 * k, baseline - y1 * k, fill), k

def centred(d, width, cx, cy, fill):
    """Mark scaled so its visible width equals `width`, centred on (cx, cy)."""
    x0, y0, x1, y1 = BBOX
    k = width / (x1 - x0)
    return put(d, k, cx - (x0 + x1) / 2 * k, cy - (y0 + y1) / 2 * k, fill)

def lockup(w, h, fill, bg, label=NAME):
    fs = 150
    x0, y0, x1, y1 = BBOX
    cam_h = fs * 0.8
    figw = (x1 - x0) / (y1 - y0) * cam_h
    gap = fs / 3
    word_w = advance(NAME, fs, 700)
    total = figw + gap + word_w
    left = (w - total) / 2
    baseline = h / 2 + fs / 2
    fig, _ = placed(MARK, cam_h, left, baseline, fill)
    word, _ = text(NAME, fs, 700, left + figw + gap, baseline)
    return svg(w, h, label, fig + glyph(word, fill), bg)

def stacked(w, h, cam_w, bottom, word_size, baseline, extra_line=None):
    x0, y0, x1, y1 = BBOX
    cam_h = cam_w * (y1 - y0) / (x1 - x0)
    fig = centred(MARK, cam_w, w / 2, bottom - cam_h / 2, INK)
    word, _ = text(NAME, word_size, 700, w / 2, baseline, "middle")
    body = fig + glyph(word, INK)
    if extra_line:
        t, size, wt, base = extra_line
        body += glyph(text(t, size, wt, w / 2, base, "middle")[0], INK)
    return body

def social(w, h):
    k = w / 1200
    x0, y0, x1, y1 = BBOX
    cam_w = 250 * k
    cam_h = cam_w * (y1 - y0) / (x1 - x0)
    left = 84 * k
    fig = centred(MARK, cam_w, left + cam_w / 2, 262 * k, INK)
    tx = left + cam_w + 70 * k
    body = fig
    body += glyph(text(NAME, 128 * k, 700, tx, 222 * k)[0], INK)
    body += glyph(text(TAGLINE, 46 * k, 400, tx, 310 * k)[0], INK)
    body += glyph(text(DESCRIPTOR, 28 * k, 400, tx, 381 * k)[0], INK)
    body += f'<rect x="{n(84 * k)}" y="{n(504 * k)}" width="{n(1032 * k)}" height="{n(4 * k)}" fill="{INK}"/>'
    body += glyph(text(SITE, 30 * k, 700, 84 * k, 566 * k)[0], INK)
    body += glyph(text(LICENCE, 30 * k, 400, 1116 * k, 566 * k, "end")[0], INK)
    label = f"{NAME}: {TAGLINE} {DESCRIPTOR}"
    return svg(w, h, label, body, PAGE)

# ---- empty-state glyphs (line glyphs only, like the Chaikadi set) --------------------
def stroke_path(d, dash=None):
    extra = f' stroke-dasharray="{dash}"' if dash else ""
    return f'<path d="{d}" fill="none" stroke="{INK}" stroke-width="10" stroke-linejoin="miter" stroke-linecap="butt"{extra}/>'

FRAME = "M230 140H570V460H230Z"
def empty(label, body): return svg(800, 600, label, body, PAGE)

# ---- write -------------------------------------------------------------------------
def write(name, content): (OUT / name).write_text(content)

def raster(name, width, height=None):
    src = OUT / f"{name}.svg"
    dst = OUT / (f"{name}-{width}x{height}.png" if height else f"{name}-{width}.png")
    subprocess.run(["resvg", "-w", str(width), str(src), str(dst)], check=True)

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    mark = lambda fill: f'<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" role="img" aria-label="{NAME} mark"><title>{NAME} mark</title><path d="{MARK}" fill="{fill}" fill-rule="evenodd"/></svg>\n'
    write("logo-mark.svg", mark(INK)); write("logo-mark-inverse.svg", mark(PAGE))
    write("logo-primary.svg", lockup(1280, 720, INK, PAGE)); write("logo-primary-inverse.svg", lockup(1280, 720, PAGE, INK))
    write("logo-mono.svg", lockup(1280, 720, INK, None)); write("logo-mono-inverse.svg", lockup(1280, 720, PAGE, None))
    style = "<style>path{fill:#000;fill-rule:evenodd}@media (prefers-color-scheme:dark){path{fill:#fff}}</style>"
    write("favicon.svg", f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="{NAME}"><title>{NAME}</title>{style}<path d="{FAVICON}"/></svg>\n')
    write("app-icon.svg", svg(512, 512, NAME, centred(MARK, 330, 256, 256, INK), PAGE))
    write("app-icon-maskable.svg", svg(512, 512, NAME, centred(MARK, 260, 256, 256, INK), PAGE))
    write("splash.svg", svg(1080, 1920, NAME, stacked(1080, 1920, 300, 1038, 114, 1208), PAGE))
    write("loading.svg", svg(1080, 1920, NAME, stacked(1080, 1920, 300, 1038, 114, 1208, ("Loading", 44, 400, 1310)), PAGE))
    write("og-image.svg", social(1200, 630)); write("github-social.svg", social(1280, 640))
    write("empty-category.svg", empty("No files in this category", stroke_path(FRAME + "M230 400L330 300L400 370L450 320L570 440") + stroke_path("M470 215H505V250H470Z")))
    write("not-found.svg", empty("Category not found", stroke_path(FRAME) + stroke_path("M300 210L500 390M500 210L300 390")))
    write("offline.svg", empty("No connection", stroke_path(FRAME, "40 24") + stroke_path("M300 300H500")))
    for name, w, h in [("app-icon", 192, None), ("app-icon", 512, None), ("app-icon-maskable", 512, None)]:
        raster(name, w)
    subprocess.run(["resvg", "-w", "180", str(OUT / "app-icon.svg"), str(OUT / "apple-touch-icon-180.png")], check=True)
    subprocess.run(["resvg", "-w", "400", str(OUT / "app-icon.svg"), str(OUT / "avatar-400.png")], check=True)
    subprocess.run(["resvg", "-w", "1080", str(OUT / "splash.svg"), str(OUT / "splash-1080x1920.png")], check=True)
    subprocess.run(["resvg", "-w", "1080", str(OUT / "loading.svg"), str(OUT / "loading-1080x1920.png")], check=True)
    subprocess.run(["resvg", "-w", "1200", str(OUT / "og-image.svg"), str(OUT / "og-image.png")], check=True)
    subprocess.run(["resvg", "-w", "1280", str(OUT / "github-social.svg"), str(OUT / "github-social.png")], check=True)
    print("wrote", len(list(OUT.iterdir())), "files to", OUT)

main()
