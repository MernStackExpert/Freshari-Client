"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Hero = () => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/banners`,
        );
        setBanners(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBanners();
  }, []);

  const sliderBanners = banners.filter((b) => !b.isRight);
  const rightBanner = banners.find((b) => b.isRight); 

  return (
    <div className="w-full flex flex-col">
      <div className="w-full bg-gradient-to-r from-[#e2e8f0] via-[#ffffff] to-[#e2e8f0] border-b border-gray-200 py-2 flex items-center justify-center gap-3 md:gap-10 shadow-[0_2px_10px_rgba(0,0,0,0.02)] z-10 overflow-hidden px-2">
        <span className="text-[9px] md:text-[11px] font-black tracking-[0.2em] md:tracking-[0.3em] text-[#475569] uppercase whitespace-nowrap">
          Our Pride. Our Bangladesh.
        </span>

        <div className="relative w-8 h-5 rounded-[2px] shadow-[0_2px_5px_rgba(0,0,0,0.1)] overflow-hidden shrink-0 border border-black/10">
          <div className="absolute inset-0 bg-[#006a4e]"></div>
          <div className="absolute top-1/2 left-[45%] -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-[#f42a41] rounded-full"></div>
        </div>

        <span className="text-[10px] md:text-[13px] font-black text-[#475569] whitespace-nowrap">
          আমাদের গর্ব. আমাদের বাংলাদেশ.
        </span>
      </div>

      <section className="py-6 bg-[#f8fafc]">
        <div className="main-container">
          <div className="flex flex-col lg:flex-row gap-5 h-full min-h-[300px] lg:h-[450px]">
            <div className="w-full lg:w-[70%] h-[250px] md:h-[350px] lg:h-full rounded-3xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-white">
              <Swiper
                spaceBetween={0}
                centeredSlides={true}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                  dynamicBullets: true,
                }}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper h-full w-full"
              >
                {sliderBanners.map((banner) => (
                  <SwiperSlide key={banner._id}>
                    <Link
                      href={banner.link}
                      className="relative block w-full h-full group"
                    >
                      <Image
                        src={banner.imageUrl}
                        alt={banner.title}
                        fill
                        priority
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 bg-gradient-to-r from-black/40 to-transparent">
                        <motion.h2
                          initial={{ opacity: 0, x: -30 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          className="text-white text-2xl md:text-4xl lg:text-5xl font-black max-w-lg leading-[1.2] drop-shadow-lg"
                        >
                          {banner.title}
                        </motion.h2>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className="hidden lg:block lg:w-[30%] h-full">
              {rightBanner && (
                <Link
                  href={rightBanner.link}
                  className="relative block w-full h-full rounded-3xl overflow-hidden border border-white shadow-[0_10px_40px_rgba(0,0,0,0.05)] group bg-white"
                >
                  <Image
                    src={rightBanner.imageUrl}
                    alt={rightBanner.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-[#0f172a]/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 w-full p-8 transition-transform duration-500 group-hover:-translate-y-2">
                    <span className="inline-block px-3 py-1 bg-[#f97316] text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-3 shadow-lg">
                      Limited Offer
                    </span>
                    <h3 className="text-white text-2xl font-black leading-tight drop-shadow-md">
                      {rightBanner.title}
                    </h3>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
