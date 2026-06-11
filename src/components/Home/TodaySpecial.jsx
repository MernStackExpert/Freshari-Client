"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ShoppingCart, Zap } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";

const TodaySpecial = () => {
  const [products, setProducts] = useState([]);
  const { addToCart, buyNow } = useCart();
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/products`,
        );
        if (data?.products) {
          const specialOnes = data.products
            .filter((p) => p.status?.isTodaySpecial)
            .slice(0, 4);
          setProducts(specialOnes);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="py-12 bg-[#f8fafc]">
      <div className="main-container">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-gradient-to-br from-[#f97316] to-[#ea580c] p-2 rounded-xl shadow-lg shadow-[#f97316]/20">
            <Zap className="w-5 h-5 md:w-6 md:h-6 text-white fill-white" />
          </div>
          <h2 className="text-xl md:text-3xl font-black text-[#0f172a] uppercase tracking-widest">
            Today's Special
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 md:gap-6">
          {products.map((product) => {
            const hasDiscount =
              product.pricing.oldPrice > product.pricing.price;
            const saveAmount = hasDiscount
              ? product.pricing.oldPrice - product.pricing.price
              : 0;

            return (
              <div
                key={product._id}
                onClick={() => router.push(`/product/${product.slug}`)}
                className="relative flex flex-col lg:flex-row bg-white border border-gray-100 rounded-[16px] md:rounded-[24px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(15,23,42,0.08)] hover:border-[#0f172a]/10 transition-all duration-300 p-2.5 md:p-5 cursor-pointer group"
              >
                <div className="absolute top-0 right-0 z-10">
                  <span className="bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white text-[8px] md:text-[10px] font-black px-2 md:px-3 py-1 md:py-1.5 rounded-bl-xl md:rounded-bl-2xl flex items-center gap-1 shadow-md">
                    <Zap className="w-2.5 h-2.5 md:w-3 md:h-3 fill-current" />
                    <span className="hidden md:inline">Best Selling</span>
                  </span>
                </div>

                <div className="w-full lg:w-[40%] aspect-square relative shrink-0 overflow-hidden rounded-xl bg-[#f8fafc]">
                  <Image
                    src={product.media.thumbnail}
                    alt={product.name}
                    fill
                    className="object-contain p-3 md:p-4 transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between mt-3 md:mt-4 lg:mt-0 lg:ml-6">
                  <div>
                    <h3 className="text-[12px] md:text-[17px] font-black text-[#0f172a] group-hover:text-[#f97316] transition-colors line-clamp-2 md:line-clamp-1 leading-snug">
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-1.5 md:gap-2 mt-1.5 md:mt-3 flex-wrap">
                      <span className="text-[14px] md:text-[22px] font-black text-[#f97316]">
                        ৳{product.pricing.price}
                      </span>
                      {hasDiscount && (
                        <span className="text-[10px] md:text-[14px] text-gray-400 font-bold line-through">
                          ৳{product.pricing.oldPrice}
                        </span>
                      )}
                    </div>

                    {hasDiscount && (
                      <div className="mt-1.5 md:mt-2">
                        <span className="text-[9px] md:text-[11px] font-black text-[#f97316] bg-orange-50 px-1.5 md:px-2.5 py-0.5 md:py-1 rounded-md border border-[#f97316]/20 uppercase tracking-wide">
                          Save: ৳{saveAmount}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 md:mt-5 flex flex-row items-center gap-2 md:gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="flex-1 bg-white border border-[#0f172a]/20 text-[#0f172a] hover:bg-[#0f172a] hover:text-white hover:border-[#0f172a] transition-all duration-300 h-[34px] md:h-[45px] rounded-lg md:rounded-xl font-black text-[12px] flex items-center justify-center gap-2 uppercase tracking-wide cursor-pointer"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span className="hidden md:inline">Add</span>
                    </button>

                    <motion.button
                      animate={{
                        rotate: [0, -10, 10, -10, 10, 0, 0, 0, 0, 0, 0, 0],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 2,
                        ease: "easeInOut",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        buyNow(product);
                      }}
                      className="flex-1 bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white h-[34px] md:h-[45px] rounded-lg md:rounded-xl font-black text-[12px] hover:from-[#ea580c] hover:to-[#c2410c] transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(249,115,22,0.3)] hover:shadow-[0_6px_20px_rgba(249,115,22,0.4)] uppercase tracking-wide cursor-pointer"
                    >
                      <Zap className="w-4 h-4 fill-current" />
                      <span className="hidden md:inline">Buy</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TodaySpecial;
