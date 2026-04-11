import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'

import { fetchEvents, fetchSession, type AuthUser, type EventItem } from '@/lib/api'

type EventStoreValue = {
  events: EventItem[]
  eventsLoading: boolean
  eventsError: string | null
  sessionUser: AuthUser | null
  sessionLoading: boolean
  updateEvent: (event: EventItem) => void
  setSessionUser: (user: AuthUser | null) => void
}

const EventStoreContext = createContext<EventStoreValue | null>(null)

export function EventStoreProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<EventItem[]>([])
  const [eventsLoading, setEventsLoading] = useState(true)
  const [eventsError, setEventsError] = useState<string | null>(null)
  const [sessionUser, setSessionUser] = useState<AuthUser | null>(null)
  const [sessionLoading, setSessionLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadInitialState() {
      const [eventsResult, sessionResult] = await Promise.allSettled([fetchEvents(), fetchSession()])

      if (!isMounted) {
        return
      }

      if (eventsResult.status === 'fulfilled') {
        setEvents(eventsResult.value)
        setEventsError(null)
      } else {
        setEventsError(eventsResult.reason instanceof Error ? eventsResult.reason.message : 'Unable to load events from the Django backend.')
      }

      if (sessionResult.status === 'fulfilled') {
        setSessionUser(sessionResult.value.user)
      } else {
        setSessionUser(null)
      }

      setEventsLoading(false)
      setSessionLoading(false)
    }

    loadInitialState()

    return () => {
      isMounted = false
    }
  }, [])

  const updateEvent = useCallback((updatedEvent: EventItem) => {
    setEvents((current) => current.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)))
  }, [])

  const value: EventStoreValue = {
    events,
    eventsLoading,
    eventsError,
    sessionUser,
    sessionLoading,
    updateEvent,
    setSessionUser,
  }

  return <EventStoreContext.Provider value={value}>{children}</EventStoreContext.Provider>
}

export function useEventStore() {
  const context = useContext(EventStoreContext)

  if (!context) {
    throw new Error('useEventStore must be used within an EventStoreProvider')
  }

  return context
}
