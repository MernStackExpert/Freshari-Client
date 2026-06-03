"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../shared/ProductCard";
import { ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";

const NewArrivalsSection = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/products`,
        );
        if (res.data?.products) {
          const newProducts = res.data.products
            .filter((p) => p.status?.isNew)
            .slice(0, 10);
          setProducts(newProducts);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="py-16 bg-[#fcfdfd]">
      <div className="main-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 border-b border-gray-100 pb-5 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#16a34a] to-[#064e3b] p-2.5 rounded-xl shadow-lg shadow-[#16a34a]/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-[#064e3b] uppercase tracking-widest">
                New Arrivals
              </h2>
              <p className="text-sm text-gray-500 font-bold mt-1.5 tracking-wide">
                আমাদের স্টোরের একদম নতুন এবং ফ্রেশ কালেকশন
              </p>
            </div>
          </div>
          <Link
            href="/product/shop"
            className="group flex items-center gap-2 bg-[#f0fdf4] text-[#16a34a] px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#16a34a] hover:text-white transition-all duration-300 shadow-sm"
          >
            সবগুলো দেখুন{" "}
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivalsSection;
