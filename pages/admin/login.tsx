"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login gagal");
        return;
      }

      // Simpan data admin di localStorage (tidak pakai token karena memang gak ada token)
      localStorage.setItem("adminData", JSON.stringify(data));

      // Redirect ke dashboard admin
      router.push("/admin");
    } catch {
      setError("Terjadi kesalahan jaringan.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F2EFE7] px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-[#cde3e5]"
      >
        <h1 className="text-3xl font-semibold text-center text-[#006A71] mb-6">
          Admin Login
        </h1>

        {error && (
          <p className="mb-4 text-red-600 text-center font-semibold">{error}</p>
        )}

        <label className="block text-[#006A71] font-medium mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@example.com"
          className="w-full px-4 py-2 mb-4 border rounded-md bg-[#F9F9F9] focus:outline-none focus:ring-2 focus:ring-[#48A6A7] text-[#5C7C7D]"
          required
        />

        <label className="block text-[#006A71] font-medium mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password admin"
          className="w-full px-4 py-2 mb-6 border rounded-md bg-[#F9F9F9] focus:outline-none focus:ring-2 focus:ring-[#48A6A7] text-[#5C7C7D]"
          required
        />

        <button
          type="submit"
          className="w-full bg-[#006A71] text-white py-2 rounded-md hover:bg-[#48A6A7] transition font-semibold shadow-sm"
        >
          Login
        </button>
      </form>
    </main>
  );
}
