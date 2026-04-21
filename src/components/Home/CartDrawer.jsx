"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

const CartDrawer = ({ isOpen, setIsOpen }) => {
  const { cart, addToCart, removeFromCart, setCart } = useCart();

  const totalPrice = cart.reduce((total, item) => total + item.pricing.price * item.quantity, 0);

  const updateQuantity = (product, type) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item._id === product._id
          ? {
              ...item,
              quantity: type === "plus" ? item.quantity + 1 : Math.max(1, item.quantity - 1),
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[2000]"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-full max-w-[400px] bg-white z-[2001] shadow-2xl flex flex-col"
          >
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-[#fcfdfd]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#16a34a]" />
                <h2 className="text-lg font-black text-[#064e3b] uppercase">আপনার কার্ট ({cart.length})</h2>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
              {cart.length > 0 ? (
                cart.map((item) => (
                  <div key={item._id} className="flex gap-4 bg-gray-50 p-3 rounded-2xl border border-gray-100 group">
                    <div className="relative w-20 h-20 bg-white rounded-xl overflow-hidden border border-gray-100 shrink-0">
                      <Image src={item.media.thumbnail} alt={item.name} fill className="object-contain p-2" />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-[#064e3b] line-clamp-1">{item.name}</h4>
                        <p className="text-xs text-gray-400 mt-1">৳{item.pricing.price} / {item.inventory.unit}</p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center bg-white border border-gray-200 rounded-lg overflow-hidden">
                          <button 
                            onClick={() => updateQuantity(item, "minus")}
                            className="p-1 hover:bg-gray-100 text-gray-500 cursor-pointer"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-3 text-sm font-bold text-[#064e3b]">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item, "plus")}
                            className="p-1 hover:bg-gray-100 text-gray-500 cursor-pointer"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item._id)}
                          className="text-red-400 hover:text-red-600 p-1 cursor-pointer transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                   <ShoppingBag className="w-20 h-20 text-gray-300" />
                   <p className="text-lg font-bold text-[#064e3b]">কার্ট একদম খালি!</p>
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-gray-100 bg-[#fcfdfd] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 font-bold">মোট টাকা:</span>
                  <span className="text-xl font-black text-[#16a34a]">৳ {totalPrice.toFixed(2)}</span>
                </div>
                <Link 
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="block w-full bg-[#16a34a] text-white text-center py-4 rounded-2xl font-black uppercase tracking-wider hover:bg-[#15803d] transition-all shadow-lg shadow-[#16a34a30]"
                >
                  Checkout Now
                </Link>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center text-gray-400 font-bold text-sm hover:text-[#064e3b] transition-colors"
                >
                  শপিং চালিয়ে যান
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;