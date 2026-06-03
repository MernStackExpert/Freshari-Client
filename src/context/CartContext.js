"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [buyNowItem, setBuyNowItem] = useState(null); 
  const router = useRouter();

  useEffect(() => {
    const savedCart = localStorage.getItem("Arshe-Mart-cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    const savedBuyNow = localStorage.getItem("Arshe-Mart-buy-now");
    if (savedBuyNow) {
      setBuyNowItem(JSON.parse(savedBuyNow));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("Arshe-Mart-cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    const isExist = cart.find((item) => item._id === product._id);
    if (isExist) {
      toast.success("পণ্যটির পরিমাণ বাড়ানো হয়েছে");
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item,
        ),
      );
    } else {
      toast.success("কার্টে যোগ করা হয়েছে");
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const buyNow = (product) => {
    const directProduct = { ...product, quantity: 1 };

    setBuyNowItem(directProduct);
    localStorage.setItem("Arshe-Mart-buy-now", JSON.stringify(directProduct));

    router.push("/checkout?mode=direct");
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        setCart,
        buyNow,
        buyNowItem, 
        setBuyNowItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
