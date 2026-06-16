import React from "react";
import Image from "next/image";

interface props {
  photos: string[];
  emptyMessage?: string;
}

function gallery({ photos, emptyMessage }: props) {
  if (photos.length === 0) {
    return (
      <p className="italic opacity-70">
        {emptyMessage ?? "No photos here yet. Check back soon."}
      </p>
    );
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
      {photos.map((src) => (
        <div
          key={src}
          className="relative aspect-square border-2 border-hover bg-[#efe9e1]"
        >
          <Image
            src={src}
            alt=""
            fill
            sizes="(max-width: 700px) 45vw, 220px"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}

export default gallery;
