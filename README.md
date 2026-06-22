# Personal Life Dashboard — Frontend

React + Vite + Tailwind. Authenticates via Supabase directly; all data flows through the Express backend on Render.

## Local dev

```bash
cp .env.example .env.local   # fill in
npm install
npm run dev
```

Open http://localhost:5173.

## Deploying to Vercel

1. Push this `frontend/` folder to its own GitHub repo.
2. Vercel → **New Project** → import repo.
3. Set env vars:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_API_URL` — your Render backend URL (e.g. `https://xxx.onrender.com`)
4. Deploy.

After deploying, add the Vercel URL to your Render backend's `ALLOWED_ORIGINS`.

## Supabase setup

The frontend assumes the Supabase project already has the schema (profiles, habits, habit_logs, goals, tasks, projects, journals, budgets, transactions) and RLS policies scoping every row to `auth.uid()`. The original Lovable project's migrations created them.

Enable Email + Google providers in Supabase → Authentication → Providers. Set the redirect URL to your Vercel domain.
