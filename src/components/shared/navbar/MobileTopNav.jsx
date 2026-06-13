"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, ShoppingCart } from "lucide-react";

const MobileTopNav = ({ cartCount, setIsMobileMenuOpen, setIsCartOpen }) => (
  <div className="md:hidden fixed top-0 left-0 w-full flex items-center justify-between px-4 py-3 bg-white/95 backdrop-blur-md border-b border-gray-100 z-50 shadow-sm">
    <button
      onClick={() => setIsMobileMenuOpen(true)}
      className="p-2.5 bg-[#f8fafc] hover:bg-gray-100 rounded-xl transition-colors border border-gray-100"
    >
      <Menu className="w-5 h-5 text-[#0f172a]" />
    </button>

    <Link href="/">
      <Image
        src="/arshemart-mainlogo.png"
        alt="Logo"
        width={120}
        height={36}
        className="object-contain"
      />
    </Link>

    <button
      onClick={() => setIsCartOpen(true)}
      className="relative p-2.5 bg-[#f8fafc] border border-gray-100 rounded-xl transition-transform active:scale-95"
    >
      <ShoppingCart className="w-5 h-5 text-[#0f172a]" />
      <span className="absolute -top-1.5 -right-1.5 bg-[#f97316] text-white text-[10px] min-w-[20px] h-[20px] px-1 rounded-full flex items-center justify-center font-black border-2 border-white shadow-sm">
        {cartCount}
      </span>
    </button>
  </div>
);

export default MobileTopNav;
