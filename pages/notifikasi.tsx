"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar"; // sesuaikan path jika berbeda
import Footer from "@/components/Footer";

const NotifikasiPage = () => {
  const notifikasi = [
    {
      id: 1,
      pesan:
        "✅ Anda telah berhasil menyelesaikan dan diverifikasi dalam Tantangan 'Tanam Pohon di Rumah'. Klik untuk melihat sertifikat Anda.",
      link: "/sertifikat",
    },
    {
      id: 2,
      pesan:
        "📢 Tantangan baru tersedia: 'Kurangi Sampah Plastik'. Ikuti sekarang untuk mendapatkan poin dan sertifikat.",
      link: "/tantangan",
    },
    {
      id: 3,
      pesan:
        "🎉 Foto Anda di Galeri telah mendapatkan lebih dari 10 suka. Terima kasih telah menginspirasi komunitas!",
      link: "/galeri",
    },
    {
      id: 4,
      pesan:
        "📰 Artikel baru: 'Cara Membuat Kompos dari Sampah Dapur'. Baca sekarang untuk menambah wawasan.",
      link: "/edukasi",
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F2EFE7] pt-30 px-4 sm:px-6 lg:px-8">
        <section className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8">
          <h1 className="text-3xl font-semibold text-[#006A71] mb-6">Pusat Notifikasi</h1>

          <div className="flex flex-col gap-5">
            {notifikasi.map((notif, index) => (
              <Link key={notif.id} href={notif.link}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                  className="p-5 bg-[#E1F1F2] border border-[#cde3e5] rounded-xl shadow-sm hover:bg-[#d8edee] transition-colors cursor-pointer"
                >
                  <p className="text-[#003D40] text-base sm:text-lg leading-relaxed">
                    {notif.pesan}
                  </p>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default NotifikasiPage;
