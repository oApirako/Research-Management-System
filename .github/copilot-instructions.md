# Copilot Instructions for SE-7

## Project Overview
- This is a Next.js application using the `/app` directory structure, bootstrapped with `create-next-app`.
- The project is organized by feature, with API routes under `app/api/` and page components under `app/[feature]/`.
- Data persistence and queries are managed via SQL scripts in `database/` (see `research.sql`).

## Key Architectural Patterns
- **API Routes:** All backend logic is implemented as file-based API routes in `app/api/[feature]/route.js`. Each feature (e.g., login, history, notification) has its own subdirectory.
- **Page Components:** UI pages are located in `app/[feature]/page.js`. Dynamic routes use `[id]` folders for per-entity views.
- **Lib Directory:** Shared utilities (e.g., database access) are in `app/lib/`.
- **Public Assets:** Static files (SVGs, etc.) are served from `public/`.

## Developer Workflows
- **Start Dev Server:** `npm run dev` (or `yarn dev`, `pnpm dev`, `bun dev`).
- **Hot Reload:** Edit files in `app/` for instant updates.
- **Database:** SQL scripts are in `database/research.sql`. No ORM detected; direct SQL likely used in API routes.
- **No explicit test or build scripts** found; follow Next.js conventions for builds (`next build`).

## Project-Specific Conventions
- **Feature Isolation:** Each feature (articles, users, notifications, etc.) has its own folder for both API and UI logic.
- **Dynamic Routing:** Uses `[id]` folders for entity-specific pages and API endpoints.
- **No custom lint/test/build rules** detected; relies on Next.js defaults.
- **No global state management** detected; state is likely local to components or handled via API calls.

## Integration Points
- **External:** Next.js, Vercel, SQL database (see `database/research.sql`).
- **Internal:** API routes communicate with the database via utilities in `app/lib/db.js`.

## Examples
- To add a new feature, create a folder in `app/` and add both `page.js` (UI) and `api/[feature]/route.js` (API).
- For user-specific pages or APIs, use `[id]` folders (e.g., `app/myarticles/[id]/page.js`, `app/api/myarticles/[id]/route.js`).

## References
- See `README.md` for Next.js basics and dev server instructions.
- See `app/lib/db.js` for database access patterns.
- See `database/research.sql` for schema and queries.

---

**Feedback Requested:**
- Are there any custom workflows, scripts, or patterns not covered here?
- Is any part of the architecture unclear or missing?
- Please specify any additional conventions or integration details to document.
