# Watches E-commerce Frontend (Next.js)

## Quick Start

```bash
cd frontend
npm install
npm run dev  # http://localhost:3000
```

## Build & Deploy to Vercel

1. **Connect repo to Vercel** (vercel.com) - auto-detects Next.js.
2. **Set Environment Variable:**
   ```
   NEXT_PUBLIC_API_URL = https://e-com-webiste-watches.onrender.com/api
   ```
3. **Deploy:** `git push` → Vercel auto-builds/deploys.

### Scripts
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Production server
- `npm run lint` - Lint code

## Project Structure
```
app/          # Next.js App Router (pages, layouts, components)
components/   # Shared UI components
lib/          # API utils, utils
public/       # Static assets
```

## Backend Integration
- API calls via `/lib/api.ts` use `NEXT_PUBLIC_API_URL`.
- Backend: https://e-com-webiste-watches.onrender.com
- Update `.env.local` for local dev (gitignored).

## Vercel Config
- `vercel.json`: Proxies `/api/*` to backend.
- Tailwind/PostCSS/TS: Pre-configured.

Built with Next.js 15, TailwindCSS, TypeScript.

