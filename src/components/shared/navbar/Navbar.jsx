"use client";
import React, { useState, useEffect, Suspense } from "react";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import DesktopTopNav from "./DesktopTopNav";
import DesktopCategoryNav from "./DesktopCategoryNav";
import MobileTopNav from "./MobileTopNav";
import MobileBottomNav from "./MobileBottomNav";
import MobileSidebar from "./MobileSidebar";
import MobileSearchModal from "./MobileSearchModal";
import CartDrawer from "@/components/Home/CartDrawer";

const NavbarContent = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const { cart } = useCart();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = mounted ? cart?.reduce((t, i) => t + (i.quantity || 1), 0) || 0 : 0;
  const totalPrice = mounted ? cart?.reduce((t, i) => t + (i.pricing?.price || 0) * (i.quantity || 1), 0) || 0 : 0;

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchModalOpen(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
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
      
      <MobileSearchModal 
        isOpen={isSearchModalOpen} 
        setIsOpen={setIsSearchModalOpen} 
      />

      <MobileBottomNav
        pathname={pathname}
        cartCount={cartCount}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        setIsCartOpen={setIsCartOpen}
        setIsSearchModalOpen={setIsSearchModalOpen}
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