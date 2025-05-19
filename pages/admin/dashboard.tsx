"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { MdSchool, MdFlag, MdCheckCircle } from "react-icons/md";

export default function AdminDashboard() {
  const router = useRouter();
  const [adminData, setAdminData] = useState<{ name?: string } | null>(null);

  useEffect(() => {
    const storedAdmin = localStorage.getItem("adminData");
    if (!storedAdmin) {
      router.push("/admin/login");
      return;
    }
    setAdminData(JSON.parse(storedAdmin));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("adminData");
    router.push("/admin/login");
  };

  // Fungsi navigasi
  const goTo = (path: string) => {
    router.push(path);
  };

  return (
    <div className="flex min-h-screen bg-[#F2EFE7]">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Konten utama */}
      <div className="flex-grow p-8 ml-64">
        <header className="max-w-7xl mx-auto flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-[#006A71]">
            Selamat Datang, {adminData?.name || "Admin"}
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </header>

        <main className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-semibold text-[#006A71] mb-6">Dashboard Admin</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {/* Card Kelola Edukasi */}
            <div
              onClick={() => goTo("/admin/kelola-edukasi")}
              className="cursor-pointer bg-white rounded-xl shadow-lg border border-[#cde3e5] p-6 flex flex-col items-center justify-center hover:shadow-xl hover:border-[#006A71] transition"
            >
              <MdSchool size={48} className="text-[#006A71] mb-4" />
              <h3 className="text-xl font-semibold text-[#006A71] mb-2">Kelola Edukasi</h3>
              <p className="text-gray-600 text-center">
                Tambah, edit, dan hapus materi edukasi yang tersedia di aplikasi.
              </p>
            </div>

            {/* Card Kelola Tantangan */}
            <div
              onClick={() => goTo("/admin/kelola-tantangan")}
              className="cursor-pointer bg-white rounded-xl shadow-lg border border-[#cde3e5] p-6 flex flex-col items-center justify-center hover:shadow-xl hover:border-[#006A71] transition"
            >
              <MdFlag size={48} className="text-[#006A71] mb-4" />
              <h3 className="text-xl font-semibold text-[#006A71] mb-2">Kelola Tantangan</h3>
              <p className="text-gray-600 text-center">
                Kelola tantangan yang tersedia dan pengaturannya.
              </p>
            </div>

            {/* Card Verifikasi Tantangan */}
            <div
              onClick={() => goTo("/admin/verifikasi")}
              className="cursor-pointer bg-white rounded-xl shadow-lg border border-[#cde3e5] p-6 flex flex-col items-center justify-center hover:shadow-xl hover:border-[#006A71] transition"
            >
              <MdCheckCircle size={48} className="text-[#006A71] mb-4" />
              <h3 className="text-xl font-semibold text-[#006A71] mb-2">Verifikasi Tantangan</h3>
              <p className="text-gray-600 text-center">
                Verifikasi pengiriman tantangan dari peserta untuk validasi.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
