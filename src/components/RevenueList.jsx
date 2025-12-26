import { useState, useEffect } from "react";
import api from "../api/axios";
import "../index.css";

export default function RevenueList() {
  const [revenues, setRevenues] = useState([]);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    studentId: "",
    month: "",
    amount: 0,
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchRevenues();
    fetchStudents();
  }, []);

  const fetchRevenues = async () => {
    const res = await api.get("/revenues");
    setRevenues(res.data);
  };

  const fetchStudents = async () => {
    const res = await api.get("/student");
    setStudents(res.data);
  };

  const handleEdit = (r) => {
    setEditingId(r._id);
    setFormData({
      studentId: r.studentId,
      month: r.month,
      amount: r.amount,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa doanh thu này?")) return;
    await api.delete(`/revenues/${id}`);
    fetchRevenues();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await api.put(`/revenues/${editingId}`, formData);
    } else {
      await api.post("/revenues", formData);
    }
    setFormData({ studentId: "", month: "", amount: 0 });
    setEditingId(null);
    fetchRevenues();
  };

  return (
    <div className="student-list-container">
      {/* FORM */}
      <form className="teacher-form" onSubmit={handleSubmit}>
        <h3>{editingId ? "Sửa doanh thu" : "Thêm doanh thu"}</h3>
        <select
          value={formData.studentId}
          onChange={(e) =>
            setFormData({ ...formData, studentId: e.target.value })
          }
          required
        >
          <option value="">Chọn học sinh</option>
          {students.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Tháng (ví dụ: 12/2025)"
          value={formData.month}
          onChange={(e) => setFormData({ ...formData, month: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Số tiền"
          value={formData.amount}
          onChange={(e) =>
            setFormData({ ...formData, amount: Number(e.target.value) })
          }
          required
        />
        <button type="submit">{editingId ? "Cập nhật" : "Thêm"}</button>
      </form>

      {/* TABLE */}
      <table className="teacher-table">
        <thead>
          <tr>
            <th>Học sinh</th>
            <th>Tháng</th>
            <th>Số tiền</th>
            <th>Chức năng</th>
          </tr>
        </thead>
        <tbody>
          {revenues.map((r) => {
            const student = students.find((s) => s._id === r.studentId);
            return (
              <tr key={r._id}>
                <td>{student ? student.name : "Không rõ"}</td>
                <td>{r.month}</td>
                <td>{r.amount.toLocaleString("vi-VN")}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(r)}>
                    Sửa
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(r._id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
