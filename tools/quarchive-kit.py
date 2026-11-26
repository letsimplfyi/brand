#!/usr/bin/env python3
"""Generates the quarchive identity kit into assets/quarchive/ (SVG, then PNG via resvg).

Created at the founder's direction on 2026-11-26 (documented exception to the
"agents create zero brand material" rule; see CREDITS.md). Not part of CI: the
output is committed. Run from the repo root:

  nix shell --impure --expr 'let p = import <nixpkgs> {}; in p.buildEnv { name = "kit"; paths = [ (p.python3.withPackages (ps: [ ps.fonttools ps.brotli ])) p.resvg ]; }' -c python3 tools/quarchive-kit.py

The mark is the founder's own drawing, supplied as SVG and reproduced here exactly: stroked, not filled, with its
original line weights and cap styles, so the kit never drifts from the source. Text is converted to outlines from the
vendored Atkinson Hyperlegible Mono (SIL OFL 1.1), so no file needs the font.
"""
import pathlib, subprocess, sys

try:
    import brotli
except ImportError:
    # brotli is only needed to read the vendored WOFF2; fall back to the CLI if present.
    import types
    _m = types.ModuleType("brotli")
    _m.decompress = lambda d: subprocess.run(["brotli", "-d", "-c"], input=d, capture_output=True, check=True).stdout
    _m.compress = lambda d, mode=0: b""
    _m.MODE_FONT, _m.MODE_TEXT = 0, 1
    sys.modules["brotli"] = _m

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "quarchive"
FONT = ROOT / "fonts" / "atkinson-hyperlegible-mono-latin.woff2"
INK, PAGE = "#000000", "#FFFFFF"
NAME, SITE = "quarchive", "quarchive.letsimpl.fyi"
DESCRIPTOR = "Free. Free Software. Simple and Stupid."
LICENCE = "AGPL-3.0-or-later"


def n(v):
    return f"{v:.3f}".rstrip("0").rstrip(".")


# ---- the mark, 256-unit grid, exactly as the founder drew it ------------------------
ELEMENTS = [
    ('polygon', '128,25.069 215.847,60.146 128,95.222 40.153,60.146',
     'stroke-linecap="round" stroke-linejoin="round"'),
    ('path', 'M70.562 72.422 L70.562 100.991 C70.562 111.886 95.902 120.36 128 120.36 '
             'C160.098 120.36 185.438 111.886 185.438 100.991 L185.438 72.422',
     'stroke-linecap="round" stroke-linejoin="round"'),
    ('line', None, 'x1="215.847" y1="60.146" x2="215.847" y2="103.991"', ),
    ('ellipse', None, 'cx="215.847" cy="112.76" rx="8.785" ry="7.6" stroke-linecap="round" stroke-linejoin="round"'),
    ('path', 'M80.975 114.357 C69.64 125.611 62.668 140.922 62.668 157.793 '
             'C62.668 192.35 91.918 220.364 128 220.364 C164.082 220.364 193.332 192.35 193.332 157.793 '
             'C193.332 140.922 186.36 125.611 175.025 114.357',
     'stroke-linecap="square" stroke-miterlimit="10"'),
    ('ellipse', None, 'cx="161.096" cy="142.436" rx="8.082" ry="9.978"', 'fill'),
    ('ellipse', None, 'cx="94.904" cy="142.436" rx="8.082" ry="9.978"', 'fill'),
    ('path', 'M146.317 163.377 C159.981 163.595 168.847 166.967 169.16 179.818 '
             'C169.611 197.937 149.993 196.835 128 196.842 C106.007 196.835 86.389 197.937 86.84 179.818 '
             'C87.153 166.967 96.019 163.595 109.683 163.377',
     'stroke-miterlimit="10"'),
    ('path', 'M106.712 166.339 C106.557 157.568 115.821 148.603 128 148.589 '
             'C140.179 148.603 149.443 157.568 149.288 166.339',
     'stroke-miterlimit="10"'),
]

