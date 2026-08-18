import React from "react";
import Header from "../components/header";
import DishCarousel from "./carousel";
import EditableMealCard from "./editable-card";
import { meals, getMealPhotos, tripCities, tripStart, Meal } from "./meals";

// In `npm run dev` every card becomes editable and saves back to data.json
// through the dev-only API route. Production builds render read-only cards.
const editable = process.env.NODE_ENV === "development";

function dayNumber(date: string): number {
  const ms =
    new Date(`${date}T00:00:00`).getTime() -
    new Date(`${tripStart}T00:00:00`).getTime();
  return Math.round(ms / 86400000) + 1;
}

function prettyDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function MealCard({ meal }: { meal: Meal }) {
  const photos = getMealPhotos(meal.slug);
  if (photos.length === 0) return null;
  if (editable) return <EditableMealCard meal={meal} photos={photos} />;
  const captions = photos.map(
    (src) => meal.dishes?.[src.split("/").pop() ?? ""] ?? null
  );

  return (
    <div className="flex flex-col gap-3 border-2 border-hover p-4">
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline">
          {meal.place ? (
            <h3 className="text-hover">{meal.place}</h3>
          ) : (
            <h3 className="italic text-hover opacity-60">unnamed spot</h3>
          )}
          {meal.rating !== undefined && (
            <>
              <span
                aria-hidden
                className="mx-3 mb-1.5 flex-1 border-b-2 border-dotted border-hover/50"
              />
              <span className="whitespace-nowrap text-xl font-bold text-salmon">
                {meal.rating}/10
              </span>
            </>
          )}
        </div>
        <p className="text-sm uppercase tracking-widest opacity-60">
          {meal.mealLabel} · {meal.time}
          {meal.area ? ` · ${meal.area}` : ""}
        </p>
        {meal.vibe && <p className="italic opacity-80">{meal.vibe}</p>}
      </div>
      <DishCarousel photos={photos} captions={captions} place={meal.place ?? "this spot"} />
    </div>
  );
}

function page() {
  // Group meals by day, keeping chronological order.
  const days: { date: string; items: Meal[] }[] = [];
  for (const meal of meals) {
    const last = days[days.length - 1];
    if (last && last.date === meal.date) last.items.push(meal);
    else days.push({ date: meal.date, items: [meal] });
  }

  return (
    <div className="gap-6 overflow-scroll scrollbar-hide flex flex-col">
      <Header title="food">
        <p>
          A meal-by-meal journal of the 2026 Japan and Korea trip, grouped by
          restaurant from photo timestamps. Ratings are out of 10; the overall
          number folds in food, vibe, and service.
        </p>
      </Header>

      {days.length === 0 ? (
        <p className="italic opacity-70">Reviews coming soon.</p>
      ) : (
        <div className="flex flex-col gap-12 border-l-2 border-[#63725B]/30 pl-5 sm:pl-7 ml-1">
          {days.map((day) => (
            <section key={day.date} className="relative flex flex-col gap-5">
              <span
                aria-hidden
                className="absolute -left-[27px] sm:-left-[35px] top-2 h-3 w-3 rounded-full bg-hover"
              />
              <div className="flex flex-col">
                <p className="text-sm uppercase tracking-widest text-hover">
                  Day {dayNumber(day.date)}
                  {tripCities[day.date] ? ` · ${tripCities[day.date]}` : ""}
                </p>
                <h2 className="text-3xl">{prettyDate(day.date)}</h2>
              </div>
              {day.items.map((meal) => (
                <MealCard key={meal.slug} meal={meal} />
              ))}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

export default page;
