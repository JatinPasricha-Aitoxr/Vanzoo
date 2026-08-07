#!/usr/bin/env python3
"""
Vanzoo hero banner - treatment: "split panel with monogram"

Deep-teal textile panel on the left ~55%, dissolving through a fibrous,
torn-edge transition into an editorial wardrobe photograph on the right.
A single fine gold thread marks the meeting. A very large, very low-opacity
embossed monogram (ring + chevron) bleeds off the left/top/bottom of the panel.

No text is baked in. Output: 2400x1000 PNG.
"""

import math
import os
import sys

import numpy as np
from PIL import Image

# ----------------------------------------------------------------------------
# config
# ----------------------------------------------------------------------------
W, H = 2400, 1000
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[2]
SRC = sys.argv[1]

INK        = np.array([0x12, 0x18, 0x1B], np.float32) / 255.0
BRAND_DARK = np.array([0x15, 0x4A, 0x5C], np.float32) / 255.0
BRAND      = np.array([0x1E, 0x61, 0x77], np.float32) / 255.0
GOLD       = np.array([0xC9, 0xA2, 0x4B], np.float32) / 255.0
GOLD_SOFT  = np.array([0xEF, 0xE2, 0xC4], np.float32) / 255.0

SEED = int(sys.argv[3]) if len(sys.argv) > 3 else 20260806
# Horizontal bias of the cover-crop: 0 = left edge, 1 = right edge.
FOCUS = float(sys.argv[4]) if len(sys.argv) > 4 else 0.5
rng = np.random.default_rng(SEED)

# ----------------------------------------------------------------------------
# small numeric helpers (no scipy available)
# ----------------------------------------------------------------------------


def _box1d(a, r, axis):
    if r < 1:
        return a
    k = 2 * r + 1
    pad = [(0, 0), (0, 0)]
    pad[axis] = (r, r)
    ap = np.pad(a, pad, mode="edge")
    c = np.cumsum(ap, axis=axis, dtype=np.float32)
    zero = np.zeros_like(np.take(c, [0], axis=axis))
    c = np.concatenate([zero, c], axis=axis)
    n = a.shape[axis]
    s1 = [slice(None)] * 2
    s2 = [slice(None)] * 2
    s1[axis] = slice(k, k + n)
    s2[axis] = slice(0, n)
    return (c[tuple(s1)] - c[tuple(s2)]) / np.float32(k)


def gblur(a, sx, sy=None):
    """3-pass box blur ~= gaussian. Separate sigmas per axis."""
    if sy is None:
        sy = sx
    a = a.astype(np.float32)
    rx = int(round(sx * 0.95))
    ry = int(round(sy * 0.95))
    for _ in range(3):
        if ry >= 1:
            a = _box1d(a, ry, 0)
        if rx >= 1:
            a = _box1d(a, rx, 1)
    return a


def fbm(h, w, octaves=5, base=320.0, seed=0, gain=0.5):
    """Fractal value noise in [0,1], bicubic-upsampled lattices."""
    r = np.random.default_rng(seed)
    out = np.zeros((h, w), np.float32)
    amp, tot, sc = 1.0, 0.0, float(base)
    for _ in range(octaves):
        gh = max(2, int(round(h / sc)))
        gw = max(2, int(round(w / sc)))
        g = r.random((gh, gw)).astype(np.float32)
        im = Image.fromarray(g, mode="F").resize((w, h), Image.BICUBIC)
        out += amp * np.asarray(im, np.float32)
        tot += amp
        amp *= gain
        sc = max(2.0, sc * 0.5)
    return out / tot


def smoothstep(x):
    x = np.clip(x, 0.0, 1.0)
    return x * x * (3.0 - 2.0 * x)


def sstep(e0, e1, x):
    return smoothstep((x - e0) / (e1 - e0))


