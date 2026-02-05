import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useRouter } from "next/router";

export default function Login() {

const router = useRouter();

const [email,setEmail]=useState("");
const [password,setPassword]=useState("");

const login = async ()=>{

try{

await signInWithEmailAndPassword(auth,email,password);

router.push("/generate_jadwal");

}catch(err){

alert(err.message);

}

}

return(

<div style={wrap}>

<div style={card}>

<h2>🔐 Admin Login</h2>

<input
placeholder="Email"
value={email}
onChange={e=>setEmail(e.target.value)}
style={input}
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={e=>setPassword(e.target.value)}
style={input}
/>

<button onClick={login} style={btn}>
Login
</button>

</div>
</div>

)
}

const wrap={
minHeight:"100vh",
display:"flex",
justifyContent:"center",
alignItems:"center",
background:"#0f172a"
}

const card={
background:"white",
padding:30,
borderRadius:12,
width:300
}

const input={
width:"100%",
padding:10,
marginBottom:15
}

const btn={
width:"100%",
padding:10,
background:"#2563eb",
color:"white",
border:"none",
borderRadius:6
}
