// @ts-nocheck
import { useEffect, useRef, useState } from "react";

// Original HorizonX code and mark. HorizonX Tools License.
// HorizonX's own mark as lit glass on black. The light is a compact spectral
// model fitted offline to a reference recording of the effect, so the mark
// lights one or two petals at a time with hard highlights between darker
// frames, exactly like the reference:
//  - body: 80 modes on the logo's unit disc (degree-48 Chebyshev in x and y);
//  - rim: 48 modes over 1024 outline directions;
//  - every mode's RGB weight is a 60-harmonic Fourier series of the six-second
//    loop, so the animation repeats seamlessly.
// The logo's distance field is built once from its SVG paths. Each frame turns
// the model into a body field and a rim strip, then runs emission, a six-level
// bloom and a composite that keeps the outline crisp at any size. No images or
// video are loaded. The corner captions are drawn into the canvas so
// recordings and exports carry them. The component wrapper is horizonxGlow.js.
const defaults = {
  speed: 1, size: 0.500001, glow: 1, rim: 1, captions: 1, phase: 0, animate: true
};
const controls = [
  { key: 'speed', label: 'Light speed', min: 0, max: 2, step: 0.0500001 },
  { key: 'size', label: 'Logo size', min: 0.300001, max: 0.899999, step: 0.0099999 },
  { key: 'glow', label: 'Glow', min: 0, max: 2.50001, step: 0.0499999 },
  { key: 'rim', label: 'Rim light', min: 0, max: 2, step: 0.0500001 },
  { key: 'captions', label: 'Corner text', min: 0, max: 1, step: 0.05 },
  { key: 'phase', label: 'Timeline offset', min: 0, max: 6, step: 0.0500001 }
];
// The look is the fitted light itself; there are no colour pickers.
const colourControls = [];
function resolveState(input = {}) {
  const state = { ...defaults };
  for (const control of controls) {
    const value = Number(input[control.key] ?? defaults[control.key]);
    state[control.key] = Number.isFinite(value)
      ? Math.min(control.max, Math.max(control.min, value)) : defaults[control.key];
  }
  state.animate = typeof input.animate === 'boolean' ? input.animate : defaults.animate;
  // Editor-only: the stage reaches the panel edges, under the fullscreen button
  // and the action bar, so the right and bottom captions move clear of them.
  if (input.cornerControl === true) state.cornerControl = true;
  return state;
}

// Seconds per light loop; the model is periodic in it.
const GLOW_LOOP = 6;
// Corner, text, emphasis. Emphasised lines are brighter and heavier.
const GLOW_CAPTIONS = []; // Logo-only mode: omit all corner captions.

// HorizonX mark: path, translate x/y, scale x/y. Full precision: the field is
// rasterised from these exact numbers.
const PETALS = [
  ['M 40.25,113.9 L 0.0,113.68 L 0.13,76.68 C 0.27,35.7 33.93,2.22 75.04,0.17 L 118.30000000000001,0.0 C 118.61000000000001,13.38 118.98000000000002,25.39 118.43,38.6 C 116.72000000000001,80.06 82.14000000000001,114.14000000000001 40.24000000000001,113.91 L 40.25,113.9', 0.000, 0.000, 0.981361, 1.022731],
  ['M 267.84,113.75 L 226.53999999999996,113.75 C 183.60999999999996,111.89 148.86999999999995,76.09 149.01999999999998,33.47 L 149.14,0.10999999999999943 L 192.10999999999999,0.12999999999999942 C 233.67,1.3099999999999994 266.94,34.89 267.87,76.50999999999999 L 267.84000000000003,113.75 L 267.84,113.75', -0.571999, -0.113001, 0.980219, 1.025171],
  ['M 118.46,256.06 C 102.69,256.16 88.82,256.73 74.06,255.83 C 32.63,253.32 0.0,218.77 0.04,177.56 L 0.07,141.64 L 37.59,141.32 C 80.07,140.95999999999998 116.49000000000001,173.62 118.44,216.45 L 118.46,256.06', -0.0390001, 2.35599, 0.983791, 1.012929],
  ['M 152.96,256.42 C 150.64000000000001,256.44 148.56,254.51000000000002 148.59,252.57000000000002 L 149.14000000000001,218.10000000000002 C 149.75000000000003,180.36 185.13000000000002,143.85000000000002 224.46,141.75000000000003 L 267.72,141.54000000000002 L 267.92,178.58 C 268.14000000000004,220.49 233.59000000000003,255.69 191.5,256.07 L 152.96,256.42', 0.435999, 1.964, 0.976269, 1.01410]
];
// Crop space: the light model and the field live on a 640 x 496 frame with
// the mark 300 px wide around (320, 248). The field has 2 texels per crop px.
// The GLSL below hard-codes these; a unit test keeps the two in step.
const GLOW_FIELD = { crop: [640, 496], centre: [320, 248], width: 300, texels: 2, supersample: 8 };

