# NileFlix Project Status

## Overview

NileFlix is a streaming-style discovery app built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, and TMDB as the primary data source. The app is currently focused on browsing movies and TV shows, searching titles, opening detail pages, and launching embedded watch experiences.

The project has moved beyond the initial movie-only phase and now includes TV browsing, season and episode navigation, a dedicated TV watch flow, theme switching, and a custom footer that documents source attribution.

## What the app does now

### Home page

The home page renders:

- A hero banner with trending content.
- A search bar backed by the app search route.
- Movie rows for trending, popular, top rated, upcoming, and now playing titles.
- TV rows for trending, popular, top rated, airing today, and on the air titles.
- A footer with source and copyright details.

The home page is server rendered and fetches multiple TMDB collections in parallel.

### Search

Search uses the TMDB multi-search endpoint and filters results down to movies and TV shows. Results route correctly to:

- Movie detail pages for movie results.
- TV detail pages for TV results.

### Movie flow

Movie browsing currently includes:

- Movie detail pages with metadata, artwork, and trailer lookup.
- A movie watch page that embeds the VidLink player.
- CTA buttons for playing the movie or opening the trailer.

### TV flow

TV browsing currently includes:

- TV detail pages with metadata, genres, seasons, and episode counts.
- Season pages that list episodes and link into the first available episode.
- Episode detail pages with episode artwork, runtime, overview, and navigation back to the season or show.
- Episode watch pages that embed the VidLink player using the correct show, season, and episode identifiers.

### Embedded playback

The shared video player component builds a VidLink iframe URL for both movies and TV shows.

- Movie embeds use the movie route.
- TV embeds use the TV route with season and episode numbers.
- The component also listens for VidLink progress messages so playback data can be stored in local storage.

The player is currently interactive by default, so users can control playback and scroll normally without a manual enable step.

### Footer and attribution

The footer now documents:

- TMDB as the metadata source.
- VidLink as the embedded playback source.
- NileFlix copyright ownership.
- Creator credit linking to the portfolio site.

## Project structure

### App routes

- `app/page.tsx` - home page with hero, search, movie rows, and TV rows.
- `app/movie/[id]/page.tsx` - movie detail page.
- `app/movie/[id]/watch/page.tsx` - movie watch page.
- `app/tv/[id]/page.tsx` - TV detail page.
- `app/tv/[id]/season/[seasonNumber]/page.tsx` - season page.
- `app/tv/[id]/season/[seasonNumber]/episode/[episodeNumber]/page.tsx` - episode detail page.
- `app/tv/[id]/season/[seasonNumber]/episode/[episodeNumber]/watch/page.tsx` - episode watch page.
- `app/api/search/route.ts` - search API route.

### Core components

- `components/hero-banner.tsx` - featured content banner.
- `components/movie-search.tsx` - client-side search UI.
- `components/movie-row.tsx` - horizontal content rows.
- `components/movie-card.tsx` - shared content cards.
- `components/action-buttons.tsx` - movie action buttons.
- `components/view-movie.tsx` - shared VidLink player.
- `components/header.tsx` and `components/footer.tsx` - shell layout.
- `components/theme-provider.tsx` and `components/theme-toggle.tsx` - theme support.

### Data layer

- `lib/tmdb.ts` centralizes all TMDB requests.
- `lib/utils.ts` contains shared helpers such as class merging and runtime formatting.

## Environment and scripts

### Required setup

- `TMDB_API_KEY` must be present or the app will throw when fetching TMDB data.

### Available scripts

- `npm run dev` - start the development server.
- `npm run build` - build the app.
- `npm run start` - run the production server.
- `npm run lint` - run ESLint.

## Current implementation notes

- Home data is fetched server-side with `Promise.all` to keep the page responsive.
- Next.js app router conventions are used throughout the project.
- `image.tmdb.org` is already allowed for remote images.
- The app uses a local class-based theme provider rather than relying on a theme script injection.
- Better Auth is already wired into the project for sign-in and sign-up flows.

## Known limitations

- Playback still depends on an external embed provider.
- The app does not host video content itself.
- There is no persistent user watchlist or favorites system yet.
- Automated tests are still minimal or absent.
- Error handling for unavailable external playback can still be improved.

## Recent fixes already in the project

- TV watch URLs now include season and episode numbers.
- TV season pages now open the first available episode instead of assuming episode 1 exists.
- TV detail pages now open the first available season instead of forcing season 1.
- The shared player is interactive by default again, so wheel scrolling and playback controls work without an extra toggle.

## Suggested next work

1. Add graceful fallback UI when VidLink cannot load a specific title.
2. Add loading and error states for more fetch paths.
3. Add a small test suite for the route helpers and player URL builder.
4. Expand user features such as watchlists and favorites.

## Summary

NileFlix is now a multi-route movie and TV discovery app with working browse, search, detail, and watch flows. The main remaining gaps are stronger error handling, persistence, and testing.
