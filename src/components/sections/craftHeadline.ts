// The CRAFT headline for the Impact section: SVG markup plus the script that plays it.
//
// Choreography: the R draws first; the C closes into a solid disc that shoots a Polaroid
// out on a slant (spinning twice) and pockets it again; then A, F and the T — first as a +
// level with the F's middle arm — snap in. The wave rolls up from the bottom edge and back,
// three stars pop out of the F and burst above the T, a cellphone becomes the T's upright,
// and the sunglasses drop onto the A last.
//
// Rule: assets never change size and never fade. They are only ever hidden by a letter
// (the masks), by the edge of the headline area (overflow: hidden), or gone in a burst.
// Every id is prefixed "ic-" so the defs cannot collide with anything else on the page.

export const CRAFT_SVG = "<defs>\n<filter id=\"ic-stk-cut\" x=\"-25%\" y=\"-25%\" width=\"150%\" height=\"150%\" color-interpolation-filters=\"sRGB\">\n<feMorphology in=\"SourceAlpha\" operator=\"dilate\" radius=\"4.5\" result=\"grow\" />\n<feFlood flood-color=\"#ffffff\" /><feComposite in2=\"grow\" operator=\"in\" result=\"cut\" />\n<feOffset in=\"grow\" dx=\"0\" dy=\"3\" result=\"drop\" /><feGaussianBlur in=\"drop\" stdDeviation=\"2.4\" result=\"dropb\" />\n<feFlood flood-color=\"#151412\" flood-opacity=\".22\" /><feComposite in2=\"dropb\" operator=\"in\" result=\"shadow\" />\n<feMerge><feMergeNode in=\"shadow\" /><feMergeNode in=\"cut\" /><feMergeNode in=\"SourceGraphic\" /></feMerge>\n</filter>\n<pattern id=\"ic-dots\" width=\"6\" height=\"6\" patternUnits=\"userSpaceOnUse\"><circle cx=\"3\" cy=\"3\" r=\"1.25\" fill=\"#151412\" opacity=\".2\" /></pattern>\n<linearGradient id=\"ic-lens-fade\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#111111\" stop-opacity=\".96\" /><stop offset=\".55\" stop-color=\"#111111\" stop-opacity=\".72\" /><stop offset=\"1\" stop-color=\"#111111\" stop-opacity=\".22\" /></linearGradient>\n<linearGradient id=\"ic-sunset\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#ef4a2f\" /><stop offset=\".55\" stop-color=\"#f58a2a\" /><stop offset=\"1\" stop-color=\"#f5c518\" /></linearGradient>\n<filter id=\"ic-grain\" x=\"-12%\" y=\"-25%\" width=\"124%\" height=\"150%\" color-interpolation-filters=\"sRGB\">\n<feTurbulence type=\"fractalNoise\" baseFrequency=\"1.15\" numOctaves=\"2\" seed=\"4\" result=\"n\" />\n<feColorMatrix in=\"n\" type=\"matrix\" values=\"1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 1\" result=\"mono\" />\n<feComposite in=\"SourceGraphic\" in2=\"mono\" operator=\"arithmetic\" k1=\"0\" k2=\"1\" k3=\"0.3\" k4=\"-0.12\" result=\"g\" />\n<feComposite in=\"g\" in2=\"SourceAlpha\" operator=\"in\" />\n</filter>\n<clipPath id=\"ic-capline\"><rect x=\"-200\" y=\"-70\" width=\"800\" height=\"70\" /></clipPath>\n<mask id=\"ic-c-pocket\" maskUnits=\"userSpaceOnUse\" x=\"-600\" y=\"-600\" width=\"1600\" height=\"1400\">\n<rect x=\"-600\" y=\"-600\" width=\"1600\" height=\"1400\" fill=\"#fff\" /><circle id=\"ic-c-pocket-disc\" cx=\"35\" cy=\"-35\" r=\"35\" fill=\"#000\" />\n</mask>\n<mask id=\"ic-f-pocket\" maskUnits=\"userSpaceOnUse\" x=\"-600\" y=\"-600\" width=\"1600\" height=\"1400\">\n<rect x=\"-600\" y=\"-600\" width=\"1600\" height=\"1400\" fill=\"#fff\" /><rect x=\"222\" y=\"-70\" width=\"52\" height=\"400\" fill=\"#000\" />\n</mask>\n</defs>\n<g class=\"ink\" clip-path=\"url(#ic-capline)\">\n<g class=\"lt\" data-ch=\"C\">\n<path class=\"draw\" id=\"ic-c-arc\" pathLength=\"1\" d=\"M57.2 -53.6 A29 29 0 1 0 57.2 -16.4\" style=\"--d: 380ms; --dur: 320ms\" />\n</g>\n<g class=\"lt\" data-ch=\"R\">\n<path class=\"rise\" d=\"M86 -64 L86 -6\" style=\"transform-origin: 86px 0px; --d: 0ms; --dur: 220ms\" />\n<path class=\"draw\" pathLength=\"1\" d=\"M86 -64 L108 -64 A17 17 0 0 1 108 -30 L86 -30\" style=\"--d: 120ms; --dur: 200ms\" />\n<path class=\"draw\" pathLength=\"1\" d=\"M106 -27 L131 5\" style=\"--d: 220ms; --dur: 180ms\" />\n</g>\n<g class=\"lt join\" style=\"--jx: 60px; --dj: 2300ms\" data-ch=\"A\">\n<path class=\"draw\" pathLength=\"1\" d=\"M150 4 L178 -67.5 L206 4\" style=\"--d: 2320ms; --dur: 280ms\" />\n</g>\n<g class=\"lt join\" style=\"--jx: 110px; --dj: 2360ms\" data-ch=\"F\">\n<path class=\"draw\" pathLength=\"1\" d=\"M230 -64 L230 -6\" style=\"--d: 2380ms; --dur: 200ms\" />\n<path class=\"draw\" pathLength=\"1\" d=\"M230 -64 L266 -64\" style=\"--d: 2480ms; --dur: 160ms\" />\n<path class=\"draw\" pathLength=\"1\" d=\"M230 -36 L258 -36\" style=\"--d: 2520ms; --dur: 160ms\" />\n</g>\n<g class=\"lt\" data-ch=\"T\">\n<path class=\"tt\" id=\"ic-t-stem\" pathLength=\"1\" d=\"M322 -64 L322 -6\" />\n<path class=\"tt\" id=\"ic-t-bar\" pathLength=\"1\" d=\"M348 -64 L296 -64\" />\n</g>\n</g>\n<circle class=\"c-ring\" id=\"ic-c-ring\" cx=\"35\" cy=\"-35\" r=\"29\" pathLength=\"360\" />\n<g class=\"shades\" id=\"ic-shades\" transform=\"translate(178 -70)\">\n<path d=\"M -28.20 -0.47 L -30.08 0.94 M 28.20 -0.47 L 30.08 0.94\" fill=\"none\" stroke=\"#111111\" stroke-width=\"2.4\" stroke-linecap=\"round\" />\n<path d=\"M -27.26 0.47 C -27.26 -1.41 -25.85 -2.35 -23.97 -2.35 L -3.76 -2.35 C -1.88 -2.35 -0.94 -0.94 -1.41 0.94 L -3.29 11.28 C -4.23 15.98 -7.52 18.33 -11.75 18.33 L -18.33 18.33 C -23.03 18.33 -25.85 15.51 -26.32 11.28 Z M -23.03 1.41 L -5.17 1.41 L -6.58 10.81 C -7.28 14.10 -9.40 15.51 -12.22 15.51 L -17.86 15.51 C -21.15 15.51 -23.03 13.63 -23.26 10.81 Z\" fill=\"#111111\" fill-rule=\"evenodd\" />\n<path d=\"M 27.26 0.47 C 27.26 -1.41 25.85 -2.35 23.97 -2.35 L 3.76 -2.35 C 1.88 -2.35 0.94 -0.94 1.41 0.94 L 3.29 11.28 C 4.23 15.98 7.52 18.33 11.75 18.33 L 18.33 18.33 C 23.03 18.33 25.85 15.51 26.32 11.28 Z M 23.03 1.41 L 5.17 1.41 L 6.58 10.81 C 7.28 14.10 9.40 15.51 12.22 15.51 L 17.86 15.51 C 21.15 15.51 23.03 13.63 23.26 10.81 Z\" fill=\"#111111\" fill-rule=\"evenodd\" />\n<path d=\"M -23.03 1.41 L -5.17 1.41 L -6.58 10.81 C -7.28 14.10 -9.40 15.51 -12.22 15.51 L -17.86 15.51 C -21.15 15.51 -23.03 13.63 -23.26 10.81 Z\" fill=\"url(#ic-lens-fade)\" />\n<path d=\"M 23.03 1.41 L 5.17 1.41 L 6.58 10.81 C 7.28 14.10 9.40 15.51 12.22 15.51 L 17.86 15.51 C 21.15 15.51 23.03 13.63 23.26 10.81 Z\" fill=\"url(#ic-lens-fade)\" />\n<path d=\"M -2.82 1.41 Q 0.00 -1.88 2.82 1.41\" fill=\"none\" stroke=\"#111111\" stroke-width=\"2.4\" stroke-linecap=\"round\" />\n</g>\n<g mask=\"url(#ic-c-pocket)\">\n<g class=\"asset\" id=\"ic-pola\" transform=\"translate(35 -35) rotate(-30) scale(0.43) translate(-43 -50)\">\n<g filter=\"url(#ic-stk-cut)\">\n<rect x=\"0\" y=\"0\" width=\"86\" height=\"100\" rx=\"2\" fill=\"#fffdf7\" />\n<clipPath id=\"ic-pol-photo\"><rect x=\"8\" y=\"8\" width=\"70\" height=\"64\" /></clipPath>\n<rect x=\"8\" y=\"8\" width=\"70\" height=\"64\" fill=\"#ebe4d8\" />\n<image href=\"/impact/phase-2.jpg\" x=\"-22\" y=\"-18.5\" width=\"130\" height=\"162.5\" preserveAspectRatio=\"xMidYMid slice\" clip-path=\"url(#ic-pol-photo)\" />\n<path d=\"M14 86 C22 80 28 90 36 84 S50 82 56 86\" fill=\"none\" stroke=\"#9b958a\" stroke-width=\"1.6\" stroke-linecap=\"round\" />\n</g>\n</g>\n</g>\n<circle class=\"c-glint\" id=\"ic-c-glint\" cx=\"35\" cy=\"-35\" r=\"6\" />\n<g class=\"star-burst\" id=\"ic-star-burst\"></g>\n<g class=\"asset\" id=\"ic-wave\" transform=\"translate(214 400) rotate(-7) scale(0.875) translate(-56 -43)\">\n<g filter=\"url(#ic-stk-cut)\">\n<path id=\"ic-wave-body\" d=\"M4 74 L4 56 C10 36 28 16 56 12 C82 9 102 22 106 40 C98 31 86 29 78 35 C70 41 71 53 81 56 C89 58 95 53 97 48 C102 60 95 72 82 74 Z\" fill=\"#2fb4d9\" />\n<path d=\"M4 74 L4 64 C30 57 60 67 101 60 C99 68 92 73 82 74 Z\" fill=\"#1c86ad\" />\n<path d=\"M4 74 L4 56 C10 36 28 16 56 12 C82 9 102 22 106 40 C98 31 86 29 78 35 C70 41 71 53 81 56 C89 58 95 53 97 48 C102 60 95 72 82 74 Z\" fill=\"url(#ic-dots)\" />\n<path d=\"M10 54 C18 38 32 24 54 20 C76 17 94 26 99 38\" fill=\"none\" stroke=\"#fff\" stroke-width=\"3.2\" stroke-linecap=\"round\" />\n<path d=\"M100 42 C92 34 80 34 76 42 C73 49 79 55 86 53 C90 52 92 48 90 45\" fill=\"none\" stroke=\"#151412\" stroke-width=\"3\" stroke-linecap=\"round\" />\n<circle cx=\"62\" cy=\"8\" r=\"2.4\" fill=\"#fff\" /><circle cx=\"72\" cy=\"6\" r=\"1.7\" fill=\"#fff\" /><circle cx=\"104\" cy=\"31\" r=\"2.2\" fill=\"#fff\" />\n</g>\n</g>\n<g mask=\"url(#ic-f-pocket)\">\n<g class=\"asset star\" id=\"ic-star-a\" transform=\"translate(332 -112) rotate(6) scale(0.5) translate(-48 -43)\">\n<g filter=\"url(#ic-stk-cut)\">\n<path d=\"M48 10 L56.82 33.87 L82.24 34.88 L62.27 50.64 L69.16 75.12 L48 61 L26.84 75.12 L33.73 50.64 L13.76 34.88 L39.18 33.87 Z\" fill=\"#ef4a2f\" stroke=\"#151412\" stroke-width=\"3\" stroke-linejoin=\"round\" />\n<path d=\"M48 10 L56.82 33.87 L82.24 34.88 L62.27 50.64 L69.16 75.12 L48 61 L26.84 75.12 L33.73 50.64 L13.76 34.88 L39.18 33.87 Z\" fill=\"url(#ic-dots)\" />\n</g>\n</g>\n<g class=\"asset star\" id=\"ic-star-b\" transform=\"translate(302 -132) rotate(-10) scale(0.36) translate(-48 -43)\">\n<g filter=\"url(#ic-stk-cut)\">\n<path d=\"M48 10 L56.82 33.87 L82.24 34.88 L62.27 50.64 L69.16 75.12 L48 61 L26.84 75.12 L33.73 50.64 L13.76 34.88 L39.18 33.87 Z\" fill=\"#f5c518\" stroke=\"#151412\" stroke-width=\"3\" stroke-linejoin=\"round\" />\n<path d=\"M48 10 L56.82 33.87 L82.24 34.88 L62.27 50.64 L69.16 75.12 L48 61 L26.84 75.12 L33.73 50.64 L13.76 34.88 L39.18 33.87 Z\" fill=\"url(#ic-dots)\" />\n</g>\n</g>\n<g class=\"asset star\" id=\"ic-star-c\" transform=\"translate(358 -140) rotate(14) scale(0.26) translate(-48 -43)\">\n<g filter=\"url(#ic-stk-cut)\">\n<path d=\"M48 10 L56.82 33.87 L82.24 34.88 L62.27 50.64 L69.16 75.12 L48 61 L26.84 75.12 L33.73 50.64 L13.76 34.88 L39.18 33.87 Z\" fill=\"#2fb4d9\" stroke=\"#151412\" stroke-width=\"3\" stroke-linejoin=\"round\" />\n<path d=\"M48 10 L56.82 33.87 L82.24 34.88 L62.27 50.64 L69.16 75.12 L48 61 L26.84 75.12 L33.73 50.64 L13.76 34.88 L39.18 33.87 Z\" fill=\"url(#ic-dots)\" />\n</g>\n</g>\n</g>\n<g class=\"asset\" id=\"ic-phone\" transform=\"translate(404 400) rotate(12) translate(-27 -48)\">\n<g class=\"ph-art\" filter=\"url(#ic-stk-cut)\">\n<rect x=\"0\" y=\"0\" width=\"54\" height=\"96\" rx=\"9\" fill=\"#151412\" />\n<rect x=\"4\" y=\"12\" width=\"46\" height=\"72\" rx=\"3\" fill=\"url(#ic-sunset)\" />\n<rect x=\"4\" y=\"12\" width=\"46\" height=\"72\" rx=\"3\" fill=\"url(#ic-dots)\" />\n<rect x=\"21\" y=\"5\" width=\"12\" height=\"2.6\" rx=\"1.3\" fill=\"#4a4845\" /><circle cx=\"15\" cy=\"6.3\" r=\"1.4\" fill=\"#4a4845\" />\n<rect x=\"20\" y=\"89\" width=\"14\" height=\"2.4\" rx=\"1.2\" fill=\"#4a4845\" />\n<circle cx=\"27\" cy=\"48\" r=\"12.5\" fill=\"#fffdf7\" />\n<path d=\"M23.5 41.5 L34 48 L23.5 54.5 Z\" fill=\"#ef4a2f\" />\n<path d=\"M8 16 L19 16 L8 33 Z\" fill=\"#fff\" opacity=\".28\" />\n<circle cx=\"52\" cy=\"10\" r=\"9.5\" fill=\"#fffdf7\" stroke=\"#151412\" stroke-width=\"2\" />\n<path d=\"M52 14.6 C47.6 11.4 46.4 9.6 46.8 7.8 C47.3 5.8 49.9 5.3 52 7.4 C54.1 5.3 56.7 5.8 57.2 7.8 C57.6 9.6 56.4 11.4 52 14.6 Z\" fill=\"#ef4a2f\" />\n</g>\n<rect class=\"ph-shade\" id=\"ic-ph-shade\" x=\"-5\" y=\"-5\" width=\"76\" height=\"0\" rx=\"13\" />\n</g>\n<rect class=\"ph-ink\" id=\"ic-ph-ink\" x=\"316\" y=\"-70\" width=\"12\" height=\"70\" />"

