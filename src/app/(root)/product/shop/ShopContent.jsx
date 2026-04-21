"use client";
import React, { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/shared/ProductCard";
import { Filter, ChevronRight, Search as SearchIcon } from "lucide-react";

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
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
        setCategories(res.data);
      } catch (err) { console.error(err); }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const url = `${process.env.NEXT_PUBLIC_API_URL}/products?page=${page}&category=${category}&search=${search}&sortBy=${sortBy === "price" ? "pricing.price" : sortBy}&order=${order}`;
        const res = await axios.get(url);
        setProducts(res.data.products);
        setTotalPages(res.data.totalPages);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    getProducts();
  }, [page, category, search, sortBy, order]);

  return (
    <main className="bg-[#fcfdfd] min-h-screen pb-20">
      <div className="main-container py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-[#064e3b] uppercase tracking-tight">Our Shop</h1>
            <p className="text-gray-400 text-sm font-bold">{products.length} Items found</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="relative">
                <SearchIcon className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="পণ্য খুঁজুন..." className="bg-white border border-gray-100 rounded-2xl py-3 pl-10 pr-4 outline-none w-full md:w-[300px] text-sm font-medium shadow-sm focus:border-[#16a34a]" />
             </div>
             <select onChange={(e) => {
               const val = e.target.value;
               if(val === "priceLow") { setSortBy("price"); setOrder("asc"); }
               else if(val === "priceHigh") { setSortBy("price"); setOrder("desc"); }
               else { setSortBy("createdAt"); setOrder("desc"); }
             }} className="bg-white border border-gray-100 rounded-2xl py-3 px-4 outline-none text-sm font-bold text-[#064e3b] shadow-sm cursor-pointer">
                <option value="newest">Sort by: Newest</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
             </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm sticky top-24">
              <h3 className="text-sm font-black text-[#064e3b] uppercase tracking-widest mb-6 flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#16a34a]" /> Categories
              </h3>
              <div className="flex flex-col gap-1">
                <button onClick={() => setCategory("")} className={`text-left px-4 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-between group ${category === "" ? "bg-[#16a34a] text-white shadow-lg shadow-green-100" : "text-gray-500 hover:bg-gray-50"}`}>
                  All Products <ChevronRight className="w-3 h-3" />
                </button>
                {categories.map((cat) => (
                  <button key={cat._id} onClick={() => setCategory(cat.slug)} className={`text-left px-4 py-3 rounded-xl text-xs font-black transition-all flex items-center justify-between group ${category === cat.slug ? "bg-[#16a34a] text-white shadow-lg shadow-green-100" : "text-gray-500 hover:bg-gray-50"}`}>
                    {cat.name} <ChevronRight className="w-3 h-3" />
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="lg:col-span-9">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 opacity-40">
                {[...Array(8)].map((_, i) => <div key={i} className="bg-gray-100 rounded-3xl aspect-[3/4] animate-pulse"></div>)}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {products.map((product) => <ProductCard key={product._id} product={product} />)}
                </div>
                {totalPages > 1 && (
                  <div className="mt-16 flex justify-center gap-2">
                    {[...Array(totalPages)].map((_, i) => (
                      <button key={i} onClick={() => setPage(i + 1)} className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${page === i + 1 ? "bg-[#16a34a] text-white" : "bg-white border border-gray-100 text-gray-400"}`}>
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-32 bg-white rounded-[40px] border border-dashed border-gray-200 uppercase font-black text-gray-400 text-xs tracking-widest">No products found</div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};



export default ShopContent;