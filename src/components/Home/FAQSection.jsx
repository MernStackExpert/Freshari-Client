"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FAQSection = () => {
  const [faqs, setFaqs] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/faqs`);
        if (res.data) {
          setFaqs(res.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchFAQs();
  }, []);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  if (faqs.length === 0) return null;

  return (
    <section className="py-16 bg-[#fcfdfd]">
      <div className="main-container max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#f0fdf4] text-[#16a34a] px-4 py-1.5 rounded-full text-sm font-black uppercase tracking-widest mb-4">
            <HelpCircle className="w-4 h-4" /> common questions
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-[#064e3b]">
            সচরাচর জিজ্ঞাসিত কিছু প্রশ্ন
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={faq._id} 
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm transition-all"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-5 md:p-6 text-left cursor-pointer transition-colors hover:bg-gray-50 outline-none"
              >
                <span className={`text-[15px] md:text-[17px] font-bold transition-colors flex-1 pr-4 ${activeIndex === index ? 'text-[#16a34a]' : 'text-[#064e3b]'}`}>
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`w-5 h-5 text-gray-400 transition-transform duration-300 shrink-0 ${activeIndex === index ? 'rotate-180 text-[#16a34a]' : ''}`} 
                />
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="px-5 pb-6 md:px-6 md:pb-8 text-gray-500 text-sm md:text-base leading-relaxed border-t border-gray-50 pt-4">
                      {faq.ans}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;