"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

export interface CurveSlide {
  kind?: "image" | "video";
  url?: string;
  src?: string;
  pictureUrl?: string;
  picture?: { src?: string; alt?: string } | string;
  clip?: string;
  clipUrl?: string;
  href?: string;
  alt?: string;
  caption?: string;
}

export interface FrameConfig {
  heightPct: number;
  heightCap: number;
  fit: "fixed" | "natural";
  ratio: number;
  spacing: number;
  corner: number;
  anchor: number;
  offset: number;
  centreSmall: boolean;
}

export interface CurveConfig {
  flatPct: number;
  edgeScale: number;
  speedFlare: number;
  fringe: number;
  fringeOuter: string;
  fringeInner: string;
  split: number;
}

export interface DriveConfig {
  drag: number;
  glide: number;
  wheel: "none" | "sideways" | "any";
  wheelGain: number;
  autoplay: number;
  holdOnHover: boolean;
  keys: boolean;
}

export interface RevealConfig {
  mode: "lift" | "slide" | "dissolve" | "off";
  time: number;
  gap: number;
  wait: number;
  repeat: boolean;
}

export interface PressConfig {
  behaviour: "focus" | "follow";
  newTab: boolean;
}

export interface BackdropConfig {
  fill: string;
  grid: boolean;
  gridTint: string;
}

export interface CurveFlowCarouselProps {
  slides?: (string | CurveSlide)[];
  frame?: Partial<FrameConfig>;
  curve?: Partial<CurveConfig>;
  drive?: Partial<DriveConfig>;
  reveal?: Partial<RevealConfig>;
  press?: Partial<PressConfig>;
  backdrop?: Partial<BackdropConfig>;
  className?: string;
  style?: React.CSSProperties;
}

const FRAME_DEFAULTS: FrameConfig = {
  heightPct: 52,
  heightCap: 560,
  fit: "fixed",
  ratio: 1.7,
  spacing: 20,
  corner: 14,
  anchor: 50,
  offset: 0,
  centreSmall: true,
};

const CURVE_DEFAULTS: CurveConfig = {
  flatPct: 40,
  edgeScale: 1.85,
  speedFlare: 1,
  fringe: 1,
  fringeOuter: "rgba(160, 197, 246, 0.6)",
  fringeInner: "rgba(244, 199, 146, 0.45)",
  split: 1,
};

const DRIVE_DEFAULTS: DriveConfig = {
  drag: 1,
  glide: 0.38,
  wheel: "sideways",
  wheelGain: 1,
  autoplay: 0,
  holdOnHover: true,
  keys: true,
};

const REVEAL_DEFAULTS: RevealConfig = {
  mode: "lift",
  time: 0.8,
  gap: 0.07,
  wait: 0.15,
  repeat: false,
};

const PRESS_DEFAULTS: PressConfig = {
  behaviour: "focus",
  newTab: false,
};

const BACKDROP_DEFAULTS: BackdropConfig = {
  fill: "transparent",
  grid: false,
  gridTint: "rgba(0, 0, 0, 0.08)",
};

export interface SettleResult {
  slides: (string | CurveSlide)[];
  frame: FrameConfig;
  curve: CurveConfig;
  drive: DriveConfig;
  reveal: RevealConfig;
  press: PressConfig;
  backdrop: BackdropConfig;
  style?: React.CSSProperties;
  className?: string;
}

function settle(p: CurveFlowCarouselProps): SettleResult {
  return {
    slides: p.slides && p.slides.length > 0 ? p.slides : [],
    frame: Object.assign({}, FRAME_DEFAULTS, p.frame),
    curve: Object.assign({}, CURVE_DEFAULTS, p.curve),
    drive: Object.assign({}, DRIVE_DEFAULTS, p.drive),
    reveal: Object.assign({}, REVEAL_DEFAULTS, p.reveal),
    press: Object.assign({}, PRESS_DEFAULTS, p.press),
    backdrop: Object.assign({}, BACKDROP_DEFAULTS, p.backdrop),
    style: p.style,
    className: p.className,
  };
}

function assetUrl(a: unknown): string {
  if (!a) return "";
  if (typeof a === "string") return a.trim();
  if (typeof a === "object" && a !== null && "src" in a) return String((a as { src?: string }).src || "").trim();
  return "";
}

function resolveSlide(s: string | CurveSlide, n: number) {
  if (typeof s === "string") {
    return { motion: false, url: s.trim(), href: "", caption: `Slide ${n + 1}` };
  }
  const motion = s.kind === "video";
  const url = motion
    ? (s.clip || s.clipUrl || "").trim()
    : assetUrl(s.picture) || (s.pictureUrl || s.url || s.src || "").trim();
  const alt = s.picture && typeof s.picture === "object" ? s.picture.alt : s.alt || undefined;
  return { motion, url, href: (s.href || "").trim(), caption: alt || `Slide ${n + 1}` };
}

const clampTo = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);
const wrap = (v: number, m: number) => ((v % m) + m) % m;
const QUARTER_TURN = Math.PI / 2;

function swellAt(x: number, view: number, flat: number, flare: number) {
  const hw = view * 0.5;
  const reach = Math.abs(x - hw) / hw;
  const t = clampTo((reach - flat) / Math.max(1 - flat, 0.001), 0, 2);
  return 1 + flare * (1 - Math.cos(t * QUARTER_TURN));
}

