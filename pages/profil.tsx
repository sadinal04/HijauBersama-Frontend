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

interface Post {
  _id: string;
  caption: string;
  imageUrl: string;
  likes: string[];
  comments: any[];
}

const ProfilePage = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
    profilePhoto: "",
  });

  const [form, setForm] = useState(profile);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<{
    name?: string;
    email?: string;
    bio?: string;
    profilePhoto?: string;
    token?: string;
    id?: string;
  } | null>(null);

  // State untuk posts user
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

  // State untuk menandai postingan yang sedang dihapus
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

  // Ambil data user dari localStorage saat mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserData = localStorage.getItem("userData");
      if (storedUserData) {
        const parsed = JSON.parse(storedUserData);
        setUserData(parsed);
        setToken(parsed.token || null);
        setProfile({
          name: parsed.name || "",
          email: parsed.email || "",
          bio: parsed.bio || "",
          profilePhoto: parsed.profilePhoto || "",
        });
        setForm({
          name: parsed.name || "",
          email: parsed.email || "",
          bio: parsed.bio || "",
          profilePhoto: parsed.profilePhoto || "",
        });
      } else {
        router.push("/login");
      }
    }
  }, [router]);

  // Fetch profil user terbaru
  useEffect(() => {
    if (!token) {
      setLoading(false);
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

        localStorage.setItem(
          "userData",
          JSON.stringify({
            ...userData,
            name: data.name,
            email: data.email,
            bio: data.bio,
            profilePhoto: data.profilePhoto || "",
            token,
          })
        );
      } catch {
        alert("Gagal mengambil data profil. Silakan login ulang.");
        localStorage.removeItem("userData");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, router, userData]);

  // Fetch postingan user
  useEffect(() => {
    if (!token) {
      setPostsLoading(false);
      return;
    }

    const fetchUserPosts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/gallery/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          alert("Gagal mengambil postingan user");
          setPostsLoading(false);
          return;
        }

        const data = await res.json();
        console.log("Fetched user posts:", data);
        setPosts(data);
      } catch (error) {
        alert("Gagal mengambil postingan user");
      } finally {
        setPostsLoading(false);
      }
    };

    fetchUserPosts();
  }, [token]);

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

      localStorage.setItem(
        "userData",
        JSON.stringify({
          ...userData,
          name: updatedProfile.name,
          bio: updatedProfile.bio,
          profilePhoto: updatedProfile.profilePhoto || "",
          token,
        })
      );

      alert("Profil berhasil diperbarui");
    } catch {
      alert("Gagal memperbarui profil");
    }
  };

  const handleCancel = () => {
    setForm(profile);
    setIsEditing(false);
  };

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin keluar?")) {
      localStorage.removeItem("userData");
      localStorage.removeItem("token");
      router.push("/login");
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus postingan ini?")) return;

    if (!token) {
      alert("Silakan login terlebih dahulu");
      router.push("/login");
      return;
    }

    try {
      setDeletingPostId(postId);
      const res = await fetch(`http://localhost:5000/api/gallery/${postId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Gagal menghapus postingan");

      setPosts((prev) => prev.filter((post) => post._id !== postId));
      alert("Postingan berhasil dihapus");
    } catch {
      alert("Gagal menghapus postingan");
    } finally {
      setDeletingPostId(null);
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
                  src={
                    form.profilePhoto.startsWith("data:")
                      ? form.profilePhoto
                      : `data:image/jpeg;base64,${form.profilePhoto}`
                  }
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

          {/* Postingan Anda */}
          <div className="mt-10 border-t pt-6">
            <h3 className="text-xl font-semibold text-[#006A71] mb-4">Postingan Anda</h3>

            {postsLoading ? (
              <p>Memuat postingan...</p>
            ) : posts.length === 0 ? (
              <p>Anda belum memiliki postingan.</p>
            ) : (
              posts.map((post) => (
                <div
                  key={post._id}
                  className="bg-gray-50 p-4 rounded-lg mb-4 flex flex-col md:flex-row md:items-center md:justify-between"
                >
                  <img
                    src={post.imageUrl}
                    alt={post.caption}
                    className="w-full md:w-40 h-28 object-cover rounded-md mb-3 md:mb-0"
                  />
                  <div className="flex-1 md:ml-4">
                    <p className="mb-2 text-gray-800">{post.caption}</p>
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="text-red-600 hover:underline text-sm"
                      disabled={deletingPostId === post._id}
                    >
                      {deletingPostId === post._id ? "Menghapus..." : "Hapus Postingan"}
                    </button>
                  </div>
                </div>
              ))
            )}
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
