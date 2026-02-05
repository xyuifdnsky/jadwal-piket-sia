import { useState } from "react";
import { useRouter } from "next/router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin/generate_jadwal");
    } catch {
      alert("Login gagal");
    }
  };

  return (
  <div style={wrapStyle}>

      <div style={card}>
        <h2>LOGIN ADMIN</h2>

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          style={input}
        />

        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          style={input}
        />

        <button onClick={login} style={btn}>LOGIN</button>
      </div>
    </div>
  );
}

const wrap = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "#020617",
};

const card = {
  background: "white",
  borderRadius: 16,
  padding: "16px",
  boxShadow: "0 20px 40px rgba(0,0,0,0.25)",
  maxWidth: 1100,
  margin: "auto",
};


const input = {
  width: "100%",
  marginBottom: 10,
  padding: 10,
};

const btn = {
  width: "100%",
  padding: 10,
};
 