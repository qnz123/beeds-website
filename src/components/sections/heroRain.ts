// Paints the hero's rain rings onto a canvas, one per .hero-fx layer.
//
// The rings are still the CSS elements in Hero.tsx, animating transform and opacity on their own
// clock; the closing ripple's animation events still arm the headline's reveal. But they are made
// invisible, and each frame this draws every ring at its CSS animation's current point.
// Why: Firefox re-rasterises a scaling element at every step of its growth, and these rings are up
// to 1.6× the hero's width, so the rain ran at 2–4 fps there. A canvas the size of the hero costs the
// same in every browser however large the circles get.
//
// Each frame reads only the animations' own progress (no getComputedStyle, which made Firefox
// recompute styles every frame and pushed the draw past a 120Hz frame's 8ms) and applies the same
// easing curves the CSS declares, read once at the start.

type Ease = (x: number) => number
type RingSpec = {
  x: number; y: number; d: number; w: number; from: number; pal: string[]; a: number
  grow?: { anim: Animation; ease: Ease }
  fade?: { anim: Animation; ease: Ease; hold: number }
}
type Layer = { fx: HTMLElement; canvas: HTMLCanvasElement; rings: RingSpec[]; drawn: boolean }

const num = (v: string) => parseFloat(v) || 0

/** A CSS cubic-bezier(x1, y1, x2, y2) as a function of x (Newton's method, then bisection). */
function bezier(x1: number, y1: number, x2: number, y2: number): Ease {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by
  const sx = (t: number) => ((ax * t + bx) * t + cx) * t
  const sy = (t: number) => ((ay * t + by) * t + cy) * t
  const dx = (t: number) => (3 * ax * t + 2 * bx) * t + cx
  return (x) => {
    if (x <= 0) return 0
    if (x >= 1) return 1
    let t = x
    for (let i = 0; i < 6; i++) {
      const e = sx(t) - x, d = dx(t)
      if (Math.abs(e) < 1e-5) return sy(t)
      if (Math.abs(d) < 1e-6) break
      t -= e / d
    }
    let lo = 0, hi = 1
    t = x
    for (let i = 0; i < 20; i++) {
      const v = sx(t)
      if (Math.abs(v - x) < 1e-5) break
      if (v < x) lo = t; else hi = t
      t = (lo + hi) / 2
    }
    return sy(t)
  }
}

const NAMED: Record<string, Ease> = {
  linear: (x) => x,
  ease: bezier(0.25, 0.1, 0.25, 1),
  'ease-in': bezier(0.42, 0, 1, 1),
  'ease-out': bezier(0, 0, 0.58, 1),
  'ease-in-out': bezier(0.42, 0, 0.58, 1),
}

/** The easing functions of a comma-separated animation-timing-function list. */
function easings(list: string): Ease[] {
  const out: Ease[] = []
  for (const m of list.matchAll(/cubic-bezier\(([^)]+)\)|\b(linear|ease-in-out|ease-in|ease-out|ease)\b/g)) {
    if (m[1]) { const [a, b, c, d] = m[1].split(',').map(Number); out.push(bezier(a, b, c, d)) }
    else out.push(NAMED[m[2]])
  }
  return out
}

function readRings(fx: HTMLElement): RingSpec[] {
  return Array.from(fx.querySelectorAll<HTMLElement>('.hero-ring')).map((el) => {
    const cs = getComputedStyle(el), drop = getComputedStyle(el.parentElement!)
    const names = cs.animationName.split(',').map((s) => s.trim())
    const eases = easings(cs.animationTimingFunction)
    const anims = el.getAnimations() as CSSAnimation[]
    const spec: RingSpec = {
      x: num(drop.getPropertyValue('--x')) / 100,
      y: num(drop.getPropertyValue('--y')) / 100,
      d: num(cs.getPropertyValue('--d')) / 100,
      w: num(cs.getPropertyValue('--w')) || 1.5,
      from: num(cs.getPropertyValue('--from')),
      pal: cs.getPropertyValue('--pal').split(',').map((s) => s.trim()).filter(Boolean),
      a: num(cs.getPropertyValue('--a')) || 0.32,
    }
    names.forEach((n, i) => {
      const anim = anims.find((an) => an.animationName === n)
      if (!anim) return
      const ease = eases[i] ?? eases[0] ?? NAMED.linear
      if (n === 'hero-grow') spec.grow = { anim, ease }
      // hero-fade-slow holds its strength for the first 45%, then eases out over the rest
      else if (n.startsWith('hero-fade')) spec.fade = { anim, ease, hold: n === 'hero-fade-slow' ? 0.45 : 0 }
    })
    return spec
  })
}

