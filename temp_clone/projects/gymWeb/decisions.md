# Technical Decisions

- **Monorepo Structure**: Utilized a unified workspace with `client/` and `server/` directories to simplify development, allowing both environments to run concurrently via a single script.
- **Database Selection**: Replaced the initial MySQL requirements with **SQLite** (`better-sqlite3`) and **Drizzle ORM** to enable zero-configuration local portability and fast iteration.
- **API Layer**: Chosen **tRPC** for strictly typed, end-to-end communication between the React client and Express server. This guarantees type safety without the overhead of generating OpenAPI specifications.
- **Styling**: Vanilla Tailwind CSS v4 combined with `shadcn/ui` components for rapid, accessible, and consistent UI development inspired by modern athletic designs.
- **Authentication**: Implemented a lightweight, token-based authentication mechanism utilizing `localStorage` and a seeded administrator account for securing the CMS.
- **CMS Architecture**: Created a flexible `settings` key-value table, enabling the administrator to dynamically update global site content (such as hero text and contact email) directly from the UI, minimizing the need for developer intervention.
