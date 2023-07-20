import React from "react";
import { useNavigate } from "react-router-dom";

function DashboardComponent() {
  const navigate = useNavigate();
  const handleLogout = (e) => {
    localStorage.clear();
    navigate("/login");
  };
  return (
    <div>
      DashboardComponent
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default DashboardComponent;
