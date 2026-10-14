# dayowrites repository instructions

`dayowrites` is Daniel Kim's personal site at `danielsungsu.kim`. It is a Next.js 15
App Router project using TypeScript and Tailwind v4. Do not confuse it with the Hugo
repository at `../dayoblog`.

## Project management

- Follow the shared workflow in `~/.agents/AGENTS.md`.
- Track this repository in `Dayo Product OS` with `Project = Web`.
- The GitHub Project is the sole active backlog. `BACKLOG.md` is a retired pointer and
  must not receive new tasks.
- The GitHub remote exists and Vercel deploys `main`; the active coding agent owns the branch,
  verification, commit, and pull request.

## Read before editing

- `docs/PHOTO_WORKFLOW.md` is the source of truth for importing and optimizing media.
- Main routes live under `app/`; reusable pieces are in `app/components/`; site images
  live under `public/assets/`.
- Album definitions and filesystem helpers live in `app/photography/albums.ts`. Food
  review data and editing code live under `app/food/`.

## Site rules

- Do not use em dashes in site copy.
- Escape apostrophes in JSX text as `&apos;`; use Next.js `Link` for internal links.
- Commit optimized web images, not originals. Use `npm run photos` and follow
  `docs/PHOTO_WORKFLOW.md` rather than processing images ad hoc.
- Do not hand-edit `app/food/data.json`. Use the development-only food editor and
  commit its generated JSON.
- Never commit `node_modules/`, `.next/`, `.DS_Store`, camera metadata, or originals.

## Verification

- Use `npm run dev` for interactive work and run `npm run build` before completion;
  the production build covers linting and type checking.
- Visually verify changed pages at relevant viewport sizes and review the complete
  diff before opening a pull request.
