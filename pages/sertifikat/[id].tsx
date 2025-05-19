"use client";

import { useEffect, useRef, useState } from "react";

export default function CanvasCertificate() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#006A71";
    ctx.lineWidth = 10;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    ctx.fillStyle = "#006A71";
    ctx.font = "bold 30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("🏆 SERTIFIKAT PENGHARGAAN", canvas.width / 2, 100);

    ctx.fillStyle = "#333";
    ctx.font = "24px Arial";
    ctx.fillText("Diberikan kepada", canvas.width / 2, 160);

    ctx.fillStyle = "#000";
    ctx.font = "bold 28px Arial";
    ctx.fillText("🌿 Nama Pengguna", canvas.width / 2, 210);

    ctx.fillStyle = "#555";
    ctx.font = "20px Arial";
    ctx.fillText("Atas keberhasilan menyelesaikan tantangan", canvas.width / 2, 270);
    ctx.fillStyle = "#006A71";
    ctx.font = "italic 22px Arial";
    ctx.fillText("“Menanam Pohon di Rumah”", canvas.width / 2, 310);

    ctx.fillStyle = "#aaa";
    ctx.font = "16px Arial";
    ctx.fillText("HijauBersama • April 2025", canvas.width / 2, 380);

    const dataURL = canvas.toDataURL("image/png");
    setDownloadUrl(dataURL);

    // Tampilkan animasi setelah render
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4 p-8 bg-[#F2EFE7] min-h-screen overflow-hidden">
      <h1
        className={`text-xl font-bold text-[#006A71] mb-4 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        }`}
      >
        Preview Sertifikat
      </h1>

      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        className={`shadow-lg border transition-all duration-700 ${
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
      />

      <a
        href={downloadUrl}
        download="sertifikat-hijaubersama.png"
        className={`bg-[#006A71] text-white px-6 py-2 rounded-full hover:bg-[#004B50] transition duration-300 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        📥 Download Sertifikat
      </a>

      <button
        onClick={() => history.back()}
        className={`text-[#006A71] mt-4 hover:underline transition-opacity duration-500 delay-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        ← Kembali ke Notifikasi
      </button>
    </div>
  );
}
