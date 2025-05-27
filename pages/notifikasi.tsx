"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Notification = {
  _id: string;
  message: string;
  link: string;
  createdAt: string;
  read: boolean;
};

export default function NotifikasiPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fungsi untuk fetch notifikasi
  const fetchNotifications = async () => {
    try {
      const userData = localStorage.getItem("userData");
      const token = userData ? JSON.parse(userData).token : null;
      if (!token) throw new Error("Harap login terlebih dahulu.");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Gagal memuat notifikasi");
      }

      const data = await res.json();

      // Urutkan terbaru di atas
      const sorted = data.sort(
        (a: Notification, b: Notification) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setNotifications(sorted);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Fungsi mark as read
  const markAsRead = async (id: string) => {
    try {
      const userData = localStorage.getItem("userData");
      const token = userData ? JSON.parse(userData).token : null;
      if (!token) throw new Error("Harap login terlebih dahulu.");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/notifications/${id}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Gagal menandai notifikasi sebagai sudah dibaca");

      // Update state lokal agar UI responsif
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (err: any) {
      alert(err.message || "Terjadi kesalahan saat menandai notifikasi");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-[#006A71]">
        Memuat notifikasi...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 p-4">
        <p>{error}</p>
      </div>
    );

  return (
    <>
      <Navbar />
      <main className="pt-30 min-h-screen bg-[#F2EFE7] pt-20 px-4 sm:px-6 lg:px-8">
        <section className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8">
          <h1 className="text-3xl font-semibold text-[#006A71] mb-6">Pusat Notifikasi</h1>
          {notifications.length === 0 ? (
            <p className="text-gray-600">Tidak ada notifikasi.</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {notifications.map((notif) => (
                <li
                  key={notif._id}
                  className="relative cursor-pointer"
                  onClick={() => {
                    if (!notif.read) markAsRead(notif._id);
                  }}
                >
                  <Link href={notif.link}>
                    <div
                      className={`p-4 border rounded-xl shadow-sm hover:bg-[#d8edee] ${
                        notif.read ? "bg-[#E1F1F2]" : "bg-yellow-100 border-yellow-400"
                      }`}
                    >
                      {!notif.read && (
                        <span className="absolute top-3 right-3 w-3 h-3 bg-red-500 rounded-full" />
                      )}

                      <p className="text-[#003D40] text-base sm:text-lg leading-relaxed">
                        {notif.message}
                      </p>
                      <small className="text-gray-400">
                        {new Date(notif.createdAt).toLocaleString()}
                      </small>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