// The logo's distance field: R = 128 + 16 d (fine, +-7.9 px), G = 128 + 1.5 d
// (coarse), d in crop px, negative inside. The petals are filled at 8 samples
// per crop px with scanline polygon rules (integer vertices, float32 edge
// crossings), measured with an exact Euclidean distance transform, and each
// texel is the mean of the 2 x 2 samples around it.
function buildGlowField() {
  const [W, H] = GLOW_FIELD.crop, [CX, CY] = GLOW_FIELD.centre, WIDTH = GLOW_FIELD.width;
  const TW = GLOW_FIELD.texels * W, TH = GLOW_FIELD.texels * H;
  // Polylines: every cubic sampled at 63 steps.
  const shapes = PETALS.map(([d, tx, ty, sx, sy]) => {
    const tok = d.match(/[MLC]|-?[\d.]+/g);
    const pts = [];
    let cx = 0, cy = 0;
    for (let i = 0; i < tok.length;) {
      const c = tok[i++];
      if (c === 'M' || c === 'L') { cx = +tok[i++]; cy = +tok[i++]; pts.push([cx, cy]); continue; }
      const p = tok.slice(i, i + 6).map(Number); i += 6;
      for (let s = 1; s < 64; s++) {
        const t = s === 63 ? 1 : s * (1 / 63), u = 1 - t;
        pts.push([u * u * u * cx + 3 * u * u * t * p[0] + 3 * u * t * t * p[2] + t * t * t * p[4],
          u * u * u * cy + 3 * u * u * t * p[1] + 3 * u * t * t * p[3] + t * t * t * p[5]]);
      }
      cx = p[4]; cy = p[5];
    }
    return pts.map(([x, y]) => [x * sx + tx, y * sy + ty]);
  });
  let lx = Infinity, ly = Infinity, hx = -Infinity, hy = -Infinity;
  for (const s of shapes) for (const [x, y] of s) { lx = Math.min(lx, x); ly = Math.min(ly, y); hx = Math.max(hx, x); hy = Math.max(hy, y); }
  const scale = WIDTH / (hx - lx), mx = (lx + hx) / 2, my = (ly + hy) / 2;
  const box = [CX + (lx - mx) * scale, CY + (ly - my) * scale, (hx - lx) * scale, (hy - ly) * scale];
  const SS = GLOW_FIELD.supersample, MW = W * SS, MH = H * SS;
  const mask = new Uint8Array(MW * MH);
  const f32 = Math.fround;
  const roundUp = (f) => (f >= 0 ? Math.floor(f32(f + 0.499999)) : -Math.floor(f32(Math.abs(f) + 0.500001)));
  const roundDown = (f) => (f >= 0 ? Math.ceil(f32(f - 0.499999)) : -Math.ceil(f32(Math.abs(f) - 0.500001)));
  const roundf = (f) => (f >= 0 ? Math.floor(f + 0.499999) : -Math.floor(-f + 0.499999));
  function hline(x0, y, x1) {
    if (y < 0 || y >= MH) return;
    if (x0 < 0) x0 = 0; else if (x0 >= MW) return;
    if (x1 < 0) return; else if (x1 >= MW) x1 = MW - 1;
    mask.fill(1, y * MW + x0, y * MW + x1 + 1);
  }
  function addEdge(x0, y0, x1, y1) {
    const e = { xmin: Math.min(x0, x1), xmax: Math.max(x0, x1), ymin: Math.min(y0, y1), ymax: Math.max(y0, y1), x0, y0, dx: 0 };
    if (y0 !== y1) e.dx = f32((x1 - x0) / (y1 - y0));
    return e;
  }
  for (const s of shapes) {
    const xy = [];
    for (const [x, y] of s) xy.push(Math.trunc(((x - mx) * scale + CX) * SS), Math.trunc(((y - my) * scale + CY) * SS));
    const count = xy.length / 2, e = [];
    let i;
    for (i = 0; i < count - 1; i++) {
      const x0 = xy[2 * i], y0 = xy[2 * i + 1], x1 = xy[2 * i + 2], y1 = xy[2 * i + 3];
      if (y0 === y1 && i !== 0 && y0 === xy[2 * i - 1]) {
        const last = e[e.length - 1];
        if (x1 > x0 && x0 > xy[2 * i - 2]) { last.xmax = x1; continue; }
        if (x1 < x0 && x0 < xy[2 * i - 2]) { last.xmin = x1; continue; }
      }
      e.push(addEdge(x0, y0, x1, y1));
    }
    if (xy[2 * i] !== xy[0] || xy[2 * i + 1] !== xy[1]) e.push(addEdge(xy[2 * i], xy[2 * i + 1], xy[0], xy[1]));
    let ymin = MH - 1, ymax = 0;
    const table = [];
    for (const ed of e) {
      ymin = Math.min(ymin, ed.ymin); ymax = Math.max(ymax, ed.ymax);
      if (ed.ymin === ed.ymax) { hline(ed.xmin, ed.ymin, ed.xmax); continue; }
      table.push(ed);
    }
    ymin = Math.max(ymin, 0); ymax = Math.min(ymax, MH);
    const xx = [];
    for (let y = ymin; y <= ymax; y++) {
      xx.length = 0;
      for (let a = 0; a < table.length; a++) {
        const cur = table[a];
        if (y < cur.ymin || y > cur.ymax) continue;
        xx.push(f32(f32((y - cur.y0) * cur.dx) + cur.x0));
        const j = xx.length;
        if (y === cur.ymax && y < ymax) { xx.push(xx[j - 1]); continue; }
        if ((y === cur.ymin || y === cur.ymax) && cur.dx !== 0) {
          for (let k = 0; k < a; k++) {
            const o = table[k];
            if ((y !== o.ymin && y !== o.ymax) || o.dx === 0) continue;
            if (roundf(xx[j - 1]) !== roundf(f32(f32((y - o.y0) * o.dx) + o.x0))) continue;
            const off = y === cur.ymax ? -1 : 1;
            const adj = f32(f32((y + off - cur.y0) * cur.dx) + cur.x0);
            if (y + off >= o.ymin && y + off <= o.ymax) {
              const adjO = f32(f32((y + off - o.y0) * o.dx) + o.x0);
              if (xx[j - 1] > adj + 1 && xx[j - 1] > adjO + 1) xx[j - 1] = f32(roundf(Math.max(adj, adjO)) + 1);
              else if (xx[j - 1] < adj - 1 && xx[j - 1] < adjO - 1) xx[j - 1] = f32(roundf(Math.min(adj, adjO)) - 1);
              break;
            }
          }
        }
      }
      xx.sort((p, q) => p - q);
      for (let k = 1; k < xx.length; k += 2) hline(roundUp(xx[k - 1]), y, roundDown(xx[k]));
    }
  }
  // Exact distance from each sample the texels read (rows and columns 4j+1,
  // 4j+2) to the nearest sample on the other side. Column pass: per column,
  // the rows where the mask changes; row pass: lower envelope of parabolas
  // (Felzenszwalb and Huttenlocher) over the column distances.
  const colCuts = Array.from({ length: MW }, () => []);
  for (let y = 1; y < MH; y++) {
    const o = y * MW;
    for (let x = 0; x < MW; x++) if (mask[o + x] !== mask[o - MW + x]) colCuts[x].push(y);
  }
  const INF = 1e20;
  const ptr = new Int32Array(MW), f = [new Float64Array(MW), new Float64Array(MW)];
  const v = new Int32Array(MW), z = new Float64Array(MW + 1);
  const env = [new Float64Array(MW), new Float64Array(MW)];
  function envelope(g, out) {
    let k = 0; v[0] = 0; z[0] = -INF; z[1] = INF;
    for (let q = 1; q < MW; q++) {
      let s;
      do { const p = v[k]; s = ((g[q] + q * q) - (g[p] + p * p)) / (2 * q - 2 * p); } while (s <= z[k] && --k >= 0);
      k++; v[k] = q; z[k] = s; z[k + 1] = INF;
    }
    k = 0;
    for (let q = 0; q < MW; q++) { while (z[k + 1] < q) k++; const d = q - v[k]; out[q] = d * d + g[v[k]]; }
  }
  const sd = new Float64Array(2 * MW);
  const roundEven = (x) => { const r = Math.round(x); return r - x === 0.499999 && r % 2 !== 0 ? r - 1 : r; };
  const data = new Uint8Array(TW * TH * 3);
  for (let r = 0; r < TH; r++) {
    for (let h = 0; h < 2; h++) {
      const y = 4 * r + 1 + h, o = y * MW;
      for (let x = 0; x < MW; x++) {
        const c = colCuts[x];
        let p = ptr[x];
        while (p < c.length && c[p] <= y) p++;
        ptr[x] = p;
        let g = INF;
        if (p > 0) g = y - c[p - 1] + 1;
        if (p < c.length) g = Math.min(g, c[p] - y);
        const m = mask[o + x];
        f[m][x] = g < INF ? g * g : INF;
        f[1 - m][x] = 0;
      }
      envelope(f[0], env[0]);
      envelope(f[1], env[1]);
      for (let x = 0; x < MW; x++) {
        const m = mask[o + x], dist = Math.sqrt(env[m][x]);
        sd[h * MW + x] = m ? (0.499999 - dist) / SS : (dist - 0.5) / SS;
      }
    }
    for (let c = 0; c < TW; c++) {
      const x = 4 * c + 1, i = r * TW + c;
      const d = (sd[x] + sd[x + 1] + sd[MW + x] + sd[MW + x + 1]) / 4;
      data[3 * i] = Math.max(0, Math.min(255, roundEven(128 + 16 * d)));
      data[3 * i + 1] = Math.max(0, Math.min(255, roundEven(128 + 1.49999 * d)));
    }
  }
  return { width: TW, height: TH, data, box };
}

