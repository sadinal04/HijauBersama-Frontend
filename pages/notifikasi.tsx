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
  read?: boolean;
};

export default function NotifikasiPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const userData = localStorage.getItem("userData");
        const token = userData ? JSON.parse(userData).token : null;

        if (!token) throw new Error("Harap login terlebih dahulu.");

        const res = await fetch("http://localhost:5000/api/user/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Cek apakah response berformat JSON
        const contentType = res.headers.get("content-type");
        if (!res.ok) {
          if (contentType && contentType.includes("application/json")) {
            const data = await res.json();
            throw new Error(data.message || "Gagal memuat notifikasi");
          } else {
            // Jika bukan JSON, tampilkan teks sebagai error
            const text = await res.text();
            throw new Error(text || "Gagal memuat notifikasi (bukan JSON)");
          }
        }

        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Response bukan JSON");
        }

        const data = await res.json();

        // Mengurutkan notifikasi berdasarkan 'createdAt' terbaru
        const sortedNotifications = data.sort(
          (a: Notification, b: Notification) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setNotifications(sortedNotifications);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

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
                <li key={notif._id}>
                  <Link href={notif.link}>
                    <div className="p-4 bg-[#E1F1F2] border border-[#cde3e5] rounded-xl shadow-sm hover:bg-[#d8edee] cursor-pointer">
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
