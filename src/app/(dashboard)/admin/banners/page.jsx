"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";
import { 
  Image as ImageIcon, Plus, Search, Trash2, Edit3, X, 
  UploadCloud, Link as LinkIcon, Monitor, Zap, CheckCircle2,
  AlertCircle, Layout, ExternalLink
} from "lucide-react";
import Swal from 'sweetalert2';
import toast from "react-hot-toast";

const BannerManagementPage = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploading, setUploading] = useState(false);
  const [imgTab, setImgTab] = useState("upload");

  const [formData, setFormData] = useState({
    imageUrl: "",
    title: "",
    link: "",
    isRight: false,
    isDeals: false
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await axiosInstance.get("/banners");
      setBanners(res.data);
    } catch (error) {
      toast.error("Failed to load banners");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const body = new FormData();
    body.append("image", file);
    try {
      setUploading(true);
      const res = await axios.post(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API}`, body);
      setFormData(prev => ({ ...prev, imageUrl: res.data.data.url }));
      toast.success("Banner asset uploaded");
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const openModal = (banner = null) => {
    if (banner) {
      setEditId(banner._id);
      setFormData({
        imageUrl: banner.imageUrl,
        title: banner.title || "",
        link: banner.link || "",
        isRight: banner.isRight || false,
        isDeals: banner.isDeals || false
      });
    } else {
      setEditId(null);
      setFormData({ imageUrl: "", title: "", link: "", isRight: false, isDeals: false });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.imageUrl) return toast.error("Image is mandatory");
    try {
      if (editId) {
        await axiosInstance.patch(`/banners/${editId}`, formData);
        toast.success("Banner refined");
      } else {
        await axiosInstance.post("/banners", formData);
        toast.success("Banner deployed");
      }
      setIsModalOpen(false);
      fetchBanners();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Delete Banner?',
      text: "This asset will be removed permanently!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      confirmButtonText: 'Yes, Remove'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/banners/${id}`);
          fetchBanners();
          Swal.fire('Removed!', 'Success', 'success');
        } catch (error) {
          toast.error("Action failed");
        }
      }
    });
  };

  const filteredBanners = banners.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-[#062010] uppercase tracking-tighter flex items-center gap-2">
            <Layout className="text-[#22C55E]" /> Media Banners
          </h1>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1 italic">Homepage UI Configuration</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          <div className="relative group flex-1 md:w-64">
            <input
              type="text"
              placeholder="Filter by title..."
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
            <Plus size={18} /> New Banner
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          Array(3).fill(0).map((_, i) => <div key={i} className="h-72 bg-gray-100 rounded-[3rem] animate-pulse"></div>)
        ) : filteredBanners.map((banner) => (
          <motion.div layout key={banner._id} className="bg-white p-4 rounded-[2.5rem] border border-gray-100 shadow-sm relative group overflow-hidden flex flex-col h-full">
            <div className="relative h-48 rounded-[2rem] overflow-hidden border border-gray-50">
              <img src={banner.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
              <div className="absolute top-3 left-3 flex gap-2">
                {banner.isRight && <span className="bg-blue-500 text-white text-[7px] font-black uppercase px-2 py-1 rounded-md shadow-lg">Right Side</span>}
                {banner.isDeals && <span className="bg-[#22C55E] text-[#062010] text-[7px] font-black uppercase px-2 py-1 rounded-md shadow-lg">Flash Deal</span>}
              </div>
            </div>

            <div className="p-4 flex-grow">
              <h3 className="text-sm font-black text-[#062010] uppercase tracking-tight truncate">{banner.title || "Untitled Component"}</h3>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-1">
                <LinkIcon size={10} /> {banner.link || "No Redirect Link"}
              </p>
            </div>

            <div className="p-2 flex items-center gap-2">
              <button onClick={() => openModal(banner)} className="flex-1 bg-gray-50 text-gray-400 py-3 rounded-xl hover:bg-[#062010] hover:text-[#22C55E] transition-all cursor-pointer flex justify-center border border-transparent hover:border-[#22C55E]/30"><Edit3 size={16}/></button>
              <button onClick={() => handleDelete(banner._id)} className="flex-1 bg-red-50 text-red-400 py-3 rounded-xl hover:bg-red-500 hover:text-white transition-all cursor-pointer flex justify-center"><Trash2 size={16}/></button>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-[#062010]/80 backdrop-blur-md cursor-pointer" />
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-white w-full max-w-xl rounded-[3.5rem] overflow-hidden shadow-2xl relative z-10 font-sans">
              <div className="p-10 space-y-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-black text-[#062010] uppercase tracking-tighter">
                      {editId ? "Update Asset" : "Deploy Asset"}
                    </h2>
                    <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest mt-1">Configure Banner Logic</p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-2.5 bg-gray-50 rounded-full hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer"><X size={20}/></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4 bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                       <label className="text-[10px] font-black uppercase text-gray-400">Banner Image (Mandatory)</label>
                       <div className="flex bg-white rounded-lg p-1 shadow-sm">
                          {["upload", "url"].map(t => <button key={t} type="button" onClick={() => setImgTab(t)} className={`px-4 py-1 text-[8px] font-black uppercase rounded ${imgTab === t ? 'bg-[#062010] text-[#22C55E]' : 'text-gray-400'}`}>{t}</button>)}
                       </div>
                    </div>
                    {imgTab === "upload" ? (
                      <div className="relative group h-32 bg-white border-2 border-dashed border-gray-200 rounded-[2rem] flex items-center justify-center cursor-pointer overflow-hidden transition-all hover:border-[#22C55E]">
                        <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                        {formData.imageUrl ? <img src={formData.imageUrl} className="w-full h-full object-cover" /> : (
                          <div className="text-center">
                            <UploadCloud size={24} className="mx-auto text-gray-300 mb-1" />
                            <p className="text-[8px] font-black text-gray-400 uppercase">Click to browse</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <input type="text" placeholder="https://..." value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} className="w-full bg-white rounded-2xl p-4 text-xs font-bold outline-none border border-gray-100" />
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Asset Title (Optional)</label>
                      <input type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-gray-50 rounded-2xl p-4 text-sm font-bold outline-none border border-transparent focus:border-[#22C55E]/20" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Redirect Link (Optional)</label>
                      <input type="text" value={formData.link} onChange={(e) => setFormData({...formData, link: e.target.value})} placeholder="/shop" className="w-full bg-gray-50 rounded-2xl p-4 text-sm font-bold outline-none border border-transparent focus:border-[#22C55E]/20" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <button type="button" onClick={() => setFormData({...formData, isRight: !formData.isRight})} className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${formData.isRight ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-gray-50 border-transparent text-gray-400'}`}>
                      <span className="text-[9px] font-black uppercase tracking-widest">Right Side</span>
                      <Monitor size={16} />
                    </button>
                    <button type="button" onClick={() => setFormData({...formData, isDeals: !formData.isDeals})} className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${formData.isDeals ? 'bg-emerald-50 border-emerald-200 text-[#22C55E]' : 'bg-gray-50 border-transparent text-gray-400'}`}>
                      <span className="text-[9px] font-black uppercase tracking-widest">Flash Deals</span>
                      <Zap size={16} />
                    </button>
                  </div>

                  <button disabled={uploading} type="submit" className="w-full bg-[#22C55E] text-[#062010] py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] hover:shadow-2xl hover:shadow-green-200 transition-all cursor-pointer disabled:opacity-50">
                    {uploading ? "Uploading Asset..." : editId ? "Save Modifications" : "Deploy Banner"}
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

export default BannerManagementPage;