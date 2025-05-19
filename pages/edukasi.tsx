// edukasi/page.tsx
'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Edukasi() {
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.6 },
    }),
  };

  const sections = [
    {
      title: 'Mengapa Gaya Hidup Ramah Lingkungan Itu Penting?',
      content: (
        <p className="text-gray-700">
          Gaya hidup ramah lingkungan bukan hanya tentang mengurangi sampah, tetapi juga mencakup banyak aspek kehidupan sehari-hari.
          Mulai dari cara menghemat energi, mengurangi polusi, hingga merawat alam sekitar kita. Mengadopsi gaya hidup ini dapat membantu memperlambat perubahan iklim,
          menjaga keanekaragaman hayati, dan memastikan bumi yang lebih baik bagi generasi mendatang.
        </p>
      ),
    },
    {
      title: 'Teknik Menanam Pohon yang Efektif',
      content: (
        <>
          <p className="text-gray-700 mb-2">
            Menanam pohon adalah salah satu langkah penting dalam penghijauan dan pengurangan karbon dioksida. Berikut adalah beberapa langkah praktis untuk menanam pohon dengan benar:
          </p>
          <ol className="list-decimal pl-6 text-gray-700 space-y-1">
            <li>Persiapkan lubang tanam yang cukup dalam dan lebar untuk akar pohon.</li>
            <li>Pilih bibit pohon yang sesuai dengan iklim dan kondisi tanah lokal.</li>
            <li>Pastikan pohon ditanam dengan posisi tegak dan akar terisi tanah dengan baik.</li>
            <li>Sirami pohon setelah ditanam dan pastikan mendapatkan cahaya matahari yang cukup.</li>
          </ol>
        </>
      ),
    },
    {
      title: 'Manfaat Penghijauan bagi Lingkungan',
      content: (
        <>
          <p className="text-gray-700 mb-2">
            Penghijauan tidak hanya memberi manfaat bagi estetika, tetapi juga memiliki dampak positif yang besar terhadap lingkungan dan kesehatan. Beberapa manfaat penghijauan antara lain:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Meningkatkan kualitas udara dengan menyerap karbon dioksida.</li>
            <li>Menjaga keseimbangan ekosistem dan mendukung keberagaman hayati.</li>
            <li>Menyediakan tempat berlindung bagi berbagai spesies flora dan fauna.</li>
            <li>Mengurangi suhu lingkungan dan memberikan kenyamanan melalui naungan.</li>
          </ul>
        </>
      ),
    },
  ];

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

          <motion.p
            className="text-lg text-gray-700 mb-10 text-center max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Artikel dan panduan praktis seputar gaya hidup ramah lingkungan, teknik menanam pohon, serta manfaat penghijauan untuk bumi kita.
            Dilengkapi dengan video tutorial agar Anda bisa mengikuti langkah-langkah dengan mudah.
          </motion.p>

          {/* Sections */}
          {sections.map((section, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-xl mb-8 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
            >
              <h2 className="text-2xl font-semibold text-[#006A71] mb-4">{section.title}</h2>
              <div className="text-base">{section.content}</div>
            </motion.div>
          ))}

          {/* Video Tutorial */}
          <motion.div
            className="bg-white p-6 rounded-2xl shadow-xl mb-8 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            custom={sections.length}
          >
            <h2 className="text-2xl font-semibold text-[#006A71] mb-4">Video Tutorial: Cara Menanam Pohon dengan Benar</h2>
            <div className="relative pb-[56.25%] mb-4">
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg shadow-md"
                src="https://www.youtube.com/embed/71-B0DV-c8E"
                title="Video Tutorial Menanam Pohon"
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <p className="text-gray-700">
              Tonton video ini untuk melihat tutorial lengkap tentang cara menanam pohon yang benar, serta tips yang akan membuat pohon Anda tumbuh dengan sehat.
            </p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