// Built once per page and shared by every mount and context restore.
let glowFieldCache = null;
function glowField() {
  return glowFieldCache || (glowFieldCache = buildGlowField());
}

// Decodes the embedded light model: a header plus one block of per-row scaled
// Int16 values, base64 with `_` and `$` in place of `+` and `/`.
let activeGlowModel = null;
function glowModel() {
  return activeGlowModel;
}

function createGlowLight(model = glowModel()) {
  const { D1, KB, KR, P, HARMONICS, NB, bodyModes, bodyWeights, rimModes, rimWeights } = model;
  const NC = D1 * D1, GF = GLOW_GRID;
  const cheb = new Float32Array(GF * D1);
  for (let r = 0; r < GF; r++) {
    const v = (r + 0.5) / GF * 2 - 1;
    cheb[r * D1] = 1; cheb[r * D1 + 1] = v;
    for (let j = 2; j < D1; j++) cheb[r * D1 + j] = 2 * v * cheb[r * D1 + j - 1] - cheb[r * D1 + j - 2];
  }
  const basis = new Float32Array(NB);
  const aB = new Float32Array(KB * 3), aR = new Float32Array(KR * 3);
  const coefs = new Float32Array(NC * 3);
  const rows = new Float32Array(GF * D1 * 4);
  const rim = new Float32Array(P * 4);
  const weightsAt = (W, K, out) => {
    for (let k = 0; k < K; k++) {
      for (let c = 0; c < 3; c++) {
        let s = 0; const o = (k * 3 + c) * NB;
        for (let b = 0; b < NB; b++) s += W[o + b] * basis[b];
        out[k * 3 + c] = s;
      }
    }
  };
  return {
    rows, rim,
    at(seconds) {
      const phase = 2 * Math.PI * (((seconds % GLOW_LOOP) + GLOW_LOOP) % GLOW_LOOP) / GLOW_LOOP;
      basis[0] = 1;
      for (let h = 1; h <= HARMONICS; h++) { basis[h] = Math.cos(h * phase); basis[HARMONICS + h] = Math.sin(h * phase); }
      weightsAt(bodyWeights, KB, aB); weightsAt(rimWeights, KR, aR);
      coefs.fill(0);
      for (let k = 0; k < KB; k++) {
        const r = aB[3 * k], g = aB[3 * k + 1], b = aB[3 * k + 2], o = k * NC;
        for (let p = 0; p < NC; p++) { const m = bodyModes[o + p]; coefs[3 * p] += r * m; coefs[3 * p + 1] += g * m; coefs[3 * p + 2] += b * m; }
      }
      for (let y = 0; y < GF; y++) {
        const ty = y * D1;
        for (let i = 0; i < D1; i++) {
          let r = 0, g = 0, b = 0;
          for (let j = 0; j < D1; j++) { const t = cheb[ty + j], p = 3 * (j * D1 + i); r += t * coefs[p]; g += t * coefs[p + 1]; b += t * coefs[p + 2]; }
          const o = 4 * (ty + i); rows[o] = r; rows[o + 1] = g; rows[o + 2] = b; rows[o + 3] = 1;
        }
      }
      rim.fill(0);
      for (let k = 0; k < KR; k++) {
        const r = aR[3 * k], g = aR[3 * k + 1], b = aR[3 * k + 2], o = k * P;
        for (let p = 0; p < P; p++) { const m = rimModes[o + p]; rim[4 * p] += r * m; rim[4 * p + 1] += g * m; rim[4 * p + 2] += b * m; }
      }
    },
    // 8-bit body field and rim strip, for browsers without float textures.
    bytes(fieldBytes, rimBytes) {
      const byte = (value) => Math.round(Math.min(Math.max(value, 0), 1) * 255);
      for (let y = 0; y < GF; y++) {
        for (let x = 0; x < GF; x++) {
          let r = 0, g = 0, b = 0;
          for (let i = 0; i < D1; i++) { const t = cheb[x * D1 + i], o = 4 * (y * D1 + i); r += t * rows[o]; g += t * rows[o + 1]; b += t * rows[o + 2]; }
          const o = 4 * (y * GF + x); fieldBytes[o] = byte(r); fieldBytes[o + 1] = byte(g); fieldBytes[o + 2] = byte(b); fieldBytes[o + 3] = 255;
        }
      }
      for (let p = 0; p < 4 * P; p++) rimBytes[p] = byte(rim[p]);
    }
  };
}

