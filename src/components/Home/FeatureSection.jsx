"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { CheckCircle2, Truck, ShieldCheck, Headphones, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-fade";

const FeatureSection = () => {
  const [dealBanners, setDealBanners] = useState([]);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/banners`);
        const deals = res.data.filter((b) => b.isDeals === "true");
        setDealBanners(deals);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBanners();
  }, []);

  const features = [
    { title: "Best Services than others" },
    { title: "100% Organic & Natural Products" },
    { title: "100% Returns & Refunds" },
    { title: "User-Friendly Mobile Apps" },
  ];

  const infoCards = [
    {
      title: "Free Delivery",
      desc: "On all orders over ৳4999",
      icon: <Truck className="w-6 h-6 text-green-600" />,
      bg: "bg-[#f0fdf4]",
    },
    {
      title: "Safe Payment",
      desc: "100% secure payment methods",
      icon: <ShieldCheck className="w-6 h-6 text-blue-600" />,
      bg: "bg-[#eff6ff]",
    },
    {
      title: "24/7 Support",
      desc: "Dedicated support anytime",
      icon: <Headphones className="w-6 h-6 text-purple-600" />,
      bg: "bg-[#faf5ff]",
    },
    {
      title: "Easy Returns",
      desc: "30 days money back guarantee",
      icon: <RotateCcw className="w-6 h-6 text-orange-600" />,
      bg: "bg-[#fffbeb]",
    },
  ];

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="main-container">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 mb-20">
          <div className="w-full lg:w-1/2 relative">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative w-full aspect-[4/5] max-w-[450px] mx-auto overflow-hidden rounded-t-full border-[10px] border-gray-50 shadow-2xl bg-gray-100"
            >
              {dealBanners.length > 0 ? (
                <Swiper
                  modules={[Autoplay, EffectFade]}
                  effect="fade"
                  autoplay={{ delay: 3000, disableOnInteraction: false }}
                  className="h-full w-full"
                >
                  {dealBanners.map((banner) => (
                    <SwiperSlide key={banner._id}>
                      <Link href={banner.link || "#"}>
                        <Image
                          src={banner.imageUrl}
                          alt={banner.title}
                          fill
                          className="object-cover"
                        />
                      </Link>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">Loading...</div>
              )}
            </motion.div>
            
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              className="absolute bottom-12 -right-4 bg-white p-5 rounded-2xl shadow-2xl border border-gray-50 hidden md:block z-10"
            >
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1">Weekly Deals</p>
              <h4 className="text-2xl font-black text-[#064e3b]">৳45,890</h4>
              <div className="flex items-center gap-1 mt-1 text-green-500 font-bold text-xs">
                <span>↑ 2.35%</span>
                <div className="flex gap-0.5 items-end h-3">
                  <div className="w-1 bg-green-200 h-1"></div>
                  <div className="w-1 bg-green-300 h-2"></div>
                  <div className="w-1 bg-green-500 h-3"></div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-5xl font-black text-[#064e3b] leading-[1.1] mb-6">
                Best Quality <br /> 
                <span className="text-gray-400">Healthy And</span> <br />
                <span className="text-[#16a34a]">Fresh Grocery</span>
              </h2>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-8 max-w-lg font-medium">
                We prioritize quality in each of our grocery. below are the advantage of our products. Organic food is food produced.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6 mb-10">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="bg-[#f0fdf4] p-1 rounded-full">
                      <CheckCircle2 className="text-[#16a34a] w-5 h-5" />
                    </div>
                    <span className="text-[#064e3b] font-bold text-[14px]">{f.title}</span>
                  </div>
                ))}
              </div>

              <button className="bg-[#16a34a] text-white px-10 py-4 rounded-xl font-black uppercase tracking-wider hover:bg-[#15803d] transition-all shadow-lg hover:shadow-[#16a34a40] active:scale-95 cursor-pointer">
                Order Now
              </button>
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {infoCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`${card.bg} p-8 rounded-[2.5rem] flex flex-col gap-4 border border-white/60 shadow-sm hover:shadow-md transition-all group cursor-default`}
            >
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                {card.icon}
              </div>
              <div>
                <h4 className="text-[#064e3b] font-black text-lg mb-1">{card.title}</h4>
                <p className="text-gray-500 text-[13px] font-bold leading-tight">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;