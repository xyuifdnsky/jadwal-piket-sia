const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");
const data = require("./anggota.json");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function importData() {
  for (const item of data) {
    await db.collection("anggota").doc(item.nama).set(item);
    console.log("Added:", item.nama);
  }
  console.log("Selesai!");
}

importData();
