<!DOCTYPE html>
<html>
<head>
  <title>Lihat Jadwal Piket</title>
</head>
<body>
<h2>Jadwal Piket</h2>

<div id="jadwal"></div>

<script type="module">
  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
  import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

  const firebaseConfig = {
    apiKey: "API_KEY_KAMU",
    authDomain: "PROJECT.firebaseapp.com",
    projectId: "PROJECT_ID_KAMU",
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const querySnapshot = await getDocs(collection(db, "jadwal_piket"));

  let html = "";
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    html += `<h3>Minggu ${data.minggu}</h3>`;
    html += `<ul>`;
    data.anggota.forEach(nama => {
      html += `<li>${nama}</li>`;
    });
    html += `</ul><hr>`;
  });

  document.getElementById("jadwal").innerHTML = html;
</script>

</body>
</html>

