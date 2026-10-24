# WorldOfEvents — structured full-stack starter

A responsive React + Vite frontend and Express + SQLite backend for the WorldOfEvents event-discovery concept.

## Included
- React app split into pages, components, context, API client, styles, and event data.
- Sign in and account creation using bcrypt password hashing and JWT sessions.
- Interactive monthly calendar that shows scheduled events and their timings when a date is selected.
- Discover page with search, category, and free/paid filters.
- Event detail pages with agenda and booking controls.
- Committee/organizer application form, persisted to SQLite with a `pending_review` status.
- User profile shortcuts and a bookings page.
- Responsive styles for desktop and mobile.

## Requirements
- Node.js 20 LTS recommended
- npm

## Run locally
1. Extract the project folder.
2. Copy `.env.example` to `.env`.
3. Change `JWT_SECRET` in `.env` to a long random secret.
4. Install packages:
   ```bash
   npm install
   ```
5. Start the frontend and backend together:
   ```bash
   npm run dev
   ```
6. Open http://localhost:5173

The API runs at http://localhost:4000. SQLite creates `server/data/worldofevents.db` on first start.

## Production notes
- Configure a strong `JWT_SECRET`, HTTPS, secure deployment settings, rate limiting, request validation, logging, database backups, and email verification before public launch.
- Google sign-in is a UI placeholder; real Google OAuth requires a Google Cloud OAuth client and server-side OAuth flow.
- Committee submissions are stored with `pending_review`; add a moderator/admin workflow before granting hosting privileges.
- The event schedule is demo data in `src/data/events.js`. Calendar and detail pages both read from this source. The dates/times shown are not randomly generated.
- The frontend demo has no payment processing, QR ticket validation, or email delivery.
- For deployment, build the frontend with `npm run build` and deploy `dist/` as static assets while running the Express API as a separate service, or configure Express to serve `dist/`.
