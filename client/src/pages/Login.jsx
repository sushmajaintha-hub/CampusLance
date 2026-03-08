
import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

function Login(){

const [email,setEmail]=useState("");
const [password,setPassword]=useState("");

const navigate = useNavigate();

const handleLogin = async(e)=>{

e.preventDefault();

try{

const res = await API.post("/auth/login",{email,password});

localStorage.setItem("token",res.data.token);

alert("Login successful");

navigate("/student-dashboard");

}catch(error){

alert("Invalid credentials");

}

}

return(

<div className="login-page">

<div className="login-card">

<h2>CampusLance</h2>

<p className="subtitle">Find projects. Work with clients.</p>

<form onSubmit={handleLogin}>

<input
type="email"
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
required
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
required
/>

<button type="submit">
Login
</button>

</form>

</div>

</div>

)

}

export default Login;