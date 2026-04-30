"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  FaRocket, 
  FaEye, 
  FaLeaf, 
  FaHandsHelping, 
  FaShieldAlt, 
  FaUsers 
} from "react-icons/fa";
import { GiTargetShot } from "react-icons/gi";

const AboutPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const fadeInUp = {
    hidden: { y: 60, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 80, damping: 15 }
    }
  };

  const scaleIn = {
    hidden: { scale: 0.85, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200 to-base-100 overflow-hidden">
      {/* Hero Section - Premium Gradient */}
      <div className="relative py-28 bg-gradient-to-br from-primary via-primary to-secondary text-primary-content overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(at_top_right,#ffffff15_0%,transparent_50%)]" />
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto px-6 text-center relative z-10"
        >
          <div className="inline-block mb-6 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
            <span className="text-sm font-semibold tracking-[3px] uppercase">Since 2024</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6">
            Freshari
          </h1>
          
          <p className="text-2xl md:text-3xl max-w-4xl mx-auto leading-tight opacity-90 font-light">
            বিশুদ্ধতা যেখানে শুরু হয় — <span className="font-semibold">আপনার রান্নাঘর থেকে</span>
          </p>
        </motion.div>

        {/* Decorative element */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      </div>

      {/* Story Section */}
      <motion.div 
        className="max-w-7xl mx-auto px-6 py-24"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div variants={fadeInUp} className="space-y-8">
            <div className="inline-flex items-center gap-3 bg-base-200 px-5 py-2.5 rounded-2xl border border-base-300">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
              <span className="font-semibold tracking-widest text-sm">আমাদের গল্প</span>
            </div>

            <h2 className="text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
              একসাথে বিশুদ্ধতার<br />যাত্রা শুরু
            </h2>

            <p className="text-lg leading-relaxed text-base-content/80 max-w-lg">
              Freshari শুরু হয়েছিল একটি সাধারণ স্বপ্ন নিয়ে — প্রতিটি বাংলাদেশি পরিবারের রান্নাঘরে খাঁটি, ফ্রেশ এবং নিরাপদ পণ্য পৌঁছে দেওয়া।
            </p>

            <div className="grid grid-cols-2 gap-6">
              <motion.div 
                whileHover={{ scale: 1.03 }}
                className="glass p-8 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl"
              >
                <h4 className="text-5xl font-black text-primary mb-2">৫০০+</h4>
                <p className="font-medium text-base-content/70">সন্তুষ্ট গ্রাহক</p>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.03 }}
                className="glass p-8 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl"
              >
                <h4 className="text-5xl font-black text-secondary mb-2">১০০%</h4>
                <p className="font-medium text-base-content/70">খাঁটি ও ফ্রেশ</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Visual */}
          <motion.div variants={scaleIn} className="relative">
            <div className="absolute -inset-8 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-[4rem] -rotate-6" />
            
            <div className="relative bg-base-100 rounded-3xl p-12 shadow-2xl border border-base-200 overflow-hidden">
              <FaLeaf className="text-[18rem] text-primary/5 absolute -bottom-20 -right-20" />
              
              <div className="flex flex-col items-center text-center relative z-10">
                <GiTargetShot className="text-8xl text-primary mb-8" />
                <h3 className="text-3xl font-bold mb-3">গুণগত মান</h3>
                <p className="text-base-content/70 max-w-xs">আমাদের প্রতিটি পণ্যের পিছনে আছে কঠোর মান নিয়ন্ত্রণ এবং সরাসরি উৎস।</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Mission Vision Values - Glass Cards */}
      <div className="bg-base-300/50 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { 
                icon: <FaRocket className="text-4xl" />, 
                title: "আমাদের মিশন", 
                desc: "প্রযুক্তি ও বিশ্বস্ততার মাধ্যমে প্রতিদিনের ফ্রেশ পণ্য দ্রুত ও নিরাপদে আপনার দরজায় পৌঁছে দেওয়া।",
                color: "primary"
              },
              { 
                icon: <FaEye className="text-4xl" />, 
                title: "আমাদের ভিশন", 
                desc: "বাংলাদেশের সবচেয়ে বিশ্বস্ত ও প্রিমিয়াম অনলাইন ফ্রেশ ফুড প্ল্যাটফর্ম হয়ে ওঠা।",
                color: "secondary"
              },
              { 
                icon: <FaShieldAlt className="text-4xl" />, 
                title: "মূল্যবোধ", 
                desc: "সততা, স্বচ্ছতা, এবং গ্রাহকের সন্তুষ্টি — এটাই আমাদের প্রতিটি সিদ্ধান্তের ভিত্তি।",
                color: "accent"
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                variants={fadeInUp}
                whileHover={{ y: -12 }}
                className="group bg-white/80 backdrop-blur-2xl border border-white/60 rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-500"
              >
                <div className={`w-20 h-20 rounded-2xl bg-${item.color}/10 flex items-center justify-center mb-8 group-hover:bg-${item.color}/20 transition-colors text-${item.color}`}>
                  {item.icon}
                </div>
                <h3 className="text-3xl font-bold mb-4">{item.title}</h3>
                <p className="text-base-content/70 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Why Choose Us - Bento Style */}
      <motion.div 
        className="max-w-7xl mx-auto px-6 py-28 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="text-5xl font-black mb-4 tracking-tight">কেন Freshari?</h2>
        <p className="text-xl text-base-content/60 mb-16">যে কারণে হাজারো পরিবার আমাদের উপর আস্থা রাখে</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: <FaLeaf className="text-5xl text-emerald-500" />, label: "সরাসরি ফার্ম থেকে" },
            { icon: <FaHandsHelping className="text-5xl text-blue-500" />, label: "২৪/৭ সাপোর্ট" },
            { icon: <FaUsers className="text-5xl text-violet-500" />, label: "দক্ষ ডেলিভারি" },
            { icon: <FaShieldAlt className="text-5xl text-rose-500" />, label: "১০০% নিরাপদ" }
          ].map((item, index) => (
            <motion.div 
              key={index}
              whileHover={{ scale: 1.04, rotate: 1 }}
              className="glass p-10 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg hover:shadow-2xl transition-all group"
            >
              <div className="mb-8 flex justify-center transition-transform group-hover:scale-110">
                {item.icon}
              </div>
              <p className="font-semibold text-lg">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Final CTA */}
      <div className="max-w-5xl mx-auto px-6 pb-28">
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="bg-gradient-to-br from-primary to-secondary rounded-[3.5rem] p-16 md:p-20 text-primary-content text-center relative overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.25),transparent)]" />
          
          <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">আমাদের সাথে যুক্ত হোন</h2>
          <p className="text-2xl opacity-90 mb-10 max-w-2xl mx-auto">
            যেকোনো প্রশ্ন, পরামর্শ বা অংশীদারিত্বের জন্য আমরা সবসময় প্রস্তুত।
          </p>
          
          <button className="btn btn-lg bg-white hover:bg-base-100 text-primary border-0 px-16 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all">
            যোগাযোগ করুন
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;