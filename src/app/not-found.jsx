"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ShoppingBag, Search, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#f8fafc] flex items-center justify-center font-sans p-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#f97316] rounded-full blur-[150px] opacity-10 pointer-events-none animate-pulse duration-1000"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#0f172a] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

      <div className="max-w-2xl w-full text-center relative z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative inline-block mb-6"
        >
          <h1 className="text-[120px] md:text-[180px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-[#0f172a] to-[#475569] drop-shadow-xl">
            404
          </h1>
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center mix-blend-overlay opacity-30 pointer-events-none"
          >
            <Search className="w-40 h-40 md:w-64 md:h-64 text-[#f97316]" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl md:text-4xl font-black text-[#0f172a] uppercase tracking-widest mb-4">
            Page Not Found
          </h2>
          <p className="text-[#64748b] text-base md:text-lg font-medium max-w-lg mx-auto mb-10 leading-relaxed">
            Oops! It looks like you've wandered off the track. The page you are
            looking for doesn't exist or has been moved.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/"
            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-[#0f172a] text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#1e293b] hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(15,23,42,0.15)] transition-all duration-300 group"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>

          <Link
            href="/product/shop"
            className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white border-2 border-[#f97316] text-[#f97316] px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#f97316] hover:text-white hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(249,115,22,0.2)] transition-all duration-300 group"
          >
            <ShoppingBag className="w-5 h-5" />
            Continue Shopping
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
