import { useEffect, useState } from "react";
import { db } from "../lib/firebase.js";
import { collection, onSnapshot } from "firebase/firestore";
import Navbar from "../components/Navbar";

export default function DaftarMahasiswa() {
  const [anggota, setAnggota] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "anggota"), (snap) => {
      const data = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }))
        .sort((a, b) => a.urutan - b.urutan);
      setAnggota(data);
    });

    return () => unsub();
  }, []);

  return (
    <div style={{ fontFamily: "sans-serif", background: "#f1f5f9", minHeight: "100vh" }}>
      <Navbar />

      {/* HEADER */}
      <nav
        style={{
          background: "#0f172a",
          color: "white",
          padding: "20px 30px",
          textAlign: "center",
        }}
      >
        <h1>🎓 Daftar Mahasiswa</h1>
        <div>Sistem Informasi 2A</div>
      </nav>

      {/* LIST */}
      <div
        style={{
          maxWidth: 800,
          margin: "40px auto",
          background: "white",
          borderRadius: 12,
          boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
          padding: 30,
        }}
      >
        {anggota.map((a, i) => (
          <div
            key={a.id}
            style={{
              padding: "12px 15px",
              borderBottom: "1px solid #e5e7eb",
              display: "flex",
              alignItems: "center",
              fontSize: 18,
            }}
          >
            <span
              style={{
                width: 40,
                fontWeight: "bold",
                color: "#64748b",
              }}
            >
              {i + 1}.
            </span>
            <span>{a.nama}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
