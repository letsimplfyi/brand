// Colour-vision-deficiency simulation (Machado et al. 2009, severity 1.0, linear RGB)
// and CIELAB distance. Used by the showcase and by tools/check.mjs.
const M = {
  protan: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  deutan: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.01182, 0.04294, 0.968881]],
  tritan: [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.3039]],
};
export const modes = ["normal", "protan", "deutan", "tritan", "achroma"];
export const modeLabel = { normal: "Typical vision", protan: "Protanopia (no red)", deutan: "Deuteranopia (no green)", tritan: "Tritanopia (no blue)", achroma: "Greyscale" };

const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const gam = (c) => { c = Math.max(0, Math.min(1, c)); return 255 * (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055); };
export const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
export const toHex = (a) => "#" + a.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");

export function simulate(hex, mode) {
  if (mode === "normal") return rgb(hex);
  const v = rgb(hex).map(lin);
  if (mode === "achroma") { const y = gam(0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]); return [y, y, y]; }
  return M[mode].map((r) => gam(r[0] * v[0] + r[1] * v[1] + r[2] * v[2]));
}

export function lab(a) {
  const [r, g, b] = a.map(lin);
  const X = 0.4124 * r + 0.3576 * g + 0.1805 * b, Y = 0.2126 * r + 0.7152 * g + 0.0722 * b, Z = 0.0193 * r + 0.1192 * g + 0.9505 * b;
  const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : ((24389 / 27) * t + 16) / 116);
  const fx = f(X / 0.95047), fy = f(Y), fz = f(Z / 1.08883);
  return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
}
export const lightness = (hex) => lab(rgb(hex))[0];

/** Perceptual distance between two hex colours as seen under a vision mode. */
export function distance(a, b, mode = "normal") {
  const x = lab(simulate(a, mode)), y = lab(simulate(b, mode));
  return Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]);
}
