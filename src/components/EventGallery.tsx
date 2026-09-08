import { useEffect, useMemo, useState } from 'react'
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, X } from 'lucide-react'
import { useGetEventGalleryQuery } from '@/RTK/EventsQuery/eventsQuery'
import type { EventGalleryItem } from '@/RTK/EventsQuery/endpoint'

type EventGalleryProps = {
  eventId: string
}

const VIDEO_EXTENSIONS = /\.(mp4|webm|ogg|mov|m4v)(\?|#|$)/i
const AUTO_ADVANCE_MS = 4000
const VISIBLE_COUNT = 4

// The gallery API hasn't settled on a single media field yet, so accept the
// aliases the backend might send and drop items that carry no usable URL.
const getMediaUrl = (item: EventGalleryItem) =>
  [item.media_url, item.url].find((value) => typeof value === 'string' && value.trim() !== '')?.trim()

const isVideo = (item: EventGalleryItem, url: string) => {
  const declaredType = item.media_type || item.type
  if (declaredType) return declaredType.toLowerCase().includes('video')
  return VIDEO_EXTENSIONS.test(url)
}

// Floats over the right edge of the event banner as a narrow vertical
// slider. The banner it's placed in must be `relative` and sized (e.g. via
// `h-80`) since this component positions itself with `absolute inset-y`.
// Stays out of the page entirely unless the event actually has media — no
// loading/empty placeholders — so events without a gallery show nothing.
const EventGallery = ({ eventId }: EventGalleryProps) => {
  const { data } = useGetEventGalleryQuery({ event_id: eventId }, { skip: !eventId })
  // Index of the topmost item currently visible in the 4-up window.
  const [startIndex, setStartIndex] = useState(0)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [isHovering, setIsHovering] = useState(false)

  const media = useMemo(() => {
    return (data?.data ?? []).flatMap((item) => {
      const url = getMediaUrl(item)
      return url ? [{ item, url, video: isVideo(item, url) }] : []
    })
  }, [data?.data])

  useEffect(() => {
    setStartIndex(0)
    setLightboxIndex(null)
  }, [eventId])

  useEffect(() => {
    setStartIndex((current) => (current >= media.length ? 0 : current))
    setLightboxIndex((current) => (current !== null && current >= media.length ? null : current))
  }, [media.length])

  const canScroll = media.length > VISIBLE_COUNT
  // Clamped to full "pages" (rather than wrapping one item at a time) so the
  // window never scrolls past the last item and leaves blank space below it.
  const maxStartIndex = Math.max(0, media.length - VISIBLE_COUNT)
  const showPrev = () => setStartIndex((i) => (i <= 0 ? maxStartIndex : i - 1))
  const showNext = () => setStartIndex((i) => (i >= maxStartIndex ? 0 : i + 1))

  // Auto-advance the slider, paused while the viewer is hovering it.
  useEffect(() => {
    if (!canScroll || isHovering || lightboxIndex !== null) return
    const timer = setInterval(() => setStartIndex((i) => (i >= maxStartIndex ? 0 : i + 1)), AUTO_ADVANCE_MS)
    return () => clearInterval(timer)
  }, [canScroll, maxStartIndex, isHovering, lightboxIndex])

  const lightboxShowPrev = () => setLightboxIndex((i) => (i === null ? i : (i - 1 + media.length) % media.length))
  const lightboxShowNext = () => setLightboxIndex((i) => (i === null ? i : (i + 1) % media.length))

  useEffect(() => {
    if (lightboxIndex === null) return

    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === 'Escape') setLightboxIndex(null)
      if (ev.key === 'ArrowLeft') lightboxShowPrev()
      if (ev.key === 'ArrowRight') lightboxShowNext()
    }

    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxIndex, media.length])

  const active = lightboxIndex !== null ? media[lightboxIndex] : undefined

  if (media.length === 0) return null

  // Each item takes an equal share of the sliding column; the column itself
  // is sized so exactly VISIBLE_COUNT items fill the visible window, then
  // translated so `startIndex` sits at the top.
  const visibleCount = Math.min(media.length, VISIBLE_COUNT)
  const itemHeightPercent = 100 / media.length
  const columnHeightPercent = (media.length / visibleCount) * 100
  const translatePercent = startIndex * itemHeightPercent

  return (
    <>
      <div
        className="absolute right-3 top-3 bottom-3 md:right-4 md:top-4 md:bottom-4 w-28 sm:w-32 md:w-44 rounded-xl overflow-hidden bg-white/80 backdrop-blur-sm shadow-lg ring-1 ring-black/5 group"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div
          className="flex flex-col transition-transform duration-300 ease-out"
          style={{ height: `${columnHeightPercent}%`, transform: `translateY(-${translatePercent}%)` }}
        >
          {media.map(({ item, url, video }, index) => (
            <button
              key={item.id ?? url}
              type="button"
              onClick={() => setLightboxIndex(index)}
              style={{ height: `${itemHeightPercent}%` }}
              className="relative w-full flex-shrink-0 focus:outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-orange-500 rounded-md"
              aria-label="View gallery item"
            >
              {/* Inset padding (rather than a flex gap) so adjacent thumbnails
                  get visible breathing room without disturbing the height
                  percentages the translate math above depends on. */}
              <div className="absolute inset-1 rounded-md overflow-hidden bg-gray-200">
                {video ? (
                  <video src={url} className="w-full h-full object-cover" muted playsInline preload="metadata" />
                ) : (
                  <img
                    src={url}
                    alt={item.caption || 'Event gallery item'}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </button>
          ))}
        </div>

        {canScroll && (
          <>
            <button
              type="button"
              onClick={showPrev}
              aria-label="Scroll up"
              className="absolute top-1 left-1/2 -translate-x-1/2 bg-black/40 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={showNext}
              aria-label="Scroll down"
              className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-black/40 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
            <div className="absolute top-1 right-1 bg-black/50 text-white text-[10px] leading-none px-1.5 py-1 rounded-full">
              {startIndex + 1}-{Math.min(startIndex + visibleCount, media.length)}/{media.length}
            </div>
          </>
        )}
      </div>

      {active && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            aria-label="Close gallery"
            className="absolute top-4 right-4 text-white/80 hover:text-white"
          >
            <X className="w-7 h-7" />
          </button>

          {media.length > 1 && (
            <button
              onClick={(ev) => {
                ev.stopPropagation()
                lightboxShowPrev()
              }}
              aria-label="Previous item"
              className="absolute left-4 text-white/80 hover:text-white"
            >
              <ChevronLeft className="w-9 h-9" />
            </button>
          )}

          <div className="max-w-5xl max-h-[85vh]" onClick={(ev) => ev.stopPropagation()}>
            {active.video ? (
              <video src={active.url} className="max-w-full max-h-[85vh]" controls autoPlay playsInline />
            ) : (
              <img
                src={active.url}
                alt={active.item.caption || 'Event gallery item'}
                className="max-w-full max-h-[85vh] object-contain"
              />
            )}
            {active.item.caption && (
              <p className="text-white/80 text-sm text-center mt-3">{active.item.caption}</p>
            )}
          </div>

          {media.length > 1 && (
            <button
              onClick={(ev) => {
                ev.stopPropagation()
                lightboxShowNext()
              }}
              aria-label="Next item"
              className="absolute right-4 text-white/80 hover:text-white"
            >
              <ChevronRight className="w-9 h-9" />
            </button>
          )}
        </div>
      )}
    </>
  )
}

export default EventGallery
