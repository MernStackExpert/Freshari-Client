import { Suspense } from "react";
import ShopContent from "./ShopContent";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center font-black text-[#0f172a] animate-pulse">
          Loading...
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