const toRgba = (() => {
  const shelf: Record<string, number[]> = {};
  let shelved = 0;
  let pen: CanvasRenderingContext2D | null = null;
  return (input: string): number[] => {
    if (!input || input === "transparent") return [0, 0, 0, 0];
    const cached = shelf[input];
    if (cached) return cached;
    let css = input || "transparent";
    const token = css.match(/var\([^,]+,\s*(.+)\)\s*$/);
    if (token) css = token[1];
    if (!pen && typeof document !== "undefined") {
      pen = document.createElement("canvas").getContext("2d");
    }
    let out = [0, 0, 0, 0];
    if (pen) {
      pen.fillStyle = "#000000";
      pen.fillStyle = css;
      const norm = String(pen.fillStyle);
      if (norm[0] === "#") {
        out = [
          parseInt(norm.slice(1, 3), 16) / 255,
          parseInt(norm.slice(3, 5), 16) / 255,
          parseInt(norm.slice(5, 7), 16) / 255,
          1,
        ];
      } else {
        const n = norm.match(/[\d.]+/g) || [];
        out = [
          Number(n[0] || 0) / 255,
          Number(n[1] || 0) / 255,
          Number(n[2] || 0) / 255,
          n[3] !== undefined ? Number(n[3]) : 1,
        ];
      }
    }
    if (++shelved > 64) {
      for (const k in shelf) delete shelf[k];
      shelved = 1;
    }
    shelf[input] = out;
    return out;
  };
})();

/* ---------------- WebGL Shaders ---------------- */
const PLATE_VERTEX = `
attribute vec2 aCorner;
uniform vec4 uBox;
uniform vec2 uView;
varying vec2 vPx;
void main() {
  vPx = mix(uBox.xy, uBox.zw, aCorner);
  vec2 c = vPx / uView * 2.0 - 1.0;
  gl_Position = vec4(c.x, -c.y, 0.0, 1.0);
}`;

const CARD_FRAGMENT = `
precision highp float;
varying vec2 vPx;
uniform vec2 uView;
uniform float uDpr;
uniform vec4 uCard;
uniform float uMid;
uniform float uFlat;
uniform float uFlare;
uniform float uCorner;
uniform float uAlpha;
uniform float uShift;
uniform float uFringe;
uniform vec4 uRimOut;
uniform vec4 uRimIn;
uniform sampler2D uImg;
uniform vec2 uImgSize;

void main() {
  float hw = uView.x * 0.5;
  float span = max(1.0 - uFlat, 0.001);
  float t = clamp((abs(vPx.x - hw) / hw - uFlat) / span, 0.0, 2.0);
  float k = 1.0 + uFlare * (1.0 - cos(t * 1.5707963));
  float live = step(0.0001, t) * step(t, 1.9999);
  float dk = uFlare * 1.5707963 * sin(t * 1.5707963) * live / (hw * span);
  float slope = uCard.w * 0.5 * dk;
  float squash = k / sqrt(1.0 + slope * slope);

  vec2 local = vec2(vPx.x - uCard.x, uMid + (vPx.y - uMid) / k - uCard.y);
  vec2 hs = uCard.zw * 0.5;
  float r = min(uCorner, min(hs.x, hs.y));
  vec2 past = abs(local - hs) - hs + r;
  float outsideD = length(max(past, vec2(0.0)));
  float insideD = min(max(past.x, past.y), 0.0);
  float edgeDist = outsideD + insideD - r;
  float onScreen = edgeDist * (past.y > past.x ? squash : 1.0);
  float a = clamp(0.5 - onScreen * uDpr, 0.0, 1.0) * uAlpha;
  if (a < 0.003) discard;

  vec2 st = local / uCard.zw;
  float boxR = uCard.z / uCard.w;
  float imgR = uImgSize.x / max(uImgSize.y, 1.0);
  vec2 crop = boxR > imgR ? vec2(1.0, imgR / boxR) : vec2(boxR / imgR, 1.0);
  vec2 uv = clamp((st - 0.5) * crop + 0.5, 0.001, 0.999);
  vec3 col = texture2D(uImg, uv).rgb;
  if (uShift > 0.0002) {
    vec2 nudge = vec2(uShift, 0.0);
    vec4 ahead = texture2D(uImg, clamp(uv + nudge, 0.001, 0.999));
    vec4 behind = texture2D(uImg, clamp(uv - nudge, 0.001, 0.999));
    col = vec3(ahead.r, col.g, behind.b);
  }

  float rim = min(local.y, uCard.w - local.y) * squash;
  float weight = smoothstep(0.0, 0.4, t) * uFringe;
  float outer = 1.0 - smoothstep(2.4, 3.6, rim);
  float inner = smoothstep(2.6, 3.8, rim) * (1.0 - smoothstep(5.0, 6.4, rim));
  col = mix(col, uRimIn.rgb, clamp(inner * weight * uRimIn.a, 0.0, 1.0));
  col = mix(col, uRimOut.rgb, clamp(outer * weight * uRimOut.a, 0.0, 1.0));

  gl_FragColor = vec4(col * a, a);
}`;

