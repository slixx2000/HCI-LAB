-- =====================================================
-- Campus Event Management System - Database Setup
-- =====================================================
-- Run this SQL in your Supabase SQL Editor
-- Dashboard > SQL Editor > New Query > Paste & Run
-- =====================================================

-- STEP 1: Create Tables
-- =====================================================

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

-- STEP 2: Enable Row Level Security
-- =====================================================

ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- STEP 3: Create RLS Policies
-- =====================================================

-- Policies for events table (public read)
CREATE POLICY "Allow public read access to events" 
ON events FOR SELECT 
USING (true);

-- Policies for registrations table (public read and insert)
CREATE POLICY "Allow public read access to registrations" 
ON registrations FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert to registrations" 
ON registrations FOR INSERT 
WITH CHECK (true);

-- Policies for feedback table (public read and insert)
CREATE POLICY "Allow public read access to feedback" 
ON feedback FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert to feedback" 
ON feedback FOR INSERT 
WITH CHECK (true);

-- STEP 4: Insert Sample Event Data
-- =====================================================

INSERT INTO events (title, description, date, location, image_url, category) VALUES
(
  'Future of Quantum Computing in Higher Education',
  'Join us for an intensive day-long exploration of how artificial intelligence is reshaping academic research, creative writing, and digital pedagogy. As the "Digital Curator" of this year''s symposium, the Academic Editorial team has gathered world-leading experts to discuss the ethical and practical implications of generative tools in the higher education landscape.',
  '2026-10-24 10:00:00',
  'Main Hall Auditorium',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop',
  'Seminars'
),
(
  'Design Thinking: Curating Digital Experiences',
  'Interactive workshop on design thinking principles and their application in digital product development. Learn how to approach problems creatively and build user-centered solutions.',
  '2026-10-26 14:00:00',
  'Media Lab B',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&auto=format&fit=crop',
  'Workshops'
),
(
  'Annual Varsity Invitational & Athletics Meet',
  'Annual sports competition bringing together top athletes from across the university. Join us for a day of competitive sports, school spirit, and athletic excellence.',
  '2026-11-02 08:00:00',
  'University Stadium',
  'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop',
  'Sports'
),
(
  'Entrepreneurs Society: Monthly Networking Mixer',
  'Monthly networking event for student entrepreneurs and business enthusiasts. Connect with like-minded individuals, share ideas, and build meaningful relationships in the startup ecosystem.',
  '2026-11-05 18:30:00',
  'Student Union Lounge',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop',
  'Clubs'
),
(
  'AI Ethics Panel Discussion',
  'A thought-provoking panel discussion featuring leading experts in artificial intelligence and ethics. Explore the moral implications of AI in modern society.',
  '2026-11-10 15:00:00',
  'Conference Hall A',
  'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop',
  'Seminars'
),
(
  'Web Development Bootcamp',
  'Intensive 3-day bootcamp covering modern web development technologies including React, Node.js, and database design.',
  '2026-11-15 09:00:00',
  'Computer Science Building',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop',
  'Workshops'
);

-- =====================================================
-- Setup Complete! 🎉
-- =====================================================
-- You should now have:
-- ✓ 3 tables: events, registrations, feedback
-- ✓ Indexes for performance
-- ✓ Row Level Security enabled
-- ✓ Public read/insert policies
-- ✓ 6 sample events
-- =====================================================
