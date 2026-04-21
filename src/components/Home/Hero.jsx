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
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/banners`);
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
    <section className="py-6 bg-[#f9fafb]">
      <div className="main-container">
        <div className="flex flex-col lg:flex-row gap-4 h-full min-h-[300px] lg:h-[420px]">
          
          <div className="w-full lg:w-[70%] h-[250px] md:h-[350px] lg:h-full rounded-2xl overflow-hidden shadow-sm border border-gray-100">
            <Swiper
              spaceBetween={0}
              centeredSlides={true}
              autoplay={{
                delay: 4000,
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
                  <Link href={banner.link} className="relative block w-full h-full group">
                    <Image
                      src={banner.imageUrl}
                      alt={banner.title}
                      fill
                      priority
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex flex-col justify-center px-8 md:px-16">
                      <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-white text-xl md:text-3xl lg:text-4xl font-black max-w-md leading-tight"
                      >
                        {banner.title}
                      </motion.h2>
                      <div className="mt-6">
                        <span className="bg-[#16a34a] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-[#15803d] transition-all inline-block">
                          অর্ডার করুন
                        </span>
                      </div>
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
                className="relative block w-full h-full rounded-2xl overflow-hidden border border-gray-100 shadow-sm group"
              >
                <Image
                  src={rightBanner.imageUrl}
                  alt={rightBanner.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-white text-lg font-bold leading-snug">
                    {rightBanner.title}
                  </h3>
                  <p className="text-[#16a34a] text-sm font-black mt-2">সীমিত সময়ের অফার!</p>
                </div>
              </Link>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;