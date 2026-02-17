import React, { useState } from 'react';
import { Search, Edit2, Trash2, Plus, Package, X, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@src/providers/axiosInstance';

// Toast function (same as others)
const showToast = (message, type = 'success') => {
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 ${
    type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
  }`;
  
  const icon = type === 'success' ? 
    '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>' :
    '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
  
  toast.innerHTML = `${icon} ${message}`;
  document.body.appendChild(toast);
  
  setTimeout(() => toast.remove(), 3000);
};

// Delete Modal (same as others)
const DeleteModal = ({ isOpen, onClose, onConfirm, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">Delete Bundle?</h3>
          <p className="text-gray-600 text-center mb-6">
            Are you sure you want to delete "<span className="font-semibold">{itemName}</span>"? 
            This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Bundle Detail Modal
const BundleDetailModal = ({ isOpen, onClose, bundle }) => {
  if (!isOpen || !bundle) return null;

  const formatPrice = (price) => {
    return parseInt(price || 0).toLocaleString('en-IN');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDiscount = () => {
    const { bundlePrice, bundleOfferPrice } = bundle;
    if (!bundlePrice || bundlePrice === 0) return 0;
    return Math.round(((bundlePrice - bundleOfferPrice) / bundlePrice) * 100);
  };

  const discount = calculateDiscount();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{bundle.name}</h3>
                <p className="text-sm text-gray-500">Created: {formatDate(bundle.createdAt)}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Description</h4>
              <p className="text-gray-600">{bundle.description || 'No description provided.'}</p>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Original Price</div>
                <div className="text-xl font-bold text-gray-900">₹{formatPrice(bundle.bundlePrice)}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Offer Price</div>
                <div className="text-xl font-bold text-green-700">₹{formatPrice(bundle.bundleOfferPrice)}</div>
                {discount > 0 && (
                  <div className="text-xs text-green-600 font-medium mt-1">{discount}% OFF</div>
                )}
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-gray-500 mb-1">Final Price</div>
                <div className="text-xl font-bold text-blue-700">₹{formatPrice(bundle.finalBundlePrice)}</div>
                <div className="text-xs text-blue-600 mt-1">
                  {bundle.isGstApplicable 
                    ? `Including ${bundle.gstPercentage}% GST` 
                    : 'No GST applied'}
                </div>
              </div>
            </div>

            {/* Included Services */}
            <div>
              <h4 className="font-medium text-gray-900 mb-4">
                Included Services ({bundle.services?.length || 0})
              </h4>
              <div className="space-y-3">
                {bundle.services?.map((service, index) => (
                  <div key={service.serviceId} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-gray-900">{index + 1}.</span>
                          <h5 className="font-medium text-gray-900">{service.name}</h5>
                        </div>
                        <p className="text-sm text-gray-600">{service.description}</p>
                      </div>
                      <span className="text-sm font-semibold text-primary">
                        ₹{formatPrice(service.offerPrice || service.individualPrice)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function GetBundleList({ bundles = [], loading, onRefresh }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [filters, setFilters] = useState({
    sortBy: 'newest',
    gstStatus: 'all'
  });
  const navigate = useNavigate();

  // Filter and sort bundles
  const filteredBundles = bundles.filter(bundle => {
    // Search filter
    if (searchQuery && !bundle.name?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !bundle.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // GST filter
    if (filters.gstStatus !== 'all') {
      if (filters.gstStatus === 'with_gst' && !bundle.isGstApplicable) return false;
      if (filters.gstStatus === 'without_gst' && bundle.isGstApplicable) return false;
    }

    return true;
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'newest':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'price_high':
        return (b.bundleOfferPrice || 0) - (a.bundleOfferPrice || 0);
      case 'price_low':
        return (a.bundleOfferPrice || 0) - (b.bundleOfferPrice || 0);
      case 'name_asc':
        return (a.name || '').localeCompare(b.name || '');
      case 'name_desc':
        return (b.name || '').localeCompare(a.name || '');
      default:
        return 0;
    }
  });

  const formatPrice = (price) => {
    return parseInt(price || 0).toLocaleString('en-IN');
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDiscount = (bundle) => {
    const { bundlePrice, bundleOfferPrice } = bundle;
    if (!bundlePrice || bundlePrice === 0) return 0;
    return Math.round(((bundlePrice - bundleOfferPrice) / bundlePrice) * 100);
  };

  const handleDelete = async () => {
    if (!deleteItem) return;

    try {
      await axiosInstance.delete(`/bundle/${deleteItem.id}`);
      showToast('Bundle deleted successfully');
      onRefresh();
    } catch (err) {
      console.error('Error deleting bundle:', err);
      showToast(err.response?.data?.message || 'Error deleting bundle', 'error');
    } finally {
      setShowDeleteModal(false);
      setDeleteItem(null);
    }
  };

  const handleDeleteClick = (bundle) => {
    setDeleteItem({
      id: bundle.bundleId,
      name: bundle.name
    });
    setShowDeleteModal(true);
  };

  const handleEdit = (bundleId) => {
    navigate(`/bundle/edit/${bundleId}`);
  };

  const handleViewDetails = (bundle) => {
    setSelectedBundle(bundle);
    setShowDetailsModal(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-primary border-opacity-20 border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">Loading bundles...</p>
      </div>
    );
  }

  return (
    <>
      {/* Modals */}
      <BundleDetailModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedBundle(null);
        }}
        bundle={selectedBundle}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        itemName={deleteItem?.name}
      />

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search bundles by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={filters.gstStatus}
              onChange={(e) => setFilters(prev => ({ ...prev, gstStatus: e.target.value }))}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All GST Status</option>
              <option value="with_gst">With GST</option>
              <option value="without_gst">Without GST</option>
            </select>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price_high">Price: High to Low</option>
              <option value="price_low">Price: Low to High</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
            </select>
          </div>
        </div>
        <p className="text-sm text-gray-500">
          Showing {filteredBundles.length} of {bundles.length} bundles
        </p>
      </div>

      {/* Bundles Grid */}
      {filteredBundles.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Bundles Found</h3>
            <p className="text-gray-500 text-sm text-center mb-6">
              {searchQuery
                ? "No bundles match your search criteria. Try a different search term."
                : "There are no bundles available. Create your first bundle to get started."}
            </p>
            {!searchQuery && (
              <button
                onClick={() => navigate('/add-bundle-service')}
                className="px-4 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
              >
                Create Your First Bundle
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBundles.map((bundle) => {
            const discount = calculateDiscount(bundle);

            return (
              <div key={bundle.bundleId} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{bundle.name}</h3>
                      <p className="text-xs text-gray-500">ID: {bundle.bundleId?.substring(0, 8)}...</p>
                    </div>
                  </div>
                  {discount > 0 && (
                    <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      {discount}% OFF
                    </span>
                  )}
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {bundle.description || 'No description'}
                </p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-gray-900">
                          ₹{formatPrice(bundle.bundleOfferPrice)}
                        </span>
                        {bundle.bundlePrice > bundle.bundleOfferPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ₹{formatPrice(bundle.bundlePrice)}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {bundle.isGstApplicable 
                          ? `Includes ${bundle.gstPercentage}% GST` 
                          : 'No GST'}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-blue-600">
                        ₹{formatPrice(bundle.finalBundlePrice)}
                      </div>
                      <div className="text-xs text-gray-500">Final Price</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="text-gray-600">
                      {bundle.services?.length || 0} Services
                    </div>
                    <div className="text-gray-600">
                      {formatDate(bundle.createdAt)}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleViewDetails(bundle)}
                    className="flex-1 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleEdit(bundle.bundleId)}
                    className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(bundle)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}