"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";

type Submission = {
  _id: string;
  userId: {
    _id: string;
    name?: string;
    email?: string;
  } | string;
  challengeId: {
    _id: string;
    judul?: string;
  } | string;
  photoUrl: string;
  verified: boolean;
  verifiedAt?: string;
};

type Challenge = {
  _id: string;
  judul: string;
};

export default function AdminVerifikasi() {
  const router = useRouter();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(true);
  const [loadingChallenges, setLoadingChallenges] = useState(true);
  const [errorSubs, setErrorSubs] = useState("");
  const [errorChallenges, setErrorChallenges] = useState("");
  const [filterChallengeId, setFilterChallengeId] = useState<string>("");

  // Proteksi login
  useEffect(() => {
    const storedAdmin = localStorage.getItem("adminData");
    if (!storedAdmin) {
      router.push("/admin/login");
    }
  }, [router]);

  const fetchChallenges = async () => {
    setLoadingChallenges(true);
    setErrorChallenges("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/challenges`);
      if (!res.ok) throw new Error("Gagal memuat tantangan");
      const data = await res.json();
      setChallenges(data);
    } catch (err: any) {
      setErrorChallenges(err.message || "Error loading challenges");
    } finally {
      setLoadingChallenges(false);
    }
  };

  const fetchSubmissions = async () => {
    setLoadingSubs(true);
    setErrorSubs("");
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}:5000/api/submissions`);
      if (!res.ok) throw new Error("Gagal memuat submissions");
      const data = await res.json();
      setSubmissions(data);
    } catch (err: any) {
      setErrorSubs(err.message || "Error loading submissions");
    } finally {
      setLoadingSubs(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
    fetchSubmissions();
  }, []);

  // Filter submissions hanya yang challengeId valid
  // Dan jika filterChallengeId aktif, filter juga berdasarkan itu
  const filteredSubs = (() => {
    if (loadingSubs || loadingChallenges) return [];
  
    const validChallengeIds = new Set(challenges.map((ch) => ch._id));
  
    // Pastikan challengeId bukan null dan bertipe objek
    let filtered = submissions.filter((sub) =>
      typeof sub.challengeId === "object" && sub.challengeId !== null
        ? validChallengeIds.has(sub.challengeId._id)
        : false
    );
  
    if (filterChallengeId) {
      filtered = filtered.filter((sub) =>
        typeof sub.challengeId === "object" && sub.challengeId !== null
          ? sub.challengeId._id === filterChallengeId
          : false
      );
    }
  
    return filtered;
  })();  

  const handleVerify = async (id: string) => {
    if (!confirm("Verifikasi submission ini?")) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/submissions/verify/${id}`, {
        method: "PUT",
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Gagal verifikasi");
      }
      alert("Submission berhasil diverifikasi");
      setSubmissions((subs) =>
        subs.map((s) =>
          s._id === id
            ? { ...s, verified: true, verifiedAt: new Date().toISOString() }
            : s
        )
      );
    } catch (err: any) {
      alert(err.message || "Gagal verifikasi");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F2EFE7]">
      <AdminSidebar />

      <main className="flex-grow p-8 max-w-7xl mx-auto ml-64">
        <h1 className="text-3xl font-bold text-[#006A71] mb-8">Verifikasi Submission</h1>

        {/* Filter Dropdown */}
        <div className="mb-8 max-w-xs">
          <label
            htmlFor="filter"
            className="block mb-2 font-semibold text-[#006A71] text-lg"
          >
            Filter berdasarkan tantangan
          </label>
          {loadingChallenges ? (
            <p className="text-gray-600">Memuat tantangan...</p>
          ) : errorChallenges ? (
            <p className="text-red-600">{errorChallenges}</p>
          ) : (
            <select
              id="filter"
              value={filterChallengeId}
              onChange={(e) => setFilterChallengeId(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#006A71] text-[#006A71] text-base"
            >
              <option value="">-- Semua Tantangan --</option>
              {challenges.map((ch) => (
                <option key={ch._id} value={ch._id}>
                  {ch.judul}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Loading / Error / List Submissions */}
        {loadingSubs ? (
          <p className="text-[#006A71] text-lg">Memuat submissions...</p>
        ) : errorSubs ? (
          <p className="text-red-600 text-lg">{errorSubs}</p>
        ) : filteredSubs.length === 0 ? (
          <p className="text-gray-600 text-lg">Tidak ada submission sesuai filter.</p>
        ) : (
          <ul className="space-y-6 max-h-[60vh] overflow-auto">
            {filteredSubs.map((sub) => (
              <li
                key={sub._id}
                className="border rounded-lg p-6 shadow flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8 bg-white"
              >
                <img
                  src={sub.photoUrl}
                  alt="Bukti Foto"
                  className="w-36 h-36 rounded object-cover border border-gray-300"
                />
                <div className="flex-1 w-full text-[#004f53]">
                  <p className="mb-1 text-lg">
                    <strong>User:</strong>{" "}
                    {typeof sub.userId === "string"
                      ? sub.userId
                      : sub.userId.name || sub.userId.email || sub.userId._id}
                  </p>
                  <p className="mb-1 text-lg">
                    <strong>Tantangan:</strong>{" "}
                    {typeof sub.challengeId === "string"
                      ? sub.challengeId
                      : sub.challengeId.judul || sub.challengeId._id}
                  </p>
                  <p className="mb-1 text-lg">
                    <strong>Status:</strong>{" "}
                    {sub.verified ? (
                      <span className="text-green-700 font-semibold">Terverifikasi</span>
                    ) : (
                      <span className="text-red-600 font-semibold">Belum diverifikasi</span>
                    )}
                  </p>
                  {sub.verifiedAt && (
                    <p className="text-sm text-gray-500">
                      Diverifikasi pada: {new Date(sub.verifiedAt).toLocaleString()}
                    </p>
                  )}
                </div>
                {!sub.verified && (
                  <button
                    onClick={() => handleVerify(sub._id)}
                    className="px-5 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
                  >
                    Verifikasi
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
