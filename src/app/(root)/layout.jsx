"use client";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Suspense } from "react";

export default function ClientLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback={<div className="h-20 bg-white" />}>
        <Navbar />
      </Suspense>
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}