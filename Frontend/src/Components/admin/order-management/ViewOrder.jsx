import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Package, 
  Calendar, 
  DollarSign, 
  User, 
  Building, 
  Mail, 
  Phone, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Download,
  Eye,
  RefreshCw,
  Layers,
  ShieldCheck,
  Award,
  FileBarChart,
  Check,
  UserCheck,
  Info,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  File,
  Hash,
  Type,
  Radio,
  CheckSquare,
  CalendarDays,
  MapPin,
  Globe,
  CreditCard,
  BarChart,
  PieChart,
  TrendingUp
} from 'lucide-react';
import axiosInstance from '@src/providers/axiosInstance';

export default function ViewOrder() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedFields, setExpandedFields] = useState({});
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    fetchOrderDetails();
  }, [applicationId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axiosInstance.get(
        `https://insightsconsult-backend.onrender.com/application/${applicationId}`
      );
      
      if (response.data.success) {
        setOrder(response.data.application);
      } else {
        setError('Failed to load order details');
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError('Error loading order details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFieldType = (value) => {
    if (typeof value === 'object' && value !== null) {
      if (value.url && value.sizeInMb) return 'file';
      return 'object';
    }
    if (typeof value === 'string') {
      if (value.includes('@') && value.includes('.')) return 'email';
      if (!isNaN(value) && value.trim() !== '') return 'number';
      if (value.match(/^\d{10}$/)) return 'phone';
      if (value.match(/^\d{12}$/)) return 'aadhar';
      if (value.match(/^[A-Z]{5}\d{4}[A-Z]$/)) return 'pan';
      if (value.match(/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/)) return 'gst';
      return 'text';
    }
    if (typeof value === 'boolean') return 'boolean';
    return 'text';
  };

  const renderFieldValue = (key, value) => {
    const type = getFieldType(value);
    
    switch (type) {
      case 'file':
        return (
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-50 rounded-lg">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <a 
                href={value.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-dark font-medium flex items-center gap-2"
              >
                View File
                <ExternalLink size={14} />
              </a>
              <p className="text-xs text-gray-500 mt-1">
                Size: {(parseFloat(value.sizeInMb) || 0).toFixed(2)} MB
              </p>
            </div>
            <a 
              href={value.url} 
              download
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Download"
            >
              <Download size={18} className="text-gray-500" />
            </a>
          </div>
        );
      
      case 'email':
        return (
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-gray-400" />
            <a href={`mailto:${value}`} className="text-primary hover:underline">
              {value}
            </a>
          </div>
        );
      
      case 'phone':
        return (
          <div className="flex items-center gap-2">
            <Phone size={16} className="text-gray-400" />
            <a href={`tel:${value}`} className="text-gray-700">
              {value}
            </a>
          </div>
        );
      
      case 'pan':
      case 'aadhar':
      case 'gst':
        return (
          <div className="font-mono bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
            {value}
          </div>
        );
      
      case 'number':
        return (
          <div className="flex items-center gap-2">
            <Hash size={16} className="text-gray-400" />
            <span className="font-medium">{value}</span>
          </div>
        );
      
      case 'boolean':
        return (
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${value ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
            {value ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
            {value ? 'Yes' : 'No'}
          </div>
        );
      
      default:
        return (
          <div className="text-gray-700 whitespace-pre-wrap">
            {value}
          </div>
        );
    }
  };

  const renderFormData = () => {
    if (!order?.formData) return null;
    
    const fields = Object.entries(order.formData);
    
    return (
      <div className="space-y-4">
        {fields.map(([key, value]) => (
          <div key={key} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setExpandedFields(prev => ({
                ...prev,
                [key]: !prev[key]
              }))}
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  {getFieldType(value) === 'file' ? <FileText size={18} /> :
                   getFieldType(value) === 'email' ? <Mail size={18} /> :
                   getFieldType(value) === 'phone' ? <Phone size={18} /> :
                   getFieldType(value) === 'number' ? <Hash size={18} /> :
                   <Type size={18} />}
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-gray-900">Field: {key}</h4>
                  <p className="text-xs text-gray-500 capitalize">
                    Type: {getFieldType(value)}
                  </p>
                </div>
              </div>
              {expandedFields[key] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            
            {expandedFields[key] && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                {renderFieldValue(key, value)}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderServicePeriods = () => {
    if (!order?.servicePeriod?.length) return null;
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {order.servicePeriod.map((period, index) => (
            <div key={period.periodId} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-900">{period.periodLabel}</h4>
                  <p className="text-xs text-gray-500">Period {index + 1}</p>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  period.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' :
                  period.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700' :
                  'bg-amber-50 text-amber-700'
                }`}>
                  {period.status}
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Created: {formatDate(period.createdAt)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 mb-4">
            <AlertCircle className="w-8 h-8 text-rose-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{error || 'Order not found'}</h3>
          <p className="text-gray-600 mb-6">The order you're looking for doesn't exist or cannot be loaded.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center gap-2 mx-auto"
          >
            <ArrowLeft size={18} />
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
                <p className="text-sm text-gray-600">ID: {order.applicationId}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={fetchOrderDetails}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
              <button
                className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center gap-2"
              >
                <Download size={16} />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('details')}
                className={`py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'details'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Order Details
              </button>
              <button
                onClick={() => setActiveTab('form')}
                className={`py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'form'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Form Data ({Object.keys(order.formData || {}).length})
              </button>
              <button
                onClick={() => setActiveTab('periods')}
                className={`py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'periods'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Service Periods ({order.servicePeriod?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('activity')}
                className={`py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'activity'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Activity Log
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            {/* Service Info Card */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                  {/* Service Image */}
                  <div className="flex-shrink-0">
                    <div className="w-64 h-48 rounded-lg overflow-hidden bg-gray-100">
                      {order.service?.photoUrl ? (
                        <img 
                          src={order.service.photoUrl} 
                          alt={order.service.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Service Details */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{order.service?.name}</h2>
                        <p className="text-gray-600 mb-4">{order.service?.description}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className={`px-4 py-2 rounded-lg font-medium ${
                          order.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700' :
                          order.status === 'ASSIGNED' ? 'bg-blue-50 text-blue-700' :
                          'bg-amber-50 text-amber-700'
                        }`}>
                          {order.status}
                        </div>
                        <div className="text-2xl font-bold text-gray-900">
                          ₹{order.service?.finalIndividualPrice || '0.00'}
                        </div>
                      </div>
                    </div>

                    {/* Service Metadata */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar size={18} className="text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">Service Type</span>
                        </div>
                        <p className="font-semibold">{order.service?.serviceType}</p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <RefreshCw size={18} className="text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">Frequency</span>
                        </div>
                        <p className="font-semibold">{order.service?.frequency || 'One-time'}</p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock size={18} className="text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">Duration</span>
                        </div>
                        <p className="font-semibold">
                          {order.service?.duration} {order.service?.durationUnit}
                        </p>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <ShieldCheck size={18} className="text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">GST</span>
                        </div>
                        <p className="font-semibold">
                          {order.service?.isGstApplicable === 'true' ? 
                            `${order.service?.gstPercentage || '18'}%` : 'Not Applicable'}
                        </p>
                      </div>
                    </div>

                    {/* Pricing Breakdown */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">Pricing Breakdown</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Base Price:</span>
                          <span>₹{order.service?.individualPrice || '0.00'}</span>
                        </div>
                        {order.service?.isGstApplicable === 'true' && (
                          <>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">GST ({order.service?.gstPercentage || '18'}%):</span>
                              <span>₹{(parseFloat(order.service?.individualPrice || 0) * parseFloat(order.service?.gstPercentage || 0) / 100).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Offer Discount:</span>
                              <span className="text-emerald-600">-₹{(parseFloat(order.service?.individualPrice || 0) - parseFloat(order.service?.finalIndividualPrice || 0)).toFixed(2)}</span>
                            </div>
                          </>
                        )}
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between font-semibold">
                            <span>Total Amount:</span>
                            <span>₹{order.service?.finalIndividualPrice || '0.00'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Assignment Info Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Assignment Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Admin Notes */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <FileText size={18} />
                    Admin Notes
                  </h4>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <p className="text-amber-800">{order.adminNote || 'No notes provided'}</p>
                  </div>
                </div>

                {/* Assigned Employee */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <UserCheck size={18} />
                    Assigned Employee
                  </h4>
                  {order.employee ? (
                    <div className="flex items-center gap-4 p-4 bg-primary-50 border border-primary-200 rounded-lg">
                      <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
                        <User className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <h5 className="font-bold text-gray-900">{order.employee.name}</h5>
                        <p className="text-sm text-gray-600">Employee ID: {order.employee.employeeId}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 border border-gray-300 rounded-lg text-center">
                      <p className="text-gray-600">No employee assigned yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Timeline Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Order Timeline</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">Order Created</h4>
                    <p className="text-sm text-gray-600 mb-2">Order was successfully placed</p>
                    <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                </div>

                {order.updatedAt && order.updatedAt !== order.createdAt && (
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <RefreshCw className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">Last Updated</h4>
                      <p className="text-sm text-gray-600 mb-2">Order details were updated</p>
                      <p className="text-xs text-gray-500">{formatDate(order.updatedAt)}</p>
                    </div>
                  </div>
                )}

                {order.employee && (
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <UserCheck className="w-5 h-5 text-purple-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">Assigned to Employee</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Assigned to {order.employee.name} (ID: {order.employee.employeeId})
                      </p>
                      <p className="text-xs text-gray-500">Assignment time recorded</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'form' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Form Data</h3>
              <p className="text-gray-600">
                Customer submitted information for this order ({Object.keys(order.formData || {}).length} fields)
              </p>
            </div>
            {renderFormData()}
          </div>
        )}

        {activeTab === 'periods' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Service Periods</h3>
              <p className="text-gray-600">
                {order.servicePeriod?.length || 0} service periods for this recurring order
              </p>
            </div>
            {renderServicePeriods()}
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Activity Log</h3>
              <p className="text-gray-600">Track all activities for this order</p>
            </div>
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Info className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Activity Logs Available</h4>
              <p className="text-gray-600">Activity tracking will be available soon.</p>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center gap-2">
                <Mail size={16} />
                Email Customer
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Download size={16} />
                Download All Files
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                <FileText size={16} />
                Generate Invoice
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                <RefreshCw size={16} />
                Reassign Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}