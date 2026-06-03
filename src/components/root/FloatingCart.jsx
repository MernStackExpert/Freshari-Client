"use client";
import React, { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import CartDrawer from "../Home/CartDrawer";

const FloatingCart = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cart } = useCart();

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce(
    (total, item) => total + item.pricing.price * item.quantity,
    0,
  );

  if (cartCount === 0) return null;

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="fixed left-0 top-1/2 -translate-y-1/2 z-[1000] cursor-pointer group transition-transform hover:scale-105 active:scale-95"
      >
        <div className="bg-gradient-to-b from-[#064e3b] to-[#0a5c47] shadow-[5px_5px_25px_rgba(6,78,59,0.3)] rounded-r-2xl p-2.5 md:p-3.5 flex flex-col items-center justify-center gap-2 border-y border-r border-[#16a34a]/30 group-hover:from-[#16a34a] group-hover:to-[#15803d] transition-all duration-300">
          <div className="relative">
            <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-white drop-shadow-md" />
            <span className="absolute -top-2.5 -right-2.5 bg-[#f97316] text-white text-[10px] md:text-[11px] min-w-[20px] h-[20px] md:min-w-[22px] md:h-[22px] rounded-full flex items-center justify-center font-black border-2 border-[#064e3b] group-hover:border-[#16a34a] shadow-lg transition-colors">
              {cartCount}
            </span>
          </div>

          <div className="bg-white/15 backdrop-blur-sm px-2 md:px-2.5 py-1.5 rounded-xl text-center mt-1 border border-white/10 group-hover:bg-white/20 transition-colors">
            <span className="text-[10px] md:text-[12px] font-black text-white block drop-shadow-md">
              ৳ {totalPrice.toLocaleString()}
            </span>
            <span className="text-[8px] md:text-[9px] text-white/80 font-bold uppercase tracking-wider block mt-0.5">
              Items
            </span>
          </div>
        </div>
      </div>

      <CartDrawer isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default FloatingCart;
