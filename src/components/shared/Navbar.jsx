"use client";
import React, { useState, useEffect, Suspense } from "react";
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

const MAIN_LINKS = [
  { id: 1, label: "Home", href: "/", icon: House },
  { id: 2, label: "About", href: "/about", icon: Info },
  { id: 3, label: "Support", href: "/support", icon: Headset },
];

const MOBILE_BOTTOM_LINKS = [
  { id: 1, label: "Home", href: "/", icon: Home },
  { id: 2, label: "Shop", href: "/product/shop", icon: LayoutGrid },
];

const useScrollDirection = () => {
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

  return scrollDir;
};

const DesktopTopNav = ({ cartCount, totalPrice, setIsCartOpen }) => (
  <div className="hidden md:block bg-white/80 backdrop-blur-xl border-b border-gray-100 z-50">
    <div className="main-container py-5 flex items-center justify-between gap-12">
      <Link
        href="/"
        className="shrink-0 transition-transform duration-300 hover:scale-105"
      >
        <Image
          src="/freshari.png"
          alt="Arshe-Mart"
          width={180}
          height={60}
          priority
          className="object-contain"
        />
      </Link>

      <div className="flex-1 max-w-2xl">
        <Searchbar />
      </div>

      <div className="flex items-center gap-10 shrink-0">
        <div className="flex items-center gap-8">
          {MAIN_LINKS.map((link) => (
            <Link key={link.id} href={link.href}>
              <div className="group flex items-center gap-2 cursor-pointer relative py-2">
                <link.icon className="w-5 h-5 text-[#064e3b] group-hover:text-[#16a34a] transition-colors duration-300" />
                <span className="text-[14px] font-black text-[#064e3b] group-hover:text-[#16a34a] tracking-wide transition-colors duration-300">
                  {link.label}
                </span>
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#16a34a] transition-all duration-300 ease-out group-hover:w-full rounded-full"></span>
              </div>
            </Link>
          ))}
        </div>

        <div className="w-[1px] h-8 bg-gray-200"></div>

        <div
          onClick={() => setIsCartOpen(true)}
          className="group flex items-center gap-4 cursor-pointer p-2 rounded-2xl hover:bg-[#f0fdf4] transition-all duration-300"
        >
          <div className="relative bg-[#f0fdf4] group-hover:bg-white p-3 rounded-xl shadow-sm transition-colors duration-300">
            <ShoppingCart className="w-5 h-5 text-[#16a34a]" />
            <span className="absolute -top-2 -right-2 bg-[#f97316] text-white text-[11px] min-w-[22px] h-[22px] px-1 rounded-full flex items-center justify-center font-black shadow-md border-2 border-white transform group-hover:scale-110 transition-transform duration-300">
              {cartCount}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Your Cart
            </span>
            <span className="text-[15px] font-black text-[#064e3b]">
              ৳ {totalPrice.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const DesktopCategoryNav = ({
  categories,
  cartCount,
  totalPrice,
  setIsCartOpen,
}) => {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="hidden md:block sticky top-0 z-[1000] w-full bg-[#064e3b] shadow-lg">
      <div className="main-container mx-auto px-4 flex items-center justify-between gap-4">
        <div className="flex-grow overflow-x-auto no-scrollbar">
          <ul className="flex items-center gap-2 py-2">
            {categories?.map((cat) => {
              const isActive = activeCategory === cat.slug;
              return (
                <li key={cat._id} className="shrink-0">
                  <Link
                    href={`/product/shop?category=${cat.slug}`}
                    className={`relative text-[14px] font-bold px-6 py-3 rounded-xl inline-block transition-all duration-300 overflow-hidden group ${
                      isActive
                        ? "text-[#064e3b] bg-[#f0fdf4] shadow-md"
                        : "text-white/90 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <span className="relative z-10">{cat.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {isSticky && (
          <div
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-3 cursor-pointer p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 shrink-0 text-white animate-in fade-in slide-in-from-right-4 duration-300"
          >
            <div className="relative bg-[#f0fdf4] p-2 rounded-lg shadow-sm">
              <ShoppingCart className="w-4 h-4 text-[#16a34a]" />
              <span className="absolute -top-1.5 -right-1.5 bg-[#f97316] text-white text-[9px] min-w-[16px] h-[16px] px-0.5 rounded-full flex items-center justify-center font-black border border-white">
                {cartCount}
              </span>
            </div>
            <span className="text-[13px] font-black whitespace-nowrap">
              ৳ {totalPrice.toLocaleString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const MobileTopNav = ({ cartCount, setIsMobileMenuOpen, setIsCartOpen }) => (
  <div className="md:hidden fixed top-0 left-0 w-full flex items-center justify-between px-4 py-3 bg-white/90 backdrop-blur-lg border-b border-gray-100 z-50 shadow-sm">
    <button
      onClick={() => setIsMobileMenuOpen(true)}
      className="p-2.5 bg-[#f9fafa] hover:bg-[#f0fdf4] rounded-xl transition-colors"
    >
      <Menu className="w-6 h-6 text-[#064e3b]" />
    </button>

    <Link href="/">
      <Image
        src="/freshari.png"
        alt="Logo"
        width={130}
        height={40}
        className="object-contain"
      />
    </Link>

    <button
      onClick={() => setIsCartOpen(true)}
      className="relative p-2.5 bg-[#f0fdf4] rounded-xl transition-transform active:scale-95"
    >
      <ShoppingCart className="w-6 h-6 text-[#16a34a]" />
      <span className="absolute -top-1.5 -right-1.5 bg-[#f97316] text-white text-[10px] min-w-[20px] h-[20px] px-1 rounded-full flex items-center justify-center font-black border-2 border-white">
        {cartCount}
      </span>
    </button>
  </div>
);

const MobileBottomNav = ({
  pathname,
  cartCount,
  setIsMobileMenuOpen,
  setIsCartOpen,
}) => {
  const scrollDirection = useScrollDirection();
  const router = useRouter();

  return (
    <div
      className={`md:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-lg border-t border-gray-100 py-3 px-6 flex justify-between items-center z-[1500] shadow-[0_-5px_20px_rgba(0,0,0,0.05)] transition-transform duration-300 ease-in-out ${
        scrollDirection === "down" ? "translate-y-full" : "translate-y-0"
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
              className={`p-2 rounded-xl transition-colors duration-300 ${isActive ? "bg-[#f0fdf4]" : "group-hover:bg-gray-50"}`}
            >
              <link.icon
                className={`w-6 h-6 ${isActive ? "text-[#16a34a]" : "text-gray-400"}`}
              />
            </div>
            <span
              className={`text-[10px] font-black tracking-wide ${isActive ? "text-[#16a34a]" : "text-gray-400"}`}
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
        <div className="p-2 rounded-xl group-hover:bg-gray-50 transition-colors duration-300">
          <Menu className="w-6 h-6 text-gray-400" />
        </div>
        <span className="text-[10px] font-black tracking-wide text-gray-400">
          Menu
        </span>
      </button>

      <button
        onClick={() => setIsCartOpen(true)}
        className="flex flex-col items-center gap-1 group relative"
      >
        <div className="p-2 rounded-xl group-hover:bg-gray-50 transition-colors duration-300 relative">
          <ShoppingCart className="w-6 h-6 text-gray-400" />
          <span className="absolute top-1 right-1 bg-[#f97316] text-white text-[9px] min-w-[16px] h-[16px] px-1 rounded-full flex items-center justify-center font-black">
            {cartCount}
          </span>
        </div>
        <span className="text-[10px] font-black tracking-wide text-gray-400">
          Cart
        </span>
      </button>

      <button
        onClick={() => router.push("/product/shop")}
        className="flex flex-col items-center gap-1 group"
      >
        <div className="p-2 rounded-xl group-hover:bg-gray-50 transition-colors duration-300">
          <Search className="w-6 h-6 text-gray-400" />
        </div>
        <span className="text-[10px] font-black tracking-wide text-gray-400">
          Search
        </span>
      </button>
    </div>
  );
};

const MobileSidebar = ({ isOpen, setIsOpen, categories }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-[#064e3b]/40 backdrop-blur-sm z-[2000]"
        />
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed top-0 left-0 h-full w-[300px] bg-[#fcfdfd] z-[2001] flex flex-col shadow-2xl"
        >
          <div className="p-6 bg-[#064e3b] flex justify-between items-center text-white">
            <span className="font-black text-lg tracking-wide">Menu</span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 flex flex-col gap-3 overflow-y-auto no-scrollbar pb-24">
            {MAIN_LINKS.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-5 py-4 rounded-2xl font-bold bg-white border border-gray-100 shadow-sm hover:border-[#16a34a]/30 hover:shadow-md transition-all text-[#064e3b]"
              >
                <link.icon className="w-5 h-5 text-[#16a34a]" />
                {link.label}
              </Link>
            ))}

            <Link
              href="/product/shop"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-5 py-4 mt-4 rounded-2xl font-black bg-gradient-to-r from-[#16a34a] to-[#14823b] text-white shadow-lg shadow-[#16a34a]/20"
            >
              <LayoutGrid className="w-5 h-5" />
              All Products
            </Link>

            <div className="mt-4">
              <span className="text-xs font-black text-gray-400 uppercase tracking-widest px-2 mb-3 block">
                Categories
              </span>
              <div className="flex flex-col gap-2">
                {categories?.map((cat) => (
                  <Link
                    key={cat._id}
                    href={`/product/shop?category=${cat.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="flex justify-between items-center px-5 py-3.5 rounded-2xl font-bold bg-white border border-gray-100 hover:border-[#16a34a]/30 hover:bg-[#f0fdf4] transition-all text-gray-700 group"
                  >
                    {cat.name}
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#16a34a] transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

const NavbarContent = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { cart } = useCart();
  const pathname = usePathname();

  const cartCount = cart.reduce((t, i) => t + i.quantity, 0);
  const totalPrice = cart.reduce((t, i) => t + i.pricing.price * i.quantity, 0);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`,
        );
        setCategories(res.data);
      } catch (e) {}
    };
    fetchCategories();
  }, []);

  return (
    <>
      <header className="w-full font-sans relative z-50">
        <DesktopTopNav
          cartCount={cartCount}
          totalPrice={totalPrice}
          setIsCartOpen={setIsCartOpen}
        />
        <MobileTopNav
          cartCount={cartCount}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
          setIsCartOpen={setIsCartOpen}
        />
        <div className="md:hidden h-[65px] w-full"></div>
      </header>

      <DesktopCategoryNav
        categories={categories}
        cartCount={cartCount}
        totalPrice={totalPrice}
        setIsCartOpen={setIsCartOpen}
      />

      <MobileSidebar
        isOpen={isMobileMenuOpen}
        setIsOpen={setIsMobileMenuOpen}
        categories={categories}
      />
      <MobileBottomNav
        pathname={pathname}
        cartCount={cartCount}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        setIsCartOpen={setIsCartOpen}
      />
      <CartDrawer isOpen={isCartOpen} setIsOpen={setIsCartOpen} />
    </>
  );
};

const Navbar = () => {
  return (
    <Suspense
      fallback={
        <div className="w-full h-20 bg-white border-b border-gray-100"></div>
      }
    >
      <NavbarContent />
    </Suspense>
  );
};

export default Navbar;
