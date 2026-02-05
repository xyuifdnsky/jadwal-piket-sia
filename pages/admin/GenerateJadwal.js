import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { db } from "../../lib/firebase";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { deleteDoc } from "firebase/firestore";

const old = await getDocs(collection(db, "jadwal_piket"));
for (const d of old.docs) {
  await deleteDoc(doc(db, "jadwal_piket", d.id));
}


export default function GenerateJadwal() {
  const [jumlah, setJumlah] = useState(3);
  const [selectedDates, setSelectedDates] = useState([]);
const formatDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};


  // klik tanggal => toggle masuk/libur
  const toggleDate = (date) => {
  const ymd = formatDate(date);

  setSelectedDates((prev) =>
    prev.includes(ymd)
      ? prev.filter((d) => d !== ymd) // batal
      : [...prev, ymd] // pilih
  );
};

const removeDate = (ymd) => {
  setSelectedDates((prev) => prev.filter((d) => d !== ymd));
};

const clearAllDates = () => {
  setSelectedDates([]);
};


  const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

 const generate = async () => {
  if (selectedDates.length === 0) {
    alert("Pilih tanggal masuk dulu!");
    return;
  }

  // ambil anggota dari firebase urut
  const snap = await getDocs(collection(db, "anggota"));
  let anggota = snap.docs
    .map((d) => d.data().nama);

  // acak sekali untuk 1 putaran
  anggota = anggota.sort(() => Math.random() - 0.5);

  const tanggalUrut = selectedDates.sort();

  let index = 0;
  let putaran = 1;

// HAPUS SEMUA JADWAL LAMA DULU
const old = await getDocs(collection(db, "jadwal_piket"));
for (const d of old.docs) {
  await setDoc(doc(db, "jadwal_piket", d.id), {}, { merge: false });
}

  for (let tgl of tanggalUrut) {
    let grup = [];

    for (let i = 0; i < jumlah; i++) {
      if (anggota[index]) {
        grup.push(anggota[index]);
        index++;
      }
    }

    // kalau sudah habis = stop (1 putaran)
    if (grup.length === 0) break;

    await setDoc(doc(db, "jadwal_piket", tgl), {
      tanggal: tgl,
      kelompok: grup,
      putaran: putaran,
      status: "belum"
    });
  }

  alert("Jadwal 1 putaran berhasil dibuat ✅");
};

  return (
    <div style={wrap}>
      <div style={card}>
        <h1 style={{ marginBottom: 20 }}>🗓️ Generate Jadwal dari Kalender</h1>

        <label>Jumlah orang per kelompok</label>
        <input
          type="number"
          value={jumlah}
          onChange={(e) => setJumlah(parseInt(e.target.value))}
          style={input}
        />

        <p style={{ marginTop: 20, fontWeight: "bold" }}>
          Klik tanggal yang MASUK (berwarna biru)
        </p>

  <Calendar
  onClickDay={toggleDate}
  tileClassName={({ date, view }) => {
    if (view === "month") {
      const ymd = formatDate(date);
      return selectedDates.includes(ymd) ? "masuk" : null;
    }
  }}
/>



{selectedDates.length > 0 && (
  <div style={listBox}>
    <div style={listHeader}>
      <b>Tanggal Masuk Dipilih:</b>
      <button onClick={clearAllDates} style={clearBtn}>
        Hapus Semua
      </button>
    </div>

    <div style={dateList}>
      {selectedDates.sort().map((d) => (
        <div key={d} style={dateItem}>
          {d}
          <button onClick={() => removeDate(d)} style={removeBtn}>
            ✖
          </button>
        </div>
      ))}
    </div>
  </div>
)}

        <button onClick={generate} style={btn}>
          🚀 Generate Jadwal
        </button>
      </div>

      {/* STYLE khusus kalender */}
      <style jsx global>{`
        .masuk {
          background: #2563eb !important;
          color: white !important;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}

/* ===== STYLE ===== */
const wrap = {
  minHeight: "100vh",
  background: "linear-gradient(135deg,#0f172a,#1e293b)",
  padding: 40,
  fontFamily: "Segoe UI, sans-serif",
};

const card = {
  background: "white",
  borderRadius: 16,
  padding: 30,
  maxWidth: 700,
  margin: "auto",
  boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
};

const input = {
  padding: 10,
  width: "100%",
  marginTop: 10,
  marginBottom: 20,
};

const btn = {
  marginTop: 30,
  padding: 12,
  width: "100%",
  background: "#111827",
  color: "white",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: "bold",
};


const listBox = {
  marginTop: 25,
  background: "#f1f5f9",
  padding: 15,
  borderRadius: 10,
};

const listHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 10,
};

const dateList = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
};

const dateItem = {
  background: "#2563eb",
  color: "white",
  padding: "6px 10px",
  borderRadius: 6,
  display: "flex",
  alignItems: "center",
  gap: 8,
  fontSize: 13,
};

const removeBtn = {
  background: "white",
  color: "#2563eb",
  border: "none",
  borderRadius: 4,
  cursor: "pointer",
  fontWeight: "bold",
};

const clearBtn = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "5px 10px",
  borderRadius: 6,
  cursor: "pointer",
};
