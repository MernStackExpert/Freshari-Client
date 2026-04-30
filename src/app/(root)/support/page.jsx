"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPhoneAlt,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaFacebookF,
  FaEnvelope,
} from "react-icons/fa";

const slides = [
  "24/7 Customer Support for Freshari",
  "Fast Response & Trusted Service",
  "We Are Always Here To Help You",
];

const SupportPage = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#f9fafb] min-h-screen">
      <div className="w-full h-[220px] md:h-[300px] bg-gradient-to-r from-[#064e3b] to-[#16a34a] flex items-center justify-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white text-3xl md:text-5xl font-black text-center"
        >
          Freshari Support
        </motion.h1>
      </div>

      <div className="w-full bg-white py-6 flex items-center justify-center overflow-hidden">
        <div className="relative h-[40px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-[#064e3b] text-lg md:text-xl font-bold"
            >
              {slides[index]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="px-4 py-16 flex items-center justify-center">
        <div className="max-w-5xl w-full grid md:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-3xl shadow-xl"
          >
            <h2 className="text-2xl font-black text-[#064e3b] mb-6">
              Contact Support
            </h2>

            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <FaPhoneAlt className="text-[#16a34a] text-xl" />
                <span className="font-semibold text-gray-700">
                  01724383623
                </span>
              </div>

              <div className="flex items-center gap-4">
                <FaWhatsapp className="text-[#16a34a] text-xl" />
                <a
                  href="https://wa.me/8801724383623"
                  target="_blank"
                  className="font-semibold text-gray-700 hover:text-[#16a34a]"
                >
                  01724383623
                </a>
              </div>

              <div className="flex items-center gap-4">
                <FaEnvelope className="text-[#16a34a] text-xl" />
                <span className="font-semibold text-gray-700">
                  freshari.shop@gmail.com
                </span>
              </div>

              <div className="flex items-start gap-4">
                <FaMapMarkerAlt className="text-[#16a34a] text-xl mt-1" />
                <span className="font-semibold text-gray-700">
                  খড়কি পীর বাড়ি, যশোর, Bangladesh
                </span>
              </div>

              <div className="flex items-center gap-4">
                <FaFacebookF className="text-[#16a34a] text-xl" />
                <a
                  href="https://www.facebook.com/share/18Xjn8W7Bn/"
                  target="_blank"
                  className="font-semibold text-gray-700 hover:text-[#16a34a]"
                >
                  Visit Facebook Page
                </a>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-3xl shadow-xl"
          >
            <h2 className="text-2xl font-black text-[#064e3b] mb-6">
              Send Message
            </h2>

            <form className="space-y-5">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-5 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#16a34a]"
              />

              <input
                type="email"
                placeholder="Your Email"
                className="w-full px-5 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#16a34a]"
              />

              <textarea
                rows="5"
                placeholder="Your Message"
                className="w-full px-5 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#16a34a]"
              ></textarea>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#16a34a] text-white font-bold hover:bg-[#15803d] transition-all duration-300"
              >
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;