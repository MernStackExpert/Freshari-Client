"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "@/utils/axiosInstance";
import { 
  Search, Eye, Trash2, X, Phone, MapPin, Calendar, CreditCard, 
  ShoppingCart, Mail, MessageCircle, StickyNote, ChevronLeft, 
  ChevronRight, RotateCcw, CheckCircle2, AlertOctagon
} from "lucide-react";
import Swal from 'sweetalert2';

const ManageOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/orders?page=${currentPage}&limit=${limit}`);
      const allOrders = res.data.orders || [];
      const filtered = allOrders.filter(order => 
        order.orderStatus === "delivered" || order.orderStatus === "terminated"
      );
      setOrders(filtered);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreToPending = async (id) => {
    Swal.fire({
      title: 'Restore Order?',
      text: "Move this order back to Pending status?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#22C55E',
      confirmButtonText: 'Yes, Restore',
      cursor: 'pointer'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.patch(`/orders/${id}`, { orderStatus: "pending" });
          Swal.fire('Restored!', 'Order is now pending.', 'success');
          fetchOrders();
        } catch (error) {
          Swal.fire('Error!', 'Restore failed.', 'error');
        }
      }
    });
  };

  const handlePermanentDelete = async (id) => {
    Swal.fire({
      title: 'Delete Permanently?',
      text: "This will remove the order forever!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      confirmButtonText: 'Yes, Delete',
      cursor: 'pointer'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosInstance.delete(`/orders/${id}`);
          Swal.fire('Deleted!', 'Order removed.', 'success');
          fetchOrders();
        } catch (error) {
          Swal.fire('Error!', 'Delete failed.', 'error');
        }
      }
    });
  };

  const filteredOrders = orders.filter(order =>
    order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.phone?.includes(searchTerm)
  );

  const totalDelivered = orders.filter(o => o.orderStatus === "delivered").length;
  const totalTerminated = orders.filter(o => o.orderStatus === "terminated").length;

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-[#062010] uppercase tracking-tighter">Order History</h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Delivered & Terminated Records</p>
        </div>

        <div className="flex flex-wrap gap-4">
            <div className="bg-emerald-50 border border-emerald-100 px-5 py-3 rounded-2xl flex items-center gap-3">
                <CheckCircle2 className="text-emerald-600" size={20} />
                <div>
                    <p className="text-[10px] font-black uppercase text-emerald-700 leading-none">Delivered</p>
                    <p className="text-lg font-black text-emerald-900">{totalDelivered}</p>
                </div>
            </div>
            <div className="bg-red-50 border border-red-100 px-5 py-3 rounded-2xl flex items-center gap-3">
                <AlertOctagon className="text-red-600" size={20} />
                <div>
                    <p className="text-[10px] font-black uppercase text-red-700 leading-none">Terminated</p>
                    <p className="text-lg font-black text-red-900">{totalTerminated}</p>
                </div>
            </div>
        </div>

        <div className="relative group w-full md:w-72">
          <input
            type="text"
            placeholder="Search History..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-100 py-3 pl-10 pr-4 rounded-2xl text-sm outline-none focus:border-[#22C55E] transition-all shadow-sm"
          />
          <Search className="absolute left-3.5 top-3.5 text-gray-400 group-focus-within:text-[#22C55E]" size={16} />
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-[0.2em]">
                <th className="px-8 py-6 font-black">Customer Info</th>
                <th className="px-8 py-6 font-black text-center">Status</th>
                <th className="px-8 py-6 font-black">Total Bill</th>
                <th className="px-8 py-6 font-black text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan="4" className="py-20 text-center text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em]">Loading History...</td></tr>
              ) : filteredOrders.length === 0 ? (
                <tr><td colSpan="4" className="py-20 text-center text-gray-400 font-bold uppercase text-[10px] tracking-[0.3em]">No records found</td></tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order._id} className={`transition-colors ${order.orderStatus === 'terminated' ? 'bg-red-50/30 hover:bg-red-50/50' : 'bg-emerald-50/20 hover:bg-emerald-50/40'}`}>
                    <td className="px-8 py-6">
                      <p className="text-sm font-black text-[#062010]">{order.customerName}</p>
                      <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-tighter">{order.phone}</p>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className={`px-3 py-1 border text-[9px] font-black uppercase rounded-full ${order.orderStatus === 'delivered' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-8 py-6 font-black text-[#062010] text-sm">৳{order.total}</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => setSelectedOrder(order)} className="p-2 bg-white text-gray-400 hover:bg-[#062010] hover:text-white rounded-lg border border-gray-100 transition-all cursor-pointer">
                          <Eye size={16} />
                        </button>
                        {order.orderStatus === "terminated" && (
                          <button onClick={() => handleRestoreToPending(order._id)} className="p-2 bg-white text-green-600 hover:bg-green-600 hover:text-white rounded-lg border border-green-100 transition-all cursor-pointer">
                            <RotateCcw size={16} />
                          </button>
                        )}
                        <button onClick={() => handlePermanentDelete(order._id)} className="p-2 bg-white text-red-500 hover:bg-red-500 hover:text-white rounded-lg border border-red-100 transition-all cursor-pointer">
                          <Trash2 size={16} />
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

      <div className="flex justify-center items-center gap-4">
        <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="p-2.5 bg-white border border-gray-100 rounded-xl cursor-pointer disabled:opacity-20"><ChevronLeft size={18}/></button>
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Page {currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="p-2.5 bg-white border border-gray-100 rounded-xl cursor-pointer disabled:opacity-20"><ChevronRight size={18}/></button>
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedOrder(null)} className="absolute inset-0 bg-[#062010]/80 backdrop-blur-md cursor-pointer" />
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-white w-full max-w-3xl rounded-[3rem] overflow-hidden shadow-2xl relative z-10 font-sans">
              <div className="p-10 max-h-[85vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-[#062010] uppercase tracking-tighter">{selectedOrder.customerName}</h2>
                    <p className="text-[10px] font-bold text-[#22C55E] mt-2 tracking-widest uppercase inline-block bg-green-50 px-3 py-1 rounded-lg">Status: {selectedOrder.orderStatus}</p>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="p-2 bg-gray-100 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"><X size={20}/></button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                   <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-xl text-gray-500"><Phone size={16} /></div>
                        <div><p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Phone</p><p className="text-xs font-bold text-gray-800">{selectedOrder.phone}</p></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-50 text-green-600 rounded-xl"><MessageCircle size={16} /></div>
                        <div><p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">WhatsApp</p><p className="text-xs font-bold text-gray-800">{selectedOrder.whatsapp || "N/A"}</p></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-xl text-gray-500"><Mail size={16} /></div>
                        <div><p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Email</p><p className="text-xs font-bold text-gray-800 break-all">{selectedOrder.email}</p></div>
                      </div>
                   </div>
                   <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-xl text-gray-500"><MapPin size={16} /></div>
                        <div><p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Address</p><p className="text-xs font-bold text-gray-800 leading-tight">{selectedOrder.shippingAddress}</p></div>
                      </div>
                      <div className="flex items-center gap-3 text-gray-500">
                        <div className="p-2 bg-gray-100 rounded-xl"><Calendar size={16} /></div>
                        <div><p className="text-[9px] font-black uppercase text-gray-400 tracking-widest">Order Time</p><p className="text-xs font-bold text-gray-800">{new Date(selectedOrder.createdAt).toLocaleString()}</p></div>
                      </div>
                   </div>
                </div>

                <div className="bg-[#F9FBFA] rounded-3xl p-8 border border-gray-100">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">Order Items</h4>
                  <div className="space-y-4">
                    {selectedOrder.products.map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-sm font-bold pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                        <span className="text-[#062010]">{item.name} <span className="text-gray-400 ml-2 font-medium">× {item.quantity}</span></span>
                        <span className="text-emerald-600 font-black">৳{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-200 flex justify-between items-center">
                    <p className="text-xs font-black uppercase text-gray-400 tracking-widest">Final Amount Paid</p>
                    <p className="text-2xl font-black text-[#062010]">৳{selectedOrder.total}</p>
                  </div>
                </div>

                {selectedOrder.note && selectedOrder.note !== "N/A" && (
                  <div className="mt-8 flex items-start gap-3 bg-orange-50 p-6 rounded-2xl border border-orange-100">
                    <StickyNote size={18} className="text-orange-500 mt-1 shrink-0" />
                    <div><p className="text-[9px] font-black uppercase text-orange-600 tracking-widest mb-1">Note</p><p className="text-sm text-orange-800 font-medium italic">"{selectedOrder.note}"</p></div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageOrdersPage;