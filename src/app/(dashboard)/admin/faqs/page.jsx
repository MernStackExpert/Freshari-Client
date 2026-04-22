"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "@/utils/axiosInstance";
import { 
  Search, Plus, Edit3, Trash2, X, MessageCircle, 
  HelpCircle, ChevronDown, CheckCircle2, AlertCircle, 
  Clock, Hash, ArrowRight
} from "lucide-react";
import Swal from 'sweetalert2';
import toast from "react-hot-toast";

const FAQManagementPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    question: "",
    ans: ""
  });

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const res = await axiosInstance.get("/faqs");
      setFaqs(res.data);
    } catch (error) {
      toast.error("Failed to fetch FAQs");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (faq = null) => {
    if (faq) {
      setEditId(faq._id);
      setFormData({
        question: faq.question,
        ans: faq.ans
      });
    } else {
      setEditId(null);
      setFormData({ question: "", ans: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axiosInstance.patch(`/faqs/${editId}`, formData);
        toast.success("FAQ updated successfully");
      } else {
        await axiosInstance.post("/faqs", formData);
        toast.success("New FAQ deployed");
      }
      setIsModalOpen(false);
      fetchFaqs();
    } catch (error) {
      toast.error("Operation failed");
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Remove FAQ?',
      text: "This entry will be deleted permanently!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      confirmButtonText: 'Yes, Delete',
      cursor: 'pointer'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/faqs/${id}`);
          fetchFaqs();
          Swal.fire('Deleted!', 'FAQ removed.', 'success');
        } catch (error) {
          toast.error("Delete failed");
        }
      }
    });
  };

  const filteredFaqs = faqs.filter(f => 
    f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.ans.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-[#062010] uppercase tracking-tighter flex items-center gap-2">
            <HelpCircle className="text-[#22C55E]" /> Knowledge Base
          </h1>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1 italic">Manage Platform FAQs</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          <div className="relative group flex-1 md:w-80">
            <input
              type="text"
              placeholder="Search questions..."
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
            <Plus size={18} /> Add New FAQ
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          Array(3).fill(0).map((_, i) => <div key={i} className="h-32 bg-gray-100 rounded-[2.5rem] animate-pulse"></div>)
        ) : filteredFaqs.map((faq) => (
          <motion.div layout key={faq._id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm group hover:border-[#22C55E]/30 transition-all">
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1 p-2 bg-emerald-50 rounded-xl text-[#22C55E]">
                    <HelpCircle size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-[#062010] uppercase tracking-tighter leading-tight">
                      {faq.question}
                    </h3>
                    <div className="flex items-center gap-4 mt-2">
                       <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-1">
                         <Clock size={10}/> Added: {new Date(faq.createdAt).toLocaleDateString()}
                       </span>
                       <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest flex items-center gap-1">
                         <Hash size={10}/> ID: {faq._id.slice(-6)}
                       </span>
                    </div>
                  </div>
                </div>
                
                <div className="pl-14">
                  <div className="bg-gray-50/50 p-6 rounded-[2rem] border border-gray-50">
                    <p className="text-gray-500 text-sm font-medium leading-relaxed italic">
                      <ArrowRight size={14} className="inline mr-2 text-[#22C55E]" />
                      {faq.ans}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex md:flex-col items-center justify-end gap-2 md:border-l border-gray-50 md:pl-6">
                <button onClick={() => openModal(faq)} className="p-3 bg-gray-50 text-gray-400 hover:bg-[#062010] hover:text-[#22C55E] rounded-xl transition-all cursor-pointer"><Edit3 size={18}/></button>
                <button onClick={() => handleDelete(faq._id)} className="p-3 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-all cursor-pointer"><Trash2 size={18}/></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-[#062010]/80 backdrop-blur-md cursor-pointer" />
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-white w-full max-w-2xl rounded-[3.5rem] overflow-hidden shadow-2xl relative z-10 font-sans">
              <div className="p-10 space-y-8">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-black text-[#062010] uppercase tracking-tighter">
                      {editId ? "Update Question" : "New Knowledge Entry"}
                    </h2>
                    <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest mt-1">Configure Public FAQ</p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-2.5 bg-gray-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer"><X size={20}/></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">The Question</label>
                    <input 
                      required 
                      type="text" 
                      value={formData.question} 
                      onChange={(e) => setFormData({...formData, question: e.target.value})} 
                      placeholder="e.g. How do I track my order?"
                      className="w-full bg-gray-50 rounded-2xl p-5 text-sm font-bold outline-none border border-transparent focus:border-[#22C55E]/20" 
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">The Answer</label>
                    <textarea 
                      required 
                      rows="5"
                      value={formData.ans} 
                      onChange={(e) => setFormData({...formData, ans: e.target.value})} 
                      placeholder="Provide a detailed solution..."
                      className="w-full bg-gray-50 rounded-[2.5rem] p-8 text-sm font-medium outline-none border border-transparent focus:border-[#22C55E]/20"
                    ></textarea>
                  </div>

                  <button type="submit" className="w-full bg-[#22C55E] text-[#062010] py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] hover:shadow-2xl hover:shadow-green-200 transition-all cursor-pointer">
                    {editId ? "Synchronize Updates" : "Deploy FAQ Entry"}
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

export default FAQManagementPage;