def srgb2lin(a):
    a = np.clip(a, 0.0, 1.0)
    return np.where(a <= 0.04045, a / 12.92, ((a + 0.055) / 1.055) ** 2.4)


def lin2srgb(a):
    a = np.clip(a, 0.0, 1.0)
    return np.where(a <= 0.0031308, a * 12.92, 1.055 * (a ** (1 / 2.4)) - 0.055)


def ramp(t, stops):
    """stops = [(pos, rgb01), ...] -> (H,W,3)."""
    pos = np.array([s[0] for s in stops], np.float32)
    cols = np.stack([np.asarray(s[1], np.float32) for s in stops])
    out = np.empty(t.shape + (3,), np.float32)
    for c in range(3):
        out[..., c] = np.interp(t, pos, cols[:, c])
    return out


X, Y = np.meshgrid(np.arange(W, dtype=np.float32),
                   np.arange(H, dtype=np.float32))
U = X / (W - 1.0)
V = Y / (H - 1.0)


# ----------------------------------------------------------------------------
# 1. photograph  -- base layer on the right
# ----------------------------------------------------------------------------
def build_photo():
    src = Image.open(SRC).convert("RGB")
    sw, sh = src.size
    # inset a little: some sources carry a soft/rounded border artefact
    inset = 14
    src = src.crop((inset, inset, sw - inset, sh - inset))
    sw, sh = src.size

    # The photograph occupies from X0 rightward; everything left of it is
    # cloth. Cover-crop to exactly that box so any source aspect ratio fills it
    # without letterboxing or squashing.
    X0 = 721
    TW, TH = W - X0, H
    scale = max(TW / sw, TH / sh)
    nw, nh = int(round(sw * scale)), int(round(sh * scale))
    src = src.resize((nw, nh), Image.LANCZOS)
    cx = int(round((nw - TW) * min(max(FOCUS, 0.0), 1.0)))
    cy = int(round((nh - TH) * 0.5))
    src = src.crop((cx, cy, cx + TW, cy + TH))

    canvas = Image.new("RGB", (W, H), (18, 24, 27))
    canvas.paste(src, (X0, 0))
    a = np.asarray(canvas, np.float32) / 255.0

    # ---- grade: keep the cream warm; only the deep shadows go teal ---------
    lum = a[..., 0] * 0.2126 + a[..., 1] * 0.7152 + a[..., 2] * 0.0722

    # barely touch saturation - the champagne silk is the point
    a = lum[..., None] * 0.09 + a * 0.91

    # contrast, pivoted just under mid so the frame stays deep
    piv = 0.47
    a = np.clip(piv + (a - piv) * 1.11, 0.0, 1.0)
    a = 1.0 - (1.0 - a) ** 1.035                  # soft highlight shoulder

    lum = a[..., 0] * 0.2126 + a[..., 1] * 0.7152 + a[..., 2] * 0.0722
    shadow = smoothstep(1.0 - lum / 0.34)          # only the true blacks
    high = smoothstep((lum - 0.60) / 0.40)

    a = a * (1.0 - 0.30 * shadow[..., None]) + \
        (BRAND_DARK * 0.80)[None, None, :] * (0.30 * shadow[..., None])
    # a whisper of warm gold left in the light
    a = a + (GOLD_SOFT - 0.5)[None, None, :] * (high * 0.05)[..., None]

    # ---- light shaping -----------------------------------------------------
    # raking key from upper right, gentle falloff into the lower left
    key = np.exp(-(((X - 2020) / 1200.0) ** 2 + ((Y - 230) / 950.0) ** 2))
    fall = np.exp(-(((X - 1300) / 1500.0) ** 2 + ((Y - 1140) / 820.0) ** 2))
    shape = 1.0 + 0.13 * key - 0.19 * fall
    # edge vignette (soft, asymmetric)
    vig = (1.0
           - 0.20 * smoothstep((X - 2080) / 420.0)
           - 0.17 * smoothstep((140.0 - Y) / 200.0)
           - 0.20 * smoothstep((Y - 850.0) / 200.0))
    a = a * (shape * np.clip(vig, 0.55, 1.2))[..., None]

    return np.clip(a, 0.0, 1.0).astype(np.float32)


