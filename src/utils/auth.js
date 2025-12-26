// utils/auth.js
import { jwtDecode } from "jwt-decode"; // Sửa: thêm {} vì named export

export function getUserRole() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    console.log("Decoded token:", decoded); // Debug: xem token có gì
    return decoded.role; // 'admin' hoặc 'teacher'
  } catch (error) {
    console.error("JWT decode error:", error);
    return null;
  }
}

export function setToken(token) {
  localStorage.setItem("token", token);
}

export function removeToken() {
  localStorage.removeItem("token");
}
