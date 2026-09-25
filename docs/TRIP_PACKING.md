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

Bulk version conflicts use SQLSTATE `PT409`, which PostgREST maps directly to
HTTP 409. Do not use `40001` for this application-level conflict: it denotes a
retryable serialization failure and caused the hosted request to time out.

## Setup

1. Apply the files in `supabase/migrations/` in order to the website's separate
   Supabase project. Do not use a Coax project. The second migration restricts
   public execution of the optional Supabase automatic-RLS helper; its event
   trigger continues protecting newly created tables. The third migration fixes
   the bulk conflict response described above.
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

The initial cloud import was checked on September 25, 2026 against the local SQL
seed: 36 rows, five packed, with matching ordered-row checksum
`87006dd4fa21668414d1c94c9b82ef2e` (excluding `updated_at`). Applied migrations are
recorded in `supabase_migrations.schema_migrations`. The cloud permission checks
confirmed that `anon` and `authenticated` cannot read or change either table, while
the server role can. The automatic-RLS event trigger still protects new tables
after public execution of its helper function is revoked.

`npm test` runs session/input checks and the SQL migration against PGlite. It
checks permissions, seed preservation, stale item writes, bulk atomicity,
idempotent additions, and deletion/undo. `npm run build` checks the production
bundle, lint, and TypeScript. Use browser checks for phone layout, keyboard access,
failed saves, and the actual hosted realtime connection.

The Next.js 15 security update includes narrow overrides for its PostCSS
dependency and ESLint's older brace-expansion dependency. Keep the overrides
until the parent packages resolve to fixed versions; verify with `npm audit`.

## Interaction design, September 2026

The packing list is a shared instrument for five friends getting ready for Austin; it should feel calm and satisfying because each small action makes the group's progress clear. Preserve the final Canvas's content, category colors, and direct list structure. The visual register is a compact, practical notebook, with native scrolling, no imagery or sound, and no decorative intro.

Before implementation, the live Chrome audit at 390px and desktop showed a clear layout with no horizontal overflow. Several status/category buttons were 42px tall, Add buttons were 40px, and Share was 43px. Selection, checking, and modal opening lacked a consistent motion language. Keyboard skip navigation and modal focus restoration need explicit treatment. This is a product craft audit, not an award submission; preliminary subjective scores are Design 6.5, Usability 6.8, Creativity 5.5, Content 8.0 (weighted 6.5). No Lighthouse, frame-rate, or Core Web Vitals scores are inferred from appearance.

Art direction: retain the system font to avoid another font request, with a 16px item label, 13–14px quantity/meta text, 17px category headings and a fluid 25–34px title. Use 4/8/12/16/24px spacing, 8px controls and 12px surfaces, cool neutral backgrounds and dark ink. Category colors identify groups; green signifies packing progress and connection. Controls have at least 44px height, explicit focus, touch press and pointer-hover states. Keep the one-column phone layout and aligned quantity column on larger screens.

Signature interaction, "check and settle": tapping a checkbox immediately changes its semantic state, draws the check over 180ms and advances the progress fill with a 360ms decelerating transform. The row settles into a quiet packed state; the Saving label distinguishes optimistic feedback from persistence. A failed write restores the previous state. The same feedback supports mouse, keyboard and touch, and remote edits use the same state transitions. Reduced motion presents the final check, count and fill immediately. Content is visible before interaction and there are no blocking animations or scroll effects.

Supporting motion: a sliding status-filter selection, 180ms press/focus feedback, and a 280ms bottom-sheet or centered-dialog entrance. Category reopening uses one short grouped reveal. All movement uses one deceleration curve and transforms/opacity; no animation library or continuous decorative loop. The three highest-value improvements are coherent action feedback, larger/high-contrast controls, and predictable editing/focus. Expected subjective movement is roughly +0.6 Design, +0.4 Usability, +0.4 Creativity, for a 6.9 craft score; actual completion depends on browser verification, not this estimate.

Polish verification on hosted preview `5e06606`:

- Chrome viewport checks at 320, 390, 720, 768, 1440 and 1920px had no horizontal page overflow. Visible packing controls all measured at least 44px tall. The 320px editor fit without horizontal overflow; at 844 × 390 the toolbar became static and the editor stayed within the viewport with internal scrolling.
- Actual browser tabs synchronized checkbox changes in both directions. Editing Cooler's quantity in the sheet updated the second tab, and restoring it also synchronized. Original quantity and all original packed states were restored: 36 visible items, five packed. This resolves the previous two-tab verification limitation.
- Search matched names and quantity text; Clear search restored all 36 rows and returned focus to the search input. Status filters and category collapse/reopen worked. Escape closed the editor and restored focus to its initiating row. The first Tab stop was the skip link. Native modal behavior prevents interacting with background controls.
- Emulated reduced motion yielded no dialog animation and zero-duration progress/selection transitions, with the complete sheet and controls still visible. No browser warning or error logs were recorded during the checked flows. Text/background contrast was measured at 5.01:1 for packed labels and at least 4.61:1 for category text; checkbox outline contrast was 3.20:1 in the checked preview. The final outline is slightly darker to also maintain at least 3:1 on row hover; category counts use full-opacity text and Add controls use a dark tint so their small white labels retain contrast.
- An uncached Chrome trace at 390px, CPU throttle 4×, 150ms latency and 200,000 bytes/sec downstream measured LCP 632ms (the page heading), zero non-input layout-shift score, and 165,074 bytes in completed network transfers. This is one authenticated-preview lab observation, not field Core Web Vitals, a physical-device result, or a Lighthouse score. Lighthouse, INP and sustained-device FPS were not measured.
- All ten tests and the production build/lint/TypeScript checks passed. First-load JavaScript remained 113 kB, with the packing route at 7.33 kB. No animation dependency was added. All temporary network/CPU/reduced-motion emulation was cleared after testing.

Final subjective craft review: Design 7.1 (coherent controls, legible type and restrained motion), Usability 7.2 (verified responsive interactions and keyboard/reduced-motion support, with physical Safari/Android testing outside this pass), Creativity 5.9 (purposeful but deliberately familiar checklist interaction), Content 8.0 (the owner's exact trip content). Weighted score: 6.98/10. This is an internal design assessment, not an Awwwards award or submission. The practical acceptance criterion is a dependable shared packing list.
