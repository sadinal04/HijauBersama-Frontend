"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type Challenge = {
  _id: string;
  judul: string;
  deskripsi: string;
  benefit: string;
};

export default function DaftarTantangan() {
  const [tantanganList, setTantanganList] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTantangan = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/challenges`);
        const data = await res.json();
        setTantanganList(data);
      } catch (error) {
        alert("Gagal memuat daftar tantangan");
      } finally {
        setLoading(false);
      }
    };

    fetchTantangan();
  }, []);

  return (
    <motion.div
      className="bg-[#F2EFE7] min-h-screen flex flex-col pt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Navbar />

      <main className="flex-grow">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <motion.h1
            className="text-4xl font-bold text-[#006A71] mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Pilih Tantangan Hijau 🌿
          </motion.h1>

          <motion.p
            className="text-lg text-gray-700 mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Pilih tantangan di bawah ini dan mulai perjalananmu menjaga lingkungan!
          </motion.p>

          {loading ? (
            <p className="text-center text-[#006A71]">Memuat tantangan...</p>
          ) : tantanganList.length === 0 ? (
            <p className="text-center text-gray-500">Belum ada tantangan tersedia.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tantanganList.map((tantangan, index) => (
                <motion.div
                  key={tantangan._id}
                  className="bg-white rounded-lg shadow-md p-6 border-l-4 border-[#48A6A7] hover:shadow-lg transition-transform transform hover:scale-105"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.2, duration: 0.6 }}
                >
                  <h2 className="text-2xl font-semibold text-[#006A71] mb-2">
                    {tantangan.judul}
                  </h2>
                  <p className="text-gray-700 mb-4">{tantangan.deskripsi}</p>
                  <Link href={`/tantangan/${tantangan._id}`}>
                    <button className="px-4 py-2 bg-[#9ACBD0] text-[#006A71] font-semibold rounded hover:bg-[#48A6A7] hover:text-white transition">
                      Ikuti Tantangan
                    </button>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </motion.div>
  );
}
