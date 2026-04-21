"use client";
import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
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
      if (query.length > 1) {
        try {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products?search=${query}&limit=5`);
          setSuggestions(res.data.products || []);
          setShowSuggestions(true);
        } catch (error) {
          console.error(error);
        }
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
    <div className="flex-1 max-w-xl relative" ref={searchRef}>
      <div className="flex items-center bg-[#f3f4f6] rounded-full px-5 py-2.5 border-2 border-transparent focus-within:border-[#16a34a] focus-within:bg-white transition-all">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleSearch}
          placeholder="তাজা সবজি বা ফল খুঁজুন..."
          className="w-full bg-transparent border-none outline-none text-sm text-[#064e3b] font-medium placeholder:text-gray-400"
        />
        {query && <X onClick={() => setQuery("")} className="w-4 h-4 text-gray-400 mr-2 cursor-pointer hover:text-red-500" />}
        <Search onClick={onSearchClick} className="text-[#16a34a] w-5 h-5 cursor-pointer" />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 w-full bg-white mt-2 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[1100]">
          {suggestions.map((item) => (
            <Link
              key={item._id}
              href={`/product/${item.slug}`}
              onClick={() => setShowSuggestions(false)}
              className="flex items-center gap-4 p-3 hover:bg-[#f0fdf4] transition-colors border-b border-gray-50 last:border-0"
            >
              <div className="w-10 h-10 relative bg-gray-50 rounded-lg overflow-hidden">
                <Image src={item.media.thumbnail} alt={item.name} fill className="object-contain" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-[#064e3b]">{item.name}</h4>
                <p className="text-[11px] font-black text-[#16a34a]">৳ {item.pricing.price}</p>
              </div>
            </Link>
          ))}
          <div onClick={onSearchClick} className="p-3 bg-gray-50 text-center text-xs font-black text-[#16a34a] cursor-pointer hover:bg-[#16a34a] hover:text-white transition-all">
            SEE ALL RESULTS FOR "{query.toUpperCase()}"
          </div>
        </div>
      )}
    </div>
  );
};

export default Searchbar;