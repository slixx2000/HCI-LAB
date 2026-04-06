import { Link } from 'react-router-dom'

export default function EventCard({ event }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const dateStr = date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    })
    const timeStr = date.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true 
    })
    return `${dateStr} • ${timeStr}`
  }

  return (
    <article className="group">
      <div className="relative h-72 rounded-xl overflow-hidden mb-6 editorial-shadow">
        <img 
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          src={event.image_url || 'https://via.placeholder.com/600x400?text=Event+Image'}
        />
        <div className="absolute top-4 left-4">
          <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-[10px] font-bold uppercase label-tracking text-primary">
            {event.category}
          </span>
        </div>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-on-surface header-anchor leading-tight group-hover:text-primary transition-colors">
            {event.title}
          </h3>
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-1.5 text-slate-500">
              <span className="material-symbols-outlined text-sm">calendar_month</span>
              <span className="text-xs font-semibold uppercase label-tracking">
                {formatDate(event.date)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-500">
              <span className="material-symbols-outlined text-sm">location_on</span>
              <span className="text-xs font-semibold uppercase label-tracking">
                {event.location}
              </span>
            </div>
          </div>
        </div>
        <Link 
          to={`/event/${event.id}`}
          className="primary-action w-full sm:w-auto px-8 py-3 text-center"
        >
          Register
        </Link>
      </div>
    </article>
  )
}
