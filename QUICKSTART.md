# 🚀 Quick Start Guide

Get the Campus Event Management System running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works great)

## Step 1: Install Dependencies (1 minute)

```bash
cd campus-events
npm install
```

## Step 2: Set Up Supabase (2 minutes)

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for it to initialize (~2 minutes)
3. Go to **Settings** > **API**
4. Copy your Project URL and anon key

## Step 3: Configure Environment (30 seconds)

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 4: Set Up Database (1 minute)

1. In Supabase, go to **SQL Editor**
2. Open [SETUP.md](./SETUP.md) 
3. Copy the SQL from "Create Database Tables" section
4. Paste and run in SQL Editor
5. Copy and run the "Set Up Row Level Security" SQL
6. Copy and run the "Add Sample Event Data" SQL

## Step 5: Run the App (30 seconds)

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser!

## 🎉 You're Done!

You should now see:
- Event listing page with sample events
- Ability to click on events and register
- Ability to submit feedback

## Common Issues

### Events not showing?
- Check your `.env` file has correct credentials
- Verify tables exist in Supabase Table Editor
- Check browser console for errors

### Build errors?
- Delete `node_modules` and run `npm install` again
- Make sure Node.js version is 18+

### Need help?
- See [README.md](./README.md) for detailed docs
- See [SETUP.md](./SETUP.md) for database help
- Check [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) for features

---

**Happy coding! 🎓**
