# NileFlix — Phase 1

## Overview

Phase 1 delivers a lightweight Next.js-based movie browser that fetches data from The Movie Database (TMDB) and provides browsing, search, and basic movie detail + watch pages. The app is focused on a simple, responsive UI and fast server-rendered pages.

## Implemented (Phase 1)

- Home / trending movies (server-side data via `lib/tmdb.ts`).
- Search API route and client-side search UI (typeahead / search results).
- Movie detail pages with metadata and trailer lookup (YouTube trailers via TMDB videos).
- Simple watch page to present embedded video or trailer placeholder.
- Reusable UI components: cards, rows, hero banner, action buttons, footer, and small design system (`components/ui/*`).
- Basic utilities and TMDB client (`lib/tmdb.ts`, `lib/utils.ts`).
- Next.js app directory structure with route-based pages and API route at `app/api/search/route.ts`.

Key files to review:

- [app/page.tsx](app/page.tsx)
- [app/movie/[id]/page.tsx](app/movie/[id]/page.tsx)
- [app/movie/[id]/watch/page.tsx](app/movie/[id]/watch/page.tsx)
- [lib/tmdb.ts](lib/tmdb.ts)
- [components/movie-card.tsx](components/movie-card.tsx)

## Setup & Run (local)

1. Install dependencies:

   npm install

2. Provide a TMDB API key:
   - Set environment variable `TMDB_API_KEY` (the app will throw if missing).

3. Run dev server:

   npm run dev

4. Open `http://localhost:3000`.

## Architecture & Notes

- Data layer: `lib/tmdb.ts` centralizes TMDB calls and enforces presence of `TMDB_API_KEY`.
- Pages use Next.js app-router conventions and server-side fetches (`next` revalidate hints present).
- No user accounts or persistence — the app is read-only against TMDB results.

## Known Limitations (Phase 1)

- No authentication or user profiles.
- No persistent watchlists, likes, or comments.
- Video playback is a placeholder (relies on YouTube trailers or external embeds).
- Minimal accessibility/a11y checks and no automated tests yet.
- No rate-limit handling or caching beyond Next's `revalidate` hints.

## Suggested Next Features (priority & short rationale)

1. Authentication & User Accounts (High): add sign-in (OAuth) to enable watchlists, likes, and personalization.
2. Watchlist / Favorites (High): persist user-selected movies (local first, then backed by a DB).
3. Recommendation Engine (Medium): surface related movies using TMDB similar API or simple collaborative logic.
4. Video Playback Integration (High): support hosted streaming (HLS) or an integrated player with subtitles support.
5. Server-side Caching & Rate-limit Handling (Medium): add caching layer (Redis/Edge) and graceful error UI.
6. Comments & Social Sharing (Low): enable user interaction and sharing links.
7. Accessibility & Lighthouse Improvements (Medium): ARIA attributes, keyboard navigation, and contrast fixes.
8. Tests & CI (Medium): add unit tests, integration tests, and GitHub Actions for builds/linting.
9. Mobile App / PWA (Low): make the site installable and add offline fallbacks for core pages.

Each suggested feature can be delivered incrementally: start with local persistence (IndexedDB/localStorage) for watchlists, then add auth and server persistence.

## Next Steps (recommended immediate work)

- Implement watchlist UI + local persistence.
- Add TMDB error handling and friendly UI states (loading/error/no-results).
- Add a small test suite and a CI build step.

---

Generated: Phase 1 summary for NileFlix.
