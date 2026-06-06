# LoopIn

LoopIn is a hyper-local, closed-campus ride feed for college students. This scaffold starts with Symbiosis University and models the product as a social commute feed rather than a heavy booking flow.

## Project Structure

```text
app/
  globals.css                 Global Tailwind layers and dark background
  layout.tsx                  App Router root shell
  page.tsx                    Redirects to dashboard
  dashboard/page.tsx          Main authenticated dashboard route
components/
  maps/RideMapPreview.tsx     Google Maps route preview with optimized waypoints
  onboarding/PrnGate.tsx      11-digit PRN onboarding and validation
  rides/DashboardFeed.tsx     Feed, map view, search, and ride state logic
  rides/RidePostCard.tsx      Skeuomorphic ride post and request controls
lib/
  prn.ts                      PRN formatting and validation helpers
  rides.ts                    Seed Symbiosis ride posts
  types.ts                    Shared ride and location types
tailwind.config.js            Dark skeuomorphic design tokens and utilities
```

## Architecture

- Authentication starts with `PrnGate`, which only verifies 11 numeric digits on the client. In production, pair this with a server-side PRN allowlist or university identity provider before creating a user session.
- `DashboardFeed` owns local ride state for the prototype. Replace the seeded data with API calls or server actions once backend tables exist.
- `RidePostCard` handles the social feed mechanic: passengers click `Pick Me Up`, drivers accept or deny, and accepted requests decrement available seats.
- `RideMapPreview` uses `@react-google-maps/api`. Accepted pickup requests are passed as `waypoints` with `optimizeWaypoints: true`, so Google Directions can recalculate the efficient route.
- Set `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in `.env.local` to enable live maps. Without a key, the UI shows a styled route fallback so the prototype still runs.

## Suggested Backend Model

```text
users: id, name, prn, university, program, year, rating
rides: id, driver_id, origin_label, origin_lat, origin_lng, destination_label,
       destination_lat, destination_lng, departure_time, available_seats, total_seats, vehicle, vibe
ride_requests: id, ride_id, passenger_id, pickup_label, pickup_lat, pickup_lng, status, created_at
```

## Run

```bash
npm install
cp .env.example .env.local
npm run dev
```
