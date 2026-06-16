import React from "react";
import Image from "next/image";
import Header from "../components/header";

type Review = {
  place: string;
  location: string;
  dish?: string;
  rating: number; // out of 10
  blurb: string;
  image?: string; // a file dropped in public/assets/food/, e.g. "/assets/food/ichiran.jpg"
};

// Add reviews here. To include a photo, drop it in public/assets/food/ and
// reference it as "/assets/food/<filename>".
//
// Example:
// {
//   place: "Ichiran",
//   location: "Shibuya, Tokyo",
//   dish: "Tonkotsu ramen",
//   rating: 8.5,
//   blurb: "Solitary ramen booths and a broth worth the hype.",
//   image: "/assets/food/ichiran.jpg",
// },
const reviews: Review[] = [];

function page() {
  return (
    <div className="gap-6 overflow-scroll scrollbar-hide flex flex-col">
      <Header title="food">
        <p>
          Short, honest reviews of what I&apos;ve eaten, starting with my 2026
          Japan and Korea trip.
        </p>
      </Header>

      {reviews.length === 0 ? (
        <p className="italic opacity-70">Reviews coming soon.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 border-2 border-hover p-4"
            >
              {review.image && (
                <div className="relative w-full aspect-[4/3] border-2 border-hover bg-[#efe9e1]">
                  <Image
                    src={review.image}
                    alt={review.place}
                    fill
                    sizes="(max-width: 700px) 90vw, 650px"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex justify-between items-baseline gap-2">
                <h3 className="text-hover">{review.place}</h3>
                <span className="text-salmon font-bold whitespace-nowrap">
                  {review.rating}/10
                </span>
              </div>
              <p className="opacity-70">
                {review.location}
                {review.dish ? ` · ${review.dish}` : ""}
              </p>
              <p>{review.blurb}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default page;
