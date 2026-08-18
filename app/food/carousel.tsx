"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";

type Caption = {
  name?: string;
  rating?: number;
  note?: string;
};

interface Props {
  photos: string[];
  captions: (Caption | null)[]; // aligned with photos
  place: string; // for alt text
  onIndexChange?: (index: number) => void; // used by the dev-only editor
}

function DishCarousel({ photos, captions, place, onIndexChange }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndexState] = useState(0);

  const setIndex = (i: number) => {
    setIndexState(i);
    onIndexChange?.(i);
  };

  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    setIndex(
      Math.min(photos.length - 1, Math.round(el.scrollLeft / el.clientWidth))
    );
  };

  const scrollToSlide = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(photos.length - 1, i));
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    el.scrollTo({
      left: clamped * el.clientWidth,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  const caption = captions[index];

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide border-2 border-hover bg-[#efe9e1]"
          aria-label={`Photos from ${place}`}
        >
          {photos.map((src, i) => (
            <div
              key={src}
              className="relative w-full shrink-0 snap-start aspect-[4/5]"
            >
              <Image
                src={src}
                alt={
                  captions[i]?.name
                    ? `${captions[i]!.name} at ${place}`
                    : `Dish ${i + 1} at ${place}`
                }
                fill
                sizes="(max-width: 700px) 90vw, 650px"
                className="object-cover"
                loading={i === 0 ? undefined : "lazy"}
              />
            </div>
          ))}
        </div>
        {photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => scrollToSlide(index - 1)}
              disabled={index === 0}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 border-2 border-hover bg-background/85 text-hover text-xl leading-none disabled:opacity-30 hover:bg-background"
            >
              &lsaquo;
            </button>
            <button
              type="button"
              onClick={() => scrollToSlide(index + 1)}
              disabled={index === photos.length - 1}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 border-2 border-hover bg-background/85 text-hover text-xl leading-none disabled:opacity-30 hover:bg-background"
            >
              &rsaquo;
            </button>
            <span className="absolute bottom-2 right-2 border-2 border-hover bg-background/85 px-2 py-0.5 text-sm tracking-widest text-hover">
              {index + 1} / {photos.length}
            </span>
          </>
        )}
      </div>

      {caption && (caption.name || caption.rating !== undefined) && (
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline">
            <span className="text-hover">{caption.name ?? "untitled"}</span>
            <span
              aria-hidden
              className="mx-2 mb-1 flex-1 border-b-2 border-dotted border-hover/50"
            />
            {caption.rating !== undefined && (
              <span className="whitespace-nowrap font-bold text-salmon">
                {caption.rating}/10
              </span>
            )}
          </div>
          {caption.note && <p className="italic opacity-80">{caption.note}</p>}
        </div>
      )}
    </div>
  );
}

export default DishCarousel;
