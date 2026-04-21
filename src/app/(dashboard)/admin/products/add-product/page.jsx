"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";
import { 
  Plus, Save, Image as ImageIcon, UploadCloud, Trash2, Info, 
  DollarSign, Package, Truck, Settings, Layers, Star, 
  PlusCircle, XCircle, Tag as TagIcon 
} from "lucide-react";
import Swal from 'sweetalert2';
import toast from "react-hot-toast";

const AddProductPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [imgTab, setImgTab] = useState("upload");
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "", slug: "", sku: "", brand: "",
    category: { main: "", sub: "", slug: "" },
    pricing: { price: "", oldPrice: "", discountPercentage: "", discountType: "percentage", currency: "BDT" },
    inventory: { stock: "", stockStatus: "in-stock", minOrderQuantity: "", unit: "kg" },
    media: { thumbnail: "", images: [] },
    content: { shortDescription: "", description: "", features: [""], tags: [""] },
    shipping: { freeDelivery: false, deliveryCharge: "", estimatedDelivery: "", shelfLife: "", origin: "" },
    variants: [{ unit: "", price: "", stock: "" }],
    social: { rating: "", totalReviews: "" },
    status: { isNew: true, isFeatured: false, isActive: true, isTodaySpecial: false },
    metadata: { addedBy: { name: "Md Nirob Sarkar", email: "mdnirob30k@gmail.com" } }
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get("/categories");
        setCategories(res.data);
      } catch (err) {
        toast.error("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (path, value) => {
    const keys = path.split(".");
    setFormData(prev => {
      let newData = JSON.parse(JSON.stringify(prev));
      let temp = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        temp = temp[keys[i]];
      }
      temp[keys[keys.length - 1]] = value;
      return newData;
    });
    if (errors[path]) {
      const newErrors = { ...errors };
      delete newErrors[path];
      setErrors(newErrors);
    }
  };

  const handleImgUpload = async (e, isGallery = false) => {
    const file = e.target.files[0];
    if (!file) return;
    const body = new FormData();
    body.append("image", file);
    try {
      setLoading(true);
      const res = await axios.post(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API}`, body);
      const url = res.data.data.url;
      if (isGallery) {
        handleInputChange("media.images", [...formData.media.images, url]);
      } else {
        handleInputChange("media.thumbnail", url);
      }
      toast.success("Image Uploaded");
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    let newErrors = {};
    const required = ["name", "slug", "sku", "category.slug", "pricing.price", "inventory.stock", "media.thumbnail", "shipping.origin"];
    required.forEach(field => {
      const keys = field.split(".");
      let val = formData;
      keys.forEach(k => val = val[k]);
      if (!val && val !== 0) newErrors[field] = true;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Required fields are empty!");
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post("/products", formData);
      Swal.fire("Success!", "Product Deployed Successfully", "success");
      router.push("/admin/products");
    } catch (err) {
      toast.error("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-7xl mx-auto space-y-6 md:space-y-10 pb-20 font-sans px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm sticky top-0 z-50 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-[#062010] uppercase tracking-tighter">Add Master Product</h1>
          <p className="text-gray-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest mt-1">45+ Organic Fields Integration</p>
        </div>
        <button type="submit" disabled={loading} className="w-full md:w-auto bg-[#22C55E] text-[#062010] px-8 py-4 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] flex items-center justify-center gap-3 cursor-pointer hover:shadow-lg transition-all disabled:opacity-50">
          <Save size={18} /> {loading ? "Syncing..." : "Publish Product"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <section className="bg-white p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] border border-gray-100 space-y-6 shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-[#062010]"><Info size={16} className="text-[#22C55E]"/> Core Identity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1"><label className="text-[9px] font-black uppercase text-gray-400 ml-1">Name</label><input type="text" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} className={`w-full bg-gray-50 border ${errors["name"] ? 'border-red-500' : 'border-transparent'} rounded-xl p-4 text-sm font-bold outline-none`} /></div>
            <div className="space-y-1"><label className="text-[9px] font-black uppercase text-gray-400 ml-1">Slug</label><input type="text" value={formData.slug} onChange={(e) => handleInputChange("slug", e.target.value)} className={`w-full bg-gray-50 border ${errors["slug"] ? 'border-red-500' : 'border-transparent'} rounded-xl p-4 text-sm font-bold outline-none`} /></div>
            <div className="space-y-1"><label className="text-[9px] font-black uppercase text-gray-400 ml-1">SKU</label><input type="text" value={formData.sku} onChange={(e) => handleInputChange("sku", e.target.value)} className={`w-full bg-gray-50 border ${errors["sku"] ? 'border-red-500' : 'border-transparent'} rounded-xl p-4 text-sm font-bold outline-none`} /></div>
            <div className="space-y-1"><label className="text-[9px] font-black uppercase text-gray-400 ml-1">Brand</label><input type="text" value={formData.brand} onChange={(e) => handleInputChange("brand", e.target.value)} className="w-full bg-gray-50 rounded-xl p-4 text-sm font-bold border-none outline-none" /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-50 pt-6">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-gray-400">Main Category</label>
              <select value={formData.category.slug} onChange={(e) => {
                  const cat = categories.find(c => c.slug === e.target.value);
                  handleInputChange("category.slug", e.target.value);
                  handleInputChange("category.main", cat ? cat.name : "");
                }} className={`w-full bg-gray-50 border ${errors["category.slug"] ? 'border-red-500' : 'border-transparent'} rounded-xl p-4 text-[10px] font-black uppercase outline-none cursor-pointer`}>
                <option value="">Select Category</option>
                {categories.map(cat => <option key={cat._id} value={cat.slug}>{cat.name}</option>)}
              </select>
            </div>
            <div className="space-y-1"><label className="text-[9px] font-black uppercase text-gray-400">Sub Category</label><input type="text" value={formData.category.sub} onChange={(e) => handleInputChange("category.sub", e.target.value)} className="w-full bg-gray-50 rounded-xl p-4 text-sm font-bold border-none outline-none" /></div>
          </div>
        </section>

        <section className="bg-[#062010] p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] space-y-6 text-white shadow-xl">
          <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2"><ImageIcon size={16} className="text-[#22C55E]"/> Media Configuration</h3>
          <div className="flex gap-4">
             <button type="button" onClick={() => setImgTab("upload")} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer ${imgTab === 'upload' ? 'bg-[#22C55E] text-[#062010]' : 'bg-white/10'}`}>Upload</button>
             <button type="button" onClick={() => setImgTab("url")} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer ${imgTab === 'url' ? 'bg-[#22C55E] text-[#062010]' : 'bg-white/10'}`}>URL</button>
          </div>
          <div className={`p-8 border-2 border-dashed ${errors["media.thumbnail"] ? 'border-red-500' : 'border-white/10'} rounded-[2rem] text-center relative hover:border-[#22C55E]/50 transition-all`}>
            {imgTab === 'upload' ? (
              <>
                <UploadCloud size={30} className="mx-auto mb-2 text-[#22C55E]" />
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Master Thumbnail</p>
                <input type="file" onChange={(e) => handleImgUpload(e)} className="absolute inset-0 opacity-0 cursor-pointer" />
              </>
            ) : (
              <input type="text" placeholder="https://..." value={formData.media.thumbnail} onChange={(e) => handleInputChange("media.thumbnail", e.target.value)} className="w-full bg-transparent outline-none text-xs text-center font-bold" />
            )}
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase text-gray-500 tracking-widest">Gallery Images (URLs Comma Separated)</label>
            <textarea value={formData.media.images.join(",")} onChange={(e) => handleInputChange("media.images", e.target.value.split(","))} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-[10px] text-white outline-none min-h-[60px]" />
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <section className="bg-white p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] border border-gray-100 space-y-6 shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-[#062010]"><PlusCircle size={16} className="text-[#22C55E]"/> Features List</h3>
          <div className="space-y-3">
            {formData.content.features.map((f, i) => (
              <div key={i} className="flex gap-2">
                <input type="text" value={f} onChange={(e) => {
                  const feats = [...formData.content.features];
                  feats[i] = e.target.value;
                  handleInputChange("content.features", feats);
                }} placeholder={`Feature ${i+1}`} className="flex-1 bg-gray-50 p-4 rounded-xl text-xs font-bold border-none outline-none" />
                <button type="button" onClick={() => handleInputChange("content.features", formData.content.features.filter((_, idx) => idx !== i))} className="text-red-400 cursor-pointer"><Trash2 size={16}/></button>
              </div>
            ))}
            <button type="button" onClick={() => handleInputChange("content.features", [...formData.content.features, ""])} className="text-[10px] font-black uppercase text-[#22C55E] flex items-center gap-2 cursor-pointer mt-2 font-bold"><Plus size={14}/> New Feature</button>
          </div>
        </section>

        <section className="bg-white p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] border border-gray-100 space-y-6 shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-[#062010]"><TagIcon size={16} className="text-[#22C55E]"/> Search Tags</h3>
          <div className="space-y-3">
            {formData.content.tags.map((t, i) => (
              <div key={i} className="flex gap-2">
                <input type="text" value={t} onChange={(e) => {
                  const tags = [...formData.content.tags];
                  tags[i] = e.target.value;
                  handleInputChange("content.tags", tags);
                }} placeholder={`Tag ${i+1}`} className="flex-1 bg-gray-50 p-4 rounded-xl text-xs font-bold border-none outline-none" />
                <button type="button" onClick={() => handleInputChange("content.tags", formData.content.tags.filter((_, idx) => idx !== i))} className="text-red-400 cursor-pointer"><Trash2 size={16}/></button>
              </div>
            ))}
            <button type="button" onClick={() => handleInputChange("content.tags", [...formData.content.tags, ""])} className="text-[10px] font-black uppercase text-[#22C55E] flex items-center gap-2 cursor-pointer mt-2 font-bold"><Plus size={14}/> New Tag</button>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <section className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 space-y-4 shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-widest"><DollarSign size={16} className="inline mr-2 text-[#22C55E]"/> Pricing</h3>
          <div className="space-y-3">
            <input type="number" placeholder="Price" value={formData.pricing.price} onChange={(e) => handleInputChange("pricing.price", e.target.value === "" ? "" : Number(e.target.value))} className={`w-full bg-gray-50 p-4 rounded-xl text-xs font-black ${errors["pricing.price"] ? 'border border-red-500' : 'border-none'}`} />
            <input type="number" placeholder="Old Price" value={formData.pricing.oldPrice} onChange={(e) => handleInputChange("pricing.oldPrice", e.target.value === "" ? "" : Number(e.target.value))} className="w-full bg-gray-50 p-4 rounded-xl text-xs font-black border-none" />
            <input type="number" placeholder="Discount %" value={formData.pricing.discountPercentage} onChange={(e) => handleInputChange("pricing.discountPercentage", e.target.value === "" ? "" : Number(e.target.value))} className="w-full bg-gray-50 p-4 rounded-xl text-xs font-black border-none" />
            <select value={formData.pricing.discountType} onChange={(e) => handleInputChange("pricing.discountType", e.target.value)} className="w-full bg-gray-50 p-4 rounded-xl text-[10px] font-black uppercase border-none cursor-pointer"><option value="percentage">Percentage</option><option value="flat">Flat</option></select>
          </div>
        </section>

        <section className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 space-y-4 shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-widest"><Package size={16} className="inline mr-2 text-[#22C55E]"/> Inventory</h3>
          <div className="space-y-3">
            <input type="number" placeholder="Stock" value={formData.inventory.stock} onChange={(e) => handleInputChange("inventory.stock", e.target.value === "" ? "" : Number(e.target.value))} className={`w-full bg-gray-50 p-4 rounded-xl text-xs font-black ${errors["inventory.stock"] ? 'border border-red-500' : 'border-none'}`} />
            <input type="text" placeholder="Unit" value={formData.inventory.unit} onChange={(e) => handleInputChange("inventory.unit", e.target.value)} className="w-full bg-gray-50 p-4 rounded-xl text-xs font-bold border-none" />
            <input type="number" placeholder="Min Order Qty" value={formData.inventory.minOrderQuantity} onChange={(e) => handleInputChange("inventory.minOrderQuantity", e.target.value === "" ? "" : Number(e.target.value))} className="w-full bg-gray-50 p-4 rounded-xl text-xs font-bold border-none" />
            <select value={formData.inventory.stockStatus} onChange={(e) => handleInputChange("inventory.stockStatus", e.target.value)} className="w-full bg-gray-50 p-4 rounded-xl text-[10px] font-black uppercase border-none cursor-pointer"><option value="in-stock">In-Stock</option><option value="out-of-stock">Out-of-Stock</option></select>
          </div>
        </section>

        <section className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 space-y-4 shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-widest"><Truck size={16} className="inline mr-2 text-[#22C55E]"/> Logistics</h3>
          <div className="space-y-3">
            <input type="text" placeholder="Origin" value={formData.shipping.origin} onChange={(e) => handleInputChange("shipping.origin", e.target.value)} className={`w-full bg-gray-50 p-4 rounded-xl text-xs font-bold ${errors["shipping.origin"] ? 'border border-red-500' : 'border-none'}`} />
            <input type="number" placeholder="Del Charge" value={formData.shipping.deliveryCharge} onChange={(e) => handleInputChange("shipping.deliveryCharge", e.target.value === "" ? "" : Number(e.target.value))} className="w-full bg-gray-50 p-4 rounded-xl text-xs font-bold border-none" />
            <input type="text" placeholder="Estimated Delivery" value={formData.shipping.estimatedDelivery} onChange={(e) => handleInputChange("shipping.estimatedDelivery", e.target.value)} className="w-full bg-gray-50 p-4 rounded-xl text-xs font-bold border-none" />
            <input type="text" placeholder="Shelf Life" value={formData.shipping.shelfLife} onChange={(e) => handleInputChange("shipping.shelfLife", e.target.value)} className="w-full bg-gray-50 p-4 rounded-xl text-xs font-bold border-none" />
          </div>
        </section>
      </div>

      <section className="bg-white p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-[#062010]"><Settings size={18} className="text-[#22C55E]"/> Description & Flags</h3>
          <div className="space-y-4">
            <input type="text" placeholder="Short Description" value={formData.content.shortDescription} onChange={(e) => handleInputChange("content.shortDescription", e.target.value)} className="w-full bg-gray-50 p-4 rounded-xl text-xs font-bold border-none outline-none" />
            <textarea rows="4" placeholder="Full Description" value={formData.content.description} onChange={(e) => handleInputChange("content.description", e.target.value)} className="w-full bg-gray-50 p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] text-sm font-medium border-none outline-none"></textarea>
            <div className="flex flex-wrap gap-3">
               {['isActive', 'isNew', 'isFeatured', 'isTodaySpecial', 'freeDelivery'].map(key => {
                 const isShipping = key === 'freeDelivery';
                 const path = isShipping ? `shipping.${key}` : `status.${key}`;
                 const val = isShipping ? formData.shipping[key] : formData.status[key];
                 return (
                  <button key={key} type="button" onClick={() => handleInputChange(path, !val)} className={`px-4 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest border transition-all cursor-pointer ${val ? 'bg-[#062010] text-[#22C55E] border-[#22C55E]' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                    {key.replace('is', '').replace('free', 'Free ')}
                  </button>
                 )
               })}
            </div>
          </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <section className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 space-y-6 shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-[#062010]"><Layers size={16} className="text-[#22C55E]"/> Product Variants</h3>
          <div className="space-y-4">
            {formData.variants.map((v, i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-gray-50 p-4 rounded-2xl relative">
                <input type="text" placeholder="Unit" value={v.unit} onChange={(e) => { const vars = [...formData.variants]; vars[i].unit = e.target.value; handleInputChange("variants", vars); }} className="bg-white p-2 rounded-lg text-xs font-bold outline-none" />
                <input type="number" placeholder="Price" value={v.price} onChange={(e) => { const vars = [...formData.variants]; vars[i].price = e.target.value === "" ? "" : Number(e.target.value); handleInputChange("variants", vars); }} className="bg-white p-2 rounded-lg text-xs font-bold outline-none" />
                <input type="number" placeholder="Stock" value={v.stock} onChange={(e) => { const vars = [...formData.variants]; vars[i].stock = e.target.value === "" ? "" : Number(e.target.value); handleInputChange("variants", vars); }} className="bg-white p-2 rounded-lg text-xs font-bold outline-none" />
                <button type="button" onClick={() => handleInputChange("variants", formData.variants.filter((_, idx) => idx !== i))} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 cursor-pointer hover:bg-red-600 transition-colors"><XCircle size={16}/></button>
              </div>
            ))}
            <button type="button" onClick={() => handleInputChange("variants", [...formData.variants, {unit: "", price: "", stock: ""}])} className="text-[10px] font-black uppercase text-[#22C55E] flex items-center gap-2 cursor-pointer mt-2"><Plus size={14}/> Add Row</button>
          </div>
        </section>

        <section className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-gray-100 space-y-6 shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-[#062010]"><Star size={16} className="text-[#22C55E]"/> Social & Metadata</h3>
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1"><label className="text-[9px] font-black uppercase text-gray-400">Rating (0-5)</label><input type="number" step="0.1" value={formData.social.rating} onChange={(e) => handleInputChange("social.rating", e.target.value === "" ? "" : Number(e.target.value))} className="w-full bg-gray-50 rounded-xl p-4 text-sm font-black border-none outline-none" /></div>
             <div className="space-y-1"><label className="text-[9px] font-black uppercase text-gray-400">Total Reviews</label><input type="number" value={formData.social.totalReviews} onChange={(e) => handleInputChange("social.totalReviews", e.target.value === "" ? "" : Number(e.target.value))} className="w-full bg-gray-50 rounded-xl p-4 text-sm font-black border-none outline-none" /></div>
          </div>
          <div className="bg-[#F9FBFA] p-6 rounded-3xl border border-gray-100 flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-[#062010] flex items-center justify-center text-[#22C55E] font-black text-xs shadow-lg">NS</div>
             <div><p className="text-xs font-black text-[#062010] uppercase leading-none">{formData.metadata.addedBy.name}</p><p className="text-[9px] font-bold text-gray-400 uppercase mt-1">Status: Master Admin</p></div>
          </div>
        </section>
      </div>
    </form>
  );
};

export default AddProductPage;