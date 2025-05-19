"use client";

import { useEffect, useState, ChangeEvent, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { FiCamera } from "react-icons/fi";

const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const ProfilePage = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Inisialisasi profile dan form
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
    profilePhoto: "",
  });
  const [form, setForm] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Ambil userData dari localStorage (berisi token dan user info)
  const userDataRaw = typeof window !== "undefined" ? localStorage.getItem("userData") : null;
  const userData = userDataRaw ? JSON.parse(userDataRaw) : null;
  const token = userData?.token || null;

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          localStorage.removeItem("userData");
          router.push("/login");
          return;
        }

        if (!res.ok) throw new Error("Gagal mengambil data profil");

        const data = await res.json();
        setProfile(data);
        setForm(data);
      } catch {
        alert("Gagal mengambil data profil. Silakan login ulang.");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64 = await toBase64(file);
      setForm((prev) => ({ ...prev, profilePhoto: base64 }));
    } catch {
      alert("Gagal membaca file gambar");
    }
  };

  const handleSave = async () => {
    if (!token) {
      alert("Token tidak ditemukan. Silakan login ulang.");
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          bio: form.bio,
          profilePhotoBase64: form.profilePhoto,
        }),
      });

      if (!res.ok) throw new Error("Gagal memperbarui profil");

      const updatedProfile = await res.json();
      setProfile(updatedProfile);
      setForm(updatedProfile);
      setIsEditing(false);
      alert("Profil berhasil diperbarui");
    } catch {
      alert("Gagal memperbarui profil");
    }
  };

  const handleCancel = () => {
    setForm(profile);
    setIsEditing(false);
  };

  // Logout dengan konfirmasi browser biasa
  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin keluar?")) {
      localStorage.removeItem("userData");
      router.push("/login");
    }
  };

  if (loading)
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F2EFE7]">
        <p className="text-[#006A71] text-xl">Memuat profil...</p>
      </main>
    );

  return (
    <>
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen bg-[#F2EFE7] pt-28 px-6"
      >
        <motion.section
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-8"
        >
          <div className="flex items-center space-x-6">
            <div
              className="relative w-24 h-24 rounded-full overflow-hidden cursor-pointer border border-[#006A71]"
              onClick={() => isEditing && fileInputRef.current?.click()}
              title={isEditing ? "Klik untuk ganti foto profil" : undefined}
            >
              {form.profilePhoto ? (
                <img
                  src={form.profilePhoto}
                  alt="Foto Profil"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src="/profil/avatar.jpg"
                  alt="User Avatar"
                  fill
                  className="object-cover"
                />
              )}
              {isEditing && (
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center rounded-full">
                  <FiCamera className="h-7 w-7 text-white" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                disabled={!isEditing}
              />
            </div>

            <div className="flex-1">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="text-2xl font-semibold text-[#006A71] w-full border-b focus:outline-none"
                disabled={!isEditing}
              />
              <input
                type="email"
                name="email"
                value={form.email}
                readOnly
                disabled
                className="text-[#006A71] w-full mt-1 border-b bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="mt-8 border-t pt-6">
            <h3 className="text-xl font-semibold text-[#006A71] mb-4">Tentang Saya</h3>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={4}
              className="w-full p-2 border rounded-md focus:outline-none text-[#006A71]"
              disabled={!isEditing}
            />
          </div>

          {isEditing ? (
            <div className="flex gap-4 mt-6 justify-end">
              <button
                onClick={handleCancel}
                className="px-4 py-2 rounded-xl border border-[#006A71] text-[#006A71] hover:bg-[#e6f0f0] transition"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-[#006A71] text-white hover:bg-[#00565b] transition"
              >
                Simpan
              </button>
            </div>
          ) : (
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsEditing(true)}
                className="px-6 py-2 bg-[#9ACBD0] text-[#006A71] rounded-xl hover:bg-[#8ac2c6] transition"
              >
                Edit Profil
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-[#9ACBD0] text-[#006A71] rounded-xl hover:bg-[#8ac2c6] transition"
              >
                Logout
              </button>
            </div>
          )}
        </motion.section>
      </motion.main>
      <Footer />
    </>
  );
};

export default ProfilePage;