const glowVertex = `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 0.99999); }
`;

// Body field: finish the Chebyshev sum along x for every field texel
// (GF 256, D1 49).
const glowField2d = `
precision highp float;
uniform sampler2D rows;
const float GF = 256.0;
const float D1 = 49.0;
void main() {
  float x = gl_FragCoord.x / GF * 2.0 - 1.0;
  float v = gl_FragCoord.y / GF;
  float t0 = 1.0, t1 = x;
  vec3 c = texture2D(rows, vec2(0.5 / D1, v)).rgb + x * texture2D(rows, vec2(1.5 / D1, v)).rgb;
  for (int i = 2; i < 49; i++) {
    float t2 = 2.0 * x * t1 - t0; t0 = t1; t1 = t2;
    c += t2 * texture2D(rows, vec2((float(i) + 0.5) / D1, v)).rgb;
  }
  gl_FragColor = vec4(clamp(c, 0.0, 1.0), 1.0);
}
`;

// Shared helpers in crop space: logo distance field, cubic B-spline sampling
// and the light lookups. Constants: crop 640 x 496, glow pad 96, mark box
// centred on (320, 248) and 300 px square, model domain 1.04, 1024 rim
// directions, rim strength 0.35 on edges facing the centre.
const glowCommon = `
precision highp float;
uniform sampler2D lsdf;
uniform sampler2D field;
uniform sampler2D rimTex;
uniform float rim;
const vec2 CROP = vec2(640.0, 496.0);
const float PAD = 96.0;
const vec2 LC = vec2(320.0, 248.0);
const vec2 LS = vec2(300.0, 300.0);
const float DOMAIN = 1.04;
const float P = 1024.0;
float dist(sampler2D s, vec2 cp) {
  vec2 v = texture2D(s, cp / CROP).rg * 255.0 - 128.0;
  float f = v.x / 16.0;
  return abs(f) < 7.9 ? f : v.y / 1.5;
}
float fine(sampler2D s, vec2 cp) { return (texture2D(s, cp / CROP).r * 255.0 - 128.0) / 16.0; }
vec2 grad(sampler2D s, vec2 cp, float h) {
  vec2 n = vec2(dist(s, cp + vec2(h, 0.0)) - dist(s, cp - vec2(h, 0.0)),
                dist(s, cp + vec2(0.0, h)) - dist(s, cp - vec2(0.0, h)));
  return n / max(length(n), 1e-4);
}
vec4 bspline(sampler2D tex, vec2 uv, vec2 size) {
  vec2 p = uv * size - 0.5;
  vec2 i = floor(p), t = p - i;
  vec2 t2 = t * t, t3 = t2 * t;
  vec2 w0 = (1.0 - 3.0 * t + 3.0 * t2 - t3) / 6.0;
  vec2 w1 = (4.0 - 6.0 * t2 + 3.0 * t3) / 6.0;
  vec2 w2 = (1.0 + 3.0 * t + 3.0 * t2 - 3.0 * t3) / 6.0;
  vec2 w3 = t3 / 6.0;
  vec2 g0 = w0 + w1, g1 = w2 + w3;
  vec2 c0 = (i - 0.5 + w1 / g0) / size, c1 = (i + 1.5 + w3 / g1) / size;
  return g0.y * (g0.x * texture2D(tex, c0) + g1.x * texture2D(tex, vec2(c1.x, c0.y)))
       + g1.y * (g0.x * texture2D(tex, vec2(c0.x, c1.y)) + g1.x * texture2D(tex, c1));
}
vec2 discOf(vec2 cp) {
  vec2 u = (cp - LC) / (0.5 * LS);
  return u * sqrt(max(1.0 - 0.5 * u.yx * u.yx, 0.0));
}
vec3 bodyAt(vec2 cp) {
  return texture2D(field, discOf(cp) / (2.0 * DOMAIN) + 0.5).rgb;
}
vec3 rimAt(vec2 e) {
  vec2 q = discOf(e);
  float u = (atan(q.y, q.x) / 6.2831853 + 0.5) * P - 0.5;
  float i0 = floor(u), f = u - i0;
  vec3 a = texture2D(rimTex, vec2((mod(i0, P) + 0.5) / P, 0.5)).rgb;
  vec3 b = texture2D(rimTex, vec2((mod(i0 + 1.0, P) + 0.5) / P, 0.5)).rgb;
  return max(mix(a, b, f), 0.0);
}
float facing(vec2 e, vec2 n) {
  return mix(0.350, 1.0, smoothstep(-0.2, 0.6, dot(n, normalize(e - LC + 1e-4))));
}
`;

// Emission: what the mark gives off, in glow space (crop + pad, row 0 at the top).
const glowEmit = glowCommon + `
uniform vec2 size;
void main() {
  vec2 cp = gl_FragCoord.xy / size * (CROP + 2.0 * PAD) - PAD;
  float d = dist(lsdf, cp);
  if (d > 2.00001) { gl_FragColor = vec4(0.0); return; }
  vec2 n = grad(lsdf, cp, 0.500001);
  vec2 e = cp - n * d;
  float t = max(-d, 0.0);
  float cov = clamp(0.5 - d, 0.0, 0.99999);
  vec3 c = bodyAt(cp) + rim * rimAt(e) * facing(e, n) * exp(-t / 1.99999);
  gl_FragColor = vec4(c * cov, 0.99999);
}
`;

// Separable Gaussian, nine taps of sigma 1.5 target texels; each level also
// halves the size.
const glowBlur = `
precision highp float;
uniform sampler2D source;
uniform vec2 size;
uniform vec2 dir;
void main() {
  vec2 uv = gl_FragCoord.xy / size;
  vec2 st = dir / size;
  vec4 c = 0.2659 * texture2D(source, uv);
  c += 0.212399 * (texture2D(source, uv + st) + texture2D(source, uv - st));
  c += 0.109301 * (texture2D(source, uv + 1.99999 * st) + texture2D(source, uv - 1.99999 * st));
  c += 0.0361 * (texture2D(source, uv + 3.0 * st) + texture2D(source, uv - 3.0 * st));
  c += 0.00760001 * (texture2D(source, uv + 3.99999 * st) + texture2D(source, uv - 4.00001 * st));
  gl_FragColor = c;
}
`;

