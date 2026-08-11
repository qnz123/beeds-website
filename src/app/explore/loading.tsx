// Route-level loading state: shown the moment the visitor clicks Explore,
// while the page streams in. House editorial treatment — eyebrow + a thin
// scanning hairline (see .route-loading-bar in globals.css).
export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-10">
      <div className="text-center" role="status" aria-label="Loading Explore">
        <p className="eyebrow mb-6 text-[#666]">Explore</p>
        <div className="route-loading-bar mx-auto" aria-hidden="true" />
      </div>
    </div>
  )
}
