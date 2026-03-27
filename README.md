# GameFlow

GameFlow is a futuristic personal AVN game tracker built with Next.js App Router, Tailwind CSS, Framer Motion, and Supabase.

## Features Implemented

- Authentication with Supabase
  - Email/password sign up
  - Login/logout
  - Persistent session handling
  - Protected routes via middleware
- Futuristic dashboard UI
  - Glassmorphism cards
  - Neon dark theme
  - Animated interactions and transitions
- Game management
  - Create game entries from modal
  - Edit game entries from card
  - Delete game entries from card
  - Search across title/status/version/link/notes/latest version
  - Sidebar status filters: All, Playing, Completed, Backlog
- Supabase integration
  - Fetch games from `games` table
  - Insert, update, delete with authenticated user context
  - RLS-compatible queries
- Update checking
  - Per-game "Check Update" action
  - Parses linked page and compares version
  - Saves `latest_version` and `has_update`
  - Shows update badge/highlight on game card
- Automated weekly checks
  - Cron API route to scan all linked games
  - Graceful per-item error handling/logging
  - Vercel Cron schedule configured in `vercel.json`
- Account dashboard
  - Account settings page with user info
  - Copy user ID
  - Refresh session action
  - Back to dashboard navigation

## Tech Stack

- Next.js (App Router)
- React
- Tailwind CSS
- Framer Motion
- Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
- Lucide icons

## Project Structure

- `app/` - routes, pages, API routes
- `components/` - reusable UI components
- `lib/` - Supabase clients and data helpers
- `types/` - shared TypeScript models

## Environment Variables

Create `.env.local` with:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key   # required for weekly cron route
CRON_SECRET=your_random_secret                     # required for cron route auth
```

## Database Notes

`games` table should include at least:

- `id` (uuid, primary key)
- `user_id` (uuid)
- `title` (text)
- `status` (text)
- `version` (text)
- `link` (text, nullable)
- `notes` (text, nullable)
- `latest_version` (text, nullable)
- `has_update` (boolean, default false)
- `created_at` (timestamp)

Row Level Security should restrict each user to their own rows.

## Run Locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Vercel Cron

Cron is configured in `vercel.json`:

- Path: `/api/cron/check-updates`
- Schedule: `0 0 * * 0` (weekly, Sunday midnight UTC)

Vercel should send:

```http
Authorization: Bearer <CRON_SECRET>
```

## API Routes

- `POST /api/check-update` - check one game's linked page and update status
- `GET /api/cron/check-updates` - weekly batch check for all linked games

## License

This project is licensed under the MIT License. See [LICENSE](./LICENSE).