/** An animation's un-eased progress: null before it starts, 1 once it has run (fill: forwards). */
function progress(anim: Animation): number | null {
  return anim.effect?.getComputedTiming().progress ?? null
}

/** Starts painting; returns a stop. Stops on its own once every ring's animation has finished. */
export function paintRain(fxs: HTMLElement[]): () => void {
  const layers: Layer[] = []
  for (const fx of fxs) {
    const canvas = fx.querySelector<HTMLCanvasElement>('canvas.hero-rain')
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx || typeof ctx.createConicGradient !== 'function') continue
    const rings = readRings(fx)
    // without its animations to read there is nothing to paint from; leave the CSS rings showing
    if (!rings.length || rings.some((r) => !r.grow || !r.fade)) continue
    layers.push({ fx, canvas, rings, drawn: false })
  }
  if (!layers.length) return () => {}
  for (const l of layers) l.fx.classList.add('painted')

  // Resolution adapts to the browser: full retina sharpness where the canvas draws fast (Chrome,
  // Safari), stepping down to 1.5× and then 1× if the first frames with rings on them take longer
  // than half a 120Hz frame to draw. Firefox paints conic gradients slowly enough at 2× (5–10ms)
  // to miss frames, and at 1× it draws in ~2ms. The step is taken in the first fraction of a
  // second, while only the small first rings are out.
  const STEPS = [2, 1.5, 1]
  let step = STEPS.findIndex((v) => v <= Math.min(2, window.devicePixelRatio || 1))
  if (step < 0) step = STEPS.length - 1
  let spent = 0, timed = 0
  let raf = 0, frame = 0
  const draw = () => {
    const t0 = performance.now()
    const dpr = STEPS[step]
    let painted = false
    for (const layer of layers) {
      const { fx, canvas, rings } = layer
      // this frame's rings first: a layer with nothing on it now or last frame is left alone
      const live: { r: RingSpec; s: number; a: number }[] = []
      for (const r of rings) {
        const pg = progress(r.grow!.anim), pf = progress(r.fade!.anim)
        if (pg === null || pf === null) continue
        const f = r.fade!
        const k = pf <= f.hold ? 0 : f.ease((pf - f.hold) / (1 - f.hold))
        const a = r.a * (1 - k)
        if (a > 0.002) live.push({ r, s: 0.02 + 0.98 * r.grow!.ease(pg), a })
      }
      if (!live.length && !layer.drawn) continue
      const W = fx.clientWidth, H = fx.clientHeight
      if (canvas.width !== Math.round(W * dpr) || canvas.height !== Math.round(H * dpr)) {
        canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr)
      }
      const ctx = canvas.getContext('2d')!
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)
      for (const { r, s, a } of live) {
        const D = r.d * W, cx = r.x * W, cy = r.y * H
        // a newborn ring's rim scales to a fraction of a pixel; the browser still shows the CSS one as a
        // faint hairline, so the stroke keeps at least that
        const lw = Math.max(0.8, r.w * s), R = (D / 2 - r.w / 2) * s
        if (R <= 0) continue
        // CSS conic-gradient starts at 12 o'clock; canvas at 3 o'clock
        const g = ctx.createConicGradient(((r.from - 90) * Math.PI) / 180, cx, cy)
        r.pal.forEach((c, i) => g.addColorStop(i / Math.max(1, r.pal.length - 1), c))
        ctx.globalAlpha = a
        ctx.strokeStyle = g
        ctx.lineWidth = lw
        ctx.beginPath()
        ctx.arc(cx, cy, R, 0, Math.PI * 2)
        ctx.stroke()
      }
      ctx.globalAlpha = 1
      layer.drawn = live.length > 0
      painted ||= live.length > 0
    }
    if (painted && step < STEPS.length - 1) {
      spent += performance.now() - t0
      if (++timed === 12) {
        if (spent / timed > 4) step++
        spent = 0; timed = 0
      }
    }
    // every half second or so, see whether any ring still has somewhere to go
    if (frame++ % 30 === 0) {
      const running = layers.some((l) => l.rings.some((r) => r.grow!.anim.playState !== 'finished' || r.fade!.anim.playState !== 'finished'))
      if (!running) { stop(false); return }
    }
    raf = requestAnimationFrame(draw)
  }
  const stop = (clear = true) => {
    cancelAnimationFrame(raf)
    for (const l of layers) {
      if (clear) {
        l.fx.classList.remove('painted')
        l.canvas.getContext('2d')?.clearRect(0, 0, l.canvas.width, l.canvas.height)
      }
    }
  }
  raf = requestAnimationFrame(draw)
  return () => stop(true)
}
