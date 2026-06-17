# dayowrites — project notes for Claude

Daniel Kim's personal site, served at **danielsungsu.kim**.

- **Stack:** Next.js 15 (App Router) + TypeScript + Tailwind v4 (`@theme` in `app/globals.css`).
- **Deploy:** Vercel, auto-deploys on push to `main`. Remote is `git@github.com:danyobosayo/dayowrites.git` (plain `github.com`, not the `github.com-personal` alias the blog uses).
- Not to be confused with the Hugo blog repo `dayoblog` (also titled "dayowrites").

## Layout

- `app/page.tsx` — home. `app/projects`, `app/myself`, `app/contact`, `app/scribbles`.
- `app/photography/` — landing (`page.tsx`), album route (`[album]/page.tsx`), and `albums.ts` (album list + `getAlbumPhotos` fs helper).
- `app/food/page.tsx` — food reviews, driven by a `reviews` array at the top of the file.
- `app/components/` — `header.tsx`, `block.tsx`, `gallery.tsx` (reusable photo grid).
- Images live in `public/assets/` (`photography/<album>/`, `food/`).

### House style
- **No em-dashes** in site copy (owner preference).
- Escape apostrophes in JSX text as `&apos;` (eslint `react/no-unescaped-entities` is error-level; it will fail the build otherwise). Internal links must use `<Link>`, not `<a>`.

## Adding photos (the workflow)

Photos are stored **optimized, in-repo** (Option A). Originals stay in the iCloud/SSD
archive; only downsized web copies are committed.

1. **Export** the album from Photos.app (or iCloud) as **full-size JPEG** into a folder,
   e.g. `~/Desktop/<album>-export`. (Export as JPEG, not "unmodified originals", so any
   Fujifilm RAF raw files become readable JPEGs.) Confirm the export finished — no
   `.icloud` placeholder files and the expected count.
2. **Resize + optimize** with the script:
   ```bash
   npm run photos -- --src <folder> --album <slug>      # photography album
   npm run photos -- --src <folder> --out public/assets/food   # food photos
   ```
   It auto-rotates from EXIF, caps the long edge at 2560px (no upscaling), re-encodes to
   WebP q80, and strips camera/GPS metadata. Flags: `--max`, `--quality`, `--format`.
   It writes into `public/assets/photography/<slug>/` (or the `--out` dir). Re-running is
   safe (stable slugified filenames; it just overwrites).
3. **Commit** the generated `.webp` files and push. The gallery lists whatever images are
   in the album folder automatically, so no code change is needed to show them.

- **Album slugs** (`japan-korea-2026`, `friends`, `nature`) are defined in
  `app/photography/albums.ts`. Edit that array to add/rename albums.
- **Food reviews:** drop photos in `public/assets/food/`, then add a `Review` object to the
  `reviews` array in `app/food/page.tsx` (there's a commented template).

## Build / housekeeping

- `npm run dev`, `npm run build`. The Vercel build runs ESLint + type-check; a real
  `npm run build` locally catches both before pushing.
- Never commit `node_modules/`, `.next/`, or `.DS_Store`.
- See `BACKLOG.md` for planned work.
