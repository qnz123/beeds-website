// Paints the hero's rain rings onto a canvas, one per .hero-fx layer.
//
// The rings are still the CSS elements in Hero.tsx, animating transform and opacity on their own
// clock; the closing ripple's animation events still arm the headline's reveal. But they are made
// invisible, and each frame this copies every ring's live scale and opacity onto the layer's canvas.
// Why: Firefox re-rasterises a scaling element at every step of its growth, and these rings are up
// to 1.6× the hero's width, so the rain ran at 2–4 fps there. A canvas the size of the hero costs the
// same in every browser however large the circles get.

type RingSpec = { el: HTMLElement; x: number; y: number; d: number; w: number; from: number; pal: string[] }
type Layer = { fx: HTMLElement; canvas: HTMLCanvasElement; rings: RingSpec[] }

const num = (v: string) => parseFloat(v) || 0

function readRings(fx: HTMLElement): RingSpec[] {
  return Array.from(fx.querySelectorAll<HTMLElement>('.hero-ring')).map((el) => {
    const cs = getComputedStyle(el), drop = getComputedStyle(el.parentElement!)
    return {
      el,
      x: num(drop.getPropertyValue('--x')) / 100,
      y: num(drop.getPropertyValue('--y')) / 100,
      d: num(cs.getPropertyValue('--d')) / 100,
      w: num(cs.getPropertyValue('--w')) || 1.5,
      from: num(cs.getPropertyValue('--from')),
      pal: cs.getPropertyValue('--pal').split(',').map((s) => s.trim()).filter(Boolean),
    }
  })
}

/** The ring's live scale, from its computed transform (matrix(a, b, c, d, e, f): a is the scale). */
function scaleOf(cs: CSSStyleDeclaration) {
  const m = /matrix\(([^,]+)/.exec(cs.transform)
  return m ? Math.abs(parseFloat(m[1])) : 1
}

/** Starts painting; returns a stop. Stops on its own once every ring's animation has finished. */
export function paintRain(fxs: HTMLElement[]): () => void {
  const layers: Layer[] = []
  for (const fx of fxs) {
    const canvas = fx.querySelector<HTMLCanvasElement>('canvas.hero-rain')
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx || typeof ctx.createConicGradient !== 'function') continue
    layers.push({ fx, canvas, rings: readRings(fx) })
  }
  if (!layers.length) return () => {}
  for (const l of layers) l.fx.classList.add('painted')

  let raf = 0, frame = 0
  const draw = () => {
    let running = false
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    for (const { fx, canvas, rings } of layers) {
      const W = fx.clientWidth, H = fx.clientHeight
      if (canvas.width !== Math.round(W * dpr) || canvas.height !== Math.round(H * dpr)) {
        canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr)
      }
      const ctx = canvas.getContext('2d')!
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)
      for (const r of rings) {
        const cs = getComputedStyle(r.el)
        const a = parseFloat(cs.opacity)
        if (!(a > 0.002)) continue
        const s = scaleOf(cs), D = r.d * W, cx = r.x * W, cy = r.y * H
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
    }
    // every half second or so, see whether any ring still has somewhere to go
    if (frame++ % 30 === 0) {
      running = layers.some((l) => l.rings.some((r) => r.el.getAnimations().some((an) => an.playState !== 'finished')))
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
