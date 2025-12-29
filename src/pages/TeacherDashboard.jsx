import { useState } from "react";
import Navbar from "../components/Navbar";
import TTStudentList from "../components/TTStudentList";
import TTTeacherList from "../components/TTTeacherList";
import TTScheduleList from "../components/TTScheduleList";

import "../index.css";

export default function TeacherDashboard({ setUser }) {
  const [activeTab, setActiveTab] = useState("students");

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
              <h2>Danh sách ca dạy</h2>
              <TTScheduleList />
            </div>
          )}
        </main>
      </div>
    </>
  );
}
