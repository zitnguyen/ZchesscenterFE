import { useState, useEffect } from "react";
import api from "../api/axios";

export default function ExpenseList() {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({ amount: 0, note: "" });
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await api.get("/expenses");
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (exp) => {
    setEditing(exp);
    setFormData({ amount: exp.amount, note: exp.note });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Xóa chi phí này?")) {
      await api.delete(`/expenses/${id}`);
      fetchExpenses();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/expenses/${editing._id}`, formData);
      } else {
        await api.post("/expenses", formData);
      }
      fetchExpenses();
      setShowForm(false);
      setEditing(null);
      setFormData({ amount: 0, note: "" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Chi phí</h2>
      <button
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:scale-105 transition"
        onClick={() => setShowForm(true)}
      >
        Thêm chi phí
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-4 p-4 border rounded shadow"
        >
          <input
            type="number"
            placeholder="Số tiền"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: Number(e.target.value) })
            }
            className="border p-2 mr-2"
          />
          <input
            placeholder="Ghi chú"
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            className="border p-2 mr-2"
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-3 py-1 rounded hover:scale-105 transition"
          >
            {editing ? "Cập nhật" : "Thêm"}
          </button>
          <button
            type="button"
            className="ml-2 bg-gray-400 text-white px-3 py-1 rounded hover:scale-105 transition"
            onClick={() => {
              setShowForm(false);
              setEditing(null);
            }}
          >
            Hủy
          </button>
        </form>
      )}

      <table className="w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Số tiền</th>
            <th className="p-2 border">Ghi chú</th>
            <th className="p-2 border">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((e) => (
            <tr key={e._id} className="hover:bg-gray-50">
              <td className="p-2 border">{e.amount.toLocaleString("vi-VN")}</td>
              <td className="p-2 border">{e.note}</td>
              <td className="p-2 border flex gap-2">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                  onClick={() => handleEdit(e)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(e._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
