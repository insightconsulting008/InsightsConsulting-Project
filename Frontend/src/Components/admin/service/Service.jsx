import React, { useState, useEffect } from 'react';
import { Plus, RefreshCw, AlertTriangle, Package, Layers, Folder } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '@src/providers/axiosInstance';

// Import components
import CategoryList from './get-service/CategoryList';
import ServiceList from './get-service/ServiceList';
import GetBundleList from './get-service/GetBundleList';

// Toast function
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

export default function Service() {
  const [activeView, setActiveView] = useState('service');
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [services, setServices] = useState([]);
  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({
    categories: null,
    subcategories: null,
    services: null,
    bundles: null
  });
  const navigate = useNavigate();

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setErrors({
        categories: null,
        subcategories: null,
        services: null,
        bundles: null
      });

      console.log('Starting data fetch...');

      // Fetch each endpoint separately with proper error handling
      const endpoints = [
        { 
          key: 'categories', 
          url: '/category',
          config: {} 
        },
        { 
          key: 'subcategories', 
          url: '/subcategory',
          config: {} 
        },
        { 
          key: 'services', 
          url: '/service',
          config: {
            params: {
              page: 1,
              limit: 100,
              orderBy: 'createdAt',
              order: 'desc'
            }
          }
        },
        { 
          key: 'bundles', 
          url: '/bundle',
          config: {} 
        }
      ];

      for (const endpoint of endpoints) {
        try {
          console.log(`Fetching ${endpoint.key} from ${endpoint.url}...`);
          
          // Try multiple approaches for services endpoint
          if (endpoint.key === 'services') {
            let servicesData = [];
            
            // Try with pagination first
            try {
              const response = await axiosInstance.get(endpoint.url, endpoint.config);
              console.log('Services response:', response.data);
              
              if (response.data.success) {
                servicesData = response.data.data || response.data.services || [];
                setServices(Array.isArray(servicesData) ? servicesData : []);
                console.log(`✅ Services loaded (with pagination): ${servicesData.length} items`);
              }
            } catch (paginationError) {
              console.log('Pagination failed, trying without params...');
              
              // Try without pagination params
              try {
                const response = await axiosInstance.get(endpoint.url);
                console.log('Services response (no params):', response.data);
                
                if (response.data.success) {
                  servicesData = response.data.data || response.data.services || [];
                  setServices(Array.isArray(servicesData) ? servicesData : []);
                  console.log(`✅ Services loaded (no params): ${servicesData.length} items`);
                }
              } catch (noParamsError) {
                console.log('Both attempts failed, using empty array');
                setServices([]);
                setErrors(prev => ({ 
                  ...prev, 
                  services: 'Failed to load services. Please check backend.' 
                }));
              }
            }
          } else {
            // For other endpoints
            const response = await axiosInstance.get(endpoint.url, endpoint.config);
            console.log(`${endpoint.key} response:`, response.data);
            
            if (response.data.success) {
              switch(endpoint.key) {
                case 'categories':
                  setCategories(response.data.categories || []);
                  console.log(`✅ Categories loaded: ${response.data.categories?.length || 0} items`);
                  break;
                case 'subcategories':
                  setSubcategories(response.data.subcategories || []);
                  console.log(`✅ Subcategories loaded: ${response.data.subcategories?.length || 0} items`);
                  break;
                case 'bundles':
                  setBundles(response.data.bundles || []);
                  console.log(`✅ Bundles loaded: ${response.data.bundles?.length || 0} items`);
                  break;
              }
            } else {
              setErrors(prev => ({ ...prev, [endpoint.key]: `Failed to load ${endpoint.key}` }));
              console.error(`❌ ${endpoint.key} failed:`, response.data);
            }
          }
        } catch (error) {
          console.error(`Error fetching ${endpoint.key}:`, error);
          
          // Set empty array for failed endpoint
          switch(endpoint.key) {
            case 'categories':
              setCategories([]);
              break;
            case 'subcategories':
              setSubcategories([]);
              break;
            case 'services':
              setServices([]);
              break;
            case 'bundles':
              setBundles([]);
              break;
          }
          
          // Set error message
          let errorMsg = `Failed to load ${endpoint.key}`;
          if (error.response?.data?.message) {
            errorMsg = error.response.data.message;
          } else if (error.response?.data?.error) {
            errorMsg = error.response.data.error;
          } else if (error.message) {
            errorMsg = error.message;
          }
          
          setErrors(prev => ({ ...prev, [endpoint.key]: errorMsg }));
          
          // Show specific toast for service error
          if (endpoint.key === 'services') {
            showToast(`Could not load services. ${errorMsg}`, 'error');
          }
        }
        
        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      console.log('Data fetch completed');
      console.log('Summary:', {
        services: services.length,
        categories: categories.length,
        subcategories: subcategories.length,
        bundles: bundles.length,
        errors
      });

    } catch (err) {
      console.error('Unexpected error in fetchAllData:', err);
      showToast('Failed to load data. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleRefresh = () => {
    showToast('Refreshing data...', 'info');
    fetchAllData();
  };

  const handleTestEndpoint = async () => {
    try {
      showToast('Testing service endpoint...', 'info');
      
      // Test with different parameter combinations
      const tests = [
        { params: { page: 1, limit: 10 } },
        { params: { page: 1, limit: 50 } },
        { params: { page: 1, limit: 100 } },
        { params: {} }, // No params
      ];
      
      for (const test of tests) {
        try {
          console.log(`Testing with params:`, test.params);
          const response = await axiosInstance.get('/service', { params: test.params });
          console.log(`Test response:`, response.data);
          
          if (response.data.success) {
            const data = response.data.data || response.data.services || [];
            showToast(`Success! Found ${data.length} services with params: ${JSON.stringify(test.params)}`, 'success');
            return;
          }
        } catch (testError) {
          console.log(`Test failed with params ${JSON.stringify(test.params)}:`, testError.message);
        }
      }
      
      showToast('All test attempts failed', 'error');
    } catch (err) {
      console.error('Test failed:', err);
      showToast('Test failed. Check console for details.', 'error');
    }
  };

  const hasData = services.length > 0 || categories.length > 0 || bundles.length > 0;
  const hasErrors = Object.values(errors).some(error => error !== null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Service Hub</h1>
              <p className="text-gray-600 mt-1">Manage all your services, categories, and bundles</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/add-service')}
                className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Service
              </button>
              <button
                onClick={() => navigate('/add-bundle-service')}
                className="flex items-center gap-2 px-4 py-2.5 border border-primary text-primary rounded-lg font-medium hover:bg-primary/5 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Create Bundle
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Error Summary */}
        {hasErrors && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-yellow-800 mb-1">Partial Data Loaded</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {errors.categories && <li>• Categories: {errors.categories}</li>}
                  {errors.subcategories && <li>• Subcategories: {errors.subcategories}</li>}
                  {errors.services && (
                    <>
                      <li>• Services: {errors.services}</li>
                      <li className="text-xs">Prisma error: Missing 'take' parameter</li>
                    </>
                  )}
                  {errors.bundles && <li>• Bundles: {errors.bundles}</li>}
                </ul>
                <div className="flex flex-wrap gap-2 mt-3">
                  <button
                    onClick={handleRefresh}
                    className="text-sm font-medium text-yellow-700 hover:text-yellow-800 flex items-center gap-1 px-3 py-1.5 bg-yellow-100 rounded-lg"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retry Loading
                  </button>
                  {errors.services && (
                    <button
                      onClick={handleTestEndpoint}
                      className="text-sm font-medium text-blue-700 hover:text-blue-800 flex items-center gap-1 px-3 py-1.5 bg-blue-50 rounded-lg"
                    >
                      Test Service Endpoint
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`bg-white rounded-xl border ${errors.services ? 'border-yellow-300' : 'border-gray-200'} p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Services</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{services.length}</p>
                {errors.services && (
                  <p className="text-xs text-yellow-600 mt-1">⚠️ Backend error</p>
                )}
              </div>
              <div className={`w-12 h-12 ${errors.services ? 'bg-yellow-100' : 'bg-primary/10'} rounded-lg flex items-center justify-center`}>
                <Package className={`w-6 h-6 ${errors.services ? 'text-yellow-600' : 'text-primary'}`} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Bundles</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{bundles.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Layers className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Categories</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{categories.length}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Folder className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Tabs Header */}
          <div className="border-b border-gray-200">
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Service Database</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage all services, categories, and bundles</p>
                </div>
                <div className="flex items-center gap-3">
                  {hasErrors && (
                    <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
                      Some data unavailable
                    </span>
                  )}
                  <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    {loading ? 'Refreshing...' : 'Refresh Data'}
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveView('service')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeView === 'service'
                      ? 'text-white bg-primary'
                      : 'text-gray-600 hover:bg-gray-100'
                  } ${errors.services ? 'border border-yellow-300' : ''}`}
                >
                  Services ({services.length})
                  {errors.services && ' ⚠️'}
                </button>
                <button
                  onClick={() => setActiveView('category')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeView === 'category'
                      ? 'text-white bg-primary'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Categories ({categories.length})
                </button>
                <button
                  onClick={() => setActiveView('bundle')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeView === 'bundle'
                      ? 'text-white bg-primary'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Bundles ({bundles.length})
                </button>
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {loading && !hasData ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-primary border-opacity-20 border-t-primary rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600">Loading data...</p>
                <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
              </div>
            ) : !hasData ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
                <p className="text-gray-500 mb-6">Unable to load data from the server.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={handleRefresh}
                    className="px-4 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
                  >
                    Retry Loading
                  </button>
                  <button
                    onClick={handleTestEndpoint}
                    className="px-4 py-2.5 border border-blue-300 text-blue-700 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                  >
                    Test Endpoint
                  </button>
                  <button
                    onClick={() => navigate('/add-service')}
                    className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Add First Service
                  </button>
                </div>
              </div>
            ) : (
              <>
                {activeView === 'service' && (
                  <ServiceList
                    services={services}
                    categories={categories}
                    subcategories={subcategories}
                    loading={loading && services.length === 0}
                    onRefresh={handleRefresh}
                  />
                )}
                {activeView === 'category' && (
                  <CategoryList
                    categories={categories}
                    subcategories={subcategories}
                    services={services}
                    loading={loading && categories.length === 0}
                    onRefresh={handleRefresh}
                  />
                )}
                {activeView === 'bundle' && (
                  <GetBundleList
                    bundles={bundles}
                    loading={loading && bundles.length === 0}
                    onRefresh={handleRefresh}
                  />
                )}
              </>
            )}
          </div>
        </div>

        {/* Debug Panel */}
        {/* <div className="mt-8 p-4 bg-gray-900 text-gray-300 rounded-lg text-sm">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium">Debug Information:</h4>
            <button
              onClick={() => {
                console.log('Current state:', {
                  services,
                  categories,
                  subcategories,
                  bundles,
                  errors,
                  loading
                });
                showToast('State logged to console', 'info');
              }}
              className="text-xs px-2 py-1 bg-gray-700 rounded hover:bg-gray-600"
            >
              Log State
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-xs text-gray-400">Services:</div>
              <div className={errors.services ? 'text-yellow-300' : ''}>
                {services.length} items
                {errors.services && (
                  <div className="text-xs mt-1 text-yellow-400">{errors.services}</div>
                )}
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Categories:</div>
              <div>{categories.length} items</div>
              {errors.categories && (
                <div className="text-xs mt-1 text-yellow-400">{errors.categories}</div>
              )}
            </div>
            <div>
              <div className="text-xs text-gray-400">Subcategories:</div>
              <div>{subcategories.length} items</div>
              {errors.subcategories && (
                <div className="text-xs mt-1 text-yellow-400">{errors.subcategories}</div>
              )}
            </div>
            <div>
              <div className="text-xs text-gray-400">Bundles:</div>
              <div>{bundles.length} items</div>
              {errors.bundles && (
                <div className="text-xs mt-1 text-yellow-400">{errors.bundles}</div>
              )}
            </div>
          </div>
          
          {errors.services && errors.services.includes('take') && (
            <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded">
              <div className="font-medium text-red-300 mb-1">Backend Issue Detected</div>
              <div className="text-xs text-red-400">
                The /service endpoint requires pagination parameters. Please ensure your backend:
                <ul className="mt-1 ml-4 list-disc">
                  <li>Handles missing 'limit' parameter with a default value</li>
                  <li>Validates query parameters before passing to Prisma</li>
                  <li>Returns proper error messages for invalid parameters</li>
                </ul>
              </div>
            </div>
          )}
        </div> */}
      </div>
    </div>
  );
}