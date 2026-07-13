'use client'

import Image from 'next/image'
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

type GalleryImage = {
  src: string
  /** Intrinsic image dimensions — preserves aspect ratio, no cropping. */
  width: number
  height: number
}

type Clip = {
  title: string
  category: string
  thumbnail: string
  /** Intrinsic thumbnail dimensions — preserves aspect ratio, no cropping. */
  width: number
  height: number
  /** Video clips: Vimeo id — opens in VideoModal. */
  vimeoId?: string
  /** Gallery clips: ordered images — opens in GalleryOverlay. */
  images?: GalleryImage[]
  /**
   * Gallery clips only. `\n\n`-separated: the first block is the overlay
   * heading, the remaining blocks render as body paragraphs.
   */
  description?: string
}

function isVideoClip(clip: Clip): clip is Clip & { vimeoId: string } {
  return Boolean(clip.vimeoId && clip.thumbnail)
}

function isGalleryClip(
  clip: Clip
): clip is Clip & { images: GalleryImage[]; description: string } {
  return Boolean(clip.images && clip.images.length > 0 && clip.thumbnail && clip.description)
}

const CLIPS: Clip[] = [
  {
    title: 'WIRED MAGAZINE',
    category: 'Commercial',
    vimeoId: '25015740',
    thumbnail: '/thumbnails/v1-wired.webp',
    width: 1896,
    height: 1052,
  },
  {
    title: 'WIRED — WILL FERRELL',
    category: 'Commercial',
    vimeoId: '25149398',
    thumbnail: '/thumbnails/v2-will-ferrell.webp',
    width: 1416,
    height: 788,
  },
  {
    title: 'BON APPÉTIT',
    category: 'Commercial',
    vimeoId: '201430272',
    thumbnail: '/thumbnails/v3-bon-appetit.webp',
    width: 2868,
    height: 2148,
  },
  {
    title: 'BRIDES — BALLOON',
    category: 'Commercial',
    vimeoId: '37468879',
    thumbnail: '/thumbnails/v4-brides-balloon.webp',
    width: 3358,
    height: 1936,
  },
  {
    title: 'ANIME NOBU',
    category: 'Promotion',
    thumbnail: '/thumbnails/v5-nobu.webp',
    width: 3438,
    height: 1934,
    // images[0] is the overlay "hero" (large, full width); the rest render
    // as a small thumbnail grid — see GalleryOverlay.
    images: [
      { src: '/nobu/nobu-7.webp', width: 3438, height: 1934 },
      { src: '/nobu/nobu-1.webp', width: 3448, height: 1936 },
      { src: '/nobu/nobu-2.webp', width: 3438, height: 1938 },
      { src: '/nobu/nobu-3.webp', width: 3448, height: 1936 },
      { src: '/nobu/nobu-4.webp', width: 3366, height: 1914 },
      { src: '/nobu/nobu-6.webp', width: 3448, height: 1934 },
      { src: '/nobu/nobu-5.webp', width: 3444, height: 1930 },
    ],
    description:
      'Anime Nobu (居酒屋のぶ)\n\n' +
      "The interview was designed to mirror the storytelling of the anime itself, visually moving between the present and future as the conversation unfolds. Rather than relying on a traditional interview format, each transition was tied closely to the subject's story, allowing the live-action interview and anime world to flow together naturally.\n\n" +
      "From production through post, every shot was planned to support these time-shifting transitions, creating a seamless visual experience that feels like the interview is part of the anime's narrative rather than separate from it.",
  },
  {
    title: 'BRIDES — WEDDING',
    category: 'Commercial',
    vimeoId: '56465626',
    thumbnail: '/thumbnails/v6-brides-ladder.webp',
    width: 3422,
    height: 1894,
  },
  {
    title: 'GLAMOUR — BLAKE LIVELY',
    category: 'Commercial',
    vimeoId: '201430213',
    thumbnail: '/thumbnails/v7-lively.webp',
    width: 1600,
    height: 899,
  },
  {
    title: 'JAPAN AIRPORT',
    category: 'Promotion',
    vimeoId: '249631612',
    thumbnail: '/thumbnails/v8-airport.webp',
    width: 1600,
    height: 898,
  },
  {
    // 1:1 square social clip — thumbnail ratio ~1.0 (< 1.6) so the tile renders
    // full natural height (video-poster--natural), and the modal frame is driven
    // square by these dims to match the 100%-padding embed.
    title: 'BOMB TAKOYAKI',
    category: 'Social Media',
    vimeoId: '248842352',
    thumbnail: '/thumbnails/v9-takoyaki.webp',
    width: 1074,
    height: 1066,
  },
  {
    // V10 — duplicate of V1 (WIRED) as a REGULAR grid tile (click-to-modal),
    // since V1 itself now plays as the featured cinema-poster cover above.
    title: 'WIRED MAGAZINE',
    category: 'Commercial',
    vimeoId: '25015740',
    thumbnail: '/thumbnails/v1-wired.webp',
    width: 1896,
    height: 1052,
  },
]

