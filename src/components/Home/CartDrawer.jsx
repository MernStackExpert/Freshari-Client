"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

const CartDrawer = ({ isOpen, setIsOpen }) => {
  const { cart, removeFromCart, setCart } = useCart();

  const totalPrice = cart.reduce(
    (total, item) => total + item.pricing.price * item.quantity,
    0
  );

  const updateQuantity = (product, type) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === product._id
          ? {
              ...item,
              quantity:
                type === "plus"
                  ? item.quantity + 1
                  : Math.max(1, item.quantity - 1),
            }
          : item
      )
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-[#0f172a]/60 backdrop-blur-sm z-[2000]"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-[420px] bg-white z-[2001] shadow-2xl flex flex-col"
          >
            <div className="p-5 lg:p-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-orange-50 flex items-center justify-center rounded-xl border border-orange-100">
                  <ShoppingBag className="w-5 h-5 text-[#f97316]" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-[#0f172a] uppercase tracking-widest">
                    Your Cart
                  </h2>
                  <p className="text-xs font-bold text-gray-400 mt-0.5">
                    {cart.length} {cart.length === 1 ? "Item" : "Items"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2.5 bg-[#f8fafc] hover:bg-red-50 text-[#0f172a] hover:text-red-500 rounded-xl transition-colors cursor-pointer border border-gray-100 hover:border-red-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 lg:p-6 space-y-4 no-scrollbar bg-[#f8fafc]">
              {cart.length > 0 ? (
                cart.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-4 bg-white p-3.5 rounded-2xl border border-gray-100 shadow-sm group hover:border-[#f97316]/30 hover:shadow-md transition-all duration-300"
                  >
                    <div className="relative w-20 h-20 bg-[#f8fafc] rounded-xl overflow-hidden border border-gray-50 shrink-0">
                      <Image
                        src={item.media.thumbnail}
                        alt={item.name}
                        fill
                        className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="text-sm font-black text-[#0f172a] line-clamp-1 group-hover:text-[#f97316] transition-colors leading-snug">
                            {item.name}
                          </h4>
                          <p className="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-wide">
                            ৳{item.pricing.price} / {item.inventory.unit}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-gray-300 hover:text-red-500 p-1.5 cursor-pointer transition-colors bg-gray-50 hover:bg-red-50 rounded-lg shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center bg-[#f8fafc] border border-gray-100 rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item, "minus")}
                            className="p-1.5 hover:bg-gray-200 text-gray-500 cursor-pointer transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center text-xs font-black text-[#0f172a]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item, "plus")}
                            className="p-1.5 hover:bg-orange-50 text-gray-500 hover:text-[#f97316] cursor-pointer transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-sm font-black text-[#f97316]">
                          ৳{(item.pricing.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-5 animate-in fade-in zoom-in duration-500">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-gray-100">
                    <ShoppingBag className="w-10 h-10 text-gray-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#0f172a] uppercase tracking-widest">
                      Cart is Empty
                    </h3>
                    <p className="text-xs font-medium text-gray-400 mt-2 max-w-[200px] mx-auto">
                      Looks like you haven't added anything to your cart yet.
                    </p>
                  </div>
                  <Link
                    href="/product/shop"
                    onClick={() => setIsOpen(false)}
                    className="mt-6 flex items-center gap-2 bg-[#0f172a] text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#1e293b] hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(15,23,42,0.15)] transition-all duration-300 group"
                  >
                    Shop Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-5 lg:p-6 border-t border-gray-100 bg-white space-y-5 shadow-[0_-10px_30px_rgba(0,0,0,0.02)] shrink-0 z-10 relative">
                <div className="flex items-end justify-between">
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                    Subtotal
                  </span>
                  <span className="text-2xl font-black text-[#0f172a] leading-none">
                    ৳ {totalPrice.toLocaleString()}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 font-bold text-center uppercase tracking-wider">
                  Shipping & taxes calculated at checkout
                </p>
                <div className="flex flex-col gap-3">
                  <Link
                    href="/checkout"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:from-[#ea580c] hover:to-[#c2410c] transition-all shadow-[0_8px_20px_rgba(249,115,22,0.25)] hover:shadow-[0_12px_25px_rgba(249,115,22,0.35)] hover:-translate-y-0.5 group"
                  >
                    Checkout Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center text-[#64748b] font-bold text-[10px] uppercase tracking-widest hover:text-[#0f172a] transition-colors py-2"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;