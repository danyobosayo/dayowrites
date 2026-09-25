import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function TripsPage() {
  return (
    <main className="packing-page trips-index" id="trip-content" tabIndex={-1}>
      <Link className="trips-back" href="/">
        <ChevronLeft size={17} /> Daniel Kim
      </Link>
      <h1>Trips</h1>
      <Link className="trip-link" href="/trips/austin-2026/packing">
        <span>
          <strong>Austin</strong>
          <span>September 26–27, 2026</span>
          <span>Packing list</span>
        </span>
        <ChevronRight size={22} />
      </Link>
    </main>
  );
}
