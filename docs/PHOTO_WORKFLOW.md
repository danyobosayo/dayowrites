# Photo workflow

Photos are stored as optimized, in-repository copies. Originals remain in the iCloud
or SSD archive and are not committed.

## Import an album

1. Export the album from Photos or iCloud as full-size JPEG files into a temporary
   folder such as `~/Desktop/<album>-export`. Exporting as JPEG converts Fujifilm RAF
   originals into a readable format. Confirm the export completed, contains the
   expected number of images, and has no `.icloud` placeholders.
2. Resize and optimize the export:

   ```bash
   npm run photos -- --src <folder> --album <slug>
   npm run photos -- --src <folder> --out public/assets/food
   ```

   The script applies EXIF rotation, caps the long edge at 2560 pixels without
   upscaling, writes WebP at quality 80, and strips camera and GPS metadata. Optional
   flags are `--max`, `--quality`, and `--format`. Re-running it safely overwrites the
   same slugified filenames.
3. Commit the generated `.webp` files. Photography galleries enumerate their album
   directory automatically, so importing photos does not normally require a code change.

Album slugs such as `japan-korea-2026`, `friends`, and `nature` are defined in
`app/photography/albums.ts`.

## Food reviews

Food images live in `public/assets/food/<meal-slug>/`, one folder per restaurant visit.
Existing folders were grouped from EXIF timestamps using a gap greater than 90 minutes,
then optimized with `--max 1600 --quality 75`.

Do not edit `app/food/data.json` directly. Run `npm run dev`, open `/food`, edit the
cards in the development-only interface, and save through `app/api/food`. Commit the
generated JSON. Production builds render read-only cards and the API returns 404.

Supporting code is in `app/food/meals.ts`, `app/food/carousel.tsx`, and
`app/food/editable-card.tsx`. Historical camera timestamps used Dallas time until the
night of April 12; later timestamps were verified against Korea and Japan local time.
