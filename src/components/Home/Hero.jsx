"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Hero = () => {
  const [banners, setBanners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/banners`);
        setBanners(res.data);
      } catch (error) {
        console.error("Failed to fetch banners", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBanners();
  }, []);

  const sliderBanners = banners.filter((b) => !b.isRight);
  const rightBanner = banners.find((b) => b.isRight);

  if (isLoading) {
    return (
      <section className="py-4 md:py-6 bg-[#f9fafb]">
        <div className="w-full lg:max-w-[1440px] mx-auto lg:px-6 px-0">
          <div className="flex flex-col lg:flex-row gap-4 lg:h-[420px]">
            <div className="w-full lg:w-[70%] h-[200px] sm:h-[300px] md:h-[350px] lg:h-full lg:rounded-2xl bg-gray-200 animate-pulse"></div>
            <div className="hidden lg:block lg:w-[30%] h-full rounded-2xl bg-gray-200 animate-pulse"></div>
          </div>
        </div>
      </section>
    );
  }

  if (banners.length === 0) return null;

  return (
    <section className="py-4 md:py-6 bg-[#f9fafb]">
      <div className="w-full lg:max-w-[1440px] mx-auto lg:px-6 px-0">
        <div className="flex flex-col lg:flex-row gap-4 lg:h-[420px]">
          
          <div className="w-full lg:w-[70%] h-auto sm:h-[300px] md:h-[350px] lg:h-full lg:rounded-2xl overflow-hidden bg-white shadow-sm lg:border border-gray-100 z-0">
            {sliderBanners.length > 0 ? (
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
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper h-full w-full"
              >
                {sliderBanners.map((banner) => (
                  <SwiperSlide key={banner._id}>
                    <Link href={banner.link || "#"} className="block w-full h-full">
                      <Image
                        src={banner.imageUrl}
                        alt={banner.title || "Banner"}
                        width={1200}
                        height={600}
                        priority
                        className="w-full h-auto lg:h-full object-contain sm:object-cover"
                      />
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
               <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                 <p className="text-gray-500">No slider banners available</p>
               </div>
            )}
          </div>

          <div className="hidden lg:block lg:w-[30%] h-full z-0">
            {rightBanner ? (
              <Link 
                href={rightBanner.link || "#"} 
                className="block w-full h-full rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white"
              >
                <Image
                  src={rightBanner.imageUrl}
                  alt={rightBanner.title || "Right Banner"}
                  width={600}
                  height={800}
                  className="w-full h-full object-contain"
                />
              </Link>
            ) : (
               <div className="w-full h-full rounded-2xl bg-gray-100 flex items-center justify-center border border-gray-200">
                  <p className="text-gray-500 text-sm">Right Banner Slot</p>
               </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;