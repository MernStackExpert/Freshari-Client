"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search as SearchIcon, ArrowRight } from "lucide-react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";

const MobileSearchModal = ({ isOpen, setIsOpen }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [defaultProducts, setDefaultProducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (isOpen && defaultProducts.length === 0) {
      const fetchDefault = async () => {
        try {
          const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products?limit=6`);
          setDefaultProducts(data.products || []);
        } catch (err) {}
      };
      fetchDefault();
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length > 1) {
        try {
          const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products?search=${query}&limit=6`);
          setSuggestions(data.products || []);
        } catch (error) {}
      } else {
        setSuggestions([]);
      }
    };
    const delayDebounceFn = setTimeout(() => {
      fetchSuggestions();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSearch = (e) => {
    if (e.key === "Enter" && query.trim()) {
      router.push(`/product/shop?search=${query}`);
      setIsOpen(false);
      setQuery("");
    }
  };

  const handleProductClick = (slug) => {
    router.push(`/product/${slug}`);
    setIsOpen(false);
    setQuery("");
  };

  const handleSeeAll = () => {
    if (query.trim()) {
      router.push(`/product/shop?search=${query}`);
      setIsOpen(false);
      setQuery("");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-white z-[3000] flex flex-col md:hidden w-full h-full overflow-hidden"
        >
          <div className="flex items-center gap-3 p-4 border-b border-gray-100 shadow-sm bg-white shrink-0">
            <div className="flex-1 relative flex items-center bg-[#f8fafc] rounded-xl p-1 border border-gray-200 focus-within:border-[#f97316] transition-colors">
              <div className="pl-3 pr-2">
                <SearchIcon className="w-5 h-5 text-[#64748b]" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleSearch}
                autoFocus
                placeholder="Search products..."
                className="w-full bg-transparent border-none outline-none text-sm text-[#0f172a] font-bold py-2.5 placeholder:text-[#94a3b8] placeholder:font-medium"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="p-2 hover:bg-gray-200 rounded-full mr-1"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              )}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-[#0f172a] font-bold text-sm shrink-0"
            >
              Cancel
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-[#f8fafc]">
            {query.trim().length > 1 ? (
              <div className="space-y-3">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Search Results</h3>
                {suggestions.length > 0 ? (
                  <>
                    {suggestions.map((item) => (
                      <div
                        key={item._id}
                        onClick={() => handleProductClick(item.slug)}
                        className="flex items-center gap-4 p-3 bg-white rounded-2xl border border-gray-100 shadow-sm active:scale-95 transition-transform"
                      >
                        <div className="w-14 h-14 relative bg-[#f8fafc] rounded-xl overflow-hidden shrink-0 border border-gray-100">
                          <Image src={item.media.thumbnail} alt={item.name} fill className="object-contain p-2" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-black text-[#0f172a] line-clamp-1">{item.name}</h4>
                          <span className="text-[13px] font-black text-[#f97316]">৳ {item.pricing.price}</span>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={handleSeeAll}
                      className="w-full mt-5 p-4 bg-[#0f172a] text-white rounded-2xl text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-md"
                    >
                      See all results <ArrowRight className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <SearchIcon className="w-6 h-6 text-gray-400" />
                    </div>
                    <p className="text-sm font-black text-[#0f172a]">No products found</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Suggested For You</h3>
                <div className="grid grid-cols-2 gap-3">
                  {defaultProducts.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => handleProductClick(item.slug)}
                      className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-3 active:scale-95 transition-transform"
                    >
                      <div className="w-full aspect-square relative bg-[#f8fafc] rounded-xl overflow-hidden">
                        <Image src={item.media.thumbnail} alt={item.name} fill className="object-contain p-3" />
                      </div>
                      <div>
                        <h4 className="text-[12px] font-black text-[#0f172a] line-clamp-2 leading-snug">{item.name}</h4>
                        <span className="text-[13px] font-black text-[#f97316] mt-1 block">৳ {item.pricing.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileSearchModal;