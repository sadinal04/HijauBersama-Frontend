"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Mohon isi email dan password!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(`Login gagal: ${data.message}`);
        return;
      }

      // Simpan token untuk otentikasi
      localStorage.setItem("token", data.token);

      // Simpan nama user untuk digunakan di forum dan halaman lain
      localStorage.setItem("userName", data.user.name);

      // Redirect ke halaman utama
      router.push("/");
    } catch (error) {
      alert("Terjadi kesalahan jaringan.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F2EFE7] px-4">
      <motion.div
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-[#cde3e5]"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-semibold text-center text-[#006A71] mb-6">
          Selamat Datang 🌿
        </h1>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[#006A71] font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contoh@email.com"
              className="w-full px-4 py-2 border rounded-md bg-[#F9F9F9] focus:outline-none focus:ring-2 focus:ring-[#48A6A7] text-[#5C7C7D]"
              required
            />
          </div>
          <div>
            <label className="block text-[#006A71] font-medium mb-1">Kata Sandi</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2 border rounded-md bg-[#F9F9F9] focus:outline-none focus:ring-2 focus:ring-[#48A6A7] text-[#5C7C7D]"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#006A71] text-white py-2 rounded-md hover:bg-[#04868d] transition font-semibold shadow-sm"
          >
            Masuk
          </button>
        </form>
        <p className="text-sm text-center mt-6 text-[#004f53]">
          Belum punya akun?{" "}
          <Link href="/daftar" className="text-[#006A71] underline font-medium">
            Daftar di sini
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
