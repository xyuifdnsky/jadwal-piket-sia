import Link from "next/link";

export default function Navbar() {
  return (
    <nav style={{
      background: "#0f172a",
      padding: "15px 30px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: "white"
    }}>
      <h2>📋 SI 2A</h2>

      <div style={{ display: "flex", gap: 20 }}>
        <Link href="/" style={linkStyle}>Daftar Mahasiswa</Link>
        <Link href="/lihat_jadwal" style={linkStyle}>Jadwal Piket</Link>
        <Link href="/admin/GenerateJadwal" style={linkStyle}>Generate Jadwal</Link>
      </div>
    </nav>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontWeight: "bold"
};
