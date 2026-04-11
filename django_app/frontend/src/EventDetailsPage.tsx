import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import { Header } from '@/components/ui/header-2'
import { useToast } from '@/components/ui/toast'
import { fetchEvent, registerForEvent, type EventItem } from '@/lib/api'
import { useEventStore } from '@/state/event-store'

export default function EventDetailsPage() {
  const { id } = useParams()
  const eventId = Number(id)
  const [event, setEvent] = useState<EventItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const { events, eventsLoading, sessionUser, updateEvent } = useEventStore()
  const { pushToast } = useToast()

  const cachedEvent = events.find((item) => item.id === eventId) ?? null

  useEffect(() => {
    let isMounted = true

    async function loadPage() {
      if (cachedEvent) {
        if (isMounted) {
          setEvent(cachedEvent)
          setLoading(false)
        }
        return
      }

      if (eventsLoading) {
        return
      }

      try {
        const eventData = await fetchEvent(eventId)
        if (!isMounted) return

        setEvent(eventData)
        updateEvent(eventData)
      } catch {
        if (isMounted) {
          setEvent(null)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadPage()

    return () => {
      isMounted = false
    }
  }, [cachedEvent, eventId, updateEvent])

  const handleRegister = async () => {
    if (!event) return

    setBusy(true)
    setMessage(null)

    try {
      const updatedEvent = await registerForEvent(event.id)
      setEvent(updatedEvent)
      setMessage('Registration saved.')
      pushToast({
        title: 'Registration successful',
        description: 'Your registration was saved for this event.',
        tone: 'success',
      })
    } catch (registrationError) {
      const errorMessage = registrationError instanceof Error ? registrationError.message : 'Unable to register.'
      setMessage(errorMessage)
      pushToast({
        title: 'Registration failed',
        description: errorMessage,
        tone: 'error',
      })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto w-full max-w-5xl px-4 py-12 md:px-6">
        <Link to="/" className="inline-flex rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
          Back to events
        </Link>

        {loading ? (
          <div className="mt-6 rounded-[1.5rem] border border-border bg-card p-8">Loading event details...</div>
        ) : event ? (
          <article className="mt-6 overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-sm">
            <div className="relative h-[22rem] bg-slate-100">
              <img alt={event.title} src={event.image_url} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white md:p-8">
                <p className="mb-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] backdrop-blur">
                  {event.category}
                </p>
                <h1 className="text-3xl font-bold tracking-tight md:text-5xl">{event.title}</h1>
              </div>
            </div>

            <div className="grid gap-8 p-6 md:grid-cols-[1.2fr_0.8fr] md:p-8">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {new Date(event.starts_at).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
                <p className="text-base leading-7 text-foreground">{event.description}</p>
              </div>

              <aside className="rounded-[1.25rem] border border-border bg-background p-5">
                <h2 className="text-xl font-semibold">Registration</h2>
                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <p>Location: {event.location}</p>
                  <p>Capacity: {event.capacity}</p>
                  <p>Spots left: {event.spots_left}</p>
                </div>

                {message ? <p className="mt-4 text-sm text-muted-foreground">{message}</p> : null}

                <button
                  type="button"
                  onClick={handleRegister}
                  disabled={busy || event.spots_left === 0}
                  className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                >
                  {!sessionUser ? 'Sign in on the home page to register' : busy ? 'Registering...' : event.spots_left === 0 ? 'Full' : 'Register for this event'}
                </button>
              </aside>
            </div>
          </article>
        ) : (
          <div className="mt-6 rounded-[1.5rem] border border-border bg-card p-8">Event not found.</div>
        )}
      </main>
    </div>
  )
}
