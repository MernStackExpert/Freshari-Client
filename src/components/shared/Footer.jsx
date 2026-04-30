"use client";
import React from "react";
import Link from "next/link";
import { 
  FaFacebookF, 
  FaInstagram, 
  FaYoutube, 
  FaTwitter, 
  FaRegEnvelope, 
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaPaperPlane 
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#064e3b] text-white pt-16 pb-8">
      <div className="main-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Info */}
          <div className="space-y-6">
            <Link href="/" className="text-3xl font-black tracking-tighter flex items-center gap-1">
              Fresh<span className="text-[#f97316]">Ari.</span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              আমরা সরাসরি কৃষকের মাঠ থেকে বিষমুক্ত এবং তাজা অর্গানিক সবজি ও ফল আপনার দরজায় পৌঁছে দিই। আপনার সুস্বাস্থ্যই আমাদের মূল লক্ষ্য।
            </p>
            <div className="flex items-center gap-4">
              {[
                { Icon: FaFacebookF, link: "https://www.facebook.com/share/18Xjn8W7Bn/" },
                // { Icon: FaInstagram, link: "#" },
                // { Icon: FaYoutube, link: "#" },
                // { Icon: FaTwitter, link: "#" }
              ].map((item, i) => (
                <Link 
                  key={i} 
                  href={item.link} 
                  target="blank"
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#f97316] transition-all group border border-white/5"
                >
                  <item.Icon className="text-lg transition-transform group-hover:scale-110" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 border-l-4 border-[#f97316] pl-3">প্রয়োজনীয় লিঙ্ক</h4>
            <ul className="space-y-4 text-gray-300 text-sm font-medium">
              {["আমাদের সম্পর্কে", "সকল পণ্য", "অফার সমূহ", "কিভাবে অর্ডার করবেন", "যোগাযোগ"].map((link, i) => (
                <li key={i}>
                  <Link href="#" className="hover:text-[#f97316] hover:translate-x-2 transition-all duration-300 inline-block">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="text-lg font-bold mb-6 border-l-4 border-[#f97316] pl-3">কাস্টমার সাপোর্ট</h4>
            <ul className="space-y-4 text-gray-300 text-sm font-medium">
              {["আপনার প্রোফাইল", "অর্ডার ট্র্যাকিং", "রিটার্ন পলিসি", "প্রাইভেসি পলিসি", "এফএকিউ (FAQ)"].map((link, i) => (
                <li key={i}>
                  <Link href="#" className="hover:text-[#f97316] hover:translate-x-2 transition-all duration-300 inline-block">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div className="space-y-6">
            <h4 className="text-lg font-bold mb-6 border-l-4 border-[#f97316] pl-3">নিউজলেটার</h4>
            <p className="text-gray-300 text-sm">অফার এবং নতুন পণ্যের আপডেট পেতে সাবস্ক্রাইব করুন।</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="আপনার ইমেইল" 
                className="w-full bg-white/10 border border-white/20 py-3 px-4 rounded-xl focus:outline-none focus:border-[#f97316] text-sm placeholder:text-gray-400"
              />
              <button className="absolute right-1.5 top-1.5 bg-[#f97316] p-2.5 rounded-lg hover:bg-[#ea580c] transition-colors cursor-pointer text-white">
                <FaPaperPlane className="text-sm" />
              </button>
            </div>
            <div className="pt-2 space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-300 group">
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-[#f97316]/20 transition-colors">
                   <FaPhoneAlt className="text-[#f97316] text-xs" />
                </div>
                <span>+880 1724383623</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300 group">
                <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-[#f97316]/20 transition-colors">
                   <FaMapMarkerAlt className="text-[#f97316] text-xs" />
                </div>
                <span>খড়কি পীর বাড়ি, যশোর, বাংলাদেশ</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs md:text-sm text-gray-400">
          <p>© {new Date().getFullYear()} FreshAri Grocery. All Rights Reserved. Developed by MD Nirob Sarkar.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;