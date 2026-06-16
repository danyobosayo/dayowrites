import fs from "fs";
import path from "path";

export type Album = {
  slug: string;
  title: string;
  description: string;
};

// Albums shown on the photography page. To add photos, run the resize script
// (`npm run photos -- --src <folder> --album <slug>`) which writes optimized
// WebP copies into public/assets/photography/<slug>/. Any image there is picked
// up automatically.
export const albums: Album[] = [
  {
    slug: "japan-korea-2026",
    title: "Japan / Korea 2026",
    description: "Shots from my 2026 trip through Japan and Korea.",
  },
  {
    slug: "friends",
    title: "Friends",
    description: "The people I'm lucky to have around me.",
  },
  {
    slug: "nature",
    title: "Nature",
    description: "Landscapes, light, and the outdoors.",
  },
];

const IMAGE_RE = /\.(jpe?g|png|webp|avif|gif)$/i;

// Reads the image files inside an album folder at build time.
export function getAlbumPhotos(slug: string): string[] {
  const dir = path.join(process.cwd(), "public", "assets", "photography", slug);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => IMAGE_RE.test(file))
    .sort()
    .map((file) => `/assets/photography/${slug}/${file}`);
}

export function getAlbum(slug: string): Album | undefined {
  return albums.find((album) => album.slug === slug);
}
