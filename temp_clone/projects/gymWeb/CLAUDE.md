# GymWeb Project - CLAUDE.md

## Project Overview

**GymWeb** is a full-stack web application for the **Gymnastics Federation of Zagreb County (GSZZ)** in Croatia. It provides:
- A public-facing website showcasing news, events calendar, clubs directory, and results gallery
- An admin CMS panel allowing non-technical users to manage all content without developer intervention

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Routing | wouter (lightweight hook-based router) |
| Backend | Express.js + Node.js |
| API | tRPC (end-to-end type safety) |
| Database | SQLite via better-sqlite3 |
| ORM | Drizzle ORM |
| Auth | JWT with httpOnly cookies, bcryptjs for password hashing |

## Key Files Reference

```
gymWeb/
├── package.json              # Root workspace config, dev scripts
├── server/
│   ├── index.ts             # Express server, CORS, file upload (Multer), static serving
│   ├── router.ts            # tRPC routers: auth, news, events, clubs, results, gallery, settings
│   ├── schema.ts            # Drizzle ORM table definitions
│   └── db.ts                # Database initialization with raw SQL CREATE statements
├── client/
│   ├── src/
│   │   ├── App.tsx          # Route definitions (wouter)
│   │   ├── main.tsx         # Entry point, tRPC client setup, QueryClient
│   │   ├── pages/           # Page components: Home, News, Calendar, Clubs, etc.
│   │   ├── components/      # Navigation, ErrorBoundary, shadcn/ui components
│   │   └── lib/
│   │       ├── trpc.ts      # tRPC client typed proxy
│   │       └── cmsConfig.ts # CMS field definitions + default settings
│   └── vite.config.ts       # Proxy config for /trpc, /api, /uploads → localhost:3001
├── README.md                # Project documentation
├── architecture.md          # Technical architecture details
├── audit.md                 # Security/bug audit with fixes (see below)
└── guide.md                 # Deployment guide for Hetzner VPS + CARNET DNS
```

## Critical Context from audit.md

The `audit.md` file documents issues found and fixed during development:

### ✅ Fixed Issues:
1. **Auth Bypass Vulnerability** - Removed parseInt fallback in router.ts middleware
2. **Unprotected File Upload** - Added requireAuth middleware to /api/upload endpoint
3. **Missing Vite Proxies** - Added /api and /uploads proxy entries in vite.config.ts
4. **Hardcoded Homepage Data** - Home.tsx now fetches real data via tRPC queries
5. **Route Mismatch** - Fixed /contact → /kontakt inconsistency
6. **dotenv Not Loaded** - Added `import 'dotenv/config'` at top of server/index.ts

### ⬜ Pending Issues:
- Issue #7: Server-only deps in client package.json (cosmetic)
- Issue #9: `<a>` tags causing page reloads instead of SPA navigation
- Issue #10: Drizzle createdAt default uses literal string
- Minor documentation issues (#11-#14)

## Development Commands

```bash
npm run dev      # Concurrently runs client (5173) + server (3001)
npm run build    # Production build for both
db:push          # Push Drizzle schema to SQLite
```

## Database Schema Summary

- **users** - Admin/editor accounts with JWT auth
- **settings** - Key-value store for CMS text overrides (hero titles, contact info)
- **news** - Articles with title, excerpt, HTML content, category, image
- **events** - Calendar events with date, time, location, type
- **clubs** - Club directory with contact info and geolocation fields
- **results** - Competition results with optional PDF links
- **gallery_images** - Photo gallery tied to events

## CMS Architecture

The `cmsConfig.ts` file defines all editable text fields organized by section. The Admin panel's Settings tab renders these dynamically, allowing complete text customization without code changes. Default values serve as fallbacks.

## Authentication Flow

1. User logs in via `/trpc/auth.login`
2. Server sets httpOnly cookie `token` (7-day expiry)
3. Frontend tRPC client sends credentials: `'include'`
4. Protected procedures verify JWT via middleware
5. No Authorization header needed - cookie-based only

## Notes for Future Work

- The project is **functional but not yet launched**
- Focus areas mentioned by user: bugfixing, removing obsolete code, optimization
- Multiple developers have worked on it over time - code may have inconsistencies
- Deployment guide targets Hetzner VPS with Nginx reverse proxy
