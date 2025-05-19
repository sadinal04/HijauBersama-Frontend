"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

export default function SertifikatPage() {
  const { id } = useParams();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSubmission() {
      try {
        const userData = localStorage.getItem("userData");
        if (!userData) throw new Error("Harap login terlebih dahulu.");

        const token = JSON.parse(userData).token;
        if (!token) throw new Error("Harap login terlebih dahulu.");

        const res = await fetch(`http://localhost:5000/api/submissions/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Gagal memuat data sertifikat");
        }

        const data = await res.json();
        setSubmission(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchSubmission();
  }, [id]);

  useEffect(() => {
    if (!submission) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Bersihkan canvas
    ctx.fillStyle = "#fff";
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
    ctx.fillText(`🌿 ${submission.userId.name}`, canvas.width / 2, 210);

    ctx.fillStyle = "#555";
    ctx.font = "20px Arial";
    ctx.fillText("Atas keberhasilan menyelesaikan tantangan", canvas.width / 2, 270);

    ctx.fillStyle = "#006A71";
    ctx.font = "italic 22px Arial";
    ctx.fillText(`“${submission.challengeId.judul}”`, canvas.width / 2, 310);

    ctx.fillStyle = "#aaa";
    ctx.font = "16px Arial";
    ctx.fillText("HijauBersama • " + new Date(submission.verifiedAt).toLocaleDateString(), canvas.width / 2, 380);
  }, [submission]);

  if (loading)
    return <p className="text-center mt-20 text-[#006A71]">Memuat sertifikat...</p>;

  if (error)
    return <p className="text-center mt-20 text-red-600">{error}</p>;

  if (!submission) return null;

  return (
    <div className="flex flex-col items-center gap-4 p-8 bg-[#F2EFE7] min-h-screen overflow-hidden">
      <h1 className="text-xl font-bold text-[#006A71] mb-4">Preview Sertifikat</h1>
      <canvas ref={canvasRef} width={800} height={500} className="shadow-lg border" />
      <a
        href={canvasRef.current?.toDataURL()}
        download="sertifikat-hijaubersama.png"
        className="bg-[#006A71] text-white px-6 py-2 rounded-full hover:bg-[#004B50] transition duration-300"
      >
        📥 Download Sertifikat
      </a>
    </div>
  );
}
