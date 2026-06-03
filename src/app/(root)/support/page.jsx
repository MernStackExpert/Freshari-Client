"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPhoneAlt,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaFacebookF,
  FaEnvelope,
  FaHeadset,
  FaClock,
  FaShieldAlt,
} from "react-icons/fa";

const slides = [
  "24/7 Premium Customer Support",
  "Fast Response & Trusted Service",
  "We Are Always Here To Help You",
];

const faqs = [
  {
    q: "ডেলিভারি পেতে কতক্ষণ সময় লাগে?",
    a: "আমাদের এক্সপ্রেস ডেলিভারির মাধ্যমে আপনি অর্ডার করার ২৪ ঘন্টার মধ্যেই আপনার পণ্য হাতে পেয়ে যাবেন।",
  },
  {
    q: "পণ্য পছন্দ না হলে কি রিটার্ন করা যাবে?",
    a: "অবশ্যই। কোনো কারণে পণ্যের মান নিয়ে সন্তুষ্ট না হলে ডেলিভারি ম্যান থাকা অবস্থায় সাথে সাথে রিটার্ন করতে পারবেন।",
  },
  {
    q: "আপনাদের ডেলিভারি চার্জ কত?",
    a: "১০০০ টাকার উপরে অর্ডার করলে ডেলিভারি সম্পূর্ণ ফ্রি। এর নিচে অর্ডারের ক্ষেত্রে নির্দিষ্ট এরিয়ার ওপর ভিত্তি করে চার্জ প্রযোজ্য।",
  },
  {
    q: "আমি কি ফোনে অর্ডার করতে পারবো?",
    a: "হ্যাঁ, আমাদের হটলাইন নাম্বারে কল করে অথবা হোয়াটসঅ্যাপে মেসেজ দিয়ে খুব সহজেই অর্ডার কনফার্ম করতে পারবেন।",
  },
];

const SupportPage = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 80, damping: 15 },
    },
  };

  return (
    <div className="bg-[#fcfdfd] min-h-screen font-sans overflow-hidden">
      <div className="relative w-full h-[350px] md:h-[450px] bg-gradient-to-br from-[#0f172a] via-[#064e3b] to-[#022c22] flex flex-col items-center justify-center overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#16a34a] rounded-full blur-[150px] opacity-20 translate-x-1/3 -translate-y-1/3" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-md mb-6 border border-white/20 shadow-[0_0_30px_rgba(22,163,74,0.3)]">
            <FaHeadset className="text-3xl text-[#a7f3d0]" />
          </div>
          <h1 className="text-white text-5xl md:text-7xl font-black mb-6 tracking-tight drop-shadow-xl">
            Arshe-Mart{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#16a34a] to-[#a7f3d0]">
              Support
            </span>
          </h1>

          <div className="relative h-[40px] overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-[#a7f3d0] text-lg md:text-2xl font-medium tracking-wide"
              >
                {slides[index]}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            {
              icon: <FaPhoneAlt />,
              title: "Hotline",
              value: "01724383623",
              link: "tel:+8801724383623",
              color: "text-blue-500",
              bg: "bg-blue-50",
            },
            {
              icon: <FaWhatsapp />,
              title: "WhatsApp",
              value: "01724383623",
              link: "https://wa.me/8801724383623",
              color: "text-[#16a34a]",
              bg: "bg-[#f0fdf4]",
            },
            {
              icon: <FaEnvelope />,
              title: "Email Us",
              value: "Arshe-Mart.shop@gmail.com",
              link: "mailto:Arshe-Mart.shop@gmail.com",
              color: "text-rose-500",
              bg: "bg-rose-50",
            },
            {
              icon: <FaMapMarkerAlt />,
              title: "Our Location",
              value: "খড়কি পীর বাড়ি, যশোর",
              link: "#",
              color: "text-orange-500",
              bg: "bg-orange-50",
            },
          ].map((contact, idx) => (
            <motion.a
              href={contact.link}
              target={contact.title === "Our Location" ? "_self" : "_blank"}
              key={idx}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="bg-white rounded-[2rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_20px_50px_rgba(22,163,74,0.1)] transition-all duration-300 group flex flex-col items-center text-center cursor-pointer"
            >
              <div
                className={`w-16 h-16 rounded-2xl ${contact.bg} ${contact.color} flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                {contact.icon}
              </div>
              <h3 className="text-gray-500 font-bold text-sm uppercase tracking-wider mb-2">
                {contact.title}
              </h3>
              <p className="text-[#0f172a] font-black text-lg">
                {contact.value}
              </p>
            </motion.a>
          ))}
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-3 bg-[#f0fdf4] px-5 py-2.5 rounded-full border border-[#16a34a]/20 mb-8">
              <span className="font-black tracking-widest text-xs uppercase text-[#064e3b]">
                FAQ
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#0f172a] mb-6 leading-tight tracking-tight">
              সাধারণ জিজ্ঞাসা ও <br />
              <span className="text-[#16a34a]">উত্তরসমূহ</span>
            </h2>
            <p className="text-gray-500 text-lg mb-10 font-medium">
              আপনার মনে থাকতে পারে এমন কিছু সাধারণ প্রশ্নের উত্তর এখানে দেওয়া
              হলো। আরও কিছু জানার থাকলে আমাদের সাথে সরাসরি যোগাযোগ করুন।
            </p>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:border-[#16a34a]/30 transition-colors"
                >
                  <h4 className="text-[#064e3b] font-black text-lg mb-3">
                    {faq.q}
                  </h4>
                  <p className="text-gray-600 font-medium leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-[#064e3b] to-[#16a34a] rounded-[3rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-white rounded-full blur-[100px] opacity-20" />

            <div className="relative z-10">
              <h3 className="text-3xl font-black mb-10 tracking-tight">
                আমাদের প্রতিশ্রুতি
              </h3>

              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 backdrop-blur-sm border border-white/20">
                    <FaClock className="text-2xl text-[#a7f3d0]" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">
                      ২৪/৭ কাস্টমার সাপোর্ট
                    </h4>
                    <p className="text-white/80 font-medium leading-relaxed">
                      যেকোনো সময়, যেকোনো প্রয়োজনে আমরা আছি আপনার পাশে। আপনার
                      সন্তুষ্টিই আমাদের মূল লক্ষ্য।
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 backdrop-blur-sm border border-white/20">
                    <FaShieldAlt className="text-2xl text-[#a7f3d0]" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">
                      নিরাপদ ও বিশ্বস্ত সেবা
                    </h4>
                    <p className="text-white/80 font-medium leading-relaxed">
                      আপনার তথ্যের গোপনীয়তা এবং পণ্যের গুণগত মান রক্ষায় আমরা
                      শতভাগ প্রতিশ্রুতিবদ্ধ।
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 backdrop-blur-sm border border-white/20">
                    <FaFacebookF className="text-2xl text-[#a7f3d0]" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">ফেসবুক কমিউনিটি</h4>
                    <p className="text-white/80 font-medium leading-relaxed">
                      আমাদের নতুন আপডেট এবং অফারগুলো জানতে আমাদের ফেসবুক পেজে
                      যুক্ত থাকুন।
                    </p>
                    <a
                      href="https://www.facebook.com/share/18Xjn8W7Bn/"
                      target="_blank"
                      className="inline-block mt-4 bg-white text-[#064e3b] px-6 py-2.5 rounded-full font-bold text-sm hover:scale-105 transition-transform"
                    >
                      Visit Our Page
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
