import fs from "fs";
import path from "path";
import data from "./data.json";

// The meal data lives in data.json. Don't edit it by hand: run `npm run dev`,
// open /food, and use the edit fields rendered under each card (dev only).
// Saves go through app/api/food/route.ts, which rewrites data.json.
export type DishNote = {
  name?: string; // "grilled mackerel"
  rating?: number; // out of 10, e.g. 7.8
  note?: string; // "Flavorful, forward sweetness, but the texture was off."
};

export type Meal = {
  slug: string; // folder under public/assets/food/<slug>/
  date: string; // "2026-04-12"
  time: string; // first photo's local time, "08:42"
  mealLabel: string; // breakfast | brunch | lunch | cafe | snack | dinner | late night
  place?: string; // restaurant name; leave off until identified
  area?: string; // neighborhood / city
  rating?: number; // overall, out of 10: food + vibe + service + decor
  vibe?: string; // a line about ambiance, lighting, service
  dishes?: Record<string, DishNote>;
};

// Meals were grouped from photo EXIF timestamps and cross-referenced against
// the trip-planning spreadsheet. Timestamp note: the camera stayed on Dallas
// time until the night of Apr 12 (the first phone-paired photo synced it to
// KST), so the Apr 9 and Apr 12 times are reconstructed local times. Every
// timestamp after that is verified local time (a BHC receipt and a phone
// screen in-frame both match EXIF exactly).
export const meals = data as unknown as Meal[];

// Which city each day of the trip was in, used for the day headers.
// Route from the trip itinerary: Dallas -> Seoul (Apr 10) -> Busan (Apr 16,
// KTX) -> Fukuoka (Apr 17, flight) -> Tokyo (Apr 23) -> Dallas (Apr 24).
export const tripCities: Record<string, string> = {
  "2026-04-09": "Dallas",
  "2026-04-12": "Seoul",
  "2026-04-13": "Seoul",
  "2026-04-14": "Seoul",
  "2026-04-15": "Seoul",
  "2026-04-16": "Seoul to Busan",
  "2026-04-17": "Busan to Fukuoka",
  "2026-04-18": "Fukuoka",
  "2026-04-19": "Fukuoka",
  "2026-04-20": "Fukuoka",
  "2026-04-21": "Fukuoka",
  "2026-04-22": "Fukuoka",
  "2026-04-23": "Fukuoka to Tokyo",
};

export const tripStart = "2026-04-09";

const IMAGE_RE = /\.(jpe?g|png|webp|avif|gif)$/i;

// Lists a meal's photos at build time, same pattern as photography albums.
export function getMealPhotos(slug: string): string[] {
  const dir = path.join(process.cwd(), "public", "assets", "food", slug);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => IMAGE_RE.test(file))
    .sort()
    .map((file) => `/assets/food/${slug}/${file}`);
}
