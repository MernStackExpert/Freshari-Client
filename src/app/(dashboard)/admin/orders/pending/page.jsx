"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "@/utils/axiosInstance";
import {
  Search,
  Eye,
  CheckCircle,
  Trash2,
  X,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  ShoppingCart,
  Mail,
  MessageCircle,
  StickyNote,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const PendingOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchPendingOrders();
  }, [currentPage]);

  const fetchPendingOrders = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/orders?page=${currentPage}&limit=${limit}`,
      );
      const allOrders = res.data.orders || [];
      const pending = allOrders.filter(
        (order) => order.orderStatus === "pending",
      );
      setOrders(pending);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to mark this order as ${status}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#22C55E",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, proceed!",
      borderRadius: "2rem",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.patch(`/orders/${id}`, { orderStatus: status });
          Swal.fire({
            title: "Success!",
            text: `Order has been ${status}.`,
            icon: "success",
            confirmButtonColor: "#22C55E",
          });
          fetchPendingOrders();
          if (selectedOrder) setSelectedOrder(null);
        } catch (error) {
          Swal.fire("Error!", "Something went wrong.", "error");
        }
      }
    });
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Terminate Order?",
      text: "This order will be moved to terminated status!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, Terminate!",
      cursor: "pointer",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.patch(`/orders/${id}`, {
            orderStatus: "terminated",
          });
          Swal.fire({
            title: "Terminated!",
            text: "Order status has been updated to terminated.",
            icon: "success",
            confirmButtonColor: "#22C55E",
          });
          fetchPendingOrders();
        } catch (error) {
          Swal.fire("Error!", "Failed to terminate order.", "error");
        }
      }
    });
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone?.includes(searchTerm) ||
      order._id?.includes(searchTerm),
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#062010] uppercase tracking-tighter">
            Pending Orders
          </h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">
            Manage incoming freshari orders
          </p>
        </div>

        <div className="relative group w-full md:w-80">
          <input
            type="text"
            placeholder="Search by name, phone or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-100 py-3 pl-12 pr-4 rounded-2xl text-sm outline-none focus:border-[#22C55E] transition-all shadow-sm"
          />
          <Search
            className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-[#22C55E]"
            size={18}
          />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-[0.2em]">
                <th className="px-8 py-6 font-black">Customer</th>
                <th className="px-8 py-6 font-black">Items</th>
                <th className="px-8 py-6 font-black">Total</th>
                <th className="px-8 py-6 font-black text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td
                    colSpan="4"
                    className="py-20 text-center text-gray-400 font-bold uppercase text-xs tracking-widest"
                  >
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="py-20 text-center text-gray-400 font-bold uppercase text-xs tracking-widest"
                  >
                    No pending orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <p className="text-sm font-black text-[#062010]">
                        {order.customerName}
                      </p>
                      <p className="text-[11px] text-gray-400 font-bold mt-1">
                        {order.phone}
                      </p>
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-gray-600">
                      {order.products?.length} Items
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-black text-[#22C55E]">
                        ৳{order.total}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2.5 bg-green-50 text-[#22C55E] hover:bg-[#22C55E] hover:text-white rounded-xl transition-all cursor-pointer"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() =>
                            handleUpdateStatus(order._id, "shipped")
                          }
                          className="p-2.5 bg-blue-50 text-blue-500 hover:bg-blue-500 hover:text-white rounded-xl transition-all cursor-pointer"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(order._id)}
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
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="p-3 bg-white border border-gray-100 rounded-xl disabled:opacity-30 cursor-pointer"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-xs font-black text-[#062010] uppercase tracking-widest">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="p-3 bg-white border border-gray-100 rounded-xl disabled:opacity-30 cursor-pointer"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-[#062010]/60 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl relative z-10"
            >
              <div className="bg-[#062010] p-8 text-white flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tighter">
                    Order Details
                  </h2>
                  <p className="text-[10px] text-[#22C55E] font-bold uppercase tracking-[0.2em] mt-1">
                    ID: {selectedOrder._id}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 max-h-[75vh] overflow-y-auto space-y-8 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-gray-500">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Phone size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-black text-gray-400">
                          Phone
                        </p>
                        <p className="text-sm font-bold text-gray-800">
                          {selectedOrder.phone}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-500">
                      <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                        <MessageCircle size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-black text-gray-400">
                          WhatsApp
                        </p>
                        <p className="text-sm font-bold text-gray-800">
                          {selectedOrder.whatsapp || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-500">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <Mail size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-black text-gray-400">
                          Email Address
                        </p>
                        <p className="text-sm font-bold text-gray-800">
                          {selectedOrder.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-gray-500">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <MapPin size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-black text-gray-400">
                          Shipping Address
                        </p>
                        <p className="text-sm font-bold text-gray-800 leading-tight">
                          {selectedOrder.shippingAddress}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-500">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Calendar size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-black text-gray-400">
                          Date & Time
                        </p>
                        <p className="text-sm font-bold text-gray-800">
                          {new Date(selectedOrder.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-500">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <CreditCard size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-black text-gray-400">
                          Method
                        </p>
                        <p className="text-xs font-black uppercase text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md mt-1 inline-block">
                          {selectedOrder.paymentMethod}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50/50 p-6 rounded-3xl border border-yellow-100">
                  <div className="flex items-center gap-2 mb-2">
                    <StickyNote size={14} className="text-yellow-600" />
                    <p className="text-[10px] uppercase font-black text-yellow-700 tracking-widest">
                      Customer Note
                    </p>
                  </div>
                  <p className="text-sm text-yellow-800 font-medium italic">
                    {selectedOrder.note || "No special instructions provided."}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-[2rem] p-6">
                  <h4 className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-4 flex items-center gap-2">
                    <ShoppingCart size={14} /> Product List
                  </h4>
                  <div className="space-y-3">
                    {selectedOrder.products.map((item, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center text-sm font-bold border-b border-gray-200/50 pb-2 last:border-0 last:pb-0"
                      >
                        <span className="text-[#062010]">
                          {item.name}{" "}
                          <span className="text-gray-400 ml-1 text-xs">
                            × {item.quantity}
                          </span>
                        </span>
                        <span className="text-emerald-600 font-black">
                          ৳{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t-2 border-dashed border-gray-200 flex justify-between items-center">
                    <span className="text-xs font-black uppercase text-gray-400">
                      Total Order Value
                    </span>
                    <span className="text-xl font-black text-[#22C55E]">
                      ৳{selectedOrder.total}
                    </span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() =>
                      handleUpdateStatus(selectedOrder._id, "shipped")
                    }
                    className="flex-1 bg-[#22C55E] text-white py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:shadow-lg hover:shadow-green-200 transition-all cursor-pointer"
                  >
                    Ship Order
                  </button>
                  <button
                    onClick={() =>
                      handleUpdateStatus(selectedOrder._id, "cancelled")
                    }
                    className="flex-1 bg-red-50 text-red-500 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PendingOrdersPage;
