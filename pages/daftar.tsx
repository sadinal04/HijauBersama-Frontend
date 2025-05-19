"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function DaftarPage() {
  const router = useRouter();
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: nama, email, password }),
        });

        if (!res.ok) {
        const data = await res.json();
        alert(`Registrasi gagal: ${data.message}`);
        return;
        }

        alert("Registrasi berhasil! Silakan login.");
        router.push("/login");
    } catch (error) {
        alert("Terjadi kesalahan jaringan.");
    }
    };

  return (
    <main className="min-h-screen bg-[#F2EFE7] flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-md max-w-md w-full p-8 border border-[#cde3e5]">
        <h1 className="text-3xl font-bold text-[#006A71] text-center mb-6">Buat Akun Baru</h1>
        <p className="text-sm text-center text-[#004f53] mb-4">
          Isi formulir di bawah untuk membuat akun dan bergabung dengan komunitas HijauBersama 🌿
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-[#004f53]">Nama Lengkap</label>
            <input
              type="text"
              required
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              className="w-full px-4 py-2 border border-[#cde3e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A71] text-[#5C7C7D]"
              placeholder="Nama lengkap"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-[#004f53]">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-[#cde3e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A71] text-[#5C7C7D]"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-[#004f53]">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-[#cde3e5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A71] text-[#5C7C7D]"
              placeholder="Minimal 6 karakter"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#006A71] text-white py-3 rounded-lg hover:bg-[#048089] transition font-medium"
          >
            Daftar Sekarang
          </button>
        </form>

        <p className="text-sm text-center text-[#004f53] mt-6">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-[#006A71] underline font-semibold">
            Masuk di sini
          </Link>
        </p>
      </div>
    </main>
  );
}
