import { useEffect, useState } from "react";
import { useRouter } from "next/router";
// Pindahkan import CSS ke sini tetap oke, tapi pastikan library-nya terpasang
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

import { db, auth } from "../../lib/firebase";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";

export default function GenerateJadwal() {
  const router = useRouter();

  const [isClient, setIsClient] = useState(false); // Tambahkan ini
  const [loading, setLoading] = useState(true);
  const [jumlah, setJumlah] = useState(3);
  const [selectedDates, setSelectedDates] = useState([]);

  // Cek jika sudah di client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;


    return () => unsub();
  }, [isClient, router]);

  // Cegah render jika belum di client atau masih loading
  if (!isClient || loading) {
    return (
      <div style={wrap}>
        <p style={{ color: "white" }}>Loading system...</p>
      </div>
    );
  }

  const formatDate = (d) => {
    if (!d) return "";
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const toggleDate = (date) => {
    const ymd = formatDate(date);
    setSelectedDates((prev) => {
      if (prev.includes(ymd)) return prev.filter((d) => d !== ymd);
      if (prev.length >= 10) {
        alert("Maksimal 10 hari!");
        return prev;
      }
      return [...prev, ymd];
    });
  };

  const generate = async () => {
    if (!selectedDates.length) return alert("Pilih tanggal!");
    
    try {
      setLoading(true);
      // Hapus jadwal lama
      const old = await getDocs(collection(db, "jadwal_piket"));
      const deletePromises = old.docs.map((d) => deleteDoc(doc(db, "jadwal_piket", d.id)));
      await Promise.all(deletePromises);

      // Ambil anggota
      const snap = await getDocs(collection(db, "anggota"));
      let anggota = snap.docs.map((d) => d.data().nama);
      anggota = anggota.sort(() => Math.random() - 0.5);

      const tanggalUrut = [...selectedDates].sort();
      let index = 0;

      for (let tgl of tanggalUrut) {
        let grup = [];
        for (let i = 0; i < jumlah; i++) {
          if (anggota[index]) grup.push(anggota[index++]);
        }
        if (grup.length > 0) {
          await setDoc(doc(db, "jadwal_piket", tgl), {
            tanggal: tgl,
            kelompok: grup,
            status: "belum",
          });
        }
      }
      alert("Jadwal berhasil dibuat");
    } catch (error) {
      console.error(error);
      alert("Gagal generate: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={wrap}>
      <div style={card}>
        <h2 style={{ color: "#333", marginBottom: 20 }}>Generate Jadwal</h2>

        <label style={{ display: "block", marginBottom: 5, fontSize: 14 }}>Jumlah per kelompok</label>
        <input
          type="number"
          value={jumlah}
          onChange={(e) => setJumlah(Number(e.target.value))}
          style={input}
        />

        <div className="calendar-container">
          <Calendar
            onClickDay={toggleDate}
            tileClassName={({ date }) =>
              selectedDates.includes(formatDate(date)) ? "active" : ""
            }
          />
        </div>

        <p style={{ margin: "15px 0", fontWeight: "bold" }}>
          {selectedDates.length}/10 hari dipilih
        </p>

        <div style={{ maxHeight: 150, overflowY: "auto", marginBottom: 15 }}>
          {selectedDates.sort().map((d) => (
            <div key={d} style={dateRow}>
              <span>{d}</span>
              <button 
                onClick={() => setSelectedDates(prev => prev.filter(x => x !== d))}
                style={{ background: "none", border: "none", color: "red", cursor: "pointer" }}
              >
                ✖
              </button>
            </div>
          ))}
        </div>

        <button 
          onClick={() => setSelectedDates([])}
          style={{ width: "100%", marginBottom: 10, cursor: "pointer" }}
        >
          Hapus Semua
        </button>

        <button style={btn} onClick={generate} disabled={loading}>
          {loading ? "Processing..." : "Generate Sekarang"}
        </button>
      </div>

      <style jsx global>{`
        .active {
          background: #2563eb !important;
          color: white !important;
          border-radius: 5px;
        }
        .calendar-container {
          margin-bottom: 15px;
        }
        .react-calendar {
          width: 100% !important;
          border-radius: 8px;
          border: 1px solid #ddd !important;
        }
      `}</style>
    </div>
  );
}

// ... style const tetap sama ...
const wrap = { minHeight: "100vh", background: "#0f172a", display: "flex", justifyContent: "center", alignItems: "center", padding: 20 };
const card = { background: "white", padding: 25, borderRadius: 14, width: "100%", maxWidth: 450 };
const input = { width: "100%", padding: "10px", marginBottom: 15, borderRadius: 8, border: "1px solid #ccc" };
const dateRow = { display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #eee" };
const btn = { width: "100%", padding: 12, background: "#2563eb", color: "white", border: "none", borderRadius: 8, fontWeight: "bold", cursor: "pointer" };