const clamp = (x: number) => Math.min(1, Math.max(0, x))
const seg = (t: number, a: number, b: number) => clamp((t - a) / (b - a))
const inOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
const out = (x: number) => 1 - Math.pow(1 - x, 3)
const inn = (x: number) => x * x * x
const mix = (a: number, b: number, x: number) => a + (b - a) * x
const bez = (a: number, b: number, c: number, u: number) => (1 - u) * (1 - u) * a + 2 * u * (1 - u) * b + u * u * c

// Easing follows what each thing is doing: arriving → out, leaving or falling → in, travelling → in-out.
const TL = {
  c: { close: [700, 840], fill: [840, 980], peek: [980, 1200], swell: [1200, 1340], flash: [1200, 1380], fly: [1340, 1780], back: [1780, 2000], shrink: [2000, 2140], unfill: [2140, 2280], open: [2220, 2380] },
  tee: { stem: [2440, 2600], bar: [2500, 2700], morph: [3320, 3600] },
  wave: { rise: [2520, 2800], sink: [3120, 3360] },
  stars: { pop: [2720, 3240], gap: 90, burst: 3380, burstGap: 70 },
  phone: { rise: [2620, 2880], fly: [3100, 3320], shade: [3180, 3320], morph: [3320, 3600] },
  shades: { drop: [3600, 3880], swing: [3880, 4280] },
} as const
export const CRAFT_END = 4320
export const CRAFT_SETTLE = 4300

