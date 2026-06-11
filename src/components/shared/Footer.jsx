"use client";
import React, { useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import {
  FaFacebookF,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaEnvelope,
} from "react-icons/fa";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("অনুগ্রহ করে একটি সঠিক ইমেইল এড্রেস দিন");
      return;
    }
    toast.success("নিউজলেটার সাবস্ক্রাইব করার জন্য ধন্যবাদ!");
    setEmail("");
  };

  return (
    <footer className="bg-[#0f172a] text-white pt-20 pb-8 relative overflow-hidden font-sans">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#f97316] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#16a34a] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

      <div className="main-container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link
              href="/"
              className="text-3xl font-black tracking-tighter flex items-center gap-1"
            >
              ARSHE<span className="text-[#f97316]">MART.</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed font-medium">
              বিশুদ্ধতা এবং বিশ্বস্ততার নিশ্চয়তা। প্রতিদিনের প্রয়োজনীয় খাঁটি এবং
              ফ্রেশ সামগ্রী এখন আপনার হাতের নাগালে।
            </p>
            <div className="flex items-center gap-3">
              <Link
                href="https://www.facebook.com/share/18Xjn8W7Bn/"
                target="_blank"
                className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-[#f97316] hover:text-white transition-all duration-300 group border border-white/10 shadow-sm"
              >
                <FaFacebookF className="text-sm transition-transform group-hover:scale-110" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-black uppercase tracking-widest mb-6 text-white">
              Quick Links
            </h4>
            <ul className="space-y-4 text-gray-400 text-sm font-medium">
              {[
                { name: "Home", path: "/" },
                { name: "Shop Products", path: "/product/shop" },
                { name: "About Us", path: "/about" },
                { name: "Support Center", path: "/support" },
                { name: "Checkout", path: "/checkout" },
              ].map((link, i) => (
                <li key={i}>
                  <Link
                    href={link.path}
                    className="hover:text-[#f97316] hover:translate-x-2 transition-all duration-300 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-black uppercase tracking-widest mb-6 text-white">
              Contact Us
            </h4>
            <div className="space-y-5 text-gray-400 text-sm font-medium">
              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#f97316]/20 transition-colors border border-white/5">
                  <FaMapMarkerAlt className="text-[#f97316] text-sm" />
                </div>
                <span className="mt-2.5">খড়কি পীর বাড়ি, যশোর, বাংলাদেশ</span>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#f97316]/20 transition-colors border border-white/5">
                  <FaPhoneAlt className="text-[#f97316] text-sm" />
                </div>
                <span>+880 1724383623</span>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#f97316]/20 transition-colors border border-white/5">
                  <FaEnvelope className="text-[#f97316] text-sm" />
                </div>
                <span>Arshe-Mart.shop@gmail.com</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-sm font-black uppercase tracking-widest mb-6 text-white">
              Newsletter
            </h4>
            <p className="text-gray-400 text-sm font-medium">
              আমাদের নতুন অফার এবং আপডেট পেতে সাবস্ক্রাইব করুন।
            </p>
            <form onSubmit={handleSubscribe} className="relative mt-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-white/5 border border-white/10 py-3.5 pl-4 pr-12 rounded-xl focus:outline-none focus:border-[#f97316] text-sm placeholder:text-gray-500 text-white font-medium transition-colors"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bg-[#f97316] p-2 rounded-lg hover:bg-[#ea580c] transition-all cursor-pointer text-white hover:scale-105"
              >
                <FaPaperPlane className="text-sm" />
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-5 text-xs md:text-sm text-gray-400 font-medium">
          <p>
            © {new Date().getFullYear()} Arshe-Mart. All Rights Reserved.
            Created by{" "}
            <a
              href="https://arshetechnology.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#f97316] font-black hover:underline"
            >
              ARSHE TECHNOLOGY
            </a>
          </p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-white transition-colors">
              About Us
            </Link>
            <Link
              href="/support"
              className="hover:text-white transition-colors"
            >
              Support
            </Link>
            <Link
              href="/product/shop"
              className="hover:text-white transition-colors"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