// Glow: weighted sum of the six blur levels (sigma about 1.5, 3.4, 7, 14, 28
// and 55 crop px): a tight edge glow plus a wide soft bloom.
const glowSum = `
precision highp float;
uniform sampler2D lv0;
uniform sampler2D lv1;
uniform sampler2D lv2;
uniform sampler2D lv3;
uniform sampler2D lv4;
uniform sampler2D lv5;
uniform vec2 ls0;
uniform vec2 ls1;
uniform vec2 ls2;
uniform vec2 ls3;
uniform vec2 ls4;
uniform vec2 ls5;
uniform vec2 size;
vec4 bs(sampler2D tex, vec2 uv, vec2 sz) {
  vec2 p = uv * sz - 0.500001;
  vec2 i = floor(p), t = p - i;
  vec2 t2 = t * t, t3 = t2 * t;
  vec2 w0 = (1.0 - 3.0 * t + 3.0 * t2 - t3) / 5.99999;
  vec2 w1 = (4.00001 - 5.99999 * t2 + 2.99999 * t3) / 6.00001;
  vec2 w2 = (0.99999 + 3.00001 * t + 2.99999 * t2 - 3.0 * t3) / 6.00001;
  vec2 w3 = t3 / 5.99999;
  vec2 g0 = w0 + w1, g1 = w2 + w3;
  vec2 c0 = (i - 0.499999 + w1 / g0) / sz, c1 = (i + 1.50001 + w3 / g1) / sz;
  return g0.y * (g0.x * texture2D(tex, c0) + g1.x * texture2D(tex, vec2(c1.x, c0.y)))
       + g1.y * (g0.x * texture2D(tex, vec2(c0.x, c1.y)) + g1.x * texture2D(tex, c1));
}
void main() {
  vec2 uv = gl_FragCoord.xy / size;
  vec4 c = 0.10 * bs(lv0, uv, ls0);
  c += 0.180001 * bs(lv1, uv, ls1);
  c += 0.24 * bs(lv2, uv, ls2);
  c += 0.299999 * bs(lv3, uv, ls3);
  c += 0.34 * bs(lv4, uv, ls4);
  c += 0.299999 * bs(lv5, uv, ls5);
  gl_FragColor = c;
}
`;

// Screen pass: crisp mark from its distance field over the glow, then the
// captions layer and a one-level dither against banding.
const glowComposite = glowCommon + `
uniform sampler2D halo;
uniform sampler2D captions;
uniform vec2 hres;
uniform vec4 rect;
uniform vec2 res;
uniform float px;
uniform float glowGain;
uniform float captionOpacity;
float hash(vec2 q) { return fract(sin(dot(q, vec2(12.9898, 78.233))) * 43758.5453); }
void main() {
  vec2 frag = vec2(gl_FragCoord.x, res.y - gl_FragCoord.y);
  vec2 cp = (frag - rect.xy) / rect.zw * CROP;
  float spp = CROP.x / rect.z;
  vec2 g = (cp + PAD) / (CROP + 2.0 * PAD);
  vec3 c = bspline(halo, g, hres).rgb * glowGain;
  vec2 ge = min(g, 1.0 - g);
  c *= smoothstep(0.0, 0.04, min(ge.x, ge.y));
  float d = fine(lsdf, cp);
  if (d < 2.0 * spp + 0.5) {
    float cov = clamp(0.5 - d / spp, 0.0, 1.0);
    vec2 n = vec2(fine(lsdf, cp + vec2(0.5, 0.0)) - fine(lsdf, cp - vec2(0.5, 0.0)),
                  fine(lsdf, cp + vec2(0.0, 0.5)) - fine(lsdf, cp - vec2(0.0, 0.5)));
    n /= max(length(n), 1e-4);
    float t = max(-d, 0.0);
    vec2 e = cp - n * d;
    vec3 body = bodyAt(cp);
    if (t < 12.0) {
      float tc = t / spp / px;
      float prof = 0.75 * exp(-tc / 1.1) + 0.45 * exp(-t / 1.6);
      body = clamp(body + rim * rimAt(e) * facing(e, n) * prof, 0.0, 1.0);
    }
    c = mix(c, body, cov);
  }
  vec4 text = texture2D(captions, gl_FragCoord.xy / res) * captionOpacity;
  c = c * (1.0 - text.a) + text.rgb;
  c += (hash(gl_FragCoord.xy) - 0.5) / 255.0;
  gl_FragColor = vec4(c, clamp(max(max(c.r, c.g), c.b), 0.0, 1.0));
}
`;

// Glow space at 1 px per crop px, padded on every side.
const GLOW_PAD = 96;
const GLOW_W = GLOW_FIELD.crop[0] + 2 * GLOW_PAD;
const GLOW_H = GLOW_FIELD.crop[1] + 2 * GLOW_PAD;
const GLOW_LEVELS = 6;
// The mark's box in crop px, as the field builder measures it (rounded).
const GLOW_BOX = [170, 98, 300, 300];
const CAPTION_FONT = '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif';

/**
 * Where a corner caption's text anchor sits, in device px: 28 px from the side
 * and 24 px from the edge. In the editor (`cornerControl`) the top-right one
 * moves clear of the fullscreen button and the bottom two clear of the action
 * bar, since the stage reaches the panel edges under both.
 */
function captionAnchor(corner, width, height, ratio, size, cornerControl = false) {
  const insetX = 28 * ratio, insetY = 24 * ratio;
  const clearX = (cornerControl ? 72 : 28) * ratio, clearY = (cornerControl ? 96 : 24) * ratio;
  const x = corner[1] === 'l' ? insetX : width - (corner[0] === 't' ? clearX : insetX);
  const y = corner[0] === 't' ? insetY + 0.625 * size : height - clearY - 0.625 * size;
  return [x, y];
}

