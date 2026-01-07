// Service.jsx - Main Service Hub Page
import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import axiosInstance from '@src/providers/axiosInstance';
import { useNavigate } from 'react-router-dom';

// Import your separate components
import CategoryList from './get-service/CategoryList';
import ServiceList from './get-service/ServiceList';

export default function Service() {
  const [activeView, setActiveView] = useState('service');
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch categories and subcategories
      const [catRes, subRes] = await Promise.all([
        axiosInstance.get('/category'),
        axiosInstance.get('/subcategory'),
      ]);

      const categoriesData = catRes.data.success ? catRes.data.categories : [];
      const subcategoriesData = subRes.data.success ? subRes.data.subcategories : [];
      
      // Fetch services with pagination
      let allServices = [];
      
      try {
        // Try with pagination
        const srvRes = await axiosInstance.get('/service?limit=50&page=1');
        if (srvRes.data.success) {
          allServices = srvRes.data.data || [];
        }
      } catch (serviceError) {
        console.error('Error fetching services:', serviceError);
        // Try without pagination
        try {
          const altRes = await axiosInstance.get('/service');
          if (altRes.data.success) {
            allServices = altRes.data.data || altRes.data.services || [];
          }
        } catch (altError) {
          console.error('Alternative endpoint also failed:', altError);
          throw serviceError;
        }
      }
      
      setCategories(categoriesData);
      setSubcategories(subcategoriesData);
      setServices(allServices);
      
    } catch (err) {
      console.error('Error in fetchAllData:', err.response?.data || err.message);
      setError(err.response?.data?.error || err.message || 'Failed to fetch data');
      
      // Set empty arrays to prevent crashes
      setCategories([]);
      setSubcategories([]);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  // Show error state
  if (error && services.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-gray-900">Service Hub</h1>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Data</h3>
              <p className="text-gray-600 text-sm mb-4 text-center">{error}</p>
              <div className="flex gap-3">
                <button
                  onClick={fetchAllData}
                  className="px-4 py-2 rounded-lg text-white bg-primary hover:bg-primary/90 transition-colors"
                >
                  Retry
                </button>
                <button
                  onClick={() => navigate('/add-service')}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Add New Service
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-gray-900">Service Hub</h1>
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity bg-primary"
              onClick={() => navigate('/add-service')}
            >
              <Plus className="w-4 h-4" />
              Onboard New Service
            </button>
          </div>
        </div>

        <div>
          <div className="p-6 max-w-7xl mx-auto">
            {error && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <p className="text-sm text-yellow-800">Partial data loaded: {error}</p>
                    <button
                      onClick={fetchAllData}
                      className="text-sm text-yellow-700 hover:text-yellow-800 font-medium mt-1"
                    >
                      Retry loading
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Service Database Section */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Service Database</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage all services and categories</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {services.length} services loaded
                    </span>
                    <button
                      onClick={fetchAllData}
                      className="text-xs text-primary hover:text-primary/80 font-medium"
                    >
                      Refresh
                    </button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveView('service')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeView === 'service'
                        ? 'text-white bg-primary'
                        : 'text-gray-500 bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    Service List
                  </button>
                  <button
                    onClick={() => setActiveView('category')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeView === 'category'
                        ? 'text-white bg-primary'
                        : 'text-gray-500 bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    Category List
                  </button>
                </div>
              </div>

              {/* Content Area - Pass data via props */}
              <div className="p-6">
                {activeView === 'service' && (
                  <ServiceList
                    services={services || []}
                    categories={categories || []}
                    subcategories={subcategories || []}
                    loading={loading}
                    onRefresh={fetchAllData}
                  />
                )}
                {activeView === 'category' && (
                  <CategoryList
                    categories={categories || []}
                    subcategories={subcategories || []}
                    services={services || []}
                    loading={loading}
                    onRefresh={fetchAllData}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}