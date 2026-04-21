"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Mail, Eye, EyeOff, Loader2, ArrowRight, Leaf } from "lucide-react";
import axiosInstance from "@/utils/axiosInstance";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const AdminLoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axiosInstance.post("/admins/login", formData);
      if (res.status === 200) {
        Cookies.set("freshari_admin_token", res.data.token, { expires: 7 });
        Cookies.set("admin_user", JSON.stringify(res.data.user), { expires: 7 });
        toast.success("Welcome Back to Freshari!");
        router.push("/admin");
        router.refresh();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed! Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#04140a] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#22C55E]/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#22C55E]/10 rounded-full blur-[120px]"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-[450px] bg-[#062010]/80 backdrop-blur-2xl rounded-[2.5rem] p-10 md:p-14 border border-white/5 shadow-[0_25px_50px_rgba(0,0,0,0.6)] relative z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-5 bg-white/5 rounded-3xl mb-6 border border-white/10 shadow-inner">
            <img src="/freshari.png" alt="Freshari" className="w-12 h-12 object-contain" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">
            FRESHARI <span className="text-[#22C55E]">ADMIN</span>
          </h1>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-[0.4em]">Secure Authentication Gateway</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-500 ml-1 tracking-widest">Administrator Email</label>
            <div className="relative group">
              <input 
                required
                name="email"
                type="email" 
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@freshari.com"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4.5 px-6 pl-14 text-sm text-white placeholder:text-gray-600 focus:border-[#22C55E] focus:bg-white/10 outline-none transition-all duration-300" 
              />
              <Mail className="absolute left-5 top-4.5 text-gray-500 group-focus-within:text-[#22C55E] transition-colors w-5 h-5" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-500 ml-1 tracking-widest">Master Password</label>
            <div className="relative group">
              <input 
                required
                name="password"
                type={showPassword ? "text" : "password"} 
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4.5 px-6 pl-14 pr-14 text-sm text-white placeholder:text-gray-600 focus:border-[#22C55E] focus:bg-white/10 outline-none transition-all duration-300" 
              />
              <Lock className="absolute left-5 top-4.5 text-gray-500 group-focus-within:text-[#22C55E] transition-colors w-5 h-5" />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-4.5 text-gray-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="pt-4">
            <button 
              disabled={loading}
              type="submit" 
              className="w-full bg-[#22C55E] text-[#062010] py-5 rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#1eb054] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[0_15px_30px_rgba(34,197,94,0.2)] disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? <Loader2 className="animate-spin" /> : <>Access Dashboard <ArrowRight size={20} /></>}
            </button>
          </div>
        </form>

        <div className="mt-12 text-center border-t border-white/5 pt-8">
          <div className="flex items-center justify-center gap-2 mb-2 text-gray-600">
            <Leaf size={14} className="text-[#22C55E]" />
            <p className="text-[9px] font-black uppercase tracking-widest leading-loose">
              Freshari Organic Systems
            </p>
          </div>
          <p className="text-gray-700 text-[8px] font-bold uppercase tracking-tighter">
            &copy; {new Date().getFullYear()} Protected by Advanced Encryption
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;