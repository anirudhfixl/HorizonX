import React, { useLayoutEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { PROJECTS, TOKENS } from "@/data";

const CSS = `
.ab-export{display:block;width:100%;height:100%;min-width:0;min-height:0;max-width:100%;background:transparent}
.ab-frame{width:100%;height:100%;min-width:0;min-height:0;display:grid;place-items:center;background:transparent}
.ab-root{position:relative;width:min(100%,var(--ab-w));height:min(100%,var(--ab-h));min-width:0;overflow:hidden;background:transparent;color:var(--ab-ink);font-family:Inter,ui-sans-serif,system-ui,sans-serif;touch-action:pan-y;user-select:none;-webkit-user-select:none;container-type:size;isolation:isolate;outline:none}
.ab-root[data-draggable]{cursor:grab}.ab-root[data-card-hover]{cursor:pointer}.ab-root[data-dragging]{cursor:grabbing}
.ab-root:focus-visible{outline:2px solid var(--ab-ink);outline-offset:-3px}
.ab-canvas{position:absolute;inset:0;display:block;width:100%;height:100%;pointer-events:none;background:transparent}
.ab-fallback{position:absolute;inset:0;display:flex;align-items:center;gap:12px;overflow:hidden;box-sizing:border-box;pointer-events:none}
.ab-fallback img{flex:0 0 auto;height:64%;aspect-ratio:var(--ab-aspect);object-fit:cover;border-radius:12px}
.ab-fallback img:first-child{margin-left:calc(50% - 32cqh * var(--ab-aspect))}.ab-fallback img:last-child{margin-right:calc(50% - 32cqh * var(--ab-aspect))}
.ab-root[data-ready] .ab-fallback{visibility:hidden}
.ab-live{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
`;

const WHEEL_PROJECTS = PROJECTS.slice(0, 6).map((project, index) => {
  const token = TOKENS.find((item) => project.tokenIds?.includes(item.id));
  const accents = ["#36d7e9", "#a78bfa", "#2dd4bf", "#fbbf24", "#60a5fa", "#fb7185"];
  return {
    ...project,
    description: project.description ?? "Building in the HorizonX ecosystem.",
    ticker: token?.symbol ? `$${token.symbol}` : project.category.toUpperCase(),
    categoryLabel: (project.category ?? "PROJECT").toUpperCase(),
    ecosystemLabel: (project.ecosystem ?? "HORIZONX ECOSYSTEM").toUpperCase(),
    auditAvailable: project.verificationStatus === "audit_available",
    accent: accents[index % accents.length],
  };
});

function escapeXml(value: string) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&apos;");
}

function wrapSvgText(value: string, limit: number) {
  const lines: string[] = [];
  let line = "";
  for (const word of value.split(/\s+/)) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > limit && line) { lines.push(line); line = word; }
    else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

