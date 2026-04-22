"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";
import { 
  Search, Plus, Edit3, Trash2, X, UploadCloud, 
  Layers, Globe, Image as ImageIcon, Link as LinkIcon, PlusCircle ,
  Filter, CheckCircle2, Star, MousePointer2
} from "lucide-react";
import Swal from 'sweetalert2';
import toast from "react-hot-toast";

const ManageCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState({ icon: "upload", img: "upload" });

  const [formData, setFormData] = useState({
    name: "",
    icon: "",
    img: "",
    top: false,
    link: ""
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/categories");
      setCategories(res.data);
    } catch (err) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    const body = new FormData();
    body.append("image", file);
    try {
      setUploading(true);
      const res = await axios.post(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API}`, body);
      setFormData(prev => ({ ...prev, [field]: res.data.data.url }));
      toast.success("Asset Uploaded");
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axiosInstance.patch(`/categories/${editId}`, formData);
        toast.success("Category updated");
      } else {
        await axiosInstance.post("/categories", formData);
        toast.success("Category added");
      }
      closeModal();
      fetchCategories();
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  const openModal = (cat = null) => {
    if (cat) {
      setEditId(cat._id);
      setFormData({ name: cat.name, icon: cat.icon, img: cat.img, top: cat.top, link: cat.link || "" });
    } else {
      setEditId(null);
      setFormData({ name: "", icon: "", img: "", top: false, link: "" });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditId(null);
    setFormData({ name: "", icon: "", img: "", top: false, link: "" });
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Data will be removed from master database!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      confirmButtonText: 'Delete',
      cursor: 'pointer'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/categories/${id}`);
          fetchCategories();
          Swal.fire('Deleted!', 'Success', 'success');
        } catch (err) {
          toast.error("Delete failed");
        }
      }
    });
  };

  const filteredCategories = categories.filter(cat => {
    const matchesSearch = cat.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterType === "top") return matchesSearch && cat.top;
    if (filterType === "normal") return matchesSearch && !cat.top;
    return matchesSearch;
  });

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-[#062010] uppercase tracking-tighter flex items-center gap-2">
            <Layers className="text-[#22C55E]" /> Master Categories
          </h1>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1 italic">Segment Control Panel</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          <div className="relative group flex-1 md:w-64">
            <input
              type="text"
              placeholder="Search segments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold outline-none focus:ring-2 ring-green-100 transition-all"
            />
            <Search className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#22C55E]" size={18} />
          </div>

          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-gray-50 border-none rounded-2xl py-3.5 px-6 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer"
          >
            <option value="all">All Items</option>
            <option value="top">Top Ranked</option>
            <option value="normal">Standard</option>
          </select>

          <button 
            onClick={() => openModal()} 
            className="bg-[#062010] text-[#22C55E] flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:shadow-xl hover:shadow-green-900/20 active:scale-95 transition-all cursor-pointer border border-[#22C55E]/20"
          >
            <PlusCircle size={18} /> New Category
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
           Array(4).fill(0).map((_, i) => <div key={i} className="h-64 bg-gray-100 rounded-[3rem] animate-pulse"></div>)
        ) : filteredCategories.map((cat) => (
          <motion.div layout key={cat._id} className="bg-white p-6 rounded-[3rem] border border-gray-100 shadow-sm relative group overflow-hidden flex flex-col h-full">
            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 rounded-[1.5rem] bg-gray-50 overflow-hidden border border-gray-100 p-3 shadow-inner">
                <img src={cat.icon} className="w-full h-full object-contain" alt="" />
              </div>
              <div className="flex flex-col items-end gap-2">
                {cat.top && <span className="bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase px-3 py-1 rounded-full border border-emerald-100 flex items-center gap-1"><Star size={10} fill="currentColor" /> Top</span>}
                <span className="text-[8px] font-black text-gray-300 uppercase tracking-tighter">ID: {cat._id.slice(-6)}</span>
              </div>
            </div>

            <div className="flex-grow">
              <h3 className="text-lg font-black text-[#062010] uppercase tracking-tighter leading-none">{cat.name}</h3>
              <div className="mt-3 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-[9px] font-bold text-gray-400 uppercase">
                  <Globe size={10} className="text-[#22C55E]" /> slug: {cat.slug}
                </div>
                {cat.link && (
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-blue-400 uppercase truncate">
                    <LinkIcon size={10} /> {cat.link}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 flex items-center gap-2">
              <button onClick={() => openModal(cat)} className="flex-1 bg-gray-50 text-gray-400 py-3 rounded-2xl hover:bg-[#062010] hover:text-[#22C55E] transition-all cursor-pointer flex justify-center border border-transparent hover:border-[#22C55E]/30"><Edit3 size={16}/></button>
              <button onClick={() => handleDelete(cat._id)} className="flex-1 bg-red-50 text-red-400 py-3 rounded-2xl hover:bg-red-500 hover:text-white transition-all cursor-pointer flex justify-center"><Trash2 size={16}/></button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="absolute inset-0 bg-[#062010]/80 backdrop-blur-md cursor-pointer" />
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-white w-full max-w-xl rounded-[3.5rem] overflow-hidden shadow-2xl relative z-10 font-sans">
              <div className="p-10 space-y-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-black text-[#062010] uppercase tracking-tighter">{editId ? "Update Segment" : "New Segment"}</h2>
                    <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest mt-1">Configure Category Metadata</p>
                  </div>
                  <button onClick={closeModal} className="p-2.5 bg-gray-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer"><X size={20}/></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Segment Name</label>
                      <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 rounded-2xl p-4 text-sm font-bold outline-none border border-transparent focus:border-[#22C55E]/20" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Direct Link (optional)</label>
                      <input type="text" value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} placeholder="/shop/category" className="w-full bg-gray-50 rounded-2xl p-4 text-sm font-bold outline-none border border-transparent focus:border-[#22C55E]/20" />
                    </div>
                  </div>

                  <div className="space-y-4 bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                       <label className="text-[10px] font-black uppercase text-gray-400">Icon Asset</label>
                       <div className="flex bg-white rounded-lg p-1">
                          {["upload", "url"].map(t => <button key={t} type="button" onClick={() => setActiveTab({...activeTab, icon: t})} className={`px-3 py-1 text-[8px] font-black uppercase rounded ${activeTab.icon === t ? 'bg-[#062010] text-[#22C55E]' : 'text-gray-400'}`}>{t}</button>)}
                       </div>
                    </div>
                    {activeTab.icon === "upload" ? (
                      <div className="relative group h-24 bg-white border-2 border-dashed border-gray-200 rounded-3xl flex items-center justify-center cursor-pointer overflow-hidden">
                        <input type="file" onChange={(e) => handleImageUpload(e, "icon")} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                        {formData.icon ? <img src={formData.icon} className="w-12 h-12 object-contain" /> : <UploadCloud size={24} className="text-gray-300" />}
                      </div>
                    ) : (
                      <input type="text" placeholder="https://..." value={formData.icon} onChange={(e) => setFormData({...formData, icon: e.target.value})} className="w-full bg-white rounded-xl p-4 text-xs font-bold outline-none border border-gray-100" />
                    )}
                  </div>

                  <div className="space-y-4 bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                       <label className="text-[10px] font-black uppercase text-gray-400">Thumbnail Image</label>
                       <div className="flex bg-white rounded-lg p-1">
                          {["upload", "url"].map(t => <button key={t} type="button" onClick={() => setActiveTab({...activeTab, img: t})} className={`px-3 py-1 text-[8px] font-black uppercase rounded ${activeTab.img === t ? 'bg-[#062010] text-[#22C55E]' : 'text-gray-400'}`}>{t}</button>)}
                       </div>
                    </div>
                    {activeTab.img === "upload" ? (
                      <div className="relative group h-24 bg-white border-2 border-dashed border-gray-200 rounded-3xl flex items-center justify-center cursor-pointer overflow-hidden">
                        <input type="file" onChange={(e) => handleImageUpload(e, "img")} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                        {formData.img ? <img src={formData.img} className="w-12 h-12 object-contain" /> : <UploadCloud size={24} className="text-gray-300" />}
                      </div>
                    ) : (
                      <input type="text" placeholder="https://..." value={formData.img} onChange={(e) => setFormData({...formData, img: e.target.value})} className="w-full bg-white rounded-xl p-4 text-xs font-bold outline-none border border-gray-100" />
                    )}
                  </div>

                  <div className="flex items-center justify-between p-6 bg-[#062010] rounded-[2rem]">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#22C55E]/10 rounded-xl"><Star size={18} className="text-[#22C55E]"/></div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-white leading-none">Top Segment</p>
                        <p className="text-[8px] font-bold text-gray-400 uppercase mt-1">Pin to main focus</p>
                      </div>
                    </div>
                    <button type="button" onClick={() => setFormData({...formData, top: !formData.top})} className={`w-12 h-6 rounded-full transition-all relative cursor-pointer ${formData.top ? 'bg-[#22C55E]' : 'bg-white/10'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.top ? 'right-1' : 'left-1'}`}></div>
                    </button>
                  </div>

                  <button disabled={uploading} type="submit" className="w-full bg-[#22C55E] text-[#062010] py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] hover:shadow-2xl hover:shadow-green-200 transition-all cursor-pointer disabled:opacity-50">
                    {uploading ? "Uploading Assets..." : editId ? "Synchronize Changes" : "Deploy Segment"}
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

export default ManageCategoriesPage;