import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import EventCard from '../components/EventCard'
import Footer from '../components/Footer'

export default function Home() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchParams] = useSearchParams()

  const categories = ['All', 'Workshops', 'Sports', 'Seminars', 'Clubs']
  const searchQuery = (searchParams.get('q') || '').trim().toLowerCase()

  useEffect(() => {
    fetchEvents()
  }, [])

  async function fetchEvents() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true })

      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      console.error('Error fetching events:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const filteredEvents = events.filter((event) => {
    const categoryMatches = selectedCategory === 'All' || event.category === selectedCategory
    const haystack = [event.title, event.description, event.location, event.category]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    const searchMatches = !searchQuery || haystack.includes(searchQuery)

    return categoryMatches && searchMatches
  })

  return (
    <main className="app-page lg:ml-64">
      <div className="page-shell">
        <header className="mb-12">
          <h1 className="text-4xl font-extrabold text-on-surface header-anchor mb-4">
            Campus Events
          </h1>
          <p className="text-on-surface-variant max-w-2xl leading-relaxed">
            Discover, attend, and curate your academic journey with the season's premier seminars, workshops, and student gatherings.
          </p>
          {searchQuery ? (
            <p className="mt-4 inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              Searching for “{searchParams.get('q')}”
            </p>
          ) : null}
        </header>

        <div className="flex flex-wrap gap-3 mb-10 items-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`chip-button ${
                selectedCategory === category
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
              }`}
            >
              {category}
            </button>
          ))}
          <div className="h-px flex-1 bg-surface-container ml-4 hidden sm:block"></div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
              <p className="mt-4 text-on-surface-variant">Loading events...</p>
            </div>
          </div>
        ) : error ? (
          <div className="status-card bg-error-container text-on-error-container">
            <p className="font-bold mb-2">Error loading events</p>
            <p>{error}</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-outline mb-4">event_busy</span>
            <p className="text-on-surface-variant">No events found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
        <Footer />
    </main>
  )
}
