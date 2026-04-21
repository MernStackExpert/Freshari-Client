"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "../shared/ProductCard";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const FruitsSection = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);
        if (res.data && res.data.products) {
          const fruitProducts = res.data.products
            .filter(p => p.category.main.toLowerCase() === "fruits")
            .slice(0, 10);
          setProducts(fruitProducts);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="py-12 bg-white">
      <div className="main-container">
        <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-[#064e3b] uppercase">
              Organic Fruits
            </h2>
            <p className="text-[12px] md:text-sm text-gray-500 font-medium mt-1">তাজা এবং কেমিক্যালমুক্ত সিজনাল ফল সমূহ</p>
          </div>
          <Link href="/category/fruits" className="flex items-center gap-1 text-[#16a34a] font-bold text-sm hover:gap-2 transition-all cursor-pointer">
            সবগুলো দেখুন <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FruitsSection;