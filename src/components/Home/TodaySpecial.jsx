"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { ShoppingCart, Zap } from "lucide-react";
import { useCart } from "@/context/CartContext";

const TodaySpecial = () => {
  const [products, setProducts] = useState([]);

  const { addToCart ,buyNow } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products`);
        if (res.data && res.data.products) {
          const specialOnes = res.data.products
            .filter(p => p.status.isTodaySpecial)
            .slice(0, 4);
          setProducts(specialOnes);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="py-10 bg-[#fcfdfd]">
      <div className="main-container">
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-[#16a34a] p-1.5 rounded-lg text-white">
            <Zap className="w-5 h-5 fill-current" />
          </div>
          <h2 className="text-xl md:text-2xl font-black text-[#064e3b] uppercase">
            Today's Special
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6">
          {products.map((product) => {
            const hasDiscount = product.pricing.oldPrice > product.pricing.price;
            const saveAmount = hasDiscount ? product.pricing.oldPrice - product.pricing.price : 0;

            return (
              <div 
                key={product._id}
                className="relative flex flex-col md:flex-row bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group p-2 md:p-5"
              >
                <div className="absolute top-0 right-0 z-10">
                  <span className="bg-[#ff4d4d] text-white text-[9px] md:text-[11px] font-bold px-2 py-1 rounded-bl-xl flex items-center gap-1 shadow-sm cursor-default">
                    <Zap className="w-3 h-3 fill-current" /> Best Selling
                  </span>
                </div>

                <div className="w-full md:w-[35%] aspect-square relative shrink-0 overflow-hidden rounded-xl">
                  <Image
                    src={product.media.thumbnail}
                    alt={product.name}
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-110 p-2"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between mt-3 md:mt-0 md:ml-6">
                  <div>
                    <Link href={`/product/${product.slug}`} className="cursor-pointer">
                      <h3 className="text-[13px] md:text-[17px] font-bold text-[#064e3b] hover:text-[#16a34a] transition-colors line-clamp-2 md:line-clamp-1 leading-snug">
                        {product.name}
                      </h3>
                    </Link>

                    <div className="flex items-center gap-2 mt-1 md:mt-2">
                      <span className="text-[16px] md:text-[20px] font-black text-[#f97316]">
                        ৳{product.pricing.price}
                      </span>
                      {hasDiscount && (
                        <span className="text-[11px] md:text-[14px] text-gray-400 line-through">
                          ৳{product.pricing.oldPrice}
                        </span>
                      )}
                    </div>

                    {hasDiscount && (
                      <div className="mt-1 md:mt-2">
                        <span className="text-[10px] md:text-[12px] font-bold text-[#16a34a] bg-[#f0fdf4] px-2 py-0.5 rounded-full border border-[#16a34a15]">
                          Save: ৳{saveAmount}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex flex-col md:flex-row items-center gap-2">
                    <button
                    onClick={() => addToCart(product)}
                     className="w-full md:flex-1 border-[1.5px] border-[#f97316] text-[#f97316] hover:bg-[#f97316] hover:text-white transition-all h-[38px] md:h-[45px] rounded-xl font-bold text-[11px] md:text-[13px] flex items-center justify-center gap-2 group/btn cursor-pointer">
                      <ShoppingCart className="w-4 h-4 transition-transform group-hover/btn:scale-110" /> 
                      Add To Cart
                    </button>
                    
                    <button
                    onClick={() => buyNow(product)}
                     className="hidden md:flex w-full md:flex-1 bg-[#f97316] text-white h-[45px] rounded-xl font-bold text-[13px] hover:bg-[#ea580c] transition-colors items-center justify-center cursor-pointer">
                      Buy Now
                    </button>
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