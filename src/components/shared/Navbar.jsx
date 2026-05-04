"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { Truck, Search, User, ShoppingCart, ChevronDown, Home, LayoutGrid, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const pathname = usePathname();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  const navLinks = [
    { title: "Home", url: "/" },
    { title: "Shop", url: "/shop" },
    { title: "Categories", url: "/categories", isDropdown: true },
    { title: "About Us", url: "/about" },
    { title: "Blog", url: "/blog" },
    { title: "Contact", url: "/contact" },
  ];

  return (
    <>
      <header className="w-full sticky top-0 z-50 shadow-sm bg-white">
        <div className="bg-[#FF6000] text-white flex justify-center items-center py-2 px-4 text-xs sm:text-sm font-medium">
          <Truck className="w-4 h-4 mr-2" />
          <span>ফ্রি ডেলিভারি সারাদেশে! ১৫০০৳ এর বেশি অর্ডারে</span>
        </div>

        <div className="main-container">
          <div className="flex justify-between items-center py-4">
            
            <div className="flex items-center gap-3">
              <button
                className="md:hidden text-gray-800 hover:text-[#FF6000] transition-colors"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <Link href="/" className="flex-shrink-0">
                <Image
                  src="/astha-logo.png"
                  alt="Aastha Shop Logo"
                  width={160}
                  height={45}
                  className="h-8 md:h-10 w-auto"
                  priority
                />
              </Link>
            </div>

            <nav className="hidden md:flex space-x-6 lg:space-x-8 items-center font-semibold text-sm lg:text-base">
              {navLinks.map((link, index) => {
                const isActive = pathname === link.url;
                return (
                  <div key={index}>
                    {link.isDropdown ? (
                      <div className="relative group flex items-center cursor-pointer hover:text-[#FF6000] transition-colors h-10">
                        <span className={pathname.includes(link.url) ? "text-[#FF6000]" : "text-gray-800"}>
                          {link.title}
                        </span>
                        <ChevronDown className={`w-4 h-4 ml-1 ${pathname.includes(link.url) ? "text-[#FF6000]" : "text-gray-800"} group-hover:text-[#FF6000]`} />
                        
                        <div className="absolute top-full left-0 bg-white shadow-lg rounded-md w-56 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 border border-gray-100">
                          {categories.length > 0 ? (
                            categories.map((cat) => (
                              <Link
                                key={cat._id}
                                href={`/categories/${cat.slug}`}
                                className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#FF6000] transition-colors"
                              >
                                {cat.name}
                              </Link>
                            ))
                          ) : (
                            <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={link.url}
                        className={`transition-colors h-10 flex items-center ${isActive ? "text-[#FF6000]" : "text-gray-800 hover:text-[#FF6000]"}`}
                      >
                        {link.title}
                      </Link>
                    )}
                  </div>
                );
              })}
            </nav>

            <div className="flex items-center space-x-5 text-gray-800">
              <button className="hover:text-[#FF6000] transition-colors hidden sm:block">
                <Search className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <button className="hover:text-[#FF6000] transition-colors hidden sm:block">
                <User className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <Link href="/cart" className="relative transition-colors">
                <ShoppingCart className={`w-6 h-6 md:w-7 md:h-7 ${pathname === "/cart" ? "text-[#FF6000]" : "hover:text-[#FF6000]"}`} />
                <span className="absolute -top-2 -right-2 bg-[#FF6000] text-white text-[10px] md:text-xs font-bold px-1.5 py-0.5 rounded-full border border-white">
                  1
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[60] bg-[#ffffff7b] backdrop-blur-sm transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsSidebarOpen(false)}
      ></div>

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white z-[70] transform transition-transform duration-300 flex flex-col shadow-2xl ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <Image
            src="/astha-logo.png"
            alt="Aastha Shop Logo"
            width={120}
            height={35}
            className="h-8 w-auto"
          />
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-gray-600 hover:text-[#FF6000] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex flex-col p-4 space-y-4 font-medium">
          {navLinks.map((link, index) => {
            const isActive = pathname === link.url;
            return (
              <Link
                key={index}
                href={link.url}
                className={`transition-colors ${isActive ? "text-[#FF6000]" : "text-gray-800 hover:text-[#FF6000]"}`}
                onClick={() => setIsSidebarOpen(false)}
              >
                {link.title}
              </Link>
            );
          })}
        </div>
      </div>

      <div
        className={`fixed inset-0 z-[75] bg-[#ffffff7b] backdrop-blur-sm transition-opacity duration-300 ${
          isCategoryModalOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsCategoryModalOpen(false)}
      ></div>

      <div
        className={`fixed top-0 left-0 right-0 bg-white z-[80] transform transition-transform duration-300 rounded-b-2xl shadow-xl border-b border-gray-100 ${
          isCategoryModalOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <span className="font-bold text-gray-800">All Categories</span>
          <button
            onClick={() => setIsCategoryModalOpen(false)}
            className="text-gray-600 hover:text-[#FF6000] bg-gray-50 rounded-full p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/categories/${cat.slug}`}
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-[#FF6000]/10 hover:text-[#FF6000] transition-colors border border-transparent hover:border-[#FF6000]/20"
                >
                  <span className="text-sm font-medium">{cat.name}</span>
                </Link>
              ))
            ) : (
              <div className="col-span-2 text-center text-sm text-gray-500 py-4">Loading categories...</div>
            )}
          </div>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-50 border-t border-gray-100 pb-safe">
        <div className="flex justify-around items-center py-3">
          <Link href="/" className={`flex flex-col items-center transition-colors ${pathname === "/" ? "text-[#FF6000]" : "text-gray-600 hover:text-[#FF6000]"}`}>
            <Home className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-semibold">Home</span>
          </Link>
          <Link href="/shop" className={`flex flex-col items-center transition-colors ${pathname === "/shop" ? "text-[#FF6000]" : "text-gray-600 hover:text-[#FF6000]"}`}>
            <LayoutGrid className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-semibold">Shop</span>
          </Link>
          <button 
            onClick={() => setIsCategoryModalOpen(true)}
            className={`flex flex-col items-center transition-colors ${isCategoryModalOpen || pathname.includes("/categories") ? "text-[#FF6000]" : "text-gray-600 hover:text-[#FF6000]"}`}
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-semibold">Categories</span>
          </button>
          <button className={`flex flex-col items-center transition-colors ${pathname === "/search" ? "text-[#FF6000]" : "text-gray-600 hover:text-[#FF6000]"}`}>
            <Search className="w-5 h-5" />
            <span className="text-[10px] mt-1 font-semibold">Search</span>
          </button>
        </div>
      </div>
    </>
  );
}