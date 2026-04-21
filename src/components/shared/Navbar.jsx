"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ShoppingCart,
  Menu,
  MapPin,
  X,
  ChevronRight,
  Home,
  LayoutGrid,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import CartDrawer from "../Home/CartDrawer";
import Searchbar from "./Searchbar";

const Navbar = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce(
    (total, item) => total + item.pricing.price * item.quantity,
    0,
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`,
        );
        setCategories(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
      <header className="w-full z-[999] font-sans">
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
              <div
                onClick={() => router.push("/track-order")}
                className="flex items-center gap-2 cursor-pointer text-[#064e3b] hover:text-[#16a34a] transition-colors"
              >
                <MapPin className="w-6 h-6" />
                <span className="text-[13px] font-bold">অর্ডার ট্র্যাক</span>
              </div>
              <div
                onClick={() => setIsCartOpen(true)}
                className="flex items-center gap-3 group relative cursor-pointer"
              >
                <div className="relative bg-[#f0fdf4] p-2 rounded-full group-hover:bg-[#16a34a] transition-colors">
                  <ShoppingCart className="w-5 h-5 text-[#16a34a] group-hover:text-white" />
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

        <div className="hidden md:block sticky top-0 bg-[#064e3b] shadow-xl z-[1000]">
          <div className="container mx-auto px-4">
            <ul className="flex items-center overflow-x-auto no-scrollbar">
              <li className="bg-[#16a34a] px-6 py-4 flex items-center gap-3 text-white cursor-pointer shrink-0">
                <Menu className="w-5 h-5" />
                <span className="text-[13px] font-black uppercase tracking-wider">
                  সকল ক্যাটাগরি
                </span>
              </li>
              {categories?.map((cat) => (
                <li key={cat._id}>
                  <Link
                    href={`/product/shop?category=${cat.slug}`}
                    className={`text-[14px] font-bold whitespace-nowrap px-6 py-4 transition-all inline-block border-r border-white/5 ${activeCategory === cat.slug ? "bg-[#16a34a] text-white" : "text-white/90 hover:bg-[#16a34a] hover:text-white"}`}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-[1001]">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 bg-[#f3f4f6] rounded-lg outline-none"
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
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000] md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 left-0 h-full w-[285px] bg-white z-[2001] shadow-2xl md:hidden flex flex-col"
            >
              <div className="p-5 bg-[#064e3b] flex items-center justify-between shadow-lg text-white">
                <span className="font-black text-lg uppercase tracking-widest text-xs">
                  Freshari Menu
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 bg-white/10 rounded-full outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 bg-[#f9fafb]">
                <nav className="flex flex-col gap-2">
                  <Link
                    href="/product/shop"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-5 py-4 rounded-2xl font-bold shadow-sm border ${!activeCategory ? "bg-[#16a34a] text-white" : "bg-white text-[#064e3b] border-gray-100"}`}
                  >
                    All Products
                  </Link>
                  {categories?.map((cat) => (
                    <Link
                      key={cat._id}
                      href={`/product/shop?category=${cat.slug}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-5 py-4 rounded-2xl font-bold text-[15px] shadow-sm border ${activeCategory === cat.slug ? "bg-[#16a34a] text-white border-[#16a34a]" : "bg-white text-[#064e3b] border-gray-100"}`}
                    >
                      {cat.name}
                      <ChevronRight
                        className={`w-4 h-4 ${activeCategory === cat.slug ? "text-white" : "text-[#16a34a]"}`}
                      />
                    </Link>
                  ))}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 py-2 px-6 flex items-center justify-between z-[1500] shadow-[0_-10px_40px_rgba(0,0,0,0.08)]">
        <Link href="/" className="flex flex-col items-center gap-1">
          <Home
            className={`w-6 h-6 ${router.pathname === "/" ? "text-[#16a34a]" : "text-gray-400"}`}
          />
          <span
            className={`text-[10px] font-black uppercase ${router.pathname === "/" ? "text-[#16a34a]" : "text-gray-400"}`}
          >
            Home
          </span>
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex flex-col items-center gap-1 text-gray-400 outline-none"
        >
          <Menu className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase">Menu</span>
        </button>
        <Link href="/product/shop" className="flex flex-col items-center gap-1">
          <LayoutGrid
            className={`w-6 h-6 ${activeCategory || router.pathname === "/product/shop" ? "text-[#16a34a]" : "text-gray-400"}`}
          />
          <span
            className={`text-[10px] font-black uppercase ${activeCategory || router.pathname === "/product/shop" ? "text-[#16a34a]" : "text-gray-400"}`}
          >
            Shop
          </span>
        </Link>
        <div
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center gap-1 text-gray-400 relative"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute -top-1 right-0 bg-[#16a34a] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
            {cartCount}
          </span>
          <span className="text-[10px] font-black uppercase">Cart</span>
        </div>
        <button
          onClick={() => router.push("/product/shop")}
          className="flex flex-col items-center gap-1 text-gray-400 outline-none"
        >
          <Search className="w-6 h-6" />
          <span className="text-[10px] font-black uppercase">Search</span>
        </button>
      </div>
      <CartDrawer isOpen={isCartOpen} setIsOpen={setIsCartOpen} />
    </>
  );
};

export default Navbar;
