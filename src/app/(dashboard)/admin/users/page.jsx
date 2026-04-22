"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";
import { 
  Search, Plus, Edit3, Trash2, X, UserPlus, 
  Shield, Mail, Phone, Clock, CheckCircle, 
  AlertCircle, MoreVertical, ShieldCheck, User, Camera
} from "lucide-react";
import Swal from 'sweetalert2';
import toast from "react-hot-toast";

const ManageUsersPage = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    img: ""
  });

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await axiosInstance.get("/admins/all");
      setAdmins(res.data);
    } catch (err) {
      toast.error("Failed to load admin users");
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
      setFormData(prev => ({ ...prev, img: res.data.data.url }));
      toast.success("Profile image uploaded");
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/admins/register", formData);
      Swal.fire("Success!", "Admin user created and email sent.", "success");
      setIsModalOpen(false);
      setFormData({ name: "", email: "", password: "", phone: "", img: "" });
      fetchAdmins();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleUpdateStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "pending" : "active";
    try {
      await axiosInstance.patch(`/admins/status/${id}`, { status: newStatus });
      toast.success(`Account is now ${newStatus}`);
      fetchAdmins();
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  const handleRoleChange = async (id, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      await axiosInstance.patch(`/admins/status/${id}`, { role: newRole });
      toast.success(`Role changed to ${newRole}`);
      fetchAdmins();
    } catch (err) {
      toast.error("Role update failed");
    }
  };

  const filteredAdmins = admins.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" ? true : user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-[#062010] uppercase tracking-tighter flex items-center gap-2">
            <ShieldCheck className="text-[#22C55E]" /> Team Management
          </h1>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-1 italic">Control Admin Access & Roles</p>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          <div className="relative group flex-1 md:w-64">
            <input
              type="text"
              placeholder="Search admin..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold outline-none focus:ring-2 ring-green-100 transition-all"
            />
            <Search className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#22C55E]" size={18} />
          </div>

          <select 
            value={filterRole} 
            onChange={(e) => setFilterRole(e.target.value)}
            className="bg-gray-50 border-none rounded-2xl py-3.5 px-6 text-[10px] font-black uppercase tracking-widest outline-none cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admin Only</option>
            <option value="user">Users Only</option>
          </select>

          <button 
            onClick={() => setIsModalOpen(true)} 
            className="bg-[#062010] text-[#22C55E] flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:shadow-xl active:scale-95 transition-all cursor-pointer border border-[#22C55E]/20"
          >
            <UserPlus size={18} /> Add Member
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
           Array(3).fill(0).map((_, i) => <div key={i} className="h-64 bg-gray-100 rounded-[3rem] animate-pulse"></div>)
        ) : filteredAdmins.map((user) => (
          <motion.div layout key={user._id} className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm relative group overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 ${user.role === 'admin' ? 'bg-blue-500/5' : 'bg-green-500/5'} rounded-bl-full -mr-12 -mt-12 blur-2xl`}></div>
            
            <div className="flex justify-between items-start mb-6">
              <div className="relative">
                <img src={user.img} className="w-20 h-20 rounded-[2rem] object-cover border-4 border-gray-50 shadow-md" alt="" />
                <div className={`absolute -bottom-1 -right-1 p-1.5 rounded-full border-4 border-white ${user.status === 'active' ? 'bg-green-500' : 'bg-orange-500'}`}>
                  {user.status === 'active' ? <CheckCircle size={10} className="text-white"/> : <Clock size={10} className="text-white"/>}
                </div>
              </div>
              <div className="text-right">
                <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${user.role === 'admin' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                  {user.role}
                </span>
                <p className="text-[8px] font-black text-gray-300 uppercase tracking-tighter mt-2">Member Since: {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-black text-[#062010] uppercase tracking-tighter truncate">{user.name}</h3>
                <div className="flex items-center gap-2 text-gray-400 mt-1">
                  <Mail size={12} /> <span className="text-[10px] font-bold">{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 mt-0.5">
                  <Phone size={12} /> <span className="text-[10px] font-bold">{user.phone}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-dashed border-gray-100">
                <button onClick={() => handleUpdateStatus(user._id, user.status)} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer ${user.status === 'active' ? 'bg-orange-50 text-orange-500' : 'bg-green-50 text-green-600'}`}>
                  {user.status === 'active' ? 'Suspend' : 'Approve'}
                </button>
                <button onClick={() => handleRoleChange(user._id, user.role)} className="flex-1 bg-gray-50 text-[#062010] py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-[#062010] hover:text-white transition-all cursor-pointer">
                  Switch Role
                </button>
              </div>
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
                    <h2 className="text-2xl font-black text-[#062010] uppercase tracking-tighter">New Access Point</h2>
                    <p className="text-[9px] font-black uppercase text-gray-400 tracking-widest mt-1">Create Admin Credentials</p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="p-2.5 bg-gray-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer"><X size={20}/></button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex flex-col items-center gap-4 mb-2">
                     <div className="relative group w-24 h-24">
                        <img src={formData.img || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} className="w-full h-full rounded-[2rem] object-cover border-4 border-gray-50 shadow-inner" alt="" />
                        <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                          <Camera size={20} className="text-white" />
                          <input type="file" onChange={handleImageUpload} className="hidden" />
                        </label>
                     </div>
                     <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest">{uploading ? "Uploading..." : "Upload Profile Photo"}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Full Name</label>
                      <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 rounded-2xl p-4 text-sm font-bold outline-none border border-transparent focus:border-[#22C55E]/20" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Contact Phone</label>
                      <input required type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-gray-50 rounded-2xl p-4 text-sm font-bold outline-none border border-transparent focus:border-[#22C55E]/20" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Email Address</label>
                    <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-gray-50 rounded-2xl p-4 text-sm font-bold outline-none border border-transparent focus:border-[#22C55E]/20" />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Access Password</label>
                    <input required type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full bg-gray-50 rounded-2xl p-4 text-sm font-bold outline-none border border-transparent focus:border-[#22C55E]/20" />
                  </div>

                  <button disabled={uploading || loading} type="submit" className="w-full bg-[#062010] text-[#22C55E] py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] hover:shadow-2xl transition-all cursor-pointer disabled:opacity-50">
                    {uploading ? "Processing Media..." : "Initialize Member"}
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

export default ManageUsersPage;