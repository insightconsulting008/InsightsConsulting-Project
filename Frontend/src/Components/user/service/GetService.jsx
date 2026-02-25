import { useEffect, useState, useCallback } from "react";
import axiosInstance from "@src/providers/axiosInstance";
import { X, Phone, Search, Clock, FileText, Shield, CheckCircle, ArrowRight, Tag, Calendar, BadgeCheck, Loader2, Package, Layers, Star } from "lucide-react";

export default function GetService() {
  const [services, setServices] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredServices, setFilteredServices] = useState([]);
  const [filteredBundles, setFilteredBundles] = useState([]);
  const [serviceStats, setServiceStats] = useState({ 
    total: 0, 
    filtered: 0,
    bundles: 0
  });
  
  // View mode: 'services' or 'bundles'
  const [viewMode, setViewMode] = useState("services");
  
  // New states for payment popup
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [showBundlePaymentPopup, setShowBundlePaymentPopup] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  // Hardcoded user ID as requested
  const userId = "cmjsacjjh0000tzdotm5dqv7r";

  // Primary color config
  const primary = {
    bg: "bg-primary",
    text: "text-primary",
    hover: "hover:bg-primary-dark",
    light: "bg-primary-50",
    border: "border-primary",
    ring: "ring-primary/20"
  };

  /* ---------------- FETCH CATEGORIES ---------------- */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get(
          "https://insightsconsult-backend.onrender.com/category"
        );
        setCategories(res.data.categories);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  /* ---------------- FETCH SUBCATEGORIES ---------------- */
  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const res = await axiosInstance.get(
          "https://insightsconsult-backend.onrender.com/subcategory"
        );
        setSubCategories(res.data.subcategories);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSubCategories();
  }, []);

  /* ---------------- FETCH SERVICE LIST ---------------- */
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axiosInstance.get(
          "https://insightsconsult-backend.onrender.com/service?limit=100&page=1"
        );
        setServices(res.data.data);
        setFilteredServices(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchServices();
  }, []);

  /* ---------------- FETCH BUNDLE LIST ---------------- */
  useEffect(() => {
    const fetchBundles = async () => {
      try {
        const res = await axiosInstance.get(
          "https://insightsconsult-backend.onrender.com/bundle"
        );
        setBundles(res.data.bundles);
        setFilteredBundles(res.data.bundles);
        setServiceStats(prev => ({
          ...prev,
          bundles: res.data.bundles.length
        }));
      } catch (error) {
        console.error(error);
      }
    };
    fetchBundles();
  }, []);

  /* ---------------- UPDATE STATS ---------------- */
  useEffect(() => {
    setServiceStats(prev => ({
      ...prev,
      total: services.length,
      filtered: viewMode === "services" ? filteredServices.length : filteredBundles.length
    }));
  }, [services.length, filteredServices.length, filteredBundles.length, viewMode]);

  /* ---------------- FILTER SERVICES ---------------- */
  useEffect(() => {
    let result = services;

    // Search filter
    if (searchQuery) {
      result = result.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      const subCatIds = subCategories
        .filter(sub => sub.categoryId === selectedCategory)
        .map(sub => sub.subCategoryId);
      
      result = result.filter(service => 
        subCatIds.includes(service.subCategoryId)
      );
    }

    // Subcategory filter
    if (selectedSubCategory !== "all") {
      result = result.filter(service => 
        service.subCategoryId === selectedSubCategory
      );
    }

    setFilteredServices(result);
  }, [searchQuery, selectedCategory, selectedSubCategory, services, subCategories]);

  /* ---------------- FILTER BUNDLES ---------------- */
  useEffect(() => {
    let result = bundles;

    // Search filter for bundles
    if (searchQuery) {
      result = result.filter(bundle =>
        bundle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bundle.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bundle.services.some(service => 
          service.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Category filter for bundles
    if (selectedCategory !== "all") {
      const subCatIds = subCategories
        .filter(sub => sub.categoryId === selectedCategory)
        .map(sub => sub.subCategoryId);
      
      result = result.filter(bundle => 
        bundle.services.some(service => 
          subCatIds.includes(service.subCategoryId)
        )
      );
    }

    // Subcategory filter for bundles
    if (selectedSubCategory !== "all") {
      result = result.filter(bundle => 
        bundle.services.some(service => 
          service.subCategoryId === selectedSubCategory
        )
      );
    }

    setFilteredBundles(result);
  }, [searchQuery, selectedCategory, selectedSubCategory, bundles, subCategories]);

  /* ---------------- FETCH SINGLE SERVICE ---------------- */
  const openService = async (serviceId) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `https://insightsconsult-backend.onrender.com/service/${serviceId}`
      );
      setSelectedService(res.data.service);
      setSelectedBundle(null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- FETCH SINGLE BUNDLE ---------------- */
  const openBundle = async (bundleId) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `https://insightsconsult-backend.onrender.com/bundle/${bundleId}/details`
      );
      setSelectedBundle(res.data.bundle);
      setSelectedService(null);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

 /* ---------------- SINGLE PAYMENT HANDLER FOR BOTH SERVICE AND BUNDLE ---------------- */
const handlePayment = async () => {
  // Check what's selected
  if (!selectedService && !selectedBundle) {
    setPaymentError("No service or bundle selected");
    return;
  }

  if (!userId) {
    setPaymentError("User information missing");
    return;
  }

  setIsProcessingPayment(true);
  setPaymentError(null);
  setPaymentSuccess(false);

  try {
    // Calculate total amount as a number based on selection
    const totalAmount = selectedService 
      ? Number(selectedService.finalIndividualPrice) 
      : Number(selectedBundle.finalBundlePrice);

    // Build payload dynamically based on what's selected
    const payload = {
      userId: userId,
      amount: totalAmount  // Amount is already a number
    };

    // Add serviceId if service is selected, otherwise add bundleId
    if (selectedService) {
      payload.serviceId = selectedService.serviceId;
      console.log("Sending service payment request:", payload);
    } else if (selectedBundle) {
      payload.bundleId = selectedBundle.bundleId;
      console.log("Sending bundle payment request:", payload);
    }

    // Single API call for both
    const response = await axiosInstance.post(
      "https://insightsconsult-backend.onrender.com/buy/service",
      payload
    );

    console.log("Payment response:", response.data);

    var options = {
      "key": response.data.key, // Enter the Key ID generated from the Dashboard
      "amount": response.data.amount,// Convert to paise (Razorpay expects amount in paise)
      "currency": "INR",
      "order_id": response.data.orderId, // Use the order_id from your API response
      "handler": function (response){
        alert(response.razorpay_payment_id);
        alert(response.razorpay_order_id);
        alert(response.razorpay_signature);
        
        // You might want to verify the payment here
        setPaymentData(response.data);
        setPaymentSuccess(true);
        
        // Close popups after successful payment
        setTimeout(() => {
          setShowPaymentPopup(false);
          setShowBundlePaymentPopup(false);
          setPaymentSuccess(false);
          setPaymentData(null);
          setSelectedService(null);
          setSelectedBundle(null);
        }, 3000);
      },
      "prefill": {
        "name": "Gaurav Kumar", // You can get this from user data if available
        "email": "gaurav.kumar@example.com",
        "contact": "+919876543210"
      },
    };
    
    var rzp1 = new Razorpay(options);
    rzp1.open();

  } catch (error) {
    console.error("Payment error:", error);
    setPaymentError(
      error.response?.data?.message || 
      error.message || 
      "Failed to process payment. Please try again."
    );
  } finally {
    setIsProcessingPayment(false);
  }
};

  /* ---------------- GET CATEGORY/SUBCATEGORY NAME ---------------- */
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.categoryId === categoryId);
    return category ? category.categoryName : "Uncategorized";
  };

  const getSubCategoryName = (subCategoryId) => {
    const subCategory = subCategories.find(sub => sub.subCategoryId === subCategoryId);
    return subCategory ? subCategory.subCategoryName : "Uncategorized";
  };

  /* ---------------- FORMAT PRICE ---------------- */
  const formatPrice = (price) => {
    return parseInt(price || 0).toLocaleString('en-IN');
  };

  /* ---------------- SERVICE TYPE BADGE ---------------- */
  const ServiceTypeBadge = ({ type }) => {
    const config = {
      ONE_TIME: { label: "One Time", color: "bg-gray-50 text-primary border border-primary-200" },
      RECURRING: { label: "Subscription", color: "bg-green-100 text-green-700 border border-green-200" }
    };
    
    const { label, color } = config[type] || { label: type, color: "bg-gray-100 text-gray-700 border border-gray-200" };
    
    return (
      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${color}`}>
        {label}
      </span>
    );
  };

  /* ---------------- BUNDLE BADGE ---------------- */
  const BundleBadge = () => (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700 border border-purple-200`}>
      <Package size={12} className="inline mr-1" />
      Bundle
    </span>
  );

  /* ---------------- GET CATEGORY SUBCATEGORIES ---------------- */
  const getCategorySubCategories = (categoryId) => {
    return subCategories.filter(sub => sub.categoryId === categoryId);
  };

  /* ---------------- FORMAT IMAGE URL ---------------- */
  const formatImageUrl = (url, serviceName) => {
    if (!url) {
      return `https://via.placeholder.com/1024x512/2563eb/ffffff?text=${encodeURIComponent(serviceName?.substring(0, 20) || 'Service')}`;
    }
    
    if (url.includes('via.placeholder.com')) {
      return url.replace(/\d+x\d+/, '1024x512');
    }
    
    return url;
  };

  /* ---------------- GET BUNDLE IMAGE ---------------- */
  const getBundleImage = (bundle) => {
    if (bundle.services && bundle.services.length > 0) {
      return formatImageUrl(bundle.services[0].photoUrl, bundle.name);
    }
    return `https://via.placeholder.com/1024x512/8b5cf6/ffffff?text=${encodeURIComponent(bundle.name?.substring(0, 20) || 'Bundle')}`;
  };

  /* ---------------- CALCULATE BUNDLE SAVINGS ---------------- */
  const calculateBundleSavings = (bundle) => {
    const individualTotal = bundle.services?.reduce((sum, service) => 
      sum + parseInt(service.offerPrice || 0), 0) || 0;
    return individualTotal - bundle.bundleOfferPrice;
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Add CSS for primary colors */}
      <style jsx>{`
        :root {
          --primary: #2563eb;
          --primary-dark: #1d4ed8;
          --primary-50: #eff6ff;
          --primary-100: #dbeafe;
          --primary-200: #bfdbfe;
        }
      `}</style>

      {/* ================= SINGLE PAYMENT POPUP MODAL (WORKS FOR BOTH SERVICE AND BUNDLE) ================= */}
      {(showPaymentPopup || showBundlePaymentPopup) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
            {/* Header */}
            <div className="border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedService ? 'Confirm Payment' : 'Confirm Bundle Payment'}
                </h3>
                <button
                  onClick={() => {
                    setShowPaymentPopup(false);
                    setShowBundlePaymentPopup(false);
                    setPaymentError(null);
                    setPaymentSuccess(false);
                  }}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                  disabled={isProcessingPayment}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {paymentSuccess ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="text-green-600" size={32} />
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    Payment Successful!
                  </h4>
                  <p className="text-gray-600 mb-4">
                    Your {selectedService ? 'service' : 'bundle'} purchase has been processed successfully.
                  </p>
                  {paymentData?.orderId && (
                    <div className="bg-gray-50 p-3 rounded-lg mb-4">
                      <p className="text-sm text-gray-600">Order ID</p>
                      <p className="font-mono text-sm font-semibold text-gray-900">
                        {paymentData.orderId}
                      </p>
                    </div>
                  )}
                  <div className="text-sm text-gray-500">
                    Redirecting in 3 seconds...
                  </div>
                </div>
              ) : (
                <>
                  {/* Service or Bundle Info */}
                  {selectedService && (
                    <div className="mb-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={formatImageUrl(selectedService.photoUrl, selectedService.name)}
                            alt={selectedService.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {selectedService.name}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {getSubCategoryName(selectedService.subCategoryId)}
                          </p>
                        </div>
                      </div>

                      {/* Price Breakdown */}
                      <div className="space-y-2 border-t border-gray-200 pt-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Service Price</span>
                          <span>₹{formatPrice(selectedService.offerPrice)}</span>
                        </div>
                        {selectedService.isGstApplicable === "true" && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">GST ({selectedService.gstPercentage}%)</span>
                            <span>₹{formatPrice((selectedService.offerPrice * selectedService.gstPercentage) / 100)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2">
                          <span>Total Amount</span>
                          <span>₹{formatPrice(selectedService.finalIndividualPrice)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedBundle && (
                    <div className="mb-6">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 bg-purple-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                          <Package className="text-purple-600" size={24} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {selectedBundle.name}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {selectedBundle.services?.length || 0} services included
                          </p>
                        </div>
                      </div>

                      {/* Price Breakdown */}
                      <div className="space-y-2 border-t border-gray-200 pt-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Bundle Price</span>
                          <span>₹{formatPrice(selectedBundle.bundleOfferPrice)}</span>
                        </div>
                        {selectedBundle.isGstApplicable && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">GST ({selectedBundle.gstPercentage}%)</span>
                            <span>₹{formatPrice((selectedBundle.bundleOfferPrice * selectedBundle.gstPercentage) / 100)}</span>
                          </div>
                        )}
                        
                        {/* Savings Calculation */}
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Individual Price Total</span>
                            <span className="line-through">₹{formatPrice(selectedBundle.bundlePrice)}</span>
                          </div>
                          <div className="flex justify-between text-sm font-semibold text-green-700">
                            <span>You Save</span>
                            <span>₹{formatPrice(selectedBundle.bundlePrice - selectedBundle.bundleOfferPrice)}</span>
                          </div>
                        </div>

                        <div className="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2">
                          <span>Total Amount</span>
                          <span>₹{formatPrice(selectedBundle.finalBundlePrice)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* User Info */}
                  <div className="mb-6">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Payment Details</h5>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">User ID</span>
                        <span className="font-mono text-xs">{userId.substring(0, 12)}...</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{selectedService ? 'Service' : 'Bundle'} ID</span>
                        <span className="font-mono text-xs">
                          {selectedService 
                            ? selectedService?.serviceId?.substring(0, 12)
                            : selectedBundle?.bundleId?.substring(0, 12)
                          }...
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Error Message */}
                  {paymentError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{paymentError}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowPaymentPopup(false);
                        setShowBundlePaymentPopup(false);
                      }}
                      className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                      disabled={isProcessingPayment}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handlePayment}
                      disabled={isProcessingPayment}
                      className={`flex-1 py-3 ${selectedBundle ? 'bg-purple-600' : primary.bg} text-white rounded-lg font-medium ${selectedBundle ? 'hover:bg-purple-700' : primary.hover} transition-colors flex items-center justify-center gap-2`}
                    >
                      {isProcessingPayment ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Processing...
                        </>
                      ) : (
                        `Pay ₹${formatPrice(
                          selectedService 
                            ? selectedService?.finalIndividualPrice 
                            : selectedBundle?.finalBundlePrice || 0
                        )}`
                      )}
                    </button>
                  </div>

                  {/* Security Note */}
                  <p className="text-xs text-gray-500 text-center mt-4 flex items-center justify-center gap-1">
                    <Shield size={12} className="text-gray-400" />
                    Secure payment • 256-bit SSL encryption
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= HEADER ================= */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Title and Stats */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-6">
            <div className="lg:flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Services</h1>
              <p className="text-gray-600">Browse through our curated list of professional services and bundles</p>
            </div>

            {/* Search Bar and Stats */}
            <div className="lg:w-2/3 flex flex-col lg:flex-row lg:items-end gap-4">
              <div className="relative flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size={20} />
                  <input
                    type="text"
                    placeholder={`Search ${viewMode === 'services' ? 'services' : 'bundles'} by name or description...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-2.5 border border-gray-300 text-sm rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm"
                  />
                </div>
              </div>
              
              <div className="flex-shrink-0">
                <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2.5 rounded-lg whitespace-nowrap">
                  Showing <span className="font-semibold">{serviceStats.filtered}</span> of {viewMode === 'services' ? serviceStats.total : serviceStats.bundles} {viewMode === 'services' ? 'services' : 'bundles'}
                </div>
              </div>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode("services")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === "services"
                    ? `${primary.bg} text-white shadow-sm`
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Individual Services ({serviceStats.total})
              </button>
              <button
                onClick={() => setViewMode("bundles")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  viewMode === "bundles"
                    ? `${primary.bg} text-white shadow-sm`
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Package size={16} className="inline mr-2" />
                Bundles ({serviceStats.bundles})
              </button>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedSubCategory("all");
                }}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
                  selectedCategory === "all" 
                    ? `${primary.bg} text-white border-primary shadow-sm` 
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                }`}
              >
                All {viewMode === 'services' ? 'Services' : 'Bundles'}
              </button>

              {categories.map((category) => (
                <button
                  key={category.categoryId}
                  onClick={() => {
                    setSelectedCategory(category.categoryId);
                    setSelectedSubCategory("all");
                  }}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border ${
                    selectedCategory === category.categoryId 
                      ? `${primary.bg} text-white border-primary shadow-sm` 
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                  }`}
                >
                  {category.categoryName}
                </button>
              ))}
            </div>
          </div>

          {/* Subcategories */}
          {selectedCategory !== "all" && getCategorySubCategories(selectedCategory).length > 0 && (
            <div className="mb-2">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Subcategories</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedSubCategory("all")}
                  className={`px-3.5 py-1.5 rounded-full text-sm transition-all duration-200 border ${
                    selectedSubCategory === "all" 
                      ? `${primary.bg} text-white border-primary` 
                      : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  All
                </button>
                {getCategorySubCategories(selectedCategory).map((subCategory) => (
                  <button
                    key={subCategory.subCategoryId}
                    onClick={() => setSelectedSubCategory(subCategory.subCategoryId)}
                    className={`px-3.5 py-1.5 rounded-full text-sm transition-all duration-200 border ${
                      selectedSubCategory === subCategory.subCategoryId 
                        ? `${primary.bg} text-white border-primary` 
                        : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {subCategory.subCategoryName}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================= SERVICE/BUNDLE GRID ================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {viewMode === "services" ? (
          // SERVICES GRID
          filteredServices.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
                <Search className="text-gray-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No services found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Try adjusting your search or filter criteria. We have {serviceStats.total} services available.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedSubCategory("all");
                }}
                className={`mt-6 px-5 py-2.5 ${primary.bg} text-white rounded-lg font-medium hover:opacity-90 transition-opacity border border-primary`}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service) => (
                  <div
                    key={service.serviceId}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 group cursor-pointer hover:border-primary/30 flex flex-col h-full"
                    onClick={() => openService(service.serviceId)}
                  >
                    {/* Service Image - Square Container */}
                    <div className="relative aspect-square w-full overflow-hidden bg-gray-100">
                      <img
                        src={formatImageUrl(service.photoUrl, service.name)}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        width="1024"
                        height="512"
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/1024x512/2563eb/ffffff?text=${encodeURIComponent(service.name.substring(0, 20))}`;
                        }}
                      />
                      <div className="absolute top-4 left-4">
                        <ServiceTypeBadge type={service.serviceType} />
                      </div>
                      {/* Image Overlay Gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Service Content */}
                    <div className="p-5 flex-1 flex flex-col">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-2 mb-1">
                            {service.name}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {getCategoryName(subCategories.find(s => s.subCategoryId === service.subCategoryId)?.categoryId)} • {getSubCategoryName(service.subCategoryId)}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">
                        {service.description}
                      </p>

                      {/* Service Details */}
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                        {service.duration && (
                          <div className="flex items-center gap-1.5">
                            <Clock size={14} className="text-gray-400" />
                            <span>{service.duration} {service.durationUnit?.toLowerCase()}</span>
                          </div>
                        )}
                        {service.frequency && (
                          <div className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-gray-400" />
                            <span>{service.frequency}</span>
                          </div>
                        )}
                      </div>

                      {/* Price Section */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-gray-900">
                              ₹{formatPrice(service.offerPrice)}
                            </span>
                            {service.individualPrice !== service.offerPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                ₹{formatPrice(service.individualPrice)}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">+ Taxes applicable</p>
                        </div>

                        <button 
                          className={`flex items-center gap-1.5 ${primary.text} font-medium text-sm hover:gap-2 transition-all`}
                          onClick={(e) => {
                            e.stopPropagation();
                            openService(service.serviceId);
                          }}
                        >
                          View Details
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Show More (if needed) */}
              {filteredServices.length > 9 && (
                <div className="text-center mt-10">
                  <button className={`px-6 py-3 ${primary.bg} text-white rounded-lg font-medium hover:opacity-90 transition-opacity border border-primary shadow-sm`}>
                    Load More Services
                  </button>
                </div>
              )}
            </>
          )
        ) : (
          // BUNDLES GRID
          filteredBundles.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 mb-6">
                <Package className="text-purple-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No bundles found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Try adjusting your search or filter criteria. We have {serviceStats.bundles} bundles available.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedSubCategory("all");
                }}
                className={`mt-6 px-5 py-2.5 ${primary.bg} text-white rounded-lg font-medium hover:opacity-90 transition-opacity border border-primary`}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBundles.map((bundle) => {
                  const savings = calculateBundleSavings(bundle);
                  return (
                    <div
                      key={bundle.bundleId}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 group cursor-pointer hover:border-purple-300 flex flex-col h-full"
                      onClick={() => openBundle(bundle.bundleId)}
                    >
                      {/* Bundle Image - Square Container */}
                      <div className="relative aspect-square w-full overflow-hidden bg-purple-50">
                        <img
                          src={getBundleImage(bundle)}
                          alt={bundle.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                          width="1024"
                          height="512"
                          onError={(e) => {
                            e.target.src = `https://via.placeholder.com/1024x512/8b5cf6/ffffff?text=${encodeURIComponent(bundle.name.substring(0, 20))}`;
                          }}
                        />
                        <div className="absolute top-4 left-4 flex gap-2">
                          <BundleBadge />
                          {savings > 0 && (
                            <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 border border-green-200">
                              Save ₹{formatPrice(savings)}
                            </span>
                          )}
                        </div>
                        {/* Bundle Services Count */}
                        <div className="absolute top-4 right-4">
                          <div className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-medium text-gray-700 flex items-center gap-1">
                            <Layers size={12} />
                            {bundle.services?.length || 0} services
                          </div>
                        </div>
                        {/* Image Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>

                      {/* Bundle Content */}
                      <div className="p-5 flex-1 flex flex-col">
                        <div className="mb-3">
                          <h3 className="font-semibold text-gray-900 text-lg leading-tight line-clamp-2 mb-2">
                            {bundle.name}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-4 flex-1">
                            {bundle.description}
                          </p>
                        </div>

                        {/* Included Services Preview */}
                        {bundle.services && bundle.services.length > 0 && (
                          <div className="mb-4">
                            <div className="flex items-center gap-2 mb-2">
                              <CheckCircle size={14} className="text-green-500" />
                              <span className="text-xs font-medium text-gray-700">Includes:</span>
                            </div>
                            <div className="space-y-1">
                              {bundle.services.slice(0, 3).map((service, index) => (
                                <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                                  <span className="line-clamp-1">{service.name}</span>
                                </div>
                              ))}
                              {bundle.services.length > 3 && (
                                <div className="text-xs text-gray-500 pl-3">
                                  + {bundle.services.length - 3} more services
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Price Section */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                          <div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-bold text-gray-900">
                                ₹{formatPrice(bundle.bundleOfferPrice)}
                              </span>
                              <span className="text-sm text-gray-500 line-through">
                                ₹{formatPrice(bundle.bundlePrice)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Bundle price • Taxes applicable</p>
                          </div>

                          <button 
                            className={`flex items-center gap-1.5 ${primary.text} font-medium text-sm hover:gap-2 transition-all`}
                            onClick={(e) => {
                              e.stopPropagation();
                              openBundle(bundle.bundleId);
                            }}
                          >
                            View Bundle
                            <ArrowRight size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Show More (if needed) */}
              {filteredBundles.length > 9 && (
                <div className="text-center mt-10">
                  <button className={`px-6 py-3 ${primary.bg} text-white rounded-lg font-medium hover:opacity-90 transition-opacity border border-primary shadow-sm`}>
                    Load More Bundles
                  </button>
                </div>
              )}
            </>
          )
        )}
      </div>

      {/* ================= SERVICE DETAIL DRAWER ================= */}
      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white shadow-2xl z-50 transform transition-transform duration-300 border-l border-gray-200 ${
          selectedService ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {selectedService && (
          <>
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
              <div className="flex items-center justify-between p-4">
                <button
                  onClick={() => setSelectedService(null)}
                  className={`flex items-center gap-2 ${primary.text} font-medium text-sm hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors`}
                >
                  <X size={20} />
                  Close
                </button>

                <button className={`flex items-center gap-2 ${primary.bg} text-white px-4 py-2.5 rounded-lg text-sm font-medium ${primary.hover} border border-primary shadow-sm transition-colors`}>
                  <Phone size={16} />
                  Call Expert
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="h-[calc(100vh-64px)] overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading service details...</p>
                  </div>
                </div>
              ) : (
                <div className="p-6 space-y-6">
                  {/* Service Image & Header - Fixed */}
                  <div className="space-y-4">
                    <div className="rounded-xl overflow-hidden border border-gray-200">
                      <img
                        src={formatImageUrl(selectedService.photoUrl, selectedService.name)}
                        alt={selectedService.name}
                        className="w-full h-64 md:h-80 object-cover"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = `https://via.placeholder.com/1024x512/2563eb/ffffff?text=${encodeURIComponent(selectedService.name.substring(0, 20))}`;
                        }}
                      />
                    </div>

                    {/* Service Type Badges */}
                    <div className="flex items-center gap-2">
                      <ServiceTypeBadge type={selectedService.serviceType} />
                      {selectedService.frequency && (
                        <span className="px-2.5 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full border border-purple-200">
                          {selectedService.frequency}
                        </span>
                      )}
                    </div>

                    {/* Service Title and Category */}
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {selectedService.name}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {getCategoryName(subCategories.find(s => s.subCategoryId === selectedService.subCategoryId)?.categoryId)} • {getSubCategoryName(selectedService.subCategoryId)}
                      </p>
                    </div>
                  </div>

                  {/* Price Card */}
                  <div className={`${primary.light} p-5 rounded-xl border border-primary/30`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Starting at</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-gray-900">
                            ₹{formatPrice(selectedService.offerPrice)}
                          </span>
                          <span className="text-gray-500">+ Tax</span>
                        </div>
                        {selectedService.individualPrice !== selectedService.offerPrice && (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-gray-500 line-through">
                              ₹{formatPrice(selectedService.individualPrice)}
                            </span>
                            <span className="text-sm font-medium text-green-600">
                              Save ₹{formatPrice(selectedService.individualPrice - selectedService.offerPrice)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="text-left sm:text-right">
                        <div className="text-sm text-gray-600">Final Price</div>
                        <div className="text-xl font-bold text-gray-900">
                          ₹{formatPrice(selectedService.finalIndividualPrice)}
                        </div>
                        <div className="text-xs text-gray-500">
                          incl. GST {selectedService.gstPercentage}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <FileText size={18} className="text-gray-500" />
                      Service Overview
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {selectedService.description}
                    </p>
                  </div>

                  {/* Quick Details */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="text-xs text-gray-500">Service Type</div>
                      <div className="font-medium text-sm">{selectedService.serviceType.replace('_', ' ')}</div>
                    </div>
                    {selectedService.duration && (
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="text-xs text-gray-500">Duration</div>
                        <div className="font-medium text-sm">
                          {selectedService.duration} {selectedService.durationUnit?.toLowerCase()}
                        </div>
                      </div>
                    )}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="text-xs text-gray-500">GST</div>
                      <div className="font-medium text-sm">
                        {selectedService.isGstApplicable === "true" ? `Yes (${selectedService.gstPercentage}%)` : "No"}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <div className="text-xs text-gray-500">Documents</div>
                      <div className="font-medium text-sm">
                        {selectedService.documentsRequired === "true" ? "Required" : "Not Required"}
                      </div>
                    </div>
                  </div>

                  {/* Required Information */}
                  {selectedService.inputFields?.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Shield size={18} className="text-gray-500" />
                        Required Information
                      </h3>
                      <div className="space-y-2">
                        {selectedService.inputFields.map((field) => (
                          <div
                            key={field.fieldId}
                            className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm text-gray-900">
                                {field.label}
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                              </span>
                              <span className="text-xs font-medium bg-white text-gray-600 px-2 py-1 rounded border border-gray-300">
                                {field.type}
                              </span>
                            </div>
                            {field.placeholder && (
                              <p className="text-xs text-gray-500 mt-1">
                                {field.placeholder}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Process Steps */}
                  {selectedService.trackSteps?.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <CheckCircle size={18} className="text-gray-500" />
                        How It Works
                      </h3>
                      <div className="space-y-3">
                        {selectedService.trackSteps
                          .sort((a, b) => a.order - b.order)
                          .map((step) => (
                            <div key={step.stepId} className="flex items-start gap-3">
                              <div className={`flex-shrink-0 w-6 h-6 rounded-full ${primary.bg} text-white flex items-center justify-center text-xs font-bold mt-0.5`}>
                                {step.order}
                              </div>
                              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex-1">
                                <h4 className="font-medium text-gray-900">
                                  {step.title}
                                </h4>
                                <p className="text-gray-600 text-sm mt-0.5">
                                  {step.description}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* CTA - Updated to show popup */}
                  <div className="sticky bottom-0 pt-4 bg-white border-t border-gray-200 -mx-6 px-6 pb-6">
                    <button 
                      onClick={() => setShowPaymentPopup(true)}
                      className={`w-full ${primary.bg} text-white py-3.5 rounded-xl font-semibold text-lg ${primary.hover} transition-colors border border-primary shadow-sm`}
                    >
                      Proceed to Pay ₹{formatPrice(selectedService.finalIndividualPrice)}
                    </button>
                    <p className="text-center text-xs text-gray-500 mt-3">
                      <span className="inline-flex items-center gap-1">
                        <BadgeCheck size={12} className="text-green-500" />
                        Secure payment
                      </span>
                      <span className="mx-3">•</span>
                      <span>24/7 Support</span>
                      <span className="mx-3">•</span>
                      <span>100% Satisfaction</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* ================= BUNDLE DETAIL DRAWER ================= */}
      <div
        className={`fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white shadow-2xl z-50 transform transition-transform duration-300 border-l border-gray-200 ${
          selectedBundle ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {selectedBundle && (
          <>
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
              <div className="flex items-center justify-between p-4">
                <button
                  onClick={() => setSelectedBundle(null)}
                  className={`flex items-center gap-2 ${primary.text} font-medium text-sm hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors`}
                >
                  <X size={20} />
                  Close
                </button>

                <button className={`flex items-center gap-2 ${primary.bg} text-white px-4 py-2.5 rounded-lg text-sm font-medium ${primary.hover} border border-primary shadow-sm transition-colors`}>
                  <Phone size={16} />
                  Call Expert
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="h-[calc(100vh-64px)] overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading bundle details...</p>
                  </div>
                </div>
              ) : (
                <div className="p-6 space-y-6">
                  {/* Bundle Header */}
                  <div className="space-y-4">
                    <div className="rounded-xl overflow-hidden border border-gray-200 bg-purple-50 p-8 flex items-center justify-center">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                          <Package className="text-purple-600" size={32} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Bundle Package</h3>
                      </div>
                    </div>

                    {/* Bundle Title and Badges */}
                    <div className="flex items-center gap-2">
                      <BundleBadge />
                      {calculateBundleSavings(selectedBundle) > 0 && (
                        <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700 border border-green-200">
                          Save ₹{formatPrice(calculateBundleSavings(selectedBundle))}
                        </span>
                      )}
                    </div>

                    {/* Bundle Title */}
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {selectedBundle.name}
                      </h2>
                      <p className="text-sm text-gray-600">
                        {selectedBundle.services?.length || 0} services included
                      </p>
                    </div>
                  </div>

                  {/* Price Card */}
                  <div className={`bg-purple-50 p-5 rounded-xl border border-purple-200`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Bundle Price</p>
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-bold text-gray-900">
                            ₹{formatPrice(selectedBundle.bundleOfferPrice)}
                          </span>
                          <span className="text-gray-500">+ Tax</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-gray-500 line-through">
                            ₹{formatPrice(selectedBundle.bundlePrice)}
                          </span>
                          <span className="text-sm font-medium text-green-600">
                            Save ₹{formatPrice(selectedBundle.bundlePrice - selectedBundle.bundleOfferPrice)}
                          </span>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <div className="text-sm text-gray-600">Final Price</div>
                        <div className="text-xl font-bold text-gray-900">
                          ₹{formatPrice(selectedBundle.finalBundlePrice)}
                        </div>
                        <div className="text-xs text-gray-500">
                          incl. GST {selectedBundle.gstPercentage}%
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <FileText size={18} className="text-gray-500" />
                      Bundle Overview
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {selectedBundle.description}
                    </p>
                  </div>

                  {/* Included Services */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                      <CheckCircle size={18} className="text-green-500" />
                      Included Services ({selectedBundle.services?.length || 0})
                    </h3>
                    <div className="space-y-3">
                      {selectedBundle.services?.map((service, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 rounded-lg bg-white border border-gray-300 overflow-hidden">
                                <img
                                  src={formatImageUrl(service.photoUrl, service.name)}
                                  alt={service.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 text-sm">
                                {service.name}
                              </h4>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                                {service.description}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2">
                                  <ServiceTypeBadge type={service.serviceType} />
                                  <span className="text-xs text-gray-500">
                                    ₹{formatPrice(service.offerPrice)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Merged Input Fields */}
                  {selectedBundle.mergedInputFields?.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Shield size={18} className="text-gray-500" />
                        Required Information for Bundle
                      </h3>
                      <div className="space-y-2">
                        {selectedBundle.mergedInputFields.map((field, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 p-4 rounded-lg border border-gray-200"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-medium text-sm text-gray-900">
                                {field.label}
                                {field.required && <span className="text-red-500 ml-1">*</span>}
                              </span>
                              <span className="text-xs font-medium bg-white text-gray-600 px-2 py-1 rounded border border-gray-300">
                                {field.type}
                              </span>
                            </div>
                            {field.options && (
                              <p className="text-xs text-gray-500 mt-1">
                                Options: {field.options.join(', ')}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Benefits */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <Star size={16} />
                      Bundle Benefits
                    </h4>
                    <ul className="space-y-1">
                      <li className="flex items-start gap-2 text-sm text-blue-800">
                        <CheckCircle size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>Save money with bundled pricing</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-blue-800">
                        <CheckCircle size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>Single application for multiple services</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-blue-800">
                        <CheckCircle size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>Unified support and tracking</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-blue-800">
                        <CheckCircle size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                        <span>Streamlined documentation process</span>
                      </li>
                    </ul>
                  </div>

                  {/* CTA */}
                  <div className="sticky bottom-0 pt-4 bg-white border-t border-gray-200 -mx-6 px-6 pb-6">
                    <button 
                      onClick={() => setShowBundlePaymentPopup(true)}
                      className={`w-full bg-purple-600 text-white py-3.5 rounded-xl font-semibold text-lg hover:bg-purple-700 transition-colors border border-purple-600 shadow-sm`}
                    >
                      Buy Bundle - ₹{formatPrice(selectedBundle.finalBundlePrice)}
                    </button>
                    <p className="text-center text-xs text-gray-500 mt-3">
                      <span className="inline-flex items-center gap-1">
                        <BadgeCheck size={12} className="text-green-500" />
                        Save ₹{formatPrice(calculateBundleSavings(selectedBundle))}
                      </span>
                      <span className="mx-3">•</span>
                      <span>24/7 Support</span>
                      <span className="mx-3">•</span>
                      <span>Single Payment</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}