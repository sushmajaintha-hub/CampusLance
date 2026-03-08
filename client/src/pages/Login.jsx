
import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const res = await API.post("/auth/login", {
        email,
        password
      });

      // Save token
      localStorage.setItem("token", res.data.token);

      // Save user data
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login successful");

      // Get user role
      const role = res.data.user?.role;

      // Redirect based on role
      if (role === "student") {
        navigate("/student-dashboard");
      } 
      else if (role === "client") {
        navigate("/client-dashboard");
      } 
      else if (role === "admin") {
        navigate("/admin-dashboard");
      } 
      else {
        navigate("/");
      }

    } catch (error) {

      console.error("Login error:", error);

      if (error.response) {
        alert(error.response.data.message || "Invalid credentials");
      } else {
        alert("Server error. Please try again.");
      }

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="login-page">

      <div className="login-card">

        <h2>CampusLance</h2>

        <p className="subtitle">Find projects. Work with clients.</p>

        <form onSubmit={handleLogin}>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

        </form>

      </div>

    </div>

  );

}

export default Login;