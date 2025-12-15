import React from 'react'
import AdminNav from './Components/admin/Navbar/AdminNav'
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import Employe from './Components/admin/employee_repo/Employe'


const App = (refreshDepartmentsTrigger, setRefreshDepartmentsTrigger) => {
  return (
   
    <div>
       <BrowserRouter>
       <Routes>

<Route path="/employee-repo" element={<Employe refreshDepartmentsTrigger={refreshDepartmentsTrigger}
        setRefreshDepartmentsTrigger={setRefreshDepartmentsTrigger} />} />

</Routes>
      <AdminNav setRefreshDepartmentsTrigger={setRefreshDepartmentsTrigger}/>
      </BrowserRouter>
    </div>
  )
}

export default App