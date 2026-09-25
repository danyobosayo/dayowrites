import { TRIP_ID } from "@/app/trips/packing-data";
import {
  draft,
  itemChanges,
  record,
  uuid,
  version,
  InputError,
} from "@/app/trips/packing-validation";
import {
  database,
  failure,
  HttpError,
  readBody,
  requireSameOrigin,
  requireSession,
} from "@/app/trips/server";

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    await requireSession();
    const { data, error } = await database()
      .from("trip_packing_items")
      .select(
        "id,trip_id,category,name,quantity,unit,packed,deleted,version,position",
      )
      .eq("trip_id", TRIP_ID)
      .order("position")
      .order("id")
      .limit(1000);
    if (error) throw error;
    return Response.json(
      { items: data },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (error) {
    return failure(error);
  }
}
export async function POST(request: Request) {
  try {
    await requireSameOrigin(request);
    await requireSession();
    const input = record(await readBody(request));
    const db = database();
    const id = uuid(input.id);
    const values = draft(input.item);
    const { data, error } = await db.rpc("add_trip_packing_item", {
      p_trip: TRIP_ID,
      p_id: id,
      p_category: values.category,
      p_name: values.name,
      p_quantity: values.quantity,
      p_unit: values.unit,
    });
    if (error?.code === "54000")
      throw new HttpError(422, "This trip has reached its item limit.");
    if (error) throw error;
    return Response.json({ item: data }, { status: 201 });
  } catch (error) {
    return failure(error);
  }
}
export async function PATCH(request: Request) {
  try {
    await requireSameOrigin(request);
    await requireSession();
    const input = record(await readBody(request));
    const db = database();
    if (input.action === "bulk") {
      if (
        !Array.isArray(input.items) ||
        !input.items.length ||
        input.items.length > 200 ||
        typeof input.packed !== "boolean"
      )
        throw new InputError("Invalid group change.");
      const items = input.items.map((value) => {
        const row = record(value);
        return { id: uuid(row.id), version: version(row.version) };
      });
      if (new Set(items.map((i) => i.id)).size !== items.length)
        throw new InputError("Duplicate items.");
      const { data, error } = await db.rpc("set_trip_packing_items", {
        p_trip: TRIP_ID,
        p_items: items,
        p_packed: input.packed,
      });
      if (error?.code === "PT409" || error?.code === "40001")
        throw new HttpError(
          409,
          "Someone changed this list. Review the latest items and try again.",
        );
      if (error) throw error;
      return Response.json({ items: data });
    }
    const changes = itemChanges(input.changes);
    let query = db
      .from("trip_packing_items")
      .update(changes)
      .eq("trip_id", TRIP_ID)
      .eq("id", uuid(input.id))
      .eq("version", version(input.version));
    if (changes.deleted !== false) query = query.eq("deleted", false);
    const { data, error } = await query
      .select(
        "id,trip_id,category,name,quantity,unit,packed,deleted,version,position",
      )
      .maybeSingle();
    if (error) throw error;
    if (!data)
      throw new HttpError(
        409,
        "Someone changed this item. Review the latest version and try again.",
      );
    return Response.json({ item: data });
  } catch (error) {
    return failure(error);
  }
}
