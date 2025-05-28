'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";

interface Edukasi {
    _id: string;
    title: string;
    type: "artikel" | "video";
    content?: string;
    videoUrl?: string;
}

export default function KelolaEdukasi() {
    const router = useRouter();
    const [edukasiList, setEdukasiList] = useState<Edukasi[]>([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const [title, setTitle] = useState("");
    const [type, setType] = useState<"artikel" | "video">("artikel");
    const [content, setContent] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [editId, setEditId] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Ambil token admin
    const [token, setToken] = useState<string | null>(null);
    useEffect(() => {
        const adminData = localStorage.getItem("adminData");
        if (!adminData) {
            router.push("/admin/login");
            return;
        }
        const parsed = JSON.parse(adminData);
        setToken(parsed.token);
    }, [router]);

    // Fetch daftar edukasi
    const fetchEdukasi = async () => {
    setLoading(true);
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/edukasi`); // tanpa headers Authorization
        console.log("Response status:", res.status);
        if (!res.ok) {
        const errorData = await res.json();
        console.error("Error response:", errorData);
        throw new Error(errorData.message || "Gagal memuat daftar edukasi");
        }
        const data = await res.json();
        console.log("Data received:", data);
        setEdukasiList(data);
    } catch (err: any) {
        console.error("Fetch error:", err);
        setError(err.message || "Terjadi kesalahan");
    } finally {
        setLoading(false);
    }
    };


    useEffect(() => {
    fetchEdukasi();
    }, []);

    // Reset form input
    const resetForm = () => {
        setTitle("");
        setType("artikel");
        setContent("");
        setVideoUrl("");
        setEditId(null);
        setError("");
    };

    // Validasi URL video Youtube
    const isValidYouTubeUrl = (url: string) => {
        try {
            const parsedUrl = new URL(url);
            return (
                (parsedUrl.hostname === "www.youtube.com" || parsedUrl.hostname === "youtube.com") &&
                parsedUrl.pathname === "/watch" &&
                parsedUrl.searchParams.has("v")
            );
        } catch {
            return false;
        }
    };

    // Submit tambah/edit edukasi
    const handleSubmit = async () => {
        if (title.trim() === "") {
            setError("Judul wajib diisi");
            return;
        }

        if (type === "artikel") {
            if (content.trim() === "") {
                setError("Isi artikel wajib diisi");
                return;
            }
        } else {
            if (videoUrl.trim() === "") {
                setError("Link video wajib diisi");
                return;
            }
            if (!isValidYouTubeUrl(videoUrl)) {
                setError("Masukkan link YouTube yang valid, misal https://www.youtube.com/watch?v=ID_VIDEO");
                return;
            }
        }

        setError("");

        const payload: Partial<Edukasi> = {
            title,
            type,
            content: type === "artikel" ? content : undefined,
            videoUrl: type === "video" ? videoUrl : undefined,
        };

        try {
            let res;
            if (editId) {
                res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/edukasi/${editId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                });
            } else {
                res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/edukasi`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(payload),
                });
            }

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Gagal menyimpan edukasi");
            }

            resetForm();
            await fetchEdukasi();

            alert(editId ? "Edukasi berhasil diperbarui" : "Edukasi berhasil ditambahkan");
        } catch (err: any) {
            setError(err.message || "Terjadi kesalahan saat menyimpan");
        }
    };

    // Edit button
    const handleEdit = (edukasi: Edukasi) => {
        setEditId(edukasi._id);
        setTitle(edukasi.title);
        setType(edukasi.type);
        setContent(edukasi.content || "");
        setVideoUrl(edukasi.videoUrl || "");
        setError("");
    };

    // Hapus edukasi
    const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus edukasi ini?")) return;
    if (!token) return;

    try {
        setDeletingId(id);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/edukasi/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        });

        const resData = await res.json();
        console.log("Delete response:", res.status, resData);

        if (!res.ok) throw new Error(resData.message || "Gagal menghapus edukasi");

        alert("Edukasi berhasil dihapus");
        await fetchEdukasi();
    } catch (err: any) {
        alert(err.message || "Terjadi kesalahan saat menghapus");
    } finally {
        setDeletingId(null);
    }
    };


    return (
        <div className="flex min-h-screen bg-[#F2EFE7]">
            <AdminSidebar />

            <div className="flex-grow p-8 ml-64 max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-[#006A71] mb-6">Kelola Edukasi</h1>

                <section className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <h2 className="text-2xl font-semibold text-[#006A71] mb-4">
                        {editId ? "Edit Edukasi" : "Tambah Edukasi Baru"}
                    </h2>

                    {error && <p className="text-red-600 mb-4">{error}</p>}

                    <input
                        type="text"
                        placeholder="Judul Edukasi"
                        className="w-full p-2 border border-gray-300 rounded mb-4"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <div className="mb-4">
                        <label className="mr-4 font-semibold text-[#006A71]">Tipe Edukasi:</label>
                        <label className="mr-4">
                            <input
                                type="radio"
                                value="artikel"
                                checked={type === "artikel"}
                                onChange={() => setType("artikel")}
                                className="mr-1"
                            />
                            Artikel
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="video"
                                checked={type === "video"}
                                onChange={() => setType("video")}
                                className="mr-1"
                            />
                            Video
                        </label>
                    </div>

                    {type === "artikel" && (
                        <textarea
                            placeholder="Isi artikel (HTML diperbolehkan)"
                            className="w-full p-2 border border-gray-300 rounded mb-4 min-h-[100px]"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                    )}

                    {type === "video" && (
                        <input
                            type="text"
                            placeholder="Link Video YouTube (contoh: https://www.youtube.com/watch?v=ID_VIDEO)"
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                        />
                    )}

                    <div className="flex gap-4">
                        <button
                            onClick={handleSubmit}
                            className="bg-[#006A71] text-white px-6 py-2 rounded hover:bg-[#004B50] transition"
                        >
                            {editId ? "Simpan Perubahan" : "Tambah Edukasi"}
                        </button>
                        {editId && (
                            <button
                                onClick={resetForm}
                                className="border border-gray-400 px-6 py-2 rounded hover:bg-gray-100 transition"
                            >
                                Batal
                            </button>
                        )}
                    </div>
                </section>

                <section className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-semibold text-[#006A71] mb-4">Daftar Edukasi</h2>

                    {loading ? (
                        <p className="text-[#006A71]">Memuat edukasi...</p>
                    ) : edukasiList.length === 0 ? (
                        <p className="text-gray-600">Belum ada edukasi tersedia.</p>
                    ) : (
                        <ul className="space-y-4">
                            {edukasiList.map((edukasi) => (
                                <li
                                    key={edukasi._id}
                                    className="border border-gray-300 rounded p-4 flex justify-between items-center"
                                >
                                    <div>
                                        <h3 className="font-semibold text-[#006A71]">{edukasi.title}</h3>
                                        {edukasi.type === "video" && edukasi.videoUrl && (
                                            <a
                                                href={edukasi.videoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline text-sm"
                                            >
                                                Lihat Video
                                            </a>
                                        )}
                                        {edukasi.type === "artikel" && edukasi.content && (
                                            <p className="text-sm text-gray-700 mt-2 line-clamp-3" dangerouslySetInnerHTML={{ __html: edukasi.content }} />
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(edukasi)}
                                            className="bg-yellow-400 text-white px-4 py-1 rounded hover:bg-yellow-500 transition"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(edukasi._id)}
                                            className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition"
                                            disabled={deletingId === edukasi._id}
                                        >
                                            {deletingId === edukasi._id ? "Menghapus..." : "Hapus"}
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </div>
    );
}
