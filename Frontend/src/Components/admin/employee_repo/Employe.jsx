// EmployeeManagement.jsx
import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
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
  ArrowUpDown,
  MoreVertical,
  ExternalLink,
  Edit2,
  EyeOff,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { TbUserSquareRounded } from "react-icons/tb";
import { MdOutlineVerifiedUser } from "react-icons/md";
import { GoShieldX } from "react-icons/go";
import { PiGridFourLight } from "react-icons/pi";
import AddEmployeeModal from '../popup/AddEmploye';
import AddDepartmentModal from './Adddepartment';
import { FaChevronRight } from "react-icons/fa6";
import { RiArrowLeftSLine } from "react-icons/ri";
import { FaChevronLeft } from 'react-icons/fa';

const TAB_DEFS = [
  { key: 'employees', label: 'Employee List' },
  { key: 'departments', label: 'Department List' },
];

const ActionMenu = ({ emp, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const onDocClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((v) => !v)} className="p-1 rounded-md hover:bg-gray-100 transition-colors" aria-haspopup="true" aria-expanded={open} aria-label="Open actions">
        <MoreVertical className="w-5 h-5 text-gray-600" />
      </button>
      {open && (
        <div className="absolute right-5 -top-1 mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-100 z-50" role="menu">
          <button onClick={() => { setOpen(false); onEdit && onEdit(emp); }} className="w-full text-left px-3 py-2 flex items-center gap-3 hover:bg-gray-50 transition-colors text-sm" role="menuitem">
            <Edit2 className="w-4 h-4 text-gray-500" /><span className="text-gray-700">Edit</span>
          </button>
          <div className="border-t border-gray-100" />
          <button onClick={() => { setOpen(false); onDelete && onDelete(emp); }} className="w-full text-left px-3 py-2 flex items-center gap-3 hover:bg-gray-50 transition-colors text-sm text-red-600" role="menuitem">
            <Trash2 className="w-4 h-4 text-red-500" /><span>Delete Permanently</span>
          </button>
        </div>
      )}
    </div>
  );
};

