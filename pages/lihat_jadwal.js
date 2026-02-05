import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { db } from "../lib/firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";

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

  const simpanKeterangan = async (tgl, isi) => {
    await updateDoc(doc(db, "jadwal_piket", tgl), {
      keterangan: isi,
      status: "selesai",
    });
  };

  return (
<div style={wrapStyle}>

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
              <tr>
                <th style={th}>Tanggal</th>
                <th style={th}>Anggota</th>
                <th style={th}>Keterangan</th>
              </tr>
            </thead>

            <tbody>
              {jadwal.map((j, i) => (
                <tr key={i}>
                  <td style={td}>{j.tanggal}</td>

                  <td style={td}>
                    {j.kelompok?.map((n, x) => (
                      <div key={x}>• {n}</div>
                    ))}
                  </td>

                  <td style={td}>
                    {j.tanggal === hariIni ? (
                      <textarea
                        defaultValue={j.keterangan || ""}
                        style={textarea}
                        onBlur={(e) =>
                          simpanKeterangan(j.tanggal, e.target.value)
                        }
                      />
                    ) : (
                      j.keterangan || "-"
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

/* STYLE */

const wrap = {
  minHeight: "100vh",
  padding: 20,
  background: "#020617",
};

const navbar = {
  maxWidth: 1100,
  margin: "auto",
};

const backBtn = {
  padding: 10,
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
  textAlign: "center",
};

const table = {
  width: "100%",
  minWidth: 600,
};

const th = {
  borderBottom: "1px solid #ccc",
};

const td = {
  padding: 8,
};

const textarea = {
  width: "100%",
  minHeight: 50,
};
