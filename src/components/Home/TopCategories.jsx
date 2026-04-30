"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const TopCategories = () => {

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);




  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
        setCategories(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  const topCategories = categories.filter((cat) => cat.top === true);


    if (!mounted) return null;

  return (
    <section className="py-12 bg-[#f9fafb]">
      <div className="main-container relative">
        <h2 className="text-center text-2xl md:text-3xl font-black text-[#064e3b] mb-10">
          আমাদের সেরা ক্যাটাগরি সমূহ
        </h2>

        <div className="relative">
          <Swiper
            slidesPerView={3} // মোবাইলে ৩টি স্লাইড
            spaceBetween={12}
            navigation={true}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            modules={[Navigation, Autoplay]}
            breakpoints={{
              480: { slidesPerView: 3, spaceBetween: 12 },
              640: { slidesPerView: 4, spaceBetween: 15 },
              1024: { slidesPerView: 6, spaceBetween: 20 },
              1280: { slidesPerView: 8, spaceBetween: 25 },
            }}
            className="category-swiper !pb-5"
          >
            {topCategories.map((cat) => (
              <SwiperSlide key={cat._id}>
                <Link 
                  href={`/product/shop?category=${cat.slug}`} 
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <div className="w-full aspect-square bg-white rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 shadow-sm flex items-center justify-center p-4 md:p-6 transition-all duration-300 group-hover:shadow-md group-hover:border-[#16a34a]/30 group-hover:-translate-y-1">
                    <div className="relative w-full h-full">
                      <Image
                        src={cat.icon}
                        alt={cat.name}
                        fill
                        className="object-contain p-1 md:p-2"
                      />
                    </div>
                  </div>
                  <h3 className="mt-3 md:mt-4 text-[13px] md:text-[15px] font-bold text-[#064e3b] text-center group-hover:text-[#16a34a] transition-colors line-clamp-1 px-1">
                    {cat.name}
                  </h3>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <style jsx global>{`
        .category-swiper .swiper-button-next,
        .category-swiper .swiper-button-prev {
          background: #f97316;
          width: 35px;
          height: 35px;
          border-radius: 50%;
          color: white !important;
          transition: all 0.3s;
        }
        .category-swiper .swiper-button-next:after,
        .category-swiper .swiper-button-prev:after {
          font-size: 14px !important;
          font-weight: bold;
        }
        .category-swiper .swiper-button-next { right: -5px !important; }
        .category-swiper .swiper-button-prev { left: -5px !important; }
        .category-swiper .swiper-button-disabled {
          opacity: 0 !important;
        }
        @media (max-width: 768px) {
          .category-swiper .swiper-button-next,
          .category-swiper .swiper-button-prev { display: none; }
        }
      `}</style>
    </section>
  );
};

export default TopCategories;