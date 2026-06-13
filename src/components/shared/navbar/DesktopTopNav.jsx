"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { MAIN_LINKS } from "./navData";
import Searchbar from "./Searchbar";

const DesktopTopNav = ({ cartCount, totalPrice, setIsCartOpen }) => (
  <div className="hidden md:block bg-white/95 backdrop-blur-xl border-b border-gray-100 z-50 w-full overflow-hidden">
    <div className="max-w-7xl mx-auto px-4 py-4 lg:py-5 flex items-center justify-between gap-4 lg:gap-8 w-full">
      <Link href="/" className="shrink-0 transition-transform duration-300 hover:scale-105">
        <Image
          src="/arshe-mart-lg.png"
          alt="arshemart"
          width={150}
          height={50}
          priority
          className="object-contain lg:w-[180px] lg:h-[60px]"
        />
      </Link>

      <div className="flex-1 max-w-sm lg:max-w-xl xl:max-w-2xl relative z-[1000]">
        <Searchbar />
      </div>

      <div className="flex items-center gap-4 lg:gap-8 shrink-0">
        <div className="hidden lg:flex items-center gap-6">
          {MAIN_LINKS.map((link) => (
            <Link key={link.id} href={link.href}>
              <div className="group flex items-center gap-2 cursor-pointer relative py-2">
                <link.icon className="w-5 h-5 text-[#475569] group-hover:text-[#0f172a] transition-colors duration-300" />
                <span className="text-[14px] font-bold text-[#475569] group-hover:text-[#0f172a] tracking-wide transition-colors duration-300">
                  {link.label}
                </span>
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#0f172a] transition-all duration-300 ease-out group-hover:w-full rounded-full"></span>
              </div>
            </Link>
          ))}
        </div>

        <div className="hidden lg:block w-[1px] h-8 bg-gray-200"></div>

        <div
          onClick={() => setIsCartOpen(true)}
          className="group flex items-center gap-3 lg:gap-4 cursor-pointer p-2 rounded-2xl hover:bg-gray-50 transition-all duration-300"
        >
          <div className="relative bg-[#f8fafc] group-hover:bg-white p-2.5 lg:p-3 rounded-xl border border-gray-100 shadow-sm transition-all duration-300">
            <ShoppingCart className="w-5 h-5 text-[#0f172a]" />
            <span className="absolute -top-2 -right-2 bg-[#f97316] text-white text-[11px] min-w-[22px] h-[22px] px-1 rounded-full flex items-center justify-center font-black shadow-md border-2 border-white transform group-hover:scale-110 transition-transform duration-300">
              {cartCount}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] lg:text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Your Cart
            </span>
            <span className="text-[13px] lg:text-[15px] font-black text-[#0f172a] whitespace-nowrap">
              ৳ {totalPrice.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default DesktopTopNav;