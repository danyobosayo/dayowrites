import type { Metadata } from "next";
import PackingList from "../../packing-list";
export const metadata: Metadata = {
  title: "Austin Packing List | Daniel Kim",
  description: "The shared packing list for our September 26–27 Austin trip.",
};
export default function AustinPackingPage() {
  return <PackingList />;
}
