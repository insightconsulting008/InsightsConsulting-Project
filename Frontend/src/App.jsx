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
import PaymentSettings from "./Components/admin/settings/PaymentSettings";
import ViewService from "./Components/admin/service/get-service/ViewService";
import EditService from "./Components/admin/service/get-service/EditService";
import GetService from "./Components/user/service/GetService";
import MyService from "./Components/user/my-service/MyService";
import AddBundleService from "./Components/admin/service/add-service/AddBundleService";
import OrderManagement from "./Components/admin/order-management/OrderManagement";
import ViewOrder from "./Components/admin/order-management/ViewOrder";

import StaffMyService from "./Components/staff/my-service/StaffMyService";
import StaffViewDetails from "./Components/staff/my-service/StaffViewDetails";

import Nav from "./LandingPage/Nav";
import Blog from "./LandingPage/Blog";
import Blogdesc from "./LandingPage/Blogdesc";
import Addblog from "./LandingPage/Addblog";
import Home from "./LandingPage/Home";
import ServiceInfo from "./LandingPage/ServiceInfo";
import Contact from "./LandingPage/Contact";
import About from "./LandingPage/Company";
import Servicehub from "./LandingPage/Servicehub";
import Footer from "./LandingPage/Footer";
import ServiceInfoSection from "./LandingPage/ServiceInfo";

const NavbarController = ({ setRefreshDepartmentsTrigger }) => {
  const location = useLocation();
  const role = sessionStorage.getItem("role");


  if (location.pathname === "/login") return null;

  
  if (!role) return <Nav /> ;

  // ✅ Role based navbars
  if (role === "ADMIN") {
    return (
      <AdminNav setRefreshDepartmentsTrigger={setRefreshDepartmentsTrigger} />
    );
  }

  if (role === "STAFF") return <StaffNav />;
  if (role === "USER") return <UserNav />;

  return null;
};

const FooterController = () => {
  const location = useLocation();
  const role = sessionStorage.getItem("role");


  if (location.pathname === "/login") return null;


  if (!role) return <Footer />;


  return null;
};

const App = () => {
  const [refreshDepartmentsTrigger, setRefreshDepartmentsTrigger] =
    useState(false);

  return (
    <BrowserRouter>
      {/* Role based nav */}
      <NavbarController
        setRefreshDepartmentsTrigger={setRefreshDepartmentsTrigger}
      />

      <Routes>
        {/* Landing Page */}
        <Route
          path="/"
          element={
            <>
            
              <Home />
            </>
          }
        />

        {/* Auth */}
        <Route path="/login" element={<Login />} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/employee-repo" element={<Employe />} />
        <Route path="/add-service" element={<AddService />} />
        <Route path="/service-hub" element={<Service />} />
        <Route path="/settings" element={<PaymentSettings />} />
        <Route path="/service/view/:serviceId" element={<ViewService />} />
        <Route path="/service/edit/:serviceId" element={<EditService />} />
        <Route path="/add-bundle-service" element={<AddBundleService />} />
        <Route path="/order-management" element={<OrderManagement />} />
        <Route path="/orders/:applicationId" element={<ViewOrder />} />

        {/* Staff */}
        <Route path="/staff/dashboard" element={<StaffDashboard />} />
        <Route path="/staff/my-services" element={<StaffMyService />} />
        <Route
          path="/staff/service/:applicationId"
          element={<StaffViewDetails />}
        />

        {/* User */}
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/service-hub" element={<GetService />} />
        <Route path="/my-services" element={<MyService />} />

        {/* landing */}
        <Route path="/resource" element={<Blog />} />
        <Route path="/resource/:slug" element={<Blogdesc />} />
        <Route path="/add-blog" element={<Addblog />} />
        <Route path="/services/:categoryId/:subCategoryId" element={<ServiceInfoSection />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/company" element={<About />} />
        <Route path="/servicehub" element={<Servicehub />} />
       
      </Routes>
      <FooterController />;
    </BrowserRouter>
  );
};

export default App;
