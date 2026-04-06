import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import RatingStars from '../components/RatingStars'
import Footer from '../components/Footer'

export default function Feedback() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(0)
  const [selectedTags, setSelectedTags] = useState([])
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const availableTags = [
    'Well Organized',
    'Too Long',
    'Engaging',
    'Helpful Staff',
    'Great Venue',
    'Informative'
  ]

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  useEffect(() => {
    fetchEvent()
  }, [eventId])

  async function fetchEvent() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('events')
        .select('id, title, date, location, category')
        .eq('id', eventId)
        .single()

      if (error) throw error
      setEvent(data)
    } catch (error) {
      console.error('Error fetching feedback event:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (rating === 0) {
      setError('Please select a rating')
      return
    }

    try {
      setSubmitting(true)
      const { error } = await supabase
        .from('feedback')
        .insert([
          {
            event_id: eventId,
            rating: rating,
            tags: selectedTags,
            comment: comment
          }
        ])

      if (error) throw error

      setSuccess(true)
      setTimeout(() => {
        navigate('/')
      }, 2000)
    } catch (error) {
      console.error('Error submitting feedback:', error)
      setError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="app-page pt-20 flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-on-surface-variant">Loading feedback form...</p>
        </div>
      </div>
    )
  }

  if (error && !event) {
    return (
      <div className="app-page pt-20 flex justify-center items-center px-8">
        <div className="status-card bg-error-container text-on-error-container max-w-md w-full">
          <p className="font-bold mb-2">Feedback unavailable</p>
          <p className="mb-4">{error}</p>
          <Link
            to="/"
            className="primary-action px-6 py-3"
          >
            Back to Events
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="app-page">
      <main className="page-shell lg:ml-64 max-w-4xl py-20">
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-4 text-slate-500">
            <span className="text-[10px] font-semibold uppercase tracking-widest">Events</span>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="text-[10px] font-semibold uppercase tracking-widest">Feedback</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-on-surface mb-2 -ml-1">
            Share Your Feedback
          </h1>
          <p className="text-slate-500 font-medium max-w-2xl">
            Thank you for attending. Your insights help us curate better academic experiences.
          </p>
        </header>

        {event && (
          <section className="page-card p-6 mb-8">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-bold text-outline tracking-widest uppercase">Selected Event</span>
              <h2 className="text-2xl font-bold text-on-surface">{event.title}</h2>
              <p className="text-on-surface-variant">
                {formatDate(event.date)} · {event.location}
              </p>
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 gap-8">
            {success ? (
              <div className="status-card bg-primary/5 border-2 border-primary/10 flex flex-col items-center text-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center">
                  <span className="material-symbols-outlined star-filled">check_circle</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-on-surface">Thank you for your feedback!</h4>
                  <p className="text-sm text-on-surface-variant">Your response has been recorded in the database.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full justify-center">
                  <Link
                    to={event ? `/event/${event.id}` : '/'}
                    className="secondary-action px-6 py-3"
                  >
                    Back to Event
                  </Link>
                  <Link
                    to="/"
                    className="primary-action px-6 py-3"
                  >
                    View More Events
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Rating Card */}
                <section className="section-card p-8">
                  <h2 className="text-lg font-bold mb-6 text-on-surface">
                    How was your overall experience?
                  </h2>
                  <div className="flex items-center gap-4">
                    <RatingStars rating={rating} setRating={setRating} />
                    {rating > 0 && (
                      <span className="text-sm font-bold text-primary ml-2 bg-primary/10 px-3 py-1 rounded-full">
                        {rating} / 5
                      </span>
                    )}
                  </div>
                </section>

                {/* Tags */}
                <section className="section-card p-8">
                  <h2 className="text-lg font-bold mb-6 text-on-surface">
                    Select what stood out to you
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {availableTags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-5 py-2.5 rounded-full border-2 font-semibold text-sm transition-all ${
                          selectedTags.includes(tag)
                              ? 'bg-primary/10 text-primary border-primary/20'
                              : 'bg-surface-container-low text-on-surface-variant border-transparent hover:bg-surface-container-high'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </section>

                {/* Comment */}
                <section className="section-card p-8">
                  <h2 className="text-lg font-bold mb-4 text-on-surface">Additional Comments</h2>
                  <textarea
                    className="field-input"
                    placeholder="Share your detailed thoughts or suggestions..."
                    rows="4"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                </section>

                {/* Error Message */}
                {error && (
                  <div className="bg-error-container text-on-error-container p-4 rounded-xl">
                    <p className="flex items-center gap-2">
                      <span className="material-symbols-outlined">error</span>
                      {error}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex items-center justify-end gap-6 pt-4">
                  <button
                    type="submit"
                    disabled={submitting || rating === 0}
                    className="primary-action px-10 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Submitting...' : 'Submit Feedback'}
                  </button>
                </div>
              </form>
            )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