# ----------------------------------------------------------------------------
# 2. teal panel -- dyed-cloth field, embossed monogram
# ----------------------------------------------------------------------------
def build_panel():
    # luminance field: darkest through the headline zone (x 100..1050),
    # a slow lift near the seam and a whisper in the top-left corner
    seam_glow = np.exp(-(((X - 1360) / 620.0) ** 2 + ((Y - 330) / 720.0) ** 2))
    corner = np.exp(-(((X - 60) / 780.0) ** 2 + ((Y - 20) / 560.0) ** 2))
    floor = np.exp(-(((X - 320) / 980.0) ** 2 + ((Y - 1120) / 620.0) ** 2))

    L = 0.26 + 0.60 * seam_glow + 0.10 * corner - 0.20 * floor

    # dyed-cloth mottling, large and smooth so the monogram can read through
    mottle = fbm(H, W, octaves=3, base=560.0, seed=7) - 0.5
    L = L + mottle * 0.055
    L = np.clip(L, 0.0, 1.0)

    panel = ramp(L, [
        (0.00, INK * 0.92),
        (0.22, INK * 0.55 + BRAND_DARK * 0.45),
        (0.55, BRAND_DARK),
        (0.82, BRAND_DARK * 0.35 + BRAND * 0.65),
        (1.00, BRAND * 1.06),
    ])

    # ---- woven texture -----------------------------------------------------
    n1 = rng.normal(0.0, 1.0, (H, W)).astype(np.float32)
    n2 = rng.normal(0.0, 1.0, (H, W)).astype(np.float32)
    warp = gblur(n1, 4.2, 0.70)
    weft = gblur(n2, 0.70, 4.2)
    warp /= (warp.std() + 1e-6)
    weft /= (weft.std() + 1e-6)
    weave = 0.52 * warp + 0.48 * weft
    # a faint twill running against the grain
    twill = np.sin((X * 0.72 + Y * 0.72) * (2 * math.pi / 15.0))
    tex = weave * (2.5 / 255.0) + twill * (0.7 / 255.0)
    # texture reads more in the lit areas, less in the deep blacks
    tex = tex * (0.45 + 0.75 * L)
    panel = panel + tex[..., None]

    return panel, L


def add_monogram(panel, L):
    """A pressed/embossed mark: relief, not print. Peak delta stays under 8%."""
    cx, cy = 470.0, 505.0
    dx, dy = X - cx, Y - cy
    d = np.sqrt(dx * dx + dy * dy)
    th = np.arctan2(dy, dx)
    phi = math.atan2(-1.0, -1.05)          # key from upper-left
    ld = np.cos(th - phi)

    # relief tints: catch the light gold-ward, fall away toward ink
    UP = (GOLD_SOFT * 0.62 + GOLD * 0.38) - BRAND_DARK
    DN = BRAND_DARK - INK * 0.35

    K = math.sqrt(math.e)
    # relief is only visible where light actually falls on the cloth - this is
    # what stops the mark reading as a smudge in the black corners
    catch = (0.14 + 1.00 * np.clip(L, 0.0, 1.0)) ** 1.35

    def bevel(sd, w):
        """Signed rounded-edge profile in [-1,1]: a raised lip, not a stripe."""
        t = sd / w
        return np.clip(-t * np.exp(-0.5 * t * t) * K, -1.0, 1.0)

    def emb(sd, w, amp):
        """Raised feature: lit on the key side, fallen away on the other."""
        p = bevel(sd, w) * ld * catch
        out = panel + (np.clip(p, 0, 1) * amp)[..., None] * UP[None, None, :]
        out = out - (np.clip(-p, 0, 1) * amp * 0.72)[..., None] * DN[None, None, :]
        return out

    # outer ring: a wide, softly rounded lip pressed into the cloth
    R = 600.0
    panel = emb(d - R, 44.0, 0.062)

    # inner hairline ring, crisper
    panel = emb(d - 528.0, 8.0, 0.048)

    # the plate inside the ring sits a hair proud of the cloth
    plate = sstep(R + 30.0, R - 170.0, d)
    panel = panel + (plate * catch * 0.014)[..., None] * \
        (GOLD * 0.45 + BRAND * 0.55)[None, None, :]

    # chevron, two tapered strokes meeting at an apex -> signed distance
    def seg(ax, ay, bx, by, half):
        vx, vy = bx - ax, by - ay
        L2 = vx * vx + vy * vy
        t = np.clip(((X - ax) * vx + (Y - ay) * vy) / L2, 0.0, 1.0)
        px, py = ax + t * vx, ay + t * vy
        dd = np.sqrt((X - px) ** 2 + (Y - py) ** 2)
        hw = half * (0.30 + 0.70 * t)      # thin at the top, full at the apex
        return dd - hw

    apex = (cx + 4.0, cy + 292.0)
    chev = np.minimum(seg(cx - 378.0, cy - 312.0, apex[0], apex[1], 30.0),
                      seg(cx + 378.0, cy - 312.0, apex[0], apex[1], 30.0))
    panel = emb(chev, 24.0, 0.072)
    return panel


# ----------------------------------------------------------------------------
# 3. the meeting edge
# ----------------------------------------------------------------------------
def build_edge():
    u = V
    # near-vertical with a slight lean and the faintest belly - a cut of cloth,
    # not an arc
    edge_clean = 1300.0 - 132.0 * u + 40.0 * np.sin(u * np.pi * 1.05)

    # fibrous displacement of the tear (correlated down the edge)
    col = fbm(H, 8, octaves=6, base=150.0, seed=31)[:, 3:4]
    col = (col - col.mean())
    col = col / (np.abs(col).max() + 1e-6)
    off = gblur(np.repeat(col, W, axis=1), 0.0, 15.0) * 9.0

    # stitched and crisp where the eye lands, torn open as it falls
    feather = 40.0 + 96.0 * (u ** 1.6)

    # fine fibres pulled across the tear
    fib = rng.normal(0.0, 1.0, (H, W)).astype(np.float32)
    fib = gblur(fib, 19.0, 1.0)
    fib /= (fib.std() + 1e-6)
    fib = np.clip(fib, -2.6, 2.6) / 2.6

    edge = edge_clean + off            # the true 50% line of the dissolve
    s = (X - edge) / feather * 0.5 + 0.5
    s = s + fib * 0.095
    alpha = 1.0 - smoothstep(s)
    return alpha.astype(np.float32), edge


def gold_seam(edge):
    """A fine gold thread sitting exactly on the dissolve, fading as it tears."""
    d = X - edge
    core = np.exp(-(d / 1.30) ** 2)
    halo = np.exp(-(d / 11.0) ** 2) * 0.20 + np.exp(-(d / 60.0) ** 2) * 0.055

    # the thread catches the light unevenly down its length
    varc = fbm(H, 8, octaves=5, base=95.0, seed=91)[:, 3:4]
    varc = gblur(np.repeat(varc, W, axis=1), 0.0, 11.0)
    varc = 0.34 + 1.15 * np.clip(varc, 0.0, 1.0)
    # gone by the time the tear has opened up
    varc = varc * (1.0 - 0.92 * sstep(0.34, 0.86, V))
    # ease off at the extreme top so crops never show a cut stub
    varc = varc * (0.30 + 0.70 * sstep(0.0, 110.0, Y))

    amt = (core * 0.40 + halo * 0.34) * varc
    return amt.astype(np.float32)


