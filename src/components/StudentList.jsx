import { useState, useEffect } from "react";
import api from "../api/axios";
import "../index.css";

export default function StudentList() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: "", age: "", level: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

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
        await api.put(`/student/${editingId}`, form);
      } else {
        await api.post("/student", form);
      }
      setForm({ name: "", age: "", level: "" });
      setEditingId(null);
      fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (s) => {
    setEditingId(s._id);
    setForm({ name: s.name, age: s.age, level: s.level });
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa học viên này?")) return;
    try {
      await api.delete(`/student/${id}`);
      fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="student-list-container">
      {/* FORM */}
      <form onSubmit={handleSubmit} className="teacher-form">
        <h3>{editingId ? "Sửa học viên" : "Thêm học viên"}</h3>
        <input
          type="text"
          placeholder="Tên"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Tuổi"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Level"
          value={form.level}
          onChange={(e) => setForm({ ...form, level: e.target.value })}
          required
        />
        <button type="submit">{editingId ? "Cập nhật" : "Thêm"}</button>
      </form>

      {/* TABLE */}
      <table className="teacher-table">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Tuổi</th>
            <th>Level</th>
            <th>Chức năng</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s._id}>
              <td>{s.name}</td>
              <td>{s.age}</td>
              <td>{s.level}</td>
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
