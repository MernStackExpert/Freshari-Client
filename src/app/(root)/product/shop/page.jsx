import { Suspense } from "react";
import ShopContent from "./ShopContent";

export default function Page() {
  return (
    <Suspense fallback={<div className="py-20 text-center font-black">Loading...</div>}>
      <ShopContent />
    </Suspense>
  );
}