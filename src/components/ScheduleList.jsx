import { useState, useEffect } from "react";
import api from "../api/axios";
import "../index.css";

export default function AdScheduleList() {
  const [schedules, setSchedules] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    teacherId: "",
    studentId: "",
    date: "",
    time: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");

  useEffect(() => {
    fetchSchedules();
    fetchTeachers();
    fetchStudents();
  }, []);

  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 3000);
  };

  const fetchSchedules = async () => {
    try {
      const res = await api.get("/schedules");
      setSchedules(res.data);
    } catch (err) {
      console.error(err);
      showMessage("Lấy danh sách ca dạy thất bại", "error");
    }
  };

  const fetchTeachers = async () => {
    try {
      const res = await api.get("/teacher");
      setTeachers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await api.get("/student");
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/schedules/${editingId}`, form);
        showMessage("Cập nhật ca dạy thành công");
      } else {
        await api.post("/schedules", form);
        showMessage("Thêm ca dạy thành công");
      }
      setForm({ teacherId: "", studentId: "", date: "", time: "" });
      setEditingId(null);
      fetchSchedules();
    } catch (err) {
      console.error(err);
      showMessage(err.response?.data?.message || "Có lỗi xảy ra", "error");
    }
  };

  const handleEdit = (s) => {
    setEditingId(s._id);
    setForm({
      teacherId: s.teacherId || "",
      studentId: s.studentId || "",
      date: s.date,
      time: s.time,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa ca dạy này?")) return;
    try {
      await api.delete(`/schedules/${id}`);
      showMessage("Xóa ca dạy thành công");
      fetchSchedules();
    } catch (err) {
      console.error(err);
      showMessage(err.response?.data?.message || "Có lỗi xảy ra", "error");
    }
  };

  return (
    <div className="teacher-list-container">
      {message && (
        <div
          style={{
            marginBottom: "15px",
            padding: "10px",
            borderRadius: "6px",
            color: "#fff",
            backgroundColor: messageType === "success" ? "#28a745" : "#dc3545",
            textAlign: "center",
            fontWeight: "600",
          }}
        >
          {message}
        </div>
      )}

      <form className="teacher-form" onSubmit={handleSubmit}>
        <h3>{editingId ? "Sửa ca dạy" : "Thêm ca dạy"}</h3>

        <select
          value={form.teacherId}
          onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
          required
        >
          <option value="">-- Chọn giáo viên --</option>
          {teachers.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>

        <select
          value={form.studentId}
          onChange={(e) => setForm({ ...form, studentId: e.target.value })}
          required
        >
          <option value="">-- Chọn học viên --</option>
          {students.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
        />
        <input
          type="time"
          value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
          required
        />
        <button type="submit">{editingId ? "Cập nhật" : "Thêm"}</button>
      </form>

      <table className="teacher-table">
        <thead>
          <tr>
            <th>Giáo viên</th>
            <th>Học viên</th>
            <th>Ngày</th>
            <th>Giờ</th>
            <th>Chức năng</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((s) => (
            <tr key={s._id}>
              <td>{s.teacherName}</td>
              <td>{s.studentName}</td>
              <td>{s.date}</td>
              <td>{s.time}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(s)}>
                  Sửa
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(s._id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
