import { useState } from "react";
import api from "../api/axios";
import "../index.css";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setUser(true);
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi đăng nhập");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Đăng nhập</h2>
        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="login-btn">
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}
