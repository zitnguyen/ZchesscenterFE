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
    try {
      const res = await api.get("/revenues");
      setRevenues(res.data);
    } catch (err) {
      console.error(err);
      alert("Không thể lấy danh sách doanh thu");
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await api.get("/student");
      setStudents(res.data);
    } catch (err) {
      console.error(err);
      alert("Không thể lấy danh sách học sinh");
    }
  };

  const handleEdit = (r) => {
    setEditingId(r._id);
    setFormData({
      studentId: r.studentId._id,
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
    try {
      if (editingId) {
        await api.put(`/revenues/${editingId}`, formData);
      } else {
        await api.post("/revenues", formData);
      }
      setFormData({ studentId: "", month: "", amount: 0 });
      setEditingId(null);
      fetchRevenues();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  return (
    <div className="student-list-container">
      {/* FORM */}
      <form className="teacher-form" onSubmit={handleSubmit}>
        <h3>{editingId ? "Sửa doanh thu" : "Thêm doanh thu"}</h3>

        {/* Chọn học sinh */}
        <select
          value={formData.studentId}
          onChange={(e) =>
            setFormData({ ...formData, studentId: e.target.value })
          }
          required
        >
          <option value="">-- Chọn học sinh --</option>
          {students.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

        {/* Chọn tháng */}
        <select
          value={formData.month}
          onChange={(e) => setFormData({ ...formData, month: e.target.value })}
          required
        >
          <option value="">-- Chọn tháng --</option>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        {/* Nhập số tiền có dấu , */}
        <input
          type="text"
          placeholder="Số tiền"
          value={
            formData.amount === 0 ? "" : formData.amount.toLocaleString("vi-VN")
          }
          onChange={(e) => {
            // chỉ giữ ký tự số, loại bỏ dấu ,
            const value = e.target.value.replace(/[^0-9]/g, "");
            setFormData({
              ...formData,
              amount: value ? parseInt(value) : 0,
            });
          }}
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
          {revenues.map((r) => (
            <tr key={r._id}>
              <td>{r.studentId?.name || "Không rõ"}</td>
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
          ))}
        </tbody>
      </table>
    </div>
  );
}
