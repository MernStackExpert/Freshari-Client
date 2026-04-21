import { Suspense } from "react";
import ThankYou from "./ThankYou";

export default function Page() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Loading...</div>}>
      <ThankYou />
    </Suspense>
  );
}