type Span = readonly [number, number]
const sg = (t: number, s: Span) => seg(t, s[0], s[1])

/** Puts every part in its finished place (also the reduced-motion / no-JS picture). */
export function restCraft(wrap: HTMLElement) {
  const q = (id: string) => wrap.querySelector<SVGGraphicsElement>('#ic-' + id)
  for (const id of ['pola', 'c-glint', 'c-ring', 'wave', 'phone', 'ph-ink', 'star-a', 'star-b', 'star-c']) q(id)?.style.setProperty('visibility', 'hidden')
  wrap.querySelectorAll<SVGPathElement>('#ic-star-burst path').forEach((p) => (p.style.visibility = 'hidden'))
  q('c-pocket-disc')?.setAttribute('r', '35')
  const arc = q('c-arc')
  if (arc) arc.style.visibility = ''
  const shades = q('shades')
  if (shades) { shades.style.visibility = ''; shades.setAttribute('transform', 'translate(178 -70)') }
  const stem = q('t-stem'), bar = q('t-bar')
  stem?.setAttribute('d', 'M322 -64 L322 -6'); bar?.setAttribute('d', 'M348 -64 L296 -64')
  for (const el of [stem, bar]) if (el) { el.style.strokeDasharray = ''; el.style.strokeDashoffset = ''; el.style.visibility = '' }
}

