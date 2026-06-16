import React from "react";
import Link from "next/link";
import Image from "next/image";
import Header from "../components/header";
import Gallery from "../components/gallery";
import { albums, getAlbumPhotos } from "./albums";

function page() {
  // Pull a few photos across albums for the showcase at the top.
  const showcase = albums
    .flatMap((album) => getAlbumPhotos(album.slug).slice(0, 2))
    .slice(0, 6);

  return (
    <div className="gap-6 overflow-scroll scrollbar-hide flex flex-col">
      <Header title="photography">
        <p>
          A growing collection of photos I&apos;ve taken, sorted into albums.
        </p>
      </Header>

      {showcase.length > 0 && <Gallery photos={showcase} />}

      <div className="flex flex-col gap-3">
        {albums.map((album) => {
          const cover = getAlbumPhotos(album.slug)[0];
          return (
            <Link
              key={album.slug}
              href={`/photography/${album.slug}`}
              className="flex gap-4 border-2 border-hover p-3 hover:bg-[#f1ece4]"
            >
              <div className="relative w-24 h-24 shrink-0 bg-[#efe9e1]">
                {cover && (
                  <Image
                    src={cover}
                    alt=""
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex flex-col justify-center">
                <h3 className="text-hover">{album.title}</h3>
                <p>{album.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default page;
