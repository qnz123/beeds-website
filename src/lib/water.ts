// The BEEDS wordmark under water, for /watermark/ (ported from the Watermark study previews).
// mountWater(host) fills `host` with the water; the host sets the size. Only the wordmark, the
// stone and an optional mark (`under`) are drawn into the water. It rains for a few seconds when
// first seen, then moves only when stirred, and sleeps when the water is calm, off screen, or the
// tab is hidden. Touch screens get a lighter water (a coarser grid, a lower resolution) that a
// finger stirs, and drop to the still if its first second runs slow. Reduced motion, Data Saver,
// low-memory devices and browsers without WebGL get the still from the start.

export type WaterOptions = {
  ground?: string
  /** Share of the width the wordmark fills. */
  fit?: number
  rainSeconds?: number
  /** Lines scratched into the stone, top to bottom. */
  carve?: string[]
  /** CSS font-family lists (next/font's `style.fontFamily`) for the wordmark and the carving. */
  fonts?: { mark?: string; carve?: string }
  /** An SVG on the page, drawn under the water at the place and size it has there. It can stay
      invisible itself (opacity 0); it is only measured and copied. */
  under?: SVGSVGElement
  /** How far in from each edge the water fades out, as a share of the width or height, so the
      band never shows as a rectangle. Defaults: 0.07 at the sides, 0.12 top and bottom. */
  edge?: { x?: number; top?: number; bottom?: number }
}

export type Water = {
  /** A stone dropped at a point on screen (client coordinates). */
  drop: (clientX: number, clientY: number) => void
  /** Settles once the water is on screen with the `under` mark drawn into it. */
  ready: Promise<void>
  destroy: () => void
}

