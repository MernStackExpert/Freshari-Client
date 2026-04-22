"use client";
import React, { useState, useEffect } from "react";
import axiosInstance from "@/utils/axiosInstance";
import axios from "axios";
import { 
  User, Mail, Phone, ShieldCheck, Camera, Save, 
  Lock, Key, RefreshCcw, ShieldAlert, CheckCircle2 
} from "lucide-react";
import Swal from 'sweetalert2';
import toast from "react-hot-toast";

const MyProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    img: "",
    role: "",
    status: ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get("/admins/profile");
      setProfile(res.data);
    } catch (err) {
      toast.error("Failed to load profile");
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
      const newImgUrl = res.data.data.url;
      setProfile(prev => ({ ...prev, img: newImgUrl }));
      await axiosInstance.patch("/admins/profile-update", { img: newImgUrl });
      toast.success("Profile picture updated");
    } catch (err) {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      await axiosInstance.patch("/admins/profile-update", { name: profile.name });
      Swal.fire("Success!", "Basic information updated.", "success");
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("New passwords do not match!");
    }
    try {
      setUpdating(true);
      await axiosInstance.patch("/admins/profile-update", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      Swal.fire("Secured!", "Password changed successfully.", "success");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Password update failed");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black uppercase text-xs tracking-[0.4em] text-[#22C55E] animate-pulse">Accessing Secure Vault...</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 font-sans">
      <div className="bg-[#062010] p-10 md:p-16 rounded-[3.5rem] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#22C55E]/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <div className="relative flex flex-col md:flex-row items-center gap-10">
          <div className="relative group">
            <div className="w-40 h-40 rounded-[3rem] overflow-hidden border-4 border-[#22C55E]/20 shadow-2xl">
              <img src={profile.img || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} className="w-full h-full object-cover" alt="Profile" />
            </div>
            <label className="absolute bottom-2 right-2 p-3 bg-[#22C55E] text-[#062010] rounded-2xl cursor-pointer hover:scale-110 transition-all shadow-xl">
              <Camera size={20} />
              <input type="file" onChange={handleImageUpload} className="hidden" />
            </label>
            {uploading && <div className="absolute inset-0 bg-black/60 rounded-[3rem] flex items-center justify-center text-white text-[10px] font-black uppercase tracking-widest">Uploading...</div>}
          </div>
          
          <div className="text-center md:text-left space-y-3">
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              <span className="px-4 py-1 bg-[#22C55E]/10 text-[#22C55E] text-[10px] font-black uppercase rounded-full border border-[#22C55E]/20 tracking-widest">
                {profile.role}
              </span>
              <span className="px-4 py-1 bg-white/5 text-gray-400 text-[10px] font-black uppercase rounded-full border border-white/10 tracking-widest flex items-center gap-2">
                <CheckCircle2 size={12} className="text-[#22C55E]" /> {profile.status}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">{profile.name}</h1>
            <p className="text-gray-400 font-bold tracking-widest text-xs uppercase flex items-center justify-center md:justify-start gap-2">
              <Mail size={14} className="text-[#22C55E]"/> {profile.email}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
          <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-3 text-[#062010]">
            <User size={20} className="text-[#22C55E]" /> Basic Information
          </h3>
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Account Full Name</label>
              <input type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} className="w-full bg-gray-50 rounded-2xl p-5 text-sm font-bold outline-none border border-transparent focus:border-[#22C55E]/20 transition-all" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Contact Phone</label>
              <input disabled type="text" value={profile.phone} className="w-full bg-gray-100 rounded-2xl p-5 text-sm font-bold text-gray-400 cursor-not-allowed" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Registered Email</label>
              <input disabled type="text" value={profile.email} className="w-full bg-gray-100 rounded-2xl p-5 text-sm font-bold text-gray-400 cursor-not-allowed" />
            </div>
            <button type="submit" disabled={updating} className="w-full bg-[#062010] text-[#22C55E] py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] hover:shadow-xl transition-all cursor-pointer">
              {updating ? "Saving Changes..." : "Save Profile Details"}
            </button>
          </form>
        </section>

        <section className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
          <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-3 text-[#062010]">
            <Lock size={20} className="text-[#22C55E]" /> Security Credentials
          </h3>
          <form onSubmit={handlePasswordUpdate} className="space-y-6">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Current Password</label>
              <div className="relative">
                <input required type="password" value={passwordData.currentPassword} onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})} className="w-full bg-gray-50 rounded-2xl p-5 text-sm font-bold outline-none border border-transparent focus:border-red-100 transition-all" />
                <Key className="absolute right-5 top-5 text-gray-200" size={18} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1">New Secure Password</label>
              <input required type="password" value={passwordData.newPassword} onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})} className="w-full bg-gray-50 rounded-2xl p-5 text-sm font-bold outline-none border border-transparent focus:border-[#22C55E]/20 transition-all" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Confirm New Password</label>
              <input required type="password" value={passwordData.confirmPassword} onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})} className="w-full bg-gray-50 rounded-2xl p-5 text-sm font-bold outline-none border border-transparent focus:border-[#22C55E]/20 transition-all" />
            </div>
            <div className="p-5 bg-orange-50 rounded-[2rem] border border-orange-100 flex items-start gap-4">
              <ShieldAlert className="text-orange-500 shrink-0" size={20} />
              <p className="text-[9px] font-bold text-orange-700 uppercase leading-relaxed tracking-wider">
                Changing your password will require current verification. Use a strong combination of symbols and numbers.
              </p>
            </div>
            <button type="submit" disabled={updating} className="w-full bg-[#22C55E] text-[#062010] py-5 rounded-[2rem] font-black uppercase text-xs tracking-[0.2em] hover:shadow-xl transition-all cursor-pointer">
              {updating ? "Syncing Security..." : "Update Security Key"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default MyProfilePage;