const FLOOR_FRAGMENT = `
precision highp float;
varying vec2 vPx;
uniform vec2 uView;
uniform float uHorizon;
uniform float uDrift;
uniform float uAlpha;
uniform vec4 uTint;

void main() {
  float below = vPx.y - uHorizon;
  if (below <= 1.0) discard;
  float reach = uView.y * 0.7 / below;
  float gx = (vPx.x - uView.x * 0.5) * reach / uView.y * 6.0 + uDrift;
  float gz = reach;
  float pxX = min(fract(gx), 1.0 - fract(gx)) / max(reach / uView.y * 6.0, 0.00001);
  float pxZ = min(fract(gz), 1.0 - fract(gz)) / max(uView.y * 0.7 / (below * below), 0.00001);
  float line = max(1.0 - smoothstep(0.3, 1.0, pxX), 1.0 - smoothstep(0.3, 1.0, pxZ));
  float edge = abs(vPx.x / uView.x * 2.0 - 1.0);
  float fade = smoothstep(4.0, uView.y * 0.1, below) * (1.0 - smoothstep(0.55, 1.0, edge));
  float a = uTint.a * line * fade * uAlpha;
  gl_FragColor = vec4(uTint.rgb * a, a);
}`;

const MAX_SIDE = 2048;

function shrink(img: HTMLImageElement): HTMLImageElement | HTMLCanvasElement {
  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const big = Math.max(w, h);
  if (big <= MAX_SIDE) return img;
  const f = MAX_SIDE / big;
  const c = document.createElement("canvas");
  c.width = Math.round(w * f);
  c.height = Math.round(h * f);
  const g = c.getContext("2d");
  if (!g) return img;
  g.drawImage(img, 0, 0, c.width, c.height);
  return c;
}

function fetchImage(url: string): Promise<{ source: TexImageSource; w: number; h: number; clip: null } | null> {
  return new Promise((done) => {
    if (!url) return done(null);
    const img = new Image();
    img.setAttribute("crossorigin", "anonymous");
    img.onload = () => {
      if (!img.naturalWidth) return done(null);
      done({ source: shrink(img), w: img.naturalWidth, h: img.naturalHeight, clip: null });
    };
    img.onerror = () => done(null);
    img.src = url;
  });
}

function fetchVideo(url: string): Promise<{ source: TexImageSource; w: number; h: number; clip: HTMLVideoElement } | null> {
  if (!url) return Promise.resolve(null);
  const v = Object.assign(document.createElement("video"), {
    muted: true,
    loop: true,
    playsInline: true,
    preload: "auto",
  });
  v.setAttribute("crossorigin", "anonymous");
  v.setAttribute("playsinline", "");
  const asPicture = () =>
    v.videoWidth ? { source: v, w: v.videoWidth, h: v.videoHeight, clip: v } : null;
  const ready = new Promise<{ source: TexImageSource; w: number; h: number; clip: HTMLVideoElement } | null>((done) => {
    v.onloadeddata = () => done(asPicture());
    v.onerror = () => done(null);
  });
  const late = new Promise<{ source: TexImageSource; w: number; h: number; clip: HTMLVideoElement } | null>((done) =>
    window.setTimeout(() => done(asPicture()), 5000)
  );
  v.src = url;
  return Promise.race([ready, late]);
}

function makeShader(gl: WebGLRenderingContext, vsText: string, fsText: string) {
  const part = (type: number, text: string) => {
    const s = gl.createShader(type);
    if (!s) throw new Error("shader");
    gl.shaderSource(s, text);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(s);
      gl.deleteShader(s);
      throw new Error(log || "compile");
    }
    return s;
  };
  const vs = part(gl.VERTEX_SHADER, vsText);
  const fs = part(gl.FRAGMENT_SHADER, fsText);
  const program = gl.createProgram();
  if (!program) throw new Error("program");
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) || "link");
  }
  const book: Record<string, WebGLUniformLocation | null> = {};
  return {
    program,
    corner: gl.getAttribLocation(program, "aCorner"),
    spot: (name: string) => {
      if (!(name in book)) book[name] = gl.getUniformLocation(program, name);
      return book[name];
    },
  };
}

class RibbonEngine {
  canvas: HTMLCanvasElement;
  host: HTMLElement;
  items: ReturnType<typeof resolveSlide>[];
  opts: React.MutableRefObject<SettleResult>;
  fail: () => void;
  gl: WebGLRenderingContext;
  cardShader: ReturnType<typeof makeShader>;
  floorShader: ReturnType<typeof makeShader>;
  corners: WebGLBuffer;
  textures: WebGLTexture[];
  texSize: { w: number; h: number }[];
  natural: number[];
  clips: (HTMLVideoElement | null)[];
  viewW: number;
  viewH: number;
  dpr: number;
  cardH: number;
  widths: number[];
  starts: number[];
  setLen: number;
  loopLen: number;
  margin: number;
  pos: number;
  vel: number;
  glideTo: { from: number; to: number; begin: number; length: number } | null;
  held: boolean;
  pressX: number;
  pressPos: number;
  travelled: number;
  trail: { t: number; x: number }[];
  lastShown: number;
  flex: number;
  clock: number;
  revealAt: number;
  ranks: Map<number, number>;
  rankCount: number;
  cursor: { x: number; y: number; over: boolean };
  hovering: boolean;
  raf: number;
  lastNow: number;
  inView: boolean;
  tabOn: boolean;
  calm: boolean;
  alive: boolean;
  ready: boolean;
  seen: boolean;
  watch: IntersectionObserver | null;
  sizer: ResizeObserver | null;
  motionQuery: MediaQueryList | null;
  offs: (() => void)[];
  frame: (now: number) => void;

