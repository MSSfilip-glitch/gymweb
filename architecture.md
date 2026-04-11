# GymWeb Architecture

The GymWeb project is structured as a modern monorepo built for the Gymnastics Federation of Zagreb County (GSZZ). It utilizes a full-stack JavaScript/TypeScript architecture to ensure type safety from the database layer up to the React frontend.

## 1. Tech Stack Overview

### Frontend (`/client`)
- **Framework**: React 18 built with Vite.
- **Routing**: `wouter` for lightweight, hook-based routing.
- **Styling**: Tailwind CSS v4 paired with `shadcn/ui` for accessible, modern UI components.
- **Data Fetching**: tRPC client for fully typed API requests.
- **State Management**: React Context (e.g., `ThemeContext`).

### Backend (`/server`)
- **Runtime**: Node.js with Express.
- **API Layer**: tRPC standardizes the API, eliminating the need for manual OpenAPI specs and ensuring frontend-backend type synchronization.
- **Database**: SQLite (via `better-sqlite3`), running locally without external service requirements.
- **ORM**: Drizzle ORM for performant, type-safe SQL queries and schema migrations.
- **Authentication**: Simple token-based auth (storing hashed passwords with `bcryptjs`).

## 2. Directory Structure

```text
gymWeb/
├── client/              # React frontend application
│   ├── src/
│   │   ├── components/  # Reusable UI elements (shadcn/ui + custom)
│   │   ├── contexts/    # React contexts (ThemeProvider)
│   │   ├── lib/         # Utility functions and tRPC client setup
│   │   ├── pages/       # Route-level components (Home, News, Admin, etc.)
│   │   ├── App.tsx      # Entry point defining routes
│   │   └── main.tsx     # React DOM rendering
│   └── vite.config.ts   # Vite configuration
├── server/              # Express + tRPC backend
│   ├── db.ts            # Database connection initialization
│   ├── schema.ts        # Drizzle ORM schema definitions (Tables)
│   ├── router.ts        # tRPC route definitions (API endpoints)
│   └── index.ts         # Server startup and tRPC middleware setup
├── docs/                # Project documentation and requirements
└── package.json         # Workspace definition and run scripts
```

## 3. Database Schema

The database model is strictly defined in `server/schema.ts` and managed via Drizzle ORM.

- **`users`**: Manages admin and editor access. Includes hashing for passwords.
- **`settings`**: A flexible Key-Value store allowing admins to change website globals (hero titles, contact info) dynamically.
- **`news`**: Stores Federation news, supporting title, excerpt, HTML content, categorization, and cover images.
- **`events`**: Calendar events tracking locations, dates, times, and event types.
- **`clubs`**: Directory of registered clubs, including geolocational data (latitude/longitude) for map rendering.
- **`results`**: Placements and PDFs for completed gymnastics events.
- **`gallery_images`**: Individual images tied to specific events for dynamic gallery creation.

## 4. API Layer (tRPC)

The backend exposes a unified `appRouter` through `server/router.ts`. 

### Access Control
- **`publicProcedure`**: Allows unauthorized access (e.g., retrieving lists of news or upcoming events).
- **`protectedProcedure`**: Uses a middleware (`isAuthed`) to verify the token in the `Authorization` header against the `users` table.

### Key Routers
- **`auth`**: Login handling and seeding the initial administrator.
- **`settings`**: Bulk updates for dynamic CMS functionality.
- **`news, events, clubs, results`**: Complete CRUD (Create, Read, Update, Delete) operations restricted contextually by authentication constraints.

## 5. Deployment Strategy

The project relies on SQLite, meaning the database resides in a single file (`gszz.db`). This makes deployment straightforward (e.g., using a VPS, Render, or Railway with persistent disks attached) and removes the complexity of managing a standalone database server.
