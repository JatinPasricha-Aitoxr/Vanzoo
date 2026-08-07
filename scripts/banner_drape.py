#!/usr/bin/env python3
"""
Vanzoo hero banner — treatment: "Silk drape curves"

Long sine-derived drape bands sweeping out of the dark lower-left toward a
raking light in the upper right, rendered as close tonal steps of teal with
soft super-gaussian edges, contact shadows between the sheets, and satin
filaments along the lit ridges. Grounded on high-frequency weave texture
lifted from the real Vanzoo photography.

No text, no logos, no letterforms.  Output: 2400x1000 PNG.
"""

import os
import sys
import numpy as np
from PIL import Image

# ----------------------------------------------------------------------------
# config
# ----------------------------------------------------------------------------
W, H = 2400, 1000
SS = 2                       # supersample factor
w, h = W * SS, H * SS
AR = W / H                   # 2.4

HERE = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1]
# Tonal variant: "teal" (default), "deep" (darker), "warm" (gold-lit).
TONE = sys.argv[2] if len(sys.argv) > 2 else "teal"
SEED = int(sys.argv[3]) if len(sys.argv) > 3 else 11
IMG = "/Users/jatinpasricha/Desktop/legal-ai/vanzoo-website/public/images"

LEFT_FRAC = 0.55             # region that must stay dark & calm

GOLD = "#C9A24B"
GOLD_SOFT = "#EFE2C4"


# ----------------------------------------------------------------------------
# colour helpers  (ramp interpolated in linear light -> no muddy midtones)
# ----------------------------------------------------------------------------
def hex_rgb(s):
    s = s.lstrip("#")
    return np.array([int(s[i:i + 2], 16) for i in (0, 2, 4)], np.float64) / 255.0


def srgb_to_lin(c):
    c = np.clip(c, 0.0, 1.0)
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def lin_to_srgb(c):
    c = np.clip(c, 0.0, 1.0)
    return np.where(c <= 0.0031308, c * 12.92, 1.055 * c ** (1 / 2.4) - 0.055)


# tonal ladder: near-black ink -> deep teal -> brand teal -> lifted teal -> tint
RAMP = [
    (0.00, "#070B0D"),
    (0.12, "#0E1417"),
    (0.24, "#0E2229"),   # ink drifting teal
    (0.36, "#0D333F"),
    (0.48, "#113F4C"),
    (0.60, "#154A5C"),   # brand.dark
    (0.72, "#1E6177"),   # brand
    (0.82, "#2A7288"),
    (0.90, "#4A96AB"),
    (0.96, "#7CB4C4"),
    (1.00, "#C6DEE5"),   # travelling toward brand.light
]
if TONE == "deep":
    # Darker overall, for pages that carry a lot of text over the banner.
    RAMP = [(p, c) for p, c in RAMP]
    RAMP[5] = (0.68, "#154A5C")
    RAMP[6] = (0.80, "#1E6177")
    RAMP[7] = (0.89, "#3B7E96")
    RAMP[8] = (0.955, "#6EA2B4")
elif TONE == "warm":
    # The lit edges pick up gold instead of pale blue.
    RAMP[7] = (0.89, "#7A8E7E")
    RAMP[8] = (0.955, "#C9A24B")
    RAMP[9] = (1.00, "#EFE2C4")

_RT = np.array([s[0] for s in RAMP])
_RC = srgb_to_lin(np.array([hex_rgb(s[1]) for s in RAMP]))


def ramp(t):
    t = np.clip(t, 0.0, 1.0)
    out = np.empty(t.shape + (3,), np.float32)
    for ch in range(3):
        out[..., ch] = np.interp(t, _RT, _RC[:, ch])
    return out


def smoothstep(e0, e1, x):
    t = np.clip((x - e0) / (e1 - e0), 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)


def shoulder(t, k, top):
    """filmic knee: below k passes through, above rolls off asymptotically to
    `top`.  C1-continuous, so no clipped plateau and no hard seam."""
    out = np.array(t, np.float32, copy=True)
    m = t > k
    out[m] = top - (top - k) * np.exp(-(t[m] - k) / (top - k))
    return out


