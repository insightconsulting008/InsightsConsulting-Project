// ServiceList.jsx
import React, { useState } from 'react';
import { Search, Filter, ArrowUpDown, Eye, Loader2, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@src/providers/axiosInstance';

export default function ServiceList({ services = [], categories = [], subcategories = [], loading, onRefresh }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();

  // Ensure services is an array before filtering
  const filteredServices = (services || []).filter(
    (srv) =>
      srv?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv?.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv?.subCategoryId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getSubcategoryName = (subCategoryId) => {
    if (!subCategoryId) return '-';
    const subcategory = (subcategories || []).find(sub => sub.subCategoryId === subCategoryId);
    return subcategory ? subcategory.subCategoryName : subCategoryId;
  };

  const getCategoryName = (subCategoryId) => {
    if (!subCategoryId) return '-';
    const subcategory = (subcategories || []).find(sub => sub.subCategoryId === subCategoryId);
    if (!subcategory) return '-';
    
    const category = (categories || []).find(cat => cat.categoryId === subcategory.categoryId);
    return category ? category.categoryName : subcategory.categoryId;
  };

  const getServiceTypeDisplay = (service) => {
    if (!service) return 'Unknown';
    switch(service.serviceType) {
      case 'ONE_TIME': return 'One Time';
      case 'RECURRING': return 'Recurring';
      default: return service.serviceType || 'Standard';
    }
  };

  const getServiceStatus = (service) => {
    if (!service) return 'unknown';
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

  const handleViewService = (serviceId) => {
    navigate(`/service/view/${serviceId}`);
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
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
            <ArrowUpDown className="w-4 h-4" />
            Sort
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {filteredServices.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-10 h-10 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
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
                        onClick={() => handleViewService(service.serviceId)}
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
  );
}