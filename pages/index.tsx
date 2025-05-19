"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar"; // ganti path jika berbeda
import Footer from "@/components/Footer"; // ganti path jika berbeda

export default function HomePage() {
  const fiturUtama = [
    {
      title: "Forum",
      desc: "Diskusi & berbagi pengalaman dengan komunitas hijau.",
      icon: "💬",
      link: "/forum",
    },
    {
      title: "Edukasi",
      desc: "Tips penghijauan & edukasi lingkungan yang inspiratif.",
      icon: "📖",
      link: "/edukasi",
    },
    {
      title: "Tantangan",
      desc: "Ikuti tantangan lingkungan & dapatkan sertifikat.",
      icon: "🌱",
      link: "/tantangan",
    },
    {
      title: "Galeri",
      desc: "Lihat aksi nyata komunitas dalam galeri hijau.",
      icon: "📸",
      link: "/galeri",
    },
  ];

  return (
    <main className="bg-[#F2EFE7] text-[#006A71] font-sans relative overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative text-white py-32 px-6 text-center overflow-hidden bg-gradient-to-r from-[#48A6A7] to-[#006A71]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('background1.jpg')" }}
        />

        <div className="relative z-10">
          <motion.h1
            className="text-5xl font-bold drop-shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            🌿 HijauBersama 🌿
          </motion.h1>
          <motion.p
            className="mt-4 text-lg max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Bergabunglah bersama kami untuk menciptakan bumi yang lebih hijau dan lestari 🌍
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
          >
            <Link href="/login">
              <button className="mt-6 bg-white text-[#006A71] px-8 py-3 rounded-lg text-lg font-medium shadow-md hover:bg-[#9ACBD0] transition transform hover:scale-105 hover:shadow-lg">
                Bergabung Sekarang
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Fitur Utama */}
      <motion.section
        className="py-20 px-6 text-center bg-[#F2EFE7]"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-semibold mb-10">Fitur Unggulan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {fiturUtama.map((fitur, index) => (
            <Link key={index} href={fitur.link}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="bg-white p-6 rounded-2xl shadow-md border border-[#cde3e5] cursor-pointer transition"
              >
                <h3 className="text-xl font-semibold mb-2">
                  {fitur.icon} {fitur.title}
                </h3>
                <p className="text-sm text-[#004f53]">{fitur.desc}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="bg-[#006A71] text-white py-16 px-6 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl font-bold mb-4">Ayo Mulai Aksi Hijaumu Hari Ini! 🌱</h2>
        <p className="max-w-xl mx-auto text-sm text-gray-100 mb-6">
          Daftar sekarang dan jadilah bagian dari perubahan positif untuk lingkungan kita.
        </p>
        <Link href="/login">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-white text-[#006A71] px-8 py-3 rounded-md shadow-md hover:bg-[#9ACBD0] transition font-medium"
          >
            Daftar Sekarang
          </motion.button>
        </Link>
      </motion.section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
