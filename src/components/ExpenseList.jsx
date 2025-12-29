import { useState, useEffect } from "react";
import api from "../api/axios";
import "../index.css";

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    month: "",
    amount: 0,
    content: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await api.get("/expenses");
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
      alert("Không thể lấy danh sách chi phí");
    }
  };

  const handleEdit = (exp) => {
    setEditingId(exp._id);
    setFormData({
      month: exp.month,
      amount: exp.amount,
      content: exp.content || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa chi phí này?")) return;
    await api.delete(`/expenses/${id}`);
    fetchExpenses();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/expenses/${editingId}`, formData);
      } else {
        await api.post("/expenses", formData);
      }
      setFormData({ month: "", amount: 0, content: "" });
      setEditingId(null);
      fetchExpenses();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  return (
    <div className="student-list-container">
      {/* FORM */}
      <form className="teacher-form" onSubmit={handleSubmit}>
        <h3>{editingId ? "Sửa chi phí" : "Thêm chi phí"}</h3>

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
            const value = e.target.value.replace(/[^0-9]/g, "");
            setFormData({ ...formData, amount: value ? parseInt(value) : 0 });
          }}
          required
        />

        {/* Ghi chú */}
        <input
          type="text"
          placeholder="Ghi chú"
          value={formData.content}
          onChange={(e) =>
            setFormData({ ...formData, content: e.target.value })
          }
        />

        <button type="submit">{editingId ? "Cập nhật" : "Thêm"}</button>
      </form>

      {/* TABLE */}
      <table className="teacher-table">
        <thead>
          <tr>
            <th>Tháng</th>
            <th>Số tiền</th>
            <th>Ghi chú</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((e) => (
            <tr key={e._id}>
              <td>{e.month}</td>
              <td>{e.amount.toLocaleString("vi-VN")}</td>
              <td>{e.content}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(e)}>
                  Sửa
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(e._id)}
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