# visible extent in grid units: the 6-unit stroke is included
BBOX = (37.153, 22.069, 227.632, 223.364)
BW, BH = BBOX[2] - BBOX[0], BBOX[3] - BBOX[1]


def mark(fill=None, wrap=True):
    """The mark. `fill=None` leaves colours to CSS (for the favicon)."""
    out = []
    for el in ELEMENTS:
        kind, d, attrs = el[0], el[1], el[2]
        filled = len(el) > 3 and el[3] == "fill"
        if kind in ("line", "ellipse"):
            geo = attrs
        elif kind == "polygon":
            geo = f'points="{d}" {attrs}'
        else:
            geo = f'd="{d}" {attrs}'
        if filled:
            paint = ' class="f"' if fill is None else f' fill="{fill}" stroke="none"'
        else:
            paint = ' class="s"' if fill is None else f' fill="none" stroke="{fill}" stroke-width="6"'
        out.append(f"<{kind} {geo}{paint}/>")
    inner = "".join(out)
    return f"<g>{inner}</g>" if wrap else inner


def scaled(height=None, width=None, left=None, baseline=None, cx=None, cy=None, fill=INK):
    if height is not None:
        k = height / BH
    else:
        k = width / BW
    if baseline is not None:
        tx, ty = left - BBOX[0] * k, baseline - BBOX[3] * k
    else:
        tx = cx - (BBOX[0] + BBOX[2]) / 2 * k
        ty = cy - (BBOX[1] + BBOX[3]) / 2 * k
    return f'<g transform="translate({n(tx)} {n(ty)}) scale({n(k)})">{mark(fill, wrap=False)}</g>'


# ---- text outlines -----------------------------------------------------------------
_fonts = {}


def font(weight):
    if weight not in _fonts:
        _fonts[weight] = instantiateVariableFont(TTFont(FONT), {"wght": weight}, inplace=False)
    return _fonts[weight]


def text(s, size, weight, x, baseline, anchor="start"):
    f = font(weight)
    gs, cmap, upm = f.getGlyphSet(), f.getBestCmap(), f["head"].unitsPerEm
    scale = size / upm
    width = sum(f["hmtx"][cmap[ord(c)]][0] for c in s) * scale
    if anchor == "middle":
        x -= width / 2
    elif anchor == "end":
        x -= width
    pen, cx = SVGPathPen(gs, ntos=n), x
    for c in s:
        name = cmap[ord(c)]
        gs[name].draw(TransformPen(pen, (scale, 0, 0, -scale, cx, baseline)))
        cx += f["hmtx"][name][0] * scale
    return pen.getCommands(), width


def advance(s, size, weight):
    return text(s, size, weight, 0, 0)[1]


# ---- svg helpers -------------------------------------------------------------------
def svg(w, h, label, body, bg=None):
    rect = f'<rect width="{w}" height="{h}" fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" '
            f'role="img" aria-label="{label}"><title>{label}</title>{rect}{body}</svg>\n')


def glyph(d, fill):
    return f'<path d="{d}" fill="{fill}"/>'


def lockup(w, h, fill, bg, label=NAME):
    fs = 150
    mark_h = fs
    figw = BW / BH * mark_h
    gap = fs / 3
    total = figw + gap + advance(NAME, fs, 700)
    left = (w - total) / 2
    baseline = h / 2 + fs / 2
    fig = scaled(height=mark_h, left=left, baseline=baseline, fill=fill)
    word, _ = text(NAME, fs, 700, left + figw + gap, baseline)
    return svg(w, h, label, fig + glyph(word, fill), bg)


def stacked(w, h, mark_w, bottom, word_size, baseline, extra=None):
    mark_h = mark_w * BH / BW
    body = scaled(width=mark_w, cx=w / 2, cy=bottom - mark_h / 2, fill=INK)
    body += glyph(text(NAME, word_size, 700, w / 2, baseline, "middle")[0], INK)
    if extra:
        t, size, wt, base = extra
        body += glyph(text(t, size, wt, w / 2, base, "middle")[0], INK)
    return svg(w, h, (extra[0] + " — " if extra else "") + NAME, body, PAGE)


