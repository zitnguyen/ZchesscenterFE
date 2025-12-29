import { useState, useEffect } from "react";
import api from "../api/axios";

export default function TTeacherList() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await api.get("/teacher");
      setTeachers(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Không thể lấy danh sách giáo viên");
      setLoading(false);
    }
  };

  if (loading)
    return <p style={{ textAlign: "center" }}>Đang tải dữ liệu...</p>;
  if (error)
    return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

  return (
    <div className="teacher-list-container">
      <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
        Danh sách giáo viên
      </h2>
      <table className="teacher-table">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((t) => (
            <tr key={t._id}>
              <td>{t.name}</td>
              <td>{t.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
