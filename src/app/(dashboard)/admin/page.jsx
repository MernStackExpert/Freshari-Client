"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axiosInstance from "@/utils/axiosInstance";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";
import {
  DollarSign,
  ShoppingBag,
  Package,
  Activity,
  Layers,
  TrendingUp,
} from "lucide-react";

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get("/admin-stats");
        setStats(res.data);
      } catch (error) {
        console.error("Failed to load real stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cardData = [
    {
      title: "Total Revenue",
      value: `৳${stats?.totalRevenue || 0}`,
      icon: <DollarSign />,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: <ShoppingBag />,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Total Products",
      value: stats?.totalProducts || 0,
      icon: <Package />,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      title: "Pending Orders",
      value: stats?.pendingOrders || 0,
      icon: <Activity />,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
  ];

  const distributionData = [
    { name: "Products", count: stats?.totalProducts || 0 },
    { name: "Categories", count: stats?.totalCategories || 0 },
    { name: "Banners", count: stats?.totalBanners || 0 },
    { name: "FAQs", count: stats?.totalFaqs || 0 },
  ];

  const orderStatusData = [
    { name: "Total", value: stats?.totalOrders || 0 },
    { name: "Pending", value: stats?.pendingOrders || 0 },
  ];

  const COLORS = ["#22C55E", "#3B82F6", "#F59E0B", "#EF4444"];

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[#F9FBFA]">
        <Loader2 className="animate-spin text-[#22C55E]" size={40} />
      </div>
    );

  return (
    <div className="space-y-10 pb-10">
      <div>
        <h1 className="text-3xl font-black text-[#062010] tracking-tighter uppercase">
          Freshari Insights
        </h1>
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.3em] mt-1">
          Live Database Statistics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardData.map((item, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={idx}
            className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm"
          >
            <div
              className={`w-12 h-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-6`}
            >
              {item.icon}
            </div>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
              {item.title}
            </p>
            <h2 className="text-3xl font-black text-[#062010] mt-1">
              {item.value}
            </h2>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
          <h3 className="text-xs font-black uppercase tracking-widest mb-8">
            Inventory Bar Analysis
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 800 }}
                />
                <Tooltip cursor={{ fill: "#F9FBFA" }} />
                <Bar dataKey="count" radius={[10, 10, 0, 0]} barSize={45}>
                  {distributionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#062010] p-8 rounded-[3rem] text-white shadow-2xl">
          <h3 className="text-xs font-black uppercase tracking-widest mb-8">
            Operational Radar
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                cx="50%"
                cy="50%"
                outerRadius="80%"
                data={distributionData}
              >
                <PolarGrid stroke="#ffffff10" />
                <PolarAngleAxis
                  dataKey="name"
                  tick={{ fill: "#94a3b8", fontSize: 10 }}
                />
                <Radar
                  name="Count"
                  dataKey="count"
                  stroke="#22C55E"
                  fill="#22C55E"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col items-center">
          <h3 className="text-xs font-black uppercase tracking-widest mb-4 w-full">
            Order Ratio
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {orderStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index + 1]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />{" "}
              <span className="text-[10px] font-bold uppercase text-gray-400">
                Total
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500" />{" "}
              <span className="text-[10px] font-bold uppercase text-gray-400">
                Pending
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm overflow-x-auto">
          <h3 className="text-xs font-black uppercase tracking-widest mb-8">
            Database Resource Count
          </h3>
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 text-[10px] uppercase tracking-widest border-b border-gray-50">
                <th className="pb-4 font-black">Resource Name</th>
                <th className="pb-4 font-black text-right">Live Count</th>
              </tr>
            </thead>
            <tbody className="text-[#062010] font-bold text-sm">
              <tr className="border-b border-gray-50">
                <td className="py-4 text-left">Active Categories</td>
                <td className="py-4 text-right">
                  {stats?.totalCategories || 0}
                </td>
              </tr>
              <tr className="border-b border-gray-50">
                <td className="py-4 text-left">System Banners</td>
                <td className="py-4 text-right">{stats?.totalBanners || 0}</td>
              </tr>
              <tr className="border-b border-gray-50">
                <td className="py-4 text-left">Support FAQs</td>
                <td className="py-4 text-right">{stats?.totalFaqs || 0}</td>
              </tr>
              <tr>
                <td className="py-4 text-left">Registered Admins</td>
                <td className="py-4 text-right">{stats?.totalAdmins || 0}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const Loader2 = ({ className, size }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export default DashboardPage;