function vimeoEmbedSrc(id: string) {
  return `https://player.vimeo.com/video/${id}?autoplay=1&autopause=0&title=0&byline=0&portrait=0`
}

// ---------------------------------------------------------------------------
// Featured showcase — "The Cinema Poster" (client-approved Study C, 2026-07-10).
// V1 (WIRED MAGAZINE) plays inline as a full-height, cover-cropped, chromeless
// muted loop at the top of Selected Work, replacing its grid tile. The credit
// sits in white over a soft bottom scrim. Playback loops the film's FIRST 30
// SECONDS via the Vimeo Player API; if the API fails to load, the background
// embed still autoplays and loops the full film (graceful degradation).
// ---------------------------------------------------------------------------

const SHOWCASE_LOOP_SECONDS = 30

type VimeoPlayerLike = {
  on: (event: string, cb: (data: { seconds: number }) => void) => void
  off: (event: string) => void
  setCurrentTime: (s: number) => Promise<number>
}

declare global {
  interface Window {
    Vimeo?: { Player: new (el: HTMLIFrameElement) => VimeoPlayerLike }
  }
}

/** Loads player.js once and resolves with the Vimeo global (null on failure). */
function loadVimeoApi(): Promise<Window['Vimeo'] | null> {
  if (window.Vimeo) return Promise.resolve(window.Vimeo)
  return new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-vimeo-api]')
    const script = existing ?? document.createElement('script')
    const done = () => resolve(window.Vimeo ?? null)
    script.addEventListener('load', done)
    script.addEventListener('error', () => resolve(null))
    if (!existing) {
      script.src = 'https://player.vimeo.com/api/player.js'
      script.async = true
      script.dataset.vimeoApi = 'true'
      document.head.appendChild(script)
    }
  })
}

function FeaturedShowcase({ clip }: { clip: Clip & { vimeoId: string } }) {
  const frameRef = useRef<HTMLIFrameElement>(null)
  // The still shows instantly (28KB webp) and fades out once the film is playing,
  // so the hero is never blank while Vimeo buffers.
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    let player: VimeoPlayerLike | null = null
    let cancelled = false

    loadVimeoApi().then((vimeo) => {
      if (cancelled || !vimeo || !frameRef.current) return
      player = new vimeo.Player(frameRef.current)
      player.on('play', () => setPlaying(true))
      player.on('timeupdate', (data) => {
        if (!cancelled) setPlaying(true)
        if (data.seconds >= SHOWCASE_LOOP_SECONDS) {
          player?.setCurrentTime(0).catch(() => {})
        }
      })
    })

    return () => {
      cancelled = true
      player?.off('play')
      player?.off('timeupdate')
    }
  }, [])

  return (
    <div className="work-cover">
      <iframe
        ref={frameRef}
        src={`https://player.vimeo.com/video/${clip.vimeoId}?background=1&autoplay=1&muted=1&loop=1&autopause=0&app_id=58479`}
        allow="autoplay; fullscreen"
        title={clip.title}
      />
      {/* Instant poster (LCP), fades out when the film starts. A plain <img> is
          intentional: the site is a static export (images unoptimized), so
          next/image adds no benefit here. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={clip.thumbnail}
        alt=""
        aria-hidden="true"
        className={`work-cover-poster${playing ? ' work-cover-poster--hidden' : ''}`}
      />
      <div className="work-cover-scrim" aria-hidden="true" />
      <div className="work-cover-text">
        <span className="eyebrow work-cover-eyebrow">Selected Work</span>
        <h2 className="work-cover-title">{clip.title}</h2>
        {/* Services credit: CSS-only content (non-selectable, non-searchable),
            same protection as the grid captions. */}
        <span className="work-cover-services" aria-hidden="true" />
      </div>
    </div>
  )
}

