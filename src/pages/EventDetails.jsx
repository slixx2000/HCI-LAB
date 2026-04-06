import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import Footer from '../components/Footer'

export default function EventDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    notes: ''
  })
  const [formError, setFormError] = useState('')
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchEvent()
  }, [id])

  async function fetchEvent() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setEvent(data)
    } catch (error) {
      console.error('Error fetching event:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const validateEmail = (email) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    if (!formData.user_name.trim()) {
      setFormError('Please enter your name')
      return
    }

    if (!validateEmail(formData.user_email)) {
      setFormError('Please enter a valid email address')
      return
    }

    try {
      setSubmitting(true)
      const { error } = await supabase
        .from('registrations')
        .insert([
          {
            event_id: id,
            user_name: formData.user_name,
            user_email: formData.user_email,
          }
        ])

      if (error) throw error

      setSuccess(true)
    } catch (error) {
      console.error('Error submitting registration:', error)
      setFormError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true 
    })
  }

  if (loading) {
    return (
      <div className="app-page pt-20 flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-on-surface-variant">Loading event...</p>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="app-page pt-20 flex justify-center items-center px-8">
        <div className="status-card bg-error-container text-on-error-container max-w-md w-full">
          <p className="font-bold mb-2">Event not found</p>
          <p className="mb-4">{error}</p>
          <button 
            onClick={() => navigate('/')}
            className="primary-action px-6 py-2"
          >
            Back to Events
          </button>
        </div>
      </div>
    )
  }

  return (
    <main className="app-page lg:ml-64">
      {/* Hero Section */}
      <section className="relative w-full h-[614px] overflow-hidden">
        <img 
          alt={event.title}
          className="w-full h-full object-cover"
          src={event.image_url || 'https://via.placeholder.com/1920x614?text=Event'}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full px-8 pb-12 max-w-7xl mx-auto">
          <div className="flex flex-col gap-4">
            <div className="inline-flex">
              <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase mb-2">
                {event.category}
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-on-surface max-w-4xl leading-[1.1] -ml-1">
              {event.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="page-shell grid grid-cols-1 lg:grid-cols-12 gap-16 py-16">
        {/* Left Column: Content */}
        <div className="lg:col-span-7 flex flex-col gap-12">
          {/* Event Meta Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 p-8 section-card">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-outline tracking-widest uppercase">Date</span>
              <p className="text-on-surface font-semibold">{formatDate(event.date)}</p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-outline tracking-widest uppercase">Time</span>
              <p className="text-on-surface font-semibold">{formatTime(event.date)}</p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-outline tracking-widest uppercase">Location</span>
              <p className="text-on-surface font-semibold">{event.location}</p>
            </div>
          </div>

          {/* Description */}
          <article className="prose prose-slate max-w-none">
            <h2 className="text-2xl font-bold text-on-surface mb-6">About the Event</h2>
            <p className="text-on-surface-variant text-lg leading-relaxed">
              {event.description}
            </p>
          </article>
        </div>

        {/* Right Column: Registration Form */}
        <aside className="lg:col-span-5">
          <div className="sticky top-28 p-8 page-card">
            {success ? (
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center">
                  <span className="material-symbols-outlined star-filled">check_circle</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-on-surface">You are registered!</h4>
                  <p className="text-sm text-on-surface-variant">Your registration has been saved to the database.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full">
                  <Link
                    to={`/feedback/${id}`}
                    className="primary-action flex-1 px-6 py-3"
                  >
                    Leave Feedback
                  </Link>
                  <Link
                    to="/"
                    className="secondary-action flex-1 px-6 py-3"
                  >
                    Back to Events
                  </Link>
                </div>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-on-surface mb-2">Register Now</h3>
                <p className="text-sm text-on-surface-variant mb-8 leading-relaxed">
                  Secure your place at this event. Registration is mandatory for all attendees.
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  {/* Full Name */}
                  <div className="flex flex-col gap-2">
                    <label className="field-label">
                      Full Name
                    </label>
                    <input
                      className="field-input"
                      placeholder="e.g. Eleanor Rigby"
                      type="text"
                      value={formData.user_name}
                      onChange={(e) => setFormData({ ...formData, user_name: e.target.value })}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-2">
                    <label className="field-label">
                      Email Address
                    </label>
                    <input
                      className={`field-input ${formError ? 'ring-2 ring-error/20' : ''}`}
                      placeholder="student@university.edu"
                      type="email"
                      value={formData.user_email}
                      onChange={(e) => setFormData({ ...formData, user_email: e.target.value })}
                      required
                    />
                    {formError && (
                      <p className="text-[10px] text-error font-medium flex items-center gap-1 mt-1 ml-1">
                        <span className="material-symbols-outlined text-[14px]">error</span>
                        {formError}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    className="primary-action w-full py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={submitting}
                  >
                    {submitting ? 'Registering...' : 'Register Now'}
                  </button>
                </form>

                <p className="mt-6 text-[11px] text-center text-outline leading-relaxed px-4">
                  By registering, you agree to our privacy policy regarding event data management.
                </p>
              </>
            )}
          </div>
        </aside>
      </div>

      <Footer />
    </main>
  )
}
