import type { Metadata } from "next";
import SiteFrame from "./components/site-frame";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daniel Kim",
  description:
    "Daniel Kim is a student at The University of Texas at Dallas (UTD) and studies computer science.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col justify-center">
        <SiteFrame>{children}</SiteFrame>
      </body>
    </html>
  );
}
