import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// Dev-only editor endpoint for the /food page. In production this route
// answers 404, so the deployed site stays read-only.
const DATA_PATH = path.join(process.cwd(), "app", "food", "data.json");
const isDev = process.env.NODE_ENV === "development";

type DishNote = { name?: string; rating?: number; note?: string };
type MealPatch = {
  place?: string;
  area?: string;
  rating?: number;
  vibe?: string;
  dishes?: Record<string, DishNote>;
};

function cleanString(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() !== "" ? v.trim() : undefined;
}

function cleanRating(v: unknown): number | undefined {
  const n = typeof v === "string" ? parseFloat(v) : v;
  if (typeof n !== "number" || Number.isNaN(n)) return undefined;
  return Math.max(0, Math.min(10, Math.round(n * 10) / 10));
}

export async function PUT(req: Request) {
  if (!isDev) return new NextResponse("Not found", { status: 404 });

  const body = (await req.json()) as { slug?: string; meal?: MealPatch };
  if (!body.slug || !body.meal) {
    return new NextResponse("Expected { slug, meal }", { status: 400 });
  }

  const meals = JSON.parse(await fs.readFile(DATA_PATH, "utf8")) as Record<
    string,
    unknown
  >[];
  const index = meals.findIndex((m) => m.slug === body.slug);
  if (index === -1) {
    return new NextResponse(`Unknown slug: ${body.slug}`, { status: 404 });
  }

  const patch = body.meal;
  const dishes: Record<string, DishNote> = {};
  for (const [file, note] of Object.entries(patch.dishes ?? {})) {
    const cleaned: DishNote = {};
    const name = cleanString(note.name);
    const rating = cleanRating(note.rating);
    const text = cleanString(note.note);
    if (name !== undefined) cleaned.name = name;
    if (rating !== undefined) cleaned.rating = rating;
    if (text !== undefined) cleaned.note = text;
    dishes[file] = cleaned;
  }

  const existing = meals[index];
  meals[index] = {
    ...existing,
    place: cleanString(patch.place),
    area: cleanString(patch.area),
    rating: cleanRating(patch.rating),
    vibe: cleanString(patch.vibe),
    dishes,
    slug: body.slug,
  };
  // Drop undefined fields so the JSON stays tidy.
  for (const key of ["place", "area", "rating", "vibe"]) {
    if ((meals[index] as Record<string, unknown>)[key] === undefined) {
      delete (meals[index] as Record<string, unknown>)[key];
    }
  }

  await fs.writeFile(DATA_PATH, JSON.stringify(meals, null, 2) + "\n");
  return NextResponse.json({ ok: true });
}
