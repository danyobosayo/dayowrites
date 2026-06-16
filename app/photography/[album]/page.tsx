import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "../../components/header";
import Gallery from "../../components/gallery";
import { albums, getAlbum, getAlbumPhotos } from "../albums";

export function generateStaticParams() {
  return albums.map((album) => ({ album: album.slug }));
}

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ album: string }>;
}) {
  const { album: slug } = await params;
  const album = getAlbum(slug);
  if (!album) notFound();

  const photos = getAlbumPhotos(slug);

  return (
    <div className="gap-6 overflow-scroll scrollbar-hide flex flex-col">
      <Header title={album.title.toLowerCase()}>
        <p>{album.description}</p>
      </Header>
      <Gallery photos={photos} />
      <p>
        <Link className="hyperlink" href="/photography">
          back to albums
        </Link>
      </p>
    </div>
  );
}
