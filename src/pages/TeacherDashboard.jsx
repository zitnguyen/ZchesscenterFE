import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import TTStudentList from "../components/TTStudentList";
import TTTeacherList from "../components/TTTeacherList";
import api from "../api/axios";
import "../index.css";

export default function TeacherDashboard({ setUser }) {
  const [activeTab, setActiveTab] = useState("students");
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const res = await api.get("/schedules"); // Backend trả ca dạy của teacher dựa token
      setSchedules(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Navbar title="Teacher Dashboard" setUser={setUser} />
      <div className="container">
        <aside className="sidebar">
          <h2>Menu</h2>
          <button onClick={() => setActiveTab("students")}>Học viên</button>
          <button onClick={() => setActiveTab("teachers")}>Giáo viên</button>
          <button onClick={() => setActiveTab("schedules")}>Ca dạy</button>
        </aside>
        <main className="main">
          {activeTab === "students" && (
            <div className="dashboard">
              <h2>Danh sách học viên</h2>
              <TTStudentList viewOnly={true} />
            </div>
          )}

          {activeTab === "teachers" && (
            <div className="dashboard">
              <h2>Danh sách giáo viên</h2>
              <TTTeacherList viewOnly={true} />
            </div>
          )}

          {activeTab === "schedules" && (
            <div className="dashboard">
              <h2>Ca dạy</h2>
              <table className="min-w-full bg-white rounded shadow overflow-hidden">
                <thead className="bg-green-600 text-white">
                  <tr>
                    <th className="p-2">Học viên</th>
                    <th className="p-2">Ca dạy</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map((s) => (
                    <tr key={s._id} className="border-b hover:bg-gray-100">
                      <td className="p-2">{s.studentName}</td>
                      <td className="p-2">{s.time}</td>
                    </tr>
                  ))}
                  {schedules.length === 0 && (
                    <tr>
                      <td colSpan="2" className="p-2 text-center">
                        Chưa có ca dạy nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
