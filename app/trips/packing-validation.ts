import { categories, type ItemDraft } from "./packing-data";

export class InputError extends Error {}
export function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new InputError("Invalid request.");
  return value as Record<string, unknown>;
}
export function uuid(value: unknown): string {
  if (
    typeof value !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      value,
    )
  )
    throw new InputError("Invalid item.");
  return value;
}
export function version(value: unknown): number {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 1)
    throw new InputError("Refresh the list and try again.");
  return value;
}
export function draft(value: unknown): ItemDraft {
  const input = record(value);
  if (
    typeof input.name !== "string" ||
    !input.name.trim() ||
    input.name.trim().length > 160
  )
    throw new InputError("Enter an item name up to 160 characters.");
  if (!categories.some((c) => c.id === input.category))
    throw new InputError("Choose a category.");
  if (typeof input.unit !== "string" || input.unit.trim().length > 80)
    throw new InputError("Keep the unit under 80 characters.");
  if (
    input.quantity !== null &&
    (typeof input.quantity !== "number" ||
      !Number.isFinite(input.quantity) ||
      input.quantity < 0 ||
      input.quantity > 10000)
  )
    throw new InputError(
      "Enter a quantity from 0 to 10,000, or leave it blank.",
    );
  return {
    name: input.name.trim(),
    category: input.category as ItemDraft["category"],
    quantity: input.quantity as number | null,
    unit: input.unit.trim(),
  };
}

export function itemChanges(
  value: unknown,
): Partial<ItemDraft> & { packed?: boolean; deleted?: boolean } {
  const input = record(value);
  const keys = Object.keys(input);
  if (keys.length === 1 && (keys[0] === "packed" || keys[0] === "deleted")) {
    const key = keys[0];
    if (typeof input[key] !== "boolean")
      throw new InputError("Invalid item state.");
    return { [key]: input[key] };
  }
  if (
    keys.length !== 4 ||
    keys.some((k) => !["name", "category", "quantity", "unit"].includes(k))
  )
    throw new InputError("Invalid edit.");
  return draft(input);
}
