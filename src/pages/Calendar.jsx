import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import Footer from '../components/Footer'

export default function Calendar() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchParams] = useSearchParams()
  const searchQuery = (searchParams.get('q') || '').trim().toLowerCase()

  useEffect(() => {
    fetchEvents()
  }, [])

  async function fetchEvents() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('events')
        .select('id, title, date, location, category, image_url')
        .order('date', { ascending: true })

      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error('Error fetching calendar events:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
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
              Calendar
            </h1>
            <p className="text-on-surface-variant max-w-2xl leading-relaxed">
              Browse upcoming events in date order and jump straight to registration.
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
              <p className="mt-4 text-on-surface-variant">Loading calendar...</p>
            </div>
          </div>
        ) : error ? (
          <div className="status-card bg-error-container text-on-error-container">
            <p className="font-bold mb-2">Could not load calendar</p>
            <p>{error}</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredEvents.map((event) => (
              <article key={event.id} className="section-card p-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-4 min-w-0">
                  <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-center">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-primary">
                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                      <div className="text-xl font-bold text-on-surface">
                        {new Date(event.date).getDate()}
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-outline">
                      {event.category}
                    </span>
                    <h2 className="mt-1 text-xl font-bold text-on-surface">{event.title}</h2>
                    <p className="text-on-surface-variant">
                      {formatDate(event.date)} · {formatTime(event.date)} · {event.location}
                    </p>
                  </div>
                </div>
                <Link to={`/event/${event.id}`} className="primary-action px-5 py-3 md:shrink-0">
                  Register
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}