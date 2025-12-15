import React from "react";
import AdminNav from "./Components/admin/AdminNav";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Employe from "./Components/admin/employee_repo/Employe";
import Service from "./Components/admin/service/GetService";
import AddService from "./Components/admin/service/AddService";

const App = (refreshDepartmentsTrigger, setRefreshDepartmentsTrigger) => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/employee-repo"
            element={
              <Employe
                refreshDepartmentsTrigger={refreshDepartmentsTrigger}
                setRefreshDepartmentsTrigger={setRefreshDepartmentsTrigger}
              />
            }
          />
        </Routes>
        <AdminNav setRefreshDepartmentsTrigger={setRefreshDepartmentsTrigger} />
      </BrowserRouter>
    </div>
  );
};

export default App;
