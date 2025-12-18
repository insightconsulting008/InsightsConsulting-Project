// Service.jsx - Main Service Hub Page
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Calendar, ChevronDown, FileText, List, BarChart3, Package } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
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
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    totalServices: 0,
    totalCategories: 0,
    totalSubcategories: 0,
    listedServices: 0,
    unlistedServices: 0,
    draftServices: 0,
    standardServices: 0,
    bundleServices: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [catRes, subRes, srvRes] = await Promise.all([
        axiosInstance.get('/category'),
        axiosInstance.get('/subcategory'),
        axiosInstance.get('/service'),
      ]);

      const categoriesData = catRes.data.success ? catRes.data.categories : [];
      const subcategoriesData = subRes.data.success ? subRes.data.subcategories : [];
      const servicesData = srvRes.data.success ? srvRes.data.services : [];

      setCategories(categoriesData);
      setSubcategories(subcategoriesData);
      setServices(servicesData);

      // Calculate stats
      calculateStats(categoriesData, subcategoriesData, servicesData);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (categoriesData, subcategoriesData, servicesData) => {
    const newStats = {
      totalServices: servicesData.length,
      totalCategories: categoriesData.length,
      totalSubcategories: subcategoriesData.length,
      listedServices: servicesData.filter(s => s.status === 'active' || s.status === 'listed').length,
      unlistedServices: servicesData.filter(s => s.status === 'inactive' || s.status === 'unlisted').length,
      draftServices: servicesData.filter(s => s.status === 'draft').length,
      standardServices: servicesData.filter(s => s.type === 'standard' || !s.type).length,
      bundleServices: servicesData.filter(s => s.type === 'bundle').length,
      totalRevenue: servicesData.reduce((sum, s) => sum + (parseFloat(s.individualPrice) || 0), 0),
    };
    setStats(newStats);
  };

  // Prepare pie chart data from actual categories
  const pieChartData = categories.slice(0, 6).map((cat, idx) => {
    const servicesInCategory = services.filter(s => {
      const catSubcategories = subcategories.filter(sub => sub.categoryId === cat.categoryId);
      const subcategoryIds = catSubcategories.map(sub => sub.subCategoryId);
      return subcategoryIds.includes(s.subCategoryId);
    });
    return {
      name: cat.categoryName,
      value: servicesInCategory.length || 1,
      color: idx === 0 ? 'bg-primary' : 
             idx === 1 ? 'bg-indigo-400' : 
             idx === 2 ? 'bg-emerald-300' : 
             idx === 3 ? 'bg-orange-300' : 
             idx === 4 ? 'bg-pink-300' : 
             'bg-rose-400'
    };
  });

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-bright px-3 py-2 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-medium text-dark">{payload[0].name}</p>
          <p className="text-xs text-light">
            {payload[0].value} service{payload[0].value !== 1 ? 's' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="">
        {/* Header */}
        <div className="bg-bright border-b border-gray-200 py-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto px-6">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-dark">Service Hub</h1>
            </div>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-bright text-sm font-medium hover:opacity-90 transition-opacity bg-primary"
              onClick={() => navigate('/add-service')}
            >
              <Plus className="w-4 h-4" />
              Onboard New Service
            </button>
          </div>
        </div>

        <div>
          <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Stats Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Service Stats */}
              <div className="bg-bright rounded-xl border border-gray-200 p-6">
                <h2 className="text-sm font-semibold text-dark mb-4">Service Stats</h2>
                <div className="grid grid-cols-4 gap-4 mb-6">
                  <div>
                    <div className="text-2xl font-bold text-dark">{stats.totalServices}</div>
                    <div className="text-xs text-light mt-1">Total Service</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <List className="w-4 h-4 text-light" />
                      <span className="text-xs text-light">Listed</span>
                    </div>
                    <div className="text-2xl font-bold text-dark">{stats.listedServices}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <List className="w-4 h-4 text-light" />
                      <span className="text-xs text-light">Unlisted</span>
                    </div>
                    <div className="text-2xl font-bold text-dark">{stats.unlistedServices}</div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-4 h-4 text-light" />
                      <span className="text-xs text-light">In Draft</span>
                    </div>
                    <div className="text-2xl font-bold text-dark">{stats.draftServices}</div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-dark mb-3">Service By Type</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-primary bg-opacity-10 rounded-lg p-3 flex items-center justify-between">
                      <span className="text-sm text-dark">Standard Plan</span>
                      <span className="px-2 py-1 rounded text-xs font-medium text-bright bg-primary">
                        {stats.standardServices}
                      </span>
                    </div>
                    <div className="bg-primary bg-opacity-10 rounded-lg p-3 flex items-center justify-between">
                      <span className="text-sm text-dark">Bundle Plan</span>
                      <span className="px-2 py-1 rounded text-xs font-medium text-bright bg-primary">
                        {stats.bundleServices}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Stats */}
              <div className="bg-bright rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-sm font-semibold text-dark">Performance Stats</h2>
                    <p className="text-xs text-light mt-1">Track key performance metrics for every service</p>
                  </div>
                  <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-dark hover:bg-gray-50">
                    <Calendar className="w-4 h-4" />
                    Date Range
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="bg-primary bg-opacity-10 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary">
                        <BarChart3 className="w-5 h-5 text-bright" />
                      </div>
                      <span className="text-sm font-medium text-dark">Total Revenue</span>
                    </div>
                    <span className="text-xl font-bold text-dark">
                      ₹{stats.totalRevenue.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-light mb-1">Avg. Service Price</div>
                      <div className="text-lg font-bold text-dark">
                        ₹{stats.totalServices > 0 ? Math.round(stats.totalRevenue / stats.totalServices).toLocaleString('en-IN') : '0'}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs text-light mb-1">Categories</div>
                      <div className="text-lg font-bold text-dark">{stats.totalCategories}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Stats with Chart */}
            <div className="bg-bright rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-sm font-semibold text-dark">Category Stats</h2>
                  <p className="text-xs text-light mt-1">Category overview of all active services</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-light">
                    {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="text-xs text-gray-400">Direct</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Pie Chart */}
                <div>
                  <h3 className="text-sm font-medium text-dark mb-4">Service Breakdown</h3>
                  {loading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="w-12 h-12 border-4 border-primary border-opacity-20 border-t-primary rounded-full animate-spin"></div>
                    </div>
                  ) : pieChartData.length > 0 ? (
                    <>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={pieChartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {pieChartData.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={entry.color.replace('bg-', '#').replace('primary', '6869AC').replace('indigo-400', '8B8BD8').replace('emerald-300', 'A8E6CF').replace('orange-300', 'FFD3B6').replace('pink-300', 'FFAAA5').replace('rose-400', 'FF8B94')}
                              />
                            ))}
                          </Pie>
                          <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="text-center mt-4">
                        <div className="text-2xl font-bold text-dark">{stats.totalServices}</div>
                        <div className="text-xs text-light">Active Services</div>
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-64 text-gray-400">
                      <div className="text-center">
                        <div className="text-4xl mb-2">📊</div>
                        <div className="text-sm">No data available</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Category Legend */}
                <div>
                  <h3 className="text-sm font-medium text-dark mb-4">
                    {pieChartData.length > 0 ? 'Categories' : 'No Category found'}
                  </h3>
                  {pieChartData.length > 0 ? (
                    <div className="space-y-2">
                      {pieChartData.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${item.color}`} />
                            <span className="text-sm text-dark">{item.name}</span>
                          </div>
                          <span className="text-sm font-medium text-dark">{item.value}</span>
                        </div>
                      ))}
                      {categories.length > 6 && (
                        <div className="text-xs text-light text-center pt-2">
                          +{categories.length - 6} more categories
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-3">
                        <FileText className="w-8 h-8 text-primary text-opacity-50" />
                      </div>
                      <p className="text-sm text-light text-center">
                        It looks like there are no category added yet
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Service Database Section */}
            <div className="bg-bright rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-dark">Service Database</h2>
                    <p className="text-sm text-light mt-1">Overview of all services and their key information</p>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveView('service')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeView === 'service'
                        ? 'text-bright bg-primary'
                        : 'text-light bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    Service List
                  </button>
                  <button
                    onClick={() => setActiveView('category')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeView === 'category'
                        ? 'text-bright bg-primary'
                        : 'text-light bg-gray-100 hover:bg-gray-200'
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
                    services={services}
                    categories={categories}
                    subcategories={subcategories}
                    loading={loading}
                    onRefresh={fetchAllData}
                  />
                )}
                {activeView === 'category' && (
                  <CategoryList
                    categories={categories}
                    subcategories={subcategories}
                    services={services}
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