export function mountWater(host: HTMLElement, options: WaterOptions = {}): Water {
  const opts = { ground: '#f5f5f5', fit: 0.62, rainSeconds: 5, ...options }
  const markFont = `${opts.fonts?.mark ?? '"Bodoni Moda"'}, "Times New Roman", serif`
  const carveFont = `${opts.fonts?.carve ?? '"Reenie Beanie"'}, "Comic Sans MS", cursive`
  const cleanups: Array<() => void> = []
  let settle = () => {}
  const ready = new Promise<void>((r) => { settle = r })
  const api: Water = { drop: () => {}, ready, destroy: () => { cleanups.forEach((f) => f()); cleanups.length = 0 } }
  const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number }
  const LIVE = !RM && !nav.connection?.saveData && (nav.deviceMemory ?? 8) >= 4
  const LITE = window.matchMedia('(pointer: coarse)').matches
  let canvas = document.createElement('canvas')
  canvas.setAttribute('aria-hidden', 'true')
  host.appendChild(canvas)
  cleanups.push(() => canvas.remove())
  const bg = document.createElement('canvas'), bgx = bg.getContext('2d')!
  const dd = document.createElement('canvas'), ddx = dd.getContext('2d')!
  let W = 2, H = 2, dpr = 1
  // the live water has stopped for good (context lost, too slow, or unmounted); the still stands
  let lost = false
  const stone = { x: 0.5, y: 0.5, r: 0.05 }
  // everything drawn into the picture again, in whichever mode the water is running
  let redraw = () => { drawComposition(); still() }

  function measure() {
    const r = host.getBoundingClientRect()
    dpr = Math.min(window.devicePixelRatio || 1, LITE ? 1.5 : 2)
    const cap = 3.2e6                                              // keep the fill cost bounded
    if (r.width * r.height * dpr * dpr > cap) dpr = Math.sqrt(cap / Math.max(1, r.width * r.height))
    W = Math.max(2, Math.round(r.width * dpr)); H = Math.max(2, Math.round(r.height * dpr))
    // a finger drags to stir the live water, unless the page is taller than the screen and needs
    // it to scroll
    if (LIVE && !lost) canvas.style.touchAction = document.documentElement.scrollHeight > window.innerHeight + 1 ? 'pan-y' : 'none'
    placeUnder(r)
  }

  // the `under` mark: a copy of the page's SVG rasterised at its size in canvas pixels, redrawn
  // into the picture once it has loaded (and again when the size changes)
  const under = { img: null as HTMLImageElement | null, key: '', x: 0, y: 0, w: 0, h: 0 }
  function placeUnder(hostRect: DOMRect) {
    if (!opts.under) return
    const m = opts.under.getBoundingClientRect()
    if (!m.width || !m.height) { under.w = 0; return }
    under.x = (m.left - hostRect.left) * dpr; under.y = (m.top - hostRect.top) * dpr
    under.w = m.width * dpr; under.h = m.height * dpr
    const pw = Math.ceil(under.w), ph = Math.ceil(under.h), key = pw + 'x' + ph
    if (key === under.key) return
    under.key = key
    const svg = opts.under.cloneNode(true) as SVGSVGElement
    svg.removeAttribute('class')
    svg.setAttribute('width', String(pw)); svg.setAttribute('height', String(ph))  // Firefox needs a size to draw an SVG
    const img = new Image()
    img.onload = () => { if (under.key === key) { under.img = img; redraw(); settle() } }
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(svg))
  }

  // the picture under the water: the ground, the wordmark and the `under` mark, nothing else
  function drawComposition() {
    bg.width = W; bg.height = H
    const c = bgx, text = 'BEEDS'
    c.fillStyle = opts.ground; c.fillRect(0, 0, W, H)
    c.textBaseline = 'middle'
    c.font = `700 100px ${markFont}`
    let w100 = 0
    for (let j = 0; j < 5; j++) w100 += c.measureText(text[j]).width + (j < 4 ? -8 : 0)
    const size = Math.min(W * opts.fit / (w100 / 100), H * 0.78), track = -0.08 * size
    c.font = `700 ${size}px ${markFont}`
    c.fillStyle = '#000'
    let tw = 0
    for (let j = 0; j < 5; j++) tw += c.measureText(text[j]).width + (j < 4 ? track : 0)
    let x = (W - tw) / 2
    const y = H * 0.5 + size * 0.02, lx: number[] = []
    for (let j = 0; j < 5; j++) { lx.push(x); c.fillText(text[j], x, y); x += c.measureText(text[j]).width + track }
    // the stone rests on the first E, at its top bar
    stone.x = (lx[1] + c.measureText('E').width * 0.5) / W
    stone.y = (y - size * 0.30) / H
    stone.r = 0.167 * size / W
    if (under.img && under.w) c.drawImage(under.img, under.x, under.y, under.w, under.h)
    buildCarve()
    dd.width = W; dd.height = H; ddx.clearRect(0, 0, W, H)
  }

  let carve: HTMLCanvasElement | null = null
  function buildCarve() {
    if (!opts.carve) return
    carve = carve || document.createElement('canvas')
    carve.width = 1024; carve.height = Math.round(1024 * 0.92 / (1.6 * 1.28))
    const c = carve.getContext('2d')!, L = opts.carve, n = L.length, fs = carve.height / (n + 0.55) * 1.05
    let seed = 11
    const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 - 0.5 }
    c.fillStyle = '#000'; c.fillRect(0, 0, carve.width, carve.height)
    c.textBaseline = 'middle'
    c.font = `${fs}px ${carveFont}`
    // scratched in with another stone: thin lines only, every letter scraped over two or three
    // times, each pass a hair off the last and fainter; the letters tilt, sit and size unevenly,
    // and the lines are not level
    for (let i = 0; i < n; i++) {
      const chars = L[i].split('')
      const widths = chars.map((ch) => c.measureText(ch).width)
      const total = widths.reduce((s, w) => s + w, 0) * 0.92
      const sc = Math.min(1, carve.width * 0.9 / total)
      let x = (carve.width - total * sc) / 2 + rnd() * fs * 0.3
      const y0 = carve.height * (i + 0.62) / (n + 0.25), slope = (i ? -0.035 : 0.05) + rnd() * 0.03
      for (let k = 0; k < chars.length; k++) {
        const w = widths[k] * sc, cx = x + w / 2, cy = y0 + (cx - carve.width / 2) * slope + rnd() * fs * 0.1
        const depth = 0.8 + (rnd() + 0.5) * 0.2, size = 1 + rnd() * 0.2, rot = rnd() * 0.2
        const passes = 2 + (rnd() > 0 ? 1 : 0)
        for (let pass = 0; pass < passes; pass++) {
          c.save()
          c.translate(cx + rnd() * fs * 0.03 * (pass ? 1 : 0), cy + rnd() * fs * 0.024 * (pass ? 1 : 0))
          c.rotate(rot + rnd() * 0.04 * (pass ? 1 : 0)); c.scale(sc * size, size)
          const g = Math.round(255 * depth * [1, 0.6, 0.42][pass])
          c.fillStyle = `rgb(${g},${g},${g})`
          c.fillText(chars[k], -widths[k] / 2, 0)
          c.restore()
        }
        x += w * (0.9 + (rnd() + 0.5) * 0.12)
      }
    }
  }

  function still() {
    canvas.width = W; canvas.height = H
    const c = canvas.getContext('2d')
    if (c) { c.drawImage(bg, 0, 0); c.drawImage(dd, 0, 0) }
  }

  const fontsReady = () => document.fonts
    ? Promise.all([document.fonts.load(`700 100px ${markFont}`), document.fonts.load(`40px ${carveFont}`)])
    : Promise.resolve()

  measure(); drawComposition()
  const ctx = LIVE ? canvas.getContext('webgl', { antialias: false, alpha: false, premultipliedAlpha: false }) : null
  if (!ctx) {
    still()
    const ro0 = new ResizeObserver(() => { measure(); drawComposition(); still() })
    ro0.observe(host)
    cleanups.push(() => ro0.disconnect())
    fontsReady().then(() => redraw(), () => {})
    if (!opts.under) settle()
    return api
  }
  const gl: WebGLRenderingContext = ctx
  const edge = { x: 0.07, top: 0.12, bottom: 0.12, ...opts.edge }

  const VS = 'attribute vec2 p; varying vec2 v; void main(){ v = vec2(p.x*0.5+0.5, 0.5-p.y*0.5); gl_Position = vec4(p,0.,1.); }'
  const STONE_FS = [
    'precision highp float;',
    'uniform sampler2D uBg, uDoodle, uCarve; uniform float uHasCarve; uniform vec2 uRes; uniform vec3 uStone; varying vec2 v;',
    'float hash(vec3 p){ p += vec3(31.7, 17.3, 5.9); return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }',
    'float noise(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);',
    '  return mix(mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x), mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),',
    '             mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x), mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z); }',
    'float fbm(vec3 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 5; i++) { s += a * noise(p); p = p * 2.03 + 7.1; a *= 0.5; } return s; }',
    'const float H = 0.30; const float ROT = -0.2618;',
    'vec2 sq(vec2 q){ float c = cos(ROT), sn = sin(ROT); vec2 r = mat2(c, sn, -sn, c) * q; return vec2(r.x / 1.28, r.y); }',
    'float rimR(vec2 e){ float a = atan(e.y, e.x);',
    '  return 1.0 + 0.02 * sin(3.0 * a + 0.7) + 0.012 * sin(5.0 * a + 2.1) + 0.006 * sin(8.0 * a - 1.3) + 0.02 * (fbm(vec3(e * 2.4, 3.7)) - 0.5); }',
    'float outline(vec2 q){ vec2 e = sq(q); return length(e) - rimR(e); }',
    'float top(vec2 q){ vec2 e = sq(q); float rr = length(e) / rimR(e); if (rr >= 1.0) return 0.0;',
    '  float lens = pow(1.0 - pow(rr, 2.4), 1.0 / 2.4); float hill = pow(1.0 - rr * rr, 1.4); return H * (0.58 * lens + 0.42 * hill); }',
    'vec3 normalAt(vec2 q){ vec2 e = vec2(0.005, 0.0); float hx = top(q + e.xy) - top(q - e.xy), hy = top(q + e.yx) - top(q - e.yx);',
    '  return normalize(vec3(-hx, -hy, 2.0 * e.x)); }',
    'vec3 rough(vec3 p, vec3 n){ float e = 0.006; float f0 = fbm(p * 16.0);',
    '  vec3 g = vec3(fbm((p + vec3(e,0,0)) * 16.0) - f0, fbm((p + vec3(0,e,0)) * 16.0) - f0, fbm((p + vec3(0,0,e)) * 16.0) - f0) / e;',
    '  return normalize(n - 0.008 * (g - n * dot(g, n))); }',
    'void main(){',
    '  vec3 bg = texture2D(uBg, v).rgb;',
    '  float aspect = uRes.y / uRes.x;',
    '  vec2 q = vec2(v.x - uStone.x, (v.y - uStone.y) * aspect) / uStone.z;',
    '  vec3 col = bg;',
    '  if (length(q) < 2.2) {',                                          // only near the stone: no per-pixel cost elsewhere
    '    vec3 L = normalize(vec3(-0.55, -0.62, 0.62));',
    '    float shadow = 1.0 - 0.30 * (1.0 - smoothstep(-0.05, 0.38, outline(q - vec2(0.10, 0.16))));',
    '    float seam = 1.0 - 0.18 * (1.0 - smoothstep(0.0, 0.08, outline(q)));',
    '    col = bg * shadow * seam;',
    '    vec3 rd = normalize(vec3(0.14, 0.20, -1.0)); vec3 ro = vec3(q - rd.xy * 2.0, 2.0);',
    '    float t = 1.55, dt = 0.014; bool hit = false; vec3 p;',
    '    for (int i = 0; i < 40; i++) { p = ro + rd * t; if (outline(p.xy) < 0.0 && p.z <= top(p.xy)) { hit = true; break; } if (p.z < 0.0) break; t += dt; }',
    '    if (hit) {',
    '      float lo = t - dt, hi = t;',
    '      for (int j = 0; j < 7; j++) { float m = 0.5 * (lo + hi); vec3 pm = ro + rd * m; if (pm.z <= top(pm.xy)) hi = m; else lo = m; }',
    '      p = ro + rd * hi; vec3 n = rough(p, normalAt(p.xy));',
    '      float m = fbm(p * 5.0); vec3 alb = mix(vec3(0.60), vec3(0.72), m) * vec3(0.985, 0.99, 1.0);',
    '      float g1 = noise(p * 84.0), g2 = noise(p * 57.0 + 3.0);',
    '      alb += 0.14 * smoothstep(0.80, 0.92, g1); alb -= 0.20 * smoothstep(0.82, 0.94, g2);',
    '      alb *= 1.0 - 0.10 * smoothstep(0.62, 0.74, fbm(p * 8.4 + 5.0));',
    '      float dif = max(dot(n, L), 0.0); float fill = max(dot(n, normalize(vec3(0.6, 0.5, 0.35))), 0.0) * 0.18;',
    '      float sky = 0.30 + 0.22 * n.z; float ao = 1.0 - 0.30 * (1.0 - smoothstep(0.0, 0.22, p.z));',
    '      float spec = pow(max(dot(reflect(-L, n), -rd), 0.0), 18.0) * 0.07;',
    '      col = alb * (sky * ao + dif * 0.86 + fill) + spec;',
    // carved text: the grooves sit lower and darker; the edge toward the light falls into shadow,
    // the far edge catches the light. The text lives in the stone's own turned, oval coordinates.
    '      if (uHasCarve > 0.5) {',
    '        vec2 e = sq(p.xy); vec2 uv = vec2((e.x + 0.80) / 1.60, (e.y + 0.46) / 0.92);',
    '        if (uv.x > 0.0 && uv.x < 1.0 && uv.y > 0.0 && uv.y < 1.0) {',
    '          vec2 dl = vec2(-0.0018, -0.0045);',
    '          float m = texture2D(uCarve, uv).r;',
    '          float sh = m * (1.0 - texture2D(uCarve, uv + dl).r);',
    '          float hl = m * (1.0 - texture2D(uCarve, uv - dl).r);',
    '          col = col * (1.0 - 0.38 * m - 0.34 * sh) + 0.16 * hl;',
    '        }',
    '      }',
    '    }',
    '  }',
    '  vec4 dk = texture2D(uDoodle, v); col = mix(col, dk.rgb, dk.a);',
    '  gl_FragColor = vec4(col, 1.0);',
    '}',
  ].join('\n')
  const WATER_FS = [
    'precision highp float;',
    'uniform sampler2D uScene, uWater; uniform float uAspect; uniform vec3 uEdge; varying vec2 v;',
    'void main(){',
    // the effect fades out toward the edges (sides, top, bottom), so the band never shows as a
    // rectangle on the page
    '  float edge = smoothstep(0.0, uEdge.x, min(v.x, 1.0 - v.x)) * smoothstep(0.0, uEdge.y, v.y) * smoothstep(0.0, uEdge.z, 1.0 - v.y);',
    '  vec4 w = texture2D(uWater, v);',
    '  vec2 n = (w.rg - 0.5) * 2.0 * edge; float h = (w.b - 0.5) * 2.0 * edge;',
    '  vec2 s = vec2(v.x, 1.0 - v.y); vec2 d = vec2(n.x, -n.y * uAspect);',
    '  vec3 col;',
    '  col.r = texture2D(uScene, s + d * 0.032 * 1.16).r;',
    '  col.g = texture2D(uScene, s + d * 0.032).g;',
    '  col.b = texture2D(uScene, s + d * 0.032 * 0.84).b;',
    '  vec3 N = normalize(vec3(-n * 3.0, 1.0)); vec3 L = normalize(vec3(-0.35, 0.55, 0.75));',
    '  col += pow(max(dot(N, L), 0.0), 48.0) * smoothstep(0.02, 0.25, length(n)) * 0.22;',
    '  col += h * 0.05;',
    '  gl_FragColor = vec4(col, 1.0);',
    '}',
  ].join('\n')

  function shader(type: number, src: string) { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s }
  function program(fs: string) {
    const pr = gl.createProgram()!
    gl.attachShader(pr, shader(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, shader(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(pr)
    return gl.getProgramParameter(pr, gl.LINK_STATUS) ? pr : null
  }
  const stoneProg = program(STONE_FS), waterProg = program(WATER_FS)
  if (!stoneProg || !waterProg) { still(); return api }
  const quad = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, quad)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
  function bindQuad(pr: WebGLProgram) { const ap = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(ap); gl.vertexAttribPointer(ap, 2, gl.FLOAT, false, 0, 0) }
  function tex(unit: number) {
    const t = gl.createTexture(); gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, t)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    return t
  }
  const bgTex = tex(0), waterTex = tex(1), sceneTex = tex(2), ddTex = tex(3), carveTex = tex(4), fbo = gl.createFramebuffer()
  const uS = { carve: gl.getUniformLocation(stoneProg, 'uCarve'), hasCarve: gl.getUniformLocation(stoneProg, 'uHasCarve'), dd: gl.getUniformLocation(stoneProg, 'uDoodle'), bg: gl.getUniformLocation(stoneProg, 'uBg'), res: gl.getUniformLocation(stoneProg, 'uRes'), st: gl.getUniformLocation(stoneProg, 'uStone') }
  const uW = { scene: gl.getUniformLocation(waterProg, 'uScene'), water: gl.getUniformLocation(waterProg, 'uWater'), aspect: gl.getUniformLocation(waterProg, 'uAspect'), edge: gl.getUniformLocation(waterProg, 'uEdge') }

  // the water: a small height field on the CPU, stepped at a fixed 60 steps a second whatever the
  // screen's rate, so the waves look the same at 120, 60 or 30 fps, only smoother or rougher. On
  // touch screens it is sized by a budget of cells instead (about half the desktop's), kept square
  // whatever the screen's shape: a tall phone would otherwise stretch every ripple.
  const LITE_CELLS = 20000
  let GW = 256, GH = 100, cur = new Float32Array(0), prev = new Float32Array(0), norm = new Uint8Array(0)
  function sizeGrid() {
    if (LITE) { GW = Math.max(48, Math.round(Math.sqrt(LITE_CELLS * W / H))); GH = Math.max(48, Math.round(LITE_CELLS / GW)) }
    else GH = Math.max(48, Math.min(200, Math.round(GW * H / W)))
    cur = new Float32Array(GW * GH); prev = new Float32Array(GW * GH); norm = new Uint8Array(GW * GH * 4)
  }
  function drop(gx: number, gy: number, radius: number, strength: number) {
    const r = Math.max(1.2, radius), r2 = r * r, x0 = Math.max(1, Math.floor(gx - r)), x1 = Math.min(GW - 2, Math.ceil(gx + r))
    const y0 = Math.max(1, Math.floor(gy - r)), y1 = Math.min(GH - 2, Math.ceil(gy + r))
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const dx = x - gx, dy = y - gy, d2 = dx * dx + dy * dy
      if (d2 < r2) cur[y * GW + x] += strength * (0.5 + 0.5 * Math.cos(Math.PI * Math.sqrt(d2) / r))
    }
    wake()
  }
  let energy = 0
  function step() {
    const w = GW, h = GH
    let e = 0
    for (let y = 1; y < h - 1; y++) {
      let i = y * w + 1
      for (let x = 1; x < w - 1; x++, i++) {
        const v = (cur[i - 1] + cur[i + 1] + cur[i - w] + cur[i + w]) * 0.5 - prev[i]
        prev[i] = v * 0.985; if (v > e) e = v; else if (-v > e) e = -v
      }
    }
    const tmp = cur; cur = prev; prev = tmp; energy = e
  }
  function encode() {
    const w = GW, h = GH, k = 34, kh = 160
    let n = 0
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++, n += 4) {
      const i = y * w + x
      const gx = (x > 0 && x < w - 1) ? cur[i + 1] - cur[i - 1] : 0
      const gy = (y > 0 && y < h - 1) ? cur[i + w] - cur[i - w] : 0
      let b = 128 + gx * k; norm[n] = b < 0 ? 0 : b > 255 ? 255 : b
      b = 128 + gy * k; norm[n + 1] = b < 0 ? 0 : b > 255 ? 255 : b
      b = 128 + cur[i] * kh; norm[n + 2] = b < 0 ? 0 : b > 255 ? 255 : b
      norm[n + 3] = 255
    }
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, waterTex)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, GW, GH, 0, gl.RGBA, gl.UNSIGNED_BYTE, norm)
  }
  // the stone is laid onto the picture once per size, never per frame
  function renderScene() {
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, bgTex)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bg)
    gl.activeTexture(gl.TEXTURE3); gl.bindTexture(gl.TEXTURE_2D, ddTex)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, dd)
    if (carve) { gl.activeTexture(gl.TEXTURE4); gl.bindTexture(gl.TEXTURE_2D, carveTex); gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, carve) }
    gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, sceneTex)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, W, H, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, sceneTex, 0)
    gl.viewport(0, 0, W, H); gl.useProgram(stoneProg); bindQuad(stoneProg!)
    gl.uniform1i(uS.bg, 0); gl.uniform1i(uS.dd, 3); gl.uniform1i(uS.carve, 4); gl.uniform1f(uS.hasCarve, carve ? 1 : 0); gl.uniform2f(uS.res, W, H); gl.uniform3f(uS.st, stone.x, stone.y, stone.r)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  }
  function draw() {
    gl.viewport(0, 0, W, H); gl.useProgram(waterProg); bindQuad(waterProg!)
    gl.uniform1i(uW.scene, 2); gl.uniform1i(uW.water, 1); gl.uniform1f(uW.aspect, W / H); gl.uniform3f(uW.edge, edge.x, edge.top, edge.bottom)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }
  function rebuild() {
    measure(); canvas.width = W; canvas.height = H
    drawComposition(); renderScene(); sizeGrid(); encode(); draw()
  }

  // Back to the still, on a fresh canvas: one that has held a WebGL context can't give a 2D one.
  function toStill() {
    if (lost) return
    lost = true
    cancelAnimationFrame(raf); raf = 0
    const fresh = document.createElement('canvas')
    fresh.setAttribute('aria-hidden', 'true')
    canvas.replaceWith(fresh)
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    canvas = fresh
    measure(); drawComposition(); still()
  }

  // ---- when it runs ----
  let raf = 0, last = 0, acc = 0, calm = 0, visible = false, seen = false, rainUntil = 0, nextRain = 0
  let rect: DOMRect | null = null
  // Touch screens are checked over their first running frames (the opening rain), leaving out the
  // first few, which carry the start-up: under 24 fps, or over 8ms of work a frame, and it's the still.
  const PROBE = 70, PROBE_SKIP = 10
  const probe = { frames: 0, dt: 0, work: 0 }
  function frame(now: number) {
    raf = 0
    if (lost || !visible || document.hidden) { last = 0; return }
    const t0 = performance.now()
    const dt = last ? Math.min(0.1, (now - last) / 1000) : 1 / 60; last = now
    if (now < rainUntil && now > nextRain) {
      nextRain = now + 600 + Math.random() * 800
      drop(6 + Math.random() * (GW - 12), 6 + Math.random() * (GH - 12), 1.8 + Math.random() * 2.4, 0.45 + Math.random() * 0.6)
    }
    acc += dt
    let steps = 0
    while (acc >= 1 / 60 && steps < 4) { step(); acc -= 1 / 60; steps++ }
    if (steps) { encode(); draw() }
    if (LITE && probe.frames < PROBE) {
      if (++probe.frames > PROBE_SKIP) { probe.dt += dt; probe.work += performance.now() - t0 }
      if (probe.frames === PROBE) {
        const n = PROBE - PROBE_SKIP
        if (probe.dt / n > 1 / 24 || probe.work / n > 8) { toStill(); return }
      }
    }
    calm = energy < 0.002 ? calm + steps : 0
    if (calm > 90 && now > rainUntil) { last = 0; return }          // still water: sleep until something stirs it
    raf = requestAnimationFrame(frame)
  }
  function wake() { if (!raf && !lost && visible && !document.hidden) raf = requestAnimationFrame(frame); calm = 0 }

  const io = new IntersectionObserver((es) => {
    visible = es[0].isIntersecting
    if (visible && !seen) {
      seen = true
      const now = performance.now()
      rainUntil = now + opts.rainSeconds * 1000; nextRain = now + 700
      drop(GW * 0.30, GH * 0.42, 4.5, 1.2); drop(GW * 0.72, GH * 0.60, 4.5, 1.2); drop(GW * 0.18, GH * 0.78, 3.5, 0.8)
    }
    if (visible) wake()
  }, { threshold: 0.2 })
  io.observe(host)
  const onVisibility = () => { if (!document.hidden) wake() }
  document.addEventListener('visibilitychange', onVisibility)
  const onScroll = () => { rect = null }
  window.addEventListener('scroll', onScroll, { passive: true })

  let lastP: [number, number] | null = null, lastT = 0
  function toGrid(e: { clientX: number; clientY: number }): [number, number] {
    if (!rect) rect = canvas.getBoundingClientRect()
    return [(e.clientX - rect.left) / rect.width * GW, (e.clientY - rect.top) / rect.height * GH]
  }
  // stirring: a mouse or pen as it moves over the water, a finger as it drags; a press drops a stone
  canvas.addEventListener('pointermove', (e) => {
    const g = toGrid(e), now = performance.now()
    if (lastP) {
      const dx = g[0] - lastP[0], dy = g[1] - lastP[1], dist = Math.sqrt(dx * dx + dy * dy)
      const strength = Math.min(0.9, 0.12 + dist / Math.max(1, now - lastT) * 5)
      const n = Math.max(1, Math.ceil(dist / 1.5))
      for (let k = 1; k <= n; k++) drop(lastP[0] + dx * k / n, lastP[1] + dy * k / n, 2.4, strength / Math.sqrt(n))
    }
    lastP = g; lastT = now
  })
  canvas.addEventListener('pointerleave', () => { lastP = null })
  canvas.addEventListener('pointerup', (e) => { if (e.pointerType === 'touch') lastP = null })
  canvas.addEventListener('pointercancel', () => { lastP = null })
  canvas.addEventListener('pointerdown', (e) => { const g = toGrid(e); drop(g[0], g[1], 4.5, 2.2); lastP = g; lastT = performance.now() })
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); toStill() })

  api.drop = (clientX, clientY) => {
    if (lost) return
    const g = toGrid({ clientX, clientY })
    drop(g[0], g[1], 5.5, 2.4)
  }
  const ro = new ResizeObserver(() => { if (!lost) { rect = null; rebuild() } else { measure(); drawComposition(); still() } })
  redraw = () => { if (!lost) { drawComposition(); renderScene(); draw() } else { drawComposition(); still() } }
  rebuild(); ro.observe(host)
  fontsReady().then(() => redraw(), () => {})
  if (!opts.under) settle()

  cleanups.unshift(() => {
    lost = true
    cancelAnimationFrame(raf); raf = 0
    io.disconnect(); ro.disconnect()
    document.removeEventListener('visibilitychange', onVisibility)
    window.removeEventListener('scroll', onScroll)
    gl.getExtension('WEBGL_lose_context')?.loseContext()
  })
  return api
}
