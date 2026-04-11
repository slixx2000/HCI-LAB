export type EventItem = {
  id: number
  title: string
  description: string
  category: string
  location: string
  starts_at: string
  capacity: number
  spots_left: number
  registered_count: number
  image_url: string
  detail_url: string
}

export type AuthUser = {
  id: number
  username: string
  email: string
}

export type SessionState = {
  authenticated: boolean
  user: AuthUser | null
}

export async function ensureCsrfToken(): Promise<string> {
  const response = await fetch('/api/csrf/', { credentials: 'include' })
  if (!response.ok) {
    throw new Error('Unable to initialize session security.')
  }

  const data: { csrfToken: string } = await response.json()
  return data.csrfToken
}

export async function fetchSession(): Promise<SessionState> {
  const response = await fetch('/api/me/', { credentials: 'include' })
  if (!response.ok) {
    throw new Error('Unable to load session state.')
  }

  return response.json()
}

async function postForm(path: string, payload: Record<string, string>) {
  const csrfToken = await ensureCsrfToken()
  const response = await fetch(path, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      'X-CSRFToken': csrfToken,
    },
    body: new URLSearchParams(payload).toString(),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.detail || 'Request failed.')
  }

  return data
}

export async function loginUser(username: string, password: string): Promise<SessionState> {
  return postForm('/api/auth/login/', { username, password })
}

export async function registerUser(username: string, email: string, password: string): Promise<SessionState> {
  return postForm('/api/auth/register/', { username, email, password })
}

export async function logoutUser(): Promise<void> {
  await postForm('/api/auth/logout/', {})
}

export async function registerForEvent(eventId: number): Promise<EventItem> {
  const csrfToken = await ensureCsrfToken()
  const response = await fetch(`/api/events/${eventId}/register/`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'X-CSRFToken': csrfToken,
    },
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.detail || 'Unable to register for the event.')
  }

  return data.event as EventItem
}

export async function fetchEvents(): Promise<EventItem[]> {
  const response = await fetch('/api/events/')
  if (!response.ok) {
    throw new Error('Unable to load events from the Django backend.')
  }

  const data: { results: EventItem[] } = await response.json()
  return data.results
}

export async function fetchEvent(eventId: number): Promise<EventItem> {
  const response = await fetch(`/api/events/${eventId}/`)
  if (!response.ok) {
    throw new Error('Unable to load the event from the Django backend.')
  }

  return response.json()
}
