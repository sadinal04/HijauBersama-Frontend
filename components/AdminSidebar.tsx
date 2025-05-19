"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MdDashboard,
  MdSchool,
  MdFlag,
  MdLogout,
  MdCheckCircle, // Ikon untuk verifikasi
} from "react-icons/md";

export default function AdminSidebar() {
  const router = useRouter();
  const [adminData, setAdminData] = useState<{ name?: string } | null>(null);

  useEffect(() => {
    const storedAdmin = localStorage.getItem("adminData");
    if (storedAdmin) {
      setAdminData(JSON.parse(storedAdmin));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminData");
    router.push("/admin/login");
  };

  // Menu items
  const menuItems = [
    { label: "Dashboard", icon: <MdDashboard size={24} />, path: "/admin/" },
    { label: "Kelola Edukasi", icon: <MdSchool size={24} />, path: "/admin/kelola-edukasi" },
    { label: "Kelola Tantangan", icon: <MdFlag size={24} />, path: "/admin/kelola-tantangan" },
    { label: "Verifikasi", icon: <MdCheckCircle size={24} />, path: "/admin/verifikasi" }, // Fitur verifikasi
  ];

  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-white shadow-md border-r border-[#cde3e5] flex flex-col">
      <div className="p-6 border-b border-[#cde3e5] flex flex-col items-center">
        <div className="mb-2 w-16 h-16 bg-[#006A71] rounded-full flex items-center justify-center text-white text-3xl font-bold">
          {adminData?.name ? adminData.name.charAt(0).toUpperCase() : "A"}
        </div>
        <p className="text-[#006A71] font-semibold text-lg text-center">
          {adminData?.name || "Admin"}
        </p>
      </div>

      <nav className="flex-grow mt-6">
        {menuItems.map(({ label, icon, path }) => (
          <button
            key={label}
            onClick={() => router.push(path)}
            className="flex items-center gap-3 w-full px-6 py-3 hover:bg-[#E1F0F0] text-[#006A71] font-medium transition"
          >
            {icon}
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-[#cde3e5]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-6 py-3 text-red-600 font-semibold hover:bg-red-100 rounded transition"
        >
          <MdLogout size={24} />
          Logout
        </button>
      </div>
    </aside>
  );
}
