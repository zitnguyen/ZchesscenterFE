import { useState, useEffect } from "react";
import api from "../api/axios";

export default function AdTeacherList() {
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState(""); // state hiển thị thông báo
  const [messageType, setMessageType] = useState("success"); // success | error

  useEffect(() => {
    fetchTeachers();
  }, []);

  const showMessage = (msg, type = "success") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 3000); // 3 giây tự ẩn
  };

  const fetchTeachers = async () => {
    try {
      const res = await api.get("/teacher");
      setTeachers(res.data);
    } catch (err) {
      console.error(err);
      showMessage("Lấy danh sách giáo viên thất bại", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const updateData = { name: form.name, email: form.email };
        if (form.password) updateData.password = form.password;
        await api.put(`/teacher/${editingId}`, updateData);
        showMessage("Cập nhật giáo viên thành công");
      } else {
        if (!form.password) {
          showMessage("Vui lòng nhập mật khẩu cho giáo viên mới", "error");
          return;
        }
        await api.post("/teacher", form);
        showMessage("Thêm giáo viên thành công");
      }
      setForm({ name: "", email: "", password: "" });
      setEditingId(null);
      fetchTeachers();
    } catch (err) {
      console.error(err);
      showMessage(err.response?.data?.message || "Có lỗi xảy ra", "error");
    }
  };

  const handleEdit = (t) => {
    setEditingId(t._id);
    setForm({ name: t.name, email: t.email, password: "" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa giáo viên này?")) return;
    try {
      await api.delete(`/teacher/${id}`);
      fetchTeachers();
    } catch (err) {
      console.error(err);
      showMessage(err.response?.data?.message || "Có lỗi xảy ra", "error");
    }
  };

  return (
    <div className="teacher-list-container">
      {/* MESSAGE */}
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

      {/* FORM */}
      <form className="teacher-form" onSubmit={handleSubmit}>
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
        <input
          type="password"
          placeholder={
            editingId ? "Mật khẩu mới (để trống nếu không đổi)" : "Mật khẩu"
          }
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required={!editingId}
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
