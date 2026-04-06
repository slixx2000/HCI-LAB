import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '')
  }, [searchParams, location.pathname])

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    const query = searchQuery.trim()

    const params = new URLSearchParams(location.search)
    if (query) {
      params.set('q', query)
    } else {
      params.delete('q')
    }

    navigate({ pathname: location.pathname, search: params.toString() ? `?${params.toString()}` : '' })
  }

  const handleAvatarClick = async () => {
    const { data } = await supabase.auth.getSession()
    if (data.session) {
      navigate('/profile')
      return
    }

    navigate('/profile')
  }

  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b border-surface-container bg-surface-bright/90 backdrop-blur-md lg:left-64 lg:w-[calc(100%-16rem)]">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-4 sm:gap-8">
          <Link to="/" className="flex items-center gap-3 min-w-0">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-on-primary shadow-sm">
              <span className="material-symbols-outlined text-[20px]">event</span>
            </span>
            <span className="text-xl font-bold tracking-tight text-on-surface header-anchor truncate">
              Academic Editorial
            </span>
          </Link>
          <Link
            to="/"
            className={`chip-button hidden sm:inline-flex px-4 py-2 ${
              isActive('/') && !location.pathname.includes('/event/')
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-transparent text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            Events
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearchSubmit} className="relative hidden xl:block">
            <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-outline">
              <span className="material-symbols-outlined text-[20px]">search</span>
            </div>
            <input
              aria-label="Search events"
              className="field-input h-11 w-80 rounded-full pl-11 pr-4"
              placeholder="Search events..."
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </form>

          <div className="flex items-center gap-3">
            <button className="h-10 w-10 rounded-full border border-surface-container-high bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high transition-colors duration-200 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
            <button
              type="button"
              onClick={handleAvatarClick}
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-surface-container-high cursor-pointer hover:opacity-80 transition-opacity p-0 bg-surface-container-low"
            >
              <img
                alt="User profile avatar"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7fp5gkqBLeJQVPLfOeOoPosSs27FQo32xB03NRnxjVcwV_kLOc2tAaLE2x_UbnijxvePxRy4Z55lwEUN7Ua5lhZBVVwxZE2GkX0JejSh4-Qbxof6bFJ18ZYWc7THEwe-V8UyWNDW9WXgwgkR40aIE2ebtTJqabv_5xZweWxnfF7qfb9lEWepZVtlCM_D5euKKNB8_nlfp3oOivWJDHoXsChCXeFae4kpHiSvn5jnnO6bfBwP1qs-AGhL1QClDJaQOtTLEaqIuoQ"
                className="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
