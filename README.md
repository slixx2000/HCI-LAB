# Campus Event Management System

A full-stack event management system built with React, Vite, TailwindCSS, and Supabase.

## Features

- 📅 **Event Listing** - Browse all campus events with search and category filters
- ✍️ **Event Registration** - Register for events with form validation
- ⭐ **Feedback System** - Submit ratings and feedback after attending events
- 🎨 **Modern UI** - Beautiful, responsive design matching Academic Editorial theme
- 📱 **Mobile-First** - Fully responsive across all devices

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: TailwindCSS with custom Academic Editorial theme
- **Backend**: Supabase (PostgreSQL + Auth)
- **Routing**: React Router v6
- **Icons**: Material Symbols

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Copy `.env.example` to `.env`
3. Add your Supabase credentials to `.env`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Set Up Database Schema

Run these SQL commands in your Supabase SQL editor:

```sql
-- Create events table
CREATE TABLE events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP NOT NULL,
  location TEXT NOT NULL,
  image_url TEXT,
  category TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create registrations table
CREATE TABLE registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create feedback table
CREATE TABLE feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  tags TEXT[],
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access" ON events FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON registrations FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON feedback FOR SELECT USING (true);

-- Create policies for public insert access
CREATE POLICY "Allow public insert" ON registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON feedback FOR INSERT WITH CHECK (true);
```

### 4. Add Sample Data (Optional)

```sql
INSERT INTO events (title, description, date, location, image_url, category) VALUES
('Future of Quantum Computing in Higher Education', 'Join us for an intensive day-long exploration of how artificial intelligence is reshaping academic research, creative writing, and digital pedagogy.', '2024-10-24 10:00:00', 'Main Hall Auditorium', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', 'Seminars'),
('Design Thinking: Curating Digital Experiences', 'Interactive workshop on design thinking principles and their application in digital product development.', '2024-10-26 14:00:00', 'Media Lab B', 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800', 'Workshops'),
('Annual Varsity Invitational & Athletics Meet', 'Annual sports competition bringing together top athletes from across the university.', '2024-11-02 08:00:00', 'University Stadium', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800', 'Sports'),
('Entrepreneurs Society: Monthly Networking Mixer', 'Monthly networking event for student entrepreneurs and business enthusiasts.', '2024-11-05 18:30:00', 'Student Union Lounge', 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800', 'Clubs');
```

### 5. Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
campus-events/
├── src/
│   ├── components/
│   │   ├── EventCard.jsx       # Event card component
│   │   ├── Navbar.jsx          # Navigation bar
│   │   └── RatingStars.jsx     # Star rating component
│   ├── pages/
│   │   ├── Home.jsx            # Event listing page
│   │   ├── EventDetails.jsx   # Event detail & registration page
│   │   └── Feedback.jsx        # Feedback submission page
│   ├── lib/
│   │   └── supabaseClient.js   # Supabase client configuration
│   ├── App.jsx                 # Main app component with routing
│   ├── main.jsx               # Application entry point
│   └── index.css              # Global styles with Tailwind
├── tailwind.config.js         # Tailwind configuration
├── postcss.config.js          # PostCSS configuration
└── package.json               # Dependencies
```

## Available Routes

- `/` - Home page (event listing)
- `/event/:id` - Event details and registration
- `/feedback/:eventId` - Submit feedback for an event

## Key Features Implementation

### Event Listing
- Fetches all events from Supabase
- Search functionality by title
- Filter by category (All, Workshops, Sports, Seminars, Clubs)
- Responsive grid layout

### Event Registration
- Form validation (name, email)
- Stores registration in Supabase
- Success confirmation
- localStorage tracking of user registrations

### Feedback System
- 5-star rating component
- Multi-select tags
- Optional comment field
- Stores feedback in Supabase

## Building for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` directory.

## Design System

The application uses a custom Academic Editorial design system with:
- Custom color palette from Stitch designs
- Inter font family
- Material Symbols icons
- Consistent spacing and typography
- Custom shadows and transitions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - feel free to use this project for learning and development.
