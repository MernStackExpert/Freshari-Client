"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  ChevronRight,
  Home,
  LayoutGrid,
  Info,
  Headset,
  House,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import CartDrawer from "../Home/CartDrawer";
import Searchbar from "./Searchbar";

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  const cartCount = cart.reduce((t, i) => t + i.quantity, 0);
  const totalPrice = cart.reduce(
    (t, i) => t + i.pricing.price * i.quantity,
    0
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`
        );
        setCategories(res.data);
      } catch (e) {}
    };
    fetchCategories();
  }, []);

  return (
    <>
      <header className="w-full font-sans">
        <div className="hidden md:block bg-white border-b border-gray-100">
          <div className="main-container py-4 flex items-center justify-between gap-10">
            <Link href="/" className="shrink-0">
              <Image
                src="/freshari.png"
                alt="Freshari"
                width={170}
                height={55}
                priority
                className="object-contain"
              />
            </Link>

            <Searchbar />

            <div className="flex items-center gap-8 shrink-0">
              <Link href="/">
                <div className="flex items-center gap-2 cursor-pointer text-[#064e3b] hover:text-[#16a34a]">
                  <House className="w-5 h-5" />
                  <span className="text-[13px] font-bold">Home</span>
                </div>
              </Link>
              <Link href="/about">
                <div className="flex items-center gap-2 cursor-pointer text-[#064e3b] hover:text-[#16a34a]">
                  <Info className="w-5 h-5" />
                  <span className="text-[13px] font-bold">About</span>
                </div>
              </Link>
              <Link href="/support">
                <div className="flex items-center gap-2 cursor-pointer text-[#064e3b] hover:text-[#16a34a]">
                  <Headset className="w-5 h-5" />
                  <span className="text-[13px] font-bold">Support</span>
                </div>
              </Link>

              <div
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-3 cursor-pointer"
              >
                <div className="relative bg-[#f0fdf4] p-2 rounded-full">
                  <ShoppingCart className="w-5 h-5 text-[#16a34a]" />
                  <span className="absolute -top-1.5 -right-1.5 bg-[#16a34a] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black border-2 border-white">
                    {cartCount}
                  </span>
                </div>
                <span className="text-[14px] font-black text-[#064e3b]">
                  ৳ {totalPrice.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:block bg-[#1a8f70d2] shadow-xl">
          <div className="main-container mx-auto px-4">
            <ul className="flex items-center overflow-x-auto no-scrollbar">
              {categories?.map((cat) => (
                <li key={cat._id}>
                  <Link
                    href={`/product/shop?category=${cat.slug}`}
                    className={`text-[14px] font-bold whitespace-nowrap px-6 py-4 inline-block ${
                      activeCategory === cat.slug
                        ? "bg-[#16a34a] text-white"
                        : "text-white/90 hover:bg-[#458c5f]"
                    }`}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 bg-[#f3f4f6] rounded-lg"
          >
            <Menu className="w-6 h-6 text-[#064e3b]" />
          </button>

          <Link href="/">
            <Image src="/freshari.png" alt="Logo" width={110} height={35} />
          </Link>

          <div
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 bg-[#f0fdf4] rounded-full"
          >
            <ShoppingCart className="w-6 h-6 text-[#16a34a]" />
            <span className="absolute -top-1 -right-1 bg-[#16a34a] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {cartCount}
            </span>
          </div>
        </div>
      </header>


      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 z-[2000]"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3 }}
              className="fixed top-0 left-0 h-full w-[280px] bg-white z-[2001] flex flex-col"
            >
              <div className="p-5 bg-[#064e3b] flex justify-between text-white">
                <span className="font-black text-sm">Freshari</span>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X />
                </button>
              </div>

              <div className="p-4 flex flex-col gap-2">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl font-bold bg-[#16a34a] text-white">
                  Home
                </Link>
                <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl font-bold bg-white border">
                  About
                </Link>
                <Link href="/support" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-xl font-bold bg-white border">
                  Support
                </Link>

                <Link
                  href="/product/shop"
                  className="px-4 py-3 rounded-xl font-bold bg-white border"
                >
                  All Products
                </Link>

                {categories?.map((cat) => (
                  <Link
                    key={cat._id}
                    href={`/product/shop?category=${cat.slug}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex justify-between px-4 py-3 rounded-xl font-bold bg-white border"
                  >
                    {cat.name}
                    <ChevronRight />
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t py-2 px-6 flex justify-between z-[1500]">
        <Link href="/" className="flex flex-col items-center">
          <Home className={`w-6 h-6 ${pathname === "/" ? "text-[#16a34a]" : "text-gray-400"}`} />
          <span className="text-[10px] font-bold">Home</span>
        </Link>

        <button onClick={() => setIsMobileMenuOpen(true)} className="flex flex-col items-center">
          <Menu className="w-6 h-6 text-gray-400" />
          <span className="text-[10px] font-bold">Menu</span>
        </button>

        <Link href="/product/shop" className="flex flex-col items-center">
          <LayoutGrid className="w-6 h-6 text-gray-400" />
          <span className="text-[10px] font-bold">Shop</span>
        </Link>

        <div onClick={() => setIsCartOpen(true)} className="flex flex-col items-center relative">
          <ShoppingCart className="w-6 h-6 text-gray-400" />
          <span className="absolute -top-1 right-0 bg-[#16a34a] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
            {cartCount}
          </span>
          <span className="text-[10px] font-bold">Cart</span>
        </div>

        <button onClick={() => router.push("/product/shop")} className="flex flex-col items-center">
          <Search className="w-6 h-6 text-gray-400" />
          <span className="text-[10px] font-bold">Search</span>
        </button>
      </div>

      <CartDrawer isOpen={isCartOpen} setIsOpen={setIsCartOpen} />
    </>
  );
};

export default Navbar;