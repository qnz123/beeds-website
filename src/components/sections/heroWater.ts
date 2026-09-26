// Decides, once per visit, whether this browser can afford the headline's water ripple.
//
// The ripple is an SVG filter (feTurbulence + feDisplacementMap, #hero-bubble) on .hero-rainbow.
// Safari renders SVG filters on HTML on the CPU and re-runs this one on every frame the reveal's
// mask moves: the closing ripple fell from 120 to ~48fps there (Chrome and Firefox stay at 120).
// A still, precomputed noise image cost the same, so the filter itself is the price.
//
// So the frame rate is measured instead of guessing the browser: frames are sampled from the start
// of the rain, and when the water first switches on (the closing ripple's band, or the pointer's
// lens) the next 8 frames are compared with the ones just before. Clearly slower, and `onSlow`
// is called (Hero.tsx then drops the filter; the colour reveal itself carries on). The test runs as
// the band sets off from the right, well before it reaches the letters, so the change isn't seen.

const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b)
  return s[s.length >> 1]
}

export type WaterGuard = { waterOn: () => void; waterOff: () => void; stop: () => void }

export function waterGuard(onSlow: () => void): WaterGuard {
  const before: number[] = []
  let during: number[] = []
  let testing = false, done = false, last = 0, raf = 0, base = 0

  const loop = (t: number) => {
    if (last) {
      const d = t - last
      if (testing) {
        during.push(d)
        if (during.length >= 8) {
          const m = median(during)
          // a frame at least a third longer, and by more than 2ms (so 120Hz jitter never counts)
          if (m > base * 1.33 && m - base > 2) onSlow()
          stop()
          return
        }
      } else {
        before.push(d)
        if (before.length > 30) before.shift()
      }
    }
    last = t
    raf = requestAnimationFrame(loop)
  }
  const stop = () => { done = true; testing = false; cancelAnimationFrame(raf) }
  raf = requestAnimationFrame(loop)

  return {
    waterOn() {
      if (done || testing || before.length < 10) return
      base = median(before)
      during = []
      testing = true
    },
    // the water went off before the test finished: forget it and wait for the next time
    waterOff() {
      if (!testing) return
      testing = false
      during = []
    },
    stop,
  }
}
