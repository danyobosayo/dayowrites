# Shared trip packing

The Austin list lives at `/trips/austin-2026/packing`, linked from `/trips`.
It uses the owner's final Canvas snapshot: 36 shared items, five packed, and five
categories. The initial list is in `supabase/packing-seed-data.ts`; it is not
included in the browser bundle.

## Access and data flow

The private invitation uses a URL fragment: `#invite=<token>`. The browser removes
the fragment from the address bar and exchanges it for a signed, HttpOnly cookie
valid for 30 days. Every list read, write, subscription, and invitation request
requires that cookie. Mutations also check the request origin. Anyone with the
invitation can edit and share the list. Rotating `TRIPS_INVITE_TOKEN` invalidates
existing invitations and sessions.

Next.js route handlers make Supabase requests with a server-only key. Both tables
have RLS enabled with no public policies; `anon` and `authenticated` have no table
or function access. Only the server's `service_role` can use them. Do not add a
`NEXT_PUBLIC_` prefix to any trip environment variable.

The events route subscribes to Supabase Postgres Changes and sends invalidations
over SSE. Browsers refetch after every change and subscription reconnect. Each SSE
connection closes after 55 seconds, within its 60-second function limit, and
reconnects automatically. This must be verified on the actual deployment, because
local SQL tests do not exercise the hosted Realtime service.

Item writes compare the current `version`; a stale write returns HTTP 409. The
version trigger increments on every change. Bulk changes lock and verify all
selected rows before updating any of them. Additions use a client-generated UUID
to make retries idempotent. Deletion sets `deleted=true`, which produces a
filterable UPDATE event and supports Undo. Failed optimistic writes restore the
previous item locally before refetching.

## Setup

1. Apply `supabase/migrations/20260925202552_trip_packing.sql` to the website's
   separate Supabase project. Do not use a Coax project.
2. Run `supabase/seed.sql` once. It uses `ON CONFLICT DO NOTHING`, so a repeat run
   preserves later edits and packed states. `npm run packing:seed` regenerates it
   from the source snapshot.
3. Configure the three values shown in `.env.example`: `TRIPS_SUPABASE_URL`,
   `TRIPS_SUPABASE_SECRET_KEY`, and `TRIPS_INVITE_TOKEN`. Use a securely generated
   random invitation of at least 32 characters. Keep local values in the ignored
   `.env.local`, and configure server environment variables on Vercel.
4. Open the private invitation in two clients. Check an item, edit its quantity,
   add an item, delete it, and use Undo. Verify that the other client updates
   without a manual refresh and that reload preserves the result. Verify that an
   unauthenticated client cannot read or write the API.

No analytics events are sent for trip routes. The routes request no indexing and
use a no-referrer policy. The initial seed is committed in this public source
repository; the invitation protects live list access and editing, not the original
packing items stored in source control.

## Verification

`npm test` runs session/input checks and the SQL migration against PGlite. It
checks permissions, seed preservation, stale item writes, bulk atomicity,
idempotent additions, and deletion/undo. `npm run build` checks the production
bundle, lint, and TypeScript. Use browser checks for phone layout, keyboard access,
failed saves, and the actual hosted realtime connection.

The Next.js 15 security update includes narrow overrides for its PostCSS
dependency and ESLint's older brace-expansion dependency. Keep the overrides
until the parent packages resolve to fixed versions; verify with `npm audit`.
