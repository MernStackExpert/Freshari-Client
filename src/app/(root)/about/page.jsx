"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  FaRocket,
  FaEye,
  FaLeaf,
  FaHandsHelping,
  FaShieldAlt,
  FaUsers,
} from "react-icons/fa";
import { GiTargetShot } from "react-icons/gi";

const AboutPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const fadeInUp = {
    hidden: { y: 80, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 60, damping: 20 },
    },
  };

  const scaleIn = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { type: "spring", stiffness: 80, damping: 20 },
    },
  };

  return (
    <div className="min-h-screen bg-[#fcfdfd] overflow-hidden font-sans">
      <div className="relative py-32 bg-gradient-to-br from-[#064e3b] via-[#0f766e] to-[#0f172a] text-white overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#16a34a] rounded-full blur-[150px] opacity-20 translate-x-1/3 -translate-y-1/3" />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-7xl mx-auto px-6 text-center relative z-10"
        >
          <div className="inline-block mb-8 px-8 py-2.5 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
            <span className="text-sm font-black tracking-[4px] uppercase text-[#a7f3d0]">
              Est. 2024
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight mb-8 drop-shadow-2xl text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#a7f3d0]">
            Arshe-Mart
          </h1>

          <p className="text-xl md:text-3xl max-w-4xl mx-auto leading-relaxed text-white/80 font-medium">
            বিশুদ্ধতা যেখানে শুরু হয় — <br className="md:hidden" />
            <span className="font-black text-[#a7f3d0]">
              আপনার রান্নাঘর থেকে
            </span>
          </p>
        </motion.div>
      </div>

      <motion.div
        className="max-w-7xl mx-auto px-6 py-32"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div variants={fadeInUp} className="space-y-10">
            <div className="inline-flex items-center gap-3 bg-[#f0fdf4] px-6 py-3 rounded-full border border-[#16a34a]/20 shadow-sm">
              <div className="w-2.5 h-2.5 bg-[#16a34a] rounded-full animate-ping" />
              <span className="font-black tracking-widest text-xs uppercase text-[#064e3b]">
                আমাদের গল্প
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.15] text-[#0f172a] tracking-tight">
              একসাথে বিশুদ্ধতার <br />
              <span className="text-[#16a34a]">যাত্রা শুরু</span>
            </h2>

            <p className="text-lg md:text-xl leading-relaxed text-gray-600 max-w-lg font-medium">
              Arshe-Mart শুরু হয়েছিল একটি সাধারণ স্বপ্ন নিয়ে — প্রতিটি
              বাংলাদেশি পরিবারের রান্নাঘরে খাঁটি, ফ্রেশ এবং নিরাপদ পণ্য পৌঁছে
              দেওয়া।
            </p>

            <div className="grid grid-cols-2 gap-6 md:gap-8">
              <motion.div
                whileHover={{ y: -5 }}
                className="p-8 rounded-[32px] bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(22,163,74,0.1)] transition-all duration-300"
              >
                <h4 className="text-4xl md:text-5xl font-black text-[#16a34a] mb-3">
                  ৫০০+
                </h4>
                <p className="font-bold text-gray-500 uppercase tracking-wider text-xs">
                  সন্তুষ্ট গ্রাহক
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="p-8 rounded-[32px] bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(249,115,22,0.1)] transition-all duration-300"
              >
                <h4 className="text-4xl md:text-5xl font-black text-[#f97316] mb-3">
                  ১০০%
                </h4>
                <p className="font-bold text-gray-500 uppercase tracking-wider text-xs">
                  খাঁটি ও ফ্রেশ
                </p>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            variants={scaleIn}
            className="relative h-full flex items-center justify-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#16a34a]/10 to-[#f97316]/10 rounded-[3rem] rotate-3 scale-105" />

            <div className="relative w-full aspect-square md:aspect-auto md:h-[600px] bg-white rounded-[3rem] p-12 shadow-[0_30px_60px_rgba(0,0,0,0.05)] border border-white flex flex-col justify-center items-center overflow-hidden">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#f0fdf4] rounded-full blur-3xl opacity-60" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-orange-50 rounded-full blur-3xl opacity-60" />

              <FaLeaf className="absolute -bottom-10 -right-10 text-[16rem] text-[#16a34a]/5 rotate-12" />

              <div className="relative z-10 text-center flex flex-col items-center">
                <div className="w-32 h-32 bg-gradient-to-br from-[#16a34a] to-[#064e3b] rounded-full flex items-center justify-center shadow-xl shadow-[#16a34a]/30 mb-10">
                  <GiTargetShot className="text-6xl text-white drop-shadow-md" />
                </div>
                <h3 className="text-3xl font-black text-[#0f172a] mb-5 tracking-tight">
                  গুণগত মান
                </h3>
                <p className="text-gray-500 text-lg max-w-[280px] leading-relaxed font-medium">
                  আমাদের প্রতিটি পণ্যের পিছনে আছে কঠোর মান নিয়ন্ত্রণ এবং সরাসরি
                  উৎস।
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="bg-[#f8fafc] py-32 border-y border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-white to-transparent opacity-50" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {[
              {
                icon: <FaRocket className="text-4xl" />,
                title: "আমাদের মিশন",
                desc: "প্রযুক্তি ও বিশ্বস্ততার মাধ্যমে প্রতিদিনের ফ্রেশ পণ্য দ্রুত ও নিরাপদে আপনার দরজায় পৌঁছে দেওয়া।",
                bg: "from-[#16a34a]/10 to-transparent",
                color: "text-[#16a34a]",
                shadow: "hover:shadow-[0_20px_40px_rgba(22,163,74,0.1)]",
              },
              {
                icon: <FaEye className="text-4xl" />,
                title: "আমাদের ভিশন",
                desc: "বাংলাদেশের সবচেয়ে বিশ্বস্ত ও প্রিমিয়াম অনলাইন ফ্রেশ ফুড প্ল্যাটফর্ম হয়ে ওঠা।",
                bg: "from-[#f97316]/10 to-transparent",
                color: "text-[#f97316]",
                shadow: "hover:shadow-[0_20px_40px_rgba(249,115,22,0.1)]",
              },
              {
                icon: <FaShieldAlt className="text-4xl" />,
                title: "মূল্যবোধ",
                desc: "সততা, স্বচ্ছতা, এবং গ্রাহকের সন্তুষ্টি — এটাই আমাদের প্রতিটি সিদ্ধান্তের ভিত্তি।",
                bg: "from-[#0ea5e9]/10 to-transparent",
                color: "text-[#0ea5e9]",
                shadow: "hover:shadow-[0_20px_40px_rgba(14,165,233,0.1)]",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -10 }}
                className={`bg-white rounded-[2rem] p-12 shadow-lg border border-gray-100 transition-all duration-500 ${item.shadow} group`}
              >
                <div
                  className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${item.bg} flex items-center justify-center mb-8 ${item.color} group-hover:scale-110 transition-transform duration-500`}
                >
                  {item.icon}
                </div>
                <h3 className="text-2xl font-black text-[#0f172a] mb-5">
                  {item.title}
                </h3>
                <p className="text-gray-500 leading-relaxed font-medium">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <motion.div
        className="max-w-7xl mx-auto px-6 py-32 text-center"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-4xl md:text-5xl font-black mb-5 tracking-tight text-[#0f172a]">
          কেন Arshe-Mart?
        </h2>
        <p className="text-xl text-gray-500 mb-20 font-medium">
          যে কারণে হাজারো পরিবার আমাদের উপর আস্থা রাখে
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {[
            {
              icon: <FaLeaf />,
              label: "সরাসরি ফার্ম থেকে",
              color: "text-[#16a34a]",
            },
            {
              icon: <FaHandsHelping />,
              label: "২৪/৭ সাপোর্ট",
              color: "text-[#0ea5e9]",
            },
            {
              icon: <FaUsers />,
              label: "দক্ষ ডেলিভারি",
              color: "text-[#8b5cf6]",
            },
            {
              icon: <FaShieldAlt />,
              label: "১০০% নিরাপদ",
              color: "text-[#f43f5e]",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white p-10 rounded-[2rem] border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-xl transition-all duration-300 group"
            >
              <div
                className={`text-5xl mb-6 flex justify-center ${item.color} group-hover:scale-110 transition-transform duration-300 drop-shadow-sm`}
              >
                {item.icon}
              </div>
              <p className="font-black text-gray-800 text-lg tracking-wide">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="max-w-6xl mx-auto px-6 pb-32">
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="bg-gradient-to-r from-[#064e3b] to-[#16a34a] rounded-[3rem] md:rounded-[4rem] p-16 md:p-24 text-center relative overflow-hidden shadow-[0_30px_60px_rgba(22,163,74,0.2)]"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-white rounded-full blur-[100px] opacity-20" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-white drop-shadow-lg">
              আমাদের সাথে যুক্ত হোন
            </h2>
            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto font-medium">
              যেকোনো প্রশ্ন, পরামর্শ বা অংশীদারিত্বের জন্য আমরা সবসময় প্রস্তুত।
            </p>

            <button className="bg-white text-[#064e3b] px-12 py-5 text-lg font-black uppercase tracking-widest rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.2)] hover:scale-105 hover:bg-gray-50 transition-all duration-300 cursor-pointer">
              যোগাযোগ করুন
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
