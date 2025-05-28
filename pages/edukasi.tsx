'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type EdukasiType = {
  _id: string;
  title: string;
  type: "artikel" | "video";
  content?: string;
  videoUrl?: string;
};

export default function Edukasi() {
  const [edukasiList, setEdukasiList] = useState<EdukasiType[]>([]);
  const [loading, setLoading] = useState(true);
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6 },
    }),
  };

  useEffect(() => {
    async function fetchEdukasi() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/edukasi`);
        if (!res.ok) throw new Error('Gagal mengambil data edukasi');
        const data = await res.json();
        setEdukasiList(data);
      } catch (err) {
        alert(err);
      } finally {
        setLoading(false);
      }
    }
    fetchEdukasi();
  }, []);

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F2EFE7] pt-20">
        <p className="text-[#006A71] text-xl">Memuat konten edukasi...</p>
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen bg-[#F2EFE7] pt-20">
      <Navbar />

      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <motion.h1
            className="text-4xl font-semibold text-[#006A71] mb-6 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Panduan Gaya Hidup Ramah Lingkungan 🌿
          </motion.h1>

          {edukasiList.length === 0 && (
            <p className="text-center text-gray-500">Belum ada konten edukasi tersedia.</p>
          )}

          {edukasiList.map((section, index) => (
            <motion.div
              key={section._id}
              className="bg-white p-6 rounded-2xl shadow-xl mb-8 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-2xl font-semibold text-[#006A71] mb-4">{section.title}</h2>

              {section.type === "artikel" && (
                <div
                  className="text-base text-gray-700"
                  dangerouslySetInnerHTML={{ __html: section.content || '' }}
                />
              )}

              {section.type === "video" && section.videoUrl && (
                <div className="relative pb-[56.25%] mt-4 rounded-lg overflow-hidden shadow-md">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={formatYoutubeEmbed(section.videoUrl)}
                    title={section.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Helper untuk mengubah link video Youtube biasa ke embed link
function formatYoutubeEmbed(url: string) {
  // Contoh input: https://www.youtube.com/watch?v=71-B0DV-c8E
  // Output: https://www.youtube.com/embed/71-B0DV-c8E
  const regExp = /^.*(youtu.be\/|v\/|watch\?v=|embed\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2]
    ? `https://www.youtube.com/embed/${match[2]}`
    : url;
}
