"use client";
import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Trash2, Plus, Minus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
const CheckoutPage = () => {
  const { cart, removeFromCart, setCart } = useCart();
  const router = useRouter();
  
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState({ type: "", amount: 0 });
  const [isApplying, setIsApplying] = useState(false);
  const [isOrdering, setIsOrdering] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "", // এখন এটি অপশনাল
    whatsapp: "",
    postCode: "",
    address: "",
    note: ""
  });
  const [errors, setErrors] = useState({});

  const subTotal = cart?.reduce((total, item) => {
    const price = Number(item.pricing?.price || 0);
    const quantity = Number(item.quantity || 0);
    return total + (price * quantity);
  }, 0) || 0;

  const calculateDeliveryCharge = () => {
    if (subTotal >= 4990) return 0;
    if (!cart || cart.length === 0) return 60;
    const maxCharge = cart.reduce((max, item) => {
      const charge = Number(item.shipping?.deliveryCharge || 0);
      return charge > max ? charge : max;
    }, 60);
    return maxCharge;
  };

  const deliveryCharge = calculateDeliveryCharge();

  const calculateDiscountValue = () => {
    if (discount.type === "percentage") {
      return (subTotal * (discount.amount || 0)) / 100;
    }
    return discount.amount || 0;
  };

  const discountValue = calculateDiscountValue();
  const finalTotal = (subTotal - discountValue + deliveryCharge);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const updateQuantity = (id, type) => {
    setCart(prev => prev.map(item => 
      item._id === id ? { ...item, quantity: type === 'plus' ? item.quantity + 1 : Math.max(1, item.quantity - 1) } : item
    ));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return toast.error("কুপন কোড দিন");
    try {
      setIsApplying(true);
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/coupons/validate`, {
        code: couponCode,
        orderAmount: subTotal
      });
      setDiscount({ type: res.data.discountType, amount: res.data.discountAmount });
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "কুপনটি সঠিক নয়");
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
    toast.error("স্টার চিহ্নিত ফিল্ডগুলো পূরণ করুন");
    return;
  }

  try {
    setIsOrdering(true);
    const orderData = {
      email: formData.email || "no-email@freshari.com",
      name: formData.name,
      phone: formData.phone,
      whatsapp: formData.whatsapp || "N/A",
      note: formData.note || "No special notes",
      total: finalTotal,
      shippingAddress: `${formData.address}${formData.postCode ? ', Post: ' + formData.postCode : ''}`,
      products: cart.map(item => ({
        _id: item._id,
        name: item.name,
        price: item.pricing.price,
        quantity: item.quantity,
        thumbnail: item.media.thumbnail
      }))
    };

    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/orders`, orderData);
    
    // আপনার ব্যাকএন্ড res.status(201).send({ message: "...", orderId: result.insertedId }) পাঠাচ্ছে
    // তাই আমরা res.data.orderId চেক করব
    if (res.status === 201 && res.data) {
      toast.success("অর্ডার সফল হয়েছে!");
      
      // কার্ট ক্লিয়ার করা
      if (typeof clearCart === 'function') {
        clearCart(); 
      } else {
        localStorage.removeItem("freshari-cart");
        setCart([]); 
      }

      // অর্ডার আইডি থাকলে সেটি দিন, না থাকলে 'success'
      const idForUrl = res.data.orderId || 'success';
      
      // রিডাইরেক্ট করার আগে সামান্য ডিলে দেওয়া ভালো যাতে স্টেট আপডেট হওয়ার সময় পায়
      router.push(`/thank-you?orderId=${idForUrl}`);
    }
  } catch (error) {
    console.error("Order Error:", error);
    // যদি অর্ডার ব্যাকএন্ডে সেভ হয়ে যায় কিন্তু নেটওয়ার্ক এরর দেখায়, 
    // তবে এই এরর মেসেজটি ইউজারকে কনফিউজ করতে পারে।
    toast.error(error.response?.data?.message || "অর্ডার করতে সমস্যা হয়েছে, আবার চেষ্টা করুন");
  } finally {
    setIsOrdering(false);
  }
};

  if (!cart || cart.length === 0) {
    return <div className="py-20 text-center font-bold">আপনার কার্ট খালি!</div>;
  }

  
  return (
    <div className="bg-[#f3f4f9] min-h-screen py-10 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Order Review & Address */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-gray-800 font-bold mb-4 border-l-4 border-orange-500 pl-3 uppercase text-sm tracking-widest">Order review</h3>
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item._id} className="flex items-center justify-between border-b border-gray-100 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 relative bg-gray-50 rounded-lg p-1 shrink-0">
                      <Image src={item.media?.thumbnail || ""} alt={item.name} fill className="object-contain" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-700">{item.name}</h4>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gray-500 font-bold uppercase">Qty:</span>
                        {/* কোয়ান্টিটি বাটনসমূহ */}
                        <div className="flex items-center bg-gray-100 rounded-lg p-1 border border-gray-200">
                          <button onClick={() => updateQuantity(item._id, 'minus')} className="p-1 hover:text-orange-500 transition-colors cursor-pointer"><Minus className="w-3 h-3" /></button>
                          <span className="px-2 text-xs font-black text-[#064e3b]">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item._id, 'plus')} className="p-1 hover:text-orange-500 transition-colors cursor-pointer"><Plus className="w-3 h-3" /></button>
                        </div>
                        <span className="text-sm font-black text-gray-800 ml-2">৳{(item.pricing.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item._id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-gray-800 font-bold mb-6 border-l-4 border-orange-500 pl-3 uppercase text-sm tracking-widest">Shipping Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="name" onChange={handleInputChange} className={`w-full p-4 bg-gray-50 border ${errors.name ? 'border-red-500' : 'border-gray-100'} rounded-xl outline-none text-sm font-medium`} placeholder="Your Full Name *" />
              <input name="phone" onChange={handleInputChange} className={`w-full p-4 bg-gray-50 border ${errors.phone ? 'border-red-500' : 'border-gray-100'} rounded-xl outline-none text-sm font-medium`} placeholder="017******** *" />
              <input name="email" onChange={handleInputChange} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none text-sm font-medium" placeholder="Email (Optional)" />
              <input name="whatsapp" onChange={handleInputChange} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none text-sm font-medium" placeholder="WhatsApp Number (Optional)" />
              <input name="postCode" onChange={handleInputChange} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none text-sm font-medium" placeholder="Post Code (Optional)" />
              <div className="md:col-span-2">
                <textarea name="address" onChange={handleInputChange} rows="3" className={`w-full p-4 bg-gray-50 border ${errors.address ? 'border-red-500' : 'border-gray-100'} rounded-xl outline-none text-sm font-medium`} placeholder="ex: House no. / building / street / area *"></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Summary & Payment */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-gray-800 font-bold mb-4 border-l-4 border-orange-500 pl-3 uppercase text-sm tracking-widest">Payment method</h3>
            <div className="flex gap-4">
              <div className="flex-1 p-4 border-2 border-[#16a34a] bg-[#f0fdf4] rounded-xl flex items-center gap-3 cursor-pointer">
                <div className="w-4 h-4 bg-[#16a34a] rounded-full ring-4 ring-[#16a34a]/20"></div>
                <span className="text-xs font-black text-[#064e3b]">Cash On Delivery</span>
              </div>
              <div 
                onClick={() => toast.error("অনলাইন পেমেন্ট বর্তমানে বন্ধ আছে")}
                className="flex-1 p-4 border border-gray-100 rounded-xl flex items-center gap-3 opacity-40 cursor-not-allowed"
              >
                <span className="text-xs font-bold text-gray-400">Online Payment</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
             <div className="flex gap-2">
                <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} className="flex-1 p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none text-sm font-bold" placeholder="Enter Coupon" />
                <button onClick={handleApplyCoupon} disabled={isApplying} className="bg-[#064e3b] text-white px-6 py-4 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-[#16a34a] transition-all cursor-pointer">
                  {isApplying ? "..." : "Apply"}
                </button>
             </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex justify-between text-sm font-bold text-gray-500">
              <span>Sub total</span>
              <span>{subTotal.toLocaleString()} BDT</span>
            </div>
            {discountValue > 0 && (
              <div className="flex justify-between text-sm text-[#16a34a] font-black">
                <span>Discount</span>
                <span>- {discountValue.toLocaleString()} BDT</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-gray-500">
              <span>Delivery cost</span>
              <span>{deliveryCharge === 0 ? "FREE" : `${deliveryCharge} BDT`}</span>
            </div>
            <div className="flex justify-between text-xl font-black text-[#064e3b] border-t pt-4">
              <span>Total</span>
              <span>{finalTotal.toLocaleString()} BDT</span>
            </div>
            
            <div className="pt-4 space-y-3">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[2px]">Special notes (Optional)</p>
              <textarea name="note" onChange={handleInputChange} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none text-sm font-medium" rows="2"></textarea>
            </div>

            <button 
              onClick={handlePlaceOrder} 
              disabled={isOrdering}
              className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white py-5 rounded-2xl font-black uppercase tracking-[2px] transition-all shadow-lg shadow-orange-200 disabled:opacity-50 cursor-pointer"
            >
              {isOrdering ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;