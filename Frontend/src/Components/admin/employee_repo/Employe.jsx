// EmployeeManagement.jsx
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  ArrowLeft,
  Plus,
  Download,
  Users,
  Shield,
  UserCheck,
  Grid3x3,
  Search,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import AddEmployeeModal from '../popup/AddEmploye';

const EmployeeManagement = () => {
  const [activeTab, setActiveTab] = useState('Employee List');
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [error, setError] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const stats = useMemo(() => {
    const total = employees.length;
    const active = employees.filter((e) => e.status === 'ACTIVE').length;
    const inactive = total - active;
    const deptCount = departments.length;
    return [
      { label: 'Total Employees', value: total, icon: Users, color: 'bg-purple-100 text-purple-600' },
      { label: 'Active', value: active, icon: Shield, color: 'bg-blue-100 text-blue-600' },
      { label: 'In Active', value: inactive, icon: UserCheck, color: 'bg-indigo-100 text-indigo-600' },
      { label: 'Department', value: deptCount.toString().padStart(2, '0'), icon: Grid3x3, color: 'bg-purple-100 text-purple-600' }
    ];
  }, [employees, departments]);

  const tabs = ['Employee List', 'Department List', 'Choose Data View'];
  const filters = useMemo(() => {
    // build filters from departments + a few defaults
    const deptNames = departments.map((d) => d.name).filter(Boolean);
    return ['All', ...deptNames];
  }, [departments]);

  const tableHeaders = [
    'Employee Name',
    'Employee ID',
    'Email Address',
    'Phone Number',
    'Team',
    'DOJ',
    'Last Update',
    'Employee Status',
    'Actions'
  ];

  // Fetch employees
  const fetchEmployees = async () => {
    setLoadingEmployees(true);
    setError(null);
    try {
      const res = await axios.get('https://insightsconsult-backend.onrender.com/employee');
      // expecting the JSON format you provided:
      // { success: true, data: [ ... ] }
      const data = res?.data?.data ?? [];
      setEmployees(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch employees', err);
      setError('Failed to load employees');
    } finally {
      setLoadingEmployees(false);
    }
  };

  // Fetch departments
  const fetchDepartments = async () => {
    setLoadingDepartments(true);
    setError(null);
    try {
      const res = await axios.get('https://insightsconsult-backend.onrender.com/department');
      // expecting { success: true, data: [ ... ] }
      const data = res?.data?.data ?? [];
      setDepartments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch departments', err);
      setError('Failed to load departments');
    } finally {
      setLoadingDepartments(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  // Map departmentId -> name for quick lookup
  const deptMap = useMemo(() => {
    const m = {};
    departments.forEach((d) => {
      if (d.departmentId) m[d.departmentId] = d.name || d.departmentName || '—';
    });
    return m;
  }, [departments]);

  // Filtering + search
  const filteredEmployees = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = employees.slice();

    if (activeFilter && activeFilter !== 'All') {
      // filter by department name (Team)
      list = list.filter((emp) => {
        const team = deptMap[emp.departmentId] || '';
        return team.toLowerCase() === activeFilter.toLowerCase();
      });
    }

    if (q) {
      list = list.filter((emp) => {
        const team = deptMap[emp.departmentId] || '';
        return (
          (emp.name || '').toLowerCase().includes(q) ||
          (emp.employeeId || '').toLowerCase().includes(q) ||
          (emp.email || '').toLowerCase().includes(q) ||
          (emp.mobileNumber || '').toLowerCase().includes(q) ||
          team.toLowerCase().includes(q)
        );
      });
    }

    return list;
  }, [employees, searchQuery, activeFilter, deptMap]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredEmployees.slice(start, start + pageSize);
  }, [filteredEmployees, page]);

  // Utility to format date strings
  const formatDate = (iso) => {
    if (!iso) return '—';
    try {
      const d = new Date(iso);
      if (Number.isNaN(d.getTime())) return iso;
      return d.toLocaleDateString();
    } catch {
      return iso;
    }
  };

  // Called after AddEmployeeModal successfully creates an employee
  const handleRefreshAfterAdd = () => {
    fetchEmployees();
    setIsModalOpen(false);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 pl-[90px]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 md:mb-8 gap-4">
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Employee Management</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Avatar Group */}
            <div className="flex -space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white"></div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-white"></div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-white"></div>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-3 md:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm md:text-base whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add New Employee</span>
              <span className="sm:hidden">Add</span>
            </button>

            <button className="flex items-center gap-2 px-3 md:px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base whitespace-nowrap">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Bulk Export</span>
              <span className="sm:hidden">Export</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6">
          <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Employee Database</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg ${stat.color} flex items-center justify-center flex-shrink-0`}>
                  <stat.icon className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-600">{stat.label}</p>
                  <p className="text-xl md:text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 md:px-6 py-2.5 rounded-lg font-medium transition-colors whitespace-nowrap text-sm md:text-base ${
                activeTab === tab ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => {
                setActiveFilter(filter);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeFilter === filter ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base"
            />
          </div>

          <div className="flex gap-3">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base">
              <Filter className="w-4 h-4" />
              Filter
            </button>

            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base">
              <ArrowUpDown className="w-4 h-4" />
              Sort
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {tableHeaders.map((header) => (
                    <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Loading */}
                {loadingEmployees || loadingDepartments ? (
                  <tr>
                    <td colSpan={tableHeaders.length} className="px-6 py-8">
                      <div className="flex items-center justify-center text-gray-600">Loading...</div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={tableHeaders.length} className="px-6 py-8">
                      <div className="flex flex-col items-center justify-center text-center">
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1">Error</h3>
                        <p className="text-xs md:text-sm text-gray-500">{error}</p>
                      </div>
                    </td>
                  </tr>
                ) : pageItems.length === 0 ? (
                  <tr>
                    <td colSpan={tableHeaders.length} className="px-6 py-20">
                      <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 mb-4 relative">
                          <div className="absolute inset-0 bg-gray-100 rounded-lg transform rotate-6"></div>
                          <div className="absolute inset-0 bg-white rounded-lg shadow-md flex items-center justify-center">
                            <div className="text-4xl">📄</div>
                          </div>
                          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                            <span className="text-red-500 text-xl">✕</span>
                          </div>
                        </div>
                        <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1">No employee records found</h3>
                        <p className="text-xs md:text-sm text-gray-500">It looks like there are no employee details available yet.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  pageItems.map((emp) => (
                    <tr key={emp.employeeId || emp.email} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            {emp.photoUrl ? <img src={emp.photoUrl} alt={emp.name} className="w-full h-full object-cover" /> : <div className="text-sm text-gray-500">{(emp.name || '').slice(0,1).toUpperCase()}</div>}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{emp.name || '—'}</div>
                            <div className="text-xs text-gray-500">{emp.designation || '—'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{emp.employeeId || '—'}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{emp.email || '—'}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{emp.mobileNumber || '—'}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{deptMap[emp.departmentId] || '—'}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{formatDate(emp.createdAt)}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{formatDate(emp.updatedAt)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${emp.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {emp.status || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {/* Actions: preserve your design — placeholders for now */}
                        <div className="flex gap-2">
                          <button className="text-xs px-2 py-1 border rounded">View</button>
                          <button className="text-xs px-2 py-1 border rounded">Edit</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="border-t border-gray-200 px-4 md:px-6 py-4 flex flex-col sm:flex-row items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      <AddEmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        // If your AddEmployeeModal supports a callback after successful creation,
        // it can call this prop (e.g. props.onEmployeeAdded()) to refresh the list:
        onEmployeeAdded={handleRefreshAfterAdd}
      />
    </div>
  );
};

export default EmployeeManagement;
