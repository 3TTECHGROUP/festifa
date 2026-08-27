/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Heart, MessageCircle, Eye, Share2, Calendar, Clock, MapPin, Ticket, User, ArrowRight, MoreHorizontal, AlertCircle, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { useGetEventDetailQuery, useGetEventCommentsQuery, useCreateCommentMutation, useUpdateCommentMutation, useEngageWithEventMutation, useEngageWithCommentMutation } from '@/RTK/EventsQuery/eventsQuery'
import type { EventCommentItem } from '@/RTK/EventsQuery/endpoint'
import { useGetTemplateByIdQuery } from '@/RTK/TemplatesQuery/templatesQuery'
import { getAllTemplatesInCategory, getCategories } from '@/service/templateLoader'
import type { TemplateSummary } from '@/service/templateLoader'
import TemplatePreview from '@/components/TemplatePreview'
import RegistrationModal from '@/components/RegistrationModal'
import PaymentModal from '@/components/PaymentModal'
import LoginModal from '@/components/LoginModal'

// Temporarily hidden per request - re-enable by flipping this back to true
const SHOW_VIEW_COUNT = false

const EventDetail = () => {
  const { id } = useParams()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [commentError, setCommentError] = useState('')
  const [commentsPage, setCommentsPage] = useState(1)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [pendingAuthAction, setPendingAuthAction] = useState<(() => void) | null>(null)
  const [eventLikeOverride, setEventLikeOverride] = useState<{ liked: boolean; count: number } | null>(null)
  const [commentLikeOverrides, setCommentLikeOverrides] = useState<Record<string, { liked: boolean; count: number }>>({})
  const [openCommentMenuId, setOpenCommentMenuId] = useState<string | null>(null)
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editCommentContent, setEditCommentContent] = useState('')
  const [editCommentError, setEditCommentError] = useState('')
  const COMMENTS_LIMIT = 10

  const commentsSectionRef = useRef<HTMLDivElement>(null)
  const scrollToComments = () => {
    commentsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const readCurrentUserId = (): string | null => {
    try {
      const raw = localStorage.getItem('user')
      return raw ? JSON.parse(raw)?.id ?? null : null
    } catch {
      return null
    }
  }

  const [currentUserId, setCurrentUserId] = useState<string | null>(() => readCurrentUserId())

  // Reset optimistic like/edit state when navigating to a different event.
  // (Logging out always does a full page reload elsewhere in the app, so a
  // real user swap within one mounted instance never happens — only the
  // logged-out -> logged-in transition does, and that must NOT reset state
  // here since it can coincide with a pending like/comment action applying
  // its own optimistic update right after login.)
  useEffect(() => {
    setEventLikeOverride(null)
    setCommentLikeOverrides({})
    setEditingCommentId(null)
    setEditCommentContent('')
    setEditCommentError('')
    setOpenCommentMenuId(null)
  }, [id])

  // Fetch detail via API
  const { data, isFetching, isError, refetch } = useGetEventDetailQuery({ id: id || '1' })

  const e = data?.data
  const isLiked = eventLikeOverride?.liked ?? !!e?.has_liked
  const likeCount = eventLikeOverride?.count ?? (e?.like_count ?? 0)

  // Fetch comments via API
  const { data: commentsData, isFetching: isCommentsFetching } = useGetEventCommentsQuery(
    { event_id: id || '', page: commentsPage, limit: COMMENTS_LIMIT },
    { skip: !id }
  )
  const comments = commentsData?.data ?? []
  const commentsPagination = commentsData?.pagination
  const showCommentsPagination = !!(commentsPagination && (commentsPagination.has_next_page || commentsPagination.has_prev_page))

  // The event detail API's own comment_count field isn't kept in sync with actual
  // comments (it stays 0), so derive the real total from the comments list itself
  // once we've reached the last page; otherwise fall back to the API's count.
  const knownCommentCount = commentsPagination && !commentsPagination.has_next_page
    ? (Number(commentsPagination.current_page || 1) - 1) * COMMENTS_LIMIT + comments.length
    : undefined
  const displayedCommentCount = knownCommentCount ?? e?.comment_count ?? 0

  const getCommentLikeState = (comment: EventCommentItem) => {
    const override = commentLikeOverrides[comment.id]
    return {
      liked: override?.liked ?? !!comment.has_liked,
      count: override?.count ?? (comment.like_count ?? 0),
    }
  }

  const [createComment, { isLoading: isSubmittingComment }] = useCreateCommentMutation()
  const [updateComment, { isLoading: isUpdatingComment }] = useUpdateCommentMutation()
  const [engageWithEvent] = useEngageWithEventMutation()
  const [engageWithComment] = useEngageWithCommentMutation()

  // Requires the user to be authenticated before running `action`; otherwise opens the login modal and reruns `action` on success
  const requireAuth = (action: () => void) => {
    if (localStorage.getItem('isAuthenticated') !== 'true') {
      setPendingAuthAction(() => action)
      setIsLoginModalOpen(true)
      return false
    }
    return true
  }

  // Find local template by template_id
  const [localTemplate, setLocalTemplate] = useState<TemplateSummary | null>(null)
  useEffect(() => {
    if (!e?.template_id) {
      setLocalTemplate(null)
      return
    }
    for (const cat of getCategories()) {
      const found = getAllTemplatesInCategory(cat).find((t) => t.dbId === e.template_id)
      if (found) {
        setLocalTemplate(found)
        return
      }
    }
    setLocalTemplate(null)
  }, [e?.template_id])

  // Fetch template API details to map prop ids to names
  const { data: templateData } = useGetTemplateByIdQuery(e?.template_id || '', { skip: !e?.template_id })

  // Map template_prop_responses to prop names
  const propOverrides = useMemo(() => {
    if (!e?.template_prop_responses || !templateData?.data?.props) return {}
    const map = new Map<string, string>()
    templateData.data.props.forEach((prop: any) => {
      map.set(prop.id, prop.prop_name)
    })
    const result: Record<string, string> = {}
    e.template_prop_responses.forEach((r) => {
      const name = map.get(r.template_prop_id)
      if (name) result[name] = r.prop_response
    })
    return result
  }, [e?.template_prop_responses, templateData?.data?.props])

  const formatSessionDate = (date?: string) =>
    date ? new Date(date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : ''

  const formatSessionTime = (time?: string) =>
    time ? new Date(`1970-01-01T${time}`).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : ''

  const event = useMemo(() => {
    if (!e) return null
    const start = e.start_date ? new Date(e.start_date) : null
    const firstSession = e.sessions?.[0]
    const sessionDate = firstSession?.date ? new Date(firstSession.date) : null
    const hasImage = typeof e.media_url === 'string' && e.media_url.trim() !== '' && !e.media_url.includes('google.com')

    return {
      id: e.id,
      title: e.title,
      organizer: e.user?.name || e.host || 'Unknown',
      date: sessionDate
        ? sessionDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
        : (start ? start.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : ''),
      time: firstSession?.start_time
        ? new Date(`1970-01-01T${firstSession.start_time}`).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
        : (start ? start.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }) : ''),
      location: e.location || '',
      image: hasImage ? e.media_url : undefined,
      description: e.description || '',
      tags: [] as string[],
      tickets: e.tickets || [],
      isFree: !!e.is_free_event,
      sessions: (e.sessions || []).map((s) => ({
        id: s.id,
        name: s.name,
        date: formatSessionDate(s.date),
        startTime: formatSessionTime(s.start_time),
        endTime: formatSessionTime(s.end_time),
      })),
    }
  }, [e])

  // Normalize similar events from the API into a common shape; no mock fallback
  // so an empty similar_events array simply hides the section (see render below).
  const similarEvents = useMemo(() => {
    if (!event) return []
    const base: any[] = (e?.similar_events ?? []).filter((ev) => String(ev.id) !== String(event.id)).slice(0, 4)
    return base.map((ev) => ({
      id: ev.id,
      title: ev.title || '',
      image: ev.media_url || ev.image || 'https://via.placeholder.com/400x225?text=Event',
      isFree: !!ev.is_free_event || !!ev.isFree,
    }))
  }, [e, event])

  const SkeletonDetail = () => (
    <div className="container custom-hero-section-main animate-pulse">
      <div className='mt-6'>
        <div className="w-full h-64 bg-gray-200 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-8">
        <div className="space-y-4">
          <div className="h-8 w-1/2 bg-gray-200 rounded" />
          <div className="h-5 w-1/3 bg-gray-200 rounded" />
          <div className="grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (<div key={i} className="h-12 bg-gray-200 rounded" />))}
          </div>
          <div className="h-24 bg-gray-200 rounded" />
        </div>
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (<div key={i} className="h-16 bg-gray-200 rounded" />))}
        </div>
      </div>
    </div>
  )

  const ErrorState = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center">
      <div>
        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4 mx-auto">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Failed to load event</h3>
        <p className="text-gray-600 text-sm mb-4">Please try again.</p>
        <button onClick={() => refetch()} className="inline-flex items-center px-4 py-2 rounded-full bg-black text-white text-sm hover:bg-gray-800 transition-colors">Try again</button>
      </div>
    </div>
  )

  const EmptyState = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center">
      <div>
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 mx-auto">
          <FileText className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Event Not Found</h3>
        <p className="text-gray-600 mb-6">The event you're looking for doesn't exist.</p>
        <Link to="/events" className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors">Back to Events</Link>
      </div>
    </div>
  )

  if (isFetching) return <SkeletonDetail />
  if (isError) return <ErrorState />
  if (!event) return <EmptyState />

  const performEventLike = async () => {
    const prevLiked = isLiked
    const prevCount = likeCount
    const nextLiked = !prevLiked
    setEventLikeOverride({ liked: nextLiked, count: Math.max(0, prevCount + (nextLiked ? 1 : -1)) })
    try {
      await engageWithEvent({ event_id: id || '', action_type: nextLiked ? 'like' : 'unlike' }).unwrap()
    } catch (err: any) {
      setEventLikeOverride({ liked: prevLiked, count: prevCount })
      const msg = err?.data?.message || err?.error || 'Failed to update like'
      toast.error(msg)
    }
  }

  const handleLikeClick = () => {
    if (!requireAuth(performEventLike)) return
    performEventLike()
  }

  const performCommentLike = async (comment: EventCommentItem) => {
    const { liked, count } = getCommentLikeState(comment)
    const nextLiked = !liked
    setCommentLikeOverrides((prev) => ({
      ...prev,
      [comment.id]: { liked: nextLiked, count: Math.max(0, count + (nextLiked ? 1 : -1)) },
    }))
    try {
      await engageWithComment({ comment_id: comment.id, action_type: nextLiked ? 'like' : 'unlike' }).unwrap()
    } catch (err: any) {
      setCommentLikeOverrides((prev) => ({ ...prev, [comment.id]: { liked, count } }))
      const msg = err?.data?.message || err?.error || 'Failed to update like'
      toast.error(msg)
    }
  }

  const handleCommentLikeClick = (comment: EventCommentItem) => {
    if (!requireAuth(() => performCommentLike(comment))) return
    performCommentLike(comment)
  }

  const postComment = async () => {
    if (!newComment.trim()) {
      setCommentError('Please enter a comment before submitting.')
      return
    }

    setCommentError('')

    try {
      await createComment({ event_id: id || '', content: newComment.trim() }).unwrap()
      setNewComment('')
      setCommentsPage(1)
    } catch (err: any) {
      const msg = err?.data?.message || err?.error || 'Failed to post comment. Please try again.'
      toast.error(msg)
    }
  }

  const handleAddComment = (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault()

    if (!requireAuth(postComment)) return

    postComment()
  }

  const handleStartEditComment = (comment: EventCommentItem) => {
    setEditingCommentId(comment.id)
    setEditCommentContent(comment.content)
    setEditCommentError('')
    setOpenCommentMenuId(null)
  }

  const handleCancelEditComment = () => {
    setEditingCommentId(null)
    setEditCommentContent('')
    setEditCommentError('')
  }

  const handleUpdateComment = async (commentId: string) => {
    if (!editCommentContent.trim()) {
      setEditCommentError('Please enter a comment before submitting.')
      return
    }

    setEditCommentError('')

    try {
      await updateComment({ comment_id: commentId, content: editCommentContent.trim() }).unwrap()
      setEditingCommentId(null)
      setEditCommentContent('')
    } catch (err: any) {
      const msg = err?.data?.message || err?.error || 'Failed to update comment. Please try again.'
      toast.error(msg)
    }
  }

  return (
    <div className="min-h-screen">
        <div className='container custom-hero-section-main'>
          <div className='mt-6 h-80 md:h-[28rem] rounded-lg overflow-hidden bg-gray-100'>
            {localTemplate ? (
              <TemplatePreview tpl={localTemplate} propOverrides={propOverrides} />
            ) : (
              <img
                src={event.image || 'https://via.placeholder.com/1200x600?text=Event'}
                alt={event.title}
                className="w-full h-full object-cover banner-img-main"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/1200x600?text=Event'
                }}
              />
            )}
          </div>
          
          {/* Stats Bar */}
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-6">
              {/* Likes */}
              <button
                onClick={handleLikeClick}
                className="flex items-center gap-2 text-gray-700 hover:text-red-500 transition-colors"
              >
                <Heart
                  className={`w-5 h-5 transition-all ${
                    isLiked
                      ? 'fill-red-500 text-red-500'
                      : 'fill-none text-gray-700'
                  }`}
                />
                <span className="text-sm font-medium">{likeCount}</span>
              </button>
              
              {/* Comments */}
              <button
                onClick={scrollToComments}
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                <span className="text-sm font-medium">{displayedCommentCount}</span>
              </button>
              
              {/* Views - temporarily hidden */}
              {SHOW_VIEW_COUNT && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Eye className="w-5 h-5" />
                  <span className="text-sm font-medium">{e?.view_count ?? 0}</span>
                </div>
              )}

              {/* User Icon */}
              <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors">
                <div className="w-5 h-5 rounded-full border-2 border-gray-700 flex items-center justify-center">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
              </button>
            </div>
            
            {/* Share Button */}
            <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors">
              <Share2 className="w-5 h-5" />
              <span className="text-sm font-medium">Share event</span>
            </button>
          </div>

          {/* Event Details Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-8">
            {/* Left Column - Event Information */}
            <div>
              {/* Event Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {event.title}
              </h1>

              {/* Organizer */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <span className="text-gray-700 text-sm">{event.organizer}</span>
              </div>

              {/* Sessions - shown when the event has more than one session */}
              {event.sessions.length > 1 && (
                <div className="space-y-2 mb-3">
                  {event.sessions.map((session) => (
                    <div key={session.id} className="bg-gray-100 rounded-lg px-4 py-3 flex items-center gap-3 flex-wrap">
                      <span className="text-gray-900 text-sm font-medium">{session.name}</span>
                      <div className="flex items-center gap-2 text-gray-700 text-sm">
                        <Calendar className="w-4 h-4 text-gray-600" />
                        <span>{session.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700 text-sm">
                        <Clock className="w-4 h-4 text-gray-600" />
                        <span>{session.startTime}{session.endTime ? ` - ${session.endTime}` : ''}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Event Info Grid */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {event.sessions.length <= 1 && (
                  <>
                    {/* Date */}
                    <div className="bg-gray-100 rounded-lg px-4 py-3 flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700 text-sm">{event.date}</span>
                    </div>

                    {/* Time */}
                    <div className="bg-gray-100 rounded-lg px-4 py-3 flex items-center gap-3">
                      <Clock className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-700 text-sm">{event.time}</span>
                    </div>
                  </>
                )}

                {/* Location */}
                <div className="bg-gray-100 rounded-lg px-4 py-3 flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700 text-sm">{event.location}</span>
                </div>

                {/* Event Type */}
                <div className="bg-gray-100 rounded-lg px-4 py-3 flex items-center gap-3">
                  <Ticket className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700 text-sm">
                    {event.isFree ? 'Free event' : 'Paid event'}
                  </span>
                </div>
              </div>

              {/* Event Details */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Event Details</h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {event.description || 'This is going to be the description of the event given by the host'}
                </p>
              </div>
            </div>

            {/* Right Column - Tickets & Tags */}
            <div>
              {/* Tickets Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Tickets</h2>

                {event.tickets && event.tickets.length > 0 ? (
                  event.tickets.map((ticket) => {
                    const isFree = ticket.is_free
                    const price = isFree ? 0 : Number(ticket.price ?? 0)
                    const soldOut = Number(ticket.quantity ?? 0) <= 0
                    return (
                      <div
                        key={ticket.id}
                        className={`bg-white border border-gray-200 rounded-lg p-4 mb-3 flex items-center justify-between hover:shadow-sm transition-shadow ${soldOut ? 'opacity-50' : ''}`}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-base">🎫</span>
                              <span className="font-semibold text-gray-900 text-sm">{ticket.name}</span>
                            </div>
                            <div className="flex items-center gap-6 text-xs text-gray-500">
                              <span>Price: ${price}</span>
                              <span>Quantity available: {ticket.quantity ?? 0}</span>
                            </div>
                          </div>
                        </div>
                        {soldOut ? (
                          <span className="text-gray-500 font-medium flex items-center gap-2 text-sm whitespace-nowrap ml-4">
                            Sold out
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        ) : (
                          <button
                            onClick={() => setIsPaymentModalOpen(true)}
                            className="flex items-center gap-2 text-gray-900 hover:text-gray-700 font-medium text-sm whitespace-nowrap ml-4"
                          >
                            Get Ticket
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )
                  })
                ) : (
                  <div className="bg-white border border-gray-200 rounded-lg p-4 text-sm text-gray-500">
                    No tickets available for this event.
                  </div>
                )}
              </div>

              {/* Tags Section */}
              {/* <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {event.tags && event.tags.length > 0 ? (
                    event.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 transition-colors cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    // Default tags if none exist
                    ['tag', 'tag', 'tag', 'tag', 'tag', 'tag'].map((tag, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300 transition-colors cursor-pointer"
                      >
                        {tag}
                      </span>
                    ))
                  )}
                </div>
              </div> */}
            </div>
          </div>

          {/* Register Button — hidden when already logged in */}
          {localStorage.getItem('isAuthenticated') !== 'true' && (
            <div className="py-6">
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-[#ffa500] hover:bg-orange-600 text-white font-semibold py-4 rounded-full flex items-center justify-center gap-2 transition-colors"
              >
                Register
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Comments Section */}
          <div ref={commentsSectionRef} className="bg-gray-50 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments</h2>
            
            {/* Add Comment - One-liner input with submit */}
            <form onSubmit={handleAddComment} className="flex items-start gap-3 mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => {
                    setNewComment(e.target.value)
                    if (commentError) setCommentError('')
                  }}
                  placeholder="Write a comment..."
                  className={`w-full h-11 px-4 rounded-full border focus:outline-none focus:ring-2 bg-white text-sm ${
                    commentError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                  }`}
                />
                {commentError && (
                  <p className="text-red-500 text-xs mt-1 px-2">{commentError}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={isSubmittingComment}
                className="h-11 px-5 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmittingComment ? 'Posting...' : 'Submit'}
              </button>
            </form>

            {isCommentsFetching ? (
              <div className="space-y-6 animate-pulse">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-32 bg-gray-200 rounded" />
                      <div className="h-3 w-full bg-gray-200 rounded" />
                      <div className="h-3 w-2/3 bg-gray-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : comments.length === 0 ? (
              <p className="text-gray-500 text-sm">No comments yet. Be the first to comment.</p>
            ) : (
              <div className="space-y-6">
                {comments.map((comment) => {
                  const { liked: commentLiked, count: commentLikeCount } = getCommentLikeState(comment)
                  return (
                  <div key={comment.id} className="border-b border-gray-200 pb-6 last:border-b-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden">
                        {comment.user?.profile_image ? (
                          <img src={comment.user.profile_image} alt={comment.user?.name || 'User'} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-gray-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">{comment.user?.name || 'Anonymous'}</h3>
                          {comment.user_id && comment.user_id === currentUserId && (
                            <div className="relative">
                              <button
                                onClick={() => setOpenCommentMenuId(openCommentMenuId === comment.id ? null : comment.id)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <MoreHorizontal className="w-5 h-5" />
                              </button>
                              {openCommentMenuId === comment.id && (
                                <div className="absolute right-0 mt-1 w-28 bg-white border border-gray-200 rounded-lg shadow-lg z-10 overflow-hidden">
                                  <button
                                    onClick={() => handleStartEditComment(comment)}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  >
                                    Edit
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        {editingCommentId === comment.id ? (
                          <div className="mb-3">
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={editCommentContent}
                                onChange={(ev) => {
                                  setEditCommentContent(ev.target.value)
                                  if (editCommentError) setEditCommentError('')
                                }}
                                className={`flex-1 h-10 px-3 rounded-full border focus:outline-none focus:ring-2 bg-white text-sm ${
                                  editCommentError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-orange-500'
                                }`}
                              />
                              <button
                                onClick={() => handleUpdateComment(comment.id)}
                                disabled={isUpdatingComment}
                                className="h-10 px-4 rounded-full bg-black text-white text-sm font-medium hover:bg-gray-800 transition-colors whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
                              >
                                {isUpdatingComment ? 'Updating...' : 'Update comment'}
                              </button>
                              <button
                                type="button"
                                onClick={handleCancelEditComment}
                                className="h-10 px-4 rounded-full border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition-colors whitespace-nowrap"
                              >
                                Cancel
                              </button>
                            </div>
                            {editCommentError && (
                              <p className="text-red-500 text-xs mt-1 px-2">{editCommentError}</p>
                            )}
                          </div>
                        ) : (
                          <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                            {comment.content}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm">
                          <button
                            onClick={() => handleCommentLikeClick(comment)}
                            className="flex items-center gap-1 text-gray-600 hover:text-red-500"
                          >
                            <Heart className={`w-4 h-4 transition-all ${commentLiked ? 'fill-red-500 text-red-500' : 'fill-none text-gray-600'}`} />
                            <span>{commentLikeCount}</span>
                          </button>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Eye className="w-4 h-4" />
                            <span>{comment.view_count ?? 0}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  )
                })}
              </div>
            )}

            {showCommentsPagination && (
              <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setCommentsPage((p) => Math.max(1, p - 1))}
                  disabled={!commentsPagination?.has_prev_page}
                  className="px-4 py-2 rounded-full text-sm font-medium border border-gray-300 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">Page {commentsPage}</span>
                <button
                  onClick={() => setCommentsPage((p) => p + 1)}
                  disabled={!commentsPagination?.has_next_page}
                  className="px-4 py-2 rounded-full text-sm font-medium border border-gray-300 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      {/* Similar Events Section */}
      {similarEvents.length > 0 && (
        <div className="px-8 py-8 container">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Similar events</h3>
            <Link to="/events" className="text-orange-500 hover:text-orange-600 text-sm font-medium">
              See all events →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarEvents.map((similarEvent) => (
              <Link
                key={similarEvent.id}
                to={`/events/${similarEvent.id}`}
                className="block group"
              >
                <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="aspect-video">
                    <img
                      src={similarEvent.image}
                      alt={similarEvent.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium text-gray-900 group-hover:text-orange-500 transition-colors mb-2">
                      Name of event
                    </h4>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <User className="w-4 h-4" />
                      <span className="text-sm">YOU (Rupert David)</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">November 20, 2023 • 9:00 AM</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 mb-3">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">Downtown Convention Center</span>
                    </div>
                    <div className="text-sm">
                      {similarEvent.isFree ? (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded font-medium">Free</span>
                      ) : (
                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded font-medium">Paid</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Registration Modal */}
      <RegistrationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        eventTitle={event.title}
      />

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        ticketPrice={Number(event.tickets?.[0]?.price ?? 50)}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => {
          setCurrentUserId(readCurrentUserId())
          pendingAuthAction?.()
          setPendingAuthAction(null)
        }}
      />
    </div>
  )
}

export default EventDetail
