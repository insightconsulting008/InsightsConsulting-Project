import React from 'react'
import AdminNav from './Components/admin/Navbar/AdminNav'
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import Employe from './Components/admin/employee_repo/Employe'
import AddService from './Components/admin/service/add-service/AddService';
import Service from './Components/admin/service/Service';
import ViewService from './Components/admin/service/get-service/ViewService';
import EditService from './Components/admin/service/get-service/EditService';


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
          <Route
            path="/add-service"
            element={
              <AddService/>
            }
          />
          <Route
            path="/service-hub"
            element={
              <Service/>
            }
          />
           <Route path="/service/view/:serviceId" element={<ViewService />} />
           <Route path="/service/edit/:serviceId" element={<EditService />} />
        </Routes>
        <AdminNav setRefreshDepartmentsTrigger={setRefreshDepartmentsTrigger} />
      </BrowserRouter>
    </div>
  );
};

export default App;
