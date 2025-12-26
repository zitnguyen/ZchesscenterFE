import { useState } from "react";
import { getUserRole } from "./utils/auth";
import AdminDashboard from "./pages/AdminDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import Login from "./pages/Login";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const role = getUserRole();

  if (!isLoggedIn) return <Login setUser={setIsLoggedIn} />;

  if (role === "admin") return <AdminDashboard setUser={setIsLoggedIn} />;
  if (role === "teacher") return <TeacherDashboard setUser={setIsLoggedIn} />;

  return <div>Không có quyền truy cập</div>;
}

export default App;
