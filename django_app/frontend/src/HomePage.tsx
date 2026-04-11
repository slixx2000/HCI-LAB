import { FormEvent, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { Header } from '@/components/ui/header-2'
import { loginUser, logoutUser, registerForEvent, registerUser } from '@/lib/api'
import { useToast } from '@/components/ui/toast'
import { useEventStore } from '@/state/event-store'

const categoryOrder = ['All', 'Seminars', 'Workshops', 'Sports', 'Clubs']
const EVENTS_PER_PAGE = 6

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [authMessage, setAuthMessage] = useState<string | null>(null)
  const [authBusy, setAuthBusy] = useState(false)
  const [authForm, setAuthForm] = useState({ username: '', email: '', password: '' })
  const [registeringEventId, setRegisteringEventId] = useState<number | null>(null)
  const [eventFeedback, setEventFeedback] = useState<Record<number, string>>({})
  const [currentPage, setCurrentPage] = useState(1)

  const {
    events,
    eventsLoading,
    eventsError,
    sessionUser,
    sessionLoading,
    updateEvent,
    setSessionUser,
  } = useEventStore()
  const { pushToast } = useToast()

  const filteredEvents = useMemo(() => {
    if (activeCategory === 'All') return events
    return events.filter((event) => event.category === activeCategory)
  }, [activeCategory, events])

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / EVENTS_PER_PAGE))
  const safePage = Math.min(currentPage, totalPages)
  const startIndex = (safePage - 1) * EVENTS_PER_PAGE
  const paginatedEvents = filteredEvents.slice(startIndex, startIndex + EVENTS_PER_PAGE)

  const featuredEvent = paginatedEvents[0] ?? filteredEvents[0] ?? events[0] ?? null

  const handleAuthSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setAuthBusy(true)
    setAuthMessage(null)

    try {
      const nextSession =
        authMode === 'login'
          ? await loginUser(authForm.username, authForm.password)
          : await registerUser(authForm.username, authForm.email, authForm.password)

      setSessionUser(nextSession.user)
      setAuthForm({ username: '', email: '', password: '' })
      const successMessage = authMode === 'login' ? 'Signed in successfully.' : 'Account created and signed in.'
      setAuthMessage(successMessage)
      pushToast({
        title: authMode === 'login' ? 'Login successful' : 'Account created',
        description: successMessage,
        tone: 'success',
      })
    } catch (authError) {
      const message = authError instanceof Error ? authError.message : 'Authentication failed.'
      setAuthMessage(message)
      pushToast({
        title: 'Authentication failed',
        description: message,
        tone: 'error',
      })
    } finally {
      setAuthBusy(false)
    }
  }

  const handleLogout = async () => {
    setAuthBusy(true)
    setAuthMessage(null)

    try {
      await logoutUser()
      setSessionUser(null)
      setEventFeedback({})
      setAuthMessage('Signed out.')
      pushToast({
        title: 'Signed out',
        description: 'You have been signed out of your campus account.',
        tone: 'info',
      })
    } catch (logoutError) {
      const message = logoutError instanceof Error ? logoutError.message : 'Unable to sign out.'
      setAuthMessage(message)
      pushToast({
        title: 'Sign out failed',
        description: message,
        tone: 'error',
      })
    } finally {
      setAuthBusy(false)
    }
  }

  const handleRegisterEvent = async (eventId: number) => {
    setRegisteringEventId(eventId)
    setEventFeedback((current) => ({ ...current, [eventId]: '' }))

    try {
      const updatedEvent = await registerForEvent(eventId)
      updateEvent(updatedEvent)
      const message = 'Registration saved.'
      setEventFeedback((current) => ({ ...current, [eventId]: message }))
      pushToast({
        title: 'Registration successful',
        description: 'Your spot for this event has been reserved.',
        tone: 'success',
      })
    } catch (registrationError) {
      const message = registrationError instanceof Error ? registrationError.message : 'Unable to register.'
      setEventFeedback((current) => ({
        ...current,
        [eventId]: message,
      }))
      pushToast({
        title: 'Registration failed',
        description: message,
        tone: 'error',
      })
    } finally {
      setRegisteringEventId(null)
    }
  }

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    setCurrentPage(1)
  }

  const handlePagination = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6">
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-stretch">
          <article className="overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-sm">
            <div className="relative min-h-[22rem] w-full bg-slate-100">
              {featuredEvent ? <img alt={featuredEvent.title} src={featuredEvent.image_url} className="absolute inset-0 h-full w-full object-cover" /> : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                <p className="mb-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-white backdrop-blur">
                  Django backed events
                </p>
                <h1 className="max-w-3xl text-3xl font-bold tracking-tight text-white md:text-5xl">
                  Eventium, rendered from the Django backend.
                </h1>
                <p className="mt-4 max-w-2xl text-sm text-white/85 md:text-base">
                  This React frontend now pulls real event data from Django and keeps the shadcn-style header and UI structure.
                </p>
              </div>
            </div>
          </article>

          <aside id="auth" className="rounded-[1.75rem] border border-border bg-card p-6 shadow-sm md:p-8">
            <h2 className="text-2xl font-semibold">Current Snapshot</h2>
            <p className="mt-2 text-sm text-muted-foreground">Filter the live events feed and open the Django event detail pages directly.</p>

            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl border border-border bg-background p-4">
                <div className="text-muted-foreground">Events Loaded</div>
                <div className="mt-1 text-2xl font-bold">{events.length}</div>
              </div>
              <div className="rounded-2xl border border-border bg-background p-4">
                <div className="text-muted-foreground">Active Filter</div>
                <div className="mt-1 text-2xl font-bold">{activeCategory}</div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {categoryOrder.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryChange(category)}
                  className={[
                    'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                    activeCategory === category
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background text-foreground hover:bg-accent hover:text-accent-foreground',
                  ].join(' ')}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-border bg-background p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold">{sessionUser ? 'Signed in' : 'Session'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {sessionLoading ? 'Checking session state...' : sessionUser ? `Welcome, ${sessionUser.username}` : 'Sign in or create an account to register.'}
                  </p>
                </div>
                {sessionUser ? (
                  <button type="button" onClick={handleLogout} disabled={authBusy} className="rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground disabled:opacity-50">
                    Sign out
                  </button>
                ) : null}
              </div>

              <div className="mt-4 flex gap-2">
                <button type="button" onClick={() => setAuthMode('login')} className={[ 'rounded-full px-3 py-1.5 text-sm font-medium', authMode === 'login' ? 'bg-primary text-primary-foreground' : 'bg-accent/20 text-foreground' ].join(' ')}>
                  Login
                </button>
                <button type="button" onClick={() => setAuthMode('register')} className={[ 'rounded-full px-3 py-1.5 text-sm font-medium', authMode === 'register' ? 'bg-primary text-primary-foreground' : 'bg-accent/20 text-foreground' ].join(' ')}>
                  Register
                </button>
              </div>

              <form className="mt-4 grid gap-3" onSubmit={handleAuthSubmit}>
                <input value={authForm.username} onChange={(event) => setAuthForm((current) => ({ ...current, username: event.target.value }))} placeholder="Username" className="rounded-md border border-border bg-background px-3 py-2 text-sm" />
                {authMode === 'register' ? (
                  <input value={authForm.email} onChange={(event) => setAuthForm((current) => ({ ...current, email: event.target.value }))} placeholder="Email" type="email" className="rounded-md border border-border bg-background px-3 py-2 text-sm" />
                ) : null}
                <input value={authForm.password} onChange={(event) => setAuthForm((current) => ({ ...current, password: event.target.value }))} placeholder="Password" type="password" className="rounded-md border border-border bg-background px-3 py-2 text-sm" />
                <button type="submit" disabled={authBusy} className="rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50">
                  {authBusy ? 'Working...' : authMode === 'login' ? 'Sign In' : 'Create Account'}
                </button>
              </form>

              {authMessage ? <p className="mt-3 text-sm text-muted-foreground">{authMessage}</p> : null}
            </div>
          </aside>
        </section>

        <section id="events" className="mt-10">
          {eventsLoading ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-[28rem] animate-pulse rounded-[1.5rem] border border-border bg-card" />)}
            </div>
          ) : eventsError ? (
            <div className="rounded-[1.5rem] border border-destructive/30 bg-destructive/5 p-6 text-destructive">{eventsError}</div>
          ) : filteredEvents.length === 0 ? (
            <div className="rounded-[1.5rem] border border-border bg-card p-8 text-center text-muted-foreground">No events match the current filter.</div>
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {paginatedEvents.map((event) => (
                <article key={event.id} className="overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-sm transition-transform duration-200 hover:-translate-y-1">
                  <div className="relative h-56 bg-slate-100">
                    <img alt={event.title} src={event.image_url} className="h-full w-full object-cover" />
                    <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary backdrop-blur">
                      {event.category}
                    </div>
                  </div>
                  <div className="space-y-4 p-5">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold leading-tight text-foreground">{event.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(event.starts_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                    <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">{event.description}</p>

                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{event.location}</span>
                      <span>{event.spots_left} spots left</span>
                    </div>

                    {eventFeedback[event.id] ? <p className="text-sm text-muted-foreground">{eventFeedback[event.id]}</p> : null}

                    <div className="grid gap-2 sm:grid-cols-2">
                      <Link to={`/events/${event.id}`} className="inline-flex w-full items-center justify-center rounded-md border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground">
                        Open Details
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleRegisterEvent(event.id)}
                        disabled={registeringEventId === event.id || event.spots_left === 0}
                        className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                      >
                        {event.spots_left === 0 ? 'Full' : registeringEventId === event.id ? 'Registering...' : sessionUser ? 'Register' : 'Sign in to Register'}
                      </button>
                    </div>
                  </div>
                </article>
                ))}
              </div>

              {filteredEvents.length > EVENTS_PER_PAGE ? (
                <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3">
                  <p className="text-sm text-muted-foreground">
                    Showing {startIndex + 1}-{Math.min(startIndex + EVENTS_PER_PAGE, filteredEvents.length)} of {filteredEvents.length} events
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      disabled={safePage === 1}
                      onClick={() => handlePagination(safePage - 1)}
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }).map((_, index) => {
                      const page = index + 1
                      return (
                        <button
                          key={page}
                          type="button"
                          className={[
                            'btn',
                            page === safePage ? 'btn-primary' : 'btn-secondary',
                          ].join(' ')}
                          onClick={() => handlePagination(page)}
                        >
                          {page}
                        </button>
                      )
                    })}
                    <button
                      type="button"
                      className="btn btn-secondary"
                      disabled={safePage === totalPages}
                      onClick={() => handlePagination(safePage + 1)}
                    >
                      Next
                    </button>
                  </div>
                </div>
              ) : null}
            </>
          )}
        </section>
      </main>
    </div>
  )
}