/** Plays the headline once. Returns a cleanup that stops it and leaves the finished word. */
export function playCraft(wrap: HTMLElement, svg: SVGSVGElement, onSettled: () => void): () => void {
  const q = (id: string) => wrap.querySelector('#ic-' + id) as SVGGraphicsElement
  const show = (el: SVGElement, on: boolean) => { el.style.visibility = on ? 'visible' : 'hidden' }
  const place = (el: Element, x: number, y: number, r: number, s: number, ox: number, oy: number) =>
    el.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${r.toFixed(2)})${s === 1 ? '' : ` scale(${s})`} translate(${-ox} ${-oy})`)

  // the edges of the headline area in word units — assets enter and leave across them
  const inv = svg.getScreenCTM()?.inverse()
  const box = wrap.getBoundingClientRect()
  const TOP = inv ? new DOMPoint(0, box.top).matrixTransform(inv).y : -260
  const BOTTOM = inv ? new DOMPoint(0, box.bottom).matrixTransform(inv).y : 240

  // ── C: closes into a disc that shoots the photo out on a slant and pockets it again ──
  const cArc = q('c-arc'), cRing = q('c-ring'), glint = q('c-glint'), pocketDisc = q('c-pocket-disc'), pola = q('pola')
  const DIR = [-Math.sin(Math.PI / 6), -Math.cos(Math.PI / 6)], TILT = -30
  function cAt(t: number) {
    const C = TL.c
    const ringOn = t >= C.close[0] && t < C.open[1]
    show(cRing, ringOn); cArc.style.visibility = ringOn ? 'hidden' : ''
    if (ringOn) {
      const L = t < C.unfill[0] ? mix(280, 360, inOut(sg(t, C.close))) : mix(360, 280, inOut(sg(t, C.open)))
      const f = t < C.unfill[0] ? inOut(sg(t, C.fill)) : 1 - inOut(sg(t, C.unfill))
      const k = 1 + 0.14 * (t < C.shrink[0] ? out(sg(t, C.swell)) : 1 - inOut(sg(t, C.shrink))) // swells to shoot the photo out
      cRing.setAttribute('r', mix(29, 17.5, f).toFixed(2)); cRing.style.strokeWidth = mix(12, 35, f).toFixed(2)
      cRing.style.strokeDasharray = L >= 359.9 ? 'none' : `${L.toFixed(2)} ${(360 - L).toFixed(2)}`
      cRing.style.strokeDashoffset = (-(180 - L / 2)).toFixed(2)
      cRing.setAttribute('transform', `translate(35 -35) scale(${k.toFixed(3)}) translate(-35 35)`)
      pocketDisc.setAttribute('r', (35 * k).toFixed(2))
    }
    let d = 0, r: number = TILT // distance along the slant: 0 inside the disc, 36 half out, 150 far out
    if (t >= C.peek[0] && t < C.fly[0]) d = mix(0, 36, out(sg(t, C.peek)))
    else if (t >= C.fly[0] && t < C.back[0]) { const u = sg(t, C.fly); d = mix(36, 150, out(u)); r = TILT - 720 * inOut(u) }
    else if (t >= C.back[0] && t < C.back[1]) d = mix(150, 0, inn(sg(t, C.back)))
    show(pola, t >= C.peek[0] && t < C.back[1])
    place(pola, 35 + DIR[0] * d, -35 + DIR[1] * d, r, 0.43, 43, 50)
    const g = seg(t, C.flash[0], C.flash[0] + 200)
    show(glint, g > 0 && g < 1); glint.setAttribute('r', mix(4, 30, out(g)).toFixed(2))
  }

  // ── T: a + first (crossbar level with the F's middle arm, reaching further left), then the T ──
  const tStem = q('t-stem'), tBar = q('t-bar')
  const PLUS = { stem: [-53, -19], x2: 280, y: -36 }, TEE = { stem: [-64, -6], x2: 296, y: -64 }
  function teeAt(t: number) {
    const m = inOut(sg(t, TL.tee.morph))
    tStem.setAttribute('d', `M322 ${mix(PLUS.stem[0], TEE.stem[0], m).toFixed(2)} L322 ${mix(PLUS.stem[1], TEE.stem[1], m).toFixed(2)}`)
    const y = mix(PLUS.y, TEE.y, m)
    tBar.setAttribute('d', `M348 ${y.toFixed(2)} L${mix(PLUS.x2, TEE.x2, m).toFixed(2)} ${y.toFixed(2)}`)
    for (const [el, span] of [[tStem, TL.tee.stem], [tBar, TL.tee.bar]] as const) {
      el.style.strokeDasharray = '1'; el.style.strokeDashoffset = (1 - inOut(sg(t, span))).toFixed(3)
      el.style.visibility = t < span[0] ? 'hidden' : ''
    }
  }

  // ── sunglasses: drop from the top edge, catch on the A's tip, swing to rest ──
  const shades = q('shades')
  function shadesAt(t: number) {
    const S = TL.shades
    if (t < S.drop[0]) { shades.style.visibility = 'hidden'; return }
    shades.style.visibility = ''
    const y = mix(TOP - 30, -70, inn(sg(t, S.drop)))
    const w = sg(t, S.swing), r = t < S.swing[0] ? 0 : 8 * Math.exp(-4 * w) * Math.sin(w * Math.PI * 3.2) * (1 - w)
    shades.setAttribute('transform', `translate(178 ${y.toFixed(2)}) rotate(${r.toFixed(2)})`)
  }

  // ── wave: rolls up from the bottom edge under the A and F, then back down ──
  const wave = q('wave')
  function waveAt(t: number) {
    const W = TL.wave, off = BOTTOM + 50, rest = 58
    const y = t < W.sink[0] ? mix(off, rest, out(sg(t, W.rise))) : mix(rest, off, inn(sg(t, W.sink)))
    show(wave, t >= W.rise[0] && t < W.sink[1])
    place(wave, 214, y, -7, 0.875, 56, 43)
  }

  // ── cellphone: rises from the bottom edge, flies to the +, is shaded black, becomes the upright ──
  const phone = q('phone'), phShade = q('ph-shade'), phInk = q('ph-ink')
  const HANG = [404, -46], BOX = { w: 76, h: 107, rx: 13, dx: 6, dy: 0.5 }
  function phoneAt(t: number) {
    const P = TL.phone
    let x = HANG[0], y = HANG[1], r = 12
    if (t < P.fly[0]) y = mix(BOTTOM + 70, HANG[1], out(sg(t, P.rise)))
    else { const f = inOut(sg(t, P.fly)); x = mix(HANG[0], 322 - BOX.dx, f); y = mix(HANG[1], -35 - BOX.dy, f); r = mix(12, 0, f) }
    show(phone, t >= P.rise[0] && t < P.morph[0])
    place(phone, x, y, r, 1, 27, 48)
    phShade.setAttribute('height', (BOX.h * out(sg(t, P.shade))).toFixed(2))
    const m = inOut(sg(t, P.morph))
    show(phInk, t >= P.morph[0] && t < P.morph[1] + 30)
    const w = mix(BOX.w, 12, m), h = mix(BOX.h, 70, m)
    phInk.setAttribute('x', (322 - w / 2).toFixed(2)); phInk.setAttribute('y', (-35 - h / 2).toFixed(2))
    phInk.setAttribute('width', w.toFixed(2)); phInk.setAttribute('height', h.toFixed(2)); phInk.setAttribute('rx', mix(BOX.rx, 0, m).toFixed(2))
  }

  // ── stars: pop up out of the F, curve right above the T, then burst into rays of their own colour ──
  const burstBox = q('star-burst')
  const STARS = [
    { el: q('star-a'), s: 0.5, from: [248, -40], via: [244, -168], to: [332, -112], r: 6 },
    { el: q('star-b'), s: 0.36, from: [242, -36], via: [232, -190], to: [302, -132], r: -10 },
    { el: q('star-c'), s: 0.26, from: [254, -36], via: [262, -200], to: [358, -140], r: 14 },
  ].map((S, i) => {
    const col = S.el.querySelector('path')?.getAttribute('fill') ?? '#111111', R = 42 * S.s
    const lines = Array.from({ length: 8 }, (_, k) => {
      const a = (k / 8) * Math.PI * 2 + i * 0.3, c = Math.cos(a), n = Math.sin(a)
      const ln = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      ln.setAttribute('pathLength', '1')
      ln.setAttribute('d', `M${(S.to[0] + c * R * 0.55).toFixed(2)} ${(S.to[1] + n * R * 0.55).toFixed(2)} L${(S.to[0] + c * R * 1.6).toFixed(2)} ${(S.to[1] + n * R * 1.6).toFixed(2)}`)
      ln.style.stroke = col; ln.style.strokeWidth = (1.4 + 3.2 * S.s).toFixed(2)
      burstBox.appendChild(ln)
      return ln
    })
    return { ...S, lines, burstAt: TL.stars.burst + i * TL.stars.burstGap }
  })
  function starsAt(t: number) {
    STARS.forEach((S, i) => {
      const t0s = TL.stars.pop[0] + i * TL.stars.gap
      const u = out(seg(t, t0s, TL.stars.pop[1] + i * TL.stars.gap))
      show(S.el, t >= t0s && t < S.burstAt)
      place(S.el, bez(S.from[0], S.via[0], S.to[0], u), bez(S.from[1], S.via[1], S.to[1], u), S.r - 200 * (1 - u), S.s, 48, 43)
      const a1 = seg(t, S.burstAt, S.burstAt + 110), z = seg(t, S.burstAt + 110, S.burstAt + 250)
      S.lines.forEach((ln) => {
        show(ln, a1 > 0 && z < 1)
        ln.style.strokeDasharray = z > 0 ? `${(1 - z).toFixed(3)} 2` : '1 2'
        ln.style.strokeDashoffset = z > 0 ? (-z).toFixed(3) : (1 - out(a1)).toFixed(3)
      })
    })
  }

  let raf = 0
  const t0 = performance.now()
  const frame = (now: number) => {
    const t = now - t0
    cAt(t); teeAt(t); shadesAt(t); waveAt(t); phoneAt(t); starsAt(t)
    if (t < CRAFT_END) raf = requestAnimationFrame(frame)
    else restCraft(wrap)
  }
  frame(t0)
  cancelAnimationFrame(raf)
  raf = requestAnimationFrame(frame)
  const settle = window.setTimeout(onSettled, CRAFT_SETTLE)

  return () => {
    cancelAnimationFrame(raf)
    window.clearTimeout(settle)
    STARS.forEach((S) => S.lines.forEach((ln) => ln.remove()))
    restCraft(wrap)
  }
}
