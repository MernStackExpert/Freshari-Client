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
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`,
        );
        setCategories(data || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  if (!mounted) return null;

  const topCategories = categories.filter((cat) => cat.top === true);

  return (
    <section className="py-12 bg-[#f8fafc]">
      <div className="main-container relative">
        <h2 className="text-center text-2xl md:text-3xl font-black text-[#0f172a] mb-10 uppercase tracking-widest">
          আমাদের সেরা ক্যাটাগরি সমূহ
        </h2>

        <div className="relative px-2 md:px-6">
          <Swiper
            slidesPerView={3}
            spaceBetween={12}
            navigation={true}
            loop={true}
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
            className="category-swiper !pb-5 !px-2"
          >
            {topCategories.map((cat, index) => {
              const imageUrl = cat.icon || cat.image || "/fallback-image.png";

              return (
                <SwiperSlide key={cat._id || index}>
                  <Link
                    href={`/product/shop?category=${cat.slug}`}
                    className="flex flex-col items-center group cursor-pointer"
                  >
                    <div className="w-full aspect-square bg-white rounded-full md:rounded-[2rem] border border-gray-100 shadow-[0_4px_15px_rgba(0,0,0,0.03)] flex items-center justify-center p-5 md:p-8 transition-all duration-300 group-hover:shadow-[0_10px_25px_rgba(15,23,42,0.08)] group-hover:border-[#0f172a]/20 group-hover:-translate-y-2 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                      <div className="relative w-full h-full z-10">
                        {imageUrl && imageUrl !== "" ? (
                          <Image
                            src={imageUrl}
                            alt={cat.name || "Category"}
                            fill
                            className="object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-sm"
                            sizes="(max-width: 768px) 100px, 150px"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-50 rounded-full flex items-center justify-center">
                            <span className="text-gray-300 text-[10px] font-bold">
                              No Image
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <h3 className="mt-4 md:mt-5 text-[12px] md:text-[14px] font-black text-[#475569] text-center group-hover:text-[#f97316] transition-colors line-clamp-1 px-2 tracking-wide">
                      {cat.name}
                    </h3>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>

      <style jsx global>{`
        .category-swiper .swiper-button-next,
        .category-swiper .swiper-button-prev {
          background: #0f172a;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          color: white !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 10px rgba(15, 23, 42, 0.3);
        }

        .category-swiper .swiper-button-next:hover,
        .category-swiper .swiper-button-prev:hover {
          background: #f97316;
          transform: scale(1.1);
          box-shadow: 0 6px 15px rgba(249, 115, 22, 0.4);
        }

        .category-swiper .swiper-button-next:after,
        .category-swiper .swiper-button-prev:after {
          font-size: 14px !important;
          font-weight: 900;
        }

        .category-swiper .swiper-button-next {
          right: 0px !important;
        }
        .category-swiper .swiper-button-prev {
          left: 0px !important;
        }

        .category-swiper .swiper-button-disabled {
          opacity: 0 !important;
          pointer-events: none;
        }

        @media (max-width: 768px) {
          .category-swiper .swiper-button-next,
          .category-swiper .swiper-button-prev {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default TopCategories;
