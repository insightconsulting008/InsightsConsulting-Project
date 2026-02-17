// ViewService.jsx
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, FileText, CheckCircle, Clock, Package, Tag, DollarSign, Users, Shield, Layers } from 'lucide-react';
import axiosInstance from '@src/providers/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';

export default function ViewService() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchServiceDetails();
  }, [serviceId]);

  const fetchServiceDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/service/${serviceId}`);
      
      if (response.data.success) {
        setService(response.data.service);
      } else {
        setError('Service not found');
      }
    } catch (err) {
      console.error('Error fetching service details:', err);
      setError(err.response?.data?.message || 'Failed to load service details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getServiceTypeDisplay = () => {
    switch(service?.serviceType) {
      case 'ONE_TIME': return 'One Time Service';
      case 'RECURRING': return 'Recurring Service';
      default: return service?.serviceType || 'Standard Service';
    }
  };

  const getFrequencyDisplay = () => {
    if (!service?.frequency) return 'N/A';
    
    const freqMap = {
      'DAILY': 'Daily',
      'WEEKLY': 'Weekly',
      'MONTHLY': 'Monthly',
      'QUARTERLY': 'Quarterly',
      'YEARLY': 'Yearly'
    };
    
    return freqMap[service.frequency] || service.frequency;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-opacity-20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading service details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <div className="flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Service Not Found</h3>
              <p className="text-gray-600 text-sm mb-4 text-center">{error || 'The requested service does not exist'}</p>
              <button
                onClick={() => navigate('/service-hub')}
                className="px-4 py-2 rounded-lg text-white bg-primary hover:bg-primary/90 transition-colors"
              >
                Back to Service List
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/service-hub')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{service.name}</h1>
                <p className="text-sm text-gray-500">Service Details</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/service/edit/${serviceId}`)}
                className="px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/5 transition-colors"
              >
                Edit Service
              </button>
              <button
                onClick={() => navigate('/service-hub')}
                className="px-4 py-2 rounded-lg text-white bg-primary hover:bg-primary/90 transition-colors"
              >
                Back to List
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Overview Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Service Overview</h2>
                  <p className="text-sm text-gray-500 mt-1">Complete details about the service</p>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  service.status === 'active' ? 'bg-green-100 text-green-800' :
                  service.status === 'inactive' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {service.status || 'active'}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>

                {service.photoUrl && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Service Image</h3>
                    <img 
                      src={service.photoUrl} 
                      alt={service.name}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Pricing Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Pricing Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-primary/5 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10">
                      <DollarSign className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Base Price</div>
                      <div className="text-lg font-bold text-gray-900">₹{service.individualPrice}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-100">
                      <Tag className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Offer Price</div>
                      <div className="text-lg font-bold text-gray-900">₹{service.offerPrice || service.individualPrice}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple-100">
                      <Shield className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Final Price</div>
                      <div className="text-lg font-bold text-gray-900">₹{service.finalIndividualPrice}</div>
                    </div>
                  </div>
                  {service.isGstApplicable === 'true' && (
                    <div className="text-xs text-gray-500 mt-2">
                      Includes {service.gstPercentage}% GST
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Input Fields Card */}
            {service.inputFields && service.inputFields.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Required Information</h2>
                <div className="space-y-4">
                  {service.inputFields.map((field, index) => (
                    <div key={field.fieldId} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary" />
                          <span className="text-sm font-medium text-gray-900">{field.label}</span>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded ${
                          field.required ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {field.required ? 'Required' : 'Optional'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div className="mb-1">Type: <span className="font-medium">{field.type}</span></div>
                        {field.placeholder && (
                          <div>Placeholder: <span className="font-medium">{field.placeholder}</span></div>
                        )}
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

            {/* Tracking Steps Card */}
            {service.trackSteps && service.trackSteps.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Service Process Steps</h2>
                <div className="space-y-4">
                  {service.trackSteps.sort((a, b) => a.order - b.order).map((step, index) => (
                    <div key={step.stepId} className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          index === 0 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {index + 1}
                        </div>
                        {index < service.trackSteps.length - 1 && (
                          <div className="h-8 w-0.5 bg-gray-200 mx-auto"></div>
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <h3 className="text-sm font-medium text-gray-900">{step.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar Info */}
          <div className="space-y-6">
            {/* Service Type Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Service Information</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Service Type</div>
                    <div className="text-sm font-medium text-gray-900">{getServiceTypeDisplay()}</div>
                  </div>
                </div>

                {service.serviceType === 'RECURRING' && (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-50">
                        <Clock className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Frequency</div>
                        <div className="text-sm font-medium text-gray-900">{getFrequencyDisplay()}</div>
                      </div>
                    </div>

                    {service.duration && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-green-50">
                          <Calendar className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Duration</div>
                          <div className="text-sm font-medium text-gray-900">
                            {service.duration} {service.durationUnit?.toLowerCase() || 'months'}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple-50">
                    <Layers className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Documents Required</div>
                    <div className="text-sm font-medium text-gray-900">
                      {service.documentsRequired === 'true' ? 'Yes' : 'No'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timestamps Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Timestamps</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-xs text-gray-500">Created On</div>
                  <div className="text-sm font-medium text-gray-900">{formatDate(service.createdAt)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Last Updated</div>
                  <div className="text-sm font-medium text-gray-900">{formatDate(service.updatedAt)}</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500">Service ID</div>
                  <div className="text-sm font-mono text-gray-600 bg-gray-50 px-2 py-1 rounded">
                    {service.serviceId}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate(`/service/edit/${serviceId}`)}
                  className="w-full px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/5 transition-colors text-sm font-medium"
                >
                  Edit Service Details
                </button>
                <button
                  onClick={() => navigate('/service-hub')}
                  className="w-full px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Back to Service List
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete "${service.name}"?`)) {
                      axiosInstance.delete(`/service/${serviceId}`)
                        .then(() => {
                          alert('Service deleted successfully!');
                          navigate('/service-hub');
                        })
                        .catch(err => {
                          alert(err.response?.data?.message || 'Error deleting service');
                        });
                    }
                  }}
                  className="w-full px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-sm font-medium"
                >
                  Delete Service
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}