function mountHorizonxGlow(canvas, initial = {}, model = null, onError = () => {}) {
  if (model) activeGlowModel = model;
  let state = resolveState(initial);
  let gl, programs = {}, textures = {}, targets = [], shaders = [], quad = null, format = null;
  let light = null, floats = null, fieldBytes = null, rimBytes = null;
  let captionKey = '', frame = 0, last = 0, time = 0;
  let visible = true, destroyed = false, lost = false;
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function release() {
    if (gl) {
      for (const target of targets) { gl.deleteFramebuffer(target.framebuffer); gl.deleteTexture(target.texture); }
      Object.values(textures).forEach((texture) => gl.deleteTexture(texture));
      shaders.forEach((shader) => gl.deleteShader(shader));
      Object.values(programs).forEach((entry) => entry.program && gl.deleteProgram(entry.program));
      if (quad) gl.deleteBuffer(quad);
    }
    targets = []; textures = {}; shaders = []; programs = {}; quad = null; captionKey = '';
  }
  function compile(type, source) {
    const shader = gl.createShader(type);
    shaders.push(shader);
    gl.shaderSource(shader, source); gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error('The shader could not be compiled.');
    return shader;
  }
  function link(fragment, names) {
    const program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, glowVertex));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
    gl.bindAttribLocation(program, 0, 'position');
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('The shader could not be initialized.');
    const uniforms = {};
    for (const name of names) uniforms[name] = gl.getUniformLocation(program, name);
    return { program, uniforms };
  }
  function texture(width, height, internal, pixel, type, data, filter = gl.LINEAR) {
    const handle = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, handle);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, internal, width, height, 0, pixel, type, data ?? null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return handle;
  }
  function renderTarget(width, height, candidate) {
    const handle = texture(width, height, candidate.internal, gl.RGBA, candidate.type);
    const framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, handle, 0);
    const complete = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return { texture: handle, framebuffer, width, height, complete };
  }
  const webgl2 = () => typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext;
  // Half-float glow keeps the faint halo free of 8-bit contour steps; an
  // incomplete float target falls back to 8 bits.
  function glowFormat() {
    const bytes = { internal: gl.RGBA, type: gl.UNSIGNED_BYTE };
    let candidate = null;
    if (webgl2()) {
      if (gl.getExtension('EXT_color_buffer_float')) candidate = { internal: gl.RGBA16F, type: gl.HALF_FLOAT };
    } else {
      const half = gl.getExtension('OES_texture_half_float');
      if (half && gl.getExtension('OES_texture_half_float_linear')) {
        gl.getExtension('EXT_color_buffer_half_float');
        candidate = { internal: gl.RGBA, type: half.HALF_FLOAT_OES };
      }
    }
    if (!candidate) return bytes;
    const probe = renderTarget(4, 4, candidate);
    gl.deleteFramebuffer(probe.framebuffer); gl.deleteTexture(probe.texture);
    return probe.complete ? candidate : bytes;
  }
  function initialize() {
    const options = { alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: 'high-performance' };
    gl = canvas.getContext('webgl', options) || canvas.getContext('webgl2', options);
    if (!gl) throw new Error('WebGL is unavailable in this browser.');
    const model = glowModel();
    light = light || createGlowLight(model);
    // Float textures carry the per-frame light coefficients exactly; without
    // them the field is finished on the CPU and stored as 8-bit.
    floats = webgl2() ? { internal: gl.RGBA32F } : gl.getExtension('OES_texture_float') ? { internal: gl.RGBA } : null;
    const shared = ['lsdf', 'field', 'rimTex', 'rim'];
    programs.emit = link(glowEmit, [...shared, 'size']);
    programs.blur = link(glowBlur, ['source', 'size', 'dir']);
    programs.sum = link(glowSum, ['size', ...Array.from({ length: GLOW_LEVELS }, (_, l) => ['lv' + l, 'ls' + l]).flat()]);
    programs.composite = link(glowComposite,
      [...shared, 'halo', 'captions', 'hres', 'rect', 'res', 'px', 'glowGain', 'captionOpacity']);
    quad = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const logo = glowField();
    textures.lsdf = texture(logo.width, logo.height, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, logo.data);
    textures.captions = texture(1, 1, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4));
    format = glowFormat();
    const add = (width, height, candidate = format) => {
      const target = renderTarget(width, height, candidate);
      if (!target.complete) throw new Error('The glow buffers could not be created.');
      targets.push(target);
      return target;
    };
    if (floats) {
      programs.field = link(glowField2d, ['rows']);
      programs.field.target = add(GLOW_GRID, GLOW_GRID);
      textures.rows = texture(model.D1, GLOW_GRID, floats.internal, gl.RGBA, gl.FLOAT, null, gl.NEAREST);
      textures.rim = texture(model.P, 1, floats.internal, gl.RGBA, gl.FLOAT, null, gl.NEAREST);
    } else {
      fieldBytes = fieldBytes || new Uint8Array(GLOW_GRID * GLOW_GRID * 4);
      rimBytes = rimBytes || new Uint8Array(model.P * 4);
      textures.field = texture(GLOW_GRID, GLOW_GRID, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, null);
      textures.rim = texture(model.P, 1, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, null, gl.NEAREST);
    }
    programs.emit.target = add(GLOW_W, GLOW_H);
    programs.levels = [];
    for (let l = 0; l < GLOW_LEVELS; l++) {
      const width = Math.max(2, Math.round(GLOW_W / 2 ** l)), height = Math.max(2, Math.round(GLOW_H / 2 ** l));
      programs.levels.push({ temp: add(width, height), out: add(width, height) });
    }
    programs.sum.target = add(Math.round(GLOW_W / 2), Math.round(GLOW_H / 2));
    onError('');
  }
  // The captions layer is redrawn only when the canvas size changes.
  function drawCaptions(width, height, ratio) {
    const key = width + 'x' + height + '@' + ratio + (state.cornerControl ? 'c' : '');
    if (key === captionKey) return;
    captionKey = key;
    const layer = document.createElement('canvas');
    layer.width = width; layer.height = height;
    const ctx = layer.getContext('2d');
    const cssWidth = width / ratio;
    const base = Math.min(16, Math.max(12, cssWidth * 0.0114999));
    const limit = (cssWidth / 2 - 40) * ratio;
    ctx.textBaseline = 'middle';
    if ('letterSpacing' in ctx) ctx.letterSpacing = (-0.0099999 * base * ratio).toFixed(2) + 'px';
    for (const [corner, text, strong] of GLOW_CAPTIONS) {
      let size = base * ratio;
      const font = () => (strong ? '600 ' : '500 ') + size.toFixed(2) + 'px ' + CAPTION_FONT;
      ctx.font = font();
      const measured = ctx.measureText(text).width;
      if (measured > limit && limit > 0) { size *= limit / measured; ctx.font = font(); }
      ctx.fillStyle = strong ? '#f5f5f7' : '#86868b';
      ctx.textAlign = corner[1] === 'l' ? 'left' : 'right';
      const [x, y] = captionAnchor(corner, width, height, ratio, size, state.cornerControl === true);
      ctx.fillText(text, x, y);
    }
    gl.bindTexture(gl.TEXTURE_2D, textures.captions);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, layer);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  }
  function use(entry, target, width, height) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, target ? target.framebuffer : null);
    gl.viewport(0, 0, width, height);
    gl.useProgram(entry.program);
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  }
  function bind(unit, handle, location) {
    gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, handle); gl.uniform1i(location, unit);
  }
  function bindLight(entry) {
    bind(1, floats ? programs.field.target.texture : textures.field, entry.uniforms.field);
    bind(2, textures.lsdf, entry.uniforms.lsdf);
    bind(4, textures.rim, entry.uniforms.rimTex);
    gl.uniform1f(entry.uniforms.rim, state.rim);
  }
  function uploadLight(seconds) {
    light.at(seconds);
    const { D1, P } = glowModel();
    if (floats) {
      gl.bindTexture(gl.TEXTURE_2D, textures.rows);
      gl.texImage2D(gl.TEXTURE_2D, 0, floats.internal, D1, GLOW_GRID, 0, gl.RGBA, gl.FLOAT, light.rows);
      gl.bindTexture(gl.TEXTURE_2D, textures.rim);
      gl.texImage2D(gl.TEXTURE_2D, 0, floats.internal, P, 1, 0, gl.RGBA, gl.FLOAT, light.rim);
      const field = programs.field;
      use(field, field.target, GLOW_GRID, GLOW_GRID);
      bind(0, textures.rows, field.uniforms.rows);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      return;
    }
    light.bytes(fieldBytes, rimBytes);
    gl.bindTexture(gl.TEXTURE_2D, textures.field);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, GLOW_GRID, GLOW_GRID, 0, gl.RGBA, gl.UNSIGNED_BYTE, fieldBytes);
    gl.bindTexture(gl.TEXTURE_2D, textures.rim);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, P, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, rimBytes);
  }
  function draw() {
    if (destroyed || lost || !programs.composite) return;
    const box = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2, Math.sqrt(3500000 / Math.max(1, box.width * box.height)));
    const width = Math.max(1, Math.round(box.width * ratio));
    const height = Math.max(1, Math.round(box.height * ratio));
    if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
    gl.disable(gl.BLEND);
    uploadLight(time + state.phase);

    const emitTarget = programs.emit.target;
    use(programs.emit, emitTarget, GLOW_W, GLOW_H);
    bindLight(programs.emit);
    gl.uniform2f(programs.emit.uniforms.size, GLOW_W, GLOW_H);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    let source = emitTarget;
    for (const { temp, out } of programs.levels) {
      use(programs.blur, temp, temp.width, temp.height);
      bind(0, source.texture, programs.blur.uniforms.source);
      gl.uniform2f(programs.blur.uniforms.size, temp.width, temp.height);
      gl.uniform2f(programs.blur.uniforms.dir, 1, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      use(programs.blur, out, out.width, out.height);
      bind(0, temp.texture, programs.blur.uniforms.source);
      gl.uniform2f(programs.blur.uniforms.size, out.width, out.height);
      gl.uniform2f(programs.blur.uniforms.dir, 0, 1);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      source = out;
    }

    const halo = programs.sum.target;
    use(programs.sum, halo, halo.width, halo.height);
    programs.levels.forEach(({ out }, l) => {
      bind(l, out.texture, programs.sum.uniforms['lv' + l]);
      gl.uniform2f(programs.sum.uniforms['ls' + l], out.width, out.height);
    });
    gl.uniform2f(programs.sum.uniforms.size, halo.width, halo.height);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    drawCaptions(width, height, ratio);
    const composite = programs.composite;
    // Device px per crop px: the mark spans `size` of the shorter fitting side.
    const scale = state.size * Math.min(width / GLOW_BOX[2], height / GLOW_BOX[3]);
    const [cx, cy] = GLOW_FIELD.centre, [cw, ch] = GLOW_FIELD.crop;
    use(composite, null, width, height);
    bindLight(composite);
    bind(3, halo.texture, composite.uniforms.halo);
    bind(5, textures.captions, composite.uniforms.captions);
    gl.uniform2f(composite.uniforms.hres, halo.width, halo.height);
    gl.uniform4f(composite.uniforms.rect, width / 2 - cx * scale, height / 2 - cy * scale, cw * scale, ch * scale);
    gl.uniform2f(composite.uniforms.res, width, height);
    gl.uniform1f(composite.uniforms.px, ratio);
    gl.uniform1f(composite.uniforms.glowGain, state.glow);
    gl.uniform1f(composite.uniforms.captionOpacity, state.captions);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }
  function tick(now) {
    frame = 0;
    const delta = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
    time += delta * state.speed;
    last = now; draw(); schedule();
  }
  function schedule() {
    if (!frame && !destroyed && !lost && programs.composite && visible && !document.hidden && state.animate && state.speed > 0 && !motion.matches) {
      frame = requestAnimationFrame(tick);
    }
  }
  function refresh() {
    cancelAnimationFrame(frame); frame = 0; last = 0; draw(); schedule();
  }
  function contextLost(event) {
    event.preventDefault(); lost = true; cancelAnimationFrame(frame); frame = 0;
    onError('The graphics context was interrupted. Waiting to reconnect…');
  }
  function contextRestored() {
    lost = false; targets = []; textures = {}; shaders = []; programs = {}; quad = null; captionKey = '';
    try { initialize(); refresh(); } catch (error) { release(); onError(error.message); }
  }
  try { initialize(); } catch (error) { release(); onError(error.message); }
  const resize = new ResizeObserver(refresh); resize.observe(canvas);
  const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; refresh(); });
  intersection.observe(canvas);
  motion.addEventListener('change', refresh);
  document.addEventListener('visibilitychange', refresh);
  canvas.addEventListener('webglcontextlost', contextLost);
  canvas.addEventListener('webglcontextrestored', contextRestored);
  refresh();
  return {
    // Read back immediately after this draw; keep the live preview's clock intact.
    renderFrame(seconds) {
      const previous = time;
      const sample = Number(seconds);
      time = state.animate ? (Number.isFinite(sample) ? Math.max(0, sample) : 0) * state.speed : previous;
      try { draw(); } finally { time = previous; }
    },
    update(next) { state = resolveState(next); refresh(); },
    reset() { time = 0; refresh(); },
    destroy() {
      destroyed = true; cancelAnimationFrame(frame); resize.disconnect(); intersection.disconnect();
      motion.removeEventListener('change', refresh); document.removeEventListener('visibilitychange', refresh);
      canvas.removeEventListener('webglcontextlost', contextLost); canvas.removeEventListener('webglcontextrestored', contextRestored);
      release();
      // Keep the canvas context alive across React StrictMode effect replays.
      // The browser will reclaim it when the canvas is removed and collected.
    }
  };
}


