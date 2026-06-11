"use client";
import React, { useState, Suspense } from "react";
import { useCart } from "@/context/CartContext";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Trash2, Plus, Minus, Tag, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

const CheckoutForm = () => {
  const { cart, removeFromCart, setCart, buyNowItem, setBuyNowItem } =
    useCart();
  const router = useRouter();
  const searchParams = useSearchParams();

  const isDirectMode = searchParams.get("mode") === "direct";
  const activeCart = isDirectMode ? (buyNowItem ? [buyNowItem] : []) : cart;

  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState({ type: "", amount: 0 });
  const [isApplying, setIsApplying] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    whatsapp: "",
    postCode: "",
    address: "",
    note: "",
  });
  const [errors, setErrors] = useState({});

  const subTotal =
    activeCart?.reduce((total, item) => {
      const price = Number(item.pricing?.price || 0);
      const quantity = Number(item.quantity || 0);
      return total + price * quantity;
    }, 0) || 0;

  const calculateDeliveryCharge = () => {
    if (!activeCart || activeCart.length === 0) return 0;
    return activeCart.reduce((max, item) => {
      const charge = item.shipping?.freeDelivery
        ? 0
        : Number(item.shipping?.deliveryCharge || 0);
      return charge > max ? charge : max;
    }, 0);
  };

  const deliveryCharge = calculateDeliveryCharge();

  const calculateDiscountValue = () => {
    if (discount.type === "percentage") {
      return (subTotal * (discount.amount || 0)) / 100;
    }
    return discount.amount || 0;
  };

  const discountValue = calculateDiscountValue();
  const finalTotal = subTotal - discountValue + deliveryCharge;

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleUpdateQuantity = (id, type) => {
    if (isDirectMode) {
      if (buyNowItem && buyNowItem._id === id) {
        const newQty =
          type === "plus"
            ? buyNowItem.quantity + 1
            : Math.max(1, buyNowItem.quantity - 1);
        const updatedItem = { ...buyNowItem, quantity: newQty };
        setBuyNowItem(updatedItem);
        localStorage.setItem("Arshe-Mart-buy-now", JSON.stringify(updatedItem));
      }
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                quantity:
                  type === "plus"
                    ? item.quantity + 1
                    : Math.max(1, item.quantity - 1),
              }
            : item,
        ),
      );
    }
  };

  const handleRemoveItem = (id) => {
    if (isDirectMode) {
      setBuyNowItem(null);
      localStorage.removeItem("Arshe-Mart-buy-now");
    } else {
      removeFromCart(id);
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return toast.error("Please enter a coupon code");
    try {
      setIsApplying(true);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/coupons/validate`,
        {
          code: couponCode,
          orderAmount: subTotal,
        },
      );
      setDiscount({
        type: res.data.discountType,
        amount: res.data.discountAmount,
      });
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid coupon code");
      setDiscount({ type: "", amount: 0 });
    } finally {
      setIsApplying(false);
    }
  };

  const handlePlaceOrder = async () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = true;
    if (!formData.phone) newErrors.phone = true;
    if (!formData.address) newErrors.address = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fill in all required fields marked with *");
      return;
    }

    try {
      setIsOrdering(true);
      const orderData = {
        email: formData.email || "no-email@Arshe-Mart.com",
        name: formData.name,
        phone: formData.phone,
        whatsapp: formData.whatsapp || "N/A",
        note: formData.note || "No special notes",
        total: finalTotal,
        shippingAddress: `${formData.address}${formData.postCode ? ", Post: " + formData.postCode : ""}`,
        products: activeCart.map((item) => ({
          _id: item._id,
          name: item.name,
          price: item.pricing.price,
          quantity: item.quantity,
          thumbnail: item.media.thumbnail,
        })),
      };

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/orders`,
        orderData,
      );

      if (res.status === 201 && res.data) {
        toast.success("Order placed successfully!");

        if (isDirectMode) {
          setBuyNowItem(null);
          localStorage.removeItem("Arshe-Mart-buy-now");
        } else {
          setCart([]);
          localStorage.removeItem("Arshe-Mart-cart");
        }

        const idForUrl = res.data.orderId || "success";
        router.push(`/thank-you?orderId=${idForUrl}`);
      }
    } catch (error) {
      console.error("Order Error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to place order, please try again",
      );
    } finally {
      setIsOrdering(false);
    }
  };

  if (!activeCart || activeCart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#f8fafc] font-sans">
        <div className="w-28 h-28 bg-white shadow-sm rounded-full flex items-center justify-center mb-6">
          <Trash2 className="w-12 h-12 text-[#94a3b8]" />
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-[#0f172a] mb-3 tracking-tight">
          Your Cart is Empty!
        </h2>
        <p className="text-[#64748b] font-medium mb-8">
          Looks like you haven't added any products to your cart yet.
        </p>
        <button
          onClick={() => router.push("/product/shop")}
          className="px-10 py-4 bg-[#0f172a] text-white rounded-2xl font-black uppercase tracking-widest hover:bg-[#1e293b] hover:shadow-[0_10px_20px_rgba(15,23,42,0.15)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen py-16 px-4 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white rounded-[2rem] p-8 lg:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100">
            <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-5">
              <span className="w-10 h-10 bg-[#0f172a] text-white flex items-center justify-center rounded-xl font-black text-lg shadow-md">
                1
              </span>
              <h3 className="text-2xl font-black text-[#0f172a] uppercase tracking-widest">
                Order Review
              </h3>
            </div>

            <div className="space-y-5">
              {activeCart.map((item) => (
                <div
                  key={item._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl bg-[#f8fafc] border border-gray-100 gap-6 transition-all hover:border-[#f97316]/30 hover:shadow-sm"
                >
                  <div className="flex items-center gap-5">
                    <div className="w-24 h-24 relative bg-white rounded-xl p-2 shadow-sm shrink-0 border border-gray-100">
                      <Image
                        src={item.media?.thumbnail || ""}
                        alt={item.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <h4 className="text-base font-black text-[#0f172a] line-clamp-2 leading-tight">
                        {item.name}
                      </h4>
                      <span className="text-lg font-black text-[#f97316]">
                        ৳{(item.pricing.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-5">
                    <div className="flex items-center bg-white rounded-xl p-1.5 border border-gray-200 shadow-sm">
                      <button
                        onClick={() => handleUpdateQuantity(item._id, "minus")}
                        className="p-2.5 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                      >
                        <Minus className="w-4 h-4 text-[#64748b]" />
                      </button>
                      <span className="w-10 text-center font-black text-lg text-[#0f172a]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item._id, "plus")}
                        className="p-2.5 hover:bg-orange-50 hover:text-[#f97316] rounded-lg transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4 text-[#64748b]" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item._id)}
                      className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors cursor-pointer border border-red-100 hover:border-red-500 shadow-sm"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-8 lg:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100">
            <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-5">
              <span className="w-10 h-10 bg-[#0f172a] text-white flex items-center justify-center rounded-xl font-black text-lg shadow-md">
                2
              </span>
              <h3 className="text-2xl font-black text-[#0f172a] uppercase tracking-widest">
                Shipping Details
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <input
                  name="name"
                  onChange={handleInputChange}
                  className={`w-full p-4.5 bg-[#f8fafc] border ${errors.name ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-[#f97316] focus:ring-[#f97316]/10"} rounded-xl focus:ring-4 transition-all outline-none text-sm font-bold text-[#0f172a] placeholder:font-medium placeholder:text-gray-400`}
                  placeholder="Your Full Name *"
                />
              </div>
              <input
                name="phone"
                onChange={handleInputChange}
                className={`w-full p-4.5 bg-[#f8fafc] border ${errors.phone ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-[#f97316] focus:ring-[#f97316]/10"} rounded-xl focus:ring-4 transition-all outline-none text-sm font-bold text-[#0f172a] placeholder:font-medium placeholder:text-gray-400`}
                placeholder="Phone Number *"
              />
              <input
                name="whatsapp"
                onChange={handleInputChange}
                className="w-full p-4.5 bg-[#f8fafc] border border-gray-200 rounded-xl focus:border-[#f97316] focus:ring-4 focus:ring-[#f97316]/10 transition-all outline-none text-sm font-bold text-[#0f172a] placeholder:font-medium placeholder:text-gray-400"
                placeholder="WhatsApp Number (Optional)"
              />
              <input
                name="email"
                onChange={handleInputChange}
                className="w-full p-4.5 bg-[#f8fafc] border border-gray-200 rounded-xl focus:border-[#f97316] focus:ring-4 focus:ring-[#f97316]/10 transition-all outline-none text-sm font-bold text-[#0f172a] placeholder:font-medium placeholder:text-gray-400"
                placeholder="Email Address (Optional)"
              />
              <input
                name="postCode"
                onChange={handleInputChange}
                className="w-full p-4.5 bg-[#f8fafc] border border-gray-200 rounded-xl focus:border-[#f97316] focus:ring-4 focus:ring-[#f97316]/10 transition-all outline-none text-sm font-bold text-[#0f172a] placeholder:font-medium placeholder:text-gray-400"
                placeholder="Post Code (Optional)"
              />
              <div className="md:col-span-2">
                <textarea
                  name="address"
                  onChange={handleInputChange}
                  rows="3"
                  className={`w-full p-4.5 bg-[#f8fafc] border ${errors.address ? "border-red-400 focus:ring-red-100" : "border-gray-200 focus:border-[#f97316] focus:ring-[#f97316]/10"} rounded-xl focus:ring-4 transition-all outline-none text-sm font-bold text-[#0f172a] resize-none placeholder:font-medium placeholder:text-gray-400`}
                  placeholder="Detailed Delivery Address (House/Road/Area) *"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-8">
          <div className="bg-white rounded-[2rem] p-8 shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-gray-100">
            <h3 className="text-lg font-black text-[#0f172a] uppercase tracking-widest mb-6 pb-4 border-b border-gray-100">
              Payment Method
            </h3>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex-1 p-5 border-2 border-[#f97316] bg-orange-50 rounded-xl flex items-center gap-4 cursor-pointer relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <CheckCircle2 className="w-6 h-6 text-[#f97316] fill-white" />
                <span className="text-sm font-black text-[#0f172a]">
                  Cash On Delivery
                </span>
              </div>
              <div
                onClick={() =>
                  toast.error("Online payment is currently unavailable")
                }
                className="flex-1 p-5 border border-gray-200 bg-[#f8fafc] rounded-xl flex items-center gap-4 opacity-60 cursor-not-allowed"
              >
                <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                <span className="text-sm font-bold text-gray-500">
                  Online Payment
                </span>
              </div>
            </div>

            <div className="mb-8 pt-6 border-t border-gray-100">
              {!showCouponInput ? (
                <button
                  onClick={() => setShowCouponInput(true)}
                  className="flex items-center gap-2 text-[#f97316] hover:text-[#ea580c] transition-colors text-sm font-black tracking-widest uppercase group w-full justify-center p-4 bg-orange-50 rounded-xl border border-[#f97316]/20 cursor-pointer"
                >
                  <Tag className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  Apply Coupon Code
                </button>
              ) : (
                <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex gap-2">
                    <input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 p-4 bg-[#f8fafc] border border-gray-200 rounded-xl outline-none focus:border-[#f97316] transition-all text-sm font-bold uppercase tracking-widest placeholder:normal-case placeholder:tracking-normal placeholder:font-medium placeholder:text-gray-400"
                      placeholder="Enter code here"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={isApplying}
                      className="bg-[#0f172a] text-white px-8 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-[#1e293b] transition-all shadow-md cursor-pointer disabled:opacity-50"
                    >
                      {isApplying ? "..." : "Apply"}
                    </button>
                  </div>
                  <button
                    onClick={() => setShowCouponInput(false)}
                    className="text-xs text-gray-400 font-bold hover:text-red-500 text-left pl-2 cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4 bg-[#f8fafc] p-6 rounded-2xl border border-gray-100">
              <div className="flex justify-between text-sm font-bold text-gray-500">
                <span>Subtotal</span>
                <span className="text-[#0f172a]">
                  ৳{subTotal.toLocaleString()}
                </span>
              </div>
              {discountValue > 0 && (
                <div className="flex justify-between text-sm text-[#16a34a] font-black">
                  <span>Discount</span>
                  <span>- ৳{discountValue.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold text-gray-500 pb-4 border-b border-gray-200">
                <span>Delivery Charge</span>
                <span className="text-[#0f172a]">
                  {deliveryCharge === 0 ? "FREE" : `৳${deliveryCharge}`}
                </span>
              </div>
              <div className="flex justify-between items-end pt-2">
                <span className="text-lg font-black text-[#0f172a]">Total</span>
                <span className="text-3xl font-black text-[#f97316]">
                  ৳{finalTotal.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-8 mb-8 space-y-3">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                Special Notes (Optional)
              </p>
              <textarea
                name="note"
                onChange={handleInputChange}
                className="w-full p-4.5 bg-[#f8fafc] border border-gray-200 rounded-xl focus:border-[#f97316] focus:ring-4 focus:ring-[#f97316]/10 transition-all outline-none text-sm font-bold resize-none placeholder:font-medium placeholder:text-gray-400"
                rows="2"
                placeholder="Any special instructions for delivery..."
              ></textarea>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isOrdering}
              className="w-full bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#c2410c] text-white py-5 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-[0_10px_20px_rgba(249,115,22,0.2)] hover:shadow-[0_15px_30px_rgba(249,115,22,0.3)] hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 cursor-pointer"
            >
              {isOrdering ? "Processing..." : "Confirm Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CheckoutPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
          <div className="w-12 h-12 border-4 border-[#0f172a] border-t-[#f97316] rounded-full animate-spin"></div>
        </div>
      }
    >
      <CheckoutForm />
    </Suspense>
  );
};

export default CheckoutPage;
