// ================== ServiceList.jsx ==================
import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowUpDown, Eye, Loader2 } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'https://insightsconsult-backend.onrender.com';
const PRIMARY = '#6869AC';

export default function ServiceList() {
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/service`);
      if (response.data.success) {
        setServices(response.data.services);
      } else {
        setError('Failed to fetch services');
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter(
    (srv) =>
      srv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.serviceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.subCategoryId.toLowerCase().includes(searchQuery.toLowerCase())
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

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-3" style={{ color: PRIMARY }} />
            <p className="text-gray-500 text-sm">Loading services...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-4xl mb-3">⚠️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error loading services</h3>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <button
            onClick={fetchServices}
            className="px-4 py-2 rounded-lg text-white text-sm"
            style={{ backgroundColor: PRIMARY }}
          >
            Retry
          </button>
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search services by name, ID, description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
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
            <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-10 h-10 text-purple-400"
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
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Service Name
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Service ID
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Description
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Price
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Subcategory
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Last Update
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
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
                    <div className="text-sm font-medium text-gray-900">{service.name}</div>
                  </td>
                  <td className="py-3 px-4">
                    <code className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {service.serviceId}
                    </code>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm text-gray-600 max-w-xs truncate">
                      {service.description || '-'}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-sm font-semibold text-gray-900">
                      ₹{service.individualPrice}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <code className="text-xs text-gray-600">{service.subCategoryId}</code>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {formatDate(service.updatedAt || service.createdAt)}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-white hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: PRIMARY }}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {filteredServices.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            Showing <span className="font-medium">{filteredServices.length}</span> of{' '}
            <span className="font-medium">{services.length}</span> services
          </div>
        </div>
      )}
    </div>
  );
}