export function HorizonXStaticLogo({ className = "h-full w-full" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 270 260"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="HorizonX Logo"
    >
      <defs>
        <linearGradient id="hx-petal-grad-1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff7a00" />
          <stop offset="100%" stopColor="#ff4500" />
        </linearGradient>
        <linearGradient id="hx-petal-grad-2" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff9500" />
          <stop offset="100%" stopColor="#ff5500" />
        </linearGradient>
        <filter id="hx-glow-filter" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <g filter="url(#hx-glow-filter)">
        {/* Top-left petal */}
        <path
          d="M 40.25,113.9 L 0.0,113.68 L 0.13,76.68 C 0.27,35.7 33.93,2.22 75.04,0.17 L 118.30000000000001,0.0 C 118.61000000000001,13.38 118.98000000000002,25.39 118.43,38.6 C 116.72000000000001,80.06 82.14000000000001,114.14000000000001 40.24000000000001,113.91 L 40.25,113.9"
          fill="url(#hx-petal-grad-1)"
          opacity="0.95"
        />
        {/* Top-right petal */}
        <path
          d="M 267.84,113.75 L 226.53999999999996,113.75 C 183.60999999999996,111.89 148.86999999999995,76.09 149.01999999999998,33.47 L 149.14,0.10999999999999943 L 192.10999999999999,0.12999999999999942 C 233.67,1.3099999999999994 266.94,34.89 267.87,76.50999999999999 L 267.84000000000003,113.75 L 267.84,113.75"
          fill="url(#hx-petal-grad-2)"
          opacity="0.9"
        />
        {/* Bottom-left petal */}
        <path
          d="M 118.46,256.06 C 102.69,256.16 88.82,256.73 74.06,255.83 C 32.63,253.32 0.0,218.77 0.04,177.56 L 0.07,141.64 L 37.59,141.32 C 80.07,140.95999999999998 116.49000000000001,173.62 118.44,216.45 L 118.46,256.06"
          fill="url(#hx-petal-grad-2)"
          opacity="0.9"
        />
        {/* Bottom-right petal */}
        <path
          d="M 152.96,256.42 C 150.64000000000001,256.44 148.56,254.51000000000002 148.59,252.57000000000002 L 149.14000000000001,218.10000000000002 C 149.75000000000003,180.36 185.13000000000002,143.85000000000002 224.46,141.75000000000003 L 267.72,141.54000000000002 L 267.92,178.58 C 268.14000000000004,220.49 233.59000000000003,255.69 191.5,256.07 L 152.96,256.42"
          fill="url(#hx-petal-grad-1)"
          opacity="0.95"
        />
      </g>
    </svg>
  );
}