function VideoClip({
  clip,
  slot,
  onOpen,
}: {
  clip: Clip
  /** 1-based slot id ('v1'…'v9'); drives the CSS-only services caption. */
  slot: string
  onOpen: (clip: Clip, trigger: HTMLButtonElement) => void
}) {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const hasVideo = isVideoClip(clip)
  const hasGallery = isGalleryClip(clip)
  const isInteractive = hasVideo || hasGallery
  // Squarish/vertical thumbnails (e.g. V3) break the uniform 16:9 rule: they
  // render at their natural height, full-size, pushing the next row down.
  const isVerticalish = clip.width / clip.height < 1.6

  const frame = (
    // Positioning context for the hover overlay so it covers only the
    // thumbnail, never the services caption sitting below it.
    <div className="video-frame">
      <div className="video-media">
        <div
          className={`video-poster${isInteractive ? '' : ' video-poster--placeholder'}${
            isVerticalish ? ' video-poster--natural' : ''
          }`}
        >
          {isInteractive ? (
            <Image
              src={clip.thumbnail}
              alt=""
              width={clip.width}
              height={clip.height}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="video-thumbnail"
            />
          ) : (
            <span className="text-[11px] uppercase tracking-[2px] text-[#999]">
              Reel coming soon
            </span>
          )}
          {hasVideo && <span className="video-play-icon" aria-hidden="true" />}
        </div>
      </div>
      <div className="video-overlay">
        <div className="text-xs uppercase tracking-[1px] mb-2.5">{clip.category}</div>
        <h3 className="text-lg">{clip.title}</h3>
      </div>
    </div>
  )

  // The services line carries NO text node: the copy lives only in globals.css
  // (`.video-services--vN::after { content }`), rendered via a pseudo-element
  // that is aria-hidden, user-select:none and pointer-events:none — so it can't
  // be selected, copied, found by in-page search, or read from the DOM/markup.
  const services = <div className={`video-services video-services--${slot}`} aria-hidden="true" />

  if (!isInteractive) {
    return (
      <div className="video-item" aria-label={`${clip.title} — ${clip.category}`}>
        {frame}
        {services}
      </div>
    )
  }

  return (
    <button
      ref={triggerRef}
      type="button"
      className="video-item"
      aria-label={`${hasGallery ? 'View' : 'Play'} ${clip.title} — ${clip.category}`}
      onClick={() => {
        if (triggerRef.current) onOpen(clip, triggerRef.current)
      }}
    >
      {frame}
      {services}
    </button>
  )
}

