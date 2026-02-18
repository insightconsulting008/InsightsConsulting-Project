import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "@src/providers/axiosInstance";
import {
  Package,
  Clock,
  Calendar,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Search,
  Eye,
  Layers,
  Hash,
  ChevronRight,
  UserCheck,
  X,
  Filter,
  MessageSquare,
  HelpCircle,
  ExternalLink
} from 'lucide-react';

export default function MyService() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get('staff/cmleq079l0005h71dkvbl3r6m/applications/');
      if (response.data.success) {
        setApplications(response.data.applications);
      } else {
        setApplications([]);
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load applications. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'ASSIGNED':
        return { 
          bg: 'bg-primary-50',
          text: 'text-primary-800',
          border: 'border-primary-200',
          icon: UserCheck,
          iconColor: 'text-primary-600',
          label: 'Assigned'
        };
      case 'IN_PROGRESS':
        return { 
          bg: 'bg-amber-50',
          text: 'text-amber-800',
          border: 'border-amber-200',
          icon: RefreshCw,
          iconColor: 'text-amber-600',
          label: 'In Progress'
        };
      case 'COMPLETED':
        return { 
          bg: 'bg-emerald-50',
          text: 'text-emerald-800',
          border: 'border-emerald-200',
          icon: CheckCircle,
          iconColor: 'text-emerald-600',
          label: 'Completed'
        };
      case 'PENDING':
        return { 
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          border: 'border-gray-200',
          icon: Clock,
          iconColor: 'text-gray-600',
          label: 'Pending'
        };
      default:
        return { 
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          border: 'border-gray-200',
          icon: AlertCircle,
          iconColor: 'text-gray-600',
          label: status
        };
    }
  };

  const getServiceTypeConfig = (type) => {
    switch (type) {
      case 'RECURRING':
        return {
          bg: 'bg-purple-50',
          text: 'text-purple-800',
          border: 'border-purple-200',
          label: 'Recurring'
        };
      case 'ONE_TIME':
        return {
          bg: 'bg-indigo-50',
          text: 'text-indigo-800',
          border: 'border-indigo-200',
          label: 'One Time'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          border: 'border-gray-200',
          label: type
        };
    }
  };

  const handleViewDetails = (applicationId) => {
    navigate(`/staff/service/${applicationId}`);
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.applicationId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.serviceName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading your services...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait while we fetch your data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-rose-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchApplications}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center gap-2 mx-auto"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary-50 rounded-lg">
                <Package className="text-primary" size={28} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Services</h1>
                <p className="text-gray-600 text-sm sm:text-base">Manage and track all your assigned service applications</p>
              </div>
            </div>
          </div>

          {/* Stats Panel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {/* Total Services */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Services</p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">{applications.length}</h3>
                  <p className="text-xs text-gray-500 mt-2">All assigned services</p>
                </div>
                <div className="p-3 bg-primary-50 rounded-lg">
                  <Package className="text-primary" size={28} />
                </div>
              </div>
            </div>

            {/* Assigned Services */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Assigned</p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {applications.filter(app => app.status === 'ASSIGNED').length}
                  </h3>
                  <p className="text-xs text-gray-500 mt-2">Currently assigned</p>
                </div>
                <div className="p-3 bg-primary-50 rounded-lg">
                  <UserCheck className="text-primary" size={28} />
                </div>
              </div>
            </div>

            {/* In Progress */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">In Progress</p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {applications.filter(app => app.status === 'IN_PROGRESS').length}
                  </h3>
                  <p className="text-xs text-gray-500 mt-2">Currently in progress</p>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg">
                  <RefreshCw className="text-amber-600" size={28} />
                </div>
              </div>
            </div>

            {/* Recurring Services */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Recurring</p>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {applications.filter(app => app.serviceType === 'RECURRING').length}
                  </h3>
                  <p className="text-xs text-gray-500 mt-2">Monthly/Yearly services</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Layers className="text-purple-600" size={28} />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {/* Search and Filters */}
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
                  All Services ({applications.length})
                </button>
                <button
                  onClick={() => setStatusFilter('ASSIGNED')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    statusFilter === 'ASSIGNED' 
                      ? 'bg-primary-50 text-primary-800 border-primary-300' 
                      : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                  }`}
                >
                  Assigned ({applications.filter(app => app.status === 'ASSIGNED').length})
                </button>
                <button
                  onClick={() => setStatusFilter('IN_PROGRESS')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    statusFilter === 'IN_PROGRESS' 
                      ? 'bg-amber-50 text-amber-800 border-amber-300' 
                      : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                  }`}
                >
                  In Progress ({applications.filter(app => app.status === 'IN_PROGRESS').length})
                </button>
                <button
                  onClick={() => setStatusFilter('COMPLETED')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    statusFilter === 'COMPLETED' 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                      : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                  }`}
                >
                  Completed ({applications.filter(app => app.status === 'COMPLETED').length})
                </button>
              </div>

              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                <div className="relative w-full sm:w-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size={20} />
                    <input
                      type="text"
                      placeholder="Search services by name or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2.5 border border-gray-300 bg-white text-sm rounded-lg focus:ring-2 focus:ring-primary focus:border-primary w-full sm:w-80 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Services List */}
            <div className="px-4 sm:px-6 pb-6">
              {filteredApplications.length === 0 ? (
                <div className="text-center py-12 sm:py-24 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="inline-flex items-center justify-center w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gray-100 mb-6">
                    <Search className="text-gray-400" size={32} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">No services found</h3>
                  <p className="text-gray-600 max-w-md mx-auto mb-6 sm:mb-8 text-sm sm:text-base">
                    {searchTerm || statusFilter !== 'All' 
                      ? "No services match your current search criteria." 
                      : "No services available at the moment."}
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
                  {filteredApplications.map((app) => {
                    const statusConfig = getStatusConfig(app.status);
                    const StatusIcon = statusConfig.icon;
                    const serviceTypeConfig = getServiceTypeConfig(app.serviceType);
                    
                    return (
                      <div key={app.applicationId} className="bg-white border border-gray-200 rounded-xl px-4 py-4 sm:px-6 hover:border-gray-300 transition">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 items-start sm:items-center gap-4 md:gap-6">
                          
                          {/* ICON + SERVICE NAME */}
                          <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex items-center gap-3">
                            <div className="w-10 h-10 sm:w-11 sm:h-11 bg-primary-50 rounded-full flex items-center justify-center shrink-0">
                              <Package className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                                {app.serviceName}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${serviceTypeConfig.bg} ${serviceTypeConfig.text} border ${serviceTypeConfig.border}`}>
                                  {serviceTypeConfig.label}
                                </div>
                                {app.totalPeriods > 0 && (
                                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-purple-50 text-purple-800 border border-purple-200">
                                    <Layers size={10} />
                                    {app.totalPeriods} periods
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* APPLICATION ID */}
                          <div className="col-span-1 sm:col-span-1 lg:col-span-2">
                            <p className="text-xs text-gray-500 mb-1">Application ID</p>
                            <p className="font-medium text-gray-900 text-sm truncate" title={app.applicationId}>
                              <span className="hidden sm:inline">{app.applicationId}</span>
                              <span className="sm:hidden">{app.applicationId.slice(0, 8)}...</span>
                            </p>
                          </div>

                          {/* STATUS */}
                          <div className="col-span-1 sm:col-span-1 lg:col-span-2">
                            <p className="text-xs text-gray-500 mb-1">Status</p>
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg border ${statusConfig.border} ${statusConfig.bg}`}>
                              <StatusIcon size={14} className={statusConfig.iconColor} />
                              <span className={`text-xs font-semibold ${statusConfig.text}`}>
                                {statusConfig.label}
                              </span>
                            </div>
                          </div>

                          {/* DATE */}
                          <div className="col-span-1 sm:col-span-2 lg:col-span-3">
                            <p className="text-xs text-gray-500 mb-1">Created Date</p>
                            <p className="font-medium text-gray-900 text-sm">
                              {formatDate(app.createdAt)}
                            </p>
                          </div>

                          {/* ACTIONS */}
                          <div className="col-span-1 sm:col-span-2 lg:col-span-2 lg:justify-self-end">
                            <div className="flex flex-col sm:flex-row gap-2">
                              <button
                                onClick={() => handleViewDetails(app.applicationId)}
                                className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition whitespace-nowrap flex items-center justify-center gap-2"
                              >
                                <Eye size={16} />
                                View Details
                              </button>
                              <button
                                onClick={() => window.open(`/staff/service/${app.applicationId}`, '_blank')}
                                className="w-full sm:w-auto px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition whitespace-nowrap flex items-center justify-center gap-2"
                              >
                                <ExternalLink size={16} />
                                New Tab
                              </button>
                            </div>
                          </div>

                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Support Section */}
            {filteredApplications.length > 0 && (
              <div className="mt-8">
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="p-6 sm:p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary-50 rounded-lg">
                          <MessageSquare size={24} className="text-primary" />
                        </div>
                        <div className="max-w-2xl">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">Need Help with Your Services?</h3>
                          <p className="text-gray-600 mb-4 text-sm sm:text-base">
                            Our team is here to help you manage your assigned services efficiently. 
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
      </div>
    </div>
  );
}