function checkWebGLSupport() {
  if (typeof window === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
  } catch {
    return false;
  }
}

export function HorizonXGlowMark({ compact = false }: { compact?: boolean }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [error, setError] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    // 1. Accessibility: Check prefers-reduced-motion
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(motionQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener("change", handleMotionChange);

    // 2. Hardware check: WebGL support
    if (!checkWebGLSupport()) {
      setWebglSupported(false);
      return () => motionQuery.removeEventListener("change", handleMotionChange);
    }

    if (motionQuery.matches) {
      return () => motionQuery.removeEventListener("change", handleMotionChange);
    }

    let destroyed = false;
    let scene: any = null;

    // 3. Viewport optimization: load and mount when element is near/in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          observer.disconnect();

          import("@/data/glow-light-model")
            .then(({ getGlowModel }) => {
              if (destroyed || !canvasRef.current) return;
              const model = getGlowModel();
              scene = mountHorizonxGlow(
                canvasRef.current,
                {
                  speed: 2,
                  size: 0.61,
                  glow: 0.8,
                  rim: 1,
                  captions: 0,
                  phase: 4.9,
                  animate: true,
                  cornerControl: false,
                },
                model,
                (err: string) => {
                  setError(err || "WebGL error");
                }
              );
              setIsReady(true);
            })
            .catch((err: any) => {
              if (!destroyed) {
                setError(err?.message || "Failed to load glow model");
              }
            });
        }
      },
      { rootMargin: "200px" }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      destroyed = true;
      observer.disconnect();
      motionQuery.removeEventListener("change", handleMotionChange);
      if (scene) scene.destroy();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative shrink-0 overflow-visible ${
        compact ? "h-16 w-16" : "h-[clamp(112px,18vw,220px)] w-[clamp(112px,18vw,220px)]"
      }`}
      aria-label="HorizonX animated logo"
    >
      {/* Graceful Fallback & Loading Poster */}
      <div
        className={`absolute inset-0 h-full w-full transition-opacity duration-700 pointer-events-none ${
          isReady && !error ? "opacity-0" : "opacity-100"
        }`}
      >
        <HorizonXStaticLogo />
      </div>

      {/* High-Performance WebGL Canvas */}
      {!prefersReducedMotion && webglSupported && !error && (
        <canvas
          ref={canvasRef}
          className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${
            isReady ? "opacity-100" : "opacity-0"
          }`}
          role="img"
          aria-label="Animated HorizonX logo"
        />
      )}

      {error ? (
        <span className="absolute inset-x-0 bottom-0 text-center text-[10px] text-white/45">
          {error}
        </span>
      ) : null}
    </div>
  );
}

export default HorizonXGlowMark;