function VideoModal({
  clip,
  onClose,
}: {
  clip: Clip & { vimeoId: string }
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeBtnRef.current?.focus()

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, iframe, [href], [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  return (
    <div
      className="video-modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        className="video-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${clip.title} — ${clip.category}`}
        style={
          {
            '--clip-aspect': `${clip.width} / ${clip.height}`,
            '--clip-ratio': clip.width / clip.height,
          } as CSSProperties
        }
      >
        <button
          ref={closeBtnRef}
          type="button"
          className="video-modal-close"
          aria-label="Close video"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="video-modal-frame">
          <iframe
            src={vimeoEmbedSrc(clip.vimeoId)}
            title={clip.title}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  )
}

/**
 * Fades/slides an element in the first time it scrolls into view. No-ops
 * (renders visible immediately, no transition) for prefers-reduced-motion.
 */
function useRevealOnScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return { ref, visible }
}

function Reveal({ children }: { children: ReactNode }) {
  const { ref, visible } = useRevealOnScroll<HTMLDivElement>()
  return (
    <div ref={ref} className={`gallery-reveal${visible ? ' gallery-reveal--visible' : ''}`}>
      {children}
    </div>
  )
}

function GalleryOverlay({
  clip,
  onClose,
}: {
  clip: Clip & { images: GalleryImage[]; description: string }
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const [heading, ...paragraphs] = clip.description.split('\n\n')
  const [hero, ...rest] = clip.images

  useEffect(() => {
    closeBtnRef.current?.focus()

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }

      if (e.key === 'Tab' && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  return (
    <div
      ref={dialogRef}
      className="gallery-overlay-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label={`${heading} — ${clip.category}`}
    >
      <button
        ref={closeBtnRef}
        type="button"
        className="gallery-overlay-close"
        aria-label="Close gallery"
        onClick={onClose}
      >
        &times;
      </button>

      <div className="gallery-overlay-inner">
        <div className="gallery-overlay-content">
          <header className="gallery-overlay-header">
            <div className="eyebrow mb-4">{clip.category}</div>
            <h1 className="text-3xl leading-[1.4]">{heading}</h1>
          </header>

          <div className="gallery-overlay-hero">
            <Reveal>
              <Image
                src={hero.src}
                alt={`${clip.title} — photo 1`}
                width={hero.width}
                height={hero.height}
                sizes="(max-width: 900px) 100vw, 900px"
                className="gallery-overlay-image"
              />
            </Reveal>
          </div>

          {paragraphs.length > 0 && (
            <Reveal>
              <div className="gallery-overlay-description">
                {paragraphs.map((paragraph, index) => (
                  <p key={index} className="text-sm leading-[1.8] text-[#333]">
                    {paragraph}
                  </p>
                ))}
              </div>
            </Reveal>
          )}

          {rest.length > 0 && (
            <div className="gallery-overlay-grid">
              {rest.map((image, index) => (
                <Reveal key={image.src}>
                  <Image
                    src={image.src}
                    alt={`${clip.title} — photo ${index + 2}`}
                    width={image.width}
                    height={image.height}
                    sizes="(max-width: 640px) 50vw, (max-width: 900px) 33vw, 300px"
                    className="gallery-overlay-image"
                  />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function VideoPortfolio() {
  const [activeClip, setActiveClip] = useState<Clip | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  const openClip = (clip: Clip, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger
    setActiveClip(clip)
    // Give the overlay its own history entry so the browser Back button (and the
    // mobile swipe-back gesture) closes it and returns to this grid — instead of
    // navigating to the actual previous page.
    window.history.pushState({ beedsOverlay: true }, '')
  }

  // Actually dismiss: clear state + restore focus to the tile that opened it, so
  // you land back on the same thumbnail.
  const dismiss = () => {
    setActiveClip(null)
    triggerRef.current?.focus()
  }

  // ✕ / Esc / backdrop all route here: unwind the pushed history entry; the
  // popstate listener below then performs the dismiss (single close path,
  // whether the user hit Back or the close control).
  const closeClip = () => {
    window.history.back()
  }

  // While an overlay is open, a Back navigation (popstate) closes it.
  useEffect(() => {
    if (!activeClip) return
    const onPop = () => dismiss()
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeClip])

  const featured = CLIPS[0]
  const gridClips = CLIPS.slice(1)

  return (
    <section id="work">
      {/* V1 opens the section as the full-frame cinema poster; its grid tile
          is replaced by the showcase. Grid slots stay v2…v9 so the CSS-only
          caption classes keep matching their clips. */}
      {isVideoClip(featured) && <FeaturedShowcase clip={featured} />}

      <div className="video-grid video-grid--below-cover">
        {gridClips.map((clip, i) => (
          <VideoClip key={clip.title} clip={clip} slot={`v${i + 2}`} onOpen={openClip} />
        ))}
      </div>

      {activeClip && isVideoClip(activeClip) && (
        <VideoModal clip={activeClip} onClose={closeClip} />
      )}
      {activeClip && isGalleryClip(activeClip) && (
        <GalleryOverlay clip={activeClip} onClose={closeClip} />
      )}
    </section>
  )
}