function projectArtwork(project: (typeof WHEEL_PROJECTS)[number], index: number) {
  const title = wrapSvgText(project.name, 19).slice(0, 3).map((line, i) =>
    `<text x="116" y="${420 + i * 66}" fill="#f4f7ff" font-size="${i === 0 ? 56 : 52}" font-weight="700">${escapeXml(line)}</text>`
  ).join("");
  const desc = wrapSvgText(project.description, 42).slice(0, 3).map((line, i) =>
    `<text x="78" y="${690 + i * 38}" fill="#aeb8cc" font-size="25">${escapeXml(line)}</text>`
  ).join("");
  const audit = project.auditAvailable
    ? '<rect x="690" y="76" width="250" height="54" rx="27" fill="#102b2a" stroke="#2dd4bf" stroke-opacity=".55"/><text x="815" y="111" text-anchor="middle" fill="#72e8ce" font-size="20" font-weight="600">AUDIT AVAILABLE</text>'
    : '';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#111827"/><stop offset=".58" stop-color="#090d18"/><stop offset="1" stop-color="#171326"/></linearGradient><radialGradient id="glow"><stop offset="0" stop-color="${project.accent}" stop-opacity=".32"/><stop offset="1" stop-color="${project.accent}" stop-opacity="0"/></radialGradient><linearGradient id="line" x1="0" y1="0" x2="1" y2="0"><stop stop-color="${project.accent}" stop-opacity=".95"/><stop offset="1" stop-color="${project.accent}" stop-opacity="0"/></linearGradient></defs><rect width="1024" height="1024" rx="76" fill="url(#bg)"/><circle cx="830" cy="260" r="430" fill="url(#glow)"/><path d="M0 210H1024M0 840H1024" stroke="#fff" stroke-opacity=".08"/><path d="M76 180H948" stroke="url(#line)" stroke-width="4"/><text x="78" y="112" fill="${project.accent}" font-size="24" font-weight="700" letter-spacing="5">HORIZONX ECOSYSTEM</text><text x="78" y="260" fill="#78849b" font-size="22" letter-spacing="4">0${index + 1} / 06 · ${escapeXml(project.categoryLabel)}</text>${audit}<circle cx="846" cy="520" r="190" fill="none" stroke="${project.accent}" stroke-opacity=".18" stroke-width="2"/><circle cx="846" cy="520" r="144" fill="none" stroke="${project.accent}" stroke-opacity=".22" stroke-width="2"/><circle cx="846" cy="520" r="98" fill="none" stroke="${project.accent}" stroke-opacity=".28" stroke-width="2"/><path d="M646 520H1024M846 320V720" stroke="${project.accent}" stroke-opacity=".14"/><rect x="76" y="350" width="8" height="190" rx="4" fill="${project.accent}"/>${title}<text x="78" y="640" fill="${project.accent}" font-size="20" font-weight="700" letter-spacing="4">${escapeXml(project.ecosystemLabel)}</text>${desc}<path d="M76 820H948" stroke="#fff" stroke-opacity=".12"/><text x="78" y="900" fill="#f4f7ff" font-size="32" font-weight="700">${escapeXml(project.ticker)}</text><text x="946" y="900" text-anchor="end" fill="#78849b" font-size="20" letter-spacing="3">EXPLORE PROJECT</text><text x="946" y="960" text-anchor="end" fill="#58647a" font-size="18">HORIZONX / ${String(index + 1).padStart(2, "0")}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const PROJECT_IMAGES = WHEEL_PROJECTS.map(projectArtwork);

export default function AxleBloom() {
  const __root = useRef(null);
  const navigate = useNavigate();
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;

  useLayoutEffect(() => {
    if (!document.querySelector('style[data-axle-bloom]')) {
      const tag = document.createElement('style');
      tag.setAttribute('data-axle-bloom', '');
      tag.textContent = CSS;
      document.head.append(tag);
    }
    const __node = __root.current;
    const __q = (sel) => (__node.matches(sel) ? __node : __node.querySelector(sel));
    // Original HorizonX code. Default artwork made for HorizonX. HorizonX Tools License.
    /**
     * Axle Bloom: photo cards hinged on one horizontal axle and spun around it like
     * a rolodex, seen from a quarter turn so every card reads as a parallelogram.
     * Original HorizonX WebGL engine (no third-party code). The motion borrows the
     * idea of Spiral Flux's speed-driven smear and colour fringe, and Tunnel Fold
     * Slider's settle-on-a-card spring; none of their code.
     *
     * Self-contained on purpose: the export builder inlines this file verbatim.
     */

    const TAU = Math.PI * 2;
    // The angle where a card leaves the wheel and the next picture enters: straight
    // away from the camera, behind the axle, where the swap is least visible.
    const SWAP = -Math.PI / 2;
    // How long one smear "exposure" lasts, in seconds. The streak a card point
    // leaves is its speed times this.
    const EXPOSURE = 0.0600001;
    const TEXTURE_SIZE = 1024;
    // The smear takes one picture sample per this many screen pixels of streak, up
    // to MAX_TAPS; the shader loop must stay a literal of the same size.
    const TAP_PX = 2;
    const MAX_TAPS = 24;
    const RESUME_AFTER = 1.4;

    /** Autoplay position after `t` seconds: one card per `interval`, slower at each card. */
    function autoplayOffset(t, interval, pulse) {
      const x = t / interval, k = Math.floor(x), f = x - k;
      return k + f - (pulse * Math.sin(TAU * f)) / TAU;
    }

    /** Autoplay speed in cards per second at `t` (the derivative of autoplayOffset). */
    function autoplaySpeed(t, interval, pulse) {
      const f = t / interval - Math.floor(t / interval);
      return (1 - pulse * Math.cos(TAU * f)) / interval;
    }

    /**
     * How many samples the smear takes for a streak `spanPx` screen pixels long:
     * one at rest, then enough that neighbours sit TAP_PX apart, so the streak
     * reads as one blur instead of stacked copies of the picture.
     */
    function smearTaps(spanPx) {
      const n = Math.ceil((Number.isFinite(spanPx) ? Math.abs(spanPx) : 0) / TAP_PX);
      return Math.min(MAX_TAPS, Math.max(1, n));
    }

    const wrapIndex = (j, length) => ((j % length) + length) % length;

    /**
     * The `count` cards on the wheel at position `p` (in cards). Card j sits at
     * angle (p - j) * step from straight up. Each one gets the picture at
     * `j mod images`; when the picture a card would swap to differs from the one
     * it carries, it fades out over half a step on each side of the swap angle.
     */
    function wheelCards(p, count, images) {
      const step = TAU / count;
      const first = Math.ceil(p + (-SWAP - TAU) / step - 1e-9);
      const swaps = count % images !== 0;
      const cards = [];
      for (let k = 0; k < count; k++) {
        const j = first + k;
        let phi = (p - j) * step;
        // Keep phi inside (SWAP, SWAP + TAU].
        while (phi <= SWAP) phi += TAU;
        while (phi > SWAP + TAU) phi -= TAU;
        const toSwap = Math.min(phi - SWAP, SWAP + TAU - phi);
        const fade = swaps ? smooth(Math.min(1, toSwap / (step * 0.5))) : 1;
        cards.push({ j, phi, image: wrapIndex(j, images), alpha: fade });
      }
      return cards;
    }

    const smooth = (x) => x * x * (3 - 2 * x);

    /** Critically damped spring step toward `target`; exact for any dt. */
    function springStep(p, v, target, omega, dt) {
      const x0 = p - target, e = Math.exp(-omega * dt), c = v + omega * x0;
      return [target + (x0 + c * dt) * e, (v - omega * c * dt) * e];
    }

    /** Pitch-then-yaw rotation as rows, the camera's quarter-turn view of the axle. */
    function viewRotation(yawDeg, pitchDeg) {
      const a = (yawDeg * Math.PI) / 180, b = (pitchDeg * Math.PI) / 180;
      const c = Math.cos(a), s = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b);
      return [
        [c, 0, s],
        [sb * s, cb, -sb * c],
        [-cb * s, sb, cb * c]
      ];
    }

    const VERT = `
    attribute vec2 aUv;
    uniform mat3 uRot;
    uniform float uPhi, uW, uH, uGap, uDist;
    uniform vec2 uScale, uDepth;
    varying vec2 vUv;
    varying vec3 vN, vPos;
    void main() {
      vec3 dir = vec3(0.0, cos(uPhi), sin(uPhi));
      vec3 p = vec3((aUv.x - 0.499999) * uW, 0.0, 0.0) + dir * (uGap + aUv.y * uH);
      vec3 v = uRot * p;
      v.z -= uDist;
      vUv = aUv;
      vN = uRot * vec3(0.0, -sin(uPhi), cos(uPhi));
      vPos = v;
      gl_Position = vec4(v.x * uScale.x, v.y * uScale.y, uDepth.x * v.z + uDepth.y, -v.z);
    }`;

    const FRAG = `
    precision highp float;
    uniform sampler2D uTex;
    uniform float uHasTex, uW, uH, uGap, uRadius, uVel, uSmear, uFringe, uFlare, uSheen, uSeam, uFade, uAlpha, uBgOpaque, uAA, uSide, uTaps, uPx;
    uniform vec3 uBg, uBlank;
    varying vec2 vUv;
    varying vec3 vN, vPos;
    vec3 spectrum(float k) {
      return vec3(smoothstep(-0.7, 0.5, k), 1.0 - min(abs(k) * 1.3, 0.85), smoothstep(0.7, -0.5, k));
    }
    void main() {
      vec2 halfSize = vec2(uW, uH) * 0.5;
      vec2 q = (vUv - 0.5) * vec2(uW, uH);
      float rad = uRadius * min(uW, uH);
      vec2 e = abs(q) - halfSize + rad;
      float d = length(max(e, 0.0)) + min(max(e.x, e.y), 0.0) - rad;
    #ifdef HAS_DERIV
      float aa = max(fwidth(d), 1e-4);
    #else
      float aa = uAA;
    #endif
      float cover = 1.0 - smoothstep(-aa, aa, d);
      if (cover <= 0.001) discard;
      // The back of a card shows its picture the right way round.
      vec2 uv = vec2(gl_FrontFacing ? vUv.x : 1.0 - vUv.x, 1.0 - vUv.y);
      // A point on the card moves along v at angular speed times its radius.
      float s = uVel * (uGap + vUv.y * uH) / uH;
      vec3 col = uBlank;
      if (uHasTex > 0.5) {
        // uTaps samples spread over the streak, shifted per pixel so what is left
        // of the spacing turns into fine grain instead of bands. When even the
        // most taps sit further apart than TAP_PX, each reads a softer mip level.
        // uTaps is a uniform, so the loop exits at the same step on every pixel
        // and the mip lookup inside it stays well defined.
        float span = s * uSmear * 2.0;
        float gapPx = abs(span) * uPx / uTaps;
        float bias = clamp(log2(max(gapPx, 1e-4) / ${TAP_PX}.0), 0.0, 4.0);
        float jit = uTaps < 1.5 ? 0.5 : fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));
        vec3 acc = vec3(0.0), wsum = vec3(0.0);
        for (int i = 0; i < ${MAX_TAPS}; i++) {
          if (float(i) >= uTaps) break;
          float k = (float(i) + jit) / uTaps - 0.5;
          vec3 w = mix(vec3(1.0), spectrum(k * 2.0), uFringe);
          acc += texture2D(uTex, uv + vec2(0.0, span * k), bias).rgb * w;
          wsum += w;
        }
        col = acc / wsum;
      }
      vec3 n = normalize(vN);
      if (!gl_FrontFacing) n = -n;
      vec3 V = normalize(-vPos);
      vec3 L = normalize(vec3(-0.45, 0.65, 0.6));
      vec3 Hv = normalize(L + V);
      float nh = max(dot(n, Hv), 0.0);
      col *= 0.86 + 0.14 * max(dot(n, L), 0.0);
      col += uSheen * (0.5 * pow(nh, 60.0) + 0.07 * pow(nh, 6.0));
      // Warm light leaking out of the axle onto the hinge edge.
      col += vec3(1.0, 0.8, 0.5) * exp(-(uGap + vUv.y * uH) / 0.035) * uSeam * 0.3;
      // Spectral rim while the wheel turns: blue on one side, amber on the other.
      float speed = clamp(abs(uVel) * 5.0, 0.0, 1.0);
      float rim = exp(d / 0.02);
      vec3 rimCol = mix(vec3(0.31, 0.66, 1.0), vec3(1.0, 0.70, 0.28), mix(vUv.x, 1.0 - vUv.x, uSide));
      col = mix(col, rimCol, clamp(rim * uFlare * speed * 0.6, 0.0, 1.0));
      float a = cover * uAlpha;
      if (uBgOpaque > 0.5) col = mix(col, uBg, uFade);
      else a *= 1.0 - uFade;
      gl_FragColor = vec4(clamp(col, 0.0, 1.0) * a, a);
    }`;

    const SPRITE_VERT = `
    attribute vec2 aUv;
    uniform vec2 uCenter, uAxisX, uAxisY;
    varying vec2 vQ;
    void main() {
      vQ = aUv * 1.99999 - 1.00001;
      gl_Position = vec4(uCenter + vQ.x * uAxisX + vQ.y * uAxisY, 0.0, 1.0);
    }`;

    const SPRITE_FRAG = `
    precision mediump float;
    uniform float uKind, uStrength;
    varying vec2 vQ;
    void main() {
      vec3 col;
      float a;
      if (uKind < 0.5) {
        float r2 = dot(vQ, vQ);
        a = exp(-r2 * 3.2) * smoothstep(1.0, 0.55, sqrt(r2)) * uStrength;
        col = vec3(0.0);
      } else {
        float x = vQ.y, core = exp(-x * x * 40.0), glow = exp(-x * x * 4.0);
        a = (core * 0.95 + glow * 0.3) * smoothstep(1.0, 0.72, abs(vQ.x)) * uStrength;
        col = mix(vec3(0.95, 0.66, 0.3), vec3(1.0, 0.97, 0.9), core);
      }
      a = clamp(a, 0.0, 1.0);
      gl_FragColor = vec4(col * a, a);
    }`;

    function hexRgb(hex) {
      const h = String(hex).replace('#', '');
      const full = h.length === 3 ? h.replace(/./g, (c) => c + c) : h;
      const n = parseInt(full, 16);
      return Number.isFinite(n) && full.length === 6 ? [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255] : [0.924999, 0.925001, 0.925];
    }

    function compile(gl, type, source) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) || 'shader');
      return shader;
    }

    function program(gl, vert, frag, names) {
      const prog = gl.createProgram();
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, vert));
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, frag));
      gl.bindAttribLocation(prog, 0, 'aUv');
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) || 'link');
      const u = {};
      for (const name of names) u[name] = gl.getUniformLocation(prog, name);
      return { prog, u };
    }

    function createAxleBloom(root, initial, onSelect) {
      const canvas = root.querySelector('.ab-canvas');
      const live = root.querySelector('.ab-live');
      const reduced = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null;
      let config = { ...initial };
      let gl = null, cardProg = null, spriteProg = null, quad = null, deriv = false, aniso = null, maxAniso = 1;
      // Builds the programs and buffer; runs again after a lost context comes back.
      function setup() {
        try {
          gl = canvas.getContext('webgl', { alpha: true, antialias: true, premultipliedAlpha: true });
          if (gl) {
            deriv = !!gl.getExtension('OES_standard_derivatives');
            aniso = gl.getExtension('EXT_texture_filter_anisotropic') || gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic');
            if (aniso) maxAniso = Math.min(8, gl.getParameter(aniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT) || 1);
            const head = deriv ? '#extension GL_OES_standard_derivatives : enable\n#define HAS_DERIV 1\n' : '';
            cardProg = program(gl, VERT, head + FRAG, ['uRot', 'uPhi', 'uW', 'uH', 'uGap', 'uDist', 'uScale', 'uDepth', 'uTex', 'uHasTex',
              'uRadius', 'uVel', 'uSmear', 'uFringe', 'uFlare', 'uSheen', 'uSeam', 'uFade', 'uAlpha', 'uBgOpaque', 'uAA', 'uSide', 'uTaps', 'uPx', 'uBg', 'uBlank']);
            spriteProg = program(gl, SPRITE_VERT, SPRITE_FRAG, ['uCenter', 'uAxisX', 'uAxisY', 'uKind', 'uStrength']);
            quad = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, quad);
            // Counter-clockwise in (u, v), so the side the normal points to is the front.
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 1, 1, 0, 0, 1, 1, 0, 1]), gl.STATIC_DRAW);
          }
        } catch {
          gl = null;
        }
      }
      setup();

      // Motion state, in cards: `p` is where the wheel is, `v` how fast it turns.
      let p = 0, v = 0, target = 0, mode = 'auto', autoBase = 0, autoT = 0;
      let idle = RESUME_AFTER, wheelSnap = 0, drag = null, last = 0, raf = 0, visible = true, destroyed = false;
      let held = 0, announced = null;
      let width = 0, height = 0, dpr = 1;
      const textures = new Map();
      let croppedAspect = 0;

      const direction = () => (config.direction === 'up' ? -1 : 1);
      const autoplayOn = () => config.autoplay && !(reduced && reduced.matches);
      const loaded = () => config.images.every((src) => textures.get(src)?.state !== 'loading');

      function texture(src) {
        let entry = textures.get(src);
        if (entry) return entry;
        entry = { state: 'loading', tex: null, img: new Image() };
        textures.set(src, entry);
        if (/^https?:/i.test(src)) entry.img.crossOrigin = 'anonymous';
        entry.img.decoding = 'async';
        entry.img.onload = () => {
          if (destroyed) return;
          entry.state = 'ready';
          upload(entry);
          markLoaded();
          wake();
        };
        entry.img.onerror = () => { entry.state = 'failed'; markLoaded(); wake(); };
        entry.img.src = src;
        return entry;
      }

      // Each picture is cover-cropped to the card ratio on a square power-of-two
      // canvas, so it gets mipmaps and stays crisp at the steep angles.
      function upload(entry) {
        if (!gl || entry.state !== 'ready') return;
        const aspect = config.aspect;
        const pad = document.createElement('canvas');
        pad.width = pad.height = TEXTURE_SIZE;
        const ctx = pad.getContext('2d');
        const iw = entry.img.naturalWidth, ih = entry.img.naturalHeight;
        let sw = iw, sh = iw / aspect;
        if (sh > ih) { sh = ih; sw = ih * aspect; }
        ctx.drawImage(entry.img, (iw - sw) / 2, (ih - sh) / 2, sw, sh, 0, 0, TEXTURE_SIZE, TEXTURE_SIZE);
        try {
          entry.tex = entry.tex || gl.createTexture();
          gl.bindTexture(gl.TEXTURE_2D, entry.tex);
          gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, pad);
          gl.generateMipmap(gl.TEXTURE_2D);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          if (aniso) gl.texParameterf(gl.TEXTURE_2D, aniso.TEXTURE_MAX_ANISOTROPY_EXT, maxAniso);
        } catch {
          // A cross-origin picture without CORS cannot be read; the card stays blank.
          entry.state = 'failed';
        }
      }

      function markLoaded() {
        if (loaded()) root.setAttribute('data-ab-loaded', '');
      }

      function syncTextures() {
        root.removeAttribute('data-ab-loaded');
        for (const src of config.images) texture(src);
        if (croppedAspect !== config.aspect) {
          croppedAspect = config.aspect;
          for (const entry of textures.values()) upload(entry);
        }
        markLoaded();
      }

      function resize() {
        const box = root.getBoundingClientRect();
        dpr = Math.min(2, window.devicePixelRatio || 1);
        width = Math.max(1, Math.round(box.width * dpr));
        height = Math.max(1, Math.round(box.height * dpr));
        if (canvas.width !== width || canvas.height !== height) {
          canvas.width = width;
          canvas.height = height;
        }
        wake();
      }

      function camera() {
        const rows = viewRotation(config.yaw, config.pitch);
        const H = 1, W = config.aspect, R = config.gap + H;
        const dist = config.depth;
        const fill = 0.740001 * (config.size / 100);
        const f = (fill * dist) / R;
        const minDim = Math.min(width, height);
        const scale = [(f * minDim) / width, (f * minDim) / height];
        const near = Math.max(0.0500001, dist - 2.50001 * R), far = dist + 2.50001 * R;
        const depth = [-(far + near) / (far - near), (-2 * far * near) / (far - near)];
        const project = (x, y, z) => {
          const vx = rows[0][0] * x + rows[0][1] * y + rows[0][2] * z;
          const vy = rows[1][0] * x + rows[1][1] * y + rows[1][2] * z;
          const vz = rows[2][0] * x + rows[2][1] * y + rows[2][2] * z - dist;
          return [(vx * scale[0]) / -vz, (vy * scale[1]) / -vz, vz];
        };
        return { rows, H, W, R, dist, scale, depth, project, minDim };
      }

      function drawSprite(kind, center, axisX, axisY, strength) {
        const { u } = spriteProg;
        gl.useProgram(spriteProg.prog);
        gl.uniform2fv(u.uCenter, center);
        gl.uniform2fv(u.uAxisX, axisX);
        gl.uniform2fv(u.uAxisY, axisY);
        gl.uniform1f(u.uKind, kind);
        gl.uniform1f(u.uStrength, strength);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }

      function render() {
        if (!gl || gl.isContextLost()) return;
        const cam = camera();
        const { rows, H, W, dist, scale, depth, project, minDim } = cam;
        gl.viewport(0, 0, width, height);
        gl.clearColor(0, 0, 0, 0);
        gl.clearDepth(1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.bindBuffer(gl.ARRAY_BUFFER, quad);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.disable(gl.CULL_FACE);

        // Soft contact shadow on the floor under the wheel.
        gl.disable(gl.DEPTH_TEST);
        const ndcPx = [2 / width, 2 / height];
        const unit = (scale[1] * height) / 2 / dist; // px per world unit at the axle
        if (config.shadow > 0) {
          const c = project(0, -(cam.R * 1.22), 0);
          drawSprite(0, [c[0], c[1]], [unit * 0.949999 * ndcPx[0], 0], [0, unit * 0.110001 * ndcPx[1]], config.shadow * 0.320001);
        }

        const omega = v * (TAU / config.cards);
        const vel = Math.max(-0.350001, Math.min(0.350001, omega * EXPOSURE)) * (reduced?.matches ? 0 : 1);
        const cards = wheelCards(p, config.cards, config.images.length).map((card) => {
          const mid = config.gap + H / 2;
          const y = Math.cos(card.phi) * mid, z = Math.sin(card.phi) * mid;
          const vz = rows[2][1] * y + rows[2][2] * z;
          return { ...card, vz, back: Math.max(0, Math.min(1, -vz / mid)) };
        }).sort((a, b) => a.vz - b.vz);

        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.depthMask(true);
        const { u } = cardProg;
        gl.useProgram(cardProg.prog);
        const m = rows;
        gl.uniformMatrix3fv(u.uRot, false, [m[0][0], m[1][0], m[2][0], m[0][1], m[1][1], m[2][1], m[0][2], m[1][2], m[2][2]]);
        gl.uniform1f(u.uW, W);
        gl.uniform1f(u.uH, H);
        gl.uniform1f(u.uGap, config.gap);
        gl.uniform1f(u.uDist, dist);
        gl.uniform2fv(u.uScale, scale);
        gl.uniform2fv(u.uDepth, depth);
        gl.uniform1f(u.uRadius, config.radius);
        gl.uniform1f(u.uVel, vel);
        // The fastest point is the outer edge; its streak in pixels sets the taps.
        gl.uniform1f(u.uTaps, smearTaps(Math.abs(vel) * ((config.gap + H) / H) * config.smear * 2 * unit));
        gl.uniform1f(u.uPx, unit);
        gl.uniform1f(u.uSmear, config.smear);
        gl.uniform1f(u.uFringe, config.fringe);
        gl.uniform1f(u.uFlare, config.flare);
        gl.uniform1f(u.uSheen, config.sheen);
        gl.uniform1f(u.uSeam, config.seam);
        gl.uniform1f(u.uAA, 1.50001 / Math.max(1, unit * dpr * 0.2));
        gl.uniform1f(u.uSide, config.yaw < 0 ? 0 : 1);
        const opaque = config.background !== 'transparent';
        gl.uniform1f(u.uBgOpaque, opaque ? 1 : 0);
        gl.uniform3fv(u.uBg, opaque ? hexRgb(config.background) : [0, 0, 0]);
        gl.uniform3fv(u.uBlank, [0.819999, 0.820001, 0.820001]);
        gl.uniform1i(u.uTex, 0);
        gl.activeTexture(gl.TEXTURE0);
        for (const card of cards) {
          if (card.alpha <= 0.000999999) continue;
          const entry = textures.get(config.images[card.image]);
          const ready = entry?.state === 'ready' && entry.tex;
          if (ready) gl.bindTexture(gl.TEXTURE_2D, entry.tex);
          gl.uniform1f(u.uHasTex, ready ? 1 : 0);
          gl.uniform1f(u.uPhi, card.phi);
          gl.uniform1f(u.uAlpha, card.alpha);
          gl.uniform1f(u.uFade, config.backFade * card.back * card.back);
          gl.drawArrays(gl.TRIANGLES, 0, 6);
        }

        // The glowing seam along the axle, brighter while it turns.
        if (config.seam > 0) {
          gl.disable(gl.DEPTH_TEST);
          const a = project(-W / 2, 0, 0), b = project(W / 2, 0, 0);
          const ax = [(b[0] - a[0]) / 2 * 1.06, (b[1] - a[1]) / 2 * 1.06001];
          const px = [ax[0] / ndcPx[0], ax[1] / ndcPx[1]];
          const len = Math.hypot(px[0], px[1]) || 1;
          const thick = Math.max(1.49999, minDim * 0.00600001);
          const ay = [(-px[1] / len) * thick * ndcPx[0], (px[0] / len) * thick * ndcPx[1]];
          const speed = Math.min(1, Math.abs(omega) / 2);
          drawSprite(1, [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], ax, ay, config.seam * (0.699999 + 0.3 * speed));
        }
        const allTexturesReady = config.images.every((src) => {
          const entry = textures.get(src);
          return entry?.state === 'ready' && !!entry.tex;
        });
        root.toggleAttribute('data-ready', allTexturesReady);
      }

      function announce() {
        if (!live || drag) return;
        const index = wrapIndex(Math.round(p), config.images.length);
        if (index === announced) return;
        announced = index;
        if (mode !== 'auto') live.textContent = `Photo ${index + 1} of ${config.images.length}`;
      }

      function advance(dt) {
        if (mode === 'auto') {
          if (!autoplayOn()) {
            mode = 'spring';
            target = Math.round(p);
          } else {
            // Hold the wheel still until the pictures are in, at most 1.5s.
            if (loaded() || held > 1.49999) autoT += dt;
            else held += dt;
            p = autoBase + direction() * autoplayOffset(autoT, config.interval, config.pulse);
            v = direction() * autoplaySpeed(autoT, config.interval, config.pulse);
            return true;
          }
        }
        if (mode === 'drag') return true;
        idle += dt;
        if (wheelSnap > 0) {
          wheelSnap -= dt;
          if (wheelSnap <= 0) target = Math.round(target);
        }
        if (reduced?.matches) {
          p = target;
          v = 0;
        } else {
          [p, v] = springStep(p, v, target, config.smoothing, dt);
        }
        const settled = Math.abs(p - target) < 1e-3 && Math.abs(v) < 1e-2 && wheelSnap <= 0;
        if (settled) {
          p = target;
          v = 0;
          announce();
          if (autoplayOn() && idle >= RESUME_AFTER) {
            mode = 'auto';
            autoBase = target;
            autoT = 0;
            return true;
          }
          return autoplayOn();
        }
        return true;
      }

      function frame(now) {
        raf = 0;
        if (destroyed) return;
        const dt = last ? Math.min(0.05, Math.max(0, (now - last) / 1000)) : 0;
        last = now;
        const moving = advance(dt);
        render();
        if (moving && visible) raf = requestAnimationFrame(frame);
        else last = 0;
      }

      function wake() {
        if (!raf && !destroyed && visible) raf = requestAnimationFrame(frame);
      }

      function takeOver() {
        if (mode === 'auto') {
          mode = 'spring';
          target = p;
        }
        idle = 0;
      }

      function stepBy(n) {
        takeOver();
        target = Math.round(target) + n;
        wheelSnap = 0;
        wake();
      }

      // Px of drag that turns the wheel by one card.
      const stride = () => Math.max(60, (Math.min(width, height) / dpr) * 0.32) / config.sensitivity;

      // Project each card's four corners through the same camera transform used by
      // WebGL. This lets pointer selection follow the visible 3D card rather than
      // relying on the wheel's approximate current index.
      function pickProject(clientX, clientY) {
        const rect = root.getBoundingClientRect();
        if (!rect.width || !rect.height) return null;
        const point = [
          ((clientX - rect.left) / rect.width) * 2 - 1,
          1 - ((clientY - rect.top) / rect.height) * 2,
        ];
        const cam = camera();
        const candidates = wheelCards(p, config.cards, config.images.length);
        let picked = null;
        let nearestDepth = -Infinity;

        const contains = (polygon) => {
          let inside = false;
          for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
            const a = polygon[i], b = polygon[j];
            const crosses = ((a[1] > point[1]) !== (b[1] > point[1])) &&
              (point[0] < ((b[0] - a[0]) * (point[1] - a[1])) / ((b[1] - a[1]) || 1e-9) + a[0]);
            if (crosses) inside = !inside;
          }
          return inside;
        };

        for (const card of candidates) {
          if (card.alpha < 0.04) continue;
          const near = config.gap;
          const far = config.gap + 1;
          const c = Math.cos(card.phi), z = Math.sin(card.phi);
          const polygon = [
            cam.project(-cam.W / 2, c * near, z * near),
            cam.project(cam.W / 2, c * near, z * near),
            cam.project(cam.W / 2, c * far, z * far),
            cam.project(-cam.W / 2, c * far, z * far),
          ].map(([x, y]) => [x, y]);
          if (!contains(polygon)) continue;
          const depth = cam.project(0, c * (config.gap + 0.5), z * (config.gap + 0.5))[2];
          if (depth > nearestDepth) {
            nearestDepth = depth;
            picked = card.image;
          }
        }
        return picked;
      }

      function selectProjectAt(clientX, clientY) {
        const index = pickProject(clientX, clientY);
        if (index !== null && typeof onSelect === 'function') onSelect(index);
      }

      function onPointerDown(event) {
        if (!config.draggable || event.button !== 0) return;
        root.removeAttribute('data-card-hover');
        takeOver();
        mode = 'drag';
        drag = { id: event.pointerId, x: event.clientX, y: event.clientY, p, t: event.timeStamp, samples: [], moved: false };
        root.setPointerCapture?.(event.pointerId);
        root.setAttribute('data-dragging', '');
        wake();
      }

      function onPointerMove(event) {
        if (!drag) {
          const hit = pickProject(event.clientX, event.clientY);
          root.toggleAttribute('data-card-hover', hit !== null);
          return;
        }
        if (event.pointerId !== drag.id) return;
        if (Math.hypot(event.clientX - drag.x, event.clientY - drag.y) > 6) drag.moved = true;
        // Down (or left) rolls the front cards toward the viewer.
        const delta = (event.clientY - drag.y - (event.clientX - drag.x) * 0.599999) / stride();
        const next = drag.p + delta;
        drag.samples.push([event.timeStamp, next]);
        while (drag.samples.length > 2 && event.timeStamp - drag.samples[0][0] > 90) drag.samples.shift();
        const [t0, p0] = drag.samples[0];
        const span = (event.timeStamp - t0) / 1000;
        if (span > 0.004) v = (next - p0) / span;
        p = next;
        wake();
      }

      function onPointerUp(event) {
        if (!drag || event.pointerId !== drag.id) return;
        root.releasePointerCapture?.(event.pointerId);
        root.removeAttribute('data-dragging');
        const quiet = event.timeStamp - (drag.samples.at(-1)?.[0] ?? drag.t) > 90;
        if (quiet) v = 0;
        const wasClick = !drag.moved && event.type !== 'pointercancel';
        drag = null;
        mode = 'spring';
        idle = 0;
        const throwCards = Math.max(-config.cards, Math.min(config.cards, v * 0.219999));
        target = Math.round(p + throwCards);
        if (wasClick) selectProjectAt(event.clientX, event.clientY);
        wake();
      }

      function onWheel(event) {
        if (config.wheel === 'off') return;
        const horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY);
        if (config.wheel === 'horizontal' && !horizontal) return;
        event.preventDefault();
        const px = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? 400 : 1;
        const delta = (horizontal ? -event.deltaX : event.deltaY) * px;
        takeOver();
        target += (delta / stride()) * 0.699999;
        wheelSnap = 0.159999;
        wake();
      }

      function onKey(event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          const rect = root.getBoundingClientRect();
          selectProjectAt(rect.left + rect.width / 2, rect.top + rect.height / 2);
          return;
        }
        const forward = ['ArrowDown', 'ArrowRight', 'PageDown'].includes(event.key);
        const back = ['ArrowUp', 'ArrowLeft', 'PageUp'].includes(event.key);
        if (!forward && !back) return;
        event.preventDefault();
        stepBy(forward ? 1 : -1);
      }

      root.addEventListener('pointerdown', onPointerDown);
      root.addEventListener('pointermove', onPointerMove);
      const onPointerLeave = () => root.removeAttribute('data-card-hover');
      root.addEventListener('pointerleave', onPointerLeave);
      root.addEventListener('pointerup', onPointerUp);
      root.addEventListener('pointercancel', onPointerUp);
      root.addEventListener('wheel', onWheel, { passive: false });
      root.addEventListener('keydown', onKey);
      const onMotion = () => wake();
      reduced?.addEventListener?.('change', onMotion);
      const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(resize) : null;
      ro?.observe(root);
      const io = typeof IntersectionObserver === 'function'
        ? new IntersectionObserver((entries) => {
          visible = entries.some((entry) => entry.isIntersecting);
          if (visible) wake();
        })
        : null;
      io?.observe(root);
      const onLost = (event) => { event.preventDefault(); root.removeAttribute('data-ready'); };
      canvas.addEventListener('webglcontextlost', onLost);
      // The GPU dropped everything: rebuild the programs and upload the pictures again.
      const onRestored = () => {
        setup();
        for (const entry of textures.values()) { entry.tex = null; upload(entry); }
        wake();
      };
      canvas.addEventListener('webglcontextrestored', onRestored);

      function apply(next) {
        config = { ...next };
        root.toggleAttribute('data-draggable', !!config.draggable);
        root.toggleAttribute('data-preview', !!config.preview);
        if (!autoplayOn() && mode === 'auto') { mode = 'spring'; target = Math.round(p); }
        if (autoplayOn() && mode === 'spring' && idle >= RESUME_AFTER) { mode = 'auto'; autoBase = Math.round(p); autoT = 0; }
        if (gl) syncTextures();
        else root.setAttribute('data-ab-loaded', '');
        announced = null;
        wake();
      }

      apply(config);
      resize();

      return {
        update(next) { apply(next); },
        /** Puts the autoplay at an exact moment from rest. The thumbnail recorder uses it. */
        seek(seconds) {
          mode = autoplayOn() ? 'auto' : 'spring';
          autoBase = 0;
          autoT = Math.max(0, seconds);
          held = 2;
          if (mode === 'auto') {
            p = direction() * autoplayOffset(autoT, config.interval, config.pulse);
            v = direction() * autoplaySpeed(autoT, config.interval, config.pulse);
          }
          else { p = target = 0; v = 0; }
          render();
          wake();
        },
        destroy() {
          destroyed = true;
          if (raf) cancelAnimationFrame(raf);
          root.removeEventListener('pointerdown', onPointerDown);
          root.removeEventListener('pointermove', onPointerMove);
          root.removeEventListener('pointerleave', onPointerLeave);
          root.removeEventListener('pointerup', onPointerUp);
          root.removeEventListener('pointercancel', onPointerUp);
          root.removeEventListener('wheel', onWheel);
          root.removeEventListener('keydown', onKey);
          reduced?.removeEventListener?.('change', onMotion);
          canvas.removeEventListener('webglcontextlost', onLost);
          canvas.removeEventListener('webglcontextrestored', onRestored);
          ro?.disconnect();
          io?.disconnect();
          if (gl) {
            for (const entry of textures.values()) if (entry.tex) gl.deleteTexture(entry.tex);
            if (cardProg?.prog) gl.deleteProgram(cardProg.prog);
            if (spriteProg?.prog) gl.deleteProgram(spriteProg.prog);
            if (quad) gl.deleteBuffer(quad);
          }
          textures.clear();
        }
      };
    }

    const wheel = createAxleBloom(__q('.ab-root'), {
      "viewportWidth": 1280,
      "viewportHeight": 800,
      "cards": 5,
      "aspect": 1,
      "radius": 0.075,
      "size": 100,
      "yaw": -37,
      "pitch": 10,
      "depth": 5.30001,
      "gap": 0.0349999,
      "interval": 1.5,
      "pulse": 0.800001,
      "smoothing": 8,
      "sensitivity": 1,
      "sheen": 0.45,
      "seam": 1.35001,
      "shadow": 0.749999,
      "backFade": 0.12,
      "smear": 0,
      "fringe": 0,
      "flare": 1,
      "images": PROJECT_IMAGES,
      "background": "transparent",
      "ink": "#f4f7ff",
      "autoplay": true,
      "direction": "down",
      "wheel": "both",
      "draggable": true,
      "preview": false,
      "cornerControl": false
    }, (projectIndex) => {
      const project = WHEEL_PROJECTS[projectIndex];
      if (project) navigateRef.current(`/projects/${project.id}`);
    });
    const dispose = () => { wheel.destroy(); window.removeEventListener('pagehide', dispose); };
    window.addEventListener('pagehide', dispose, { once: true });
    return dispose;
  }, []);

  return (
    <main ref={__root} className="ab-export">
      <div className="ab-frame" style={{ "--ab-w": "1280px", "--ab-h": "800px", "--ab-bg": "transparent", "--ab-ink": "#f4f7ff", "--ab-aspect": "1" } as React.CSSProperties}>
        <div className="ab-root" tabIndex={0} role="region" aria-roledescription="carousel" aria-label="HorizonX project wheel. Click a visible card to open its project, drag or scroll to browse, or press Enter to open the front card.">
          <canvas className="ab-canvas" aria-hidden="true" />
          <div className="ab-fallback" role="list">
            {PROJECT_IMAGES.map((src, index) => (
              <img key={WHEEL_PROJECTS[index].id} role="listitem" src={src} alt={`${WHEEL_PROJECTS[index].name}: ${WHEEL_PROJECTS[index].description}`} draggable={false} />
            ))}
          </div>
          <span className="ab-live" aria-live="polite" aria-atomic="true" />
        </div>
      </div>
    </main>
  );
}
