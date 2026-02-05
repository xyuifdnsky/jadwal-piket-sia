const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// ambil jumlah orang per tim dari parameter
const jumlahPerTim = parseInt(process.argv[2]) || 3;

// fungsi shuffle (acak)
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

async function generateJadwal() {
  const snapshot = await db.collection("anggota").get();
  const anggota = snapshot.docs.map(doc => doc.id);

  const acak = shuffle(anggota);

  let kelompok = [];
  for (let i = 0; i < acak.length; i += jumlahPerTim) {
    kelompok.push(acak.slice(i, i + jumlahPerTim));
  }

  // hapus jadwal lama dulu
  const lama = await db.collection("jadwal_piket").get();
  for (const doc of lama.docs) {
    await doc.ref.delete();
  }

  // simpan ke firestore
  for (let i = 0; i < kelompok.length; i++) {
    await db.collection("jadwal_piket").doc(`minggu_${i + 1}`).set({
      minggu: i + 1,
      anggota: kelompok[i],
      status: "belum",
      jumlah_orang: jumlahPerTim
    });

    console.log(`Minggu ${i + 1}:`, kelompok[i]);
  }

  console.log(`Jadwal berhasil dibuat! (${jumlahPerTim} orang per tim)`);
}

generateJadwal();
