import React, { useEffect, useState, useCallback, useRef } from 'react';
import axiosInstance from '@src/providers/axiosInstance';
import { 
  Clock, 
  Calendar, 
  FileText, 
  Shield, 
  CheckCircle, 
  X, 
  Search, 
  Filter, 
  ChevronRight, 
  AlertCircle,
  Play,
  Pause,
  Check,
  MoreVertical,
  Download,
  Eye,
  Edit,
  Trash2,
  Tag,
  BadgeCheck,
  Loader2,
  Package,
  Users,
  TrendingUp,
  CreditCard,
  FileCheck,
  ArrowUpRight,
  Clock4,
  CheckSquare,
  AlertTriangle,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  MoreHorizontal,
  ExternalLink,
  BarChart,
  Target,
  Award,
  Zap,
  Layers,
  Globe,
  Smartphone,
  Headphones,
  MessageSquare,
  Phone,
  Mail,
  HelpCircle,
  FileBarChart,
  CalendarClock,
  DollarSign,
  Receipt,
  ShieldCheck,
  Lock,
  Sparkles,
  Upload,
  AlertCircle as AlertCircleIcon,
  Plus,
  Minus,
  Trash,
  File
} from 'lucide-react';

export default function MyService() {
  const [myServices, setMyServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [filteredServices, setFilteredServices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    pending: 0,
  });

  // New states for input form modal
  const [showInputForm, setShowInputForm] = useState(false);
  const [selectedServiceForInput, setSelectedServiceForInput] = useState(null);
  const [serviceDetails, setServiceDetails] = useState(null);
  const [loadingServiceDetails, setLoadingServiceDetails] = useState(false);
  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState({});
  const [filePreviews, setFilePreviews] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [fieldLabelMapping, setFieldLabelMapping] = useState({}); // NEW: Map fieldId to label
  
  // Prevent concurrent modal openings
  const [isModalTransitioning, setIsModalTransitioning] = useState(false);
  
  // Refs
  const formContainerRef = useRef(null);
  const filePreviewRefs = useRef({});
  const lastScrollPositionRef = useRef(0); // Track scroll position
  const isUserScrollingRef = useRef(false); // Track if user is manually scrolling

  // Hardcoded user ID
  const userId = "cmjsacjjh0000tzdotm5dqv7r";

  // Primary color config
  const primary = {
    bg: "bg-primary",
    text: "text-primary",
    hover: "hover:bg-primary-dark",
    light: "bg-primary-50",
    border: "border-primary",
    ring: "ring-primary/20",
    gradient: "from-primary to-primary-dark",
  };

  // Status colors with better icons
  const statusColors = {
    NOT_STARTED: { 
      bg: "bg-amber-50", 
      text: "text-amber-800", 
      border: "border-amber-200", 
      icon: Clock, 
      iconColor: "text-amber-600",
      label: "Not Started",
      gradient: "from-amber-500 to-amber-600"
    },
    IN_PROGRESS: { 
      bg: "bg-blue-50", 
      text: "text-blue-800", 
      border: "border-blue-200", 
      icon: TrendingUp, 
      iconColor: "text-blue-600",
      label: "In Progress",
      gradient: "from-blue-500 to-blue-600"
    },
    COMPLETED: { 
      bg: "bg-emerald-50", 
      text: "text-emerald-800", 
      border: "border-emerald-200", 
      icon: CheckCircle, 
      iconColor: "text-emerald-600",
      label: "Completed",
      gradient: "from-emerald-500 to-emerald-600"
    },
   
    CANCELLED: { 
      bg: "bg-rose-50", 
      text: "text-rose-800", 
      border: "border-rose-200", 
      icon: X, 
      iconColor: "text-rose-600",
      label: "Cancelled",
      gradient: "from-rose-500 to-rose-600"
    }
  };

  // Fetch my services
  useEffect(() => {
    const fetchMyServices = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(
          `https://insightsconsult-backend.onrender.com/my-services/${userId}`
        );
        
        if (response.data.success) {
          setMyServices(response.data.services);
          setFilteredServices(response.data.services);
          calculateStats(response.data.services);
        }
      } catch (error) {
        console.error("Error fetching my services:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyServices();
  }, []);

  // Calculate statistics
  const calculateStats = (services) => {
    const stats = {
      total: services.length,
      active: services.filter(s => s.status === "IN_PROGRESS").length,
      completed: services.filter(s => s.status === "COMPLETED").length,
      pending: services.filter(s => s.status === "NOT_STARTED" || s.status === "ON_HOLD").length,
    };
    setStats(stats);
  };

  // Filter services
  useEffect(() => {
    let result = myServices;

    // Search filter
    if (searchQuery) {
      result = result.filter(service =>
        service.service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.service.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter(service => service.status === statusFilter);
    }

    setFilteredServices(result);
    setTotalPages(Math.ceil(result.length / itemsPerPage));
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, statusFilter, myServices, itemsPerPage]);

  // Get paginated services
  const getPaginatedServices = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredServices.slice(startIndex, endIndex);
  };

  // Handle page change
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
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
    
    return pages;
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format price
  const formatPrice = (price) => {
    return parseInt(price || 0).toLocaleString('en-IN');
  };

  // Handle Get Started button click
  const handleGetStarted = async (myService) => {
    if (isModalTransitioning) return;
    
    setIsModalTransitioning(true);
    
    // Close any open modal first
    if (selectedService || showInputForm) {
      handleCloseModal();
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    setSelectedServiceForInput(myService);
    setShowInputForm(true);
    setLoadingServiceDetails(true);
    setFormData({});
    setFiles({});
    setFilePreviews({});
    setSubmitError('');
    setSubmitSuccess(false);
    setFieldLabelMapping({}); // Reset field mapping

    try {
      const serviceId = myService?.service?.serviceId;
      
      if (!serviceId) {
        throw new Error('Service ID not found');
      }

      const response = await axiosInstance.get(
        `https://insightsconsult-backend.onrender.com/service/${serviceId}`
      );
      
      if (response.data.success) {
        setServiceDetails(response.data.service);
        
        // Initialize form data and create fieldId to label mapping
        const initialFormData = {};
        const fieldMapping = {};
        
        response.data.service.inputFields?.forEach(field => {
          const fieldId = field.fieldId;
          if (!fieldId) return;
          
          // Store mapping of fieldId to label
          fieldMapping[fieldId] = field.label;
          
          if (field.type === 'checkbox' || field.type === 'multiselect') {
            initialFormData[fieldId] = [];
          } else if (field.type === 'file') {
            initialFormData[fieldId] = null;
          } else {
            initialFormData[fieldId] = '';
          }
        });
        
        setFormData(initialFormData);
        setFieldLabelMapping(fieldMapping); // Store the mapping
      }
    } catch (error) {
      console.error("Error fetching service details:", error);
      setSubmitError('Failed to load service details. Please try again.');
    } finally {
      setLoadingServiceDetails(false);
      setIsModalTransitioning(false);
    }
  };

  // Handle View Details button click
  const handleViewDetails = (myService) => {
    if (isModalTransitioning) return;
    
    setIsModalTransitioning(true);
    
    if (selectedService || showInputForm) {
      handleCloseModal();
      setTimeout(() => {
        setSelectedService(myService);
        setIsModalTransitioning(false);
      }, 300);
    } else {
      setSelectedService(myService);
      setIsModalTransitioning(false);
    }
  };

  // Handle close modal
  const handleCloseModal = () => {
    // Clean up file preview URLs
    Object.values(filePreviewRefs.current).forEach(url => {
      if (url) URL.revokeObjectURL(url);
    });
    filePreviewRefs.current = {};
    
    // Reset scroll tracking
    isUserScrollingRef.current = false;
    lastScrollPositionRef.current = 0;
    
    setSelectedService(null);
    setShowInputForm(false);
    setSelectedServiceForInput(null);
    setServiceDetails(null);
    setFormData({});
    setFiles({});
    setFilePreviews({});
    setSubmitError('');
    setSubmitSuccess(false);
    setFieldLabelMapping({});
  };

  // Handle form input change
  const handleInputChange = useCallback((fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  }, []);

  // Handle checkbox change
  const handleCheckboxChange = useCallback((fieldId, option) => {
    setFormData(prev => {
      const currentValues = prev[fieldId] || [];
      const isSelected = currentValues.includes(option);
      
      let newValues;
      if (isSelected) {
        newValues = currentValues.filter(item => item !== option);
      } else {
        newValues = [...currentValues, option];
      }
      
      return {
        ...prev,
        [fieldId]: newValues
      };
    });
  }, []);

  // Handle file upload
  const handleFileUpload = useCallback((fieldId, file) => {
    if (!file) return;

    // Clean up previous file preview if exists
    if (filePreviews[fieldId]) {
      URL.revokeObjectURL(filePreviews[fieldId]);
    }

    setFiles(prev => ({
      ...prev,
      [fieldId]: file
    }));

    const previewUrl = URL.createObjectURL(file);
    setFilePreviews(prev => ({
      ...prev,
      [fieldId]: previewUrl
    }));
    
    filePreviewRefs.current[fieldId] = previewUrl;

    setFormData(prev => ({
      ...prev,
      [fieldId]: 'file_uploaded'
    }));
  }, [filePreviews]);

  // Remove file
  const handleRemoveFile = useCallback((fieldId) => {
    if (filePreviews[fieldId]) {
      URL.revokeObjectURL(filePreviews[fieldId]);
      delete filePreviewRefs.current[fieldId];
    }

    setFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[fieldId];
      return newFiles;
    });

    setFilePreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[fieldId];
      return newPreviews;
    });

    setFormData(prev => ({
      ...prev,
      [fieldId]: null
    }));
  }, [filePreviews]);

 

  // Handle form submission - FIXED to send data with labels instead of field IDs
  const handleSubmit = async () => {
    if (!selectedServiceForInput) return;

    // Validate required fields
    const missingFields = [];
    serviceDetails.inputFields?.forEach(field => {
      const fieldId = field.fieldId;
      if (field.required) {
        const value = formData[fieldId];
        if (!value || (Array.isArray(value) && value.length === 0)) {
          missingFields.push(field.label);
        }
      }
    });

    if (missingFields.length > 0) {
      setSubmitError(`Please fill all required fields: ${missingFields.join(', ')}`);
      return;
    }

    setSubmitting(true);
    setSubmitError('');

    try {
      // Get the serviceId from serviceDetails
      const serviceId = serviceDetails?.serviceId;
      
      if (!serviceId) {
        throw new Error('Service ID not found');
      }

      // Prepare form data with LABELS as keys instead of field IDs
      const submissionData = new FormData();
      
      // Add serviceId to the form data
      submissionData.append('serviceId', serviceId);
      
      // FIXED: Add all form fields using LABELS as keys
      Object.entries(formData).forEach(([fieldId, value]) => {
        // Get the label for this fieldId
        const fieldLabel = fieldLabelMapping[fieldId];
        
        if (!fieldLabel) {
          console.warn(`No label found for fieldId: ${fieldId}`);
          return;
        }
        
        // Skip file fields that are handled separately
        if (files[fieldId]) {
          return;
        }
        
        if (Array.isArray(value)) {
          submissionData.append(fieldLabel, JSON.stringify(value));
        } else if (value) {
          submissionData.append(fieldLabel, value);
        }
      });

      // FIXED: Add files with LABELS as keys
      Object.entries(files).forEach(([fieldId, file]) => {
        if (file) {
          const fieldLabel = fieldLabelMapping[fieldId];
          if (fieldLabel) {
            submissionData.append(fieldLabel, file);
          }
        }
      });

      // Get myServiceId from the selected service for the API endpoint
      const myServiceId = selectedServiceForInput.myServiceId;
      
      if (!myServiceId) {
        throw new Error('My Service ID not found');
      }

      // Submit to API
      const response = await axiosInstance.post(
        `/application/start/apply/${myServiceId}`,
        submissionData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        setSubmitSuccess(true);
        // Refresh services list after successful submission
        setTimeout(() => {
          handleCloseModal();
          // Refresh the services list
          const fetchMyServices = async () => {
            try {
              const response = await axiosInstance.get(
                `https://insightsconsult-backend.onrender.com/my-services/${userId}`
              );
              if (response.data.success) {
                setMyServices(response.data.services);
                setFilteredServices(response.data.services);
                calculateStats(response.data.services);
              }
            } catch (error) {
              console.error("Error refreshing services:", error);
            }
          };
          fetchMyServices();
        }, 2000);
      } else {
        setSubmitError(response.data.message || 'Failed to submit application');
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      console.error("Error details:", error.response?.data);
      setSubmitError(error.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };



  // Render input field based on type
  const InputField = React.memo(({ field }) => {
    const fieldId = field.fieldId;
    if (!fieldId) return null;
    
    const value = formData[fieldId] || '';
    const hasFile = files[fieldId];
    const filePreview = filePreviews[fieldId];
    
  

    const handleTextChange = (e) => {
      handleInputChange(fieldId, e.target.value);
    };

    const handleSelectChange = (e) => {
      handleInputChange(fieldId, e.target.value);
    };

    const handleRadioChange = (option) => {
      handleInputChange(fieldId, option);
    };

    const handleCheckboxOptionChange = (option) => {
      handleCheckboxChange(fieldId, option);
    };

    const handleFileChange = (e) => {
      handleFileUpload(fieldId, e.target.files?.[0]);
    };
    

    switch (field.type?.toLowerCase()) {
      case 'text':
      case 'email':
      case 'number':
      case 'tel':
        return (
          <input
            type={field.type}
            value={value}
            onChange={handleTextChange}
            placeholder={field.placeholder || `Enter ${field.label}`}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 focus:bg-white transition-all"
            required={field.required}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={handleTextChange}
            placeholder={field.placeholder || `Enter ${field.label}`}
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 focus:bg-white transition-all resize-none"
            required={field.required}
          />
        );

      case 'select':
        return (
          <select
            value={value}
            onChange={handleSelectChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 focus:bg-white transition-all appearance-none"
            required={field.required}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map((option, optIndex) => (
              <option key={optIndex} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="space-y-3">
            {field.options?.map((option, optIndex) => (
              <label key={optIndex} className="flex items-center space-x-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="radio"
                    name={`radio-${fieldId}`}
                    value={option}
                    checked={value === option}
                    onChange={() => handleRadioChange(option)}
                    className="sr-only peer"
                    required={field.required}
                  />
                  <div className="w-5 h-5 border-2 border-gray-300 rounded-full peer-checked:border-primary peer-checked:bg-primary peer-checked:border-4 transition-all group-hover:border-gray-400"></div>
                </div>
                <span className="text-gray-700 group-hover:text-gray-900">{option}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-3">
            {field.options?.map((option, optIndex) => {
              const isChecked = (value || []).includes(option);
              return (
                <label key={optIndex} className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleCheckboxOptionChange(option)}
                      className="sr-only peer"
                    />
                    <div className={`w-5 h-5 border-2 rounded transition-all group-hover:border-gray-400 flex items-center justify-center ${
                      isChecked 
                        ? 'bg-primary border-primary' 
                        : 'border-gray-300'
                    }`}>
                      {isChecked && (
                        <Check size={12} className="text-white" />
                      )}
                    </div>
                  </div>
                  <span className="text-gray-700 group-hover:text-gray-900">{option}</span>
                </label>
              );
            })}
          </div>
        );

      case 'file':
        return (
          <div className="space-y-3">
            <label className="block">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                required={field.required && !hasFile}
              />
              <div 
                onClick={() => {
                  handleFocus();
                  isUserScrollingRef.current = true;
                }}
                className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors group"
              >
                <div className="text-center">
                  {hasFile ? (
                    <>
                      <File className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                      <p className="text-emerald-600 font-medium truncate max-w-xs">{files[fieldId]?.name}</p>
                      <p className="text-sm text-gray-500 mt-1 group-hover:text-primary">Click to change file</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2 group-hover:text-primary" />
                      <p className="text-gray-600 font-medium group-hover:text-primary">Upload file</p>
                      <p className="text-sm text-gray-500 mt-1 group-hover:text-gray-600">Supports PDF, JPG, PNG, DOC, XLS</p>
                    </>
                  )}
                </div>
              </div>
            </label>
            
            {hasFile && (
              <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <File className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900 truncate max-w-xs">{files[fieldId]?.name}</p>
                    <p className="text-xs text-gray-500">
                      {files[fieldId]?.size ? `${(files[fieldId].size / 1024).toFixed(1)} KB` : 'Unknown size'}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(fieldId)}
                  className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <X size={16} className="text-gray-500" />
                </button>
              </div>
            )}
            
            {field.placeholder && (
              <p className="text-sm text-gray-500">{field.placeholder}</p>
            )}
          </div>
        );

      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={handleTextChange}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 focus:bg-white transition-all"
            required={field.required}
          />
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={handleTextChange}
            placeholder={field.placeholder || `Enter ${field.label}`}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-gray-50 focus:bg-white transition-all"
            required={field.required}
          />
        );
    }
  });

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = statusColors[status] || { 
      bg: "bg-gray-50", 
      text: "text-gray-800", 
      border: "border-gray-200",
      label: status,
      icon: Package,
      iconColor: "text-gray-600"
    };
    const Icon = statusConfig.icon;
    
    return (
      <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border ${statusConfig.border} ${statusConfig.bg}`}>
        <Icon size={14} className={statusConfig.iconColor} />
        <span className={`text-xs font-semibold ${statusConfig.text}`}>
          {statusConfig.label}
        </span>
      </div>
    );
  };

  // Service type badge
  const ServiceTypeBadge = ({ type }) => {
    const config = {
      ONE_TIME: { 
        label: "One Time", 
        color: "bg-slate-50 text-slate-700 border border-slate-200", 
        icon: Zap,
        iconColor: "text-slate-600"
      },
      RECURRING: { 
        label: "Subscription", 
        color: "bg-violet-50 text-violet-700 border border-violet-200", 
        icon: Calendar,
        iconColor: "text-violet-600"
      }
    };
    
    const { label, color, icon: Icon, iconColor } = config[type] || { 
      label: type, 
      color: "bg-gray-50 text-gray-700 border border-gray-200",
      icon: Package,
      iconColor: "text-gray-600"
    };
    
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${color}`}>
        <Icon size={14} className={iconColor} />
        <span className="text-xs font-medium">{label}</span>
      </div>
    );
  };

  // Get service progress percentage based on status
  const getProgressPercentage = (status) => {
    switch(status) {
      case "NOT_STARTED": return 10;
      case "IN_PROGRESS": return 50;
      case "COMPLETED": return 100;
      case "ON_HOLD": return 30;
      default: return 0;
    }
  };

  // Service detail modal
  const ServiceDetailModal = () => {
    if (!selectedService) return null;

    const service = selectedService.service;
    const statusConfig = statusColors[selectedService.status] || statusColors.NOT_STARTED;
    const progress = getProgressPercentage(selectedService.status);

    return (
      <div className={`fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white shadow-2xl z-50 transform transition-transform duration-300 border-l border-gray-200 ${selectedService ? "translate-x-0" : "translate-x-full"}`}>
        {selectedService && (
          <>
            <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
              <div className="flex items-center justify-between p-4">
                <button
                  onClick={handleCloseModal}
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
                      <span className="text-sm font-medium text-gray-700">Service Details</span>
                    </div>
                    <StatusBadge status={selectedService.status} />
                  </div>
                  <p className="text-xs text-gray-500 font-mono tracking-wide">
                    ID: {selectedService.myServiceId}
                  </p>
                </div>

                <div className="rounded-xl overflow-hidden border border-gray-200">
                  <img
                    src={service.photoUrl || `https://via.placeholder.com/1024x512/2563eb/ffffff?text=${encodeURIComponent(service.name?.substring(0, 1) || 'S')}`}
                    alt={service.name}
                    className="w-full h-64 object-cover"
                  />
                </div>

                <div className="space-y-3">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {service.name}
                  </h2>
                  <p className="text-gray-600">
                    {service.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    <ServiceTypeBadge type={service.serviceType} />
                    {service.frequency && (
                      <span className="px-2.5 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full border border-purple-200 flex items-center gap-1">
                        <Calendar size={12} />
                        {service.frequency.toLowerCase()}
                      </span>
                    )}
                    {service.duration && (
                      <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full border border-gray-200 flex items-center gap-1">
                        <Clock size={12} />
                        {service.duration} {service.durationUnit?.toLowerCase()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <BarChart size={18} className="text-gray-500" />
                      Service Progress
                    </h3>
                    <div className="flex items-center gap-1">
                      <span className="text-2xl font-bold text-primary">{progress}%</span>
                      <span className="text-sm text-gray-500">Complete</span>
                    </div>
                  </div>
                  
                  <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden shadow-inner mb-4">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-primary-dark rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { stage: "Initiated", icon: FileText, percentage: 25 },
                      { stage: "Processing", icon: Layers, percentage: 50 },
                      { stage: "Review", icon: ShieldCheck, percentage: 75 },
                      { stage: "Completed", icon: Award, percentage: 100 }
                    ].map((stage, index) => (
                      <div key={stage.stage} className={`text-center p-2 rounded-lg ${
                        progress >= stage.percentage 
                          ? 'bg-emerald-50 border border-emerald-200' 
                          : 'bg-gray-50 border border-gray-200'
                      }`}>
                        <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                          progress >= stage.percentage 
                            ? 'bg-emerald-500 text-white' 
                            : 'bg-gray-200 text-gray-500'
                        } mb-1.5`}>
                          <stage.icon size={14} />
                        </div>
                        <div className="text-xs font-semibold text-gray-700">{stage.stage}</div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {progress >= stage.percentage ? '✓ Done' : 'Pending'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <CalendarClock size={18} className="text-gray-500" />
                    Service Timeline
                  </h3>
                  <div className="space-y-4">
                    {[
                      { 
                        stage: "Purchase Confirmed", 
                        date: selectedService.createdAt, 
                        completed: true,
                        icon: CheckCircle,
                        color: "text-emerald-500"
                      },
                      { 
                        stage: "Document Collection", 
                        date: null, 
                        completed: progress >= 30,
                        icon: FileBarChart,
                        color: "text-blue-500"
                      },
                      { 
                        stage: "Service Processing", 
                        date: null, 
                        completed: progress >= 60,
                        icon: TrendingUp,
                        color: "text-purple-500"
                      },
                      { 
                        stage: "Quality Review", 
                        date: null, 
                        completed: progress >= 90,
                        icon: ShieldCheck,
                        color: "text-amber-500"
                      },
                      { 
                        stage: "Service Delivered", 
                        date: null, 
                        completed: progress === 100,
                        icon: Award,
                        color: "text-primary"
                      }
                    ].map((item, index, array) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="relative flex flex-col items-center flex-shrink-0">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            item.completed 
                              ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md' 
                              : 'bg-gray-100'
                          }`}>
                            <item.icon size={14} className={item.completed ? 'text-white' : item.color} />
                          </div>
                          {index < array.length - 1 && (
                            <div className={`h-6 w-0.5 mt-2 ${
                              array[index + 1]?.completed ? 'bg-gradient-to-b from-emerald-400 to-emerald-300' : 'bg-gray-200'
                            }`} />
                          )}
                        </div>
                        <div className="flex-1 pt-0.5">
                          <div className="flex items-center justify-between mb-1">
                            <span className={`font-medium ${item.completed ? 'text-gray-900' : 'text-gray-600'}`}>
                              {item.stage}
                            </span>
                            {item.date && (
                              <span className="text-xs text-gray-500">{formatDate(item.date)}</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">
                            {item.completed ? 'Completed successfully' : 'Currently in progress'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-5 text-white">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <DollarSign size={18} className="text-white/90" />
                    Payment Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm opacity-90">Service Price</span>
                      <span className="font-semibold">₹{formatPrice(service.offerPrice)}</span>
                    </div>
                    {service.isGstApplicable === "true" && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm opacity-90">GST ({service.gstPercentage}%)</span>
                        <span className="font-semibold">₹{formatPrice((service.offerPrice * service.gstPercentage) / 100)}</span>
                    </div>
                    )}
                    <div className="border-t border-white/20 pt-3 mt-2">
                      <div className="flex justify-between items-center">
                        <span className="font-bold">Total Paid</span>
                        <span className="text-xl font-extrabold">₹{formatPrice(service.finalIndividualPrice)}</span>
                      </div>
                      <div className="mt-2 text-xs opacity-80 flex items-center gap-1">
                        <Check size={12} className="text-emerald-400" />
                        Payment completed • {formatDate(selectedService.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="text-xs text-gray-500 mb-1">Purchase Date</div>
                    <div className="font-medium text-sm">{formatDate(selectedService.createdAt)}</div>
                  </div>
                  {service.duration && (
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">Duration</div>
                      <div className="font-medium text-sm">
                        {service.duration} {service.durationUnit?.toLowerCase()}
                      </div>
                    </div>
                  )}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="text-xs text-gray-500 mb-1">Documents Required</div>
                    <div className={`font-medium text-sm ${
                      service.documentsRequired === "true" ? 'text-emerald-600' : 'text-gray-600'
                    }`}>
                      {service.documentsRequired === "true" ? "Required" : "Not Required"}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="text-xs text-gray-500 mb-1">Service Type</div>
                    <ServiceTypeBadge type={service.serviceType} compact />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-5">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Headphones size={18} className="text-primary" />
                    <span>Need Help?</span>
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Our support team is here to assist you with any questions about this service.
                  </p>
                  <div className="space-y-2">
                    <button className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-all flex items-center justify-center gap-2">
                      <MessageSquare size={16} />
                      Chat with Support
                    </button>
                    <button className="w-full border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                      <Phone size={16} />
                      Call +91-9876543210
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  // Input Form Modal - FIXED ALL ISSUES
  const InputFormModal = () => {
    if (!showInputForm) return null;

    return (
      <div 
        className={`fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white shadow-2xl z-[60] transform transition-transform duration-300 border-l border-gray-200 ${showInputForm ? "translate-x-0" : "translate-x-full"}`}
      >
        {selectedServiceForInput && (
          <>
            <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
              <div className="flex items-center justify-between p-4">
                <button
                  onClick={handleCloseModal}
                  className="flex items-center gap-2 text-primary font-medium text-sm hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <X size={20} />
                  Close
                </button>

                <div className="flex items-center gap-2">
                  {selectedServiceForInput.status === "NOT_STARTED" ? (
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-emerald-600 border border-emerald-500 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Play size={16} />
                          Start Service
                        </>
                      )}
                    </button>
                  ) : (
                    <button className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark border border-primary shadow-sm transition-colors">
                      <Phone size={16} />
                      Call Expert
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div 
              ref={formContainerRef}
              className="h-[calc(100vh-64px)] overflow-y-auto scroll-smooth"
              onScroll={() => {
                isUserScrollingRef.current = true;
                // Reset after 1 second of no scrolling
                clearTimeout(window.scrollResetTimeout);
                window.scrollResetTimeout = setTimeout(() => {
                  isUserScrollingRef.current = false;
                }, 1000);
              }}
              style={{
                WebkitOverflowScrolling: 'touch',
                overscrollBehavior: 'none',
                scrollBehavior: 'smooth'
              }}
            >
              {loadingServiceDetails ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading service requirements...</p>
                  </div>
                </div>
              ) : submitSuccess ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center p-6">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Check className="w-10 h-10 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Application Submitted!</h3>
                    <p className="text-gray-600 mb-8">
                      Your service application has been received. Our team will review your information and get started shortly.
                    </p>
                    <button
                      onClick={handleCloseModal}
                      className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Package size={20} className="text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Start Service</span>
                      </div>
                      <StatusBadge status={selectedServiceForInput.status} />
                    </div>
                    <p className="text-xs text-gray-500 font-mono tracking-wide">
                      ID: {selectedServiceForInput.myServiceId}
                    </p>
                  </div>

                  <div className="rounded-xl overflow-hidden border border-gray-200">
                    <img
                      src={selectedServiceForInput?.service?.photoUrl || `https://via.placeholder.com/1024x512/2563eb/ffffff?text=${encodeURIComponent(selectedServiceForInput?.service?.name?.substring(0, 1) || 'S')}`}
                      alt={selectedServiceForInput?.service?.name}
                      className="w-full h-48 object-cover"
                    />
                  </div>

                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedServiceForInput?.service?.name}
                    </h2>
                    <p className="text-gray-600">
                      {selectedServiceForInput?.service?.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      <ServiceTypeBadge type={selectedServiceForInput?.service?.serviceType} />
                      {selectedServiceForInput?.service?.frequency && (
                        <span className="px-2.5 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full border border-purple-200 flex items-center gap-1">
                          <Calendar size={12} />
                          {selectedServiceForInput?.service?.frequency.toLowerCase()}
                        </span>
                      )}
                      {selectedServiceForInput?.service?.duration && (
                        <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full border border-gray-200 flex items-center gap-1">
                          <Clock size={12} />
                          {selectedServiceForInput?.service?.duration} {selectedServiceForInput?.service?.durationUnit?.toLowerCase()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-5">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="p-2 bg-amber-100 rounded-lg">
                        <AlertCircleIcon size={20} className="text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-amber-900 mb-1">Required Information</h3>
                        <p className="text-sm text-amber-800">
                          Please provide the following details to start your service. Fields marked with * are required.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {serviceDetails?.inputFields?.map((field, index) => {
                      const fieldId = field.fieldId;
                      if (!fieldId) return null;
                      
                      return (
                        <div 
                          key={fieldId} 
                          className="space-y-3"
                          id={`field-${fieldId}`}
                        >
                          <div className="flex items-center justify-between">
                            <label className="font-semibold text-gray-900">
                              {field.label}
                              {field.required && <span className="text-rose-500 ml-1">*</span>}
                            </label>
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded capitalize">
                              {field.type}
                            </span>
                          </div>
                          
                          <InputField field={field} />
                          
                          {field.placeholder && field.type?.toLowerCase() !== 'file' && (
                            <p className="text-sm text-gray-500">{field.placeholder}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {submitError && (
                    <div 
                      className="p-4 bg-rose-50 border border-rose-200 rounded-xl"
                      data-error-message="true"
                    >
                      <div className="flex items-center gap-3">
                        <AlertCircleIcon className="w-5 h-5 text-rose-600 flex-shrink-0" />
                        <p className="text-rose-700 text-sm">{submitError}</p>
                      </div>
                    </div>
                  )}

                  <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-200 mt-8 pb-6">
                    <div className="space-y-3">
                      <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-emerald/20"
                      >
                        {submitting ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Play size={20} />
                            Start Service Now
                          </>
                        )}
                      </button>
                      <p className="text-center text-xs text-gray-500">
                        By submitting, you agree to our Terms of Service and Privacy Policy
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-xl p-5">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Headphones size={18} className="text-primary" />
                      <span>Need Help?</span>
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Our support team is here to assist you with any questions about this service.
                    </p>
                    <div className="space-y-2">
                      <button className="w-full bg-primary text-white py-2.5 rounded-lg font-medium hover:bg-primary-dark transition-all flex items-center justify-center gap-2">
                        <MessageSquare size={16} />
                        Chat with Support
                      </button>
                      <button className="w-full border border-gray-300 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                        <Phone size={16} />
                        Call +91-9876543210
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  // Stats Card Component
  const StatsCard = ({ title, value, icon: Icon, color, description }) => {
    return (
      <div className="group bg-white border border-gray-100 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">{title}</p>
            <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
            {description && (
              <p className="text-xs text-gray-500 mt-2">{description}</p>
            )}
          </div>
          <div className={`p-3 rounded-xl ${color.bg} ${color.border} group-hover:scale-105 transition-transform`}>
            <Icon className={color.text} size={28} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Global styles to fix scrolling and input issues */}
      <style jsx global>{`
        :root {
          --primary: #2563eb;
          --primary-dark: #1d4ed8;
          --primary-50: #eff6ff;
          --primary-100: #dbeafe;
          --primary-200: #bfdbfe;
        }
        
        /* Prevent scroll jumps on mobile */
        html {
          height: 100%;
          overflow: hidden;
        }
        
        body {
          height: 100%;
          overflow: auto;
          -webkit-overflow-scrolling: touch;
        }
        
        /* Fix for iOS zoom on input focus */
        @media (max-width: 768px) {
          input, textarea, select {
            font-size: 16px !important;
          }
        }
        
        /* Better scroll handling */
        .scroll-smooth {
          scroll-behavior: smooth;
        }
        
        /* Prevent bounce on iOS */
        .no-bounce {
          overscroll-behavior: none;
        }
        
        /* Fix for keyboard appearing */
        .keyboard-open {
          position: fixed;
          width: 100%;
        }
      `}</style>

      {/* Modals */}
      <ServiceDetailModal />
      <InputFormModal />

      {/* Main content */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Package className="text-primary" size={28} />
                </div>
                <span>My Services</span>
              </h1>
              <p className="text-gray-600">Manage and track all your purchased services</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size={20} />
                  <input
                    type="text"
                    placeholder="Search services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-2.5 border border-gray-200 bg-gray-50 text-sm rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent w-64 focus:bg-white transition-all"
                  />
                </div>
              </div>
              <div className="relative group">
                <button className="px-4 py-2.5 border border-gray-200 bg-gray-50 rounded-xl hover:bg-white transition-all flex items-center gap-2">
                  <Filter size={18} className="text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">Filter</span>
                </button>
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</p>
                  </div>
                  {Object.entries(statusColors).map(([status, config]) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(statusFilter === status ? "all" : status)}
                      className="w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between group/item"
                    >
                      <div className="flex items-center gap-3">
                        <config.icon size={16} className={config.iconColor} />
                        <span>{config.label}</span>
                      </div>
                      {statusFilter === status && (
                        <Check size={14} className="text-primary animate-pulse" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard
              title="Total Services"
              value={stats.total}
              icon={Package}
              color={{ bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-100" }}
              description="All purchased services"
            />
            <StatsCard
              title="Active"
              value={stats.active}
              icon={TrendingUp}
              color={{ bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-100" }}
              description="Currently in progress"
            />
            <StatsCard
              title="Completed"
              value={stats.completed}
              icon={CheckCircle}
              color={{ bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-100" }}
              description="Successfully delivered"
            />
            <StatsCard
              title="Pending"
              value={stats.pending}
              icon={Clock}
              color={{ bg: "bg-amber-50", text: "text-amber-600", border: "border-amber-100" }}
              description="Awaiting action"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border flex items-center gap-2 ${
                statusFilter === "all" 
                  ? `${primary.bg} text-white border-primary shadow-lg shadow-primary/20` 
                  : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md"
              }`}
            >
              <Layers size={16} />
              All Services ({stats.total})
            </button>
            
            {Object.entries(statusColors).map(([status, config]) => {
              const count = myServices.filter(s => s.status === status).length;
              const Icon = config.icon;
              return (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 border flex items-center gap-2 ${
                    statusFilter === status 
                      ? `${config.bg} ${config.text} border-current shadow-lg` 
                      : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:shadow-md"
                  }`}
                >
                  <Icon size={16} className={statusFilter === status ? config.iconColor : config.iconColor} />
                  {config.label} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Services Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-primary/20 rounded-full"></div>
              <div className="w-24 h-24 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0"></div>
              <Loader2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse" size={40} />
            </div>
            <p className="mt-6 text-gray-600 text-lg font-medium">Loading your services...</p>
            <p className="text-gray-500 text-sm mt-2">Please wait while we fetch your service details</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-gray-50 to-gray-100 mb-8 shadow-inner">
              <Search className="text-gray-400" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No services found</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8 text-lg">
              {searchQuery || statusFilter !== "all" 
                ? "No services match your current search criteria." 
                : "You haven't purchased any services yet. Start exploring our services!"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {searchQuery || statusFilter !== "all" ? (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                  }}
                  className={`px-6 py-3 ${primary.bg} text-white rounded-xl font-semibold hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20`}
                >
                  <Filter size={18} />
                  Clear All Filters
                </button>
              ) : (
                <button
                  onClick={() => window.location.href = '/services'}
                  className={`px-6 py-3 ${primary.bg} text-white rounded-xl font-semibold hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-primary/20`}
                >
                  <Sparkles size={18} />
                  Browse Services
                </button>
              )}
              <button
                onClick={() => window.location.href = '/help'}
                className="px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center gap-2"
              >
                <HelpCircle size={18} />
                Get Help
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 p-5 bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Target size={20} className="text-primary" />
                </div>
                <div>
                  <div className="text-sm text-gray-600">Showing <span className="font-bold text-gray-900">{getPaginatedServices().length}</span> of{" "}
                    <span className="font-bold text-gray-900">{filteredServices.length}</span> services</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Page {currentPage} of {totalPages} • {itemsPerPage} per page
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Show:</span>
                  <select 
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="6">6 items</option>
                    <option value="9">9 items</option>
                    <option value="12">12 items</option>
                    <option value="15">15 items</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Sort:</span>
                  <select className="border border-gray-200 bg-gray-50 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent">
                    <option value="recent">Recently Added</option>
                    <option value="name">Name (A-Z)</option>
                    <option value="price">Price (High-Low)</option>
                    <option value="status">Status</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {getPaginatedServices().map((myService) => {
                const service = myService.service;
                const progress = getProgressPercentage(myService.status);
                const daysAgo = Math.floor((new Date() - new Date(myService.createdAt)) / (1000 * 60 * 60 * 24));

                return (
                  <div
                    key={myService.myServiceId}
                    className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                      <img
                        src={service.photoUrl || `https://via.placeholder.com/400x224/2563eb/ffffff?text=${encodeURIComponent(service.name?.substring(0, 20) || 'Service')}`}
                        alt={service.name}
                        className="w-full h-full object-cover  transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-4 left-4">
                        <StatusBadge status={myService.status} />
                      </div>
                      <div className="absolute top-4 right-4">
                        <ServiceTypeBadge type={service.serviceType} />
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="flex items-center justify-between">
                          <div className="text-white font-bold text-lg drop-shadow-lg">
                            ₹{formatPrice(service.finalIndividualPrice)}
                          </div>
                          <div className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-white text-xs font-semibold">
                            {daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : `${daysAgo} days ago`}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-gray-900 text-xl mb-2 line-clamp-1">
                            {service.name}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {service.description}
                          </p>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                          <ExternalLink size={18} />
                        </button>
                      </div>

                      <div className="mb-5">
                        <div className="flex justify-between text-sm mb-3">
                          <span className="font-semibold text-gray-700 flex items-center gap-2">
                            <TrendingUp size={14} className="text-primary" />
                            Progress
                          </span>
                          <span className="font-bold text-primary">{progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                          <div 
                            className="h-full bg-gradient-to-r from-primary to-primary-dark rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-6">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                            <Clock size={12} />
                            Duration
                          </div>
                          <div className="font-bold text-gray-900 text-sm">
                            {service.duration || 'N/A'} {service.durationUnit?.toLowerCase() || ''}
                          </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                            <Calendar size={12} />
                            Frequency
                          </div>
                          <div className="font-bold text-gray-900 text-sm">
                            {service.frequency || 'One-time'}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button 
                          onClick={() => handleViewDetails(myService)}
                          disabled={isModalTransitioning}
                          className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Eye size={18} />
                          View
                        </button>
                        
                        {myService.status === "NOT_STARTED" ? (
                          <button 
                            onClick={() => handleGetStarted(myService)}
                            disabled={isModalTransitioning}
                            className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald/20 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Play size={18} />
                            Start
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleViewDetails(myService)}
                            disabled={isModalTransitioning}
                            className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ChevronRightIcon size={18} />
                            Details
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredServices.length > itemsPerPage && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredServices.length)} of {filteredServices.length} services
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
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
                    {getPageNumbers().map((pageNum, index) => (
                      pageNum === '...' ? (
                        <span key={`dots-${index}`} className="px-3 py-2 text-gray-400">
                          <MoreHorizontal size={16} />
                        </span>
                      ) : (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                            currentPage === pageNum
                              ? `${primary.bg} text-white shadow-lg shadow-primary/20`
                              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                      currentPage === totalPages
                        ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                    }`}
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRightIcon size={18} />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Go to:</span>
                  <div className="relative">
                    <select
                      value={currentPage}
                      onChange={(e) => handlePageChange(Number(e.target.value))}
                      className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white pr-8"
                    >
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <option key={page} value={page}>Page {page}</option>
                      ))}
                    </select>
                    <ChevronRightIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400 pointer-events-none" size={16} />
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {!loading && filteredServices.length > 0 && (
          <div className="mt-16">
            <div className="relative overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10" />
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full -translate-y-32 translate-x-32" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/10 rounded-full translate-y-24 -translate-x-24" />
              
              <div className="relative p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="flex items-start gap-5">
                    <div className="p-4 bg-gradient-to-br from-primary to-primary-dark rounded-xl shadow-lg">
                      <Users size={32} className="text-white" />
                    </div>
                    <div className="max-w-2xl">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Premium Support Available 24/7</h3>
                      <p className="text-gray-700 mb-4">
                        Our dedicated support team is here to ensure your services run smoothly. 
                        Get instant help via chat, phone, or email.
                      </p>
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span>Average response time: <span className="font-semibold">2 minutes</span></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span>Satisfaction rate: <span className="font-semibold">98%</span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button className="px-6 py-3.5 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/20">
                      <MessageSquare size={20} />
                      Chat Now
                    </button>
                    <button className="px-6 py-3.5 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-3">
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