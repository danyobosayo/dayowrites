import type { Metadata } from "next";
import { Waves } from "lucide-react";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Daniel Kim",
  description:
    "Daniel Kim is a student at The University of Texas at Dallas (UTD) and studies computer science.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col justify-center">
        <div className="flex flex-col text-center gap-3 py-8 w-full">
          <h1>
            <Link href="/">Daniel Kim</Link>
          </h1>
          <div className="text-center mx-auto flex gap-4 p-[10px] text-hover text-2xl">
            <h3 className="hover:text-darktext">
              <Link href="/scribbles">scribbles</Link>
            </h3>
            <h3 className="hover:text-darktext">
              <Link href="/projects">projects</Link>
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
      </body>
    </html>
  );
}
