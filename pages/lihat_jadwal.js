import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { db } from "../lib/firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";

export default function LihatJadwal() {
  const router = useRouter();
  const [jadwal, setJadwal] = useState([]);
  const [hariIni, setHariIni] = useState(""); // 1. Simpan di state

  useEffect(() => {
    // 2. Set tanggal hari ini hanya di client side
    const date = new Date();
    const offset = date.getTimezoneOffset();
    const localizedDate = new Date(date.getTime() - (offset * 60 * 1000));
    setHariIni(localizedDate.toISOString().split("T")[0]);

    const unsub = onSnapshot(collection(db, "jadwal_piket"), (snap) => {
      const data = snap.docs
        .map((d) => d.data())
        .sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));

      setJadwal(data);
    });

    return () => unsub();
  }, []);

  const simpanKeterangan = async (tgl, isi) => {
    try {
      await updateDoc(doc(db, "jadwal_piket", tgl), {
        keterangan: isi,
        status: "selesai",
      });
    } catch (err) {
      console.error("Gagal update:", err);
    }
  };

  return (
    <div style={wrap}>
      <div style={navbar}>
        <button style={backBtn} onClick={() => router.push("/")}>
          ⬅ Kembali
        </button>
      </div>

      <div style={card}>
        <h1 style={title}>📅 Jadwal Piket</h1>

        <div style={{ overflowX: "auto" }}>
          <table style={table}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={th}>Tanggal</th>
                <th style={th}>Anggota</th>
                <th style={th}>Keterangan</th>
              </tr>
            </thead>

            <tbody>
              {jadwal.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center", padding: 20 }}>
                    Belum ada jadwal yang di-generate.
                  </td>
                </tr>
              ) : (
                jadwal.map((j, i) => (
                  <tr key={i} style={j.tanggal === hariIni ? rowAktif : {}}>
                    <td style={td}>
                      {j.tanggal}
                      {j.tanggal === hariIni && (
                        <span style={badge}>Hari Ini</span>
                      )}
                    </td>

                    <td style={td}>
                      {j.kelompok?.map((n, x) => (
                        <div key={x} style={{ fontSize: 14 }}>• {n}</div>
                      ))}
                    </td>

                    <td style={td}>
                      {j.tanggal === hariIni ? (
                        <textarea
                          placeholder="Isi keterangan piket..."
                          defaultValue={j.keterangan || ""}
                          style={textarea}
                          onBlur={(e) =>
                            simpanKeterangan(j.tanggal, e.target.value)
                          }
                        />
                      ) : (
                        <span style={{ color: j.keterangan ? "#000" : "#94a3b8" }}>
                          {j.keterangan || "Tidak ada catatan"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* STYLE TAMBAHAN */
const rowAktif = {
  background: "#eff6ff",
};

const badge = {
  display: "block",
  fontSize: 10,
  background: "#2563eb",
  color: "white",
  padding: "2px 6px",
  borderRadius: 4,
  width: "fit-content",
  marginTop: 4,
};

/* STYLE LAMA KAMU (DIPERTAHANKAN) */
const wrap = { minHeight: "100vh", padding: 20, background: "#020617" };
const navbar = { maxWidth: 1100, margin: "0 auto 20px auto" };
const backBtn = { padding: "8px 16px", cursor: "pointer", borderRadius: 8, border: "none", background: "#1e293b", color: "white" };
const card = { background: "white", borderRadius: 16, padding: "16px", boxShadow: "0 20px 40px rgba(0,0,0,0.25)", maxWidth: 1100, margin: "auto" };
const title = { textAlign: "center", marginBottom: 20, color: "#1e293b" };
const table = { width: "100%", minWidth: 600, borderCollapse: "collapse" };
const th = { borderBottom: "2px solid #e2e8f0", padding: 12, textAlign: "left", color: "#64748b" };
const td = { padding: 12, borderBottom: "1px solid #f1f5f9", verticalAlign: "top" };
const textarea = { width: "100%", minHeight: 60, padding: 8, borderRadius: 6, border: "1px solid #cbd5e1", fontFamily: "inherit" };