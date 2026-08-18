"use client";

import React, { useState } from "react";
import DishCarousel from "./carousel";
import type { DishNote, Meal } from "./meals";

// Dev-only editing view of a meal card, rendered by /food when running
// `npm run dev`. Everything you type previews live in the card; Save writes
// it to app/food/data.json via the dev API route. Production renders the
// plain read-only card instead.

interface Props {
  meal: Meal;
  photos: string[];
}

type Status = "clean" | "dirty" | "saving" | "saved" | "error";

function fileOf(src: string): string {
  return src.split("/").pop() ?? "";
}

const inputCls =
  "border-2 border-hover bg-transparent px-2 py-1 focus:outline-none focus:border-salmon";

function EditableMealCard({ meal, photos }: Props) {
  const [place, setPlace] = useState(meal.place ?? "");
  const [area, setArea] = useState(meal.area ?? "");
  const [rating, setRating] = useState(meal.rating?.toString() ?? "");
  const [vibe, setVibe] = useState(meal.vibe ?? "");
  const [dishes, setDishes] = useState<Record<string, DishNote>>(
    () => ({ ...meal.dishes })
  );
  const [index, setIndex] = useState(0);
  const [status, setStatus] = useState<Status>("clean");

  const file = fileOf(photos[index] ?? "");
  const current = dishes[file] ?? {};

  const touch = () => setStatus("dirty");

  const setDishField = (field: keyof DishNote, value: string) => {
    setDishes((prev) => ({
      ...prev,
      [file]: { ...prev[file], [field]: value === "" ? undefined : value },
    }));
    touch();
  };

  const save = async () => {
    setStatus("saving");
    try {
      const res = await fetch("/api/food", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: meal.slug,
          meal: { place, area, rating, vibe, dishes },
        }),
      });
      setStatus(res.ok ? "saved" : "error");
    } catch {
      setStatus("error");
    }
  };

  const captions = photos.map((src) => {
    const d = dishes[fileOf(src)];
    if (!d) return null;
    const r =
      d.rating !== undefined ? parseFloat(String(d.rating)) : undefined;
    return {
      name: d.name,
      rating: r !== undefined && !Number.isNaN(r) ? r : undefined,
      note: d.note,
    };
  });

  const statusText: Record<Status, string> = {
    clean: "",
    dirty: "unsaved changes",
    saving: "saving...",
    saved: "saved",
    error: "save failed, is the dev server running?",
  };

  return (
    <div className="flex flex-col gap-3 border-2 border-salmon/60 p-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <input
            className={`${inputCls} flex-1 text-2xl text-hover`}
            placeholder="restaurant name"
            value={place}
            onChange={(e) => {
              setPlace(e.target.value);
              touch();
            }}
          />
          <input
            className={`${inputCls} w-20 text-right text-xl font-bold text-salmon`}
            placeholder="0-10"
            inputMode="decimal"
            value={rating}
            onChange={(e) => {
              setRating(e.target.value);
              touch();
            }}
          />
        </div>
        <p className="text-sm uppercase tracking-widest opacity-60">
          {meal.mealLabel} · {meal.time}
        </p>
        <input
          className={`${inputCls} text-sm`}
          placeholder="area / neighborhood"
          value={area}
          onChange={(e) => {
            setArea(e.target.value);
            touch();
          }}
        />
        <input
          className={`${inputCls} italic`}
          placeholder="vibe: ambiance, lighting, service..."
          value={vibe}
          onChange={(e) => {
            setVibe(e.target.value);
            touch();
          }}
        />
      </div>

      <DishCarousel
        photos={photos}
        captions={captions}
        place={place || "this spot"}
        onIndexChange={setIndex}
      />

      <div className="flex flex-col gap-2 border-2 border-dotted border-hover/60 p-3">
        <p className="text-sm uppercase tracking-widest text-hover">
          photo {index + 1} of {photos.length} · {file}
        </p>
        <div className="flex gap-2">
          <input
            className={`${inputCls} flex-1`}
            placeholder="dish name"
            value={current.name ?? ""}
            onChange={(e) => setDishField("name", e.target.value)}
          />
          <input
            className={`${inputCls} w-20 text-right text-salmon`}
            placeholder="0-10"
            inputMode="decimal"
            value={current.rating !== undefined ? String(current.rating) : ""}
            onChange={(e) => setDishField("rating", e.target.value)}
          />
        </div>
        <textarea
          className={`${inputCls} italic`}
          placeholder="tasting note for this photo"
          rows={2}
          value={current.note ?? ""}
          onChange={(e) => setDishField("note", e.target.value)}
        />
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={save}
            disabled={status === "saving" || status === "clean"}
            className="border-2 border-hover px-4 py-1 text-hover hover:bg-hover hover:text-background disabled:opacity-40"
          >
            Save
          </button>
          <span
            className={`text-sm italic ${
              status === "error" ? "text-salmon" : "opacity-60"
            }`}
          >
            {statusText[status]}
          </span>
        </div>
      </div>
    </div>
  );
}

export default EditableMealCard;
