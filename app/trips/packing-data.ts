export const TRIP_SLUG = "austin-2026";
export const TRIP_ID = "26a05710-0926-4260-8000-000000000001";
export const TRIP_TITLE = "OBL Austin Packing List";

export const categories = [
  { id: "lake", name: "Lake", color: "#317bac", notice: "" },
  { id: "food", name: "Food / cleanup", color: "#32785f", notice: "" },
  { id: "games", name: "Games / house", color: "#76519b", notice: "" },
  {
    id: "ssam",
    name: "Ssam groceries",
    color: "#ac5265",
    notice:
      "Check the Airbnb before buying groceries: fridge/freezer space, pantry staples, seasonings, and cooking oil.",
  },
  {
    id: "cooking",
    name: "Cooking",
    color: "#91651f",
    notice:
      "Check the Airbnb before packing or buying supplies: grill type, fuel, pots and pans, rice cooker, and kitchenware.",
  },
] as const;

export type CategoryId = (typeof categories)[number]["id"];
export type PackingItem = {
  id: string;
  trip_id: string;
  category: CategoryId;
  name: string;
  quantity: number | null;
  unit: string;
  packed: boolean;
  deleted: boolean;
  version: number;
  position: number;
};
export type ItemDraft = Pick<
  PackingItem,
  "category" | "name" | "quantity" | "unit"
>;
