"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const DesktopCategoryNav = ({ categories, cartCount, totalPrice, setIsCartOpen }) => {
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
    <div
      className={`hidden md:block sticky top-0 z-40 w-full transition-all duration-300 ${
        isSticky
          ? "bg-white/95 backdrop-blur-md shadow-md border-b border-gray-100 py-1"
          : "bg-white border-b border-gray-50"
      }`}
    >
      <div className="main-container mx-auto px-4 flex items-center justify-between gap-6">
        <div className="flex-grow min-w-0 py-3 overflow-hidden">
          <Swiper
            slidesPerView="auto"
            spaceBetween={12}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            modules={[Autoplay]}
            className="w-full"
          >
            {categories?.map((cat) => {
              const isActive = activeCategory === cat.slug;
              return (
                <SwiperSlide key={cat._id} className="!w-auto">
                  <Link
                    href={`/product/shop?category=${cat.slug}`}
                    className={`relative text-[13px] font-bold px-5 py-2.5 rounded-full inline-block transition-all duration-300 ${
                      isActive
                        ? "bg-[#0f172a] text-white shadow-md shadow-slate-900/20"
                        : "bg-[#f8fafc] text-[#475569] hover:bg-gray-100 hover:text-[#0f172a] border border-gray-100"
                    }`}
                  >
                    <span className="relative z-10 tracking-wide">
                      {cat.name}
                    </span>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        <AnimatePresence>
          {isSticky && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-3 cursor-pointer pl-4 border-l border-gray-200 shrink-0 group"
            >
              <div className="relative bg-[#f8fafc] p-2.5 rounded-full shadow-sm border border-gray-100 group-hover:border-[#0f172a] transition-colors">
                <ShoppingCart className="w-4 h-4 text-[#0f172a]" />
                <span className="absolute -top-1 -right-1 bg-[#f97316] text-white text-[9px] min-w-[16px] h-[16px] px-0.5 rounded-full flex items-center justify-center font-black border border-white">
                  {cartCount}
                </span>
              </div>
              <span className="text-[14px] font-black text-[#0f172a] whitespace-nowrap">
                ৳ {totalPrice.toLocaleString()}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DesktopCategoryNav;