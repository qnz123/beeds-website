'use client'

import type { ReviewMode } from './ReviewCanvas'

// Rounded pill switch to flip a preview between desktop and mobile. Rounded on
// both ends, the active side inverts to ink. Uses device ICONS (monitor /
// phone) rather than text. Shared by the study cards (sm) and the review
// lightbox (md) so the two controls read as the same component.

const OPTIONS: { value: ReviewMode; label: string }[] = [
  { value: 'desktop', label: 'Desktop' },
  { value: 'mobile', label: 'Mobile' },
]

function DeviceIcon({ mode, className }: { mode: ReviewMode; className?: string }) {
  return mode === 'desktop' ? (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2.5" y="3.5" width="15" height="10" rx="1" />
      <path d="M7 16.5h6M10 13.5v3" />
    </svg>
  ) : (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="6" y="2.5" width="8" height="15" rx="1.5" />
      <path d="M8.8 14.9h2.4" />
    </svg>
  )
}

export default function DeviceToggle({
  mode,
  onChange,
  size = 'md',
}: {
  mode: ReviewMode
  onChange: (m: ReviewMode) => void
  size?: 'sm' | 'md'
}) {
  const btnPad = size === 'sm' ? 'p-[5px]' : 'p-[7px]'
  const iconSize = size === 'sm' ? 'w-4 h-4 block' : 'w-[18px] h-[18px] block'
  return (
    <div
      role="group"
      aria-label="Preview device"
      className="inline-flex shrink-0 rounded-full border border-black p-[2px]"
    >
      {OPTIONS.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          aria-label={label}
          aria-pressed={mode === value}
          title={label}
          onClick={() => onChange(value)}
          className={`flex items-center justify-center rounded-full ${btnPad} transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black ${
            mode === value
              ? 'bg-black text-[#f5f5f5]'
              : 'text-black hover:bg-black/5'
          }`}
        >
          <DeviceIcon mode={value} className={iconSize} />
        </button>
      ))}
    </div>
  )
}
