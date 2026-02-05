import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      console.log("LOGIN OK:", res.user.uid);
      alert("LOGIN BERHASIL");
    } catch (err) {
      console.error("LOGIN ERROR FULL:", err);
      alert(err.code + " | " + err.message);
    }
  };

  return (
    <div>
      <input onChange={e => setEmail(e.target.value)} />
      <input type="password" onChange={e => setPassword(e.target.value)} />
      <button onClick={login}>LOGIN</button>
    </div>
  );
}