def social(w, h):
    k = w / 1200
    mark_w = 250 * k
    figw = mark_w
    left = 84 * k
    mid = 262 * k
    body = scaled(width=mark_w, cx=left + figw / 2, cy=mid, fill=INK)
    tx = left + figw + 70 * k
    body += glyph(text(NAME, 128 * k, 700, tx, 222 * k)[0], INK)
    body += glyph(text(DESCRIPTOR, 32 * k, 400, tx, 320 * k)[0], INK)
    body += f'<rect x="{n(84 * k)}" y="{n(504 * k)}" width="{n(1032 * k)}" height="{n(4 * k)}" fill="{INK}"/>'
    body += glyph(text(SITE, 30 * k, 700, 84 * k, 566 * k)[0], INK)
    body += glyph(text(LICENCE, 30 * k, 400, 1116 * k, 566 * k, "end")[0], INK)
    return svg(w, h, f"{NAME}: {DESCRIPTOR}", body, PAGE)


# ---- write -------------------------------------------------------------------------
def write(name, content):
    (OUT / name).write_text(content)


def raster(svg_name, width, out_name=None):
    dst = OUT / (out_name or f"{svg_name}-{width}.png")
    try:
        subprocess.run(["resvg", "-w", str(width), str(OUT / f"{svg_name}.svg"), str(dst)], check=True)
    except FileNotFoundError:
        print(f"no resvg: {dst.name} not rasterised", file=sys.stderr)


def main():
    OUT.mkdir(parents=True, exist_ok=True)

    write("logo-mark.svg",
          '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 256 256" '
          f'role="img" aria-label="{NAME} mark"><title>{NAME} mark</title>{mark(INK)}</svg>\n')
    write("logo-mark-inverse.svg",
          '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 256 256" '
          f'role="img" aria-label="{NAME} mark, inverse"><title>{NAME} mark, inverse</title>{mark(PAGE)}</svg>\n')

    write("logo-primary.svg", lockup(1280, 720, INK, PAGE))
    write("logo-primary-inverse.svg", lockup(1280, 720, PAGE, INK))
    write("logo-mono.svg", lockup(1280, 720, INK, None))
    write("logo-mono-inverse.svg", lockup(1280, 720, PAGE, None))

    style = ("<style>.s{fill:none;stroke:#000;stroke-width:6}"
             ".f{fill:#000;stroke:none}"
             "@media (prefers-color-scheme:dark){.s{stroke:#fff}.f{fill:#fff}}</style>")
    write("favicon.svg",
          f'<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 256 256" '
          f'role="img" aria-label="{NAME}"><title>{NAME}</title>{style}{mark()}</svg>\n')

    write("app-icon.svg", svg(512, 512, NAME, scaled(height=330, cx=256, cy=256, fill=INK), PAGE))
    write("app-icon-maskable.svg", svg(512, 512, NAME, scaled(height=310, cx=256, cy=256, fill=INK), PAGE))
    write("splash.svg", stacked(1080, 1920, 300, 1038, 114, 1208))
    write("loading.svg", stacked(1080, 1920, 300, 1038, 114, 1208, ("Loading", 44, 400, 1310)))
    write("og-image.svg", social(1200, 630))
    write("github-social.svg", social(1280, 640))

    for name, w in [("app-icon", 192), ("app-icon", 512), ("app-icon-maskable", 512)]:
        raster(name, w)
    raster("app-icon", 180, "apple-touch-icon-180.png")
    raster("app-icon", 400, "avatar-400.png")
    raster("splash", 1080, "splash-1080x1920.png")
    raster("loading", 1080, "loading-1080x1920.png")
    raster("og-image", 1200, "og-image.png")
    raster("github-social", 1280, "github-social.png")
    print("wrote", len(list(OUT.iterdir())), "files to", OUT)


if __name__ == "__main__":
    main()
