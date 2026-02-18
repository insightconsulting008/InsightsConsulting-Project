import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import AdminNav from "./Components/admin/Navbar/AdminNav";
import StaffNav from "./Components/staff/staff-navbar/StaffNav";
import UserNav from "./Components/user/UserNav";

import Login from "./Components/auth/Login";
import Employe from "./Components/admin/employee_repo/Employe";
import AddService from "./Components/admin/service/add-service/AddService";
import Service from "./Components/admin/service/Service";
import UserDashboard from "./Components/user/UserDashboard";
import AdminDashboard from "./Components/admin/AdminDashboard";
import StaffDashboard from "./Components/staff/StaffDashboard";
import ViewService from "./Components/admin/service/get-service/ViewService";
import EditService from "./Components/admin/service/get-service/EditService";
import GetService from "./Components/user/service/GetService";
import MyService from "./Components/user/my-service/MyService";
import AddBundleService from "./Components/admin/service/add-service/AddBundleService";
import OrderManagement from "./Components/admin/order-management/OrderManagement";
import ViewOrder from "./Components/admin/order-management/ViewOrder";


import StaffMyService from "./Components/staff/my-service/StaffMyService";
import StaffViewDetails from "./Components/staff/my-service/StaffViewDetails";
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
    return (
      <AdminNav setRefreshDepartmentsTrigger={setRefreshDepartmentsTrigger} />
    );
  }

  if (role === "STAFF") {
    return <StaffNav />;
  }

  if (role === "USER") {
    return <UserNav />;
  }

  return null;
};

const App = () => {
  const [refreshDepartmentsTrigger, setRefreshDepartmentsTrigger] =
    useState(false);

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
        <Route path="/service/view/:serviceId" element={<ViewService />} />
        <Route path="/service/edit/:serviceId" element={<EditService />} />
        <Route path="/add-bundle-service" element={<AddBundleService />} />
        <Route path="/order-management" element={<OrderManagement />} />
        <Route path="/orders/:applicationId" element={<ViewOrder />} />

        {/* Staff */}
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/staff/my-services" element={<StaffMyService />} />
        <Route path="/staff/service/:applicationId" element={<StaffViewDetails />} />

        {/* User */}
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/service-hub" element={<GetService />} />
        <Route path="/my-services" element={<MyService />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
