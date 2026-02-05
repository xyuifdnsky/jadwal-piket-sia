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

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) return router.push("/login");

      if (user.email !== "ranggaagungfadilah@gmail.com") {
        alert("Akses ditolak");
        return router.push("/");
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) return null;

  const format = (d) => d.toISOString().split("T")[0];

  const toggle = (d) => {
    const t = format(d);
    setSelectedDates((p) =>
      p.includes(t) ? p.filter((x) => x !== t) : [...p, t]
    );
  };

  const generate = async () => {
    const old = await getDocs(collection(db, "jadwal_piket"));
    for (const d of old.docs) await deleteDoc(doc(db, "jadwal_piket", d.id));

    const snap = await getDocs(collection(db, "anggota"));
    let anggota = snap.docs.map((d) => d.data().nama);

    let i = 0;

    for (const t of selectedDates.sort()) {
      const grup = anggota.slice(i, i + jumlah);
      i += jumlah;

      await setDoc(doc(db, "jadwal_piket", t), {
        tanggal: t,
        kelompok: grup,
        putaran: 1,
      });
    }

    alert("Jadwal jadi");
  };

  return (
    <div style={wrap}>
      <div style={card}>
        <input
          type="number"
          value={jumlah}
          onChange={(e) => setJumlah(+e.target.value)}
        />

        <Calendar onClickDay={toggle} />

        <button onClick={generate}>Generate</button>
      </div>
    </div>
  );
}

const wrap = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const card = {
  background: "white",
  padding: 30,
};
