import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import Footer from '../components/Footer'

export default function Registered() {
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchParams] = useSearchParams()
  const searchQuery = (searchParams.get('q') || '').trim().toLowerCase()

  useEffect(() => {
    fetchRegistrations()
  }, [])

  async function fetchRegistrations() {
    try {
      setLoading(true)

      const [{ data: registrationData, error: registrationError }, { data: eventData, error: eventError }] = await Promise.all([
        supabase
          .from('registrations')
          .select('id, event_id, user_name, user_email, created_at')
          .order('created_at', { ascending: false }),
        supabase
          .from('events')
          .select('id, title, date, location, category')
      ])

      if (registrationError) throw registrationError
      if (eventError) throw eventError

      const eventsById = new Map((eventData || []).map((event) => [event.id, event]))
      const merged = (registrationData || []).map((registration) => ({
        ...registration,
        event: eventsById.get(registration.event_id) || null,
      }))

      setRegistrations(merged)
    } catch (error) {
      console.error('Error fetching registrations:', error)
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

  const filteredRegistrations = registrations.filter((registration) => {
    if (!searchQuery) return true

    const haystack = [
      registration.user_name,
      registration.user_email,
      registration.event?.title,
      registration.event?.location,
      registration.event?.category,
    ]
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
              Registered
            </h1>
            <p className="text-on-surface-variant max-w-2xl leading-relaxed">
              Review recent registrations and jump back into the related event when needed.
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
              <p className="mt-4 text-on-surface-variant">Loading registrations...</p>
            </div>
          </div>
        ) : error ? (
          <div className="status-card bg-error-container text-on-error-container">
            <p className="font-bold mb-2">Could not load registrations</p>
            <p>{error}</p>
          </div>
        ) : filteredRegistrations.length === 0 ? (
          <div className="status-card section-card p-8 text-center">
            <p className="text-on-surface font-bold mb-2">No registrations yet</p>
            <p className="text-on-surface-variant mb-6">Once attendees register, they’ll appear here.</p>
            <Link to="/calendar" className="primary-action px-5 py-3">
              Browse Calendar
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredRegistrations.map((registration) => (
              <article key={registration.id} className="section-card p-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-outline">Registered</span>
                  <h2 className="mt-1 text-xl font-bold text-on-surface">
                    {registration.user_name}
                  </h2>
                  <p className="text-on-surface-variant">
                    {registration.user_email} · {formatDate(registration.created_at)}
                  </p>
                  {registration.event ? (
                    <p className="mt-2 text-sm text-on-surface-variant">
                      For {registration.event.title} · {registration.event.location}
                    </p>
                  ) : null}
                </div>
                {registration.event ? (
                  <Link to={`/event/${registration.event.id}`} className="secondary-action px-5 py-3 md:shrink-0">
                    View Event
                  </Link>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}