  constructor(
    canvas: HTMLCanvasElement,
    host: HTMLElement,
    items: ReturnType<typeof resolveSlide>[],
    opts: React.MutableRefObject<SettleResult>,
    fail: () => void
  ) {
    this.canvas = canvas;
    this.host = host;
    this.items = items;
    this.opts = opts;
    this.fail = fail;
    this.textures = [];
    this.texSize = [];
    this.natural = [];
    this.clips = [];
    this.viewW = 1;
    this.viewH = 1;
    this.dpr = 1;
    this.cardH = 1;
    this.widths = [];
    this.starts = [];
    this.setLen = 1;
    this.loopLen = 1;
    this.margin = 0;
    this.pos = 0;
    this.vel = 0;
    this.glideTo = null;
    this.held = false;
    this.pressX = 0;
    this.pressPos = 0;
    this.travelled = 0;
    this.trail = [];
    this.lastShown = 0;
    this.flex = 0;
    this.clock = 0;
    this.revealAt = -1;
    this.ranks = new Map();
    this.rankCount = 0;
    this.cursor = { x: 0, y: 0, over: false };
    this.hovering = false;
    this.raf = 0;
    this.lastNow = 0;
    this.inView = typeof IntersectionObserver === "undefined";
    this.tabOn = typeof document !== "undefined" ? !document.hidden : true;
    this.calm = false;
    this.alive = true;
    this.ready = false;
    this.seen = false;
    this.watch = null;
    this.sizer = null;
    this.motionQuery = null;
    this.offs = [];

    this.frame = (now: number) => {
      this.raf = 0;
      if (!this.permitted()) return;
      const o = this.opts.current;
      const dt = this.lastNow ? clampTo((now - this.lastNow) / 1000, 0.001, 0.05) : 1 / 60;
      this.lastNow = now;
      this.clock += dt;
      let busy = false;
      if (this.held) busy = true;
      else if (this.glideTo) {
        const g = this.glideTo;
        const k = clampTo((now - g.begin) / (g.length * 1000), 0, 1);
        const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
        this.pos = g.from + (g.to - g.from) * e;
        if (k >= 1) this.glideTo = null;
        busy = true;
      } else if (this.vel !== 0) {
        this.pos += this.vel * dt;
        this.vel *= Math.exp(-dt / Math.max(0.05, o.drive.glide));
        if (Math.abs(this.vel) < 4) this.vel = 0;
        busy = true;
      }
      const cruising =
        this.ready &&
        !this.calm &&
        o.drive.autoplay !== 0 &&
        !this.held &&
        !this.glideTo &&
        !(o.drive.holdOnHover && this.hovering);
      if (cruising) {
        this.pos -= o.drive.autoplay * dt;
        busy = true;
      }
      if (this.revealing()) busy = true;
      if (Math.abs(this.pos) > this.loopLen * 4) {
        const jump = this.pos - wrap(this.pos, this.loopLen);
        this.pos -= jump;
        this.pressPos -= jump;
        this.lastShown -= jump;
        if (this.glideTo) {
          this.glideTo.from -= jump;
          this.glideTo.to -= jump;
        }
      }
      const shown = this.pos + this.sweepShift();
      const speed = (shown - this.lastShown) / dt;
      this.lastShown = shown;
      const want = this.calm ? 0 : clampTo(Math.abs(speed) / 2400, 0, 1) * o.curve.speedFlare;
      this.flex += (want - this.flex) * (1 - Math.exp(-dt * 8));
      if (Math.abs(this.flex - want) < 0.002) this.flex = want;
      else busy = true;
      const list = this.ready ? this.seats(shown) : [];
      const over = this.cursor.over && !this.held ? this.pick(this.cursor.x, this.cursor.y, list) : null;
      this.hovering = Boolean(over);
      if (!this.held) this.canvas.style.cursor = over ? "pointer" : "grab";
      this.paint(list, shown);
      if (this.clips.some((v) => v && !v.paused)) busy = true;
      if (busy) this.raf = requestAnimationFrame(this.frame);
    };

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      depth: false,
    });
    if (!gl) throw new Error("no webgl");
    this.gl = gl;
    this.cardShader = makeShader(gl, PLATE_VERTEX, CARD_FRAGMENT);
    this.floorShader = makeShader(gl, PLATE_VERTEX, FLOOR_FRAGMENT);
    const buf = gl.createBuffer();
    if (!buf) throw new Error("buffer");
    this.corners = buf;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), gl.STATIC_DRAW);
    items.forEach(() => {
      this.textures.push(this.blank());
      this.texSize.push({ w: 17, h: 10 });
      this.natural.push(1.7);
      this.clips.push(null);
    });
    this.motionQuery =
      typeof window !== "undefined" && window.matchMedia
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : null;
    this.calm = Boolean(this.motionQuery && this.motionQuery.matches);
    this.listen();
    this.resize();
    this.loadAll();
  }

  permitted() {
    return this.alive && this.inView && this.tabOn;
  }
  schedule() {
    if (this.raf || !this.permitted()) return;
    this.lastNow = 0;
    this.raf = requestAnimationFrame(this.frame);
  }
  park() {
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.held = false;
    this.vel = 0;
    this.glideTo = null;
    this.cursor.over = false;
    this.trail = [];
    this.playClips(false);
  }
  recheck() {
    if (this.permitted()) {
      this.playClips(true);
      this.schedule();
    } else this.park();
  }
  destroy() {
    this.alive = false;
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.offs.forEach((off) => off());
    this.offs = [];
    if (this.watch) this.watch.disconnect();
    if (this.sizer) this.sizer.disconnect();
    const gl = this.gl;
    this.clips.forEach((v) => {
      if (!v) return;
      v.pause();
      v.removeAttribute("src");
      v.load();
    });
    this.textures.forEach((t) => gl.deleteTexture(t));
    gl.deleteBuffer(this.corners);
    gl.deleteProgram(this.cardShader.program);
    gl.deleteProgram(this.floorShader.program);
  }

  blank() {
    const gl = this.gl;
    const t = gl.createTexture();
    if (!t) throw new Error("texture");
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([214, 214, 214, 255])
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    return t;
  }

  upload(i: number, source: TexImageSource) {
    const gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, this.textures[i]);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    try {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
      return true;
    } catch {
      return false;
    }
  }

  loadAll() {
    const jobs = this.items.map((item, i) =>
      (item.motion ? fetchVideo(item.url) : fetchImage(item.url)).then((pic) => {
        if (!this.alive || !pic) return;
        if (!this.upload(i, pic.source)) return;
        this.texSize[i] = { w: pic.w, h: pic.h };
        this.natural[i] = clampTo(pic.w / pic.h, 0.3, 3.2);
        this.clips[i] = pic.clip;
      })
    );
    Promise.all(jobs).then(() => {
      if (!this.alive) return;
      this.layout();
      this.placeFirst();
      this.ready = true;
      this.beginReveal();
      this.recheck();
    });
  }

  playClips(on: boolean) {
    this.clips.forEach((v) => {
      if (!v) return;
      if (on && !this.calm) v.play().catch(() => {});
      else v.pause();
    });
  }

  mid() {
    return this.viewH * 0.5 + (this.opts.current.frame.offset / 100) * this.viewH;
  }

  shape() {
    const c = this.opts.current.curve;
    return {
      flat: clampTo(c.flatPct / 100, 0, 0.95) * (1 - 0.2 * this.flex),
      flare: Math.max(0, c.edgeScale - 1) * (1 + 0.7 * this.flex),
    };
  }

  layout() {
    const f = this.opts.current.frame;
    this.cardH = Math.max(40, Math.min((f.heightPct / 100) * this.viewH, f.heightCap));
    const fixed = clampTo(f.ratio, 0.3, 3.2);
    this.widths = this.items.map((_, i) => (f.fit === "natural" ? this.natural[i] : fixed) * this.cardH);
    this.starts = [];
    let run = 0;
    this.widths.forEach((w) => {
      this.starts.push(run);
      run += w + f.spacing;
    });
    this.setLen = Math.max(1, run);
    const widest = Math.max(1, ...this.widths);
    const copies = Math.max(2, Math.ceil((this.viewW * 2 + widest * 2) / this.setLen));
    this.loopLen = copies * this.setLen;
    this.margin = (this.loopLen - this.viewW) / 2;
  }

  leftOf(base: number, shown: number) {
    return wrap(base + shown + this.margin, this.loopLen) - this.margin;
  }

  placeFirst() {
    const f = this.opts.current.frame;
    const at = f.centreSmall && this.viewW < 700 ? 0.5 : clampTo(f.anchor, 0, 100) / 100;
    this.pos = at * this.viewW - (this.starts[0] + this.widths[0] / 2);
    this.vel = 0;
    this.glideTo = null;
    this.lastShown = this.pos;
  }

  seats(shown: number) {
    const out: { key: number; slot: number; left: number; width: number }[] = [];
    const copies = Math.round(this.loopLen / this.setLen);
    const n = this.items.length;
    for (let c = 0; c < copies; c++) {
      for (let i = 0; i < n; i++) {
        const left = this.leftOf(c * this.setLen + this.starts[i], shown);
        const width = this.widths[i];
        if (left > this.viewW + 40 || left + width < -40) continue;
        out.push({ key: c * n + i, slot: i, left, width });
      }
    }
    return out;
  }

  pick(x: number, y: number, list: { key: number; slot: number; left: number; width: number }[]) {
    const s = this.shape();
    const k = swellAt(x, this.viewW, s.flat, s.flare);
    const mid = this.mid();
    const yy = mid + (y - mid) / k;
    if (Math.abs(yy - mid) > this.cardH / 2) return null;
    for (const seat of list) {
      if (x >= seat.left && x <= seat.left + seat.width) return seat;
    }
    return null;
  }

  resize() {
    const box = this.host.getBoundingClientRect();
    const firstFrac =
      this.ready && this.widths.length
        ? (this.leftOf(this.starts[0], this.pos) + this.widths[0] / 2) / this.viewW
        : null;
    this.viewW = Math.max(1, box.width);
    this.viewH = Math.max(1, box.height);
    this.dpr = Math.min(2, (typeof window !== "undefined" && window.devicePixelRatio) || 1);
    this.canvas.width = Math.round(this.viewW * this.dpr);
    this.canvas.height = Math.round(this.viewH * this.dpr);
    if (!this.items.length) return;
    this.layout();
    if (firstFrac !== null) {
      this.pos = firstFrac * this.viewW - this.widths[0] / 2 - this.starts[0];
      this.vel = 0;
      this.glideTo = null;
      this.lastShown = this.pos + this.sweepShift();
    }
    this.schedule();
  }

  beginReveal() {
    const r = this.opts.current.reveal;
    this.revealAt = this.clock;
    const order = this.seats(this.pos).sort((a, b) => a.left - b.left);
    this.ranks.clear();
    order.forEach((s, i) => this.ranks.set(s.key, i));
    this.rankCount = order.length;
    if (this.calm || (r.mode as string) === "off") this.revealAt = -1;
    this.lastShown = this.pos + this.sweepShift();
  }

  revealSpan() {
    const r = this.opts.current.reveal;
    return r.wait + this.rankCount * r.gap + r.time;
  }

  revealing() {
    return (
      this.revealAt >= 0 &&
      (this.opts.current.reveal.mode as string) !== "off" &&
      !this.calm &&
      this.clock - this.revealAt < this.revealSpan()
    );
  }

  progress(rank: number) {
    const r = this.opts.current.reveal;
    if (!this.revealing()) return 1;
    const staggered = (r.mode as string) === "slide" ? 0 : rank * r.gap;
    return clampTo((this.clock - this.revealAt - r.wait - staggered) / Math.max(0.05, r.time), 0, 1);
  }

  sweepShift() {
    if (!this.revealing() || (this.opts.current.reveal.mode as string) !== "slide") return 0;
    const p = this.progress(0);
    const eased = p >= 1 ? 1 : 1 - Math.pow(2, -10 * p);
    return this.viewW * 0.85 * (1 - eased);
  }

  paint(list: { key: number; slot: number; left: number; width: number }[], shown: number) {
    const gl = this.gl;
    const o = this.opts.current;
    const bg = toRgba(o.backdrop.fill);
    gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    gl.clearColor(bg[0] * bg[3], bg[1] * bg[3], bg[2] * bg[3], bg[3]);
    gl.clear(gl.COLOR_BUFFER_BIT);
    if (!this.ready) return;
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.corners);
    const mid = this.mid();
    const whole = this.revealing()
      ? clampTo((this.clock - this.revealAt - o.reveal.wait) / Math.max(0.05, o.reveal.time), 0, 1)
      : 1;

    if (o.backdrop.grid) {
      const fs = this.floorShader;
      gl.useProgram(fs.program);
      gl.enableVertexAttribArray(fs.corner);
      gl.vertexAttribPointer(fs.corner, 2, gl.FLOAT, false, 0, 0);
      gl.uniform4f(fs.spot("uBox"), 0, 0, this.viewW, this.viewH);
      gl.uniform2f(fs.spot("uView"), this.viewW, this.viewH);
      gl.uniform1f(fs.spot("uHorizon"), mid + this.cardH / 2 + this.viewH * 0.03);
      gl.uniform1f(fs.spot("uDrift"), -shown * 0.004);
      gl.uniform1f(fs.spot("uAlpha"), whole);
      gl.uniform4fv(fs.spot("uTint"), toRgba(o.backdrop.gridTint));
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    this.clips.forEach((v, i) => {
      if (v && !v.paused && v.readyState >= 2) this.upload(i, v);
    });

    const cs = this.cardShader;
    const s = this.shape();
    gl.useProgram(cs.program);
    gl.enableVertexAttribArray(cs.corner);
    gl.vertexAttribPointer(cs.corner, 2, gl.FLOAT, false, 0, 0);
    gl.uniform2f(cs.spot("uView"), this.viewW, this.viewH);
    gl.uniform1f(cs.spot("uDpr"), this.dpr);
    gl.uniform1f(cs.spot("uMid"), mid);
    gl.uniform1f(cs.spot("uFlat"), s.flat);
    gl.uniform1f(cs.spot("uFlare"), s.flare);
    gl.uniform1f(cs.spot("uCorner"), Math.max(0, o.frame.corner));
    gl.uniform1f(cs.spot("uShift"), this.calm ? 0 : this.flex * 0.006 * Math.max(0, o.curve.split));
    gl.uniform1f(cs.spot("uFringe"), clampTo(o.curve.fringe, 0, 1));
    gl.uniform4fv(cs.spot("uRimOut"), toRgba(o.curve.fringeOuter));
    gl.uniform4fv(cs.spot("uRimIn"), toRgba(o.curve.fringeInner));
    gl.uniform1i(cs.spot("uImg"), 0);
    gl.activeTexture(gl.TEXTURE0);

    const mode = o.reveal.mode as string;
    for (const seat of list) {
      const rank = this.ranks.has(seat.key) ? (this.ranks.get(seat.key) as number) : this.rankCount;
      const p = mode === "slide" ? this.progress(0) : this.progress(rank);
      let alpha = 1;
      let lift = 0;
      let grow = 1;
      if (p < 1) {
        if (mode === "lift") {
          const e = 1 - Math.pow(1 - p, 3);
          lift = (1 - e) * this.cardH * 0.55;
          grow = 0.9 + 0.1 * e;
          alpha = clampTo(p * 2.4, 0, 1);
        } else if (mode === "dissolve") alpha = p * p * (3 - 2 * p);
        else if (mode === "slide") alpha = clampTo(p * 3, 0, 1);
      }
      if (alpha <= 0.002) continue;
      const w = seat.width * grow;
      const h = this.cardH * grow;
      const cx = seat.left + seat.width / 2;
      const left = cx - w / 2;
      const top = mid + lift - h / 2;
      const kMax = Math.max(
        swellAt(left, this.viewW, s.flat, s.flare),
        swellAt(left + w, this.viewW, s.flat, s.flare)
      );
      const above = top - mid;
      const beneath = top + h - mid;
      gl.uniform4f(
        cs.spot("uBox"),
        left - 2,
        mid + Math.min(above, above * kMax) - 3,
        left + w + 2,
        mid + Math.max(beneath, beneath * kMax) + 3
      );
      gl.uniform4f(cs.spot("uCard"), left, top, w, h);
      gl.uniform1f(cs.spot("uAlpha"), alpha);
      const size = this.texSize[seat.slot];
      gl.uniform2f(cs.spot("uImgSize"), size.w, size.h);
      gl.bindTexture(gl.TEXTURE_2D, this.textures[seat.slot]);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
  }

  local(e: PointerEvent) {
    const r = this.canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  aim(target: number) {
    if (this.calm) {
      this.pos = target;
      this.glideTo = null;
    } else {
      this.glideTo = { from: this.pos, to: target, begin: performance.now(), length: 0.7 };
    }
    this.vel = 0;
    this.schedule();
  }

  follow(url: string) {
    const jump = document.createElement("a");
    jump.href = url;
    if (this.opts.current.press.newTab) {
      jump.target = "_blank";
      jump.rel = "noopener noreferrer";
    }
    jump.click();
  }

  listen() {
    const c = this.canvas;
    const onTarget = (
      target: EventTarget,
      type: string,
      fn: EventListener,
      opt?: boolean | AddEventListenerOptions
    ) => {
      target.addEventListener(type, fn, opt);
      this.offs.push(() => target.removeEventListener(type, fn, opt));
    };

    onTarget(c, "pointerdown", ((e: PointerEvent) => {
      if (!this.permitted() || !this.ready) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      const p = this.local(e);
      this.held = true;
      this.glideTo = null;
      this.vel = 0;
      this.pressX = p.x;
      this.pressPos = this.pos;
      this.travelled = 0;
      this.trail = [{ t: performance.now(), x: p.x }];
      this.cursor = { x: p.x, y: p.y, over: true };
      try {
        c.setPointerCapture(e.pointerId);
      } catch {}
      c.style.cursor = "grabbing";
      this.schedule();
    }) as EventListener);

    onTarget(c, "pointermove", ((e: PointerEvent) => {
      const p = this.local(e);
      this.cursor = { x: p.x, y: p.y, over: true };
      if (this.held) {
        const dx = p.x - this.pressX;
        this.travelled = Math.max(this.travelled, Math.abs(dx));
        this.pos = this.pressPos + dx * this.opts.current.drive.drag;
        const t = performance.now();
        this.trail.push({ t, x: p.x });
        while (this.trail.length > 2 && t - this.trail[0].t > 100) this.trail.shift();
      }
      this.schedule();
    }) as EventListener);

    const letGo = (e: Event) => {
      const pe = e as PointerEvent;
      if (!this.held) return;
      this.held = false;
      try {
        c.releasePointerCapture(pe.pointerId);
      } catch {}
      const d = this.opts.current.drive;
      if (this.travelled > 6) {
        const first = this.trail[0];
        const last = this.trail[this.trail.length - 1];
        const stale = performance.now() - last.t > 80;
        const span = (last.t - first.t) / 1000;
        this.vel =
          this.calm || stale || span <= 0 ? 0 : clampTo(((last.x - first.x) / span) * d.drag, -5000, 5000);
      } else if (e.type !== "pointercancel") {
        const p = this.local(pe);
        const seat = this.pick(p.x, p.y, this.seats(this.lastShown));
        if (seat) {
          const href = this.items[seat.slot].href;
          const delta = this.viewW / 2 - (seat.left + seat.width / 2);
          const direct = (this.opts.current.press.behaviour as string) === "follow";
          if (href && (direct || Math.abs(delta) < 8)) this.follow(href);
          else this.aim(this.pos + delta);
        }
      }
      this.trail = [];
      this.schedule();
    };

    onTarget(c, "pointerup", letGo as EventListener);
    onTarget(c, "pointercancel", letGo as EventListener);
    onTarget(c, "pointerleave", () => {
      this.cursor.over = false;
      if (!this.held) c.style.cursor = "grab";
      this.schedule();
    });

    onTarget(
      c,
      "wheel",
      ((e: WheelEvent) => {
        const d = this.opts.current.drive;
        if ((d.wheel as string) === "none" || !this.permitted() || !this.ready) return;
        const sideways = Math.abs(e.deltaX) > Math.abs(e.deltaY);
        if ((d.wheel as string) === "sideways" && !sideways) return;
        e.preventDefault();
        const unit = e.deltaMode === 1 ? 32 : e.deltaMode === 2 ? this.viewH : 1;
        const amount = (sideways ? e.deltaX : e.deltaY) * unit * d.wheelGain;
        this.glideTo = null;
        if (this.calm) this.pos -= amount;
        else this.vel = clampTo(this.vel - amount * 8, -4200, 4200);
        this.schedule();
      }) as EventListener,
      { passive: false }
    );

    onTarget(c, "keydown", ((e: KeyboardEvent) => {
      if (!this.opts.current.drive.keys || !this.ready) return;
      const dir = e.key === "ArrowLeft" ? 1 : e.key === "ArrowRight" ? -1 : 0;
      if (!dir) return;
      e.preventDefault();
      const step =
        this.widths.reduce((a, b) => a + b, 0) / this.widths.length + this.opts.current.frame.spacing;
      const from = this.glideTo ? this.glideTo.to : this.pos;
      this.aim(from + dir * step);
    }) as EventListener);

    if (typeof document !== "undefined") {
      onTarget(document, "visibilitychange", () => {
        this.tabOn = !document.hidden;
        this.recheck();
      });
    }

    if (this.motionQuery && typeof this.motionQuery.addEventListener === "function") {
      const mq = this.motionQuery;
      const fn = () => {
        this.calm = mq.matches;
        if (this.calm) this.revealAt = -1;
        this.recheck();
      };
      mq.addEventListener("change", fn);
      this.offs.push(() => mq.removeEventListener("change", fn));
    }

    onTarget(c, "webglcontextlost", ((e: Event) => {
      e.preventDefault();
      this.park();
      this.alive = false;
      this.fail();
    }) as EventListener);

    if (typeof IntersectionObserver !== "undefined") {
      this.watch = new IntersectionObserver(
        (entries) => {
          const was = this.inView;
          this.inView = entries.some((en) => en.isIntersecting);
          if (this.inView && !was && this.seen && this.ready && this.opts.current.reveal.repeat) {
            this.beginReveal();
          }
          if (this.inView) this.seen = true;
          this.recheck();
        },
        { rootMargin: "60px 0px" }
      );
      this.watch.observe(this.host);
    }

    if (typeof ResizeObserver !== "undefined") {
      this.sizer = new ResizeObserver(() => this.resize());
      this.sizer.observe(this.host);
    }
  }

  relayout() {
    if (!this.ready) return;
    const frac = (this.leftOf(this.starts[0], this.pos) + this.widths[0] / 2) / this.viewW;
    this.layout();
    this.pos = frac * this.viewW - this.widths[0] / 2 - this.starts[0];
    this.lastShown = this.pos + this.sweepShift();
    this.schedule();
  }
}

export default function CurveFlowCarousel(props: CurveFlowCarouselProps) {
  const settled = useMemo(() => settle(props), [props]);
  const hostRef = useRef<HTMLDivElement>(null);
  const paintRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<RibbonEngine | null>(null);
  const optsRef = useRef<SettleResult>(settled);
  optsRef.current = settled;
  const [failed, setFailed] = useState(false);

  const items = useMemo(() => settled.slides.map(resolveSlide), [settled.slides]);
  const mediaKey = items.map((it) => `${it.motion ? "v" : "i"}|${it.url}`).join(";");
  const itemsRef = useRef(items);
  itemsRef.current = items;

  useEffect(() => {
    const host = hostRef.current;
    const surface = paintRef.current;
    if (!host || !surface) return;
    let engine: RibbonEngine | null = null;
    try {
      engine = new RibbonEngine(surface, host, itemsRef.current, optsRef, () => setFailed(true));
    } catch {
      setFailed(true);
      return;
    }
    engineRef.current = engine;
    return () => {
      if (engine) engine.destroy();
      engineRef.current = null;
    };
  }, [mediaKey]);

  const frameKey = JSON.stringify(settled.frame);
  useEffect(() => {
    if (engineRef.current) engineRef.current.relayout();
  }, [frameKey]);

  useEffect(() => {
    if (engineRef.current) engineRef.current.schedule();
  });

  if (failed) {
    return (
      <div
        className={`w-full h-full flex items-center justify-center text-sm font-mono text-black/50 ${settled.className || ""}`}
        style={settled.style}
      >
        WebGL Carousel unavailable
      </div>
    );
  }

  return (
    <div
      ref={hostRef}
      role="region"
      aria-roledescription="media strip"
      aria-label="Media carousel"
      style={{
        ...settled.style,
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: settled.backdrop.fill,
      }}
      className={`select-none ${settled.className || ""}`}
    >
      <canvas
        ref={paintRef}
        tabIndex={0}
        aria-label="Drag or use arrow keys to browse"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          cursor: "grab",
          touchAction: "pan-y",
          userSelect: "none",
          outline: "none",
          WebkitTapHighlightColor: "rgba(0,0,0,0)",
        }}
      />
    </div>
  );
}
