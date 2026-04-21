"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axiosInstance from "@/utils/axiosInstance";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Package,
  ShoppingBasket,
} from "lucide-react";
import Swal from "sweetalert2";
import Link from "next/link";

const ManageProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/products?page=${currentPage}&limit=${limit}&search=${searchTerm}`,
      );
      setProducts(res.data.products || []);
      setTotalCount(res.data.totalProducts || 0);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This product will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, Delete",
      cursor: "pointer",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/products/${id}`);
          Swal.fire("Deleted!", "Product removed.", "success");
          fetchProducts();
        } catch (error) {
          Swal.fire("Error!", "Delete failed.", "error");
        }
      }
    });
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-[#22C55E]/10 rounded-3xl text-[#22C55E]">
            <ShoppingBasket size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#062010] uppercase tracking-tighter">
              Inventory ({totalCount})
            </h1>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">
              Live Product Database
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="relative group w-full md:w-64">
            <input
              type="text"
              placeholder="Search & Enter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchProducts()}
              className="w-full bg-white border border-gray-100 py-3 pl-10 pr-4 rounded-2xl text-sm outline-none focus:border-[#22C55E] transition-all"
            />
            <Search
              className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-[#22C55E]"
              size={16}
            />
          </div>
          <Link
            href="/admin/products/add-product"
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#22C55E] text-[#062010] px-6 py-3 rounded-2xl font-black uppercase text-[11px] tracking-widest cursor-pointer hover:shadow-lg transition-all"
          >
            <Plus size={18} /> Add New
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden font-sans">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-[0.2em]">
                <th className="px-8 py-6 font-black">Media & Name</th>
                <th className="px-8 py-6 font-black">Stock / SKU</th>
                <th className="px-8 py-6 font-black">Price (BDT)</th>
                <th className="px-8 py-6 font-black text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td
                    colSpan="4"
                    className="py-20 text-center text-xs font-black uppercase tracking-widest text-gray-300 animate-pulse"
                  >
                    Syncing Inventory...
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-gray-50/50 transition-all"
                  >
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <img
                          src={product.media?.thumbnail}
                          className="w-12 h-12 rounded-xl object-cover bg-gray-100 border border-gray-100"
                          alt=""
                        />
                        <div>
                          <p className="text-sm font-black text-[#062010] leading-none">
                            {product.name}
                          </p>
                          <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1 block">
                            {product.category?.main} / {product.category?.sub}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-xs font-black text-[#062010]">
                        {product.inventory?.stock} {product.inventory?.unit}
                      </p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter mt-0.5">
                        {product.sku}
                      </p>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-black text-[#22C55E]">
                        ৳{product.pricing?.price}
                      </p>
                      <p className="text-[9px] text-gray-400 line-through font-bold">
                        ৳{product.pricing?.oldPrice}
                      </p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/admin/products/details/${product._id}`}
                          className="p-2.5 bg-green-50 text-[#22C55E] hover:bg-[#22C55E] hover:text-white rounded-xl transition-all cursor-pointer"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link
                          href={`/admin/products/edit/${product._id}`}
                          className="p-2.5 bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white rounded-xl transition-all cursor-pointer"
                        >
                          <Edit3 size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all cursor-pointer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="p-3 bg-white border border-gray-100 rounded-xl cursor-pointer disabled:opacity-20 transition-all"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="p-3 bg-white border border-gray-100 rounded-xl cursor-pointer disabled:opacity-20 transition-all"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default ManageProductsPage;
