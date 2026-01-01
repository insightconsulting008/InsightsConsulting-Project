import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import AdminNav from "./Components/admin/Navbar/AdminNav";
import StaffNav from "./Components/staff/StaffNav";
import UserNav from "./Components/user/UserNav";

import Login from "./Components/auth/Login";
import Employe from "./Components/admin/employee_repo/Employe";
import AddService from "./Components/admin/service/add-service/AddService";
import Service from "./Components/admin/service/Service";
import UserDashboard from "./Components/user/UserDashboard";
import AdminDashboard from "./Components/admin/AdminDashboard";
import StaffDashboard from "./Components/staff/StaffDashboard";

/* ===========================
   Navbar Controller Component
=========================== */
const NavbarController = ({ setRefreshDepartmentsTrigger }) => {
  const location = useLocation();
  const role = sessionStorage.getItem("role");

  // ❌ Hide navbar on login page
  if (location.pathname === "/") return null;

  // ❌ If role not found (not logged in)
  if (!role) return null;

  // ✅ Role-based navbar
  if (role === "ADMIN") {
    return <AdminNav setRefreshDepartmentsTrigger={setRefreshDepartmentsTrigger} />;
  }

  if (role === "STAFF") {
    return <StaffNav/>;
  }

  if (role === "USER") {
    return <UserNav />;
  }

  return null;
};

const App = () => {
  const [refreshDepartmentsTrigger, setRefreshDepartmentsTrigger] = useState(false);

  return (
    <BrowserRouter>
      {/* ✅ Combined Role Navbar */}
      <NavbarController
        setRefreshDepartmentsTrigger={setRefreshDepartmentsTrigger}
      />

      <Routes>
        <Route path="/" element={<Login />} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/employee-repo" element={<Employe />} />
        <Route path="/add-service" element={<AddService />} />
        <Route path="/service-hub" element={<Service />} />

        {/* Staff */}
        <Route path="/staff/dashboard" element={<StaffDashboard />} />

        {/* User */}
        <Route path="/user/dashboard" element={<UserDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
