"use client";
import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image"; 
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, ShoppingBag, ArrowRight, Star } from "lucide-react";
import axios from "axios";
import ProductCard from "@/components/shared/ProductCard";

const ThankYouPage = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [suggestedProducts, setSuggestedProducts] = useState([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);
        setSuggestedProducts(res.data.products.slice(0, 10));
      } catch (error) {
        console.error(error);
      }
    };
    fetchSuggestions();
  }, []);

  return (
    <div className="min-h-screen bg-[#fcfdfd] pb-20">
      <div className="bg-white border-b border-gray-100 py-16">
        <div className="main-container text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-[#f0fdf4] p-4 rounded-full">
              <CheckCircle className="w-16 h-16 text-[#16a34a]" />
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-[#064e3b] mb-4">ধন্যবাদ, আপনার অর্ডারটি সম্পন্ন হয়েছে!</h1>
          <p className="text-gray-500 font-medium max-w-lg mx-auto mb-6">
            আমরা আপনার অর্ডারটি পেয়েছি। খুব শীঘ্রই আমাদের একজন প্রতিনিধি আপনার অর্ডারটি পৌঁছে দিবেন।
          </p>
          
          {orderId && (
            <div className="inline-block bg-gray-50 px-6 py-3 rounded-2xl border border-gray-100 mb-8">
              <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Order ID: </span>
              <span className="text-sm font-black text-[#16a34a]">#{orderId}</span>
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/"
              className="bg-[#064e3b] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-[#16a34a] transition-all flex items-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" /> শপিং চালিয়ে যান
            </Link>
          </div>
        </div>
      </div>

      <section className="py-16">
        <div className="main-container">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-black text-[#064e3b] uppercase tracking-tight">More Buy with Us</h2>
              <p className="text-gray-400 text-sm font-bold mt-1">আপনার জন্য আমাদের সেরা কিছু কালেকশন</p>
            </div>
            <Link href="/" className="text-[#16a34a] font-black text-sm flex items-center gap-1 hover:underline">
              সবগুলো দেখুন <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {suggestedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          <div className="mt-20 bg-[#064e3b] rounded-[40px] p-10 text-white relative overflow-hidden">
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <Star className="w-8 h-8 text-orange-400 mx-auto mb-4" />
                <h4 className="font-black text-lg">১০০% তাজা সবজি</h4>
                <p className="text-white/60 text-xs mt-2 font-medium">সরাসরি কৃষকের মাঠ থেকে সংগৃহীত</p>
              </div>
              <div>
                <CheckCircle className="w-8 h-8 text-orange-400 mx-auto mb-4" />
                <h4 className="font-black text-lg">দ্রুত ডেলিভারি</h4>
                <p className="text-white/60 text-xs mt-2 font-medium">রাজশাহীর ভেতরে ২৪ ঘণ্টার মধ্যে নিশ্চিত ডেলিভারি</p>
              </div>
              <div>
                <ShoppingBag className="w-8 h-8 text-orange-400 mx-auto mb-4" />
                <h4 className="font-black text-lg">সহজ রিটার্ন</h4>
                <p className="text-white/60 text-xs mt-2 font-medium">পণ্য পছন্দ না হলে সাথে সাথেই রিটার্ন করার সুযোগ</p>
              </div>
            </div>
            <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-[#16a34a] rounded-full blur-3xl opacity-20"></div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ThankYouPage;