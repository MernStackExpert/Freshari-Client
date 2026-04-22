"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "@/utils/axiosInstance";
import { 
  Ticket, Plus, Search, Trash2, Edit3, X, 
  Calendar, DollarSign, Users, AlertCircle, 
  CheckCircle2, Clock, ShieldCheck, Percent, Zap
} from "lucide-react";
import Swal from 'sweetalert2';
import toast from "react-hot-toast";

const CouponManagementPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountAmount: "",
    minOrderAmount: "",
    usageLimit: "",
    expiryDate: "",
    isActive: true
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await axiosInstance.get("/coupons/all");
      setCoupons(res.data);
    } catch (error) {
      toast.error("Failed to sync coupons");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numberFields = ["discountAmount", "minOrderAmount", "usageLimit"];
    setFormData({
      ...formData,
      [name]: numberFields.includes(name) ? (value === "" ? "" : Number(value)) : value
    });
  };

  const openModal = (coupon = null) => {
    if (coupon) {
      setEditId(coupon._id);
      setFormData({
        code: coupon.code,
        discountType: coupon.discountType,
        discountAmount: coupon.discountAmount,
        minOrderAmount: coupon.minOrderAmount,
        usageLimit: coupon.usageLimit || "",
        expiryDate: new Date(coupon.expiryDate).toISOString().split('T')[0],
        isActive: coupon.isActive
      });
    } else {
      setEditId(null);
      setFormData({
        code: "", discountType: "percentage", discountAmount: "",
        minOrderAmount: "", usageLimit: "", expiryDate: "", isActive: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axiosInstance.put(`/coupons/update/${editId}`, formData);
        toast.success("Master coupon updated");
      } else {
        await axiosInstance.post("/coupons/add", formData);
        toast.success("New coupon deployed");
      }
      setIsModalOpen(false);
      fetchCoupons();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Deactivate Coupon?',
      text: "This will remove the coupon from system!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      confirmButtonText: 'Yes, Delete'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/coupons/delete/${id}`);
          fetchCoupons();
          Swal.fire('Deleted!', 'Coupon removed.', 'success');
        } catch (error) {
          toast.error("Deletion failed");
        }
      }
    });
  };

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-[#062010] uppercase tracking-tighter flex items-center gap-2">
            <Ticket className="text-[#22C55E]" /> Coupon Engine
          </h1>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1 italic">Configure Marketing Discounts</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          <div className="relative group flex-1 md:w-64">
            <input
              type="text"
              placeholder="Search by code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold outline-none focus:ring-2 ring-green-100 transition-all"
            />
            <Search className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#22C55E]" size={18} />
          </div>

          <button 
            onClick={() => openModal()} 
            className="bg-[#062010] text-[#22C55E] flex items-center gap-2 px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:shadow-xl active:scale-95 transition-all cursor-pointer border border-[#22C55E]/20"
          >
            <Zap size={18} /> Create Coupon
          </button>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          Array(3).fill(0).map((_, i) => <div key={i} className="h-64 bg-gray-100 rounded-[3rem] animate-pulse"></div>)
        ) : filteredCoupons.map((coupon) => (
          <motion.div layout key={coupon._id} className={`bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden group ${!coupon.isActive && 'opacity-60'}`}>
            <div className={`absolute top-0 right-0 w-32 h-32 ${coupon.discountType === 'percentage' ? 'bg-blue-500/5' : 'bg-emerald-500/5'} rounded-bl-full -mr-12 -mt-12 blur-2xl`}></div>
            
            <div className="flex justify-between items-start mb-6">
              <div className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-2xl">
                <span className="text-xl font-black text-[#062010] tracking-widest uppercase">{coupon.code}</span>
              </div>
              <div className={`p-2 rounded-xl ${coupon.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {coupon.isActive ? <CheckCircle2 size={20}/> : <AlertCircle size={20}/>}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Benefit</p>
                <p className="text-lg font-black text-[#22C55E]">
                  {coupon.discountType === 'percentage' ? `${coupon.discountAmount}% OFF` : `৳${coupon.discountAmount} OFF`}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-dashed border-gray-100">
                <div>
                  <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Min Order</p>
                  <p className="text-xs font-bold text-[#062010]">৳{coupon.minOrderAmount}</p>
                </div>
                <div>
                  <p className="text-[8px] font-black text-gray-400 uppercase mb-1">Expiry Date</p>
                  <p className="text-xs font-bold text-[#062010]">{new Date(coupon.expiryDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <Users size={14} className="text-gray-400"/>
                   <span className="text-[10px] font-black text-gray-500 uppercase">
                     Used: {coupon.usedCount} / {coupon.usageLimit || '∞'}
                   </span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openModal(coupon)} className="p-2 bg-gray-50 text-gray-400 hover:bg-[#062010] hover:text-white rounded-lg transition-all cursor-pointer"><Edit3 size={16}/></button>
                  <button onClick={() => handleDelete(coupon._id)} className="p-2 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all cursor-pointer"><Trash2 size={16}/></button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Master Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-[#062010]/80 backdrop-blur-md cursor-pointer" />
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-white w-full max-w-xl rounded-[3.5rem] overflow-hidden shadow-2xl relative z-10 font-sans">
              <div className="p-10 space-y-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-black text-[#062010] uppercase tracking-tighter">
                      {editId ? "Modify Coupon" : "Deploy Coupon"}
                    </h2>
                    <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest mt-1">Configure Logic & Validity</p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-2.5 bg-gray-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer"><X size={20}/></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1 col-span-2 md:col-span-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Promo Code</label>
                      <input required type="text" name="code" value={formData.code} onChange={handleInputChange} placeholder="SAVE50" className="w-full bg-gray-50 rounded-2xl p-4 text-sm font-black uppercase outline-none border border-transparent focus:border-[#22C55E]/20" />
                    </div>
                    <div className="space-y-1 col-span-2 md:col-span-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Discount Type</label>
                      <select name="discountType" value={formData.discountType} onChange={handleInputChange} className="w-full bg-gray-50 rounded-2xl p-4 text-sm font-bold outline-none cursor-pointer">
                        <option value="percentage">Percentage (%)</option>
                        <option value="fixed">Fixed Amount (৳)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Amount</label>
                      <div className="relative">
                        <input required type="number" name="discountAmount" value={formData.discountAmount} onChange={handleInputChange} className="w-full bg-gray-50 rounded-2xl p-4 text-sm font-black outline-none" />
                        <span className="absolute right-4 top-4 text-gray-300">{formData.discountType === 'percentage' ? <Percent size={16}/> : '৳'}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Min Order</label>
                      <input required type="number" name="minOrderAmount" value={formData.minOrderAmount} onChange={handleInputChange} className="w-full bg-gray-50 rounded-2xl p-4 text-sm font-black outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Usage Limit</label>
                      <input type="number" name="usageLimit" value={formData.usageLimit} onChange={handleInputChange} placeholder="∞" className="w-full bg-gray-50 rounded-2xl p-4 text-sm font-black outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Expiry Date</label>
                      <input required type="date" name="expiryDate" value={formData.expiryDate} onChange={handleInputChange} className="w-full bg-gray-50 rounded-2xl p-4 text-sm font-bold outline-none cursor-pointer" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-5 bg-gray-50 rounded-[2rem]">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-xl shadow-sm"><ShieldCheck size={18} className="text-[#22C55E]"/></div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-[#062010]">Status Control</p>
                        <p className="text-[8px] font-bold text-gray-400 uppercase mt-0.5">Toggle Coupon Availability</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => setFormData({...formData, isActive: !formData.isActive})} className={`w-12 h-6 rounded-full transition-all relative cursor-pointer ${formData.isActive ? 'bg-[#22C55E]' : 'bg-gray-200'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isActive ? 'right-1' : 'left-1'}`}></div>
                    </button>
                  </div>

                  <button type="submit" className="w-full bg-[#22C55E] text-[#062010] py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] hover:shadow-2xl hover:shadow-green-200 transition-all cursor-pointer">
                    {editId ? "Synchronize Updates" : "Initialize Coupon"}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CouponManagementPage;