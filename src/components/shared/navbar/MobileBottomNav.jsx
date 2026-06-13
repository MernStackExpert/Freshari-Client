"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, ShoppingCart, Search } from "lucide-react";
import { MOBILE_BOTTOM_LINKS } from "./navData";

const MobileBottomNav = ({
  pathname,
  cartCount,
  setIsMobileMenuOpen,
  setIsCartOpen,
  setIsSearchModalOpen,
}) => {
  const [scrollDir, setScrollDir] = useState("up");

  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    let ticking = false;

    const updateScrollDir = () => {
      const scrollY = window.pageYOffset;
      if (Math.abs(scrollY - lastScrollY) < 10) {
        ticking = false;
        return;
      }
      setScrollDir(scrollY > lastScrollY ? "down" : "up");
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-gray-100 py-2 px-6 flex justify-between items-center z-[1500] shadow-[0_-10px_30px_rgba(0,0,0,0.05)] transition-transform duration-300 ease-in-out ${
        scrollDir === "down" ? "translate-y-full" : "translate-y-0"
      }`}
    >
      {MOBILE_BOTTOM_LINKS.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.id}
            href={link.href}
            className="flex flex-col items-center gap-1 group"
          >
            <div
              className={`p-2 rounded-xl transition-colors duration-300 ${
                isActive ? "bg-[#0f172a]" : "bg-transparent"
              }`}
            >
              <link.icon
                className={`w-5 h-5 ${
                  isActive ? "text-white" : "text-[#64748b]"
                }`}
              />
            </div>
            <span
              className={`text-[10px] font-bold tracking-wide ${
                isActive ? "text-[#0f172a]" : "text-[#64748b]"
              }`}
            >
              {link.label}
            </span>
          </Link>
        );
      })}

      <button
        onClick={() => setIsMobileMenuOpen(true)}
        className="flex flex-col items-center gap-1 group"
      >
        <div className="p-2 rounded-xl bg-transparent">
          <Menu className="w-5 h-5 text-[#64748b]" />
        </div>
        <span className="text-[10px] font-bold tracking-wide text-[#64748b]">
          Menu
        </span>
      </button>

      <button
        onClick={() => setIsCartOpen(true)}
        className="flex flex-col items-center gap-1 group relative"
      >
        <div className="p-2 rounded-xl bg-transparent relative">
          <ShoppingCart className="w-5 h-5 text-[#64748b]" />
          <span className="absolute top-0 right-0 bg-[#f97316] text-white text-[9px] min-w-[16px] h-[16px] px-1 rounded-full flex items-center justify-center font-black border border-white">
            {cartCount}
          </span>
        </div>
        <span className="text-[10px] font-bold tracking-wide text-[#64748b]">
          Cart
        </span>
      </button>

      <button
        onClick={() => setIsSearchModalOpen(true)}
        className="flex flex-col items-center gap-1 group"
      >
        <div className="p-2 rounded-xl bg-transparent">
          <Search className="w-5 h-5 text-[#64748b]" />
        </div>
        <span className="text-[10px] font-bold tracking-wide text-[#64748b]">
          Search
        </span>
      </button>
    </div>
  );
};

export default MobileBottomNav;
