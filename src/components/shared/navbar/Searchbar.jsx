"use client";
import React, { useState, useEffect, useRef } from "react";
import { Search, X, ArrowRight, ChevronRight } from "lucide-react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Searchbar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim().length > 1) {
        try {
          const { data } = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/products?search=${query}&limit=5`,
          );
          setSuggestions(data.products || []);
          setShowSuggestions(true);
        } catch (error) {
          console.error(error);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
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
      setShowSuggestions(false);
    }
  };

  const onSearchClick = () => {
    if (query.trim()) {
      router.push(`/product/shop?search=${query}`);
      setShowSuggestions(false);
    }
  };

  return (
    <div className="flex-1 w-full relative z-[1000]" ref={searchRef}>
      <div className="relative flex items-center bg-[#f8fafc] rounded-full p-1.5 border border-gray-200 focus-within:border-[#0f172a] focus-within:bg-white focus-within:shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition-all duration-300">
        <div className="pl-4 pr-2">
          <Search className="w-5 h-5 text-[#64748b]" />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleSearch}
          placeholder="Search for products, brands..."
          className="w-full bg-transparent border-none outline-none text-sm text-[#0f172a] font-bold placeholder:text-[#94a3b8] placeholder:font-medium"
        />

        {query && (
          <button
            onClick={() => setQuery("")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-1 cursor-pointer"
          >
            <X className="w-4 h-4 text-[#64748b] hover:text-red-500 transition-colors" />
          </button>
        )}

        <button
          onClick={onSearchClick}
          className="bg-[#0f172a] text-white px-6 py-2.5 rounded-full text-sm font-bold tracking-wide hover:bg-[#1e293b] hover:shadow-lg transition-all duration-300 shrink-0 cursor-pointer"
        >
          Search
        </button>
      </div>

      {showSuggestions && query.trim().length > 1 && (
        <div className="absolute top-[calc(100%+12px)] left-0 w-full bg-white/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden z-[1100] animate-in fade-in slide-in-from-top-4 duration-300">
          {suggestions.length > 0 ? (
            <>
              <div className="max-h-[350px] overflow-y-auto no-scrollbar">
                {suggestions.map((item) => (
                  <Link
                    key={item._id}
                    href={`/product/${item.slug}`}
                    onClick={() => setShowSuggestions(false)}
                    className="flex items-center gap-4 p-4 hover:bg-[#f8fafc] transition-colors border-b border-gray-50 last:border-none group"
                  >
                    <div className="w-14 h-14 relative bg-white border border-gray-100 rounded-xl overflow-hidden shrink-0 group-hover:border-[#0f172a]/20 transition-colors">
                      <Image
                        src={item.media.thumbnail}
                        alt={item.name}
                        fill
                        className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-black text-[#0f172a] group-hover:text-[#f97316] transition-colors line-clamp-1">
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[13px] font-black text-[#f97316]">
                          ৳ {item.pricing.price}
                        </span>
                        {item.pricing.oldPrice > item.pricing.price && (
                          <span className="text-[11px] font-bold text-gray-400 line-through">
                            ৳ {item.pricing.oldPrice}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#f97316] transition-colors -translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100" />
                  </Link>
                ))}
              </div>

              <div
                onClick={onSearchClick}
                className="p-4 bg-[#f8fafc] flex items-center justify-center gap-2 text-xs font-black text-[#0f172a] cursor-pointer hover:bg-[#0f172a] hover:text-white transition-all duration-300 group"
              >
                SEE ALL RESULTS
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6 text-gray-300" />
              </div>
              <p className="text-sm font-bold text-[#0f172a]">
                No results found
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Try searching for something else
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Searchbar;