def _box1d(a, r, axis):
    if r < 1:
        return a
    a = np.moveaxis(a, axis, -1)
    n = a.shape[-1]
    pad = np.concatenate(
        [np.repeat(a[..., :1], r, axis=-1), a, np.repeat(a[..., -1:], r, axis=-1)],
        axis=-1)
    cs = np.cumsum(pad.astype(np.float64), axis=-1)
    cs = np.concatenate([np.zeros(cs.shape[:-1] + (1,)), cs], axis=-1)
    out = (cs[..., 2 * r + 1:] - cs[..., :n]) / (2 * r + 1)
    return np.moveaxis(out.astype(np.float32), -1, axis)


def blur(a, sigma, passes=3):
    """separable gaussian approximation (3 box passes)"""
    if sigma <= 0.35:
        return np.asarray(a, np.float32)
    r = max(1, int(round(np.sqrt(12.0 * sigma * sigma / passes + 1.0) - 1.0) // 2))
    out = np.asarray(a, np.float32)
    for _ in range(passes):
        out = _box1d(out, r, 0)
        out = _box1d(out, r, 1)
    return out


# ----------------------------------------------------------------------------
# coordinates.  U,V are normalised 0..1;  X,Y are isotropic (1 unit = H px)
# ----------------------------------------------------------------------------
U = np.broadcast_to(np.linspace(0.0, 1.0, w, dtype=np.float32)[None, :], (h, w))
V = np.broadcast_to(np.linspace(0.0, 1.0, h, dtype=np.float32)[:, None], (h, w))
X = (U * AR).astype(np.float32)
Y = V
TWO_PI = np.float32(2.0 * np.pi)


# ----------------------------------------------------------------------------
# raking light — an elongated glow lying ALONG the drape axis, core parked
# at x~1730 / y~250 so it survives a centred 4:3 crop and never touches an edge
# ----------------------------------------------------------------------------
LA = np.float32(-0.29)                       # ~-17 deg, matches the drape sweep
LCX, LCY = np.float32(1.78), np.float32(0.31)   # ~x1780 / y310 — clear of edges
ca, sa = np.cos(LA), np.sin(LA)
e1 = (X - LCX) * ca + (Y - LCY) * sa
e2 = -(X - LCX) * sa + (Y - LCY) * ca
light = np.exp(-(((e1 / 1.14) ** 2 + (e2 / 0.38) ** 2) ** 0.90)).astype(np.float32)
del e1, e2
# damp the top and far-right margins so nothing hot ever reaches an edge
light *= (0.50 + 0.50 * smoothstep(0.00, 0.20, V)).astype(np.float32)
light *= (1.0 - 0.30 * smoothstep(0.90, 1.00, U)).astype(np.float32)
# faint ambient lean right so the falloff never reads as a stage spotlight
light = np.clip(light * 0.94 + 0.17 * smoothstep(0.22, 0.96, U) ** 1.3, 0.0, 1.0)

# horizontal calm ramp: structure and contrast are throttled on the left
calm = (0.08 + 0.92 * smoothstep(0.04, 0.74, U)).astype(np.float32)

# base wash the drapes sit on
base = (0.105
        + 0.34 * light
        + 0.035 * smoothstep(0.10, 1.0, U)
        - 0.040 * smoothstep(0.50, 1.0, V)).astype(np.float32)
base = np.clip(base, 0.02, 1.0)

tone = base.copy()


# ----------------------------------------------------------------------------
# drape bands
# ----------------------------------------------------------------------------
def centerline(p):
    y = p["c0"] + p["c1"] * U
    y = y + p["a1"] * np.sin(TWO_PI * (p["f1"] * U + p["p1"]))
    y = y + p["a2"] * np.sin(TWO_PI * (p["f2"] * U + p["p2"]))
    return y


def half_thickness(p):
    return p["th"] * (1.0 + p["tv"] * np.sin(TWO_PI * (p["tf"] * U + p["tp"])))


# back -> front.  r = intrinsic reflectance (deliberately close steps),
# al = coverage, sh = specular ridge strength, sd = contact-shadow strength.
BANDS = [
    dict(c0=1.52, c1=-0.84, a1=0.080, f1=0.68, p1=0.10, a2=0.024, f2=1.85, p2=0.55,
         th=0.190, tv=0.22, tf=0.80, tp=0.30, r=0.40, al=0.70, sh=0.06, sd=0.00, soft=2.4),
    dict(c0=1.34, c1=-0.78, a1=0.066, f1=0.86, p1=0.44, a2=0.019, f2=2.25, p2=0.16,
         th=0.155, tv=0.26, tf=1.00, tp=0.62, r=0.47, al=0.68, sh=0.09, sd=0.10, soft=2.6),
    dict(c0=1.18, c1=-0.72, a1=0.058, f1=0.64, p1=0.79, a2=0.021, f2=2.00, p2=0.88,
         th=0.134, tv=0.24, tf=0.90, tp=0.12, r=0.54, al=0.70, sh=0.12, sd=0.12, soft=2.8),
    dict(c0=1.035, c1=-0.67, a1=0.050, f1=1.00, p1=0.26, a2=0.016, f2=2.55, p2=0.41,
         th=0.116, tv=0.28, tf=1.18, tp=0.47, r=0.60, al=0.72, sh=0.15, sd=0.14, soft=2.9),
    dict(c0=0.905, c1=-0.62, a1=0.054, f1=0.76, p1=0.62, a2=0.018, f2=1.72, p2=0.70,
         th=0.101, tv=0.25, tf=0.86, tp=0.83, r=0.66, al=0.74, sh=0.18, sd=0.15, soft=3.0),
    dict(c0=0.785, c1=-0.57, a1=0.046, f1=0.92, p1=0.06, a2=0.014, f2=2.42, p2=0.27,
         th=0.089, tv=0.30, tf=1.32, tp=0.19, r=0.71, al=0.75, sh=0.21, sd=0.16, soft=3.0),
    dict(c0=0.672, c1=-0.53, a1=0.042, f1=0.70, p1=0.50, a2=0.015, f2=2.12, p2=0.60,
         th=0.079, tv=0.26, tf=0.98, tp=0.55, r=0.76, al=0.76, sh=0.24, sd=0.17, soft=3.1),
    dict(c0=0.568, c1=-0.49, a1=0.038, f1=1.06, p1=0.90, a2=0.012, f2=2.76, p2=0.06,
         th=0.070, tv=0.32, tf=1.42, tp=0.92, r=0.80, al=0.76, sh=0.27, sd=0.17, soft=3.2),
    dict(c0=0.472, c1=-0.44, a1=0.034, f1=0.82, p1=0.34, a2=0.011, f2=2.32, p2=0.44,
         th=0.061, tv=0.28, tf=1.12, tp=0.27, r=0.86, al=0.82, sh=0.34, sd=0.18, soft=3.2),
    dict(c0=0.384, c1=-0.395, a1=0.030, f1=1.14, p1=0.68, a2=0.010, f2=2.90, p2=0.33,
         th=0.053, tv=0.30, tf=1.55, tp=0.71, r=0.90, al=0.84, sh=0.38, sd=0.18, soft=3.3),
    dict(c0=0.302, c1=-0.345, a1=0.026, f1=0.88, p1=0.15, a2=0.009, f2=2.48, p2=0.79,
         th=0.045, tv=0.26, tf=1.24, tp=0.09, r=0.94, al=0.84, sh=0.41, sd=0.17, soft=3.4),
    dict(c0=0.228, c1=-0.30, a1=0.022, f1=1.22, p1=0.52, a2=0.008, f2=3.05, p2=0.61,
         th=0.038, tv=0.28, tf=1.66, tp=0.40, r=0.97, al=0.80, sh=0.40, sd=0.15, soft=3.4),
    # dark foreground drape sweeping the lower left: keeps the headline zone
    # calm and gives the stack genuine front-to-back depth
    dict(c0=1.44, c1=-0.58, a1=0.062, f1=0.55, p1=0.66, a2=0.022, f2=1.55, p2=0.34,
         th=0.185, tv=0.20, tf=0.72, tp=0.70, r=0.30, al=0.86, sh=0.13, sd=0.20, soft=2.3),
    # a nearer fold entering only in the lower right, so the bottom of the
    # frame carries a rim of light instead of reading as a dead void
    dict(c0=1.60, c1=-0.66, a1=0.050, f1=0.62, p1=0.21, a2=0.018, f2=1.40, p2=0.80,
         th=0.150, tv=0.20, tf=0.68, tp=0.15, r=0.37, al=0.70, sh=0.24, sd=0.16, soft=2.5),
]

GLOBAL = np.float32(0.98)
gold_edge = np.zeros((h, w), np.float32)
filament = np.zeros((h, w), np.float32)

for i, p in enumerate(BANDS):
    yc = centerline(p)
    th = half_thickness(p)
    d = ((V - yc) / th).astype(np.float32)

    mask = np.exp(-(np.abs(d) / 0.88) ** p["soft"]).astype(np.float32)

    # contact shadow cast down-left onto whatever is already behind
    if p["sd"] > 0:
        sh_m = np.exp(-((d - 1.28) / 0.55) ** 2).astype(np.float32)
        tone *= (1.0 - p["sd"] * sh_m * (0.35 + 0.65 * calm))

    # cylindrical fold: the upper face turns toward the light
    fold = np.clip(0.62 - 0.47 * d, 0.03, 1.10)
    ridge = np.exp(-((d + 0.40) / 0.26) ** 2)
    shade = fold + p["sh"] * ridge

    band = (p["r"] * shade * (0.14 + 0.86 * light) * GLOBAL).astype(np.float32)

    a = (p["al"] * mask * (0.26 + 0.74 * calm)).astype(np.float32)
    tone = tone * (1.0 - a) + band * a
    tone += 0.08 * a * band * (1.0 - np.clip(tone, 0.0, 1.0))     # translucency

    # satin filaments: hair-fine speculars riding the lit ridge of front bands.
    # High along-length frequency keeps them reading as threads of sheen
    # rather than as blotchy smears.
    if i >= 5:
        fmod = (0.42 + 0.58 * (0.5 + 0.5 * np.sin(TWO_PI * (23.0 * U + 0.31 * i)))) \
             * (0.50 + 0.50 * (0.5 + 0.5 * np.sin(TWO_PI * (61.0 * U + 0.77 * i)))) \
             * (0.55 + 0.45 * np.sin(TWO_PI * (1.9 * U + 0.5 * i)))
        core = np.exp(-((d + 0.46) / 0.040) ** 2)
        filament += (core * fmod * (0.12 + 0.22 * (i / len(BANDS)))
                     * light * mask).astype(np.float32)

    # Gold sits ON the specular ridge of a lit fold, not floating in space, so
    # it reads as a gilded selvedge catching the light.  Windowed to a short
    # arc and broken up along its length; it must never look drawn.
    # bands 6 and 7 run through y~180-350 in the lit zone — well clear of every
    # edge, so no crop ever slices the gold
    if i in (6, 7):
        dpx = (d + 0.46) * th * h                    # same locus as the sheen
        core = np.exp(-(dpx / 2.0) ** 2)
        if i == 6:
            win = smoothstep(0.600, 0.680, U) * (1.0 - smoothstep(0.780, 0.860, U))
            amp = 1.00
        else:
            win = smoothstep(0.700, 0.750, U) * (1.0 - smoothstep(0.795, 0.845, U))
            amp = 0.45
        broken = 0.30 + 0.70 * (0.5 + 0.5 * np.sin(TWO_PI * (3.1 * U + 0.4 * i)))
        gold_edge += (core * win * broken * amp * mask).astype(np.float32)

tone = np.clip(tone, 0.0, 1.3).astype(np.float32)


# ----------------------------------------------------------------------------
# real-fabric weave, high-passed out of the Vanzoo photography.
# Only high frequencies survive, so no subject of the photo is ever legible.
# ----------------------------------------------------------------------------
def inner_rect(size, deg):
    """largest axis-aligned rect free of rotation voids"""
    cw, ch = size
    t = abs(np.deg2rad(deg))
    c, s = np.cos(t), np.sin(t)
    iw = max(8.0, cw * c - ch * s)
    ih = max(8.0, ch * c - cw * s)
    return (int((cw - iw) / 2), int((ch - ih) / 2),
            int((cw + iw) / 2), int((ch + ih) / 2))


def detail(path, box, angle, sigma, gain_lo, gain_hi):
    im = Image.open(path).convert("L").crop(box)
    if angle:
        im = im.rotate(angle, resample=Image.BICUBIC, expand=False)
        im = im.crop(inner_rect(im.size, angle))
    im = im.resize((w, h), Image.LANCZOS)
    a = np.asarray(im, np.float32) / 255.0
    hp = a - blur(a, sigma * SS)
    hp -= hp.mean()
    hp /= (hp.std() + 1e-6)
    # soft-clip: the photo's hard fold edges are high-amplitude outliers and
    # would print as straight seams.  Squash them, keep the low-level weave.
    hp = np.tanh(hp * 1.5) / 1.5
    hp /= (hp.std() + 1e-6)
    return (hp * (gain_lo + (gain_hi - gain_lo) * calm)).astype(np.float32)


tex = np.zeros((h, w), np.float32)
try:
    # crepe/weave grain off the folded silk stack (flat area only, no table edge)
    tex += detail(os.path.join(IMG, "service-silk-wool-delicates.jpg"),
                  (600, 110, 1960, 780), -9, 8, 0.0030, 0.0110)
    # finer thread structure off the evening-dress skirt
    tex += detail(os.path.join(IMG, "service-bespoke-suit-couture.jpg"),
                  (1190, 640, 1610, 1120), 7, 4, 0.0030, 0.0095)
except Exception as e:                            # pragma: no cover
    print("texture skipped:", e)

# synthetic silk fibre: noise stretched along the drape axis.  Carries the
# satin "grain direction" that a photograph's high-pass cannot.
_r = np.random.default_rng(23)
_n = _r.normal(0.0, 1.0, (h, w)).astype(np.float32)
_n = _box1d(_box1d(_n, 15, 1), 2, 0)                    # horizontal streaks
_iy = (np.arange(h, dtype=np.int32)[:, None]
       + (0.30 * np.arange(w, dtype=np.float32)[None, :]).astype(np.int32)) % h
_n = _n[_iy, np.arange(w, dtype=np.int32)[None, :]]     # shear to the drape angle
_n /= (_n.std() + 1e-6)
tex += (_n * (0.0035 + 0.0125 * calm)).astype(np.float32)
del _n, _iy

# weave belongs to the cloth, so let it live mostly in the lit mid-tones
tex *= (0.35 + 0.65 * smoothstep(0.18, 0.72, tone)).astype(np.float32)
tone += tex

# very slow luminance drift so nothing anywhere reads as a flat fill
tone += (0.011 * np.sin(TWO_PI * (0.75 * U + 0.52 * V + 0.2))
         + 0.007 * np.sin(TWO_PI * (1.63 * U - 0.87 * V + 0.7))) * calm

# exposure — printed up harder on the lit right, held back on the text side —
# then a filmic shoulder so highlights roll off to a pale teal and never to
# white, with no clipped plateau anywhere
expo = (1.16 + 0.30 * calm).astype(np.float32)
tone = shoulder(np.clip(tone * expo, 0.0, 2.0), 0.78, 0.99)

# filaments go on AFTER the shoulder so a few hair-thin threads can sparkle
# without ever creating a blown-out area
tone = np.clip(tone + np.clip(filament, 0.0, 1.0) * 0.13, 0.0, 1.0)


# ----------------------------------------------------------------------------
# tone -> colour
# ----------------------------------------------------------------------------
rgb = ramp(tone)                                   # linear light

# warm kiss in the top highlights only — keeps the teal off monotone
warm = srgb_to_lin(hex_rgb(GOLD_SOFT)).astype(np.float32)
wm = (smoothstep(0.66, 0.95, tone) * smoothstep(0.48, 0.86, U) * light * 0.11
      ).astype(np.float32)[..., None]
rgb = rgb * (1.0 - wm) + warm[None, None, :] * wm

# gold selvedges: ~1px hairline plus a whisper of bloom so they read as a
# catch of light on a hem rather than as ink
gold_lin = srgb_to_lin(hex_rgb(GOLD)).astype(np.float32)
ge = np.clip(gold_edge, 0.0, 1.0)
ge = ge + 0.30 * blur(ge, 5.0 * SS)
ga = (ge * (0.40 + 0.60 * light) * 0.26)[..., None]
rgb = rgb + gold_lin[None, None, :] * ga

# soft elliptical vignette + gentle extra falloff into the lower left
rad = np.sqrt(((X - 1.58) / 1.72) ** 2 + ((Y - 0.44) / 0.98) ** 2)
vig = (1.0 - 0.30 * smoothstep(0.48, 1.30, rad)
           - 0.08 * smoothstep(0.55, 0.02, U) * smoothstep(0.42, 1.0, V))
rgb *= np.clip(vig, 0.0, 1.0).astype(np.float32)[..., None]

srgb = lin_to_srgb(rgb)


# ----------------------------------------------------------------------------
# downsample, grain, dither
# ----------------------------------------------------------------------------
img = Image.fromarray(np.clip(srgb * 255.0 + 0.5, 0, 255).astype(np.uint8))
img = img.resize((W, H), Image.LANCZOS)
arr = np.asarray(img, np.float32)

rng = np.random.default_rng(SEED)
ln = rng.normal(0.0, 1.0, (H, W)).astype(np.float32)
ln = 0.60 * ln + 0.40 * blur(ln, 0.8) * 2.1                # slightly clumped
cn = rng.normal(0.0, 1.0, (H, W, 3)).astype(np.float32)

lum = arr @ np.array([0.2126, 0.7152, 0.0722], np.float32)
gmod = (0.40 + 0.60 * smoothstep(5.0, 85.0, lum)).astype(np.float32)
arr = arr + (ln * 2.3 * gmod)[..., None] + cn * 0.75 * gmod[..., None]

# ordered dither kills residual banding in the long gradients
yy, xx = np.mgrid[0:H, 0:W]
arr += ((((xx * 7 + yy * 13) % 16) / 16.0 - 0.5).astype(np.float32))[..., None] * 0.9

out = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
out.save(OUT, "JPEG", quality=90, optimize=True, progressive=True)


# ----------------------------------------------------------------------------
# verification
# ----------------------------------------------------------------------------
COEF = np.array([0.2126, 0.7152, 0.0722])
a8 = np.asarray(out, np.float64)
lum = a8 @ COEF
lw = int(W * LEFT_FRAC)
L = lum[:, :lw]

print(f"size                  : {out.size[0]}x{out.size[1]}")
print(f"left {LEFT_FRAC:.0%} region     : x in [0, {lw})")
print(f"MEAN LUMINANCE LEFT   : {L.mean():.2f} / 255   (target < 70)")
print(f"  median              : {np.median(L):.2f}   std {L.std():.2f}")
print(f"  p95 / p99 / max     : {np.percentile(L, 95):.1f} / "
      f"{np.percentile(L, 99):.1f} / {L.max():.1f}")

ph, pw = 100, 120
pad = L[:H // ph * ph, :lw // pw * pw]
pt = pad.reshape(pad.shape[0] // ph, ph, pad.shape[1] // pw, pw).mean(axis=(1, 3))
print(f"  brightest {ph}x{pw} patch : {pt.max():.1f}")

rl = srgb_to_lin(a8[:, :lw] / 255.0) @ COEF
pr = rl[:H // ph * ph, :lw // pw * pw]
pr = pr.reshape(pr.shape[0] // ph, ph, pr.shape[1] // pw, pw).mean(axis=(1, 3))
print(f"  worst white-text contrast : {1.05 / (pr.max() + 0.05):.2f}:1  (need >= 4.5)")
print(f"right region mean     : {lum[:, lw:].mean():.2f}   max {lum[:, lw:].max():.1f}")
print(f"global p999           : {np.percentile(lum, 99.9):.1f}")
print(f"wrote {OUT}")
