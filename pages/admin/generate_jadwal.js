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
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function GenerateJadwal() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [jumlah, setJumlah] = useState(3);
  const [selectedDates, setSelectedDates] = useState([]);

  // ================== 🔐 PROTEKSI ADMIN ==================
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
  if (!user) {
    router.push("/login");
    return;
  }

  if (user.email !== "ranggaagungfadilah@gmail.com") {
    alert("Akses ditolak");
    router.push("/");
    return;
  }


      setIsAdmin(true);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!isAdmin) return null;

  // ================== 📅 LOGIC KALENDER ==================
  const formatDate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const toggleDate = (date) => {
    const ymd = formatDate(date);
    setSelectedDates((prev) =>
      prev.includes(ymd) ? prev.filter((d) => d !== ymd) : [...prev, ymd]
    );
  };

  const removeDate = (ymd) => {
    setSelectedDates((prev) => prev.filter((d) => d !== ymd));
  };

  const clearAllDates = () => {
    setSelectedDates([]);
  };

  // ================== 🚀 GENERATE JADWAL ==================
  const generate = async () => {
    if (selectedDates.length === 0) {
      alert("Pilih tanggal masuk dulu!");
      return;
    }

    // 🔥 HAPUS JADWAL LAMA
    const old = await getDocs(collection(db, "jadwal_piket"));
    for (const d of old.docs) {
      await deleteDoc(doc(db, "jadwal_piket", d.id));
    }

    // ambil anggota
    const snap = await getDocs(collection(db, "anggota"));
    let anggota = snap.docs.map((d) => d.data().nama);
    anggota = anggota.sort(() => Math.random() - 0.5);

    const tanggalUrut = [...selectedDates].sort();

    let index = 0;
    let putaran = 1;

    for (let tgl of tanggalUrut) {
      let grup = [];

      for (let i = 0; i < jumlah; i++) {
        if (anggota[index]) {
          grup.push(anggota[index]);
          index++;
        }
      }

      if (grup.length === 0) break;

      await setDoc(doc(db, "jadwal_piket", tgl), {
        tanggal: tgl,
        kelompok: grup,
        putaran,
        status: "belum",
      });
    }

    alert("Jadwal berhasil dibuat ✅");
  };

  // ================== 🎨 UI ==================
  return (
    <div style={wrap}>
      <div style={card}>
        <h1>🗓️ Generate Jadwal</h1>

        <label>Jumlah orang per kelompok</label>
        <input
          type="number"
          value={jumlah}
          onChange={(e) => setJumlah(Number(e.target.value))}
          style={input}
        />

        <Calendar
          onClickDay={toggleDate}
          tileClassName={({ date }) =>
            selectedDates.includes(formatDate(date)) ? "masuk" : null
          }
        />

        {selectedDates.length > 0 && (
          <div style={listBox}>
            <b>Tanggal dipilih:</b>
            {selectedDates.sort().map((d) => (
              <div key={d} style={dateItem}>
                {d}
                <button onClick={() => removeDate(d)}>✖</button>
              </div>
            ))}
            <button onClick={clearAllDates}>Hapus Semua</button>
          </div>
        )}

        <button onClick={generate} style={btn}>
          🚀 Generate Jadwal
        </button>
      </div>

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
