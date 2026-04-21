"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import { 
  ChevronLeft, Calendar, User, Tag, Star, Activity, 
  Info, Clock, DollarSign, Truck, Package, ShieldCheck, 
  Hash, BarChart3, Globe, Layers, List, Box, Zap, 
  ShieldAlert, RefreshCcw, MapPin, Mail, Image as ImageIcon
} from "lucide-react";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axiosInstance.get(`/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center font-black uppercase text-[10px] tracking-[0.4em] text-[#22C55E] animate-pulse">Master Data Syncing...</div>;
  if (!product) return <div className="text-center p-10 font-black uppercase text-red-500">Product Not Found!</div>;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-20 font-sans">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-[#062010] font-black uppercase text-[10px] tracking-widest cursor-pointer transition-all">
        <ChevronLeft size={18} /> Back to Master Inventory
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Side: Media Section */}
        <div className="lg:col-span-5 space-y-6">
           <div className="bg-white p-4 rounded-[3rem] border border-gray-100 shadow-sm sticky top-24">
              <div className="relative group">
                <img src={product.media?.thumbnail} className="w-full h-auto rounded-[2.5rem] object-cover aspect-square" alt={product.name} />
                <div className="absolute top-4 right-4 bg-[#062010]/80 backdrop-blur-md text-white text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter">
                  Primary Thumbnail
                </div>
              </div>
              
              {product.media?.images?.length > 0 && (
                <div className="mt-6">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2 flex items-center gap-2">
                    <ImageIcon size={12}/> Gallery Images ({product.media.images.length})
                  </p>
                  <div className="grid grid-cols-4 gap-3">
                    {product.media.images.map((img, i) => (
                      <img key={i} src={img} className="w-full aspect-square rounded-2xl object-cover border border-gray-100 hover:border-[#22C55E] transition-all cursor-zoom-in" alt="" />
                    ))}
                  </div>
                </div>
              )}
           </div>
        </div>

        {/* Right Side: Information Sections */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Header Info */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-4 py-1 bg-emerald-50 text-[#22C55E] text-[10px] font-black uppercase rounded-full border border-emerald-100 tracking-widest">
                {product.category?.main} / {product.category?.sub}
              </span>
              <span className="px-4 py-1 bg-gray-50 text-gray-500 text-[10px] font-black uppercase rounded-full border border-gray-200 tracking-widest">
                Brand: {product.brand}
              </span>
              <span className="px-4 py-1 bg-[#062010] text-white text-[10px] font-black uppercase rounded-full tracking-widest">
                SKU: {product.sku}
              </span>
            </div>
            <h1 className="text-4xl font-black text-[#062010] uppercase tracking-tighter leading-none">{product.name}</h1>
            <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-tighter">
              <Hash size={12}/> System ID: {product._id} | <Globe size={12}/> Slug: {product.slug}
            </div>
          </div>

          {/* Core Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><DollarSign size={10}/> Pricing</p>
              <p className="text-xl font-black text-[#22C55E]">৳{product.pricing?.price}</p>
              <p className="text-[10px] font-bold text-gray-400 line-through">৳{product.pricing?.oldPrice}</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Package size={10}/> Inventory</p>
              <p className="text-xl font-black text-[#062010]">{product.inventory?.stock}</p>
              <p className="text-[10px] font-bold text-blue-500 uppercase">{product.inventory?.unit} Unit</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Star size={10}/> Social</p>
              <p className="text-xl font-black text-orange-500">{product.social?.rating}</p>
              <p className="text-[10px] font-bold text-gray-400 uppercase">{product.social?.totalReviews} Reviews</p>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
              <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-1.5"><Zap size={10}/> Offer</p>
              <p className="text-xl font-black text-purple-600">{product.pricing?.discountPercentage}%</p>
              <p className="text-[10px] font-bold text-purple-400 uppercase">{product.pricing?.discountType}</p>
            </div>
          </div>

          {/* Status & Attributes */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
             <h4 className="text-[11px] font-black uppercase tracking-widest mb-6 flex items-center gap-2">
               <Activity size={18} className="text-[#22C55E]" /> Status & Attributes
             </h4>
             <div className="flex flex-wrap gap-3">
                <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${product.status?.isActive ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                  {product.status?.isActive ? "Active" : "Inactive"}
                </div>
                <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${product.status?.isNew ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                  New Arrival: {product.status?.isNew ? "YES" : "NO"}
                </div>
                <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${product.status?.isFeatured ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                  Featured: {product.status?.isFeatured ? "YES" : "NO"}
                </div>
                <div className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${product.status?.isTodaySpecial ? 'bg-orange-50 text-orange-600 border-orange-100 animate-pulse' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                  Today Special: {product.status?.isTodaySpecial ? "YES" : "NO"}
                </div>
                <div className="px-4 py-2 bg-gray-50 text-[#062010] text-[10px] font-black uppercase rounded-2xl border border-gray-100 tracking-widest">
                  Stock Status: {product.inventory?.stockStatus}
                </div>
             </div>
          </div>

          {/* Logistics & Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <h4 className="text-[11px] font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Truck size={18} className="text-[#22C55E]" /> Logistics Details
                </h4>
                <div className="space-y-4">
                  {[
                    { label: "Origin", val: product.shipping?.origin },
                    { label: "Delivery Charge", val: `৳${product.shipping?.deliveryCharge}` },
                    { label: "Estimate", val: product.shipping?.estimatedDelivery },
                    { label: "Shelf Life", val: product.shipping?.shelfLife },
                    { label: "Free Delivery", val: product.shipping?.freeDelivery ? "Active" : "Inactive" },
                    { label: "Min Order", val: `${product.inventory?.minOrderQuantity} ${product.inventory?.unit}` }
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs font-bold border-b border-gray-50 pb-2 last:border-0">
                      <span className="text-gray-400 uppercase text-[9px] tracking-widest">{item.label}</span>
                      <span className="text-[#062010]">{item.val}</span>
                    </div>
                  ))}
                </div>
             </div>

             <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <h4 className="text-[11px] font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                  <ShieldCheck size={18} className="text-[#22C55E]" /> Features & Tags
                </h4>
                <div className="space-y-6">
                  <div>
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-3">Product Features</p>
                    <div className="flex flex-wrap gap-2">
                      {product.content?.features?.map((f, i) => (
                        <span key={i} className="px-3 py-1.5 bg-gray-50 text-[#062010] text-[10px] font-bold rounded-lg border border-gray-100">
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-3">Search Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {product.content?.tags?.map((t, i) => (
                        <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full border border-emerald-100">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
             </div>
          </div>

          {/* Variants Section */}
          {product.variants?.length > 0 && (
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
              <h4 className="text-[11px] font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                <List size={18} className="text-[#22C55E]" /> Available Variants
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {product.variants.map((v, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase">Unit Size</p>
                      <p className="text-sm font-black text-[#062010]">{v.unit}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-[#22C55E] uppercase tracking-widest">৳{v.price}</p>
                      <p className="text-[9px] font-bold text-gray-400 uppercase">Stock: {v.stock}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full Description */}
          <div className="bg-white p-10 rounded-[3.5rem] border border-gray-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#22C55E]/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
             <h4 className="text-[11px] font-black uppercase tracking-widest mb-6 flex items-center gap-2">
               <Info size={18} className="text-[#22C55E]" /> Technical Description
             </h4>
             <p className="text-gray-600 text-sm leading-relaxed font-medium">
               {product.content?.description}
             </p>
          </div>

          {/* Metadata Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-[#062010] p-8 rounded-[2.5rem] text-white flex items-center gap-5 shadow-2xl shadow-green-900/20">
                <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/5">
                  <User size={26} className="text-[#22C55E]" />
                </div>
                <div>
                   <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest opacity-60">System Operator</p>
                   <p className="text-lg font-black text-white leading-none mt-1">{product.metadata?.addedBy?.name}</p>
                   <p className="text-[10px] font-bold text-[#22C55E] tracking-tighter uppercase flex items-center gap-1 mt-1">
                     <Mail size={10}/> {product.metadata?.addedBy?.email}
                   </p>
                </div>
             </div>
             <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 flex items-center gap-5 shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100">
                  <Clock size={26} className="text-[#22C55E]" />
                </div>
                <div>
                   <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Entry Timestamp</p>
                   <p className="text-sm font-black text-[#062010] leading-none mt-1">
                    {new Date(product.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                   </p>
                   <div className="flex items-center gap-2 mt-1.5">
                      <span className="px-2 py-0.5 bg-gray-100 text-[9px] font-black text-gray-500 rounded uppercase">
                        Created: {new Date(product.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="px-2 py-0.5 bg-green-50 text-[9px] font-black text-[#22C55E] rounded uppercase">
                        Updated: {new Date(product.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;