import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import Footer from '../components/Footer'

export default function FeedbackHub() {
  const [events, setEvents] = useState([])
  const [feedbackCounts, setFeedbackCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchParams] = useSearchParams()
  const searchQuery = (searchParams.get('q') || '').trim().toLowerCase()

  useEffect(() => {
    fetchFeedbackHub()
  }, [])

  async function fetchFeedbackHub() {
    try {
      setLoading(true)

      const [{ data: eventData, error: eventError }, { data: feedbackData, error: feedbackError }] = await Promise.all([
        supabase
          .from('events')
          .select('id, title, date, location, category')
          .order('date', { ascending: true }),
        supabase
          .from('feedback')
          .select('event_id, rating')
      ])

      if (eventError) throw eventError
      if (feedbackError) throw feedbackError

      const counts = (feedbackData || []).reduce((accumulator, item) => {
        const current = accumulator[item.event_id] || { count: 0, total: 0 }
        current.count += 1
        current.total += item.rating || 0
        accumulator[item.event_id] = current
        return accumulator
      }, {})

      setFeedbackCounts(counts)
      setEvents(eventData || [])
    } catch (error) {
      console.error('Error fetching feedback hub:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const filteredEvents = events.filter((event) => {
    if (!searchQuery) return true

    const haystack = [event.title, event.location, event.category]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return haystack.includes(searchQuery)
  })

  return (
    <main className="app-page lg:ml-64">
      <div className="page-shell">
        <header className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-on-surface header-anchor mb-4">
              Feedback
            </h1>
            <p className="text-on-surface-variant max-w-2xl leading-relaxed">
              Pick an event and send feedback using the same flow every time.
            </p>
          </div>
          <Link to="/" className="secondary-action px-5 py-3">
            Back to Events
          </Link>
        </header>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              <p className="mt-4 text-on-surface-variant">Loading feedback options...</p>
            </div>
          </div>
        ) : error ? (
          <div className="status-card bg-error-container text-on-error-container">
            <p className="font-bold mb-2">Could not load feedback options</p>
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredEvents.map((event) => {
              const summary = feedbackCounts[event.id]
              const average = summary && summary.count > 0 ? (summary.total / summary.count).toFixed(1) : 'No ratings yet'

              return (
                <article key={event.id} className="section-card p-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-outline">
                      {event.category}
                    </span>
                    <h2 className="mt-1 text-xl font-bold text-on-surface">{event.title}</h2>
                    <p className="text-on-surface-variant">
                      {formatDate(event.date)} · {event.location}
                    </p>
                    <p className="mt-2 text-sm text-on-surface-variant">
                      Feedback: {typeof average === 'string' ? average : `${average} / 5`} · {summary?.count || 0} responses
                    </p>
                  </div>
                  <Link to={`/feedback/${event.id}`} className="primary-action px-5 py-3 md:shrink-0">
                    Give Feedback
                  </Link>
                </article>
              )
            })}
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}