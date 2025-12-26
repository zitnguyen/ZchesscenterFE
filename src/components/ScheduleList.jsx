import { useEffect, useState } from "react";
import api from "../api/axios";
import * as jwtDecode from "jwt-decode";

export default function ScheduleList() {
  const [schedules, setSchedules] = useState([]);

  const fetchSchedules = async () => {
    try {
      const token = localStorage.getItem("token");
      const user = jwtDecode(token);

      const res = await api.get("/schedules", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // lọc chỉ ca dạy của teacher
      const mySchedules = res.data.filter((s) => s.teacherId === user.id);
      setSchedules(mySchedules);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return (
    <div>
      <h3>Ca dạy của bạn</h3>
      <ul>
        {schedules.map((s) => (
          <li key={s._id}>
            Học viên: {s.studentId} — Ngày: {s.date} — Giờ: {s.time}
          </li>
        ))}
      </ul>
    </div>
  );
}
