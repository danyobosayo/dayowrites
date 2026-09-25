"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Waves } from "lucide-react";
import { Analytics } from "@vercel/analytics/next";

export default function SiteFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Trip invitations and list activity stay out of site analytics.
  if (pathname === "/trips" || pathname.startsWith("/trips/"))
    return <>{children}</>;
  return (
    <>
      <div className="flex flex-col text-center gap-3 py-8 w-full">
        <h1>
          <Link href="/">Daniel Kim</Link>
        </h1>
        <div className="text-center mx-auto flex flex-wrap justify-center gap-4 p-[10px] text-hover text-2xl">
          <h3 className="hover:text-darktext">
            <a target="_blank" href="https://scribbles.danielsungsu.kim/">
              writing
            </a>
          </h3>
          <h3 className="hover:text-darktext">
            <Link href="/projects">projects</Link>
          </h3>
          <h3 className="hover:text-darktext">
            <Link href="/photography">photography</Link>
          </h3>
          <h3 className="hover:text-darktext">
            <Link href="/food">food</Link>
          </h3>
          <h3 className="hover:text-darktext">
            <Link href="/trips">trips</Link>
          </h3>
          <h3 className="hover:text-darktext">
            <Link href="/myself">myself</Link>
          </h3>
        </div>
      </div>
      <div className="w-fit max-w-[700px] mx-4 md:mx-auto flex flex-col px-6 pt-9 pb-12 border-2 border-hover">
        {children}
      </div>
      <div className="py-6 flex justify-center align-middle">
        <div className="flex gap-4 p-[10px] text-salmon justify-center align-center opacity-80">
          <p className="hover:opacity-80">
            <Link href="/contact">contact</Link>
          </p>
          <Waves className="w-4 h-4 my-auto" />
          <p className="hover:opacity-80">
            <a target="_blank" href="https://github.com/danyobosayo">
              github
            </a>
          </p>
          <Waves className="w-4 h-4 my-auto" />
          <p className="hover:opacity-80">
            <Link href="/">home</Link>
          </p>
        </div>
      </div>
      <Analytics
        beforeSend={(event) =>
          new URL(event.url).pathname.startsWith("/trips") ? null : event
        }
      />
    </>
  );
}
