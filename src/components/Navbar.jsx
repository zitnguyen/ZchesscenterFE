import React from "react";

export default function Navbar({ title = "Dashboard", setUser }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    if (setUser) setUser(false);
  };

  return (
    <header className="header">
      <h1>{title}</h1>
      <button onClick={handleLogout}>Logout</button>
    </header>
  );
}
