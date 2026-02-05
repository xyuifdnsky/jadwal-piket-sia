import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";

const handleLogin = async () => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    router.push("/");
  } catch (err) {
    console.error("LOGIN ERROR:", err.code, err.message);
    alert(err.code);
  }
};
