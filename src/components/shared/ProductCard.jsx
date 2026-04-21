"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Zap } from "lucide-react";
import { useCart } from "@/context/CartContext";

const ProductCard = ({ product }) => {
  const hasDiscount = product.pricing.oldPrice > product.pricing.price;
  const saveAmount = hasDiscount
    ? product.pricing.oldPrice - product.pricing.price
    : 0;

  const { addToCart } = useCart();

  return (
    <div className="group relative bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all p-2 md:p-4 flex flex-col h-full">
      {/* Badge */}
      {product.status.isFeatured && (
        <div className="absolute top-0 right-0 z-10">
          <span className="bg-[#ff4d4d] text-white text-[9px] md:text-[10px] font-bold px-2 py-1 rounded-bl-xl flex items-center gap-1">
            <Zap className="w-3 h-3 fill-current" /> Best Selling
          </span>
        </div>
      )}

      {/* Image Section */}
      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#f9f9f9] cursor-pointer"
      >
        <Image
          src={product.media.thumbnail}
          alt={product.name}
          fill
          className="object-contain p-3 transition-transform duration-500 group-hover:scale-110"
        />
      </Link>

      {/* Info Section */}
      <div className="mt-3 flex flex-col flex-1">
        <Link href={`/product/${product.slug}`} className="cursor-pointer">
          <h3 className="text-[13px] md:text-[15px] font-bold text-[#064e3b] hover:text-[#16a34a] transition-colors line-clamp-2 leading-tight">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2">
          <div className="flex items-center gap-2">
            <span className="text-[16px] md:text-[18px] font-black text-[#f97316]">
              ৳{product.pricing.price}
            </span>
            {hasDiscount && (
              <span className="text-[11px] md:text-[13px] text-gray-400 line-through">
                ৳{product.pricing.oldPrice}
              </span>
            )}
          </div>

          {hasDiscount && (
            <div className="mt-1">
              <span className="text-[10px] font-bold text-[#16a34a] bg-[#f0fdf4] px-2 py-0.5 rounded-full border border-[#16a34a10]">
                Save: ৳{saveAmount}
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-auto pt-4">
          <button
            onClick={() => addToCart(product)}
            className="w-full border-[1.5px] border-[#f97316] text-[#f97316] hover:bg-[#f97316] hover:text-white transition-all py-2 rounded-xl font-bold text-[11px] md:text-[13px] flex items-center justify-center gap-2 cursor-pointer group/btn"
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
