"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/shared/ProductCard";
import { Filter, ChevronRight, Search as SearchIcon } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

const ShopContent = () => {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  useEffect(() => {
    setCategory(searchParams.get("category") || "");
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`,
        );
        setCategories(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const url = `${process.env.NEXT_PUBLIC_API_URL}/products?page=${page}&category=${category}&search=${search}&sortBy=${
          sortBy === "price" ? "pricing.price" : sortBy
        }&order=${order}`;
        const res = await axios.get(url);
        setProducts(res.data.products);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getProducts();
  }, [page, category, search, sortBy, order]);

  return (
    <main className="bg-[#f8fafc] min-h-screen pb-24 font-sans">
      <div className="main-container py-8 md:py-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6 border-b border-gray-200 pb-6">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-black text-[#0f172a] uppercase tracking-widest">
              Our Shop
            </h1>
            <p className="text-[#64748b] text-sm font-bold tracking-wide">
              {products.length} Items found
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <div className="relative w-full sm:w-[320px]">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="bg-white border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 outline-none w-full text-sm font-bold text-[#0f172a] placeholder:text-[#94a3b8] placeholder:font-medium shadow-sm focus:border-[#f97316] transition-colors"
              />
            </div>

            <select
              onChange={(e) => {
                const val = e.target.value;
                if (val === "priceLow") {
                  setSortBy("price");
                  setOrder("asc");
                } else if (val === "priceHigh") {
                  setSortBy("price");
                  setOrder("desc");
                } else {
                  setSortBy("createdAt");
                  setOrder("desc");
                }
              }}
              className="bg-white border border-gray-200 rounded-xl py-3.5 px-5 outline-none text-sm font-bold text-[#0f172a] shadow-sm cursor-pointer hover:border-[#f97316] transition-colors w-full sm:w-auto appearance-none"
            >
              <option value="newest">Sort by: Newest</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          <aside className="lg:col-span-3 w-full">
            <div className="bg-white p-5 lg:p-6 rounded-[24px] border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] lg:sticky lg:top-28">
              <h3 className="text-sm font-black text-[#0f172a] uppercase tracking-widest mb-4 lg:mb-6 flex items-center gap-3">
                <Filter className="w-5 h-5 text-[#f97316]" /> Categories
              </h3>

              <div className="hidden lg:flex flex-col gap-2">
                <button
                  onClick={() => setCategory("")}
                  className={`w-full text-left px-5 py-3.5 rounded-xl text-[13px] font-bold transition-all flex items-center justify-between group border ${
                    category === ""
                      ? "bg-[#0f172a] border-[#0f172a] text-white shadow-md shadow-slate-900/20"
                      : "bg-[#f8fafc] border-gray-100 text-[#475569] hover:border-[#0f172a]/20 hover:bg-gray-50"
                  }`}
                >
                  <span className="whitespace-nowrap">All Products</span>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      category === ""
                        ? "text-white"
                        : "text-gray-300 group-hover:text-[#0f172a] group-hover:translate-x-1"
                    }`}
                  />
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => setCategory(cat.slug)}
                    className={`w-full text-left px-5 py-3.5 rounded-xl text-[13px] font-bold transition-all flex items-center justify-between group border ${
                      category === cat.slug
                        ? "bg-[#0f172a] border-[#0f172a] text-white shadow-md shadow-slate-900/20"
                        : "bg-[#f8fafc] border-gray-100 text-[#475569] hover:border-[#0f172a]/20 hover:bg-gray-50"
                    }`}
                  >
                    <span className="whitespace-nowrap">{cat.name}</span>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        category === cat.slug
                          ? "text-white"
                          : "text-gray-300 group-hover:text-[#0f172a] group-hover:translate-x-1"
                      }`}
                    />
                  </button>
                ))}
              </div>

              <div className="lg:hidden w-full pt-1 pb-2">
                <Swiper
                  slidesPerView="auto"
                  spaceBetween={10}
                  autoplay={{ delay: 2500, disableOnInteraction: false }}
                  modules={[Autoplay]}
                  className="w-full"
                >
                  <SwiperSlide className="!w-auto">
                    <button
                      onClick={() => setCategory("")}
                      className={`px-6 py-2.5 rounded-full text-[13px] font-bold transition-all border ${
                        category === ""
                          ? "bg-[#0f172a] border-[#0f172a] text-white shadow-md"
                          : "bg-[#f8fafc] border-gray-200 text-[#475569]"
                      }`}
                    >
                      All Products
                    </button>
                  </SwiperSlide>
                  {categories.map((cat) => (
                    <SwiperSlide key={cat._id} className="!w-auto">
                      <button
                        onClick={() => setCategory(cat.slug)}
                        className={`px-6 py-2.5 rounded-full text-[13px] font-bold transition-all border ${
                          category === cat.slug
                            ? "bg-[#0f172a] border-[#0f172a] text-white shadow-md"
                            : "bg-[#f8fafc] border-gray-200 text-[#475569]"
                        }`}
                      >
                        {cat.name}
                      </button>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-9 w-full">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 opacity-60">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white border border-gray-100 shadow-sm rounded-[24px] aspect-[3/4] animate-pulse"
                  ></div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="mt-16 flex justify-center gap-3">
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={`w-12 h-12 rounded-xl font-black text-[13px] transition-all duration-300 cursor-pointer ${
                          page === i + 1
                            ? "bg-[#f97316] text-white shadow-[0_10px_20px_rgba(249,115,22,0.3)]"
                            : "bg-white border border-gray-200 text-[#64748b] hover:border-[#0f172a] hover:text-[#0f172a]"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[32px] border border-dashed border-gray-200 shadow-sm">
                <div className="w-16 h-16 bg-[#f8fafc] rounded-full flex items-center justify-center mb-4">
                  <SearchIcon className="w-6 h-6 text-gray-300" />
                </div>
                <p className="uppercase font-black text-[#0f172a] text-lg tracking-widest mb-1">
                  No Products Found
                </p>
                <p className="text-sm font-bold text-gray-400">
                  Try adjusting your search or filter
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ShopContent;
