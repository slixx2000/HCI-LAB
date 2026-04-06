import { useState } from 'react'

export default function RatingStars({ rating, setRating }) {
  const [hover, setHover] = useState(0)

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="text-primary hover:scale-110 transition-transform"
        >
          <span 
            className={`material-symbols-outlined text-4xl ${
              star <= (hover || rating) ? 'star-filled' : ''
            }`}
            style={star <= (hover || rating) ? { fontVariationSettings: "'FILL' 1" } : {}}
          >
            star
          </span>
        </button>
      ))}
    </div>
  )
}
