"use client";
import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, LayoutGrid } from "lucide-react";
import { MAIN_LINKS } from "./navData";

const MobileSidebar = ({ isOpen, setIsOpen, categories }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-[#0f172a]/60 backdrop-blur-sm z-[2000]"
        />
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", stiffness: 250, damping: 25 }}
          className="fixed top-0 left-0 h-full w-[320px] max-w-[85vw] bg-[#fcfdfd] z-[2001] flex flex-col shadow-[20px_0_50px_rgba(0,0,0,0.1)]"
        >
          <div className="p-6 bg-gradient-to-br from-[#0f172a] to-[#1e293b] flex justify-between items-center text-white shrink-0 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#f97316] rounded-full blur-[60px] opacity-20 pointer-events-none"></div>
            <span className="font-black text-lg tracking-[0.2em] uppercase relative z-10">
              Menu
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2.5 bg-white/10 hover:bg-[#f97316] rounded-xl transition-all duration-300 relative z-10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 no-scrollbar">
            <div className="flex flex-col gap-3">
              {MAIN_LINKS.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 px-5 py-4 rounded-2xl font-bold bg-white border border-gray-100 hover:border-[#f97316]/30 hover:shadow-[0_4px_15px_rgba(249,115,22,0.05)] transition-all duration-300 text-[#0f172a] group"
                >
                  <div className="p-2 bg-[#f8fafc] rounded-xl group-hover:bg-orange-50 transition-colors">
                    <link.icon className="w-5 h-5 text-[#64748b] group-hover:text-[#f97316] transition-colors" />
                  </div>
                  <span className="tracking-wide">{link.label}</span>
                </Link>
              ))}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-5 px-1">
                <LayoutGrid className="w-4 h-4 text-[#f97316]" />
                <span className="text-xs font-black text-[#0f172a] uppercase tracking-widest">
                  Categories
                </span>
              </div>
              <div className="flex flex-col gap-2.5">
                {categories?.map((cat) => (
                  <Link
                    key={cat._id}
                    href={`/product/shop?category=${cat.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="flex justify-between items-center px-5 py-3.5 rounded-2xl font-bold bg-[#f8fafc] border border-gray-50 hover:border-[#0f172a]/20 hover:bg-white hover:shadow-sm transition-all duration-300 text-[#475569] group"
                  >
                    <span className="tracking-wide group-hover:text-[#0f172a] transition-colors">
                      {cat.name}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#f97316] group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border-t border-gray-100 shrink-0 flex flex-col items-center justify-center">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] mb-1.5">
              Powered By
            </p>
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="text-2xl font-black tracking-tighter text-[#0f172a] hover:scale-105 transition-transform"
            >
              ARSHE<span className="text-[#f97316]">MART.</span>
            </Link>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

export default MobileSidebar;