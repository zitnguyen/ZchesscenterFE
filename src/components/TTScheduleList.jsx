import { useState, useEffect } from "react";
import api from "../api/axios";
import "../index.css";

export default function TTScheduleList() {
  const [schedules, setSchedules] = useState([]);

  const fetchSchedules = async () => {
    try {
      const res = await api.get("/schedules"); // Backend trả tất cả ca dạy
      setSchedules(res.data);
    } catch (err) {
      console.error(err);
      alert("Không thể lấy danh sách ca dạy");
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return (
    <div className="teacher-list-container">
      <h3>Danh sách ca dạy</h3>
      <table className="teacher-table">
        <thead>
          <tr>
            <th>Giáo viên</th>
            <th>Học viên</th>
            <th>Ngày</th>
            <th>Giờ</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((s) => (
            <tr key={s._id}>
              <td>{s.teacherName}</td>
              <td>{s.studentName}</td>
              <td>{s.date}</td>
              <td>{s.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
