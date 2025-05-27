"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { MdEdit, MdDelete } from "react-icons/md";

type Challenge = {
  _id: string;
  judul: string;
  deskripsi: string;
  benefit: string;
};

export default function KelolaTantangan() {
  const router = useRouter();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ judul: "", deskripsi: "", benefit: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  // ⛔ Proteksi akses admin (harus login)
  useEffect(() => {
    const storedAdmin = localStorage.getItem("adminData");
    if (!storedAdmin) {
      router.push("/admin/login");
    }
  }, [router]);

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/challenges`);
      const data = await res.json();
      setChallenges(data);
    } catch {
      alert("Gagal memuat data tantangan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const resetForm = () => {
    setForm({ judul: "", deskripsi: "", benefit: "" });
    setEditingId(null);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.judul || !form.deskripsi || !form.benefit) {
      setError("Semua field harus diisi");
      return;
    }

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/admin/challenges/${editingId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/admin/challenges`;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Gagal menyimpan data");

      resetForm();
      fetchChallenges();
    } catch {
      alert("Gagal menyimpan data");
    }
  };

  const handleEdit = (challenge: Challenge) => {
    setForm({
      judul: challenge.judul,
      deskripsi: challenge.deskripsi,
      benefit: challenge.benefit,
    });
    setEditingId(challenge._id);
    setError("");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus tantangan ini?")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/challenges/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus");
      fetchChallenges();
    } catch {
      alert("Gagal menghapus tantangan");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F2EFE7] ml-64">
      <AdminSidebar />

      <main className="flex-grow p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#006A71] mb-8">Kelola Tantangan</h1>

        <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-xl shadow-md border border-[#cde3e5]">
          <h2 className="text-2xl font-semibold mb-4 text-[#006A71]">
            {editingId ? "Edit Tantangan" : "Tambah Tantangan Baru"}
          </h2>

          {error && <p className="text-red-600 mb-4">{error}</p>}

          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-700">Judul</label>
            <input
              type="text"
              value={form.judul}
              onChange={(e) => setForm({ ...form, judul: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#48A6A7] text-[#006A71]"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-700">Deskripsi</label>
            <textarea
              value={form.deskripsi}
              onChange={(e) => setForm({ ...form, deskripsi: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-[#48A6A7] text-[#006A71]"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-semibold text-gray-700">Benefit</label>
            <textarea
              value={form.benefit}
              onChange={(e) => setForm({ ...form, benefit: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 h-20 focus:outline-none focus:ring-2 focus:ring-[#48A6A7] text-[#006A71]"
            />
          </div>

          <button
            type="submit"
            className="bg-[#006A71] text-white py-2 px-6 rounded hover:bg-[#04868d] transition font-semibold"
          >
            {editingId ? "Update Tantangan" : "Tambah Tantangan"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="ml-4 py-2 px-6 border border-gray-400 rounded hover:bg-gray-100 transition"
            >
              Batal
            </button>
          )}
        </form>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-[#006A71]">Daftar Tantangan</h2>

          {loading ? (
            <p>Memuat tantangan...</p>
          ) : challenges.length === 0 ? (
            <p>Belum ada tantangan.</p>
          ) : (
            <div className="space-y-4">
              {challenges.map((challenge) => (
                <div
                  key={challenge._id}
                  className="bg-white rounded-xl shadow-md border border-[#cde3e5] p-6 flex justify-between items-start"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-[#006A71]">{challenge.judul}</h3>
                    <p className="mt-1 text-gray-700">{challenge.deskripsi}</p>
                    <p className="mt-1 text-gray-600 italic">{challenge.benefit}</p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEdit(challenge)}
                      className="text-[#48A6A7] hover:text-[#006A71]"
                      title="Edit Tantangan"
                    >
                      <MdEdit size={24} />
                    </button>
                    <button
                      onClick={() => handleDelete(challenge._id)}
                      className="text-red-600 hover:text-red-800"
                      title="Hapus Tantangan"
                    >
                      <MdDelete size={24} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
