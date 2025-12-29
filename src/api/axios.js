import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000/api",
});

// tự động gắn token nếu có
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// interceptor để tự logout khi token không hợp lệ
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 ||
        error.response.data.message === "Tài khoản đã bị xóa")
    ) {
      // Xóa token
      localStorage.removeItem("token");
      // Redirect về trang login
      window.location.href = "/login";
      alert("Bạn đã bị đăng xuất do tài khoản không còn hợp lệ");
    }
    return Promise.reject(error);
  }
);

export default instance;
