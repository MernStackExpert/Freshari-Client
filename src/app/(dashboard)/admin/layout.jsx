"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import axiosInstance from "@/utils/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingBag,
  Truck,
  Layers,
  Users,
  Settings,
  LogOut,
  Menu,
  Bell,
  Loader2,
  ChevronDown,
  Home,
  PlusCircle,
  List,
} from "lucide-react";

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [adminProfile, setAdminProfile] = useState(null);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("freshari_admin_token");
    const userJson = Cookies.get("admin_user");

    if (pathname === "/admin/login") {
      setIsLoading(false);
      return;
    }

    if (!token || !userJson) {
      router.push("/admin/login");
    } else {
      setIsLoading(false);
      fetchStats();
      fetchAdminProfile();
    }
  }, [pathname, router]);

  const fetchStats = async () => {
    try {
      const res = await axiosInstance.get("/admin-stats");
      setPendingCount(res.data.orderStats?.pending || 0);
    } catch (error) {
      console.error(error);
    }
  };

const fetchAdminProfile = async () => {
  try {
    const res = await axiosInstance.get("/admins/profile");
    setAdminProfile(res.data);
  } catch (error) {
    console.error("Profile fetch failed:", error);
    
    if (error.response?.status === 403) {
       handleLogout();
    }
  }
};
  const toggleMenu = (menuName) => {
    setOpenMenus((prev) => ({ ...prev, [menuName]: !prev[menuName] }));
  };

  const handleLogout = () => {
    Cookies.remove("freshari_admin_token");
    Cookies.remove("admin_user");
    router.push("/admin/login");
  };

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/admin" },
    {
      name: "Orders",
      icon: <Truck size={20} />,
      isDropdown: true,
      id: "orders",
      subMenu: [
        { name: "Pending Orders", path: "/admin/orders/pending" },
        { name: "Shipped Orders", path: "/admin/orders/shipped" },
        { name: "Manage Order", path: "/admin/orders/manage-order" },
      ],
    },
    {
      name: "Products",
      icon: <ShoppingBag size={20} />,
      isDropdown: true,
      id: "products",
      subMenu: [
        { name: "Manage Products", path: "/admin/products/manage-products" },
        { name: "Add Product", path: "/admin/products/add-product" },
      ],
    },
    {
      name: "Categories",
      icon: <Layers size={20} />,
      path: "/admin/categories",
    },
    { name: "Customers", icon: <Users size={20} />, path: "/admin/customers" },
    { name: "Settings", icon: <Settings size={20} />, path: "/admin/settings" },
  ];

  if (isLoading && pathname !== "/admin/login") {
    return (
      <div className="min-h-screen bg-[#062010] flex flex-col items-center justify-center text-white">
        <Loader2 className="animate-spin mb-4 text-[#22C55E]" size={40} />
        <p className="text-xs font-black uppercase tracking-[0.3em] opacity-60">
          Authenticating Freshari Admin...
        </p>
      </div>
    );
  }

  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 w-72 bg-[#062010] text-white z-[101] transform transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-8 flex items-center gap-3">
          <img
            src="/freshari.png"
            alt="Logo"
            className="w-10 h-10 object-contain"
          />
          <Link
            href="/admin"
            className="text-xl font-black tracking-tighter uppercase"
          >
            FRESHARI <span className="text-[#22C55E]">PANEL</span>
          </Link>
        </div>

        <nav className="mt-4 px-4 space-y-1">
          {menuItems.map((item) => (
            <div key={item.name}>
              {item.isDropdown ? (
                <>
                  <button
                    onClick={() => toggleMenu(item.id)}
                    className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl font-bold text-sm transition-all ${pathname.includes(item.id) ? "text-white bg-white/5" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
                  >
                    <div className="flex items-center gap-4">
                      {item.icon}
                      {item.name}
                    </div>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-300 ${openMenus[item.id] ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence>
                    {openMenus[item.id] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden ml-6 mt-1 space-y-1"
                      >
                        {item.subMenu.map((sub) => (
                          <Link
                            key={sub.path}
                            href={sub.path}
                            className={`block px-6 py-3 rounded-xl text-[13px] font-bold transition-all ${pathname === sub.path ? "text-[#22C55E] bg-[#22C55E]/10" : "text-gray-500 hover:text-white hover:bg-white/5"}`}
                            onClick={() => setIsSidebarOpen(false)}
                          >
                            {sub.name}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  href={item.path}
                  className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${pathname === item.path ? "bg-[#22C55E] text-white shadow-lg" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  {item.icon}
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="absolute bottom-8 left-0 w-full px-8 border-t border-white/5 pt-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 text-gray-400 hover:text-red-400 font-bold text-sm transition-colors uppercase tracking-widest cursor-pointer"
          >
            <LogOut size={20} /> Logout Account
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 md:px-10 sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-xl"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 rounded-xl transition-all text-[#062010] font-bold text-[10px] uppercase tracking-widest border border-green-100"
            >
              <Home size={16} className="text-[#22C55E]" />
              Visit Website
            </Link>
          </div>

          <div className="flex items-center gap-2 md:gap-6">
            <Link
              href="/admin/orders/pending"
              className="relative p-2 text-gray-400 hover:text-[#062010] transition-colors"
            >
              <Bell size={22} />
              {pendingCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full font-black border-2 border-white px-1">
                  {pendingCount}
                </span>
              )}
            </Link>

            <div className="h-8 w-px bg-gray-200 mx-1 hidden md:block" />

            <div className="flex items-center gap-3">
              <Link
                href="/admin/profile"
                className="flex items-center gap-3 group"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-[11px] font-black text-[#062010] uppercase leading-none">
                    {adminProfile?.name || "Admin"}
                  </p>
                  <p className="text-[8px] font-bold text-[#22C55E] uppercase tracking-tighter mt-1">
                    {adminProfile?.role || "Staff"}
                  </p>
                </div>
                <div className="h-11 w-11 rounded-2xl overflow-hidden border-2 border-gray-100 shadow-sm group-hover:border-[#22C55E] transition-all">
                  <img
                    src={
                      adminProfile?.img && adminProfile?.img !== "null"
                        ? adminProfile.img
                        : "https://ui-avatars.com/api/?name=Admin&background=062010&color=fff"
                    }
                    className="w-full h-full object-cover"
                    alt="Admin Profile"
                  />
                </div>
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#F9FBFA]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
