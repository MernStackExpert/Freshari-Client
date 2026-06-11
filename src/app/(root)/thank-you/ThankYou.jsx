"use client";
import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle,
  ShoppingBag,
  ArrowRight,
  Star,
  Truck,
  RefreshCcw,
} from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";
import ProductCard from "@/components/shared/ProductCard";

const ThankYouContent = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [suggestedProducts, setSuggestedProducts] = useState([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/products`,
        );
        if (data?.products) {
          setSuggestedProducts(data.products.slice(0, 10));
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchSuggestions();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24 font-sans">
      <div className="bg-white border-b border-gray-100 py-20 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#22c55e]/10 to-transparent rounded-full blur-[100px] pointer-events-none"></div>

        <div className="main-container text-center relative z-10">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="flex justify-center mb-8"
          >
            <div className="bg-[#f0fdf4] p-5 rounded-full shadow-[0_10px_30px_rgba(34,197,94,0.2)]">
              <CheckCircle className="w-20 h-20 text-[#22c55e]" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-5xl font-black text-[#0f172a] mb-5 tracking-tight"
          >
            ধন্যবাদ, আপনার অর্ডারটি সফল হয়েছে!
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-[#64748b] font-medium text-lg max-w-xl mx-auto mb-8"
          >
            আমরা আপনার অর্ডারটি পেয়েছি। খুব শীঘ্রই আমাদের একজন প্রতিনিধি
            অর্ডারটি কনফার্ম করার জন্য আপনার সাথে যোগাযোগ করবেন।
          </motion.p>

          {orderId && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-3 bg-[#f8fafc] px-6 py-4 rounded-2xl border border-gray-100 mb-10 shadow-sm"
            >
              <span className="text-sm font-black text-[#64748b] uppercase tracking-widest">
                Order ID:
              </span>
              <span className="text-lg font-black text-[#f97316]">
                #{orderId}
              </span>
            </motion.div>
          )}

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link
              href="/product/shop"
              className="bg-[#0f172a] text-white px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-[#1e293b] hover:shadow-[0_10px_20px_rgba(15,23,42,0.2)] hover:-translate-y-1 transition-all duration-300 flex items-center gap-3"
            >
              <ShoppingBag className="w-5 h-5" /> শপিং চালিয়ে যান
            </Link>
          </motion.div>
        </div>
      </div>

      <section className="py-20">
        <div className="main-container">
          {suggestedProducts.length > 0 && (
            <div className="mb-20">
              <div className="flex items-end justify-between mb-10 border-b border-gray-200 pb-5">
                <div>
                  <h2 className="text-2xl md:text-3xl font-black text-[#0f172a] uppercase tracking-widest">
                    You May Also Like
                  </h2>
                  <p className="text-[#64748b] text-sm font-bold mt-2 tracking-wide">
                    আপনার জন্য আমাদের স্পেশাল কিছু কালেকশন
                  </p>
                </div>
                <Link
                  href="/product/shop"
                  className="group hidden md:flex items-center gap-2 bg-white px-5 py-2.5 rounded-xl border border-gray-200 text-[#0f172a] font-bold text-sm hover:border-[#f97316] hover:text-[#f97316] transition-colors shadow-sm"
                >
                  সবগুলো দেখুন{" "}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                {suggestedProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          )}

          <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-[2.5rem] md:rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#f97316] rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
            <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#16a34a] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
              <div className="pt-8 md:pt-0 px-4 group">
                <div className="w-16 h-16 mx-auto bg-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#f97316]/20 transition-all duration-300 border border-white/5">
                  <Star className="w-8 h-8 text-[#f97316]" />
                </div>
                <h4 className="font-black text-xl mb-3 tracking-wide">
                  ১০০% অরিজিনাল পণ্য
                </h4>
                <p className="text-gray-400 text-sm font-medium leading-relaxed">
                  সেরা মানের নিশ্চয়তা এবং সরাসরি নির্ভরযোগ্য উৎস থেকে সংগৃহীত।
                </p>
              </div>

              <div className="pt-8 md:pt-0 px-4 group">
                <div className="w-16 h-16 mx-auto bg-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#f97316]/20 transition-all duration-300 border border-white/5">
                  <Truck className="w-8 h-8 text-[#f97316]" />
                </div>
                <h4 className="font-black text-xl mb-3 tracking-wide">
                  দ্রুত ডেলিভারি
                </h4>
                <p className="text-gray-400 text-sm font-medium leading-relaxed">
                  আপনার ঠিকানায় নির্ধারিত সময়ের মধ্যে দ্রুত ও নিরাপদ ডেলিভারি।
                </p>
              </div>

              <div className="pt-8 md:pt-0 px-4 group">
                <div className="w-16 h-16 mx-auto bg-white/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#f97316]/20 transition-all duration-300 border border-white/5">
                  <RefreshCcw className="w-8 h-8 text-[#f97316]" />
                </div>
                <h4 className="font-black text-xl mb-3 tracking-wide">
                  সহজ রিটার্ন
                </h4>
                <p className="text-gray-400 text-sm font-medium leading-relaxed">
                  পণ্য পছন্দ না হলে ডেলিভারি ম্যান থাকা অবস্থায় রিটার্ন করার
                  সুবিধা।
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const ThankYouPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
          <div className="w-12 h-12 border-4 border-[#0f172a] border-t-[#f97316] rounded-full animate-spin"></div>
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
};

export default ThankYouPage;
