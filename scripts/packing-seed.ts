import { initialItems } from "../supabase/packing-seed-data";
import { writeFileSync } from "node:fs";
import { TRIP_ID, TRIP_SLUG } from "../app/trips/packing-data";

const quote = (value: string | number | boolean | null) =>
  value === null
    ? "null"
    : typeof value === "string"
      ? `'${value.replaceAll("'", "''")}'`
      : String(value);
const sql = `-- Original Canvas snapshot. Re-running this seed preserves edits and packed states.
insert into public.trip_packing_trips(id,slug) values (${quote(TRIP_ID)},${quote(TRIP_SLUG)}) on conflict do nothing;
insert into public.trip_packing_items(id,trip_id,category,name,quantity,unit,packed,position) values
${initialItems.map((item) => `(${[item.id, item.trip_id, item.category, item.name, item.quantity, item.unit, item.packed, item.position].map(quote).join(",")})`).join(",\n")}
on conflict do nothing;
`;
writeFileSync(new URL("../supabase/seed.sql", import.meta.url), sql);
