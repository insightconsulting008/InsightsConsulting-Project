// AdminNav.jsx
import React, { useState, useEffect } from 'react';
import {
  Home,
  Briefcase,
  Users,
  CheckSquare,
  Bell,
  FileText,
  UserCircle,
  BarChart3,
  Settings,
  Menu,
  X,
  Plus
} from 'lucide-react';
import { HiUserPlus } from "react-icons/hi2";
import axios from 'axios';

import AddDepartmentModal from '../employee_repo/popup/AddDepartment';
import { useNavigate, useLocation } from "react-router-dom";

const AdminNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // initialize from current location so refresh shows correct active item
  const [activeRoute, setActiveRoute] = useState(location.pathname || '/admin/dashboard');
  const [isDeptOpen, setIsDeptOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // departments + pagination
  const [departments, setDepartments] = useState([]);
  const [loadingDepts, setLoadingDepts] = useState(true);
  const [deptError, setDeptError] = useState(null);
  const [deptPage, setDeptPage] = useState(1);
  const [deptPageSize, setDeptPageSize] = useState(10);
  const [deptServerTotalPages, setDeptServerTotalPages] = useState(null);
  const [deptServerTotalDocs, setDeptServerTotalDocs] = useState(null);

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/service-hub', icon: Briefcase, label: 'Service Hub' },
    { path: '/lead-management', icon: Users, label: 'Lead Management' },
    { path: '/task-list', icon: CheckSquare, label: 'Task List' },
    { path: '/compliance-reminder', icon: Bell, label: 'Compliance Reminder' },
    { path: '/documents-hub', icon: FileText, label: 'Documents Hub' },
    { path: '/customer-base', icon: UserCircle, label: 'Customer Base' },
    { path: '/employee-repo', icon: BarChart3, label: 'Employee Repo' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const handleNavClick = (path) => {
    setActiveRoute(path);
    navigate(path);
  };

  // sync activeRoute whenever the URL changes (handles refresh & external navigation)
  useEffect(() => {
    setActiveRoute(location.pathname || '/service-hub');
  }, [location.pathname]);

  // fetch departments from API (paginated)
  const fetchDepartments = async (page = deptPage, limit = deptPageSize) => {
    setLoadingDepts(true);
    setDeptError(null);

    try {
      const res = await axios.get('https://insightsconsult-backend.onrender.com/department', {
        params: { page, limit }
      });

      const payload = res?.data ?? {};

      // Possible shapes:
      // 1) { success: true, data: [...], pagination: { totalPages, totalDepartments } }
      // 2) { data: [...], meta: { totalPages, total } }
      // 3) array itself (res.data is an array)
      // 4) { departments: [...], pagination: {...} }
      let list = [];
      let pagination = null;

      if (Array.isArray(payload)) {
        list = payload;
      } else if (Array.isArray(payload.data)) {
        list = payload.data;
        pagination = payload.pagination ?? payload.meta ?? payload.paging ?? null;
      } else if (Array.isArray(payload.departments)) {
        list = payload.departments;
        pagination = payload.pagination ?? payload.meta ?? null;
      } else if (payload.success && Array.isArray(payload.data)) {
        list = payload.data;
        pagination = payload.pagination ?? payload.meta ?? null;
      } else {
        // fallback: try to find array anywhere
        const maybeArray = Object.values(payload).find((v) => Array.isArray(v));
        if (Array.isArray(maybeArray)) {
          list = maybeArray;
        } else {
          list = [];
        }
      }

      // Normalize pagination info
      const totalPagesFromServer = pagination?.totalPages ?? pagination?.pages ?? null;
      const totalDocsFromServer = pagination?.totalDepartments ?? pagination?.total ?? payload.total ?? null;

      setDepartments(Array.isArray(list) ? list : []);
      setDeptServerTotalPages(totalPagesFromServer);
      setDeptServerTotalDocs(totalDocsFromServer);

      // adjust page if server reports fewer pages
      if (totalPagesFromServer != null && page > totalPagesFromServer) {
        setDeptPage(totalPagesFromServer);
      }
    } catch (err) {
      console.error('Error fetching departments', err);
      setDeptError('Failed to load departments');
      setDepartments([]);
      setDeptServerTotalPages(null);
      setDeptServerTotalDocs(null);
    } finally {
      setLoadingDepts(false);
    }
  };

  useEffect(() => {
    fetchDepartments(1, deptPageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDeptCreated = (createdDept) => {
    if (!createdDept) {
      fetchDepartments(1, deptPageSize);
      return;
    }

    const maybeWrapped = createdDept?.data ?? createdDept;
    const normalized = {
      departmentId: maybeWrapped?.departmentId || maybeWrapped?.id || maybeWrapped?._id || `tmp-${Date.now()}`,
      name: maybeWrapped?.name || maybeWrapped?.departmentName || maybeWrapped?.label || '',
      departmentCode: maybeWrapped?.departmentCode || maybeWrapped?.code || '',
      labelColor: maybeWrapped?.labelColor || maybeWrapped?.color || '#CBD5E1',
      ...maybeWrapped,
    };

    // Prepend to local list for instant UI feedback
    setDepartments(prev => [normalized, ...(prev || [])]);
  };

  return (
    <div className="flex">
      <div
        className={`fixed inset-y-0 left-0 z-40 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-20'} overflow-hidden`}
      >
        <div className="flex flex-col justify-between">
          <div className="h-16 flex items-center justify-between border-b border-gray-200 px-4">
            <div className={`flex items-center gap-3 ${!isOpen ? 'justify-center w-full' : 'justify-start'}`}>
              <button
                onClick={() => setIsOpen(prev => !prev)}
                className="p-1 hover:bg-gray-100 rounded"
                aria-label="expand sidebar"
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              <span className={`font-bold text-indigo-600 transition-all ${!isOpen ? 'hidden' : 'inline'}`}>
                Gridlines UI
              </span>
            </div>
          </div>

          <nav className="py-4 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeRoute === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavClick(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${isActive ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : 'text-gray-700 hover:bg-gray-50'} ${!isOpen ? 'justify-center' : ''}`}
                  title={!isOpen ? item.label : ''}
                >
                  <Icon size={20} />
                  <span className={`${!isOpen ? 'hidden' : 'inline'}`}>{item.label}</span>
                </button>
              );
            })}

           
          </nav>
           {/* <div className="p-3 flex justify-end">
              <div className="max-w-4xl   mx-auto">
                {activeRoute === '/service-hub' && (
                  <div className="bg-white rounded-lg border border-gray-200 p-3 max-w-sm mb-6">
                    {isOpen ? (
                      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg text-xs text-center p-4">
                        <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-sm">
                          <div className="w-10 h-10 rounded-full border-4 border-blue-500 border-t-red-500 border-r-yellow-500 border-b-green-500" />
                        </div>
                        <h4 className="text-gray-800 text-xs font-semibold mb-2">Build your Service Category</h4>
                        <p className="text-gray-500 text-sm mb-6">
                          There are no service category listed. Create one to start onboarding service.
                        </p>
                        <button
                          onClick={() => setIsAddOpen(true)}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                        >
                          <Plus size={20} />
                          Add Category
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-end">
                        <button className="text-gray-600 hover:text-gray-800" aria-label="new category" onClick={() => setIsAddOpen(true)}>
                          <Plus size={20} />
                        </button>
                      </div>
                    )}

                    {isAddOpen && <AddCategoryCombined open={isAddOpen} onOpenChange={setIsAddOpen} />}
                  </div>
                )}

                {activeRoute === '/employee-repo' && (
                  <div className="bg-white rounded-lg border border-gray-200 p-3 max-w-sm">
                    {isOpen ? (
                      <>
                      
                        {loadingDepts ? (
                          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg text-xs text-center p-4">
                            <div className="text-sm text-gray-500 py-6">Loading departments…</div>
                          </div>
                        ) : deptError ? (
                          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg text-xs text-center p-4">
                            <div className="text-sm text-red-500 py-6">{deptError}</div>
                            <div className="px-4">
                              <button onClick={() => fetchDepartments(1, deptPageSize)} className="mt-2 w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-3 rounded-lg transition-colors">
                                Retry
                              </button>
                            </div>
                          </div>
                        ) : departments.length === 0 ? (
                          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg text-xs text-center p-4">
                            <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-sm">
                              <div className="w-10 h-10 rounded-full border-4 border-blue-500 border-t-red-500 border-r-yellow-500 border-b-green-500" />
                            </div>

                            <h4 className="text-gray-800 text-xs font-semibold mb-2">Build your first team</h4>
                            <p className="text-gray-500 text-sm mb-6">
                              There are no departments listed. Create one to start organizing your team structure.
                            </p>

                            <button onClick={() => setIsDeptOpen(true)} className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
                              <Plus size={20} />
                              Add Department
                            </button>
                          </div>
                        ) : (
                          <div className="text-left w-full">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="text-gray-800 text-sm font-semibold">Service Category</h4>
                              <button onClick={() => setIsDeptOpen(true)} className="text-gray-600 hover:text-gray-800" aria-label="Add Department">
                                <Plus size={18} />
                              </button>
                            </div>

                            <ul className="space-y-3 max-h-64 overflow-auto">
                              {departments.map((d) => (
                                <li key={d.departmentId || d._id || d.name} className="flex items-center gap-3 p-2  rounded-md hover:bg-gray-50 transition-colors" title={d.departmentCode}>
                                  <div className="w-3.5 h-3.5 rounded-full flex-shrink-0" style={{ backgroundColor: d.labelColor || '#CBD5E1' }} aria-hidden="true" />
                                  <div>
                                    <div className="text-sm font-medium text-gray-800">{d.name}</div>
                                    <div className="text-xs text-gray-500">{d.departmentCode}</div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex justify-center">
                        <button className="text-gray-600 hover:text-gray-800" aria-label="new department" onClick={() => setIsDeptOpen(true)}>
                          <HiUserPlus size={20} />
                        </button>
                      </div>
                    )}

                    {isDeptOpen && (
                      <AddDepartmentModal
                        open={isDeptOpen}
                        onClose={() => setIsDeptOpen(false)}
                        onSubmit={async (formDataOrCreated) => {
                          try {
                            handleDeptCreated(formDataOrCreated);
                            // After creating, re-fetch first page so API pagination remains consistent
                            await fetchDepartments(1, deptPageSize);
                          } catch (error) {
                            console.error('Parent onSubmit error:', error);
                          }
                        }}
                      />
                    )}
                  </div>
                )}

                {activeRoute === '/dashboard' && (
                  <div className="bg-white rounded-lg p-6 shadow">
                    <h2 className="font-semibold mb-4">Dashboard</h2>
                    <p className="text-gray-600">Welcome to your dashboard!</p>
                  </div>
                )}

                
              </div>
            </div> */}
           
        </div>
         {isOpen && (
                            <div className="border-t border-gray-200 flex items-end p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                                  <UserCircle size={20} className="text-indigo-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    Admin
                                  </p>
                                  <p className="text-xs text-gray-500 truncate">
                                    Admin@company.com
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
      </div>
      
    </div>
  );
};

export default AdminNav;
