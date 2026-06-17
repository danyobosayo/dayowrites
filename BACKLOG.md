# Backlog

Planned work, newest ideas at the top.

## Photography: click-to-expand full-res lightbox

Clicking a photo in an album (or the showcase) should open a modal/lightbox showing the
**full-resolution** image alongside a **caption**, with prev/next navigation.

Two pieces of work:

1. **Make full-scale images available.** The current `npm run photos` pipeline only keeps a
   2560px WebP web copy in the repo; the originals are not committed. To serve true full-res
   on click we need one of:
   - keep a second, larger variant (e.g. a `*-full.webp` at ~4096px, or the original JPEG)
     in the repo per photo, or
   - move originals to external storage (Cloudinary / Vercel Blob / R2) and link the modal
     to those, while the grid keeps using the small in-repo thumbnails.
   The grid would load the small WebP; the modal would load the full-res source.

2. **Captions.** Add per-photo caption data (e.g. a sidecar `captions.json` per album, or a
   map keyed by filename) and surface it in the modal. The resize script could pass through
   or scaffold caption entries.

Component: a client `<Lightbox>` over the existing `Gallery`, with keyboard (Esc / arrows)
and focus handling for accessibility.
