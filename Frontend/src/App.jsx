import React from 'react'
import AdminNav from './Components/admin/AdminNav'
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import Employe from './Components/admin/employee_repo/Employe'
import Service from './Components/admin/service/Service'
import AddService from './Components/admin/service/AddService'


const App = () => {
  return (
   
    <div>
       <BrowserRouter>
       <Routes>
<Route path="/" element={<AdminNav  />} />
<Route path="/employee-repo" element={<Employe />} />
<Route path="/service-hub" element={<Service/>} />
<Route path="/add-service" element={<AddService/>} />

</Routes>
      <AdminNav/>
      </BrowserRouter>
    </div>
  )
}

export default App