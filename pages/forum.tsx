"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type UserRef = {
  _id: string;
  name: string;
};

type Reply = {
  isi: string;
  author: string | UserRef;
  waktu: string;
};

type Post = {
  _id: string;
  judul: string;
  isi: string;
  author: string | UserRef;
  waktu: string;
  replies: Reply[];
};

export default function Forum() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [input, setInput] = useState<string>("");
  const [replyInputs, setReplyInputs] = useState<{ [key: string]: string }>({});
  const [showReply, setShowReply] = useState<{ [key: string]: boolean }>({});
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  // Ambil userData dari localStorage sekaligus ambil token dan userName dari sana
  const [token, setToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userDataRaw = localStorage.getItem("userData");
      if (userDataRaw) {
        const userData = JSON.parse(userDataRaw);
        setToken(userData.token || null);
        setUserName(userData.name || null);
      }
    }
  }, []);

  const isLoggedIn = !!token && !!userName;

  const fetchPosts = async (pageNum: number, searchTerm: string) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}api/forum?page=${pageNum}&limit=10&search=${encodeURIComponent(searchTerm)}`
      );
      const data = await res.json();
      setPosts(data.posts);
      setTotalPosts(data.total);
      setPage(data.page);
    } catch (error) {
      alert("Gagal memuat data forum.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page, search);
  }, [page, search]);

  const handleAddPost = async () => {
    if (!isLoggedIn) {
      alert("Silakan login terlebih dahulu untuk berdiskusi.");
      return;
    }
    if (input.trim() === "") return;

    try {
      const res = await fetch("${process.env.NEXT_PUBLIC_API_URL}/api/forum", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          judul: input.length > 50 ? input.slice(0, 50) : input,
          isi: input,
        }),
      });

      if (!res.ok) throw new Error("Gagal mengirim postingan");

      const newPost = await res.json();
      setPosts((prevPosts) => [newPost, ...prevPosts]);
      setInput("");
      setPage(1);
    } catch {
      alert("Gagal mengirim postingan.");
    }
  };

  const toggleReply = (postId: string) => {
    setShowReply((prev) => ({ ...prev, [postId]: !prev[postId] }));
  };

  const handleReplyChange = (postId: string, value: string) => {
    setReplyInputs({ ...replyInputs, [postId]: value });
  };

  const handleReplySubmit = async (postId: string) => {
    if (!isLoggedIn) {
      alert("Silakan login terlebih dahulu untuk membalas.");
      return;
    }

    const replyText = replyInputs[postId];
    if (!replyText || replyText.trim() === "") return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forum/${postId}/replies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          isi: replyText,
        }),
      });

      if (!res.ok) throw new Error("Gagal mengirim balasan");

      const updatedPost = await res.json();
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post._id === postId ? updatedPost : post))
      );
      setReplyInputs({ ...replyInputs, [postId]: "" });
      setShowReply({ ...showReply, [postId]: false });
    } catch {
      alert("Gagal mengirim balasan.");
    }
  };

  const totalPages = Math.ceil(totalPosts / 10);

  return (
    <div className="bg-[#F2EFE7] min-h-screen flex flex-col pt-20">
      <Navbar />

      <main className="flex-grow py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-[#006A71] text-center mb-8"
          >
            Forum Diskusi & Sharing Pengalaman 🗣️
          </motion.h1>

          <div className="mb-8 text-center">
            <input
              type="text"
              placeholder="Cari diskusi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-md mx-auto p-2 rounded border border-[#9ACBD0] focus:outline-none focus:ring-2 focus:ring-[#48A6A7] text-[#5C7C7D]"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 rounded-xl shadow-xl mb-10"
          >
            <h2 className="text-2xl font-semibold text-[#006A71] mb-4">Bagikan Pengalaman Anda</h2>
            {!isLoggedIn ? (
              <p className="text-center text-red-600 mb-4">Silakan login terlebih dahulu untuk berdiskusi.</p>
            ) : (
              <>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="w-full h-32 p-4 border-2 border-[#9ACBD0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#48A6A7] mb-4 placeholder-[#5C7C7D] text-[#5C7C7D]"
                  placeholder="Tulis pengalaman atau pertanyaan Anda di sini..."
                />
                <button
                  onClick={handleAddPost}
                  className="bg-[#006A71] text-white px-6 py-2 rounded-lg hover:bg-[#48A6A7] transition-colors"
                >
                  Kirim Pengalaman
                </button>
              </>
            )}
          </motion.div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-[#006A71] mb-2">Diskusi Terbaru</h2>

            {loading ? (
              <p className="text-center text-[#006A71]">Memuat diskusi...</p>
            ) : posts.length === 0 ? (
              <p className="text-center text-gray-500">Belum ada diskusi ditemukan.</p>
            ) : (
              posts.map((post) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white p-6 rounded-lg shadow-md"
                >
                  <h3 className="text-xl font-bold text-[#006A71]">{post.judul}</h3>
                  <p className="text-gray-700 mt-2 whitespace-pre-wrap">{post.isi}</p>
                  <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                    <span>
                      Oleh: <strong>{typeof post.author === "string" ? post.author : post.author?.name ?? "Unknown"}</strong>
                    </span>
                    <span>•</span>
                    <span>{new Date(post.waktu).toLocaleString()}</span>
                  </div>

                  <button
                    onClick={() => toggleReply(post._id)}
                    className="text-[#006A71] mt-4 text-sm hover:underline"
                  >
                    {showReply[post._id] ? "Sembunyikan Balasan" : "Balas"}
                  </button>

                  {showReply[post._id] && (
                    <div className="mt-3">
                      {!isLoggedIn ? (
                        <p className="text-red-600 mb-2">Silakan login terlebih dahulu untuk membalas.</p>
                      ) : (
                        <>
                          <textarea
                            value={replyInputs[post._id] || ""}
                            onChange={(e) => handleReplyChange(post._id, e.target.value)}
                            placeholder="Tulis balasan Anda..."
                            className="w-full h-24 p-3 border-2 border-[#9ACBD0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#48A6A7] mb-4 placeholder-[#5C7C7D] text-[#5C7C7D]"
                          />
                          <button
                            onClick={() => handleReplySubmit(post._id)}
                            className="bg-[#48A6A7] text-white px-4 py-1 rounded text-sm hover:bg-[#35999C]"
                          >
                            Kirim
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  {post.replies.length > 0 && (
                    <div className="mt-4 space-y-2 border-t pt-3">
                      {post.replies.map((reply, i) => (
                        <div
                          key={i}
                          className="text-xs text-gray-500 mt-1"
                        >
                          Oleh: <strong>{typeof reply.author === "string" ? reply.author : reply.author?.name ?? "Unknown"}</strong> •{" "}
                          {new Date(reply.waktu).toLocaleString()}
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))
            )}

            {totalPosts > 10 && (
              <div className="flex justify-center mt-8 space-x-2">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`px-3 py-1 rounded ${
                      page === i + 1
                        ? "bg-[#006A71] text-white"
                        : "bg-white border border-[#006A71] text-[#006A71]"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
