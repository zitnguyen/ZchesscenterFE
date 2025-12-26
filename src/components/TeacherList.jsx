import { useState, useEffect } from "react";
import api from "../api/axios";
import "../index.css";

export default function TeacherList() {
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", role: "teacher" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await api.get("/teacher");
      setTeachers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/teacher/${editingId}`, form);
      } else {
        await api.post("/teacher", form);
      }
      setForm({ name: "", email: "", role: "teacher" });
      setEditingId(null);
      fetchTeachers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (t) => {
    setEditingId(t._id);
    setForm({ name: t.name, email: t.email, role: t.role });
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa giáo viên này?")) return;
    try {
      await api.delete(`/teacher/${id}`);
      fetchTeachers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="teacher-list-container">
      {/* FORM */}
      <form onSubmit={handleSubmit} className="teacher-form">
        <h3>{editingId ? "Sửa giáo viên" : "Thêm giáo viên"}</h3>
        <input
          type="text"
          placeholder="Tên"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <button type="submit">{editingId ? "Cập nhật" : "Thêm"}</button>
      </form>

      {/* TABLE */}
      <table className="teacher-table">
        <thead>
          <tr>
            <th>Tên</th>
            <th>Email</th>
            <th>Chức năng</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((t) => (
            <tr key={t._id}>
              <td>{t.name}</td>
              <td>{t.email}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(t)}>
                  Sửa
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(t._id)}
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
