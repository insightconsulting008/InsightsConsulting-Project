import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from "@src/providers/axiosInstance";
import {
  ArrowLeft,
  Package,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  File,
  Image,
  FileText,
  FileSpreadsheet,
  FileArchive,
  FileAudio,
  FileVideo,
  Download,
  Eye,
  Copy,
  Printer,
  ExternalLink,
  DollarSign,
  Hash,
  Layers,
  RefreshCw,
  MessageSquare,
  HelpCircle,
  AlertTriangle,
  Info,
  Shield,
  Award,
  Phone,
  Mail,
  MapPin,
  Building,
  CreditCard,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
  Filter,
  Search,
  Users,
  BarChart,
  TrendingUp,
  Settings,
  Grid,
  List,
  Star,
  Bell,
  Heart,
  Check,
  XCircle,
  PlayCircle,
  PauseCircle,
  RotateCcw,
  Save,
  Edit,
  Trash2,
  Send,
  AlertOctagon
} from 'lucide-react';

export default function ViewDetails() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    formData: true,
    serviceInfo: true,
    periods: true,
    adminNotes: true,
    trackSteps: true
  });
  
  // Status update states
  const [updatingStepId, setUpdatingStepId] = useState(null);
  const [updateStatus, setUpdateStatus] = useState('');
  const [remarks, setRemarks] = useState('');
  const [description, setDescription] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  useEffect(() => {
    if (applicationId) {
      fetchApplicationDetails();
    }
  }, [applicationId]);

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(`staff/cmleq079l0005h71dkvbl3r6m/application/${applicationId}`);
      if (response.data.success) {
        setApplication(response.data.application);
      } else {
        setError('Failed to load application details');
      }
    } catch (err) {
      console.error('Error fetching application details:', err);
      setError('Failed to load application details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const updateStepStatus = async (stepId, isPeriodStep = false) => {
    if (!updateStatus) {
      alert('Please select a status');
      return;
    }

    if (updateStatus === 'ERROR' && !remarks.trim()) {
      alert('Please provide remarks for rejected status');
      return;
    }

    const updateData = {
      applicationTrackStepId: !isPeriodStep ? stepId : undefined,
      periodStepId: isPeriodStep ? stepId : undefined,
      description: description || `Status updated to ${updateStatus}`,
      updatedBy: "staff_user", // You can replace this with actual user data
      remarks: updateStatus === 'COMPLETED' ? null : remarks,
      status: updateStatus
    };

    console.log('Updating step with data:', JSON.stringify(updateData, null, 2));

    try {
      setUpdateLoading(true);
      setUpdateError(null);
      
      // Make API call
      const response = await axiosInstance.put(
        `/staff/update/step`,
        updateData
      );
      
      console.log('Update response:', response.data);
      
      if (response.data.success) {
        // Update local state based on whether it's a period step or application track step
        if (isPeriodStep) {
          setApplication(prev => {
            const updatedPeriods = prev.servicePeriod.map(period => ({
              ...period,
              periodStep: period.periodStep.map(step => 
                step.periodStepId === stepId
                  ? { 
                      ...step, 
                      status: updateStatus,
                      remarks: updateStatus === 'COMPLETED' ? null : remarks,
                      description: description || step.description,
                      updatedAt: new Date().toISOString(),
                      updatedBy: "staff_user"
                    }
                  : step
              )
            }));
            
            return {
              ...prev,
              servicePeriod: updatedPeriods
            };
          });
        } else {
          setApplication(prev => ({
            ...prev,
            applicationTrackStep: prev.applicationTrackStep.map(step => 
              step.applicationTrackStepId === stepId
                ? { 
                    ...step, 
                    status: updateStatus,
                    remarks: updateStatus === 'COMPLETED' ? null : remarks,
                    description: description || step.description,
                    updatedAt: new Date().toISOString(),
                    updatedBy: "staff_user"
                  }
                : step
            )
          }));
        }
        
        // Reset form
        resetUpdateForm();
        alert('Status updated successfully!');
        
        // Refresh application details
        fetchApplicationDetails();
      } else {
        throw new Error(response.data.message || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating step status:', err);
      setUpdateError(err.message || 'Failed to update status. Please try again.');
      alert(`Failed to update status: ${err.message}`);
    } finally {
      setUpdateLoading(false);
    }
  };

  const resetUpdateForm = () => {
    setUpdatingStepId(null);
    setUpdateStatus('');
    setRemarks('');
    setDescription('');
    setUpdateError(null);
  };

  const startUpdate = (step, isPeriodStep = false) => {
    setUpdatingStepId({ id: isPeriodStep ? step.periodStepId : step.applicationTrackStepId, isPeriodStep });
    setUpdateStatus(step.status);
    setRemarks(step.remarks || '');
    setDescription(step.description || '');
  };

  const cancelUpdate = () => {
    resetUpdateForm();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'ASSIGNED':
        return { 
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          icon: <CheckCircle className="w-5 h-5" />,
          label: 'Assigned'
        };
      case 'PROCESSING':
        return { 
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <RefreshCw className="w-5 h-5" />,
          label: 'In Progress'
        };
      case 'COMPLETED':
        return { 
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <CheckCircle className="w-5 h-5" />,
          label: 'Completed'
        };
      case 'PENDING':
        return { 
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <Clock className="w-5 h-5" />,
          label: 'Pending'
        };
      case 'ERROR':
        return { 
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <AlertCircle className="w-5 h-5" />,
          label: 'Error/Rejected'
        };
      default:
        return { 
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <AlertCircle className="w-5 h-5" />,
          label: status
        };
    }
  };

  const getTrackStepStatusConfig = (status) => {
    switch (status) {
      case 'COMPLETED':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
          badge: 'bg-green-100 text-green-800'
        };
      case 'PROCESSING':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          icon: <PlayCircle className="w-5 h-5 text-blue-500" />,
          badge: 'bg-blue-100 text-blue-800'
        };
      case 'PENDING':
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-800',
          icon: <Clock className="w-5 h-5 text-gray-500" />,
          badge: 'bg-gray-100 text-gray-800'
        };
      case 'ERROR':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: <XCircle className="w-5 h-5 text-red-500" />,
          badge: 'bg-red-100 text-red-800'
        };
      default:
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-800',
          icon: <AlertCircle className="w-5 h-5 text-gray-500" />,
          badge: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const getPeriodStatusConfig = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'PENDING':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getFileIcon = (url) => {
    if (!url) return <File className="w-5 h-5" />;
    
    const extension = url.split('.').pop().toLowerCase();
    
    switch (extension) {
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'bmp':
      case 'svg':
      case 'webp':
        return <Image className="w-5 h-5 text-rose-500" />;
      
      case 'pdf':
        return <FileText className="w-5 h-5 text-red-500" />;
      
      case 'doc':
      case 'docx':
        return <FileText className="w-5 h-5 text-blue-500" />;
      
      case 'xls':
      case 'xlsx':
        return <FileSpreadsheet className="w-5 h-5 text-green-500" />;
      
      case 'zip':
      case 'rar':
      case '7z':
        return <FileArchive className="w-5 h-5 text-yellow-500" />;
      
      case 'mp3':
      case 'wav':
      case 'ogg':
        return <FileAudio className="w-5 h-5 text-purple-500" />;
      
      case 'mp4':
      case 'avi':
      case 'mov':
      case 'mkv':
        return <FileVideo className="w-5 h-5 text-indigo-500" />;
      
      default:
        return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatFileSize = (sizeInMb) => {
    if (!sizeInMb) return 'Unknown size';
    const size = parseFloat(sizeInMb);
    if (size < 1) {
      return `${(size * 1024).toFixed(0)} KB`;
    }
    return `${size.toFixed(2)} MB`;
  };

  const renderFormField = (key, value, depth = 0) => {
    const isFile = value && typeof value === 'object' && value.url;
    
    if (isFile) {
      return (
        <div className={`flex items-center justify-between p-3 ${depth > 0 ? 'ml-4' : ''} bg-white rounded-lg border border-gray-200`}>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {getFileIcon(value.url)}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{key}</p>
              <p className="text-xs text-gray-500">Size: {formatFileSize(value.sizeInMb)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.open(value.url, '_blank')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="View file"
            >
              <Eye className="w-4 h-4 text-gray-500" />
            </button>
            <button
              onClick={() => downloadFile(value.url, key)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Download file"
            >
              <Download className="w-4 h-4 text-blue-500" />
            </button>
          </div>
        </div>
      );
    }

    if (typeof value === 'object' && value !== null && !isFile) {
      return (
        <div className={`space-y-2 ${depth > 0 ? 'ml-4' : ''}`}>
          <p className="text-sm font-medium text-gray-900">{key}:</p>
          <div className="space-y-2 pl-4 border-l border-gray-200">
            {Object.entries(value).map(([subKey, subValue]) => 
              renderFormField(subKey, subValue, depth + 1)
            )}
          </div>
        </div>
      );
    }

    return (
      <div className={`flex items-start justify-between p-3 ${depth > 0 ? 'ml-4' : ''} bg-white rounded-lg border border-gray-200`}>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{key}</p>
          <p className="text-sm text-gray-700 mt-0.5 break-words">{String(value)}</p>
        </div>
        <button
          onClick={() => handleCopyText(String(value))}
          className="ml-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Copy value"
        >
          <Copy className="w-4 h-4 text-gray-500" />
        </button>
      </div>
    );
  };

  const downloadFile = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Error downloading file:', err);
      alert('Failed to download file. Please try again.');
    }
  };

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy:', err);
      });
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg font-medium">Loading application details...</p>
          <p className="text-gray-500 text-sm mt-2">Please wait while we fetch the details</p>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Details</h2>
          <p className="text-gray-600 mb-6">{error || 'Application not found'}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
            <button
              onClick={fetchApplicationDetails}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Service Application Details</h1>
                <p className="text-gray-600 text-sm">Application ID: {application.applicationId}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusConfig(application.status).color}`}>
                {getStatusConfig(application.status).icon}
                <span>{getStatusConfig(application.status).label}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Information Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      {application.service?.name || 'Service Details'}
                    </h2>
                    <p className="text-gray-600">{application.service?.description || 'No description available'}</p>
                  </div>
                  {application.service?.photoUrl && (
                    <img
                      src={application.service.photoUrl}
                      alt={application.service.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Application ID</p>
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono bg-gray-100 px-3 py-1.5 rounded-lg">
                        {application.applicationId}
                      </code>
                      <button
                        onClick={() => handleCopyText(application.applicationId)}
                        className="p-1.5 hover:bg-gray-200 rounded-lg"
                      >
                        <Copy className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Service ID</p>
                    <p className="text-sm font-medium text-gray-900">{application.serviceId}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">My Service ID</p>
                    <p className="text-sm font-medium text-gray-900">{application.myServiceId}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Employee ID</p>
                    <p className="text-sm font-medium text-gray-900">{application.employeeId}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(application.createdAt)}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Last Updated</p>
                    <p className="text-sm font-medium text-gray-900">{formatDate(application.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Track Steps or Period Steps */}
            {(application.applicationTrackStep && application.applicationTrackStep.length > 0) || 
             (application.servicePeriod && application.servicePeriod.length > 0 && application.servicePeriod.some(p => p.periodStep && p.periodStep.length > 0)) ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div 
                  className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleSection('trackSteps')}
                >
                  <div className="flex items-center gap-3">
                    <List className="w-5 h-5 text-gray-500" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {application.servicePeriod && application.servicePeriod.length > 0 ? 'Service Period Steps' : 'Application Track Steps'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {application.servicePeriod && application.servicePeriod.length > 0 ? 
                          `${application.servicePeriod.length} periods with steps` : 
                          `${application.applicationTrackStep?.length || 0} steps in progress`
                        }
                      </p>
                    </div>
                  </div>
                  {expandedSections.trackSteps ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                
                {expandedSections.trackSteps && (
                  <div className="px-6 pb-6">
                    {/* Render Period Steps if available */}
                    {application.servicePeriod && application.servicePeriod.length > 0 ? (
                      <div className="space-y-6">
                        {application.servicePeriod
                          .filter(period => period.periodStep && period.periodStep.length > 0)
                          .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
                          .map((period, periodIndex) => {
                            const unlockedSteps = period.periodStep.filter(step => 
                              !period.isLocked || step.status !== 'PENDING'
                            );
                            
                            return (
                              <div key={period.servicePeriodId} className="border border-gray-200 rounded-lg">
                                <div className={`p-4 ${period.isLocked ? 'bg-gray-50' : 'bg-white'} border-b border-gray-200`}>
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <h4 className="font-semibold text-gray-900">{period.periodLabel}</h4>
                                      <div className="flex items-center gap-2 mt-1">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPeriodStatusConfig(period.status)}`}>
                                          {period.status}
                                        </span>
                                        {period.isLocked && (
                                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                                            Locked
                                          </span>
                                        )}
                                        <span className="text-xs text-gray-500">
                                          {formatDate(period.startDate)} - {formatDate(period.endDate)}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm font-medium text-gray-900">
                                        {period.completionPercent || 0}% Complete
                                      </p>
                                      <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                                        <div 
                                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                                          style={{ 
                                            width: `${period.completionPercent || 0}%` 
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="p-4 space-y-3">
                                  {unlockedSteps.length > 0 ? (
                                    unlockedSteps
                                      .sort((a, b) => a.order - b.order)
                                      .map((step, stepIndex) => {
                                        const statusConfig = getTrackStepStatusConfig(step.status);
                                        const isUpdating = updatingStepId && 
                                                          updatingStepId.id === step.periodStepId && 
                                                          updatingStepId.isPeriodStep;
                                        
                                        return (
                                          <div
                                            key={step.periodStepId}
                                            className={`p-4 rounded-lg border ${statusConfig.bg} ${statusConfig.border}`}
                                          >
                                            {isUpdating ? (
                                              // Update Form
                                              <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                  <h4 className="text-lg font-semibold text-gray-900">Update Step Status</h4>
                                                  <button
                                                    onClick={cancelUpdate}
                                                    className="p-1.5 hover:bg-gray-100 rounded-lg"
                                                  >
                                                    <X className="w-4 h-4 text-gray-500" />
                                                  </button>
                                                </div>
                                                
                                                {updateError && (
                                                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                                    <p className="text-sm text-red-700">{updateError}</p>
                                                  </div>
                                                )}
                                                
                                                <div className="space-y-3">
                                                  <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                      Status
                                                    </label>
                                                    <select
                                                      value={updateStatus}
                                                      onChange={(e) => setUpdateStatus(e.target.value)}
                                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    >
                                                      <option value="">Select Status</option>
                                                      <option value="PENDING">Pending</option>
                                                      <option value="PROCESSING">Processing</option>
                                                      <option value="COMPLETED">Completed</option>
                                                      <option value="ERROR">Error/Rejected</option>
                                                    </select>
                                                  </div>
                                                  
                                                  <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                      Description
                                                    </label>
                                                    <textarea
                                                      value={description}
                                                      onChange={(e) => setDescription(e.target.value)}
                                                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                      rows="2"
                                                      placeholder="Enter description..."
                                                    />
                                                  </div>
                                                  
                                                  {updateStatus === 'ERROR' && (
                                                    <div>
                                                      <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Remarks (Required for Rejected Status)
                                                      </label>
                                                      <textarea
                                                        value={remarks}
                                                        onChange={(e) => setRemarks(e.target.value)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                        rows="3"
                                                        placeholder="Enter reason for rejection..."
                                                        required
                                                      />
                                                      <p className="text-xs text-gray-500 mt-1">
                                                        Remarks are required when status is set to ERROR/Rejected
                                                      </p>
                                                    </div>
                                                  )}
                                                  
                                                  {updateStatus === 'COMPLETED' && (
                                                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                      <p className="text-sm text-blue-700">
                                                        <Info className="w-4 h-4 inline mr-1" />
                                                        Remarks will be set to null for COMPLETED status
                                                      </p>
                                                    </div>
                                                  )}
                                                  
                                                  <div className="flex gap-3 pt-2">
                                                    <button
                                                      onClick={() => updateStepStatus(step.periodStepId, true)}
                                                      disabled={updateLoading}
                                                      className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                    >
                                                      {updateLoading ? (
                                                        <>
                                                          <RefreshCw className="w-4 h-4 animate-spin" />
                                                          Updating...
                                                        </>
                                                      ) : (
                                                        <>
                                                          <Save className="w-4 h-4" />
                                                          Update Status
                                                        </>
                                                      )}
                                                    </button>
                                                    <button
                                                      onClick={cancelUpdate}
                                                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                                    >
                                                      Cancel
                                                    </button>
                                                  </div>
                                                </div>
                                              </div>
                                            ) : (
                                              // Step Display
                                              <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0">
                                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${statusConfig.badge}`}>
                                                    {statusConfig.icon}
                                                  </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                  <div className="flex items-start justify-between gap-3">
                                                    <div className="flex-1 min-w-0">
                                                      <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium text-gray-500">Step {step.order}</span>
                                                        <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                                                          ID: {step.periodStepId}
                                                        </span>
                                                      </div>
                                                      <h4 className={`text-lg font-semibold ${statusConfig.text} mt-1`}>
                                                        {step.title}
                                                      </h4>
                                                      <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusConfig.badge}`}>
                                                        {step.status}
                                                      </span>
                                                      {!period.isLocked && (
                                                        <button
                                                          onClick={() => startUpdate(step, true)}
                                                          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                                          title="Update status"
                                                        >
                                                          <Edit className="w-4 h-4 text-gray-500" />
                                                        </button>
                                                      )}
                                                    </div>
                                                  </div>
                                                  
                                                  {(step.remarks || step.updatedBy) && (
                                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                                        {step.remarks && (
                                                          <div>
                                                            <p className="text-gray-500">Remarks:</p>
                                                            <p className="font-medium text-gray-900">{step.remarks}</p>
                                                          </div>
                                                        )}
                                                        {step.updatedBy && (
                                                          <div>
                                                            <p className="text-gray-500">Updated By:</p>
                                                            <p className="font-medium text-gray-900">{step.updatedBy}</p>
                                                          </div>
                                                        )}
                                                      </div>
                                                    </div>
                                                  )}
                                                  
                                                  <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                                                    <span>Created: {formatDate(step.createdAt)}</span>
                                                    {step.updatedAt !== step.createdAt && (
                                                      <span>Updated: {formatDate(step.updatedAt)}</span>
                                                    )}
                                                  </div>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })
                                  ) : (
                                    <div className="text-center py-4">
                                      <p className="text-gray-500">Period is locked. Steps will become available when unlocked.</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    ) : (
                      // Render Application Track Steps
                      <div className="space-y-4">
                        {application.applicationTrackStep
                          .sort((a, b) => a.order - b.order)
                          .map((step, index) => {
                            const statusConfig = getTrackStepStatusConfig(step.status);
                            const isUpdating = updatingStepId && 
                                              updatingStepId.id === step.applicationTrackStepId && 
                                              !updatingStepId.isPeriodStep;
                            
                            return (
                              <div
                                key={step.applicationTrackStepId}
                                className={`p-4 rounded-lg border ${statusConfig.bg} ${statusConfig.border}`}
                              >
                                {isUpdating ? (
                                  // Update Form
                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                      <h4 className="text-lg font-semibold text-gray-900">Update Step Status</h4>
                                      <button
                                        onClick={cancelUpdate}
                                        className="p-1.5 hover:bg-gray-100 rounded-lg"
                                      >
                                        <X className="w-4 h-4 text-gray-500" />
                                      </button>
                                    </div>
                                    
                                    {updateError && (
                                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-sm text-red-700">{updateError}</p>
                                      </div>
                                    )}
                                    
                                    <div className="space-y-3">
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                          Status
                                        </label>
                                        <select
                                          value={updateStatus}
                                          onChange={(e) => setUpdateStatus(e.target.value)}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                          <option value="">Select Status</option>
                                          <option value="PENDING">Pending</option>
                                          <option value="PROCESSING">processing</option>
                                          <option value="COMPLETED">Completed</option>
                                          <option value="ERROR">Error/Rejected</option>
                                        </select>
                                      </div>
                                      
                                      <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                          Description
                                        </label>
                                        <textarea
                                          value={description}
                                          onChange={(e) => setDescription(e.target.value)}
                                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                          rows="2"
                                          placeholder="Enter description..."
                                        />
                                      </div>
                                      
                                      {updateStatus === 'ERROR' && (
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Remarks (Required for Rejected Status)
                                          </label>
                                          <textarea
                                            value={remarks}
                                            onChange={(e) => setRemarks(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            rows="3"
                                            placeholder="Enter reason for rejection..."
                                            required
                                          />
                                          <p className="text-xs text-gray-500 mt-1">
                                            Remarks are required when status is set to ERROR/Rejected
                                          </p>
                                        </div>
                                      )}
                                      
                                      {updateStatus === 'COMPLETED' && (
                                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                          <p className="text-sm text-blue-700">
                                            <Info className="w-4 h-4 inline mr-1" />
                                            Remarks will be set to null for COMPLETED status
                                          </p>
                                        </div>
                                      )}
                                      
                                      <div className="flex gap-3 pt-2">
                                        <button
                                          onClick={() => updateStepStatus(step.applicationTrackStepId, false)}
                                          disabled={updateLoading}
                                          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                          {updateLoading ? (
                                            <>
                                              <RefreshCw className="w-4 h-4 animate-spin" />
                                              Updating...
                                            </>
                                          ) : (
                                            <>
                                              <Save className="w-4 h-4" />
                                              Update Status
                                            </>
                                          )}
                                        </button>
                                        <button
                                          onClick={cancelUpdate}
                                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  // Step Display
                                  <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${statusConfig.badge}`}>
                                        {statusConfig.icon}
                                      </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-gray-500">Step {step.order}</span>
                                            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                                              ID: {step.applicationTrackStepId?.slice(0, 8)}...
                                            </span>
                                          </div>
                                          <h4 className={`text-lg font-semibold ${statusConfig.text} mt-1`}>
                                            {step.title}
                                          </h4>
                                          <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusConfig.badge}`}>
                                            {step.status}
                                          </span>
                                          <button
                                            onClick={() => startUpdate(step, false)}
                                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                                            title="Update status"
                                          >
                                            <Edit className="w-4 h-4 text-gray-500" />
                                          </button>
                                        </div>
                                      </div>
                                      
                                      {(step.remarks || step.updatedBy) && (
                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                            {step.remarks && (
                                              <div>
                                                <p className="text-gray-500">Remarks:</p>
                                                <p className="font-medium text-gray-900">{step.remarks}</p>
                                              </div>
                                            )}
                                            {step.updatedBy && (
                                              <div>
                                                <p className="text-gray-500">Updated By:</p>
                                                <p className="font-medium text-gray-900">{step.updatedBy}</p>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                      
                                      <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                                        <span>Created: {formatDate(step.createdAt)}</span>
                                        {step.updatedAt !== step.createdAt && (
                                          <span>Updated: {formatDate(step.updatedAt)}</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    )}
                    
                    {/* Progress Summary */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900">Progress Summary</h4>
                          {application.servicePeriod && application.servicePeriod.length > 0 ? (
                            <>
                              <p className="text-sm text-gray-500">
                                {application.servicePeriod.filter(p => p.status === 'COMPLETED').length} of {application.servicePeriod.length} periods completed
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Unlocked periods: {application.servicePeriod.filter(p => !p.isLocked).length}
                              </p>
                            </>
                          ) : (
                            <p className="text-sm text-gray-500">
                              {application.applicationTrackStep?.filter(s => s.status === 'COMPLETED').length || 0} of {application.applicationTrackStep?.length || 0} steps completed
                            </p>
                          )}
                        </div>
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          {application.servicePeriod && application.servicePeriod.length > 0 ? (
                            <div 
                              className="bg-green-600 h-2 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${(application.servicePeriod.filter(p => p.status === 'COMPLETED').length / application.servicePeriod.length) * 100}%` 
                              }}
                            />
                          ) : (
                            <div 
                              className="bg-green-600 h-2 rounded-full transition-all duration-300"
                              style={{ 
                                width: `${(application.applicationTrackStep?.filter(s => s.status === 'COMPLETED').length || 0 / application.applicationTrackStep?.length || 1) * 100}%` 
                              }}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            {/* Form Data Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div 
                className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleSection('formData')}
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-gray-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Form Data</h3>
                </div>
                {expandedSections.formData ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </div>
              
              {expandedSections.formData && (
                <div className="px-6 pb-6">
                  <div className="space-y-3">
                    {Object.entries(application.formData).map(([key, value]) => (
                      <div key={key}>
                        {renderFormField(key, value)}
                      </div>
                    ))}
                  </div>
                  {Object.values(application.formData).some(
                    value => value && typeof value === 'object' && value.url
                  ) && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <button
                        onClick={() => {
                          Object.entries(application.formData).forEach(([key, value]) => {
                            if (value && typeof value === 'object' && value.url) {
                              downloadFile(value.url, key);
                            }
                          });
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download All Files
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Service Periods Section */}
            {application.servicePeriod && application.servicePeriod.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div 
                  className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleSection('periods')}
                >
                  <div className="flex items-center gap-3">
                    <Layers className="w-5 h-5 text-gray-500" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Service Periods</h3>
                      <p className="text-sm text-gray-500">{application.servicePeriod.length} periods</p>
                    </div>
                  </div>
                  {expandedSections.periods ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                
                {expandedSections.periods && (
                  <div className="px-6 pb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {application.servicePeriod.map((period) => (
                        <div
                          key={period.servicePeriodId}
                          className={`p-4 rounded-lg border ${getPeriodStatusConfig(period.status)}`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">{period.periodLabel}</span>
                            <div className="flex items-center gap-1">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${period.status === 'COMPLETED' ? 'bg-green-200 text-green-800' : period.status === 'PROCESSING' ? 'bg-yellow-200 text-yellow-800' : 'bg-gray-200 text-gray-800'}`}>
                                {period.status}
                              </span>
                              {period.isLocked && (
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                                  Locked
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-gray-500">Created: {formatDate(period.createdAt)}</p>
                          <p className="text-xs text-gray-500 mt-1">Steps: {period.periodStep?.length || 0}</p>
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div 
                                className="bg-green-600 h-1.5 rounded-full"
                                style={{ width: `${period.completionPercent || 0}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-500 mt-1 text-right">
                              {period.completionPercent || 0}% Complete
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Service Details Card */}
            {application.service && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Service Details
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Service Type</p>
                    <p className="font-medium text-gray-900">{application.service.serviceType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Frequency</p>
                    <p className="font-medium text-gray-900">{application.service.frequency || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium text-gray-900">
                      {application.service.duration ? `${application.service.duration} ${(application.service.durationUnit || '').toLowerCase()}` : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Documents Required</p>
                    <p className="font-medium text-gray-900">{application.service.documentsRequired === 'true' ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">GST Applicable</p>
                    <p className="font-medium text-gray-900">{application.service.isGstApplicable === 'true' ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p className="font-medium text-gray-900">{formatDate(application.service.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Updated</p>
                    <p className="font-medium text-gray-900">{formatDate(application.service.updatedAt)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Pricing Card */}
            {application.service && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Pricing Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Individual Price</span>
                    <span className="font-medium text-gray-900">₹{application.service.individualPrice}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Offer Price</span>
                    <span className="font-medium text-green-600">₹{application.service.offerPrice}</span>
                  </div>
                  {application.service.isGstApplicable === 'true' && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">GST ({application.service.gstPercentage}%)</span>
                      <span className="font-medium text-gray-900">
                        ₹{(parseFloat(application.service.offerPrice) * parseFloat(application.service.gstPercentage) / 100).toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-gray-900">Final Price</span>
                      <span className="text-xl font-bold text-gray-900">₹{application.service.finalIndividualPrice}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Admin Notes */}
            {application.adminNote && (
              <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Admin Notes
                </h3>
                <p className="text-blue-800">{application.adminNote}</p>
              </div>
            )}

            {/* Bundle Info (if exists) */}
            {application.bundle && (
              <div className="bg-purple-50 rounded-xl border border-purple-200 p-6">
                <h3 className="text-lg font-semibold text-purple-900 mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Bundle Information
                </h3>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-purple-700">Bundle ID</p>
                    <p className="font-medium text-purple-900">{application.bundle.bundleId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-purple-700">Bundle Name</p>
                    <p className="font-medium text-purple-900">{application.bundle.name}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => window.print()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                >
                  <Printer className="w-4 h-4" />
                  Print Details
                </button>
                <button
                  onClick={() => {
                    const text = JSON.stringify(application, null, 2);
                    handleCopyText(text);
                    console.log('Full application data:', application);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                >
                  <Copy className="w-4 h-4" />
                  Copy & Log All Data
                </button>
                <button
                  onClick={fetchApplicationDetails}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh Details
                </button>
              </div>
            </div>

            {/* Support Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Need Help?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Contact support for assistance with this application.
              </p>
              <div className="space-y-2">
                <button className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Chat with Support
                </button>
                <button className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Call Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}