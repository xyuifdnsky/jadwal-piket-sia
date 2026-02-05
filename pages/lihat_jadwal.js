import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { db } from "../lib/firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";

console.log("PROJECT:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);

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
    <div style={wrap}>

      {/* ===== NAVBAR ===== */}
      <div style={navbar}>
        <button style={backBtn} onClick={() => router.push("/")}>
          ⬅ Kembali ke Menu Utama
        </button>
      </div>

      <div style={card}>
        <h1 style={title}>📅 Jadwal Piket Kelompok</h1>

        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Tanggal</th>
              <th style={th}>Putaran</th>
              <th style={th}>Anggota Piket</th>
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
                    <div style={{ color: "#94a3b8" }}>—</div>
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

/* ===== STYLE ===== */

const wrap = {
  minHeight: "100vh",
  background: "linear-gradient(135deg,#0f172a,#1e293b)",
  padding: 40,
  fontFamily: "Segoe UI, sans-serif",
};

const navbar = {
  maxWidth: 1000,
  margin: "0 auto 20px",
};

const backBtn = {
  background: "#1e293b",
  color: "white",
  border: "none",
  padding: "10px 18px",
  borderRadius: 8,
  cursor: "pointer",
  fontSize: 14,
};

const card = {
  background: "white",
  borderRadius: 16,
  padding: 30,
  boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
  maxWidth: 1000,
  margin: "auto",
};

const title = {
  marginBottom: 25,
  textAlign: "center",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = {
  borderBottom: "2px solid #e2e8f0",
  padding: 12,
  textAlign: "left",
  background: "#f1f5f9",
};

const tr = {
  borderBottom: "1px solid #e2e8f0",
};

const td = {
  padding: 12,
  verticalAlign: "top",
};

const textarea = {
  width: "100%",
  minHeight: 60,
  padding: 8,
  borderRadius: 6,
  border: "1px solid #cbd5e1",
  fontFamily: "inherit",
};

const readonlyBox = {
  background: "#f1f5f9",
  padding: 10,
  borderRadius: 6,
  color: "#475569",
  fontSize: 14,
};
