# NileFlix

NileFlix is a movie, TV, and anime discovery app built with **Next.js 16**, **React 19**, **TypeScript**, and **Tailwind CSS 4**. It uses [TMDB](https://www.themoviedb.org/) for catalog data and an embedded player for playback, wrapped in a public landing experience and an authenticated, personalized dashboard.

> Metadata and artwork are provided by TMDB. Playback is provided by an external embed provider (VidLink). NileFlix does not host any video content itself.

---

## Features

### Browse & discover
- **Public home page** with a hero banner and horizontally scrolling rows for trending, popular, top-rated, upcoming, and now-playing movies, plus trending/popular/top-rated/airing/on-the-air TV.
- **Anime** browsing with its own trending, popular, top-rated, and airing-today rows (sourced from TMDB animation/Japanese-language titles).
- **Detail pages** for movies, TV series, seasons, and individual episodes — with metadata, artwork, genres, runtimes, and trailer lookup.
- **Embedded watch pages** for movies and TV episodes that build the correct player URL and report playback progress.

### Search
- Multi-search across movies and TV, with type-specific modes (`movie`, `tv`, `anime`, or `all`) via `/api/search`.
- Client-side search history persisted in `localStorage`.

### Personalized dashboard (authenticated)
- **Favorites** and **Watchlist** persisted per user in MongoDB.
- **Continue watching / recently seen** history that records real watched seconds and duration from the player.
- **For You** recommendation rows derived from the user's favorites, watchlist, and watch history.
- **Profile** page with viewing stats and account/sign-out controls.
- A dedicated dashboard layout with sidebar navigation, theme toggle, and breadcrumbs.

### NileFlix AI assistant
- A conversational, **mood-based recommendation** companion powered by **Google Gemini** (`gemini-2.5-flash`), streamed token-by-token over Server-Sent Events.
- Suggests concrete titles with spoiler-free reasons and embeds TMDB IDs so suggestions link straight to detail pages.

### Authentication
- **Better Auth** with a MongoDB adapter.
- Email/password plus **Google** and **GitHub** social sign-in, with automatic account linking for matching verified emails.

### Theming
- Light/dark theme support via `next-themes` with a class-based provider (defaults to light, follows system when enabled).

---

## Tech stack

| Area          | Choice                                                                    |
| ------------- | ------------------------------------------------------------------------- |
| Framework     | Next.js 16 (App Router), React 19                                         |
| Language      | TypeScript                                                                |
| Styling       | Tailwind CSS 4, `tw-animate-css`, shadcn-style UI                         |
| UI primitives | `@base-ui/react`, Radix-style components, `lucide-react` / `react-icons`  |
| Auth          | Better Auth + MongoDB adapter                                             |
| Database      | MongoDB (`mongodb` driver; `mongoose` for the User model)                 |
| Data source   | TMDB REST API                                                             |
| AI            | Google Gemini (`gemini-2.5-flash`)                                        |
| Playback      | VidLink embedded player                                                   |
| Notifications | `sonner`                                                                  |

---

## Project structure

```
app/
  page.tsx                     # Public home page (hero, search, movie/TV rows)
  (auth)/                      # Sign-in / sign-up routes
  dashboard/                   # Authenticated, personalized experience
    page.tsx                   #   Dashboard overview
    discover/[category]/       #   Category browse
    movies/[genre]/            #   Movies by genre (with sorting)
    tv-shows/[category]/       #   TV by category
    animes/[category]/         #   Anime by category
    movie/[id]/                #   Movie detail + /watch
    tv/[category]/...          #   TV detail, seasons, episodes + /watch
    anime/[id]/...             #   Anime detail, seasons, episodes + /watch
    favorites/                 #   Saved favorites
    watchlist/                 #   Saved watchlist
    recently-seen/             #   Watch history
    assistant/                 #   NileFlix AI chat
    profile/                   #   Profile + stats + sign out
  movie/[id]/ , tv/[id]/ , anime/[id]/   # Public detail/watch routes
  api/
    auth/[...all]/             # Better Auth handler
    search/                    # TMDB search (movie | tv | anime | all)
    lists/                     # Favorites/watchlist read + toggle
    watch/                     # Record watch progress
    ai-chat/                   # Streaming Gemini chat

lib/
  tmdb.ts                      # Centralized TMDB client + URL/href helpers
  auth.ts , auth-client.ts     # Better Auth server + client config
  db.ts                        # MongoDB client
  user-media.ts                # Server-side favorites/watchlist/history store
  media-lists.ts               # Client cache + sync for user lists
  recently-seen.ts             # Watch-history API wrapper
  recommendations.ts           # Rule-based recommendation logic
  search-history.ts            # localStorage search history
  utils.ts , types.ts          # Shared helpers and types

components/                    # UI: rows, cards, detail views, sidebar, AI chat, player...
  ui/                          # shadcn-style primitives
hooks/                         # use-ai-chat, use-mobile
models/User.ts                 # Mongoose User schema
docs/                          # PHASE1.md, PROJECT_STATUS.md
```

---

## Getting started

### Prerequisites
- Node.js 20+
- A MongoDB instance (Atlas or local)
- A TMDB API key

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create `.env.local` in the project root:

```bash
# Required — TMDB catalog data (the app throws on fetch without it)
TMDB_API_KEY=your_tmdb_key

# Required — Better Auth
BETTER_AUTH_SECRET=your_random_secret
BETTER_AUTH_URL=http://localhost:3000

# Required — database (auth + user lists/history)
MONGODB_URI=your_mongodb_connection_string

# Optional — social sign-in
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...

# Optional — NileFlix AI assistant (https://aistudio.google.com/apikey)
GEMINI_API_KEY=...
```

Notes:
- Without `GEMINI_API_KEY`, the AI assistant returns a "not configured" message but the rest of the app works.
- Without the Google/GitHub credentials, those social buttons won't authenticate, but email/password still works.

### 3. Run the dev server

```bash
npm run dev
```

Open <http://localhost:3000>.

---

## Scripts

| Command         | Description                  |
| --------------- | ---------------------------- |
| `npm run dev`   | Start the development server |
| `npm run build` | Build the production bundle  |
| `npm run start` | Run the production server    |
| `npm run lint`  | Run ESLint                   |

---

## How it works

- **Data layer.** All TMDB requests funnel through `lib/tmdb.ts`, which also exposes href/URL helpers (`getContentHref`, `getSeasonHref`, `getEpisodeHref`, anime variants, trailer selection). The home page fetches its rows server-side in parallel for fast first paint.
- **Persistence.** Authenticated user data (favorites, watchlist, watch history) lives in MongoDB via `lib/user-media.ts` and is exposed through `/api/lists` and `/api/watch`. The client keeps an optimistic cache in `lib/media-lists.ts` and syncs to the server.
- **Recommendations.** `lib/recommendations.ts` builds a lightweight preference profile from the user's saved and watched content and mixes it with TMDB discover/trending results to populate the "For You" rows.
- **Playback.** The shared player component builds a VidLink iframe URL for the selected movie or TV episode and listens for progress messages to record watched time.
- **AI.** `/api/ai-chat` streams responses from Google Gemini using a mood-focused system prompt and forwards them to the UI via the `use-ai-chat` hook.

Remote images are restricted to `image.tmdb.org`, `images.unsplash.com`, and `avatar.vercel.sh` in `next.config.ts`.

---

## Known limitations

- Playback depends on an external embed provider; NileFlix hosts no video itself.
- Error/fallback UI for unavailable embeds can still be improved.
- Automated tests are minimal.

For a deeper architecture snapshot and history, see [docs/PROJECT_STATUS.md](docs/PROJECT_STATUS.md) and [docs/PHASE1.md](docs/PHASE1.md).

---

## Attribution

- Movie, TV, and anime metadata and artwork: **TMDB**. This product uses the TMDB API but is not endorsed or certified by TMDB.
- Embedded playback: **VidLink**.
- © NileFlix.

