import { useEffect, useState } from "react";
import { useRouter } from "next/router";
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
import { onAuthStateChanged } from "firebase/auth";

export default function GenerateJadwal() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [jumlah, setJumlah] = useState(3);
  const [selectedDates, setSelectedDates] = useState([]);

  // 🔐 ADMIN ONLY
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) return router.push("/login");

      if (user.email !== "ranggaagungfadilah@gmail.com") {
        alert("Akses ditolak");
        router.push("/");
        return;
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) return <p>Loading...</p>;

  const formatDate = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;

  // ➕ TOGGLE DATE (MAX 10)
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

  const removeDate = (d) =>
    setSelectedDates((prev) => prev.filter((x) => x !== d));

  const clearAll = () => setSelectedDates([]);

  // 🚀 GENERATE
  const generate = async () => {
    if (!selectedDates.length) return alert("Pilih tanggal!");

    const old = await getDocs(collection(db, "jadwal_piket"));
    for (const d of old.docs)
      await deleteDoc(doc(db, "jadwal_piket", d.id));

    const snap = await getDocs(collection(db, "anggota"));
    let anggota = snap.docs.map((d) => d.data().nama);
    anggota = anggota.sort(() => Math.random() - 0.5);

    const tanggal = [...selectedDates].sort();

    let index = 0;

    for (let tgl of tanggal) {
      let grup = [];

      for (let i = 0; i < jumlah; i++) {
        if (anggota[index]) grup.push(anggota[index++]);
      }

      if (!grup.length) break;

      await setDoc(doc(db, "jadwal_piket", tgl), {
        tanggal: tgl,
        kelompok: grup,
        status: "belum",
      });
    }

    alert("Jadwal berhasil dibuat");
  };

  return (
    <div style={wrap}>
      <div style={card}>
        <h2>Generate Jadwal</h2>

        <label>Jumlah per kelompok</label>
        <input
          type="number"
          value={jumlah}
          onChange={(e) => setJumlah(+e.target.value)}
          style={input}
        />

        <Calendar
          onClickDay={toggleDate}
          tileClassName={({ date }) =>
            selectedDates.includes(formatDate(date)) ? "active" : ""
          }
        />

        <p>{selectedDates.length}/10 hari dipilih</p>

        {selectedDates.map((d) => (
          <div key={d} style={dateRow}>
            {d}
            <button onClick={() => removeDate(d)}>✖</button>
          </div>
        ))}

        <button onClick={clearAll}>Hapus Semua</button>

        <button style={btn} onClick={generate}>
          Generate
        </button>
      </div>

      <style jsx global>{`
        .active {
          background: #2563eb !important;
          color: white !important;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}

/* STYLE */

const wrap = {
  minHeight: "100vh",
  background: "#0f172a",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 20,
};

const card = {
  background: "white",
  padding: 20,
  borderRadius: 14,
  width: "100%",
  maxWidth: 400,
};

const input = {
  width: "100%",
  padding: 8,
  marginBottom: 10,
};

const dateRow = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: 6,
};

const btn = {
  width: "100%",
  padding: 10,
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: 8,
  marginTop: 10,
};
