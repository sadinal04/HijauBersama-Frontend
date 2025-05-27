"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FiArrowLeft } from "react-icons/fi";

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

type Challenge = {
  _id: string;
  judul: string;
  deskripsi: string;
  benefit: string;
};

export default function DetailTantangan() {
  const params = useParams();
  const router = useRouter();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const userData = localStorage.getItem("userData");
    if (!userData) {
      router.push("/login");
      return;
    }

    const challengeId = Array.isArray(params.id) ? params.id[0] : params.id;
    if (!challengeId) {
      alert("ID tantangan tidak valid");
      router.push("/tantangan");
      return;
    }

    async function fetchDetail() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/challenges/${challengeId}`);
        if (!res.ok) throw new Error("Tantangan tidak ditemukan");
        const data = await res.json();
        setChallenge(data);
      } catch {
        alert("Gagal memuat detail tantangan");
        router.push("/tantangan");
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [params.id, router]);

  const userData = typeof window !== "undefined" ? localStorage.getItem("userData") : null;
  const user = userData ? JSON.parse(userData) : null;
  const token = user?.token || null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setPhotoFile(file);
    try {
      const base64 = await toBase64(file);
      setPhotoBase64(base64);
      setUploadError("");
      setUploadSuccess("");
    } catch {
      setUploadError("Gagal membaca file gambar");
    }
  };

  const handleUpload = async () => {
    if (!photoBase64) {
      setUploadError("Pilih foto terlebih dahulu");
      return;
    }
    if (!token) {
      alert("Harap login terlebih dahulu.");
      router.push("/login");
      return;
    }

    const challengeId = Array.isArray(params.id) ? params.id[0] : params.id;
    if (!challengeId) {
      setUploadError("Tantangan tidak valid");
      return;
    }

    setUploading(true);
    setUploadError("");
    setUploadSuccess("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/submissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          photo: photoBase64,
          challengeId,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Gagal upload bukti");
      }

      setUploadSuccess("Bukti tantangan berhasil dikirim!");
      setPhotoFile(null);
      setPhotoBase64("");
      alert("Bukti tantangan berhasil dikirim!");
    } catch (err: any) {
      setUploadError(err.message || "Gagal upload bukti");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#006A71]">
        Memuat detail tantangan...
      </div>
    );
  }

  if (!challenge) return null;

  return (
    <div className="bg-[#F2EFE7] min-h-screen flex flex-col pt-20">
      <Navbar />
      <main className="flex-grow max-w-4xl mx-auto px-6 py-10 bg-white rounded-xl shadow-md border border-[#cde3e5] relative">
        {/* Tombol Kembali */}
        <button
          onClick={() => router.back()}
          className="absolute top-6 left-6 flex items-center gap-1 text-[#006A71] hover:text-[#004f53] font-medium text-sm"
          aria-label="Kembali"
          type="button"
        >
          <FiArrowLeft size={18} />
          Kembali
        </button>

        <h1 className="text-4xl font-bold text-[#006A71] mb-6 text-center">{challenge.judul}</h1>
        <p className="text-gray-700 mb-6">{challenge.deskripsi}</p>
        <h3 className="text-2xl font-semibold text-[#006A71] mb-2">Benefit</h3>
        <p className="text-gray-600 italic mb-8">{challenge.benefit}</p>

        <div className="mb-6 max-w-md mx-auto">
          <h4 className="font-semibold text-[#006A71] mb-2">Upload Bukti Foto</h4>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mb-3 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#48A6A7]"
          />
          {uploadError && <p className="text-red-600 mb-2 text-center">{uploadError}</p>}
          {uploadSuccess && <p className="text-green-600 mb-2 text-center">{uploadSuccess}</p>}
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full bg-[#006A71] text-white py-3 rounded-md hover:bg-[#04868d] transition font-semibold shadow-md"
          >
            {uploading ? "Mengirim..." : "Kirim Bukti"}
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
