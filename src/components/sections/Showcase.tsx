'use client'

import { useEffect, useRef } from 'react'
import { Italiana, Oswald, Cormorant_Garamond, Archivo_Black, Inter, Fraunces, Karla } from 'next/font/google'
import type { Locale } from '@/i18n/config'

// Explore — "Showcase": three fictional-brand studies (Performance / Hospitality /
// Wellness) in one sticky stage, scrubbed by scroll, each answering a category
// pain point with one scroll-driven idea. Ported from the approved preview in
// Studio_Landing/showcase.html (2026-09-16). The engine below is imperative on
// purpose: one progress value drives every scene, the two transitions, the stage
// ground colour, the index rail and the notes column, and scrolling back rewinds.
// Styles live in globals.css under "Explore — Showcase".

const italiana = Italiana({ weight: '400', subsets: ['latin'], variable: '--font-italiana', display: 'swap' })
const oswald = Oswald({ weight: '700', subsets: ['latin'], variable: '--font-oswald', display: 'swap' })
const cormorant = Cormorant_Garamond({ weight: ['400', '500'], style: ['normal', 'italic'], subsets: ['latin'], variable: '--font-cormorant', display: 'swap' })
const archivo = Archivo_Black({ weight: '400', subsets: ['latin'], variable: '--font-archivo', display: 'swap' })
const inter = Inter({ weight: ['400', '500', '600'], subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const fraunces = Fraunces({ weight: ['300', '400'], style: ['normal', 'italic'], subsets: ['latin'], variable: '--font-fraunces', display: 'swap' })
const karla = Karla({ weight: ['400', '500'], subsets: ['latin'], variable: '--font-karla', display: 'swap' })

const CH = [
  { start: 0.0, end: 0.3 },
  { start: 0.36, end: 0.64 },
  { start: 0.7, end: 1.0 },
]
const TR = [
  { start: 0.3, end: 0.36 },
  { start: 0.64, end: 0.7 },
]
const GROUND = ['#eeeeee', '#efe9df', '#f1eee8'] // light grey · cream · bone

  const NOTES_EN = [
    {
      num: '01', industry: 'Shop', title: 'Preparation is the edge',
      note: 'Performance brands shout specifications at everyone. This study speaks to high performing athletes, the people who know that preparation decides the result long before the race begins. Every scroll is a rehearsal. The frame breaks open, the headline shears apart, the pace climbs to 4:12 and the cut lands on the diagonal. Nothing is sold until the runner has felt the stride. Preparation is the key to a higher rate of success in anything, and the page is built to feel like it.',
      motion: 'Frame breaks open · headline shears · pace counts up · diagonal cut to the next frame.',
      baBefore: '/showcase/img/ba-performance-before.webp',
      baBeforeAlt: 'Before: a typical performance running site',
    },
    {
      num: '02', industry: 'Booking', title: 'Coming home to rest',
      note: 'Most hotel sites sell the daytime: bright rooms, blue skies, a lobby at noon. We believe guests care most about the moment they come back after a full day of travel and want a proper rest. So this study focuses on the transition to night. The door opens on the room in daylight, then the light goes, the lamps come on and the headline turns from arriving to staying. The room rate is still one click away. It simply arrives after the visitor has already decided they want to be there.',
      motion: 'Scroll opens the door · the headline gives way to a second invitation · day turns to evening.',
      baBefore: '/showcase/img/ba-hospitality-before.webp',
      baBeforeAlt: 'Before: a typical hotel site',
    },
    {
      num: '03', industry: 'Service', title: 'Mindfulness, close to home',
      note: 'Wellness sites tend to be either a clinical dashboard or a pastel blur. The local market is asking for something more specific: a genuine focus on mindfulness. So the page breathes. A ring expands and settles with the scroll, inhale, hold, exhale, while a small window widens into soft morning light. The numbers arrive last, small and gentle, as texture rather than proof. Calm first, then the data, the way a good coach does it.',
      motion: 'Breathing ring follows the scroll · the window widens · the numbers arrive last.',
      baBefore: '/showcase/img/ba-wellness-before.webp',
      baBeforeAlt: 'Before: a typical wellness dashboard',
    },
  ];

// 日本語（下書き：ネイティブ確認待ち / DRAFT — pending native review）. Same studies, same
// order; the brands' own scene copy stays English, as on the rest of the JA site.
// 日本語（クライアント支給 2026-09-18）
const NOTES_JA = [
  {
    "num": "01",
    "industry": "Shop",
    "title": "準備こそが差になる",
    "note": "多くのパフォーマンスブランドは、誰に対してもスペックを声高に語ります。\n\nこのスタディが語りかけるのは、結果はレースが始まるずっと前、準備の段階で決まると知っているハイパフォーマンスなアスリートたち。\n\nスクロールのひとつひとつが、リハーサルです。フレームが開き、見出しが裂け、ペースは4:12へと上がり、斜めのカットが次のシーンへ導く。ランナー自身がストライドを感じるまで、何も売りません。\n\n何事も、準備こそが成功の確率を高める鍵。このページは、それを目で見るのではなく、体感できるように設計されています。",
    "motion": "フレームが開く · 見出しが裂ける · ペースが上がる · 斜めのカットで次のフレームへ",
    "baBefore": "/showcase/img/ba-performance-before.webp",
    "baBeforeAlt": "ビフォー：一般的なランニングブランドのサイト"
  },
  {
    "num": "02",
    "industry": "Booking",
    "title": "帰ってきて、休むために",
    "note": "多くのホテルサイトが売っているのは、「昼」です。明るい客室、青い空、正午のロビー。\n\nけれど私たちは、ゲストが本当に大切にしているのは、一日の旅を終え、部屋に戻り、ようやくゆっくり休めるその瞬間だと考えています。だからこのスタディは、夜へと移り変わる時間に焦点を当てました。\n\n扉が開くと、そこには昼の光に満ちた部屋。スクロールするにつれて光はゆっくりと落ち、ランプが灯り、見出しは「到着」から「滞在」へと変わっていきます。\n\n料金はこれまでと同じく、1クリック先にあります。ただし、それが現れるのは、訪れた人が「ここに泊まりたい」と感じた、その後です。",
    "motion": "スクロールで扉が開く · 見出しが次の誘いへ · 昼から夕暮れへ",
    "baBefore": "/showcase/img/ba-hospitality-before.webp",
    "baBeforeAlt": "ビフォー：一般的なホテルサイト"
  },
  {
    "num": "03",
    "industry": "Service",
    "title": "身近なマインドフルネス",
    "note": "ウェルネスのサイトは、無機質なダッシュボードか、パステルカラーに包まれた曖昧な世界観か。そのどちらかになりがちです。\n\nけれど、この市場が求めているのは、もっと具体的なもの。マインドフルネスに、本当に集中できる体験です。\n\nだから、このページは呼吸します。スクロールに合わせてリングが広がり、静かに戻る。吸って、止めて、吐く。その間、小さな窓はゆっくりと広がり、柔らかな朝の光が差し込みます。\n\n数字が現れるのは最後。小さく、穏やかに。証明としてではなく、体験の質感として。まず静けさ。そのあとにデータ。良いコーチがそうするように。",
    "motion": "呼吸のリングがスクロールに応える · 窓が広がる · 数字は最後に",
    "baBefore": "/showcase/img/ba-wellness-before.webp",
    "baBeforeAlt": "ビフォー：一般的なウェルネスのダッシュボード"
  }
]
const COPY = {
  en: { notes: NOTES_EN, approach: 'Approach', beforeAfter: 'Before / After', caption: 'Left, what the category usually ships. Right, the direction.', wipe: 'Pull the before view across' },
  ja: { notes: NOTES_JA, approach: 'アプローチ', beforeAfter: 'Before / After', caption: '左は、その業界でよく見られる作り。右は、私たちの方向性。', wipe: 'ビフォーの画面を引き出す' },
}

export default function Showcase({ lang = 'en' }: { lang?: Locale }) {
  const rootRef = useRef<HTMLElement>(null)
  const copy = COPY[lang] ?? COPY.en

  useEffect(() => {
    if (!rootRef.current) return
    const root = rootRef.current as HTMLElement
    const NOTES = COPY[lang]?.notes ?? NOTES_EN
    const $ = (s: string, r: ParentNode = root) => r.querySelector(s) as HTMLElement;
    const $$ = (s: string, r: ParentNode = root) => [...r.querySelectorAll(s)] as HTMLElement[];
    const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
    const ease = (t: number) => t * t * (3 - 2 * t);            // smoothstep
    const quint = (t: number) => (t < 0.5 ? 16 * t ** 5 : 1 - Math.pow(-2 * t + 2, 5) / 2);
    const seg = (p: number, s: { start: number; end: number }) => clamp((p - s.start) / (s.end - s.start));

    const track = $('.sc-track');
    const sticky = $('.sc-sticky');
    const stage = $('.sc-stage');
    const scenes = $$('.scene');
    const sceneEl = { hotel: $('.scene.hotel'), run: $('.scene.run'), calm: $('.scene.calm') };
    // Standalone pages set <body data-chapter="0|1|2">: one study, p maps straight onto its
    // own 0..1, no transitions, notes are static in the markup.
    const solo: number | null = null;
    const rail = $$('[data-chapter]');   // index rail (preview) or the plain-text study links (app)
    const railProgress = $('.sc-rail-progress');
    const notes = $('.sc-notes');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');

    let paused = reduce.matches;
    let staticChapter = 0;
    let frame = 0;
    let lastChapter = -1;
    let chapterOffset = 0;
    let resetSlider = () => {};   // set once the Before / After slider is wired
    let setSlideAt: (v: number) => void = () => {};   // move the needle to a percentage (QA hook)
    let onSliderUp = () => {};   // set by a click so a study can be chosen without moving the page
    let stopRibbon = () => {};   // cancels the ribbon's own animation frame on teardown

    // ---- colour lerp for the stage ground ----
    const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
    const mix = (a: string, b: string, t: number) => {
      const A = hex(a), B = hex(b);
      return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',')})`;
    };

    function navHeight() {
      const nav = document.querySelector('.nav') as HTMLElement | null;
      root.style.setProperty('--nav-h', `${nav ? nav.offsetHeight : 57}px`);
    }

    function travel() {
      return Math.max(1, track.offsetHeight - sticky.offsetHeight);
    }

    let forcedP: number | null = null;                                        // preview-only debug override (see bottom)
    const rawProgress = () => -track.getBoundingClientRect().top / travel();
    function progress() {
      if (forcedP !== null) return forcedP;
      if (paused) return solo !== null ? 1 : CH[staticChapter].end;   // finished state of the chosen chapter
      return clamp(rawProgress() + chapterOffset);
    }

    // Land on a progress point WITHOUT touching the scroll position (client direction
    // 2026-09-18): shift the scroll-to-progress mapping instead of scrolling the page.
    // Scrolling on from there carries forward from the chosen study.
    function jumpTo(target: number) { chapterOffset = target - rawProgress(); }

    function chapterAt(p: number) {
      return p < (TR[0].start + TR[0].end) / 2 ? 0 : p < (TR[1].start + TR[1].end) / 2 ? 1 : 2;
    }

    // ---- notes column ----
    function setNotes(i: number) {
      if (i === lastChapter) return;
      lastChapter = i;
      const n = NOTES[i];
      const set = (sel: string, val: string) => { const el = $(sel, notes); if (el) el.textContent = val; };
      set('[data-num]', n.num);
      set('[data-industry]', n.industry);
      set('[data-title]', n.title);
      // The note may carry paragraphs (blank-line separated) and line breaks; render them as such.
      const noteEl = $('[data-note]', notes);
      if (noteEl) noteEl.replaceChildren(...String(n.note).split('\n\n').map((para) => {
        const span = document.createElement('span');
        span.className = 'sc-note-para';
        span.textContent = para;
        return span;
      }));
      set('[data-motion]', n.motion);
      const bb = $('[data-ba-before]');
      if (bb) { bb.setAttribute('src', n.baBefore); bb.setAttribute('alt', n.baBeforeAlt); }
      // Only the "before" image behind the needle changes. Where the visitor left the needle is
      // their choice, so a study swap leaves it exactly where it is (client direction 2026-09-19).
      rail.forEach((b, k) => b.setAttribute('aria-pressed', String(k === i)));
    }

    // ---- chapter renderers (t = 0..1 inside the chapter) ----
    const hotel = sceneEl.hotel && {
      el: sceneEl.hotel,
      doorL: $('.door-left', sceneEl.hotel), doorR: $('.door-right', sceneEl.hotel),
      title: $('.arrival-title', sceneEl.hotel), reveal: $('.arrival-reveal', sceneEl.hotel), stay: $('.arrival-stay', sceneEl.hotel),
      room: $('.room:not(.evening) img', sceneEl.hotel), evening: $('.room.evening', sceneEl.hotel),
      clock: $('.s-clock', sceneEl.hotel), bar: $('.s-progress i', sceneEl.hotel),
      book: $('.stay', sceneEl.hotel),
    };
    function renderHotel(t: number) {
      if (!hotel) return;
      const open = ease(clamp((t - 0.04) / 0.56));
      hotel.doorL.style.transform = `translateX(${-open * 102}%)`;
      hotel.doorR.style.transform = `translateX(${open * 102}%)`;
      hotel.title.style.opacity = String(1 - clamp(t * 3.2));
      hotel.title.style.transform = `translateY(${-t * 70}px)`;
      hotel.room.style.transform = `scale(${1.16 - open * 0.16})`;
      const r = clamp((t - 0.4) * 3.2);
      const ev = ease(clamp((t - 0.7) / 0.22));
      hotel.reveal.style.opacity = String(r * (1 - clamp((t - 0.72) * 5)));
      hotel.reveal.style.transform = `translateY(${(1 - r) * 35}px)`;
      hotel.evening.style.opacity = String(ev);
      const s = clamp((t - 0.78) * 7);
      hotel.stay.style.opacity = String(s);
      hotel.stay.style.transform = `translateY(${(1 - s) * 30}px)`;
      const minutes = Math.round(840 + (1122 - 840) * ev);
      if (hotel.clock) hotel.clock.textContent = `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
      // the booking card arrives with the closing headline, not before it
      if (hotel.book) { hotel.book.style.opacity = String(String(s)); hotel.book.style.transform = `translateX(${(1 - s) * 26}px)`; }
      hotel.el.classList.toggle('revealed', t > 0.42);
      hotel.bar.style.transform = `scaleX(${t})`;
    }

    const run = sceneEl.run && {
      el: sceneEl.run, inner: $('.run-inner', sceneEl.run),
      frameA: $('.frame-a', sceneEl.run), imgA: $('.frame-a img', sceneEl.run), frameB: $('.frame-b', sceneEl.run),
      k1: $('.k-one', sceneEl.run), k2: $('.k-two', sceneEl.run), second: $('.run-second', sceneEl.run),
      pace: $('.pace', sceneEl.run), paceValue: $('.pace-value', sceneEl.run),
      marquee: $('.marquee-track', sceneEl.run), count: $('.frame-count', sceneEl.run), bar: $('.s-progress i', sceneEl.run),
    };
    function renderRun(t: number) {
      if (!run) return;
      const w = stage.clientWidth;
      const brk = ease(clamp(t / 0.38));
      const v = 11, h = 35;   // the stage is landscape at every width, so one framing serves both
      run.frameA.style.clipPath = `inset(${(1 - brk) * v}% ${(1 - brk) * h}% ${(1 - brk) * v}% ${(1 - brk) * h}%)`;
      run.imgA.style.transform = `scale(${1.25 - brk * 0.25}) translateY(${(1 - brk) * -3}%)`;
      const shear = t * w * 0.6, fade = 1 - clamp((t - 0.22) * 4);
      run.k1.style.transform = `translateX(${-shear}px)`;
      run.k2.style.transform = `translateX(${shear}px)`;
      run.k1.style.opacity = run.k2.style.opacity = String(fade);
      const pv = clamp((t - 0.12) / 0.45);
      const secs = Math.round(pv * 252);
      run.paceValue.textContent = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`;
      run.pace.style.opacity = String(clamp((t - 0.3) * 5) * (1 - clamp((t - 0.88) * 8)));
      const cut = ease(clamp((t - 0.5) / 0.25));
      const x = 100 - cut * 220;
      run.frameB.style.clipPath = `polygon(${x}% 100%, 100% ${x}%, 100% 100%)`;
      const s2 = clamp((t - 0.58) * 4);
      run.second.style.opacity = String(s2);
      run.second.style.transform = `translateY(${(1 - s2) * 30}px)`;
      // Chevrons point right and travel forward as you scroll (strip is 3x wide, pre-offset left).
      run.marquee.style.transform = `translateX(${-64 + t * 60}%)`;
      run.count.textContent = `FR ${String(Math.round(t * 240)).padStart(4, '0')}`;
      run.bar.style.transform = `scaleX(${t})`;
    }

    const calm = sceneEl.calm && {
      el: sceneEl.calm,
      window: $('.window', sceneEl.calm), w1: $('.w-one', sceneEl.calm), w2: $('.w-two', sceneEl.calm),
      ring: $('.breath-ring', sceneEl.calm), ringLabel: $('.breath-ring-label', sceneEl.calm),
      one: $('.calm-one', sceneEl.calm), two: $('.calm-two', sceneEl.calm),
      stats: $('.stats', sceneEl.calm), bpm: $('.st-bpm', sceneEl.calm), min: $('.st-min', sceneEl.calm), rounds: $('.st-rounds', sceneEl.calm),
      steps: $$('.steps button', sceneEl.calm), bar: $('.s-progress i', sceneEl.calm),
    };
    function renderCalm(t: number) {
      if (!calm) return;
      // breathing: inhale 0–.36, hold .36–.64, exhale .64–1
      let s, label;
      if (t < 0.36) { s = 1 + 0.35 * ease(t / 0.36); label = 'Inhale'; }
      else if (t < 0.64) { s = 1.35; label = 'Hold'; }
      else { s = 1.35 - 0.35 * ease((t - 0.64) / 0.36); label = 'Exhale'; }
      calm.ring.style.transform = `scale(${s})`;
      if (calm.ringLabel.textContent !== label) calm.ringLabel.textContent = label;
      const w = ease(clamp((t - 0.08) / 0.42));
      const from = [50, 60, 12, 8], to = [44, 0, 0, 0];
      const ins = from.map((f, i) => f + (to[i] - f) * w);
      calm.window.style.clipPath = `inset(${ins[0]}% ${ins[1]}% ${ins[2]}% ${ins[3]}%)`;
      // Start shifted left so the small window frames the watch; settle to centre as it widens.
      calm.w1.style.transform = `translate(${-(1 - w) * 24}%, ${14 - w * 16}%) scale(${1.15 - w * 0.15})`;
      calm.el.classList.toggle('on-photo', w > 0.5);
      const x = ease(clamp((t - 0.55) / 0.25));
      calm.w2.style.opacity = String(x);
      calm.w2.style.transform = `scale(${1.1 - x * 0.1})`;
      calm.one.style.opacity = String(1 - clamp((t - 0.55) * 4));
      const h2 = clamp((t - 0.62) * 4);
      calm.two.style.opacity = String(h2);
      calm.two.style.transform = `translateY(${(1 - h2) * 16}px)`;
      const n = ease(clamp((t - 0.68) / 0.25));
      calm.stats.style.opacity = String(n);
      calm.bpm.textContent = String(Math.round(60 - 18 * n));
      calm.min.textContent = String(Math.round(7 * n));
      calm.rounds.textContent = String(Math.round(3 * n));
      calm.steps.forEach((b, i) => {
        const sp = clamp(t * 3 - i);
        (b.querySelector('i') as HTMLElement).style.transform = `scaleX(${sp})`;
        b.classList.toggle('active', sp > 0 && sp < 1 || (i === 2 && sp === 1));
      });
      calm.bar.style.transform = `scaleX(${t})`;
    }

    // ---- master render ----
    const RENDER = [renderRun, renderHotel, renderCalm];
    function render() {
      frame = 0;
      const p = progress();
      if (solo !== null) {
        stage.style.background = GROUND[solo];
        RENDER[solo](p);
        if (railProgress) railProgress.style.transform = `scaleX(${p})`;
        return;
      }
      const t = CH.map((c) => seg(p, c));
      const tr1 = quint(seg(p, TR[0]));
      const tr2 = quint(seg(p, TR[1]));

      // Scene 1 lifts away; scene 2 rises as a curtain; scene 2 recedes; scene 3 breathes open.
      scenes[0].style.opacity = String(1 - clamp(tr1 * 1.25));
      scenes[0].style.transform = `translateY(${-tr1 * 6}%)`;
      scenes[0].classList.toggle('off', tr1 >= 1);

      scenes[1].style.clipPath = `inset(${(1 - tr1) * 100}% 0 0 0)`;
      scenes[1].style.transform = `scale(${1.06 - tr1 * 0.06 - tr2 * 0.04})`;
      scenes[1].style.opacity = String(1 - tr2);
      scenes[1].classList.toggle('off', tr1 <= 0 || tr2 >= 1);

      scenes[2].style.clipPath = `circle(${tr2 * 100}% at 50% 50%)`;
      scenes[2].classList.toggle('off', tr2 <= 0);

      stage.style.background = tr1 < 1 ? mix(GROUND[0], GROUND[1], tr1) : mix(GROUND[1], GROUND[2], tr2);

      renderRun(t[0]);
      renderHotel(t[1]);
      renderCalm(t[2]);

      // Notes: fade out through the first half of a transition, swap at the midpoint, fade back in.
      const tri = Math.max(1 - Math.abs(2 * tr1 - 1), 1 - Math.abs(2 * tr2 - 1)) * ((tr1 > 0 && tr1 < 1) || (tr2 > 0 && tr2 < 1) ? 1 : 0);
      const swap = $('.sc-note-swap', notes) || notes;
      swap.style.opacity = String(1 - tri);
      swap.style.transform = `translateY(${tri * 10}px)`;
      setNotes(chapterAt(p));
      if (railProgress) railProgress.style.transform = `scaleX(${p})`;
    }

    function schedule() { if (!frame) frame = requestAnimationFrame(render); }

    // ---- navigation ----
    function goChapter(i: number) {
      if (paused) { staticChapter = i; setNotes(-1); lastChapter = -1; schedule(); return; }
      // The page stays exactly where it is; the scene and the new text fade in on the spot.
      const swap = $('.sc-note-swap', notes) || notes;
      [swap, stage].forEach((el) => {
        el.classList.remove('is-fresh');
        void el.offsetWidth;            // restart the fade-in even on a repeat click
        el.classList.add('is-fresh');
      });
      jumpTo(CH[i].start + 0.004);
      schedule();
    }

    rail.forEach((b, i) => b.addEventListener('click', () => goChapter(i)));
    // Before / After row: a button + grid-rows body so the reveal eases open (native <details> can't animate).
    // Before / After slider: an invisible range drives the needle (--sc-p); the ribbon unties as the
    // needle travels right of centre (--sc-loose); the needle tilts on hover and holds through a drag.
    const SLIDE_START = 0;   // the needle rests on the frame's left edge, the scene in full view
    const slider = $('.sc-frame');
    let ribbonScroll = () => {};   // the page's own motion tugs at the ribbon as well
    if (slider) {
      const range = $('.ba-range', slider) as HTMLInputElement;
      // ---- ribbon physics -------------------------------------------------
      // The knot is tied to the pin and never leaves it; only the loops and the
      // two tails carry momentum. They hang off a damped spring that trails the
      // pin: while the needle travels, drag streams the ribbon the other way, and
      // the moment it stops -- hardest when it lands against either edge -- it
      // swings back through one or two shrinking bounces before it settles.
      // SPRING sets the period (~0.25s), DAMPING how much of each swing survives
      // into the next, and it is deliberately under-damped so a second bounce
      // still reads at a glance.
      // Tuned so a hard fling into an edge answers with two shrinking bounces and is
      // still inside half a second, while a slow drag only ever sways.
      const SPRING = 0.28, DAMPING = 0.78;
      const DRAG = 0.11;       // how far a given needle speed streams the ribbon
      const GUST = 0.004;      // how much the page's scroll speed sways it
      const IMPACT = 0.07;     // extra kick on the frame the needle lands on an edge
      let pos = SLIDE_START, prevPos = SLIDE_START;
      let swing = 0, swingV = 0, gust = 0, scrollDelta = 0, ribbonFrame = 0;

      function stepRibbon() {
        ribbonFrame = 0;
        const vel = pos - prevPos;
        prevPos = pos;
        // landing against an edge with speed behind it snaps the ribbon forward
        if ((pos === 0 || pos === 100) && Math.abs(vel) > 0.5) swingV -= vel * IMPACT;
        // gust is a smoothed scroll speed in px per frame, so GUST stays readable
        gust = gust * 0.8 + scrollDelta * 0.2;
        scrollDelta = 0;
        const target = clamp(-vel * DRAG + gust * GUST, -1, 1);
        swingV = (swingV + (target - swing) * SPRING) * DAMPING;
        swing += swingV;
        slider.style.setProperty('--sc-swing', swing.toFixed(4));
        if (Math.abs(swingV) > 1e-4 || Math.abs(swing) > 1e-4 || Math.abs(gust) > 0.4) runRibbon();
      }
      function runRibbon() { if (!ribbonFrame && !paused) ribbonFrame = requestAnimationFrame(stepRibbon); }
      function restRibbon() {
        if (ribbonFrame) cancelAnimationFrame(ribbonFrame);
        ribbonFrame = 0; swing = 0; swingV = 0; gust = 0; scrollDelta = 0; prevPos = pos;
        slider.style.setProperty('--sc-swing', '0');
      }
      let lastScroll = window.scrollY;
      ribbonScroll = () => {
        const y = window.scrollY;
        scrollDelta += y - lastScroll;
        lastScroll = y;
        runRibbon();
      };

      const setSlide = (v: number) => { pos = v; slider.style.setProperty('--sc-p', v + '%'); slider.style.setProperty('--sc-loose', String(Math.min(1, v / 50))); runRibbon(); };
      range.addEventListener('input', () => setSlide(+range.value));
      let dragging = false;
      slider.addEventListener('pointerenter', () => slider.classList.add('is-tilted'));
      slider.addEventListener('pointerleave', () => { if (!dragging) slider.classList.remove('is-tilted'); });
      // The range takes focus on pointer-down, which used to light the stage's focus ring for the
      // whole drag. Keep the ring for keyboard users only.
      let pointerFocus = false;
      slider.addEventListener('pointerdown', () => { pointerFocus = true; dragging = true; slider.classList.add('is-tilted'); });
      range.addEventListener('focus', () => { if (!pointerFocus) slider.classList.add('is-key-focus'); });
      range.addEventListener('keydown', () => slider.classList.add('is-key-focus'));
      range.addEventListener('blur', () => { slider.classList.remove('is-key-focus'); pointerFocus = false; });
      onSliderUp = () => { if (!dragging) return; dragging = false; if (!slider.matches(':hover')) slider.classList.remove('is-tilted'); };
      window.addEventListener('pointerup', onSliderUp);

      // Phones drive the needle from the button beside the study coins, not by dragging across the
      // artwork, so the stage carries no touch control of its own. Thrown right, the needle
      // glides to the middle and leans; thrown left, it returns to the frame's edge upright.
      // The glide runs through setSlideAt frame by frame, so the ribbon trails and settles
      // exactly as it does under a cursor.
      function glideTo(target: number, ms = 420) {
        const from = +range.value, t0 = performance.now();
        const step = (now: number) => {
          const k = Math.min(1, (now - t0) / ms);
          const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;   // ease in-out
          setSlideAt(from + (target - from) * e);
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
      const beforeBtn = $('.ba-coin');
      if (beforeBtn) beforeBtn.addEventListener('click', () => {
        const on = beforeBtn.getAttribute('aria-checked') !== 'true';
        beforeBtn.setAttribute('aria-checked', String(on));
        slider.classList.toggle('is-pinned', on);
        glideTo(on ? 50 : 0);
      });
      setSlideAt = (v: number) => { range.value = String(v); setSlide(v); };
      // a chapter swap re-hangs the ribbon rather than throwing it across the frame
      resetSlider = () => { setSlideAt(SLIDE_START); restRibbon(); };
      stopRibbon = () => { if (ribbonFrame) cancelAnimationFrame(ribbonFrame); ribbonFrame = 0; };
      resetSlider();
    }
    function updateMotion() {
      root.classList.toggle('motion-paused', paused);
      schedule();
    }
    const onReduce = () => { paused = reduce.matches; updateMotion(); };
    const onResize = () => { navHeight(); schedule(); };
    const onScroll = () => { schedule(); ribbonScroll(); };
    reduce.addEventListener('change', onReduce);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    const ro = new ResizeObserver(schedule);
    ro.observe(stage);

    // QA hooks: ?at=0.5 shows the stage flat at that progress (sticky off, for stills);
    // ?pin=0.5 holds that progress with the sticky layout intact (for checking real geometry).
    const params = new URLSearchParams(location.search);
    const at = params.get('at');
    if (at !== null) { forcedP = clamp(parseFloat(at)); root.classList.add('debug-at'); }
    const pin = params.get('pin');
    if (pin !== null) forcedP = clamp(parseFloat(pin));
    const ba = params.get('ba');
    // the needle keeps whatever position the visitor left it at, so set it two frames out
    if (ba !== null) requestAnimationFrame(() => requestAnimationFrame(() => setSlideAt(clamp(parseFloat(ba), 0, 100))));

    navHeight();
    updateMotion();

    return () => {
      reduce.removeEventListener('change', onReduce);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointerup', onSliderUp);
      ro.disconnect();
      if (frame) cancelAnimationFrame(frame);
      stopRibbon();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fonts = [italiana.variable, oswald.variable, cormorant.variable, archivo.variable, inter.variable, fraunces.variable, karla.variable].join(' ')

  return (
    <section ref={rootRef} className={`sc-showcase ${fonts}`} id="showcase" aria-label="Showcase">
      <div className="sc-track">
        <div className="sc-sticky">
          <div className="container-x sc-layout">
            <div className="sc-frame">
              <div className="sc-stage" aria-live="off">
            <section className="scene run" data-scene="1" aria-label="Performance study: Split Second">
                          <div className="run-inner">
                            <div className="frame frame-a"><img src="/showcase/img/running_02.webp" alt="A runner holds a pale blue running shoe against the sky" /></div>
                            <div className="frame frame-b"><img src="/showcase/img/running_01.webp" alt="A runner stretching, seen from below against a bright sky" /></div>
                            <div className="run-shade"></div>
                            <div className="kinetic" aria-hidden="true">
                              <span className="k-line k-one">Built for the</span>
                              <span className="k-line k-two">next stride</span>
                            </div>
                            <h3 className="run-title">Built for the next stride</h3>
                            <div className="run-second">
                              <h3>Your pace<br /><em>Your terms</em></h3>
                              <p>Cushion tuned to the runner, not the spec sheet.</p>
                            </div>
                            <div className="pace"><span className="pace-label">Pace</span><span className="pace-value">0:00</span><span className="pace-unit">/km</span></div>
                            <div className="s-nav">
                              <span className="s-logo run-logo">TEMPO</span>
                              <span className="s-button run-button run-cart" role="img" aria-label="Cart"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 4h2.2l2.1 10.4a1.2 1.2 0 0 0 1.2 1h8.6a1.2 1.2 0 0 0 1.2-.9L20 8H6.1"/><circle cx="9.5" cy="19.2" r="1.3"/><circle cx="17" cy="19.2" r="1.3"/></svg></span>
                            </div>
                            <span className="frame-count">FR 0000</span>
                            <div className="marquee" aria-hidden="true"><div className="marquee-track"><svg className="chevrons" preserveAspectRatio="none"><defs><pattern id="chev" width="9" height="16" patternUnits="userSpaceOnUse"><path d="M-1 18 L10.5 -2" stroke="#1f6f9a" strokeWidth="2.6" strokeOpacity=".8"/></pattern></defs><rect width="100%" height="100%" fill="url(#chev)"/></svg></div></div>
                              <div className="s-progress"><i></i></div>
                          </div>
                        </section>

            <section className="scene hotel" data-scene="0" aria-label="Hospitality study: The Arrival">
                          <div className="room"><img src="/showcase/img/hotel-bed-01.webp" alt="A calm hotel bedroom in soft daylight" /></div>
                          <div className="room evening"><img src="/showcase/img/hotel-bed-02.webp" alt="The same room at dusk, lamps glowing" /></div>
                          <div className="room-shade"></div>
                          <div className="door door-left">
                            <div className="door-border"></div>
                            <div className="arrival-title">
                              <h3>You have<br /><em>arrived</em></h3>
                            </div>
                          </div>
                          <div className="door door-right">
                            <div className="door-border"></div>
                            <div className="door-photo"><img src="/showcase/img/hotel-key-01.webp" alt="A leather room key hanging from an open door" /></div>
                          </div>
                          <div className="s-nav">
                            <span className="s-logo hotel-logo">Solar</span>
                            <span className="s-button s-icon" role="img" aria-label="Book the stay"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="8" cy="12" r="4"/><path d="M12 12h9M18 12v3M15 12v2.5"/></svg></span>
                          </div>
                          <div className="arrival-reveal">
                            <h3>Make yourself<br /><em>at home</em></h3>
                          </div>
                          <div className="arrival-stay">
                            <h3>Stay a little</h3>
                          </div>
                          <aside className="stay" aria-label="Reserve a stay"><div className="stay-dates"><div><span>Check in</span><b>Tue 15 Sep</b></div><div><span>Check out</span><b>Fri 18 Sep</b></div></div><p className="stay-month">September 2026</p><div className="stay-grid"><i>Mon</i><i>Tue</i><i>Wed</i><i>Thu</i><i>Fri</i><i>Sat</i><i>Sun</i><span></span><span>1</span><span>2</span><span className="off">3</span><span className="off">4</span><span>5</span><span>6</span><span>7</span><span>8</span><span className="off">9</span><span className="off">10</span><span>11</span><span>12</span><span>13</span><span>14</span><span className="on edge in">15</span><span className="on">16</span><span className="on">17</span><span className="on edge out">18</span><span>19</span><span>20</span><span>21</span><span className="off">22</span><span className="off">23</span><span>24</span><span>25</span><span className="off">26</span><span className="off">27</span><span>28</span><span>29</span><span>30</span></div><div className="stay-row"><span>Guests</span><b>0</b></div><span className="stay-cta">Reserve</span></aside><div className="s-progress"><i></i></div>
                        </section>

            <section className="scene calm" data-scene="2" aria-label="Wellness study: The Quiet Hour">
                          <div className="calm-inner">
                            <div className="window">
                              <img className="w-one" src="/showcase/img/Lifestyle_01.webp" alt="Someone in soft grey activewear checks a watch at home beside a yoga mat" />
                              <img className="w-two" src="/showcase/img/Lifestyle_02.webp" alt="Morning light on grey leggings beside a window and a rolled mat" />
                            </div>
                            <div className="breath-ring" aria-hidden="true">
                              <svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="96"/><circle className="breath-ring-inner" cx="100" cy="100" r="70"/></svg>
                              <span className="breath-ring-label">Inhale</span>
                            </div>
                            <div className="calm-copy">
                              <p className="s-eyebrow">The quiet hour</p>
                              <h3 className="calm-one">Move a little<br /><em>Feel a lot</em></h3>
                              <h3 className="calm-two">Data can be<br /><em>gentle too</em></h3>
                            </div>
                            <div className="stats" aria-hidden="true">
                              <span><b className="st-bpm">60</b> bpm</span><span><b className="st-min">0</b> min</span><span><b className="st-rounds">0</b> rounds</span>
                            </div>
                            <div className="steps" aria-label="Ritual steps">
                              <button type="button" data-step="0"><span>01</span>Stretch<i></i></button>
                              <button type="button" data-step="1"><span>02</span>Breathe<i></i></button>
                              <button type="button" data-step="2"><span>03</span>Rest<i></i></button>
                            </div>
                            <div className="s-nav">
                              <span className="s-logo calm-logo">hush</span>
                              <span className="s-button s-icon calm-button" role="img" aria-label="Begin the ritual"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14z"/><path d="M5 19l8-8"/></svg></span>
                            </div>
                              <div className="s-progress"><i></i></div>
                          </div>
                        </section>

                <div className="ba-before"><img data-ba-before src={copy.notes[0].baBefore} alt={copy.notes[0].baBeforeAlt} width={1280} height={800} loading="lazy" /></div>
              </div>
              <div className="ba-line">
                <svg className="ba-needle" viewBox="0 0 12 400" preserveAspectRatio="none" aria-hidden="true"><path fill="#000" fillRule="evenodd" d="M6 0C8.7 0 10.6 7 10.6 24L6.6 400H5.4L1.4 24C1.4 7 3.3 0 6 0zM6 8c-1 0-1.6 3.2-1.6 8.5S5 25 6 25s1.6-3.2 1.6-8.5S7 8 6 8z" /></svg>
                <svg className="ba-bow" viewBox="0 0 46 36" aria-hidden="true" fill="#fff" stroke="#000" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round">
                  <g className="tail-l"><path d="M19.6 20.2 13.2 33.6l4.2-2.1 2.8 3.4 3.2-14.7z" /><path className="ink" fill="none" strokeWidth=".8" d="M18.2 23.4 15.6 30.2" /></g>
                  <g className="tail-r"><path d="M26.4 20.2 32.8 33.6l-4.2-2.1-2.8 3.4-3.2-14.7z" /><path className="ink" fill="none" strokeWidth=".8" d="M27.8 23.4l2.6 6.8" /></g>
                  <g className="loop-l"><path d="M20.5 16.5C17 9.5 8 5.5 3.6 9.2c-3.4 2.8-1.2 8.6 4.2 11.2 4.6 2.2 9.6 1.3 12.7-3.9z" /><path className="ink" fill="none" strokeWidth=".8" d="M18.4 15.2C14.6 10.6 8.8 9.4 6 11.6M17.6 18.2c-3.4 2.4-7.6 2.6-10.6.6" /></g>
                  <g className="loop-r"><path d="M25.5 16.5c3.5-7 12.5-11 16.9-7.3 3.4 2.8 1.2 8.6-4.2 11.2-4.6 2.2-9.6 1.3-12.7-3.9z" /><path className="ink" fill="none" strokeWidth=".8" d="M27.6 15.2c3.8-4.6 9.6-5.8 12.4-3.6M28.4 18.2c3.4 2.4 7.6 2.6 10.6.6" /></g>
                  <g className="knot"><rect x="19" y="12.6" width="8" height="8.4" rx="2.4" /><path className="ink" fill="none" strokeWidth=".8" d="M21.6 13.6v6.4M24.4 13.6v6.4" /></g>
                </svg>
              </div>
              <input className="ba-range" type="range" min="0" max="100" defaultValue="0" aria-label={copy.wipe} />
            </div>


            <aside className="sc-notes" aria-live="polite">
              <div className="sc-nav-row">
              <nav className="sc-note-nav" aria-label="Studies">
                <button type="button" data-chapter="0" aria-pressed="true">
                  <span className="sc-coin"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 6h9l.7 6.9a1.1 1.1 0 0 1-1.1 1.2H3.9a1.1 1.1 0 0 1-1.1-1.2z" /><path d="M5.8 6V5.2a2.2 2.2 0 0 1 4.4 0V6" /></svg></span>
                  <span className="sc-coin-lbl">Shop</span>
                </button>
                <button type="button" data-chapter="1" aria-pressed="false">
                  <span className="sc-coin"><svg viewBox="0 0 16 16" aria-hidden="true"><rect x="2.5" y="4" width="11" height="9.5" rx="2.8" /><path d="M5.5 2.4v2.6M10.5 2.4v2.6M2.6 7.2h10.8" /></svg></span>
                  <span className="sc-coin-lbl">Booking</span>
                </button>
                <button type="button" data-chapter="2" aria-pressed="false">
                  <span className="sc-coin"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 13.4C5.3 11.3 2.4 9.2 2.4 6.3 2.4 4.6 3.7 3.3 5.3 3.3c1.1 0 2.1.6 2.7 1.5.6-.9 1.6-1.5 2.7-1.5 1.6 0 2.9 1.3 2.9 3 0 2.9-2.9 5-5.6 7.1z" /></svg></span>
                  <span className="sc-coin-lbl">Service</span>
                </button>
              </nav>
              {/* Phones drive the needle from here rather than from inside the frame, so the
                   stage stays a picture and nothing has to be dragged across the artwork. */}
              <div className="ba-mobile">
                <button type="button" className="ba-coin" role="switch" aria-checked="false" aria-label={copy.wipe}>
                  {/* the needle's own bow, same shapes, in red so it reads as a control */}
                  <svg className="ba-bowicon" viewBox="0 0 46 36" aria-hidden="true" fill="#d7261f" stroke="#111" strokeWidth="1" strokeLinejoin="round" strokeLinecap="round">
                    <g className="bw-tl"><path d="M19.6 20.2 13.2 33.6l4.2-2.1 2.8 3.4 3.2-14.7z" /><path className="ink" fill="none" strokeWidth=".8" d="M18.2 23.4 15.6 30.2" /></g>
                    <g className="bw-tr"><path d="M26.4 20.2 32.8 33.6l-4.2-2.1-2.8 3.4-3.2-14.7z" /><path className="ink" fill="none" strokeWidth=".8" d="M27.8 23.4l2.6 6.8" /></g>
                    <g className="bw-l"><path d="M20.5 16.5C17 9.5 8 5.5 3.6 9.2c-3.4 2.8-1.2 8.6 4.2 11.2 4.6 2.2 9.6 1.3 12.7-3.9z" /><path className="ink" fill="none" strokeWidth=".8" d="M18.4 15.2C14.6 10.6 8.8 9.4 6 11.6M17.6 18.2c-3.4 2.4-7.6 2.6-10.6.6" /></g>
                    <g className="bw-r"><path d="M25.5 16.5c3.5-7 12.5-11 16.9-7.3 3.4 2.8 1.2 8.6-4.2 11.2-4.6 2.2-9.6 1.3-12.7-3.9z" /><path className="ink" fill="none" strokeWidth=".8" d="M27.6 15.2c3.8-4.6 9.6-5.8 12.4-3.6M28.4 18.2c3.4 2.4 7.6 2.6 10.6.6" /></g>
                    <g className="bw-k"><rect x="19" y="12.6" width="8" height="8.4" rx="2.4" /><path className="ink" fill="none" strokeWidth=".8" d="M21.6 13.6v6.4M24.4 13.6v6.4" /></g>
                  </svg>
                </button>
              </div>
              </div>
              <div className="sc-note-swap">
                <div className="sc-note-block">
                  <p className="eyebrow">{copy.approach}</p>
                  <p className="sc-note-copy" data-note></p>
                </div>
                <p className="sc-note-motion" data-motion></p>
              </div>
            </aside>
          </div>
        </div>
      </div>

    </section>
  )
}
