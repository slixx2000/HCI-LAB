# Database Setup Guide

This guide will help you set up the Supabase database for the Campus Event Management System.

## Prerequisites

- A Supabase account ([sign up here](https://supabase.com))
- Basic knowledge of SQL

## Step-by-Step Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in with GitHub (or create an account)
4. Create a new project
5. Choose a project name (e.g., "campus-events")
6. Set a strong database password
7. Select a region close to you
8. Wait for the project to be created (~2 minutes)

### 2. Get Your API Credentials

1. In your Supabase project dashboard, go to **Settings** > **API**
2. Copy your **Project URL** (starts with `https://`)
3. Copy your **anon public** key
4. Create a `.env` file in the project root:

```bash
cp .env.example .env
```

5. Add your credentials to `.env`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Create Database Tables

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the following SQL:

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

-- Create indexes for better performance
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_registrations_event ON registrations(event_id);
CREATE INDEX idx_feedback_event ON feedback(event_id);
```

4. Click **Run** to execute the SQL

### 4. Set Up Row Level Security (RLS)

1. In the same SQL Editor, run this query:

```sql
-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Create policies for events table (public read)
CREATE POLICY "Allow public read access to events" 
ON events FOR SELECT 
USING (true);

-- Create policies for registrations table (public read and insert)
CREATE POLICY "Allow public read access to registrations" 
ON registrations FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert to registrations" 
ON registrations FOR INSERT 
WITH CHECK (true);

-- Create policies for feedback table (public read and insert)
CREATE POLICY "Allow public read access to feedback" 
ON feedback FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert to feedback" 
ON feedback FOR INSERT 
WITH CHECK (true);
```

### 5. Add Sample Event Data

1. Run this SQL to add sample events:

```sql
INSERT INTO events (title, description, date, location, image_url, category) VALUES
(
  'Future of Quantum Computing in Higher Education',
  'Join us for an intensive day-long exploration of how artificial intelligence is reshaping academic research, creative writing, and digital pedagogy. As the "Digital Curator" of this year''s symposium, the Academic Editorial team has gathered world-leading experts to discuss the ethical and practical implications of generative tools in the higher education landscape.',
  '2024-10-24 10:00:00',
  'Main Hall Auditorium',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop',
  'Seminars'
),
(
  'Design Thinking: Curating Digital Experiences',
  'Interactive workshop on design thinking principles and their application in digital product development. Learn how to approach problems creatively and build user-centered solutions.',
  '2024-10-26 14:00:00',
  'Media Lab B',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop',
  'Workshops'
),
(
  'Annual Varsity Invitational & Athletics Meet',
  'Annual sports competition bringing together top athletes from across the university. Join us for a day of competitive sports, school spirit, and athletic excellence.',
  '2024-11-02 08:00:00',
  'University Stadium',
  'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop',
  'Sports'
),
(
  'Entrepreneurs Society: Monthly Networking Mixer',
  'Monthly networking event for student entrepreneurs and business enthusiasts. Connect with like-minded individuals, share ideas, and build meaningful relationships in the startup ecosystem.',
  '2024-11-05 18:30:00',
  'Student Union Lounge',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop',
  'Clubs'
),
(
  'AI Ethics Panel Discussion',
  'A thought-provoking panel discussion featuring leading experts in artificial intelligence and ethics. Explore the moral implications of AI in modern society.',
  '2024-11-10 15:00:00',
  'Conference Hall A',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop',
  'Seminars'
),
(
  'Web Development Bootcamp',
  'Intensive 3-day bootcamp covering modern web development technologies including React, Node.js, and database design.',
  '2024-11-15 09:00:00',
  'Computer Science Building',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop',
  'Workshops'
);
```

### 6. Verify the Setup

1. Go to **Table Editor** in Supabase
2. You should see three tables: `events`, `registrations`, `feedback`
3. Click on `events` to verify sample data is there
4. You should see 6 events

### 7. Test the Connection

1. In your project directory, run:

```bash
npm run dev
```

2. Open `http://localhost:5173` in your browser
3. You should see the events displayed on the home page

## Troubleshooting

### Events not showing up?

1. Check your `.env` file has the correct credentials
2. Verify RLS policies are set up correctly
3. Check browser console for errors
4. Verify tables exist in Supabase Table Editor

### Can't insert registrations?

1. Check RLS policies on `registrations` table
2. Verify foreign key constraint on `event_id`
3. Check network tab in browser dev tools

### Database connection errors?

1. Ensure `.env` file is in the project root
2. Restart the development server
3. Check Supabase project is active (not paused)

## Additional Configuration

### Custom Event Categories

To add more categories, simply use them in your event data:

```sql
INSERT INTO events (title, description, date, location, category) VALUES
('Your Event', 'Description', '2024-12-01 10:00:00', 'Location', 'YourCategory');
```

Then update the categories array in `src/pages/Home.jsx`:

```javascript
const categories = ['All', 'Workshops', 'Sports', 'Seminars', 'Clubs', 'YourCategory']
```

### Backup Your Database

In Supabase dashboard:
1. Go to **Database** > **Backups**
2. Enable daily backups
3. Download manual backup if needed

## Next Steps

- Customize the event categories in the frontend
- Add more sample events
- Set up authentication (optional)
- Deploy to production

For more help, see the [Supabase Documentation](https://supabase.com/docs).
