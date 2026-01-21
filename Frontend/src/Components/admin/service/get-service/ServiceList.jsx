import React, { useState } from 'react';
import { Search, Eye, Loader2, Edit2, Trash2, X, DollarSign, Calendar, Package, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@src/providers/axiosInstance';

export default function ServiceList({ services = [], categories = [], subcategories = [], loading, onRefresh }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const navigate = useNavigate();

  const filteredServices = services.filter(
    (srv) =>
      srv?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv?.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getSubcategoryName = (subCategoryId) => {
    const subcategory = subcategories.find(sub => sub.subCategoryId === subCategoryId);
    return subcategory ? subcategory.subCategoryName : '-';
  };

  const getCategoryName = (subCategoryId) => {
    const subcategory = subcategories.find(sub => sub.subCategoryId === subCategoryId);
    if (!subcategory) return '-';
    
    const category = categories.find(cat => cat.categoryId === subcategory.categoryId);
    return category ? category.categoryName : '-';
  };

  const getServiceTypeDisplay = (service) => {
    switch(service.serviceType) {
      case 'ONE_TIME': return 'One Time';
      case 'RECURRING': return 'Recurring';
      default: return service.serviceType || 'Standard';
    }
  };

  const getServiceStatus = (service) => {
    return service.status || 'active';
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEditService = (serviceId) => {
    navigate(`/service/edit/${serviceId}`);
  };

  const handleDeleteService = async (serviceId, serviceName) => {
    if (!window.confirm(`Are you sure you want to delete "${serviceName}"?`)) return;
    
    try {
      setActionLoading(true);
      await axiosInstance.delete(`/service/${serviceId}`);
      onRefresh();
      alert('Service deleted successfully!');
    } catch (err) {
      console.error('Error deleting service:', err);
      alert(err.response?.data?.message || 'Error deleting service');
    } finally {
      setActionLoading(false);
    }
  };

  // Service Detail Modal
  const ServiceDetailModal = () => {
    if (!showDetailsModal || !selectedService) return null;

    const service = selectedService;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {service.photoUrl && (
                  <img 
                    src={service.photoUrl} 
                    alt={service.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                )}
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
                  <p className="text-sm text-gray-600 mt-0.5">
                    ID: {service.serviceId} • Created: {formatDate(service.createdAt)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedService(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                <p className="text-gray-600">{service.description}</p>
              </div>

              {/* Service Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Package className="w-5 h-5 text-primary" />
                    <div>
                      <div className="text-sm text-gray-500">Service Type</div>
                      <div className="font-medium text-gray-900">{getServiceTypeDisplay(service)}</div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <div className="text-sm text-gray-500">Category</div>
                      <div className="font-medium text-gray-900">{getCategoryName(service.subCategoryId)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Pricing</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-500 mb-1">Base Price</div>
                    <div className="text-xl font-bold text-gray-900">₹{service.individualPrice}</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="text-sm text-gray-500 mb-1">Offer Price</div>
                    <div className="text-xl font-bold text-green-700">₹{service.offerPrice || service.individualPrice}</div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="text-sm text-gray-500 mb-1">Final Price</div>
                    <div className="text-xl font-bold text-blue-700">₹{service.finalIndividualPrice}</div>
                    {service.isGstApplicable === 'true' && (
                      <div className="text-xs text-blue-600 mt-1">Includes {service.gstPercentage}% GST</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Input Fields */}
              {service.inputFields && service.inputFields.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4">Required Information</h4>
                  <div className="space-y-3">
                    {service.inputFields.map((field) => (
                      <div key={field.fieldId} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-gray-900">{field.label}</span>
                          <span className={`px-2 py-1 text-xs rounded ${
                            field.required ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {field.required ? 'Required' : 'Optional'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          Type: <span className="font-medium">{field.type}</span>
                          {field.options && field.options.length > 0 && (
                            <div className="mt-2">
                              <div className="text-xs text-gray-500 mb-1">Options:</div>
                              <div className="flex flex-wrap gap-2">
                                {field.options.map((option, idx) => (
                                  <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                    {option}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleEditService(service.serviceId)}
                  className="flex-1 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                >
                  Edit Service
                </button>
                <button
                  onClick={() => handleDeleteService(service.serviceId, service.name)}
                  className="flex-1 py-3 bg-red-50 text-red-600 rounded-lg font-semibold hover:bg-red-100 transition-colors"
                >
                  Delete Service
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-3 text-primary" />
            <p className="text-gray-500 text-sm">Loading services...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <ServiceDetailModal />

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Service List</h2>
              <p className="text-sm text-gray-500 mt-1">
                Overview of all services and their key information
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search services by name, description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredServices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Package className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Service found</h3>
              <p className="text-gray-500 text-sm text-center">
                {searchQuery
                  ? 'No services match your search criteria'
                  : 'It looks like there are no services added yet'}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Service Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Category
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Price
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Last Update
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service) => (
                  <tr
                    key={service.serviceId}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {service.photoUrl && (
                          <img 
                            src={service.photoUrl} 
                            alt={service.name}
                            className="w-8 h-8 rounded object-cover"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{service.name}</div>
                          <div className="text-xs text-gray-500 truncate max-w-xs">
                            {service.description || '-'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-700">
                        {getServiceTypeDisplay(service)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-700">
                        <div>{getCategoryName(service.subCategoryId)}</div>
                        <div className="text-xs text-gray-500">
                          {getSubcategoryName(service.subCategoryId)}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-900">
                          ₹{service.finalIndividualPrice || service.individualPrice || '0'}
                        </span>
                        {service.offerPrice && service.offerPrice !== service.individualPrice && (
                          <span className="text-xs text-gray-500 line-through">
                            ₹{service.individualPrice}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(getServiceStatus(service))}`}>
                        {getServiceStatus(service)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">
                      {formatDate(service.updatedAt || service.createdAt)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedService(service);
                            setShowDetailsModal(true);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-white bg-primary hover:opacity-90 transition-opacity"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                        <button
                          onClick={() => handleEditService(service.serviceId)}
                          className="p-1.5 hover:bg-gray-100 rounded transition-colors group"
                        >
                          <Edit2 className="w-4 h-4 text-gray-500 group-hover:text-primary" />
                        </button>
                        <button
                          onClick={() => handleDeleteService(service.serviceId, service.name)}
                          disabled={actionLoading}
                          className="p-1.5 hover:bg-red-50 rounded transition-colors group"
                        >
                          <Trash2 className="w-4 h-4 text-gray-500 group-hover:text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {filteredServices.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="text-sm text-gray-500">
              Showing <span className="font-medium text-gray-900">{filteredServices.length}</span> of{' '}
              <span className="font-medium text-gray-900">{services.length}</span> services
            </div>
          </div>
        )}
      </div>
    </>
  );
}