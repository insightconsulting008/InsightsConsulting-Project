import React from 'react'
import AdminNav from './Components/admin/AdminNav'
import { BrowserRouter, Routes,Route } from 'react-router-dom'
import Employe from './Components/admin/employee_repo/Employe'


const App = () => {
  return (
   
    <div>
       <BrowserRouter>
       <Routes>
<Route path="/" element={<AdminNav  />} />
<Route path="/employee-repo" element={<Employe />} />

</Routes>
      <AdminNav/>
      </BrowserRouter>
    </div>
  )
}

export default App