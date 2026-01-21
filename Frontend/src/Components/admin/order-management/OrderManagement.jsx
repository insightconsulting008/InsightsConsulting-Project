import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  ExternalLink,
  Package,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Filter,
  Eye,
  Users,
  MessageSquare,
  Phone,
  HelpCircle,
  BarChart,
  CalendarClock,
  DollarSign,
  Headphones,
  Sparkles,
  MoreHorizontal,
  User,
  Building,
  Mail,
  FileText,
  Calendar,
  Layers,
  ShieldCheck,
  Award,
  FileBarChart,
  Check,
  UserCheck,
  RefreshCw
} from 'lucide-react';
import axiosInstance from '@src/providers/axiosInstance';

export default function OrderManagement() {
  // State Management
  const [applications, setApplications] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showAssignPanel, setShowAssignPanel] = useState(false);
  const [showTicketInfo, setShowTicketInfo] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [remarks, setRemarks] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [reassigning, setReassigning] = useState(false);
  const [assignError, setAssignError] = useState('');
  const [showReassignSection, setShowReassignSection] = useState(false);
  const itemsPerPage = 50;

  // Status colors
  const statusColors = {
    PENDING: { 
      bg: "bg-amber-50", 
      text: "text-amber-800", 
      border: "border-amber-200", 
      icon: Clock, 
      iconColor: "text-amber-600",
      label: "Unassigned"
    },
    ASSIGNED: { 
      bg: "bg-primary-50", 
      text: "text-primary-800", 
      border: "border-primary-200", 
      icon: UserCheck, 
      iconColor: "text-primary-600",
      label: "Assigned"
    },
    COMPLETED: { 
      bg: "bg-emerald-50", 
      text: "text-emerald-800", 
      border: "border-emerald-200", 
      icon: CheckCircle, 
      iconColor: "text-emerald-600",
      label: "Completed"
    }
  };

  // Fetch Applications on Mount
  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('https://insightsconsult-backend.onrender.com/applications');
      if (response.data.success) {
        setApplications(response.data.applications);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axiosInstance.get('https://insightsconsult-backend.onrender.com/admin/employees/assignable?page=1&limit=100');
      if (response.data.success) {
        setEmployees(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleAssignClick = (order) => {
    setSelectedOrder(order);
    setShowAssignPanel(true);
    setShowTicketInfo(false);
    setSelectedEmployee(null);
    setRemarks('');
    setAssignError('');
    fetchEmployees();
  };

  const handleViewTicket = (order) => {
    setSelectedOrder(order);
    setShowTicketInfo(true);
    setShowAssignPanel(false);
    setShowReassignSection(false);
  };

  const handleReassignClick = () => {
    setShowReassignSection(true);
    setSelectedEmployee(null);
    setRemarks('');
    setAssignError('');
    fetchEmployees();
  };

  const handleAssignOrder = async (isReassign = false) => {
    if (!selectedEmployee) {
      setAssignError('Please select an employee');
      return;
    }
    
    if (!selectedOrder) {
      setAssignError('No order selected');
      return;
    }

    if (isReassign) {
      setReassigning(true);
    } else {
      setAssigning(true);
    }
    
    setAssignError('');

    try {
      const assignmentData = {
        employeeId: selectedEmployee.employeeId,
        adminNote: remarks || "This is a priority client. Please request documents and complete."
      };

      const endpoint = isReassign 
        ? `https://insightsconsult-backend.onrender.com/admin/applications/${selectedOrder.applicationId}/reassign`
        : `https://insightsconsult-backend.onrender.com/admin/applications/${selectedOrder.applicationId}/assign`;

      const response = await axiosInstance.post(endpoint, assignmentData);

      if (response.data.success) {
        setShowAssignPanel(false);
        setShowReassignSection(false);
        await fetchApplications();
      } else {
        setAssignError(response.data.message || `Failed to ${isReassign ? 'reassign' : 'assign'} order`);
      }
    } catch (error) {
      console.error(`Error ${isReassign ? 'reassigning' : 'assigning'} order:`, error);
      setAssignError(error.response?.data?.message || `Failed to ${isReassign ? 'reassign' : 'assign'} order. Please try again.`);
    } finally {
      if (isReassign) {
        setReassigning(false);
      } else {
        setAssigning(false);
      }
    }
  };

  const closeAllPanels = () => {
    setShowAssignPanel(false);
    setShowTicketInfo(false);
    setShowReassignSection(false);
  };

  // Statistics
  const stats = {
    total: applications.length,
    incoming: applications.filter(app => app.status === 'PENDING').length,
    assigned: applications.filter(app => app.status === 'ASSIGNED').length
  };

  // Filtering Logic
  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.applicationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (app.clientName && app.clientName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'All' || 
                         (statusFilter === 'Unassigned' && app.status === 'PENDING') ||
                         (statusFilter === 'Assigned' && app.status === 'ASSIGNED');
    return matchesSearch && matchesStatus;
  });

  // Employee Filtering
  const departments = ['All', ...new Set(employees.map(emp => emp.department?.name).filter(Boolean))];
  
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
                         emp.email.toLowerCase().includes(employeeSearch.toLowerCase());
    const matchesDepartment = selectedDepartment === 'All' || emp.department?.name === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  // Pagination
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApplications = filteredApplications.slice(startIndex, endIndex);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Format time
  const formatTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Status Badge Component
  const StatusBadge = ({ status }) => {
    const statusConfig = statusColors[status] || statusColors.PENDING;
    const Icon = statusConfig.icon;
    
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${statusConfig.border} ${statusConfig.bg}`}>
        <Icon size={14} className={statusConfig.iconColor} />
        <span className={`text-xs font-semibold ${statusConfig.text}`}>
          {statusConfig.label}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modals */}
      {showAssignPanel && (
        <div className={`fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white shadow-2xl z-50 transform transition-transform duration-300 border-l border-gray-200 translate-x-0`}>
          <AssignOrderPanel
            order={selectedOrder}
            employees={filteredEmployees}
            employeeSearch={employeeSearch}
            setEmployeeSearch={setEmployeeSearch}
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
            departments={departments}
            selectedEmployee={selectedEmployee}
            setSelectedEmployee={setSelectedEmployee}
            remarks={remarks}
            setRemarks={setRemarks}
            onAssign={() => handleAssignOrder(false)}
            onClose={() => setShowAssignPanel(false)}
            assigning={assigning}
            assignError={assignError}
            formatDate={formatDate}
            formatTime={formatTime}
          />
        </div>
      )}

      {showTicketInfo && (
        <div className={`fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white shadow-2xl z-50 transform transition-transform duration-300 border-l border-gray-200 translate-x-0`}>
          <TicketInfoPanel
            order={selectedOrder}
            onClose={() => setShowTicketInfo(false)}
            statusColors={statusColors}
            formatDate={formatDate}
            formatTime={formatTime}
            showReassignSection={showReassignSection}
            setShowReassignSection={setShowReassignSection}
            onReassignClick={handleReassignClick}
            employees={filteredEmployees}
            employeeSearch={employeeSearch}
            setEmployeeSearch={setEmployeeSearch}
            selectedDepartment={selectedDepartment}
            setSelectedDepartment={setSelectedDepartment}
            departments={departments}
            selectedEmployee={selectedEmployee}
            setSelectedEmployee={setSelectedEmployee}
            remarks={remarks}
            setRemarks={setRemarks}
            onReassign={() => handleAssignOrder(true)}
            reassigning={reassigning}
            assignError={assignError}
          />
        </div>
      )}

      {/* Overlay */}
      {(showAssignPanel || showTicketInfo) && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={closeAllPanels}
        ></div>
      )}

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary-50 rounded-lg">
              <Package className="text-primary" size={28} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Order Assignment</h1>
              <p className="text-gray-600 text-sm sm:text-base">Manage and assign client service requests</p>
            </div>
          </div>
        </div>

        {/* Stats Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {/* Total Orders */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Orders</p>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.total}</h3>
                <p className="text-xs text-gray-500 mt-2">All service requests</p>
              </div>
              <div className="p-3 bg-primary-50 rounded-lg">
                <Package className="text-primary" size={28} />
              </div>
            </div>
          </div>

          {/* Incoming Orders */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Incoming Orders</p>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.incoming}</h3>
                <p className="text-xs text-gray-500 mt-2">Awaiting assignment</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <Clock className="text-amber-600" size={28} />
              </div>
            </div>
          </div>

          {/* Assigned Orders */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Assigned Orders</p>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.assigned}</h3>
                <p className="text-xs text-gray-500 mt-2">Currently in progress</p>
              </div>
              <div className="p-3 bg-primary-50 rounded-lg">
                <UserCheck className="text-primary" size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Filters and Orders List */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {/* Tab Filters */}
          <div className="px-4 sm:px-6 pt-6">
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setStatusFilter('All')}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  statusFilter === 'All' 
                    ? 'bg-primary text-white border-primary' 
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                }`}
              >
                All Orders ({applications.length})
              </button>
              <button
                onClick={() => setStatusFilter('Unassigned')}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  statusFilter === 'Unassigned' 
                    ? 'bg-amber-50 text-amber-800 border-amber-300' 
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                }`}
              >
                Unassigned ({stats.incoming})
              </button>
              <button
                onClick={() => setStatusFilter('Assigned')}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                  statusFilter === 'Assigned' 
                    ? 'bg-primary-50 text-primary-800 border-primary-300' 
                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                }`}
              >
                Assigned ({stats.assigned})
              </button>
            </div>

            {/* Search and Actions Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <div className="relative w-full sm:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size={20} />
                  <input
                    type="text"
                    placeholder="Search orders by service, ID, or client..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2.5 border border-gray-300 bg-white text-sm rounded-lg focus:ring-2 focus:ring-primary focus:border-primary w-full sm:w-64 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {statusFilter === 'Unassigned' && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg text-sm border border-amber-200">
                    Status: Unassigned
                    <X 
                      className="w-4 h-4 cursor-pointer hover:text-amber-900" 
                      onClick={() => setStatusFilter('All')} 
                    />
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="hidden sm:inline">
                    {startIndex + 1}-{Math.min(endIndex, filteredApplications.length)} of {filteredApplications.length}
                  </span>
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="p-1.5 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="p-1.5 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Orders List */}
          <div className="px-4 sm:px-6 pb-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 sm:py-32">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="mt-4 text-gray-600 text-lg font-medium">Loading orders...</p>
                <p className="text-gray-500 text-sm mt-2">Please wait while we fetch order details</p>
              </div>
            ) : currentApplications.length === 0 ? (
              <div className="text-center py-12 sm:py-24 bg-gray-50 rounded-lg border border-gray-100">
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gray-100 mb-6">
                  <Search className="text-gray-400" size={32} />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">No orders found</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-6 sm:mb-8 text-sm sm:text-base">
                  {searchTerm || statusFilter !== 'All' 
                    ? "No orders match your current search criteria." 
                    : "No orders available at the moment."}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  {searchTerm || statusFilter !== 'All' ? (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setStatusFilter("All");
                      }}
                      className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
                    >
                      <Filter size={18} />
                      Clear All Filters
                    </button>
                  ) : null}
                  <button
                    onClick={() => window.location.href = '/help'}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <HelpCircle size={18} />
                    Get Help
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {currentApplications.map((app) => (
                  <OrderCard 
                    key={app.applicationId} 
                    application={app}
                    onAssign={handleAssignClick}
                    onView={handleViewTicket}
                    statusColors={statusColors}
                    formatDate={formatDate}
                    formatTime={formatTime}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredApplications.length > itemsPerPage && (
            <div className="px-4 sm:px-6 py-4 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredApplications.length)} of {filteredApplications.length} orders
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                      currentPage === 1
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                    }`}
                  >
                    <ChevronLeft size={18} />
                    <span className="hidden sm:inline">Previous</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {(() => {
                      const pages = [];
                      const maxVisiblePages = 5;
                      
                      if (totalPages <= maxVisiblePages) {
                        for (let i = 1; i <= totalPages; i++) {
                          pages.push(i);
                        }
                      } else {
                        if (currentPage <= 3) {
                          pages.push(1, 2, 3, 4, '...', totalPages);
                        } else if (currentPage >= totalPages - 2) {
                          pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
                        } else {
                          pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
                        }
                      }
                      
                      return pages.map((pageNum, index) => (
                        pageNum === '...' ? (
                          <span key={`dots-${index}`} className="px-3 py-2 text-gray-400">
                            <MoreHorizontal size={16} />
                          </span>
                        ) : (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`min-w-[36px] h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                              currentPage === pageNum
                                ? 'bg-primary text-white'
                                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      ));
                    })()}
                  </div>

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                      currentPage === totalPages
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                    }`}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Support Section */}
        {!loading && filteredApplications.length > 0 && (
          <div className="mt-8">
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="p-6 sm:p-8">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary-50 rounded-lg">
                      <Users size={24} className="text-primary" />
                    </div>
                    <div className="max-w-2xl">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Need Help with Order Assignment?</h3>
                      <p className="text-gray-600 mb-4 text-sm sm:text-base">
                        Our team is here to help you manage and assign orders efficiently. 
                        Get instant support via chat or phone.
                      </p>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span>Average response time: <span className="font-semibold">2 minutes</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span>Satisfaction rate: <span className="font-semibold">98%</span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center justify-center gap-2">
                      <MessageSquare size={20} />
                      Chat Now
                    </button>
                    <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                      <HelpCircle size={20} />
                      Help Center
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Order Card Component
function OrderCard({ application, onAssign, onView, statusColors, formatDate, formatTime }) {
  const statusConfig = statusColors[application.status] || statusColors.PENDING;
  const Icon = statusConfig.icon;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
            <Package className="w-6 h-6 text-primary" />
          </div>
        </div>

        {/* Service Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-gray-900 text-base truncate">
                  {application.serviceName}
                </h3>
                <button 
                  onClick={() => onView(application)}
                  className="text-sm text-primary hover:text-primary-dark font-medium flex items-center gap-1"
                >
                  <Eye size={14} />
                  <span className="hidden sm:inline">View</span>
                </button>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-3">
                <span className="font-mono">ID: {application.applicationId.slice(0, 8)}</span>
               
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
              {/* Order ID */}
              <div className="text-center lg:text-right">
                <p className="text-xs text-gray-500 mb-1">Order ID</p>
                <p className="font-medium text-gray-900 text-sm truncate">{application.applicationId.slice(0, 10)}</p>
              </div>

              {/* Date & Time */}
              <div className="text-center lg:text-right">
                <p className="text-xs text-gray-500 mb-1">Date & Time</p>
                <p className="font-medium text-gray-900 text-sm">
                  <span className="block sm:inline">{formatDate(application.createdAt)}</span>
                  <span className="hidden sm:inline"> • </span>
                  <span className="block sm:inline">{formatTime(application.createdAt)}</span>
                </p>
              </div>

              {/* Order Value */}
              <div className="text-center lg:text-right">
                <p className="text-xs text-gray-500 mb-1">Order Value</p>
                <p className="font-bold text-gray-900">₹{application.amount || '590.00'}</p>
              </div>

              {/* Status and Action */}
              <div className="flex flex-col items-center lg:items-end gap-2">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border ${statusConfig.border} ${statusConfig.bg}`}>
                  <Icon size={12} className={statusConfig.iconColor} />
                  <span className={`text-xs font-semibold ${statusConfig.text}`}>
                    {statusConfig.label}
                  </span>
                </div>
                
                {application.status === 'PENDING' ? (
                  <button 
                    onClick={() => onAssign(application)}
                    className="w-full px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <Sparkles size={14} />
                    Assign
                  </button>
                ) : (
                  <button 
                    onClick={() => onView(application)}
                    className="w-full px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <Eye size={14} />
                    View Details
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Assign Order Panel Component
function AssignOrderPanel({ 
  order, 
  employees, 
  employeeSearch, 
  setEmployeeSearch,
  selectedDepartment,
  setSelectedDepartment,
  departments,
  selectedEmployee,
  setSelectedEmployee,
  remarks,
  setRemarks,
  onAssign, 
  onClose,
  assigning,
  assignError,
  formatDate,
  formatTime
}) {

  return (
    <>
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-primary font-medium text-sm hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors"
          >
            <X size={20} />
            Close
          </button>

          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark border border-primary shadow-sm transition-colors">
            <Phone size={16} />
            Call Expert
          </button>
        </div>
      </div>

      <div className="h-[calc(100vh-64px)] overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package size={20} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Order Details</span>
              </div>
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-amber-200 bg-amber-50`}>
                <Clock size={14} className="text-amber-600" />
                <span className={`text-xs font-semibold text-amber-800`}>
                  Unassigned
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500 font-mono tracking-wide">
              ID: {order?.applicationId}
            </p>
          </div>

          <div className="rounded-xl overflow-hidden border border-gray-200">
            <div className="w-full h-48 bg-primary-50 flex items-center justify-center">
              <Package className="w-16 h-16 text-primary/50" />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">
              {order?.serviceName}
            </h2>
            <p className="text-gray-600">
              Client: {order?.clientName || 'Aswinth R'}
            </p>
            
            <div className="flex flex-wrap gap-2">
              <div className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium border border-gray-200 flex items-center gap-1">
                <Calendar size={12} />
                {formatDate(order?.createdAt)} • {formatTime(order?.createdAt)}
              </div>
              <div className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-xs font-medium border border-primary-200 flex items-center gap-1">
                <DollarSign size={12} />
                ₹{order?.amount || '590.00'}
              </div>
            </div>
          </div>

          {/* Employee Selection Section */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Users size={18} className="text-gray-500" />
                Assign to Employee
              </h3>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-bold text-primary">{employees.length}</span>
                <span className="text-sm text-gray-500">Available</span>
              </div>
            </div>

            {/* Employee Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={employeeSearch}
                onChange={(e) => setEmployeeSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white transition-all"
              />
            </div>

            {/* Department Filters */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
              {departments.map(dept => (
                <button
                  key={dept}
                  onClick={() => setSelectedDepartment(dept)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedDepartment === dept
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>

            {/* Employee List */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {employees.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">No employees found</p>
                  <p className="text-sm text-gray-400 mt-1">Try changing your search or department filter</p>
                </div>
              ) : (
                employees.map((employee) => (
                  <div
                    key={employee.employeeId}
                    onClick={() => setSelectedEmployee(employee)}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors border ${
                      selectedEmployee?.employeeId === employee.employeeId
                        ? 'bg-primary-50 border-primary-300'
                        : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedEmployee?.employeeId === employee.employeeId}
                      onChange={() => {}}
                      className="w-5 h-5 text-primary rounded focus:ring-primary cursor-pointer"
                    />
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <img
                        src={employee.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=2563eb&color=fff`}
                        alt={employee.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{employee.name}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          {employee.department?.name && (
                            <>
                              <Building size={10} />
                              <span>{employee.department.name}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Priority Selection */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Notes
              </label>
              <textarea 
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white resize-none"
                rows="3"
                placeholder="Add instructions or notes for the employee..."
              />
            </div>
          </div>

          {/* Error Message */}
          {assignError && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                <p className="text-rose-700 text-sm">{assignError}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-200 pb-6">
            <div className="space-y-3">
              <button
                onClick={onAssign}
                disabled={!selectedEmployee || assigning}
                className="w-full py-3.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {assigning ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Assigning...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Assign Order
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Ticket Info Panel Component
function TicketInfoPanel({ 
  order, 
  onClose, 
  statusColors, 
  formatDate, 
  formatTime,
  showReassignSection,
  setShowReassignSection,
  onReassignClick,
  employees,
  employeeSearch,
  setEmployeeSearch,
  selectedDepartment,
  setSelectedDepartment,
  departments,
  selectedEmployee,
  setSelectedEmployee,
  remarks,
  setRemarks,
  onReassign,
  reassigning,
  assignError
}) {
  const statusConfig = statusColors[order?.status] || statusColors.PENDING;

  return (
    <>
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-primary font-medium text-sm hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} />
            Back
          </button>

          <button className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark border border-primary shadow-sm transition-colors">
            <Phone size={16} />
            Call Expert
          </button>
        </div>
      </div>

      <div className="h-[calc(100vh-64px)] overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package size={20} className="text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Order Details</span>
              </div>
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${statusConfig.border} ${statusConfig.bg}`}>
                <statusConfig.icon size={14} className={statusConfig.iconColor} />
                <span className={`text-xs font-semibold ${statusConfig.text}`}>
                  {statusConfig.label}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-500 font-mono tracking-wide">
              ID: {order?.applicationId}
            </p>
          </div>

          <div className="rounded-xl overflow-hidden border border-gray-200">
            <div className="w-full h-48 bg-primary-50 flex items-center justify-center">
              <Package className="w-16 h-16 text-primary/50" />
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">
              {order?.serviceName}
            </h2>
            <p className="text-gray-600">
              Client: {order?.clientName || 'Aswinth R'}
            </p>
            
            <div className="flex flex-wrap gap-2">
              <div className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium border border-gray-200 flex items-center gap-1">
                <Calendar size={12} />
                {formatDate(order?.createdAt)} • {formatTime(order?.createdAt)}
              </div>
              <div className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-xs font-medium border border-primary-200 flex items-center gap-1">
                <DollarSign size={12} />
                ₹{order?.amount || '590.00'}
              </div>
            </div>
          </div>

          {/* Staff Assignment Section */}
          {!showReassignSection ? (
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <UserCheck size={18} className="text-gray-500" />
                  Assigned Staff
                </h3>
                {order?.status === 'ASSIGNED' && (
                  <button
                    onClick={onReassignClick}
                    className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center gap-2 text-sm"
                  >
                    <RefreshCw size={14} />
                    Reassign
                  </button>
                )}
              </div>
              
              {order?.assignedTo ? (
                <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50">
                  <img
                    src={order.assignedTo.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(order.assignedTo.name)}&background=2563eb&color=fff`}
                    alt={order.assignedTo.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{order.assignedTo.name}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      {order.assignedTo.department?.name && (
                        <>
                          <Building size={10} />
                          <span>{order.assignedTo.department.name}</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">ID: {order.assignedTo.employeeId}</p>
                  </div>
                  <div className="text-right">
                    <div className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium">
                      Assigned
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <User className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">No Staff Assigned</h4>
                  <p className="text-sm text-gray-500 mb-4">This order hasn't been assigned to any employee yet.</p>
                  <button
                    onClick={onReassignClick}
                    className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center gap-2 mx-auto"
                  >
                    <Sparkles size={14} />
                    Assign Now
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Reassign Section */
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <RefreshCw size={18} className="text-gray-500" />
                  Reassign Order
                </h3>
                <button
                  onClick={() => setShowReassignSection(false)}
                  className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                >
                  <ChevronLeft size={14} />
                  Back
                </button>
              </div>

              {/* Employee Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={employeeSearch}
                  onChange={(e) => setEmployeeSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white transition-all"
                />
              </div>

              {/* Department Filters */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {departments.map(dept => (
                  <button
                    key={dept}
                    onClick={() => setSelectedDepartment(dept)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                      selectedDepartment === dept
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>

              {/* Employee List */}
              <div className="space-y-3 max-h-64 overflow-y-auto mb-6">
                {employees.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500">No employees found</p>
                    <p className="text-sm text-gray-400 mt-1">Try changing your search or department filter</p>
                  </div>
                ) : (
                  employees.map((employee) => (
                    <div
                      key={employee.employeeId}
                      onClick={() => setSelectedEmployee(employee)}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors border ${
                        selectedEmployee?.employeeId === employee.employeeId
                          ? 'bg-primary-50 border-primary-300'
                          : 'bg-gray-50 hover:bg-gray-100 border-gray-200'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedEmployee?.employeeId === employee.employeeId}
                        onChange={() => {}}
                        className="w-5 h-5 text-primary rounded focus:ring-primary cursor-pointer"
                      />
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <img
                          src={employee.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=2563eb&color=fff`}
                          alt={employee.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{employee.name}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            {employee.department?.name && (
                              <>
                                <Building size={10} />
                                <span>{employee.department.name}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Admin Notes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reassignment Notes
                </label>
                <textarea 
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white resize-none"
                  rows="3"
                  placeholder="Add notes explaining why you're reassigning this order..."
                />
              </div>

              {/* Error Message */}
              {assignError && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg mb-6">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                    <p className="text-rose-700 text-sm">{assignError}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={onReassign}
                  disabled={!selectedEmployee || reassigning}
                  className="w-full py-3.5 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {reassigning ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Reassigning...
                    </>
                  ) : (
                    <>
                      <RefreshCw size={20} />
                      Reassign Order
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowReassignSection(false)}
                  className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">Purchase Date</div>
              <div className="font-medium text-sm">{formatDate(order?.createdAt)}</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="text-xs text-gray-500 mb-1">Service Type</div>
              <div className="font-medium text-sm">Standard Service</div>
            </div>
          </div>

          {/* Support Section */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Headphones size={18} className="text-primary" />
              <span>Need Help?</span>
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Our support team is here to assist you with any questions about this order.
            </p>
            <div className="space-y-2">
              <button className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center justify-center gap-2">
                <MessageSquare size={16} />
                Chat with Support
              </button>
              <button className="w-full border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <Phone size={16} />
                Call +91-9876543210
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}