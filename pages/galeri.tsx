"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Comment {
  _id: string;
  username: string;
  content: string;
  createdAt: string;
}

interface Post {
  _id: string;
  uploaderName: string;
  imageUrl: string;
  caption: string;
  likes: string[]; // array userId yang like
  comments: Comment[];
}

export default function GaleriPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComments, setNewComments] = useState<Record<string, string>>({});
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (!storedUserData) {
      router.push("/login");
      return;
    }
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const userData = localStorage.getItem("userData");
    const token = userData ? JSON.parse(userData).token : null;
    if (!token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gallery`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Gagal memuat galeri");
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      alert("Gagal memuat galeri");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    const userData = localStorage.getItem("userData");
    const token = userData ? JSON.parse(userData).token : null;
    if (!token) {
      alert("Silakan login terlebih dahulu");
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gallery/${postId}/like`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Gagal mengubah like");
      const updatedPost = await res.json();
      setPosts((prev) => prev.map((p) => (p._id === postId ? updatedPost : p)));
    } catch {
      alert("Gagal mengubah like");
    }
  };

  const handleCommentChange = (postId: string, value: string) => {
    setNewComments({ ...newComments, [postId]: value });
  };

  const handleAddComment = async (postId: string) => {
    const comment = newComments[postId]?.trim();
    if (!comment) return;

    const userData = localStorage.getItem("userData");
    const token = userData ? JSON.parse(userData).token : null;
    if (!token) {
      alert("Silakan login terlebih dahulu");
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gallery/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: comment }),
      });
      if (!res.ok) throw new Error("Gagal mengirim komentar");
      const updatedPost = await res.json();
      setPosts((prev) => prev.map((p) => (p._id === postId ? updatedPost : p)));
      setNewComments({ ...newComments, [postId]: "" });
    } catch {
      alert("Gagal mengirim komentar");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedImage(file);
    setPreviewURL(URL.createObjectURL(file));
  };

  const handleUploadPost = async () => {
    if (!selectedImage || !caption.trim()) {
      alert("Gambar dan caption wajib diisi");
      return;
    }

    const userData = localStorage.getItem("userData");
    const token = userData ? JSON.parse(userData).token : null;
    if (!token) {
      alert("Silakan login terlebih dahulu");
      router.push("/login");
      return;
    }

    // Convert image to base64 (optional, or upload to cloud storage)
    const toBase64 = (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });

    let base64Image = "";
    try {
      base64Image = await toBase64(selectedImage);
    } catch {
      alert("Gagal membaca file gambar");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/gallery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          caption,
          imageUrl: base64Image,
        }),
      });
      if (!res.ok) throw new Error("Gagal upload postingan");

      const newPost = await res.json();
      setPosts((prev) => [newPost, ...prev]);
      setShowModal(false);
      setSelectedImage(null);
      setPreviewURL(null);
      setCaption("");
    } catch {
      alert("Gagal upload postingan");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-[#006A71]">
        Memuat galeri...
      </div>
    );

  return (
    <>
      <div className="bg-[#F2EFE7] min-h-screen flex flex-col pt-20">
      <Navbar />
      {/* Modal Upload */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm"
          // Tambahkan ini supaya modal bisa scroll jika konten panjang
          style={{ WebkitBackdropFilter: "blur(6px)", backdropFilter: "blur(6px)" }}
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative z-10">
            <h2 className="text-xl font-semibold text-[#006A71] mb-4">Upload Postingan Baru</h2>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mb-3"
            />
            {previewURL && (
              <img
                src={previewURL}
                alt="Preview"
                className="w-full h-48 object-cover rounded mb-3"
              />
            )}
            <input
              type="text"
              placeholder="Tulis caption..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full border px-3 py-2 rounded mb-4 text-[#5C7C7D]"
            />
            <div className="flex justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
              >
                ← Kembali
              </button>
              <button
                onClick={handleUploadPost}
                className="bg-[#48A6A7] text-white px-4 py-2 rounded hover:bg-[#006A71]"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Galeri List */}
      <main className="bg-[#F2EFE7] min-h-screen py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-[#006A71] mb-8">📸 Galeri Hijau</h1>
          <p className="text-gray-700 mb-8">
            Lihat aksi penghijauan dari komunitas dan berikan apresiasi dengan like dan komentar!
          </p>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#006A71] text-white px-4 py-2 rounded hover:bg-[#004D52] transition"
            >
              + Tambah Postingan
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between h-[500px]"
              >
                <div>
                  <img
                    src={post.imageUrl}
                    alt={`Postingan oleh ${post.uploaderName}`}
                    className="rounded-lg w-full h-48 object-cover mb-4"
                  />
                  <p className="mb-1 text-gray-800">{post.caption}</p>
                  <p className="text-xs text-gray-500 mb-2 italic">
                    Diunggah oleh: {post.uploaderName}
                  </p>

                  <div className="flex justify-between items-center mb-2">
                    <button
                      onClick={() => handleLike(post._id)}
                      className="text-[#006A71] font-medium hover:underline"
                    >
                      ❤️ {post.likes.length} Suka
                    </button>
                  </div>

                  <div className="text-sm text-gray-700 mb-1 font-semibold">Komentar:</div>
                  <div className="mb-2 space-y-2 text-sm text-gray-600 overflow-y-auto max-h-[100px] border rounded p-2 bg-gray-50">
                    {post.comments.length > 0 ? (
                      post.comments.map((comment) => (
                        <div key={comment._id} className="border-b pb-1">
                          <strong>{comment.username}</strong>: {comment.content}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 italic">Belum ada komentar</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={newComments[post._id] || ""}
                    onChange={(e) => handleCommentChange(post._id, e.target.value)}
                    placeholder="Tulis komentar..."
                    className="flex-1 border border-gray-300 rounded px-3 py-1 text-sm text-[#5C7C7D]"
                  />
                  <button
                    onClick={() => handleAddComment(post._id)}
                    className="bg-[#48A6A7] text-white px-3 rounded hover:bg-[#006A71] transition"
                  >
                    Kirim
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
      </div>
      <Footer />
    </>
  );
}
