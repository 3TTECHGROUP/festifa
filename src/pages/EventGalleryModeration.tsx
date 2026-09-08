/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AlertCircle, ArrowLeft, Check, Images, User, X } from 'lucide-react'
import { toast } from 'sonner'
import {
  useGetEventGalleryModerationQuery,
  useApproveGalleryItemMutation,
  useRejectGalleryItemMutation,
} from '@/RTK/EventsQuery/eventsQuery'
import type { EventGalleryItem } from '@/RTK/EventsQuery/endpoint'

const VIDEO_EXTENSIONS = /\.(mp4|webm|ogg|mov|m4v)(\?|#|$)/i

const getMediaUrl = (item: EventGalleryItem) =>
  [item.media_url, item.url].find((value) => typeof value === 'string' && value.trim() !== '')?.trim() || ''

const isVideo = (item: EventGalleryItem, url: string) => {
  const declaredType = item.media_type || item.type
  if (declaredType) return declaredType.toLowerCase().includes('video')
  return VIDEO_EXTENSIONS.test(url)
}

const statusBadge = (status?: string) => {
  const normalized = (status || 'pending').toLowerCase()
  if (normalized === 'approved') return { label: 'Approved', className: 'bg-green-100 text-green-700' }
  if (normalized === 'rejected') return { label: 'Rejected', className: 'bg-red-100 text-red-700' }
  return { label: 'Pending', className: 'bg-yellow-100 text-yellow-700' }
}

const EventGalleryModeration = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const eventId = id || ''

  const { data, isFetching, isError, refetch } = useGetEventGalleryModerationQuery({ event_id: eventId }, { skip: !eventId })
  const [approveGalleryItem] = useApproveGalleryItemMutation()
  const [rejectGalleryItem] = useRejectGalleryItemMutation()
  const [actingId, setActingId] = useState<string | null>(null)

  const items = data?.data ?? []

  const handleApprove = async (itemId: string) => {
    setActingId(itemId)
    try {
      await approveGalleryItem({ event_gallery_item_id: itemId }).unwrap()
      toast.success('Gallery item approved.')
    } catch (err: any) {
      const msg = err?.data?.message || err?.error || 'Failed to approve item. Please try again.'
      toast.error(msg)
    } finally {
      setActingId(null)
    }
  }

  const handleReject = async (itemId: string) => {
    setActingId(itemId)
    try {
      await rejectGalleryItem({ event_gallery_item_id: itemId }).unwrap()
      toast.success('Gallery item rejected.')
    } catch (err: any) {
      const msg = err?.data?.message || err?.error || 'Failed to reject item. Please try again.'
      toast.error(msg)
    } finally {
      setActingId(null)
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4 text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <Images className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gallery submissions</h1>
            <p className="text-gray-600 text-sm">Review and moderate photos and videos shared by attendees.</p>
          </div>
        </div>
      </div>

      {isFetching ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden border border-gray-200">
              <div className="aspect-square bg-gray-200" />
              <div className="p-3 space-y-2">
                <div className="h-3 w-2/3 bg-gray-200 rounded" />
                <div className="h-8 bg-gray-200 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-lg border border-gray-200">
          <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Failed to load gallery submissions</h3>
          <p className="text-gray-600 text-sm mb-4">Please try again.</p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center px-4 py-2 rounded-full bg-black text-white text-sm hover:bg-gray-800 transition-colors"
          >
            Try again
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-lg border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Images className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">No submissions yet</h3>
          <p className="text-gray-600 text-sm">Photos and videos shared by attendees will show up here for review.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => {
            const url = getMediaUrl(item)
            const video = isVideo(item, url)
            const badge = statusBadge(item.status)
            const isActing = actingId === item.id
            return (
              <div key={item.id} className="bg-white rounded-lg overflow-hidden border border-gray-200 flex flex-col">
                <div className="relative aspect-square bg-gray-100">
                  {video ? (
                    <video src={url} className="w-full h-full object-cover" muted playsInline preload="metadata" controls />
                  ) : (
                    <img src={url} alt={item.label || item.caption || 'Gallery submission'} className="w-full h-full object-cover" />
                  )}
                  <span className={`absolute top-2 left-2 text-xs font-medium px-2 py-0.5 rounded-full ${badge.className}`}>
                    {badge.label}
                  </span>
                </div>

                <div className="p-3 flex-1 flex flex-col gap-2">
                  <p className="text-sm font-medium text-gray-900 truncate" title={item.label || item.caption || undefined}>
                    {item.label || item.caption || 'Untitled'}
                  </p>
                  {item.user?.name && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <User className="w-3.5 h-3.5" />
                      <span className="truncate">{item.user.name}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-auto pt-1">
                    <button
                      type="button"
                      onClick={() => handleApprove(item.id)}
                      disabled={isActing}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full bg-green-600 text-white text-xs font-medium hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReject(item.id)}
                      disabled={isActing}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full border border-red-300 text-red-600 text-xs font-medium hover:bg-red-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <X className="w-3.5 h-3.5" />
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default EventGalleryModeration
