import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { db } from "../lib/firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { wrap } from "framer-motion";


export default function LihatJadwal() {
  const router = useRouter();
  const [jadwal, setJadwal] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "jadwal_piket"), (snap) => {
      const data = snap.docs
        .map((d) => d.data())
        .sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));

      setJadwal(data);
    });

    return () => unsub();
  }, []);

  const hariIni = new Date().toISOString().split("T")[0];
  const isToday = (tgl) => tgl === hariIni;

  const simpanKeterangan = async (tgl, isi) => {
    await updateDoc(doc(db, "jadwal_piket", tgl), {
      keterangan: isi,
      status: "selesai",
    });
  };

  return (
   <div style={wrapStyle}>

      {/* ===== NAVBAR ===== */}
      <div style={navbar}>
        <button style={backBtn} onClick={() => router.push("/")}>
          ⬅ Kembali ke Menu Utama
        </button>
      </div>

      <div style={card}>
        <h1 style={title}>📅 Jadwal Piket Kelompok</h1>

        {/* 🔥 TABLE RESPONSIVE */}
        <div style={{ overflowX: "auto" }}>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Tanggal</th>
                <th style={th}>Putaran</th>
                <th style={th}>Anggota</th>
                <th style={th}>Keterangan</th>
              </tr>
            </thead>

            <tbody>
              {jadwal.map((j, i) => (
                <tr key={i} style={tr}>
                  <td style={td}>{formatTanggal(j.tanggal)}</td>
                  <td style={td}>Putaran {j.putaran}</td>

                  <td style={td}>
                    {Array.isArray(j.kelompok) ? (
                      j.kelompok.map((nama, idx) => (
                        <div key={idx}>• {nama}</div>
                      ))
                    ) : (
                      <span style={{ color: "#94a3b8" }}>—</span>
                    )}
                  </td>

                  <td style={td}>
                    {isToday(j.tanggal) ? (
                      <textarea
                        defaultValue={j.keterangan || ""}
                        placeholder="Tulis keterangan piket hari ini..."
                        style={textarea}
                        onBlur={(e) =>
                          simpanKeterangan(j.tanggal, e.target.value)
                        }
                      />
                    ) : (
                      <div style={readonlyBox}>
                        {j.keterangan || "Belum ada keterangan"}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ===== Helper ===== */
const formatTanggal = (tgl) =>
  new Date(tgl).toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

/* ===== STYLE (RESPONSIVE) ===== */

const wrapStyle = {

  minHeight: "100vh",
  padding: "16px",
  background: "linear-gradient(135deg,#0f172a,#1e293b)",
  fontFamily: "Segoe UI, sans-serif",
};

const navbar = {
  maxWidth: 1100,
  margin: "0 auto 16px",
};

const backBtn = {
  background: "#1e293b",
  color: "white",
  border: "none",
  padding: "10px 16px",
  borderRadius: 8,
  cursor: "pointer",
  fontSize: 14,
};

const card = {
  background: "white",
  borderRadius: 16,
  padding: "16px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
  maxWidth: 1100,
  margin: "auto",
};

const title = {
  marginBottom: 20,
  textAlign: "center",
  fontSize: "clamp(20px, 4vw, 32px)",
};

const table = {
  width: "100%",
  minWidth: 700, // 🔥 penting agar HP bisa scroll
  borderCollapse: "collapse",
};

const th = {
  borderBottom: "2px solid #e2e8f0",
  padding: 10,
  background: "#f1f5f9",
  fontSize: 14,
};

const tr = {
  borderBottom: "1px solid #e2e8f0",
};

const td = {
  padding: 10,
  verticalAlign: "top",
  fontSize: 13,
};

const textarea = {
  width: "100%",
  minHeight: 60,
  padding: 8,
  borderRadius: 6,
  border: "1px solid #cbd5e1",
  fontFamily: "inherit",
  fontSize: 13,
};

const readonlyBox = {
  background: "#f1f5f9",
  padding: 8,
  borderRadius: 6,
  color: "#475569",
  fontSize: 13,
};
