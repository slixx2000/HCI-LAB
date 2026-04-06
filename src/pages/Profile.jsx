import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import Footer from '../components/Footer'

export default function Profile() {
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (!mounted) return

      if (error) {
        setError(error.message)
      }

      setSession(data.session ?? null)
      setLoading(false)
    }

    loadSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setLoading(false)
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const signInWithProvider = async (provider) => {
    try {
      setAuthLoading(provider)
      setError('')
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/profile`,
        },
      })

      if (error) throw error
    } catch (error) {
      console.error('OAuth sign-in error:', error)
      setError(error.message)
    } finally {
      setAuthLoading('')
    }
  }

  const signOut = async () => {
    try {
      setAuthLoading('signOut')
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      navigate('/')
    } catch (error) {
      console.error('Sign-out error:', error)
      setError(error.message)
    } finally {
      setAuthLoading('')
    }
  }

  return (
    <main className="app-page lg:ml-64">
      <div className="page-shell">
        <header className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-on-surface header-anchor mb-4">
              Profile
            </h1>
            <p className="text-on-surface-variant max-w-2xl leading-relaxed">
              Sign in with Supabase OAuth to connect your account and keep your event activity in one place.
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
              <p className="mt-4 text-on-surface-variant">Loading profile...</p>
            </div>
          </div>
        ) : session ? (
          <div className="grid gap-8 lg:grid-cols-2">
            <section className="section-card p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-on-primary">
                  <span className="material-symbols-outlined text-[28px]">account_circle</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-outline">Signed In</span>
                  <h2 className="text-2xl font-bold text-on-surface">Welcome back</h2>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <p className="text-on-surface-variant">
                  <span className="font-semibold text-on-surface">Email:</span> {session.user.email}
                </p>
                <p className="text-on-surface-variant">
                  <span className="font-semibold text-on-surface">User ID:</span> {session.user.id}
                </p>
                <p className="text-on-surface-variant">
                  <span className="font-semibold text-on-surface">Provider:</span> {session.user.app_metadata?.provider || 'unknown'}
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={signOut} className="primary-action px-5 py-3" type="button" disabled={authLoading === 'signOut'}>
                  {authLoading === 'signOut' ? 'Signing out...' : 'Sign Out'}
                </button>
                <Link to="/registered" className="secondary-action px-5 py-3">
                  View Registrations
                </Link>
              </div>
            </section>

            <section className="section-card p-8">
              <span className="text-[10px] font-bold uppercase tracking-widest text-outline">Account Tools</span>
              <h2 className="mt-2 text-2xl font-bold text-on-surface">Connect OAuth</h2>
              <p className="mt-2 text-on-surface-variant">
                If you are signed in, this screen still gives you a single place to manage your session.
              </p>
              <div className="mt-8 grid gap-3">
                <button
                  type="button"
                  className="primary-action px-5 py-3"
                  onClick={() => signInWithProvider('google')}
                  disabled={authLoading !== ''}
                >
                  {authLoading === 'google' ? 'Connecting...' : 'Continue with Google'}
                </button>
                <button
                  type="button"
                  className="secondary-action px-5 py-3"
                  onClick={() => signInWithProvider('github')}
                  disabled={authLoading !== ''}
                >
                  {authLoading === 'github' ? 'Connecting...' : 'Continue with GitHub'}
                </button>
              </div>
            </section>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">
            <section className="section-card p-8">
              <span className="text-[10px] font-bold uppercase tracking-widest text-outline">OAuth Sign In</span>
              <h2 className="mt-2 text-2xl font-bold text-on-surface">Use your provider account</h2>
              <p className="mt-2 text-on-surface-variant">
                Sign in through Supabase OAuth to personalize your event workflow.
              </p>
              <div className="mt-8 grid gap-3">
                <button
                  type="button"
                  className="primary-action px-5 py-3"
                  onClick={() => signInWithProvider('google')}
                  disabled={authLoading !== ''}
                >
                  {authLoading === 'google' ? 'Connecting...' : 'Continue with Google'}
                </button>
                <button
                  type="button"
                  className="secondary-action px-5 py-3"
                  onClick={() => signInWithProvider('github')}
                  disabled={authLoading !== ''}
                >
                  {authLoading === 'github' ? 'Connecting...' : 'Continue with GitHub'}
                </button>
              </div>
            </section>

            <section className="section-card p-8">
              <span className="text-[10px] font-bold uppercase tracking-widest text-outline">Session Status</span>
              <h2 className="mt-2 text-2xl font-bold text-on-surface">What this page does</h2>
              <ul className="mt-4 space-y-3 text-sm text-on-surface-variant">
                <li>• Shows the current Supabase auth session.</li>
                <li>• Lets you sign in with Google or GitHub.</li>
                <li>• Gives you a single place to sign out cleanly.</li>
              </ul>
              {error ? (
                <div className="status-card mt-6 bg-error-container text-on-error-container">
                  <p className="font-bold mb-2">OAuth error</p>
                  <p>{error}</p>
                </div>
              ) : null}
            </section>
          </div>
        )}
      </div>
      <Footer />
    </main>
  )
}