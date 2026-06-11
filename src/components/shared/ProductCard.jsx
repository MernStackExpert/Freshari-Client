"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingCart, Zap } from "lucide-react";
import { useCart } from "@/context/CartContext";

const ProductCard = ({ product }) => {
  const router = useRouter();
  const { addToCart } = useCart();

  const hasDiscount = product.pricing?.oldPrice > product.pricing?.price;
  const saveAmount = hasDiscount
    ? product.pricing.oldPrice - product.pricing.price
    : 0;

  const handleCardClick = () => {
    router.push(`/product/${product.slug}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(15,23,42,0.08)] hover:border-[#0f172a]/10 transition-all duration-300 p-3 md:p-4 flex flex-col h-full cursor-pointer"
    >
      {product.status?.isFeatured && (
        <div className="absolute top-0 right-0 z-10">
          <span className="bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white text-[9px] md:text-[10px] font-black px-3 py-1.5 rounded-bl-xl flex items-center gap-1 shadow-md">
            <Zap className="w-3 h-3 fill-current" /> Best Selling
          </span>
        </div>
      )}

      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#f8fafc]">
        <Image
          src={product.media?.thumbnail}
          alt={product.name}
          fill
          className="object-contain p-4 transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      <div className="mt-4 flex flex-col flex-1">
        <h3 className="text-[13px] md:text-[15px] font-black text-[#0f172a] group-hover:text-[#f97316] transition-colors line-clamp-2 leading-snug">
          {product.name}
        </h3>

        <div className="mt-2.5">
          <div className="flex items-center gap-2">
            <span className="text-[16px] md:text-[18px] font-black text-[#f97316]">
              ৳{product.pricing?.price}
            </span>
            {hasDiscount && (
              <span className="text-[12px] md:text-[13px] text-gray-400 font-bold line-through">
                ৳{product.pricing.oldPrice}
              </span>
            )}
          </div>

          {hasDiscount && (
            <div className="mt-1.5">
              <span className="text-[10px] font-black text-[#16a34a] bg-[#f0fdf4] px-2.5 py-1 rounded-md border border-[#16a34a]/20 uppercase tracking-wide">
                Save: ৳{saveAmount}
              </span>
            </div>
          )}
        </div>

        <div className="mt-auto pt-5">
          <button
            onClick={handleAddToCart}
            className="w-full bg-[#f8fafc] border border-gray-200 text-[#0f172a] hover:bg-[#0f172a] hover:text-white hover:border-[#0f172a] transition-all duration-300 py-2.5 rounded-xl font-black text-[12px] md:text-[13px] flex items-center justify-center gap-2 group/btn uppercase tracking-wide cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
