import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import RevenueList from "../components/RevenueList";
import ExpenseList from "../components/ExpenseList";
import AdTeacherList from "../components/AdTeacherList";
import StudentList from "../components/StudentList";
import ScheduleList from "../components/ScheduleList";
import api from "../api/axios";
import "../index.css";

export default function AdminDashboard({ setUser }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalExpense: 0,
    profit: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const revenuesRes = await api.get("/revenues");
      const expensesRes = await api.get("/expenses");

      const totalRevenue = revenuesRes.data.reduce(
        (sum, r) => sum + r.amount,
        0
      );
      const totalExpense = expensesRes.data.reduce(
        (sum, e) => sum + e.amount,
        0
      );

      setStats({
        totalRevenue,
        totalExpense,
        profit: totalRevenue - totalExpense,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Navbar title="Admin Dashboard" setUser={setUser} />
      <div className="container">
        <aside className="sidebar">
          <h2>Menu</h2>
          <button onClick={() => setActiveTab("dashboard")}>Tổng quan</button>
          <button onClick={() => setActiveTab("teachers")}>Giáo viên</button>
          <button onClick={() => setActiveTab("students")}>Học viên</button>
          <button onClick={() => setActiveTab("revenues")}>Doanh thu</button>
          <button onClick={() => setActiveTab("expenses")}>Chi phí</button>
          <button onClick={() => setActiveTab("schedules")}>Ca dạy</button>
        </aside>

        <main className="main">
          {activeTab === "dashboard" && (
            <div className="dashboard">
              <h2>Tổng quan tài chính</h2>
              <div className="stats-grid">
                <div className="stats-card">
                  <h3>Tổng thu nhập</h3>
                  <p>{stats.totalRevenue.toLocaleString("vi-VN")} đ</p>
                </div>
                <div className="stats-card">
                  <h3>Tổng chi phí</h3>
                  <p>{stats.totalExpense.toLocaleString("vi-VN")} đ</p>
                </div>
                <div className="stats-card">
                  <h3>Lợi nhuận</h3>
                  <p>{stats.profit.toLocaleString("vi-VN")} đ</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "teachers" && (
            <div className="dashboard">
              <h2>Danh sách giáo viên</h2>
              <AdTeacherList />
            </div>
          )}

          {activeTab === "students" && (
            <div className="dashboard">
              <h2>Danh sách học viên</h2>
              <StudentList />
            </div>
          )}

          {activeTab === "revenues" && (
            <div className="dashboard">
              <RevenueList />
            </div>
          )}

          {activeTab === "expenses" && (
            <div className="dashboard">
              <ExpenseList />
            </div>
          )}

          {activeTab === "schedules" && (
            <div className="dashboard">
              <h2>Ca dạy</h2>
              <ScheduleList />
            </div>
          )}
        </main>
      </div>
    </>
  );
}
