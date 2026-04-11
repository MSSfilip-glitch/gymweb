# GymWeb: Gymnastics Federation of Zagreb County (GSZZ)

A full-stack, responsive web application designed for managing and displaying the activities of the Gymnastics Federation of Zagreb County. The project features a public-facing website for members and clubs, and a protected Administrator CMS for content management.

## 🚀 Key Features

### Public Website
- **Modern, Athletic UI:** Built with Tailwind CSS and `shadcn/ui` to embody an energetic, sports-centric design. Features a looping hero video on the homepage.
- **Dynamic News:** Paginated and categorized news articles for quick updates.
- **Events Calendar:** Interactive calendar showcasing upcoming competitions and events with visual indicators.
- **Clubs Directory:** A comprehensive list of registered federation clubs with geographic mapping and direct contact links.
- **Results & Gallery:** Historical event results (placements) accompanied by photo galleries.
- **Exercises Hub:** Dedicated section for "posnimljene vjezbe" (recorded gymnastics exercises) organized by age groups.

### Admin Panel (CMS)
- **Role-Based Access Control:** Secure, token-based login for administrators and editors.
- **Settings Management:** Dynamically update global site properties (e.g., hero text, contact emails, social links) directly from the dashboard without altering code.
- **Full Entity CRUD:** Create, Read, Update, and Delete operations for News, Events, Clubs, and Results.

---

## 🛠️ Technology Stack

GymWeb is structured as a TypeScript monorepo to maximize code reuse and type safety across the stack.

### Frontend
- **Framework:** React 18 + Vite
- **Language:** TypeScript
- **Routing:** `wouter`
- **Styling:** Tailwind CSS v4 + `shadcn/ui`
- **Client API:** tRPC Client (provides end-to-end type safety)

### Backend
- **Environment:** Node.js + Express
- **API Construction:** tRPC Server
- **Database:** SQLite (`better-sqlite3`)
- **ORM:** Drizzle ORM
- **Authentication:** `bcryptjs` for password hashing

---

## 📂 Project Structure

```text
gymWeb/
├── client/              # React application
│   ├── src/
│   │   ├── components/  # Reusable UI components & Layouts
│   │   ├── pages/       # Route components (Home, News, Admin, etc.)
│   │   ├── lib/         # trpc client and utils
│   │   └── App.tsx      # Application routing and providers
├── server/              # Express backend
│   ├── index.ts         # Server entry point
│   ├── router.ts        # tRPC routes (API Endpoints)
│   ├── schema.ts        # Drizzle ORM database schemas
│   └── db.ts            # Database initialization
└── docs/                # Project requirements and documentation
```

For more in-depth technical details, please see [architecture.md](./architecture.md).

---

## 💻 Local Development Setup

### 1. Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `yarn`

### 2. Installation
Clone the repository and install dependencies from the root directory. This will install dependencies for both the root workspace and its sub-directories.

```bash
npm install
```

### 3. Database Initialization
GymWeb utilizes a local SQLite database (`gszz.db`). Run Drizzle ORM to generate and push the schema to the database:

```bash
npm run db:push
```

### 4. Running the Development Server
The root `package.json` includes `concurrently` to run both the Vite frontend and Express backend simultaneously.

```bash
npm run dev
```

- **Frontend Development Server:** [http://localhost:5173](http://localhost:5173)
- **Backend tRPC Server:** [http://localhost:3001](http://localhost:3001)

### 5. Seeding the Database
On your first run, you will need an administrator account to access the CMS (`/admin`).
Use your preferred API client (e.g., Postman, cURL) to call the seed endpoint, or run a simple fetch request from the browser console on `localhost`:

```javascript
fetch('http://localhost:3000/trpc/auth.seedAdmin', { method: 'POST' })
```

This will generate the default user:
- **Username:** `admin`
- **Password:** `admin123`

*(Note: Change this immediately in a production environment.)*

---

## 🚀 Building for Production

To create a production-ready build for both the frontend and backend:

```bash
npm run build
```

This commands transpiles both `.ts` and `.tsx` files into standard JavaScript. To start the Express server serving the production API:

```bash
npm run start
```

*(You will need to configure your server or proxy (e.g., Nginx) to serve the static frontend files typically located in `client/dist`).*
