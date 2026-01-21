import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Plus, 
  X, 
  Trash2, 
  Edit2, 
  Package, 
  ChevronRight, 
  Filter, 
  DollarSign,
  Percent,
  ShoppingBag,
  Check,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import axiosInstance from '@src/providers/axiosInstance';

export default function AddBundleService() {
  // States
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [bundleDetails, setBundleDetails] = useState({
    name: "",
    description: "",
    bundlePrice: "",
    bundleOfferPrice: "",
    isGstApplicable: true,
    gstPercentage: "18"
  });
  const [creatingBundle, setCreatingBundle] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Pagination states
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9,
    totalPages: 1,
    totalItems: 0
  });

  // Fetch services
  const fetchServices = useCallback(async (page = 1, search = "") => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        `https://insightsconsult-backend.onrender.com/service?limit=9&page=${page}${search ? `&search=${search}` : ''}`
      );
      
      if (response.data.success) {
        setServices(response.data.data);
        setPagination({
          page: response.data.pagination.page,
          limit: response.data.pagination.limit,
          totalPages: response.data.pagination.totalPages,
          totalItems: response.data.data.length
        });
      }
    } catch (err) {
      console.error("Error fetching services:", err);
      setError("Failed to load services. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  // Handle search
  const handleSearch = () => {
    fetchServices(1, searchQuery);
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchServices(newPage, searchQuery);
    }
  };

  // Toggle service selection
  const toggleServiceSelection = (service) => {
    setSelectedServices(prev => {
      const isSelected = prev.some(s => s.serviceId === service.serviceId);
      if (isSelected) {
        return prev.filter(s => s.serviceId !== service.serviceId);
      } else {
        return [...prev, service];
      }
    });
  };

  // Remove selected service
  const removeSelectedService = (serviceId) => {
    setSelectedServices(prev => prev.filter(s => s.serviceId !== serviceId));
  };

  // Calculate bundle prices
  const calculateBundlePrices = () => {
    const totalIndividualPrice = selectedServices.reduce((sum, service) => {
      return sum + parseInt(service.individualPrice || 0);
    }, 0);

    const totalOfferPrice = selectedServices.reduce((sum, service) => {
      return sum + parseInt(service.offerPrice || 0);
    }, 0);

    return { totalIndividualPrice, totalOfferPrice };
  };

  // Calculate discount percentage
  const calculateDiscount = () => {
    const { totalIndividualPrice } = calculateBundlePrices();
    const offerPrice = parseFloat(bundleDetails.bundleOfferPrice) || totalIndividualPrice;
    if (totalIndividualPrice === 0) return 0;
    return Math.round(((totalIndividualPrice - offerPrice) / totalIndividualPrice) * 100);
  };

  // Calculate final price with GST
  const calculateFinalPrice = () => {
    const offerPrice = parseFloat(bundleDetails.bundleOfferPrice) || calculateBundlePrices().totalOfferPrice;
    if (!bundleDetails.isGstApplicable) {
      return Math.round(offerPrice);
    }
    const gstPercentage = parseFloat(bundleDetails.gstPercentage) || 0;
    const gstAmount = (offerPrice * gstPercentage) / 100;
    return Math.round(offerPrice + gstAmount);
  };

  // Handle GST toggle
  const handleGstToggle = (isApplicable) => {
    setBundleDetails(prev => ({
      ...prev,
      isGstApplicable: isApplicable,
      gstPercentage: isApplicable ? "18" : "0"
    }));
  };

  // Handle bundle creation
  const handleCreateBundle = async () => {
    // Validation
    if (!bundleDetails.name.trim()) {
      setError("Bundle name is required");
      return;
    }
    if (!bundleDetails.description.trim()) {
      setError("Bundle description is required");
      return;
    }
    if (selectedServices.length === 0) {
      setError("Please select at least one service for the bundle");
      return;
    }
    if (!bundleDetails.bundleOfferPrice || parseFloat(bundleDetails.bundleOfferPrice) <= 0) {
      setError("Please enter a valid offer price");
      return;
    }
    if (bundleDetails.isGstApplicable && (!bundleDetails.gstPercentage || parseFloat(bundleDetails.gstPercentage) <= 0)) {
      setError("Please enter a valid GST percentage");
      return;
    }

    try {
      setCreatingBundle(true);
      setError("");
      
      // Calculate prices
      const bundlePrice = parseFloat(bundleDetails.bundlePrice) || calculateBundlePrices().totalIndividualPrice;
      const bundleOfferPrice = parseFloat(bundleDetails.bundleOfferPrice);
      const finalBundlePrice = calculateFinalPrice();
      const isGstApplicable = bundleDetails.isGstApplicable;
      const gstPercentage = parseFloat(bundleDetails.gstPercentage) || 0;

      // Create payload
      const payload = {
        name: bundleDetails.name.trim(),
        description: bundleDetails.description.trim(),
        bundlePrice: bundlePrice,
        bundleOfferPrice: bundleOfferPrice,
        finalBundlePrice: finalBundlePrice,
        isGstApplicable: isGstApplicable,
        gstPercentage: gstPercentage,
        serviceIds: selectedServices.map(s => s.serviceId)
      };

      console.log("Creating bundle with payload:", JSON.stringify(payload, null, 2));

      const response = await axiosInstance.post(
        "https://insightsconsult-backend.onrender.com/bundle",
        payload
      );

      if (response.data.success) {
        setSuccess("Bundle created successfully!");
        
        // Reset form
        setBundleDetails({
          name: "",
          description: "",
          bundlePrice: "",
          bundleOfferPrice: "",
          isGstApplicable: true,
          gstPercentage: "18"
        });
        setSelectedServices([]);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (err) {
      console.error("Error creating bundle:", err);
      console.error("Error response:", err.response?.data);
      
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to create bundle. Please try again.");
      }
    } finally {
      setCreatingBundle(false);
    }
  };

  // Clear all selections
  const handleClearAll = () => {
    setBundleDetails({
      name: "",
      description: "",
      bundlePrice: "",
      bundleOfferPrice: "",
      isGstApplicable: true,
      gstPercentage: "18"
    });
    setSelectedServices([]);
    setError("");
    setSuccess("");
  };

  // Format price
  const formatPrice = (price) => {
    return parseInt(price || 0).toLocaleString('en-IN');
  };

  // Service card component
  const ServiceCard = ({ service, isSelected, onToggle }) => {
    return (
      <div
        className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
          isSelected 
            ? 'border-primary bg-primary-50 shadow-md' 
            : 'border-gray-200 hover:border-primary hover:shadow-sm'
        }`}
        onClick={() => onToggle(service)}
      >
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <div className="flex-shrink-0 mt-1">
            <div className={`w-5 h-5 rounded border flex items-center justify-center ${
              isSelected 
                ? 'bg-primary border-primary text-white' 
                : 'border-gray-300'
            }`}>
              {isSelected && <Check size={12} />}
            </div>
          </div>

          {/* Service Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <h4 className="font-medium text-gray-900 text-sm truncate">
                {service.name}
              </h4>
              {service.serviceType === "RECURRING" && (
                <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                  Recurring
                </span>
              )}
            </div>
            
            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
              {service.description}
            </p>
            
            <div className="mt-3 flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold text-gray-900">
                    ₹{formatPrice(service.offerPrice)}
                  </span>
                  {service.individualPrice !== service.offerPrice && (
                    <span className="text-xs text-gray-500 line-through">
                      ₹{formatPrice(service.individualPrice)}
                    </span>
                  )}
                </div>
                {service.frequency && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {service.frequency.toLowerCase()}
                  </p>
                )}
                {service.isGstApplicable === "true" && (
                  <p className="text-xs text-blue-600 mt-0.5">
                    GST: {service.gstPercentage}%
                  </p>
                )}
              </div>
              
              <div className="text-xs text-gray-500">
                ID: {service.serviceId.substring(0, 8)}...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Selected service item component
  const SelectedServiceItem = ({ service, onRemove }) => {
    return (
      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Package size={14} className="text-primary" />
            <h5 className="font-medium text-gray-900 text-sm truncate">
              {service.name}
            </h5>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm font-semibold text-primary">
              ₹{formatPrice(service.offerPrice)}
            </span>
            {service.individualPrice !== service.offerPrice && (
              <span className="text-xs text-gray-500 line-through">
                ₹{formatPrice(service.individualPrice)}
              </span>
            )}
          </div>
          {service.isGstApplicable === "true" && (
            <p className="text-xs text-blue-600 mt-1">
              GST: {service.gstPercentage}%
            </p>
          )}
        </div>
        <button
          onClick={() => onRemove(service.serviceId)}
          className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
        >
          <X size={16} />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={() => window.history.back()}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create Service Bundle</h1>
              <p className="text-gray-600 mt-1">
                Combine multiple services into a single bundle offer
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Bundle Details */}
          <div className="lg:col-span-2">
            {/* Bundle Details Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-50 rounded-lg">
                    <Package className="text-primary" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Bundle Details</h2>
                    <p className="text-sm text-gray-600">Enter basic information about your bundle</p>
                  </div>
                </div>
                <button
                  onClick={handleClearAll}
                  className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 border border-red-200 rounded-lg font-medium flex items-center gap-2"
                >
                  <X size={16} />
                  Clear All
                </button>
              </div>

              {/* Success Message */}
              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle size={18} />
                    <span className="font-medium">{success}</span>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertTriangle size={18} />
                    <span className="font-medium">
                      {error.length > 200 ? error.substring(0, 200) + "..." : error}
                    </span>
                  </div>
                </div>
              )}

              <div className="space-y-5">
                {/* Bundle Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Bundle Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={bundleDetails.name}
                    onChange={(e) => setBundleDetails(prev => ({
                      ...prev,
                      name: e.target.value
                    }))}
                    placeholder="e.g., Startup Compliance Bundle"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                {/* Bundle Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Bundle Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={bundleDetails.description}
                    onChange={(e) => setBundleDetails(prev => ({
                      ...prev,
                      description: e.target.value
                    }))}
                    placeholder="e.g., Complete GST, MSME, and Accounting services for startups"
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                </div>

                {/* GST Configuration */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-3">
                      GST Configuration
                    </label>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => handleGstToggle(true)}
                        className={`flex-1 py-3 rounded-lg border flex flex-col items-center justify-center gap-2 ${
                          bundleDetails.isGstApplicable
                            ? 'bg-green-50 border-green-300 text-green-700'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <CheckCircle size={20} />
                        <span className="font-medium">GST Applicable</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleGstToggle(false)}
                        className={`flex-1 py-3 rounded-lg border flex flex-col items-center justify-center gap-2 ${
                          !bundleDetails.isGstApplicable
                            ? 'bg-gray-100 border-gray-400 text-gray-800'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <X size={20} />
                        <span className="font-medium">No GST</span>
                      </button>
                    </div>
                  </div>

                  {bundleDetails.isGstApplicable && (
                    <div>
                      <label className="block text-sm font-medium text-gray-800 mb-2">
                        GST Percentage <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={bundleDetails.gstPercentage}
                          onChange={(e) => setBundleDetails(prev => ({
                            ...prev,
                            gstPercentage: e.target.value
                          }))}
                          placeholder="Enter GST percentage"
                          className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        />
                        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          %
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Standard GST rate is 18%. You can adjust as needed.
                      </p>
                    </div>
                  )}
                </div>

                {/* Price Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">
                      Original Price (₹)
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        ₹
                      </div>
                      <input
                        type="number"
                        min="0"
                        value={bundleDetails.bundlePrice || calculateBundlePrices().totalIndividualPrice}
                        onChange={(e) => setBundleDetails(prev => ({
                          ...prev,
                          bundlePrice: e.target.value
                        }))}
                        placeholder="Total original price"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Calculated total: ₹{formatPrice(calculateBundlePrices().totalIndividualPrice)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">
                      Offer Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        ₹
                      </div>
                      <input
                        type="number"
                        min="0"
                        value={bundleDetails.bundleOfferPrice}
                        onChange={(e) => setBundleDetails(prev => ({
                          ...prev,
                          bundleOfferPrice: e.target.value
                        }))}
                        placeholder="Discounted bundle price"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                    {bundleDetails.bundlePrice && bundleDetails.bundleOfferPrice && (
                      <p className="text-xs text-green-600 font-medium mt-1">
                        {calculateDiscount()}% discount applied
                      </p>
                    )}
                  </div>
                </div>

                {/* Final Price Preview */}
                <div className={`p-4 rounded-lg border ${
                  bundleDetails.isGstApplicable 
                    ? 'bg-blue-50 border-blue-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-medium ${
                        bundleDetails.isGstApplicable ? 'text-blue-800' : 'text-gray-800'
                      }`}>
                        Final Bundle Price {bundleDetails.isGstApplicable ? '(incl. GST)' : ''}
                      </p>
                      {bundleDetails.isGstApplicable && (
                        <p className="text-xs text-blue-600 mt-0.5">
                          {bundleDetails.gstPercentage}% GST will be applied
                        </p>
                      )}
                    </div>
                    <p className={`text-xl font-bold ${
                      bundleDetails.isGstApplicable ? 'text-blue-800' : 'text-gray-800'
                    }`}>
                      ₹{formatPrice(calculateFinalPrice())}
                    </p>
                  </div>
                </div>

                {/* Selected Services Preview */}
                {selectedServices.length > 0 && (
                  <div className="pt-5 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">
                        Selected Services ({selectedServices.length})
                      </h3>
                      <button
                        onClick={() => fetchServices(1, "")}
                        className="text-sm text-primary font-medium hover:underline"
                      >
                        Add More
                      </button>
                    </div>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {selectedServices.map(service => (
                        <SelectedServiceItem
                          key={service.serviceId}
                          service={service}
                          onRemove={removeSelectedService}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Create Bundle Button */}
                <div className="pt-5 border-t border-gray-200">
                  <button
                    onClick={handleCreateBundle}
                    disabled={creatingBundle || selectedServices.length === 0}
                    className="w-full bg-primary text-white py-3.5 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {creatingBundle ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Creating Bundle...
                      </>
                    ) : (
                      <>
                        <Package size={18} />
                        Create Bundle
                      </>
                    )}
                  </button>
                  <p className="text-xs text-gray-500 text-center mt-3">
                    Bundle will be available for purchase immediately after creation
                  </p>
                </div>
              </div>
            </div>

          
          </div>

          {/* Right Column - Service Selector */}
          <div>
            <div className="sticky top-8">
              {/* Service Selector Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Select Services</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Choose services to include in your bundle
                    </p>
                  </div>
                  <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    {selectedServices.length} selected
                  </div>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder="Search services by name..."
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                    <button
                      onClick={handleSearch}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary font-medium text-sm"
                    >
                      Search
                    </button>
                  </div>
                </div>

                {/* Services List */}
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-12">
                      <Loader2 className="animate-spin text-primary mx-auto mb-3" size={32} />
                      <p className="text-gray-600">Loading services...</p>
                    </div>
                  ) : services.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="text-gray-400 mx-auto mb-3" size={32} />
                      <p className="text-gray-600">No services found</p>
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          fetchServices();
                        }}
                        className="text-primary font-medium text-sm mt-2 hover:underline"
                      >
                        Clear search
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                      {services.map(service => (
                        <ServiceCard
                          key={service.serviceId}
                          service={service}
                          isSelected={selectedServices.some(s => s.serviceId === service.serviceId)}
                          onToggle={toggleServiceSelection}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Pagination */}
                {services.length > 0 && pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="text-sm text-gray-600">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}

                {/* Tips */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">Tips for creating bundles:</h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li className="flex items-start gap-2">
                      <ChevronRight size={12} className="text-primary mt-0.5" />
                      <span>Combine related services for better value</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight size={12} className="text-primary mt-0.5" />
                      <span>Offer at least 20% discount on the bundle</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight size={12} className="text-primary mt-0.5" />
                      <span>Keep bundle name clear and descriptive</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <ChevronRight size={12} className="text-primary mt-0.5" />
                      <span>Configure GST based on your service requirements</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

       
      </div>
    </div>
  );
}