import type { Metadata } from "next";
import "./trips.css";

export const metadata: Metadata = {
  title: "Trips | Daniel Kim",
  description: "Shared trip packing lists.",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};
export default function TripsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="trips-shell">{children}</div>;
}
