"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

// Import Navbar dan Footer
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Post {
  id: number;
  image: string;
  caption: string;
  likes: number;
  comments: string[];
  uploader: string;
}

export default function GaleriPage() {
  const router = useRouter();

  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      image: "/galeri/tanam1.jpg",
      caption: "Aksi tanam pohon di lingkungan sekolah 🌱",
      likes: 2,
      comments: [],
      uploader: "Tidak diketahui",
    },
    {
      id: 2,
      image: "/galeri/tanam2.jpeg",
      caption: "Menjaga bumi dimulai dari kita 🌍",
      likes: 5,
      comments: [],
      uploader: "Tidak diketahui",
    },
    {
      id: 3,
      image: "/galeri/tanam3.jpg",
      caption: "Kerja bakti bersama warga menanam pohon!",
      likes: 1,
      comments: [],
      uploader: "Tidak diketahui",
    },
  ]);

  const [newComments, setNewComments] = useState<Record<number, string>>({});
  const [expandedPosts, setExpandedPosts] = useState<Set<number>>(new Set());
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [caption, setCaption] = useState("");

  const handleLike = (id: number) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const handleCommentChange = (id: number, value: string) => {
    setNewComments({ ...newComments, [id]: value });
  };

  const handleAddComment = (id: number) => {
    const comment = newComments[id]?.trim();
    if (!comment) return;

    const newCommentWithName = `👤 Pengunjung: ${comment}`;

    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? { ...post, comments: [...post.comments, newCommentWithName] }
          : post
      )
    );

    setNewComments({ ...newComments, [id]: "" });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  const handleUploadPost = () => {
    if (!selectedImage || !caption.trim()) return;

    const newPost: Post = {
      id: Date.now(),
      image: previewURL || "",
      caption: caption,
      likes: 0,
      comments: [],
      uploader: "Tidak diketahui",
    };

    setPosts([newPost, ...posts]);
    setShowModal(false);
    setSelectedImage(null);
    setPreviewURL(null);
    setCaption("");
  };

  const toggleExpanded = (postId: number) => {
    setExpandedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const MAX_VISIBLE_COMMENTS = 5;

  return (
    <>
      <div className="bg-[#F2EFE7] min-h-screen flex flex-col pt-20">
      <Navbar />
      {/* Modal Upload */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <h2 className="text-xl font-semibold text-[#006A71] mb-4">
              Upload Postingan Baru
            </h2>
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

      {/* Halaman Galeri */}
      <div
        className={`bg-[#F2EFE7] min-h-screen py-10 px-6 ${
          showModal ? "overflow-hidden blur-sm pointer-events-none select-none" : ""
        }`}
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-[#006A71]">📸 Galeri Hijau</h1>
          </div>

          <p className="text-gray-700 mb-8">
            Lihat aksi penghijauan dari komunitas dan berikan apresiasi dengan
            like dan komentar!
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
            {posts.map((post) => {
              const showAll = expandedPosts.has(post.id);
              const visibleComments = showAll
                ? post.comments
                : post.comments.slice(0, MAX_VISIBLE_COMMENTS);

              return (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between h-[500px]"
                >
                  <div>
                    <img
                      src={post.image}
                      alt={`Postingan ${post.id}`}
                      className="rounded-lg w-full h-48 object-cover mb-4"
                    />
                    <p className="mb-1 text-gray-800">{post.caption}</p>
                    <p className="text-xs text-gray-500 mb-2 italic">
                      Diunggah oleh: {post.uploader}
                    </p>

                    <div className="flex justify-between items-center mb-2">
                      <button
                        onClick={() => handleLike(post.id)}
                        className="text-[#006A71] font-medium hover:underline"
                      >
                        ❤️ {post.likes} Suka
                      </button>
                    </div>

                    <div className="text-sm text-gray-700 mb-1 font-semibold">
                      Komentar:
                    </div>

                    <div className="mb-2 space-y-2 text-sm text-gray-600 overflow-y-auto max-h-[100px] border rounded p-2 bg-gray-50">
                      {visibleComments.length > 0 ? (
                        visibleComments.map((comment, idx) => (
                          <div key={idx} className="border-b pb-1">
                            {comment}
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 italic">Belum ada komentar</p>
                      )}

                      {post.comments.length > MAX_VISIBLE_COMMENTS && (
                        <button
                          onClick={() => toggleExpanded(post.id)}
                          className="text-xs text-[#006A71] mt-2 underline"
                        >
                          {showAll ? "Sembunyikan" : "Lihat selengkapnya"}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={newComments[post.id] || ""}
                      onChange={(e) =>
                        handleCommentChange(post.id, e.target.value)
                      }
                      placeholder="Tulis komentar..."
                      className="flex-1 border border-gray-300 rounded px-3 py-1 text-sm text-[#5C7C7D]"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      className="bg-[#48A6A7] text-white px-3 rounded hover:bg-[#006A71] transition"
                    >
                      Kirim
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
      </div>
      {/* Footer */}
      <Footer />
    </>
  );
}
