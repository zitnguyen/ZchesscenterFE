import { useState, useEffect } from "react";
import api from "../api/axios";
import "../index.css";

export default function TTStudentList() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      // Gọi API chỉ để xem danh sách học viên, teacher không được sửa/xóa
      const res = await api.get("/student/"); // nhớ tạo route /student/all cho teacher
      setStudents(res.data);
    } catch (err) {
      console.error(err);
      alert("Không thể lấy danh sách học viên");
    }
  };

  return (
    <div className="student-list-container">
      <h3>Danh sách học viên</h3>
      <table className="teacher-table">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Tuổi</th>
            <th>Level</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s._id}>
              <td>{s.name}</td>
              <td>{s.age}</td>
              <td>{s.level}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