const DeptActionMenu = ({ dept, onView, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const onDocClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((v) => !v)} className="p-1 rounded-md hover:bg-gray-100 transition-colors" aria-haspopup="true" aria-expanded={open} aria-label="Open actions">
        <MoreVertical className="w-5 h-5 text-gray-600" />
      </button>
      {open && (
        <div className="absolute -top-5 -left-40 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
          <button onClick={() => { setOpen(false); onView && onView(dept); }} className="w-full text-left px-3 py-2 flex items-center gap-3 hover:bg-gray-50 transition-colors text-sm">
            <ExternalLink className="w-4 h-4 text-gray-500" /><span className="text-gray-700">View</span>
          </button>
          <button onClick={() => { setOpen(false); onEdit && onEdit(dept); }} className="w-full text-left px-3 py-2 flex items-center gap-3 hover:bg-gray-50 transition-colors text-sm">
            <Edit2 className="w-4 h-4 text-gray-500" /><span className="text-gray-700">Edit</span>
          </button>
          <div className="border-t border-gray-100" />
          <button onClick={() => { setOpen(false); onDelete && onDelete(dept); }} className="w-full text-left px-3 py-2 flex items-center gap-3 hover:bg-gray-50 transition-colors text-sm text-red-600">
            <Trash2 className="w-4 h-4 text-red-500" /><span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
};

const EmployeeManagement = () => {
  // UI + modals
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeTab, setActiveTab] = useState('departments');

  // employees
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [serverTotalPages, setServerTotalPages] = useState(null);
  const [serverTotalDocs, setServerTotalDocs] = useState(null);

  // employee modal/edit/delete
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  // departments
  const [departments, setDepartments] = useState([]);
  const [loadingDepartments, setLoadingDepartments] = useState(false);
  const [deptError, setDeptError] = useState(null);
  const [deptPage, setDeptPage] = useState(1);
  const deptPageSize = 10;
  const [deptServerTotalPages, setDeptServerTotalPages] = useState(null);
  const [deptServerTotalDocs, setDeptServerTotalDocs] = useState(null);

  // department delete
  const [showDeptDeleteConfirm, setShowDeptDeleteConfirm] = useState(false);
  const [deptToDelete, setDeptToDelete] = useState(null);
  const [deletingDept, setDeletingDept] = useState(false);
  const [deptDeleteError, setDeptDeleteError] = useState(null);

  // search / filters / sort
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [deptSearchQuery, setDeptSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [deptSort, setDeptSort] = useState('name');




  
  // stats
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

    const [deleteSuccess, setDeleteSuccess] = useState(false);//employee dleete csucess
    const [deptDeleteSuccess, setDeptDeleteSuccess] = useState(false); // department delete sucess

   
const handleDepartmentRefresh = () => {
  console.log('🔥 DEPARTMENT REFRESH TRIGGERED');
  setDeptPage(1);                 // reset to first page
  setDeptRefreshToken(t => t + 1); // FORCE re-fetch
};


  // derived stats & helpers
  const stats = useMemo(() => {
    if (dashboardStats) {
      return [
        { label: 'Total Employees', value: dashboardStats.totalEmployees ?? employees.length, icon: TbUserSquareRounded },
        { label: 'Active', value: dashboardStats.activeEmployees ?? employees.filter((e) => e.status === 'ACTIVE').length, icon: MdOutlineVerifiedUser },
        { label: 'In Active', value: dashboardStats.inactiveEmployees ?? employees.filter((e) => e.status !== 'ACTIVE').length, icon: GoShieldX },
        { label: 'Department', value: String(dashboardStats.totalDepartments ?? departments.length).padStart(2, '0'), icon: PiGridFourLight }
      ];
    }
    const total = employees.length;
    const active = employees.filter((e) => e.status === 'ACTIVE').length;
    const inactive = total - active;
    return [
      { label: 'Total Employees', value: total, icon: Users },
      { label: 'Active', value: active, icon: Shield },
      { label: 'In Active', value: inactive, icon: UserCheck },
      { label: 'Department', value: String(departments.length).padStart(2, '0'), icon: Grid3x3 }
    ];
  }, [dashboardStats, employees, departments]);

  const filters = useMemo(() => ['All', ...departments.map((d) => d.name).filter(Boolean)], [departments]);

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

  // map dept id -> name
  const deptMap = useMemo(() => {
    const m = {};
    departments.forEach((d) => {
      if (d.departmentId) m[d.departmentId] = d.name || d.departmentName || '—';
      if (d._id) m[d._id] = d.name || d.label || d.departmentName || '—';
     
    });
    return m;
  }, [departments]);

  // counts of employees per department
  const deptCounts = useMemo(() => {
    const counts = {};
    employees.forEach((e) => {
      const key = e.departmentId ?? e.department ?? '__unknown';
      counts[key] = (counts[key] || 0) + 1;
    });
    return counts;
  }, [employees]);
  


  // -----------------------------
  // fetch functions
  // -----------------------------
  const fetchEmployees = useCallback(async (pageArg = page) => {
    setLoadingEmployees(true);
    setError(null);
    try {
      const res = await axios.get('https://insightsconsult-backend.onrender.com/employee', { params: { page: pageArg, limit: pageSize } });
      const payload = res?.data ?? {};
      
      const list = Array.isArray(payload.data) ? payload.data : [];
      const pagination = payload.pagination ?? null;
      setEmployees(Array.isArray(list) ? list : []);
      setServerTotalPages(pagination?.totalPages ?? null);
      setServerTotalDocs(pagination?.totalEmployees ?? null);
      if (pagination?.totalPages && pageArg > pagination.totalPages) setPage(pagination.totalPages);
    } catch (err) {
      console.error('Failed to fetch employees', err);
      setError('Failed to load employees');
      setEmployees([]);
      setServerTotalPages(null);
      setServerTotalDocs(null);
    } finally {
      setLoadingEmployees(false);
    }
  }, [page]);

  
  
  const fetchDepartments = useCallback(
  async (pageArg, limit = deptPageSize) => {
    setLoadingDepartments(true);
    setDeptError(null);

    try {
      const res = await axios.get(
        'https://insightsconsult-backend.onrender.com/department',
        { params: { page: pageArg, limit } }
      );

      const payload = res?.data ?? {};
      const list = Array.isArray(payload.data)
        ? payload.data
        : Array.isArray(payload)
        ? payload
        : payload.departments || [];

      const pagination = payload.pagination ?? payload.meta ?? null;

      setDepartments(list);
      setDeptServerTotalPages(
        pagination?.totalPages ?? pagination?.pages ?? null
      );
      setDeptServerTotalDocs(
        pagination?.totalDepartments ??
          pagination?.total ??
          payload.total ??
          null
      );

      if (
        (pagination?.totalPages || pagination?.pages) &&
        pageArg > (pagination.totalPages ?? pagination.pages)
      ) {
        setDeptPage(pagination.totalPages ?? pagination.pages);
      }
      
    } catch (err) {
      console.error('Failed to fetch departments', err);
      setDeptError('Failed to load departments');
      setDepartments([]);
      setDeptServerTotalPages(null);
      setDeptServerTotalDocs(null);
    } finally {
      setLoadingDepartments(false);
    }
  },
  [deptPageSize] // ✅ ONLY page size
);


  const fetchDashboardStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const res = await axios.get('https://insightsconsult-backend.onrender.com/dashboard/stats');
      setDashboardStats(res?.data?.data ?? res?.data ?? null);
    } catch (err) {
      console.warn('Failed to fetch dashboard stats', err);
      setDashboardStats(null);
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // initial load
  useEffect(() => {
    fetchEmployees(1);
    fetchDepartments(1);
    fetchDashboardStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // refetch departments when tab active or page changes
 useEffect(() => {
  if (activeTab === 'departments') {
    fetchDepartments(deptPage);
  }
}, [deptPage, activeTab, fetchDepartments]);


  // clamp pages if server reports totals
  useEffect(() => { if (serverTotalPages != null && page > serverTotalPages) setPage(serverTotalPages); }, [serverTotalPages, page]);
  useEffect(() => { if (deptServerTotalPages != null && deptPage > deptServerTotalPages) setDeptPage(deptServerTotalPages); }, [deptServerTotalPages, deptPage]);

  // -----------------------------
  // filtering + paging
  // -----------------------------
  const filteredEmployees = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = employees.slice();
    if (activeFilter && activeFilter !== 'All') {
      list = list.filter((emp) => (deptMap[emp.departmentId] || '').toLowerCase() === activeFilter.toLowerCase());
    }
    if (q) {
      list = list.filter((emp) => {
        const team = deptMap[emp.departmentId] || '';
        return ((emp.name || '').toLowerCase().includes(q) ||
          (emp.employeeId || '').toLowerCase().includes(q) ||
          (emp.email || '').toLowerCase().includes(q) ||
          (emp.mobileNumber || '').toLowerCase().includes(q) ||
          team.toLowerCase().includes(q));
      });
    }
    return list;
  }, [employees, searchQuery, activeFilter, deptMap]);

  const totalPages = serverTotalPages != null ? Math.max(1, serverTotalPages) : Math.max(1, Math.ceil(filteredEmployees.length / pageSize));
  const pageItems = useMemo(() => {
    if (serverTotalPages != null) return filteredEmployees;
    const start = (page - 1) * pageSize;
    return filteredEmployees.slice(start, start + pageSize);
  }, [filteredEmployees, page, pageSize, serverTotalPages]);

  const filteredDepartments = useMemo(() => {
    const q = deptSearchQuery.trim().toLowerCase();
    let list = departments.slice();
    if (deptFilter === 'With Employees') {
      list = list.filter((d) => (deptCounts[d.departmentId ?? d._id ?? ''] || 0) > 0);
    } else if (deptFilter === 'No Employees') {
      list = list.filter((d) => (deptCounts[d.departmentId ?? d._id ?? ''] || 0) === 0);
    }
    if (q) {
      list = list.filter((d) => ((d.name || d.departmentName || '').toLowerCase().includes(q) ||
        (d.departmentCode || '').toLowerCase().includes(q) ||
        (d.labelColor || '').toLowerCase().includes(q)));
    }
    if (deptSort === 'name') list.sort((a, b) => ((a.name || '').localeCompare(b.name || '')));
    else if (deptSort === 'created') list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    else if (deptSort === 'employees') list.sort((a, b) => (deptCounts[b.departmentId ?? b._id ?? ''] || 0) - (deptCounts[a.departmentId ?? a._id ?? ''] || 0));
    return list;
  }, [departments, deptSearchQuery, deptFilter, deptSort, deptCounts]);

  const deptTotalPages = deptServerTotalPages != null ? Math.max(1, deptServerTotalPages) : Math.max(1, Math.ceil(filteredDepartments.length / deptPageSize));
  const deptPageItems = useMemo(() => {
    if (deptServerTotalPages != null) return filteredDepartments;
    const start = (deptPage - 1) * deptPageSize;
    return filteredDepartments.slice(start, start + deptPageSize);
  }, [filteredDepartments, deptPage, deptPageSize, deptServerTotalPages]);

  // -----------------------------
  // export CSV
  // -----------------------------
  const downloadCSV = (rows, filename = 'employees.csv') => {
    if (!rows || rows.length === 0) return;
    const keys = Object.keys(rows[0]);
    const csv = [keys.join(','), ...rows.map((r) => keys.map((k) => {
      const s = String(r[k] ?? '').replace(/"/g, '""');
      return /[,"\n]/.test(s) ? `"${s}"` : s;
    }).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.setAttribute('download', filename);
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  };

  const handleExport = async () => {
    try {
      let exportList = [];
      if (serverTotalDocs != null && serverTotalDocs > employees.length) {
        try {
          const res = await axios.get('https://insightsconsult-backend.onrender.com/employee', { params: { page: 1, limit: serverTotalDocs } });
          const payload = res?.data ?? {};
          exportList = Array.isArray(payload.data) ? payload.data : [];
        } catch (err) {
          console.warn('Fetching all employees for export failed, falling back to current view', err);
          exportList = filteredEmployees.slice();
        }
      } else exportList = filteredEmployees.slice();
      if (!exportList || exportList.length === 0) exportList = employees.slice();
      const rowsForCsv = exportList.map((emp) => ({
        name: emp.name ?? '',
        employeeId: emp.employeeId ?? emp._id ?? '',
        email: emp.email ?? '',
        mobileNumber: emp.mobileNumber ?? '',
        team: deptMap[emp.departmentId] ?? deptMap[emp.department] ?? '',
        designation: emp.designation ?? '',
        doj: emp.createdAt ? formatDate(emp.createdAt) : '',
        status: emp.status ?? ''
      }));
      const today = new Date().toISOString().slice(0, 10);
      downloadCSV(rowsForCsv, `employees-${today}.csv`);
    } catch (err) {
      console.error('Export failed', err);
      setError('Export failed. Check console for details.');
      setTimeout(() => setError(null), 4000);
    }
  };

  // -----------------------------
  // employee actions
  // -----------------------------
  const handleEdit = (emp) => { setEditingEmployee(emp || null); setModalOpen(true); };
  const handleDelete = (emp) => { setEmployeeToDelete(emp); setDeleteError(null); setShowDeleteConfirm(true); };

const confirmDelete = async () => {
  if (!employeeToDelete) return;

  setDeleting(true);
  setDeleteError(null);

  const id = employeeToDelete._id ?? employeeToDelete.employeeId;
  if (!id) {
    setDeleteError('Invalid employee ID');
    setDeleting(false);
    return;
  }

  try {
    await axios.delete(
      `https://insightsconsult-backend.onrender.com/employee/${id}`
    );

    await fetchEmployees(page);
    await fetchDashboardStats();

    setDeleteSuccess(true); // ✅ NO TIMEOUT

  } catch (err) {
    setDeleteError('Delete failed. Try again.');
  } finally {
    setDeleting(false);
  }
};

  const cancelDelete = () => { setShowDeleteConfirm(false); setEmployeeToDelete(null); setDeleteError(null); };

  const handleRefreshAfterSave = () => {
    fetchEmployees(page); setModalOpen(false); setEditingEmployee(null); fetchDepartments(deptPage); fetchDashboardStats();
  };

  // -----------------------------
  // department actions
  // -----------------------------
  const handleViewDept = (d) => console.log('View dept', d);
  const handleEditDept = (d) => { setSelectedCategory(d || null); setOpen(true); };
  const handleDeleteDept = (d) => { setDeptToDelete(d); setDeptDeleteError(null); setShowDeptDeleteConfirm(true); };

 



 const confirmDeleteDept = async () => {
  if (!deptToDelete) return;

  setDeletingDept(true);
  setDeptDeleteError(null);

  const id = deptToDelete.departmentId ?? deptToDelete._id;
  if (!id) {
    setDeptDeleteError('Invalid department ID');
    setDeletingDept(false);
    return;
  }

  try {
    await axios.delete(
      `https://insightsconsult-backend.onrender.com/department/${id}`
    );

    await fetchDepartments(1);
    await fetchDashboardStats();
    console.log("dleted refreshed")

    setDeptDeleteSuccess(true); // ✅ NO TIMEOUT

  } catch (err) {
    setDeptDeleteError(
      err?.response?.data?.message ?? 'Delete failed'
    );
  } finally {
    setDeletingDept(false);
  }
};



  const cancelDeleteDept = () => { setShowDeptDeleteConfirm(false); setDeptToDelete(null); setDeptDeleteError(null); };

  // -----------------------------
  // UI handlers
  // -----------------------------
  // const handleRefreshClick = () => { if (activeTab === 'employees') fetchEmployees(page); else if (activeTab === 'departments') fetchDepartments(deptPage); fetchDashboardStats(); };
// const handleDepartmentRefreshAfterSave = async () => {
//   fetchDashboardStats();
//   setDeptPage(1);
//   await fetchDepartments(1, deptPageSize);
// };
// const refreshDepartments = async () => {
//   fetchDashboardStats();
//   setDeptPage(1);
//   await fetchDepartments(1, deptPageSize);
// };
const refreshDepartmentsOnce = async () => {
  setDeptPage(1);               // reset pagination
  await fetchDepartments(1);    // fetch fresh data
  fetchDashboardStats();        // optional stats refresh
};



  const handleTabChange = (tabKey) => {
    if (tabKey === 'employees') { setActiveFilter('All'); setSearchQuery(''); setPage(1); setError(null); }
    else if (tabKey === 'departments') { setActiveFilter('null'); setDeptError(null); }
    setActiveTab(tabKey);
  };

  // Render tab content
  const renderTabContent = () => {
    if (activeTab === 'employees') {
      return (
        <>
          <div className="flex gap-2 mb-6  py-6 overflow-x-auto pb-2">
            {filters.map((filter) => (
              <button key={filter} onClick={() => { setActiveFilter(filter); setPage(1); }} className={`px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${activeFilter === filter ? 'text-[#4D4AEA] border-b-2 border-[#4D4AEA]' : 'text-gray-600 hover:text-gray-900'}`}>
                {filter}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 md:gap-4 mb-6">
            <div className=" relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" placeholder="Search" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base" />
            </div>

            {/* <div className="flex gap-3">
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base">
                <Filter className="w-4 h-4" /> Filter
              </button>
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base">
                <ArrowUpDown className="w-4 h-4" /> Sort
              </button>
            </div> */}
          </div>

          <div className="bg-white rounded-xl border-2 border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#F0F0F7]">
                    {['Employee Name','Email Address','Phone Number','Team','DOJ','Employee Status','Actions'].map((header, index) => (
                      <th key={header} className={`px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider ${index === 0 ? "rounded-tl-xl" : ""} ${index === 6 ? "rounded-tr-xl" : ""}`}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loadingEmployees ? (
                    <tr><td colSpan={7} className="px-6 py-8"><div className="flex items-center justify-center text-gray-600">Loading...</div></td></tr>
                  ) : error ? (
                    <tr><td colSpan={7} className="px-6 py-8"><div className="flex flex-col items-center justify-center text-center"><h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1">Error</h3><p className="text-xs md:text-sm text-gray-500">{error}</p></div></td></tr>
                  ) : pageItems.length === 0 ? (
                    <tr><td colSpan={7} className="px-3 py-20"><div className="flex flex-col items-center justify-center text-center"><div className="mb-4 relative"><img src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/Frame%202147225812.png" className='h-32' alt="" /></div><h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1">No employee records found</h3><p className="text-xs md:text-sm text-gray-500">It looks like there are no employee details available yet.</p></div></td></tr>
                  ) : (
                    pageItems.map((emp) => (
                      <tr key={emp.employeeId || emp.email || emp._id} className="hover:bg-gray-50">
                        <td className="px-3 border border-gray-200 py-4 text-center">
                          <div className="text-sm font-medium text-gray-900">{emp.name || '—'}</div>
                          <div className="text-xs text-gray-500">{emp.designation || '—'}</div>
                        </td>
                        <td className="px-3 py-4 text-sm border border-gray-200 text-gray-700"><div className='flex justify-center'>{emp.email || '—'}</div></td>
                        <td className="px-3 py-4 text-sm border border-gray-200 text-gray-700"><div className='flex justify-center'>{emp.mobileNumber || '—'}</div></td>
                        <td className="px-3 py-4 text-sm border border-gray-200 text-gray-700"><div className='flex justify-center'>{deptMap[emp.departmentId] || deptMap[emp.department] || '—'}</div></td>
                        <td className="px-3 py-4 text-sm border border-gray-200 text-gray-700"><div className='flex justify-center'>{formatDate(emp.createdAt)}</div></td>
                        <td className="px-3 py-4 border border-gray-200 text-center"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${emp.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{emp.status || '—'}</span></td>
                        <td className="px-3 py-4 border border-gray-200 text-sm text-gray-700 text-center"><ActionMenu emp={emp} onEdit={handleEdit} onDelete={handleDelete} /></td>
                      </tr>
                    ))
                  )}
                </tbody>
               
              </table>
               <div className="border-t border-gray-200  px-4 md:px-6 py-4 hidden md:flex flex-col sm:flex-row items-center justify-center gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="w-full sm:w-auto border border-gray-400 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50">Previous</button>
                <span className="px-4 py-2 text-sm text-gray-700">Page {page} of {totalPages}</span>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="w-full sm:w-auto border border-gray-400 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50">Next</button>
              </div>

              
            </div>
            <div className="border-t border-gray-200 md:hidden px-4 md:px-6 py-4  flex items-center justify-center gap-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="w-full sm:w-auto border border-gray-400 px-4 py-2 text-sm font-medium text-gray-700 flex justify-center items-center  hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"><FaChevronLeft /></button>
                <span className="px-4 py-2 text-sm w-full text-gray-700"> {page} of {totalPages}</span>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="w-full sm:w-auto border border-gray-400 px-4 py-2 text-sm font-medium text-gray-700 flex justify-center items-center hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"><FaChevronRight /></button>
              </div>
          </div>
        </>
      );
    }

    // departments tab
    return (
      <div>
        <div className="flex py-6 flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search departments (name, code, color)" value={deptSearchQuery} onChange={(e) => { setDeptSearchQuery(e.target.value); setDeptPage(1); }} className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm md:text-base" />
          </div>

          <div className="flex items-center gap-2">
            <select value={deptFilter} onChange={(e) => { setDeptFilter(e.target.value); setDeptPage(1); }} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option>All</option>
              <option>With Employees</option>
              <option>No Employees</option>
            </select>

            <select value={deptSort} onChange={(e) => setDeptSort(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="name">Sort: Name</option>
              <option value="created">Sort: Newest</option>
              <option value="employees">Sort: Employees</option>
            </select>

            <button onClick={() => fetchDepartments(deptPage)} className="px-3 py-2 border border-gray-300 rounded-lg text-sm">Apply</button>
          </div>
        </div>

        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Employees</th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loadingDepartments ? (
                  <tr><td colSpan={7} className="px-6 py-8"><div className="flex items-center justify-center text-gray-600">Loading departments...</div></td></tr>
                ) : deptError ? (
                  <tr><td colSpan={7} className="px-6 py-8"><div className="flex flex-col items-center justify-center text-center"><h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1">Error</h3><p className="text-xs md:text-sm text-gray-500">{deptError}</p></div></td></tr>
                ) : deptPageItems.length === 0 ? (
                 <tr><td colSpan={7} className="px-3 py-20"><div className="flex flex-col items-center justify-center text-center"><div className="mb-4 relative"><img src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/Frame%202147225812.png" className='h-32' alt="" /></div><h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1">No Department records found</h3><p className="text-xs md:text-sm text-gray-500">It looks like there are no Department details available yet.</p></div></td></tr>
                ) : (
                  deptPageItems.map((d) => {
                    const idKey = d.departmentId ?? d._id ?? '';
                    const count = deptCounts[idKey] ?? 0;
                    return (
                      <tr key={idKey || d.name} className="hover:bg-gray-50 ">
                        <td className="px-3 py-4 text-sm border text-center text-gray-700">{d.name || d.departmentName || '—'}</td>
                        <td className="px-3 py-4 text-sm border text-center text-gray-700">{d.departmentCode ?? '—'}</td>
                        <td className="px-3 py-4 text-sm border text-center text-gray-700">{formatDate(d.createdAt)}</td>
                        <td className="px-3 py-4 border ">
                          <div className="flex items-center justify-center  gap-2">
                            <div className="w-6 h-6 rounded-full border" style={{ background: d.labelColor || '#eee' }} aria-hidden="true" />
                            <div className="text-xs  text-gray-500">{d.labelColor || '—'}</div>
                          </div>
                        </td>
                        <td className="px-3 py-4 text-sm text-center border text-gray-700">{count}</td>
                        <td className="px-3 py-4 text-center border text-sm text-gray-700">
                          <DeptActionMenu dept={d} onView={handleViewDept} onEdit={handleEditDept} onDelete={handleDeleteDept} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
             <div className="border-t border-gray-200 px-4 md:px-6 py-4 hidden md:flex flex-col sm:flex-row items-center justify-center gap-2">
            <button onClick={() => setDeptPage((p) => Math.max(1, p - 1))} disabled={deptPage <= 1} className="w-full sm:w-auto px-4 py-2 border text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50">Previous</button>
            <span className="px-4 py-2 text-sm text-gray-700">Page {deptPage} of {deptTotalPages}</span>
            <button onClick={() => setDeptPage((p) => Math.min(deptTotalPages, p + 1))} disabled={deptPage >= deptTotalPages} className="w-full border sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50">Next</button>
          </div>
          </div>

          <div className="border-t md:hidden border-gray-200 px-4 md:px-6 py-4 flex items-center justify-center gap-2">
            <button onClick={() => setDeptPage((p) => Math.max(1, p - 1))} disabled={deptPage <= 1} className="w-full border sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 flex items-center justify-center hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"><FaChevronLeft /></button>
            <span className="px-4 py-2 text-sm w-full text-center text-gray-700"> {deptPage} of {deptTotalPages}</span>
            <button onClick={() => setDeptPage((p) => Math.min(deptTotalPages, p + 1))} disabled={deptPage >= deptTotalPages} className="w-full border sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 flex items-center justify-center hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"><FaChevronRight /></button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fdfdfd] pl-20">
      <div className='bg-white py-6'>
        <div className="flex flex-col md:flex-row items-start md:items-center max-w-7xl mx-auto justify-between gap-4">
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><ArrowLeft className="w-5 h-5" /></button>
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Employee Management</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => { setEditingEmployee(null); setModalOpen(true); }} className="flex items-center gap-2 btn-primary py-3 rounded-lg transition-colors text-sm md:text-base whitespace-nowrap">
              <Plus className="w-4 h-4" /><span className="hidden sm:inline">Add New Employee</span><span className="sm:hidden">Add</span>
            </button>

            <button onClick={handleExport} className="flex items-center gap-2 px-3 md:px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base whitespace-nowrap">
              <Download className="w-4 h-4" /><span className="hidden sm:inline">Bulk Export</span><span className="sm:hidden">Export</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl bg-white border py-10 mt-10 rounded-lg lg:px-6 p-3 mx-auto">
        <div className="mb-6">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-2">
            <h2 className="text-base md:text-lg font-semibold lg:border-r-2 border-gray-300 col-span-2 lg:col-span-1 text-gray-900">Employee Database</h2>
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-2 lg:border-r-2 border-gray-300 last:border-r-0">
                <div className="rounded-md text-white px-2 py-2 primary flex items-center justify-center flex-shrink-0">
                  <stat.icon className=" text-2xl" />
                </div>
                <div><p className="text-xs md:text-sm text-gray-600">{stat.label}</p></div>
                <p className="text-sm md:text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          {TAB_DEFS.map((t) => (
            <button key={t.key} type="button" onClick={() => handleTabChange(t.key)} role="tab" aria-selected={activeTab === t.key} className={`px-4 md:px-6 py-2.5 rounded-lg font-medium transition-colors whitespace-nowrap text-sm md:text-base ${activeTab === t.key ? 'btn-primary' : 'btn-secondary'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {renderTabContent()}
      </div>

      {/* Employee Delete Modal */}
      {showDeleteConfirm && employeeToDelete && (
  <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">
    <div className="bg-white rounded-xl shadow-lg w-full max-w-md relative">
      <div className="flex items-center btn-primary rounded-t-xl  gap-3">
                  <div className="w-12 h-12  b rounded-full flex items-center justify-center overflow-hidden">
                    {employeeToDelete?.photoUrl ? (
                      <img src={employeeToDelete.photoUrl} alt={employeeToDelete.name} className="w-full h-full object-cover" />
                    ) : (
                      <Users className=" bg-white rounded-full p-1 text-indigo-600" />
                    )}
                  </div>
                  <div className="flex-1 ">
                    <h3 className="font-semibold text-lg">{employeeToDelete?.name}</h3>
                    <p className="text-sm ">{employeeToDelete?.role} | {employeeToDelete?.designation}</p>
                  </div>
                  
                </div>

      {/* CLOSE ICON */}
      <button
        onClick={() => {
          setShowDeleteConfirm(false);
          setEmployeeToDelete(null);
          setDeleteSuccess(false);
        }}
        className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
      >
        <X className="w-5 h-5 text-white" />
      </button>

      <div className="px-6 py-4 ">
        <h3 className="text-lg font-semibold text-gray-900 text-center">
          {deleteSuccess ? 'Deleted Successfully' : 'Confirm Delete'}
        </h3>
      </div>

      <div className="px-6 pb-6">
        {deleteSuccess ? (
          <div className="flex flex-col items-center text-center gap-3">
            <img
              src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/delete%201.png"
              className="h-16"
              alt=""
            />

            <p className="text-sm text-gray-700">
              <strong>{employeeToDelete.name}</strong> has been deleted successfully.
            </p>

            <p className="text-xs text-gray-500">
              This action cannot be undone.
            </p>
          </div>
        ) : (
          <>

           <div className='flex justify-center items-center mb-4'>
            <img
              src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/delete%201.png"
              className="h-16"
              alt=""
            />

           </div>
           <p className='text-lg text-center mb-2'>{employeeToDelete.name} | {employeeToDelete.designation} </p>
            <p className="text-sm text-center text-gray-700 mb-4">
              Are you sure you want to permanently delete this employee {employeeToDelete.name}?
            </p>

            {/* <div className="text-sm text-gray-800 mb-3">
              <div><strong>Name:</strong> {employeeToDelete.name}</div>
              <div><strong>ID:</strong> {employeeToDelete._id}</div>
            </div> */}

            {deleteError && (
              <div className="text-sm text-center text-red-600 mb-3">
                {deleteError}
              </div>
            )}

            <div className="flex w-[60%] mx-auto gap-3">
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="flex-1 btn-primary text-white px-4 py-2 rounded-lg"
              >
                {deleting ? 'Deleting...' : 'Confirm '}
              </button>

              <button
                onClick={cancelDelete}
                disabled={deleting}
                className="flex-1 border px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  </div>
)}


      {/* Department Delete Modal */}
    {showDeptDeleteConfirm && deptToDelete && (
  <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4">
    <div className="bg-white rounded-xl shadow-lg w-full max-w-md relative">

      {/* CLOSE ICON */}
      <button
        onClick={() => {
          setShowDeptDeleteConfirm(false);
          setDeptToDelete(null);
          setDeptDeleteSuccess(false);
        }}
        className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
      >
        <X className="w-5 h-5" />
      </button>

      {/* <div className="px-6 py-4 ">
        <h3 className="text-lg font-semibold text-gray-900 text-center">
          {deptDeleteSuccess ? 'Deleted Successfully' : 'Confirm Delete'}
        </h3>
      </div> */}

      <div className="p-6">
        {deptDeleteSuccess ? (
          <div className="flex flex-col items-center gap-3 text-center">
            <img
              src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/delete%201.png"
              className="h-16"
              alt=""
            />
            <p className="text-lg text-gray-700">
              Department deleted successfully.
            </p>
          </div>
        ) : (
          <>
           <div className='flex items-center justify-center mb-4'>
            <img
              src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/delete%201.png"
              className="h-16"
              alt=""
            />
           
           </div>
            <div>
              <p className='text-lg  text-center mb-2'>{deptToDelete.name} | {deptToDelete.departmentCode }</p>
            </div>
            <p className="text-sm text-center text-gray-700 mb-4">
              Are you sure you want to permanently delete this department <strong>{deptToDelete.name}</strong>?
            </p>

            

            {deptDeleteError && (
              <div className="text-sm text-red-600 mb-3">
                {deptDeleteError}
              </div>
            )}

            <div className="flex w-[60%] mx-auto gap-3">
              <button
                onClick={confirmDeleteDept}
                disabled={deletingDept}
                className="flex-1 btn-primary text-white px-4 py-2 rounded-lg"
              >
                {deletingDept ? 'Deleting...' : 'Confirm'}
              </button>

              <button
                onClick={cancelDeleteDept}
                disabled={deletingDept}
                className="flex-1 border px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  </div>
)}



      <AddEmployeeModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditingEmployee(null); }} initialData={editingEmployee} onEmployeeAdded={() => handleRefreshAfterSave()} onEmployeeUpdated={() => handleRefreshAfterSave()} />

<AddDepartmentModal
  open={open}
  onClose={() => setOpen(false)}
  onSubmit={handleDepartmentRefresh}
  onUpdate={handleDepartmentRefresh}
  initialData={setDepartments}
/>







    </div>
  );
};

export default EmployeeManagement;