# ----------------------------------------------------------------------------
# 4. assemble
# ----------------------------------------------------------------------------
def main():
    photo = build_photo()
    panel, L = build_panel()
    panel = add_monogram(panel, L)
    alpha, edge = build_edge()

    # light spilling from the photo side back onto the cloth
    spill = np.exp(-(np.maximum(edge - X, 0.0) / 210.0) ** 2)
    spill = spill * sstep(0.0, 260.0, Y) * sstep(0.0, 300.0, (H - 1) - Y)
    panel = panel + (spill * 0.042)[..., None] * (GOLD_SOFT * 0.85)[None, None, :]

    # the cloth is a physical layer: it drops a contact shadow onto the
    # photograph, tight at the stitched top and diffuse where the tear opens
    rd = np.maximum(X - edge, 0.0)
    contact = (0.30 * np.exp(-(rd / (26.0 + 150.0 * V)) ** 2)
               + 0.13 * np.exp(-(rd / 340.0) ** 2))
    contact = contact * (1.0 - 0.35 * sstep(0.55, 1.0, V))
    photo = photo * (1.0 - contact[..., None]) + \
        (BRAND_DARK * 0.55)[None, None, :] * contact[..., None]

    # composite in linear light
    pl = srgb2lin(np.clip(panel, 0, 1))
    fl = srgb2lin(photo)
    comp = fl * (1.0 - alpha[..., None]) + pl * alpha[..., None]
    img = lin2srgb(comp)

    # gold thread on top
    img = img + gold_seam(edge)[..., None] * GOLD[None, None, :]

    # whole-frame vignette + a last tonal settle
    vig = 1.0 - 0.085 * ((((X - W * 0.55) / (W * 0.62)) ** 2 +
                          ((Y - H * 0.48) / (H * 0.78)) ** 2))
    img = img * np.clip(vig, 0.80, 1.0)[..., None]

    # grain
    g = rng.normal(0.0, 1.0, (H, W)).astype(np.float32)
    g = gblur(g, 0.55)
    g /= (g.std() + 1e-6)
    fine = rng.normal(0.0, 1.0, (H, W, 3)).astype(np.float32)
    img = img + g[..., None] * (2.3 / 255.0) + fine * (0.75 / 255.0)

    # dither, then quantise
    img = np.clip(img, 0.0, 1.0) * 255.0
    img = img + rng.uniform(-0.5, 0.5, img.shape).astype(np.float32)
    out = np.clip(np.rint(img), 0, 255).astype(np.uint8)

    Image.fromarray(out, "RGB").save(OUT, "JPEG", quality=88, optimize=True, progressive=True)

    # ---- verification ------------------------------------------------------
    cut = int(W * 0.55)
    left = out[:, :cut].astype(np.float32)
    luma = left[..., 0] * 0.2126 + left[..., 1] * 0.7152 + left[..., 2] * 0.0722
    print(f"output           : {OUT}")
    print(f"size             : {Image.open(OUT).size}")
    print(f"LEFT 55% (x<{cut}) mean luminance : {luma.mean():.2f} / 255"
          f"   [target < 70]")
    print(f"                    p50 {np.percentile(luma,50):.1f}"
          f"  p95 {np.percentile(luma,95):.1f}"
          f"  p99 {np.percentile(luma,99):.1f}  max {luma.max():.1f}")
    print(f"  frac px > 100   : {(luma>100).mean()*100:.2f}%")
    # worst-case contrast of white text over the text-safe zone
    zone = out[180:820, 90:1080].astype(np.float32) / 255.0
    zl = srgb2lin(zone)
    Lz = zl[..., 0] * 0.2126 + zl[..., 1] * 0.7152 + zl[..., 2] * 0.0722
    worst = 1.05 / (Lz.max() + 0.05)
    print(f"  white-on-bg contrast in headline zone: min {worst:.2f}:1")


if __name__ == "__main__":
    main()
