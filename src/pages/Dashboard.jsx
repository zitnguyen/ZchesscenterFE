import { getUserFromToken } from "../utils/auth";
import AdminPanel from "../components/AdminPanel";
import TeacherPanel from "../components/TeacherPanel";

const Dashboard = () => {
  const user = getUserFromToken();

  if (!user) {
    return <h2>Bạn chưa đăng nhập</h2>;
  }

  return (
    <div>
      <h1>Dashboard</h1>

      {user.role === "admin" && <AdminPanel />}
      {user.role === "teacher" && <TeacherPanel />}
    </div>
  );
};

export default Dashboard;
