// EditService.jsx - Fixed for FormData parsing
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Save, X, Upload, Plus, Trash2, Layers, List, Percent } from 'lucide-react';
import Cropper from 'react-easy-crop';
import axiosInstance from '@src/providers/axiosInstance';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditService() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [service, setService] = useState(null);
  const [error, setError] = useState(null);
  
  const [basicInfo, setBasicInfo] = useState({
    name: '',
    description: '',
    photoUrl: '',
    photoFile: null,
    subCategoryId: '',
    serviceType: 'ONE_TIME',
    status: 'active',
    documentsRequired: false,
    
    individualPrice: '',
    offerPrice: '',
    isGstApplicable: false,
    gstPercentage: '18',
    
    frequency: '',
    duration: '',
    durationUnit: '',
  });

  const [priceMode, setPriceMode] = useState('fixed');
  const [discountPercentage, setDiscountPercentage] = useState('');
  
  const [inputFields, setInputFields] = useState([]);
  const [newInputField, setNewInputField] = useState({
    label: '',
    type: 'text',
    options: [],
    placeholder: '',
    required: false
  });

  const [trackSteps, setTrackSteps] = useState([]);
  const [newTrackStep, setNewTrackStep] = useState({
    title: '',
    description: '',
    order: 1
  });

  const [showCropModal, setShowCropModal] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [originalImage, setOriginalImage] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchServiceDetails();
    fetchCategoriesAndSubcategories();
  }, [serviceId]);

  const fetchCategoriesAndSubcategories = async () => {
    try {
      const [catRes, subRes] = await Promise.all([
        axiosInstance.get('/category'),
        axiosInstance.get('/subcategory'),
      ]);

      if (catRes.data.success) setCategories(catRes.data.categories || []);
      if (subRes.data.success) setSubcategories(subRes.data.subcategories || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchServiceDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/service/${serviceId}`);
      
      if (response.data.success) {
        const serviceData = response.data.service;
        setService(serviceData);
        
        // Populate basic info
        setBasicInfo({
          name: serviceData.name || '',
          description: serviceData.description || '',
          photoUrl: serviceData.photoUrl || '',
          photoFile: null,
          subCategoryId: serviceData.subCategoryId || '',
          serviceType: serviceData.serviceType || 'ONE_TIME',
          status: serviceData.status || 'active',
          documentsRequired: serviceData.documentsRequired === 'true',
          
          individualPrice: serviceData.individualPrice || '',
          offerPrice: serviceData.offerPrice || serviceData.individualPrice || '',
          isGstApplicable: serviceData.isGstApplicable === 'true',
          gstPercentage: serviceData.gstPercentage || '18',
          
          frequency: serviceData.frequency || '',
          duration: serviceData.duration || '',
          durationUnit: serviceData.durationUnit || '',
        });

        // Set input fields
        setInputFields(serviceData.inputFields || []);

        // Set track steps and calculate next order
        const steps = serviceData.trackSteps || [];
        setTrackSteps(steps);
        setNewTrackStep({
          title: '',
          description: '',
          order: steps.length + 1
        });

        // Determine price mode
        if (serviceData.offerPrice && serviceData.individualPrice) {
          const individualPrice = parseFloat(serviceData.individualPrice);
          const offerPrice = parseFloat(serviceData.offerPrice);
          if (!isNaN(individualPrice) && !isNaN(offerPrice) && individualPrice > 0) {
            const discount = ((individualPrice - offerPrice) / individualPrice) * 100;
            if (discount > 0) {
              setDiscountPercentage(discount.toString());
              setPriceMode('percentage');
            }
          }
        }

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

  // Image handling functions
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    try {
      setError('');
      setOriginalImage(file);
      setShowCropModal(true);
      
      const previewUrl = URL.createObjectURL(file);
      setBasicInfo(prev => ({ 
        ...prev, 
        photoUrl: previewUrl,
        photoFile: null 
      }));
      
    } catch (err) {
      setError('Failed to process image. Please try again.');
      console.error('Image processing error:', err);
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const createCroppedImage = async () => {
    if (!originalImage || !croppedAreaPixels) {
      return null;
    }

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const image = new Image();
      
      return new Promise((resolve, reject) => {
        image.onload = () => {
          canvas.width = croppedAreaPixels.width;
          canvas.height = croppedAreaPixels.height;
          
          ctx.drawImage(
            image,
            croppedAreaPixels.x,
            croppedAreaPixels.y,
            croppedAreaPixels.width,
            croppedAreaPixels.height,
            0,
            0,
            croppedAreaPixels.width,
            croppedAreaPixels.height
          );
          
          canvas.toBlob((blob) => {
            const file = new File([blob], `cropped-${Date.now()}.jpg`, { type: 'image/jpeg' });
            resolve(file);
          }, 'image/jpeg', 0.95);
        };
        
        image.onerror = reject;
        image.src = URL.createObjectURL(originalImage);
      });
    } catch (err) {
      console.error('Error creating cropped image:', err);
      return null;
    }
  };

  const handleCropComplete = async () => {
    try {
      setUploadingImage(true);
      
      const croppedFile = await createCroppedImage();
      if (!croppedFile) {
        throw new Error('Failed to create cropped image');
      }

      setBasicInfo(prev => ({ 
        ...prev, 
        photoFile: croppedFile
      }));
      
      setShowCropModal(false);
      setOriginalImage(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
      
    } catch (err) {
      setError('Failed to crop image. Please try again.');
      console.error('Crop error:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    if (basicInfo.photoUrl && basicInfo.photoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(basicInfo.photoUrl);
    }
    
    setBasicInfo(prev => ({ 
      ...prev, 
      photoUrl: '',
      photoFile: null 
    }));
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    if (originalImage) {
      URL.revokeObjectURL(URL.createObjectURL(originalImage));
      setOriginalImage(null);
    }
    
    if (showCropModal) {
      setShowCropModal(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleCancelCrop = () => {
    setShowCropModal(false);
    handleRemoveImage();
  };

  // Input field functions
  const addInputField = () => {
    if (!newInputField.label.trim()) {
      alert('Please enter field label');
      return;
    }

    const field = {
      label: newInputField.label.trim(),
      type: newInputField.type,
      placeholder: newInputField.placeholder || `Enter ${newInputField.label.toLowerCase()}`,
      required: newInputField.required,
    };
    
    if (['select', 'radio', 'checkbox'].includes(newInputField.type) && newInputField.options.length > 0) {
      field.options = newInputField.options.filter(opt => opt && opt.trim() !== '');
    }
    
    setInputFields(prev => [...prev, field]);
    
    setNewInputField({
      label: '',
      type: 'text',
      options: [],
      placeholder: '',
      required: false
    });
  };

  const removeInputField = (index) => {
    setInputFields(prev => prev.filter((_, i) => i !== index));
  };

  const updateInputField = (index, field, value) => {
    setInputFields(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  // Track step functions
  const addTrackStep = () => {
    if (!newTrackStep.title.trim()) {
      alert('Please enter step title');
      return;
    }

    const step = {
      title: newTrackStep.title.trim(),
      description: newTrackStep.description.trim(),
      order: newTrackStep.order,
    };

    setTrackSteps(prev => [...prev, step].sort((a, b) => a.order - b.order));
    
    setNewTrackStep({
      title: '',
      description: '',
      order: newTrackStep.order + 1
    });
  };

  const removeTrackStep = (index) => {
    const updatedSteps = trackSteps.filter((_, i) => i !== index)
      .map((step, idx) => ({ ...step, order: idx + 1 }));
    
    setTrackSteps(updatedSteps);
    setNewTrackStep(prev => ({
      ...prev,
      order: updatedSteps.length + 1
    }));
  };

  const updateTrackStep = (index, field, value) => {
    setTrackSteps(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  // Price calculation functions
  const calculateDiscountPercentage = () => {
    const individualPrice = parseFloat(basicInfo.individualPrice);
    const offerPrice = parseFloat(basicInfo.offerPrice);
    if (!isNaN(individualPrice) && !isNaN(offerPrice) && individualPrice > 0) {
      const discount = ((individualPrice - offerPrice) / individualPrice) * 100;
      return Math.round(discount);
    }
    return 0;
  };

  const calculateOfferPriceFromPercentage = () => {
    const individualPrice = parseFloat(basicInfo.individualPrice);
    const discount = parseFloat(discountPercentage);
    if (!isNaN(individualPrice) && !isNaN(discount) && discount >= 0 && discount <= 100) {
      const offerPrice = individualPrice - (individualPrice * discount) / 100;
      return Math.round(offerPrice);
    }
    return 0;
  };

  const calculateFinalPriceWithGST = () => {
    let priceToCalculate = 0;
    
    if (priceMode === 'fixed') {
      priceToCalculate = parseFloat(basicInfo.offerPrice);
    } else {
      priceToCalculate = calculateOfferPriceFromPercentage();
    }
    
    if (isNaN(priceToCalculate) || priceToCalculate <= 0) {
      priceToCalculate = parseFloat(basicInfo.individualPrice);
    }
    
    const gstPercentage = parseFloat(basicInfo.gstPercentage);
    
    if (!isNaN(priceToCalculate) && priceToCalculate > 0 && 
        !isNaN(gstPercentage) && gstPercentage >= 0) {
      const gstAmount = (priceToCalculate * gstPercentage) / 100;
      return Math.round(priceToCalculate + gstAmount);
    }
    
    return 0;
  };

  const handlePriceModeChange = (mode) => {
    setPriceMode(mode);
    if (mode === 'fixed') {
      setDiscountPercentage('');
    } else {
      setBasicInfo(prev => ({ ...prev, offerPrice: '' }));
    }
  };

  const handleDiscountPercentageChange = (value) => {
    setDiscountPercentage(value);
    if (value && !isNaN(parseFloat(value)) && parseFloat(value) >= 0 && parseFloat(value) <= 100) {
      const calculatedOfferPrice = calculateOfferPriceFromPercentage();
      setBasicInfo(prev => ({ 
        ...prev, 
        offerPrice: calculatedOfferPrice.toString() 
      }));
    } else {
      setBasicInfo(prev => ({ ...prev, offerPrice: '' }));
    }
  };

  // Main submit function - FIXED VERSION
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError('');

      // Validate required fields
      const validationErrors = [];
      if (!basicInfo.name.trim()) validationErrors.push('Service name is required');
      if (!basicInfo.description.trim()) validationErrors.push('Description is required');
      if (!basicInfo.individualPrice) validationErrors.push('Individual price is required');
      if (!basicInfo.offerPrice) validationErrors.push('Offer price is required');
      if (!basicInfo.subCategoryId) validationErrors.push('Subcategory is required');

      if (validationErrors.length > 0) {
        throw new Error(validationErrors.join(', '));
      }

      // OPTION 1: Try JSON first (without image)
      console.log('Attempting JSON update...');
      const updateData = {
        name: basicInfo.name.trim(),
        description: basicInfo.description.trim(),
        serviceType: basicInfo.serviceType,
        documentsRequired: basicInfo.documentsRequired.toString(),
        individualPrice: basicInfo.individualPrice,
        offerPrice: basicInfo.offerPrice,
        isGstApplicable: basicInfo.isGstApplicable.toString(),
        gstPercentage: basicInfo.isGstApplicable ? basicInfo.gstPercentage : '0',
        status: basicInfo.status,
        subCategoryId: basicInfo.subCategoryId,
      };
      
      // Add recurring fields if applicable
      if (basicInfo.serviceType === 'RECURRING') {
        updateData.frequency = basicInfo.frequency;
        updateData.duration = basicInfo.duration || '';
        updateData.durationUnit = basicInfo.durationUnit || '';
      }

      console.log('Update data:', updateData);

      // First, try updating without image using JSON
      const serviceRes = await axiosInstance.put(`/service/${serviceId}`, updateData);

      if (!serviceRes.data.success) {
        throw new Error(serviceRes.data.error || 'Failed to update service');
      }

      console.log('Service updated successfully via JSON');

      // OPTION 2: If there's a new image, upload it separately
      if (basicInfo.photoFile) {
        console.log('Uploading new image...');
        const imageFormData = new FormData();
        imageFormData.append('photoUrl', basicInfo.photoFile, basicInfo.photoFile.name);
        
        const imageRes = await axiosInstance.put(`/service/${serviceId}/image`, imageFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (!imageRes.data.success) {
          console.warn('Image update failed:', imageRes.data);
        } else {
          console.log('Image updated successfully');
        }
      }

      // Step 2: Update input fields (delete old ones and create new)
      if (inputFields.length > 0) {
        try {
          console.log('Updating input fields...');
          // First delete existing input fields
          await axiosInstance.delete(`/service/${serviceId}/input-fields`);
          
          // Then create new ones
          const fieldsPayload = inputFields.map(field => ({
            label: field.label,
            type: field.type,
            placeholder: field.placeholder || '',
            required: field.required || false,
            options: field.options || null,
          }));

          const inputRes = await axiosInstance.post(
            `/service/${serviceId}/input-fields`,
            { fields: fieldsPayload }
          );

          if (!inputRes.data.success) {
            console.warn('Input fields update had issues:', inputRes.data);
          } else {
            console.log('Input fields updated successfully');
          }
        } catch (inputErr) {
          console.warn('Failed to update input fields:', inputErr);
          // Continue anyway
        }
      }

      // Step 3: Update track steps (delete old ones and create new)
      if (trackSteps.length > 0) {
        try {
          console.log('Updating track steps...');
          // First delete existing track steps
          await axiosInstance.delete(`/service/${serviceId}/track-steps`);
          
          // Then create new ones
          const stepsPayload = trackSteps.map(step => ({
            title: step.title,
            description: step.description,
            order: step.order,
          }));

          const stepsRes = await axiosInstance.post(
            `/service/${serviceId}/track-steps`,
            { steps: stepsPayload }
          );

          if (!stepsRes.data.success) {
            console.warn('Track steps update had issues:', stepsRes.data);
          } else {
            console.log('Track steps updated successfully');
          }
        } catch (stepsErr) {
          console.warn('Failed to update track steps:', stepsErr);
          // Continue anyway
        }
      }

      alert('Service updated successfully!');
      navigate(`/service/view/${serviceId}`);
      
    } catch (err) {
      console.error('Error updating service:', err);
      
      // If JSON update failed, try FormData approach as fallback
      if (err.response?.status === 400 || err.message.includes('Cannot destructure')) {
        console.log('Trying FormData approach as fallback...');
        try {
          await updateWithFormData();
        } catch (formDataErr) {
          setError(formDataErr.message || 'Failed to update service. Please try again.');
        }
      } else {
        setError(err.message || 'Failed to update service. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  // Alternative: Update using FormData (for backend that expects multipart)
  const updateWithFormData = async () => {
    const formData = new FormData();
    
    // Append all service data as strings
    formData.append('name', basicInfo.name.trim());
    formData.append('description', basicInfo.description.trim());
    formData.append('serviceType', basicInfo.serviceType);
    formData.append('documentsRequired', basicInfo.documentsRequired.toString());
    formData.append('individualPrice', basicInfo.individualPrice);
    formData.append('offerPrice', basicInfo.offerPrice);
    formData.append('isGstApplicable', basicInfo.isGstApplicable.toString());
    formData.append('gstPercentage', basicInfo.isGstApplicable ? basicInfo.gstPercentage : '0');
    formData.append('status', basicInfo.status);
    formData.append('subCategoryId', basicInfo.subCategoryId);
    
    if (basicInfo.serviceType === 'RECURRING') {
      formData.append('frequency', basicInfo.frequency);
      formData.append('duration', basicInfo.duration || '');
      formData.append('durationUnit', basicInfo.durationUnit || '');
    }

    // Append image if uploaded
    if (basicInfo.photoFile) {
      formData.append('photoUrl', basicInfo.photoFile, basicInfo.photoFile.name);
    } else if (basicInfo.photoUrl && !basicInfo.photoUrl.startsWith('blob:')) {
      formData.append('photoUrl', basicInfo.photoUrl);
    }

    console.log('FormData entries:');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, typeof value === 'object' ? value.name || 'File' : value);
    }

    const serviceRes = await axiosInstance.put(`/service/${serviceId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!serviceRes.data.success) {
      throw new Error(serviceRes.data.error || 'Failed to update service via FormData');
    }

    console.log('Service updated successfully via FormData');
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
                onClick={() => navigate('/service')}
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
                onClick={() => navigate(`/service/view/${serviceId}`)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Edit Service: {service.name}</h1>
                <p className="text-sm text-gray-500">Update all service details</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/service/view/${serviceId}`)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="px-4 py-2 rounded-lg text-white bg-primary hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              <strong>Error:</strong> {error}
            </div>
          )}

          {/* Basic Information Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h2>
            <div className="space-y-4">
              {/* Service Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Image
                </label>
                <div className="flex flex-col items-center justify-center">
                  {basicInfo.photoUrl ? (
                    <div className="relative w-full max-w-md">
                      <img
                        src={basicInfo.photoUrl}
                        alt="Service preview"
                        className="w-full h-64 object-cover rounded-lg border border-gray-300"
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <button
                          type="button"
                          onClick={triggerFileInput}
                          className="p-2 bg-primary text-white rounded-full hover:bg-primary/90"
                        >
                          <Upload className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={triggerFileInput}
                      className="w-full max-w-md h-64 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary"
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <Upload className="w-12 h-12 text-gray-400 mb-2" />
                      <p className="text-sm font-medium text-gray-700">Click to upload service image</p>
                      <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Service Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Name *
                  </label>
                  <input
                    type="text"
                    value={basicInfo.name}
                    onChange={(e) => setBasicInfo({...basicInfo, name: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status *
                  </label>
                  <select
                    value={basicInfo.status}
                    onChange={(e) => setBasicInfo({...basicInfo, status: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                {/* Service Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Type *
                  </label>
                  <select
                    value={basicInfo.serviceType}
                    onChange={(e) => setBasicInfo({...basicInfo, serviceType: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="ONE_TIME">One Time</option>
                    <option value="RECURRING">Recurring</option>
                  </select>
                </div>

                {/* Documents Required */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Documents Required
                  </label>
                  <select
                    value={basicInfo.documentsRequired.toString()}
                    onChange={(e) => setBasicInfo({...basicInfo, documentsRequired: e.target.value === 'true'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>

                {/* Category/Subcategory */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category/Subcategory *
                  </label>
                  <select
                    value={basicInfo.subCategoryId}
                    onChange={(e) => setBasicInfo({...basicInfo, subCategoryId: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select Subcategory</option>
                    {subcategories.map(sub => {
                      const category = categories.find(cat => cat.categoryId === sub.categoryId);
                      return (
                        <option key={sub.subCategoryId} value={sub.subCategoryId}>
                          {category?.categoryName || 'Unknown'} / {sub.subCategoryName}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={basicInfo.description}
                  onChange={(e) => setBasicInfo({...basicInfo, description: e.target.value})}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Recurring Settings */}
              {basicInfo.serviceType === 'RECURRING' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frequency *
                    </label>
                    <select
                      value={basicInfo.frequency}
                      onChange={(e) => setBasicInfo({...basicInfo, frequency: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select Frequency</option>
                      <option value="DAILY">Daily</option>
                      <option value="WEEKLY">Weekly</option>
                      <option value="MONTHLY">Monthly</option>
                      <option value="QUARTERLY">Quarterly</option>
                      <option value="YEARLY">Yearly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration
                    </label>
                    <input
                      type="number"
                      value={basicInfo.duration}
                      onChange={(e) => setBasicInfo({...basicInfo, duration: e.target.value})}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration Unit
                    </label>
                    <select
                      value={basicInfo.durationUnit}
                      onChange={(e) => setBasicInfo({...basicInfo, durationUnit: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Select Unit</option>
                      <option value="DAY">Day</option>
                      <option value="WEEK">Week</option>
                      <option value="MONTH">Month</option>
                      <option value="YEAR">Year</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Pricing Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Pricing Information</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Pricing Mode
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handlePriceModeChange('fixed')}
                    className={`px-3 py-1.5 text-xs rounded-lg ${
                      priceMode === 'fixed'
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Fixed Price
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePriceModeChange('percentage')}
                    className={`px-3 py-1.5 text-xs rounded-lg ${
                      priceMode === 'percentage'
                        ? 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Discount %
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Individual Price *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="number"
                      value={basicInfo.individualPrice}
                      onChange={(e) => setBasicInfo({...basicInfo, individualPrice: e.target.value})}
                      required
                      min="0"
                      step="0.01"
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {priceMode === 'percentage' ? 'Discount Percentage *' : 'Offer Price *'}
                  </label>
                  <div className="relative">
                    {priceMode === 'percentage' ? (
                      <>
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                          <Percent className="w-4 h-4" />
                        </span>
                        <input
                          type="number"
                          value={discountPercentage}
                          onChange={(e) => handleDiscountPercentageChange(e.target.value)}
                          required
                          min="1"
                          max="100"
                          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </>
                    ) : (
                      <>
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                        <input
                          type="number"
                          value={basicInfo.offerPrice}
                          onChange={(e) => setBasicInfo({...basicInfo, offerPrice: e.target.value})}
                          required
                          min="0"
                          step="0.01"
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </>
                    )}
                  </div>
                  
                  {priceMode === 'fixed' && basicInfo.individualPrice && basicInfo.offerPrice && (
                    <div className="mt-1">
                      <span className="text-xs text-gray-500">
                        Discount: {calculateDiscountPercentage()}%
                      </span>
                    </div>
                  )}
                  
                  {priceMode === 'percentage' && discountPercentage && basicInfo.individualPrice && (
                    <div className="mt-1">
                      <span className="text-xs text-gray-500">
                        Offer Price: ₹{calculateOfferPriceFromPercentage()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* GST Section */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    checked={basicInfo.isGstApplicable}
                    onChange={(e) => setBasicInfo({...basicInfo, isGstApplicable: e.target.checked})}
                    className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    GST Applicable
                  </span>
                </div>
                
                {basicInfo.isGstApplicable && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        GST Percentage *
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={basicInfo.gstPercentage}
                          onChange={(e) => setBasicInfo({...basicInfo, gstPercentage: e.target.value})}
                          min="0"
                          max="100"
                          step="0.01"
                          className="w-full pl-3 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Final Price (Incl. GST)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                        <input
                          type="text"
                          value={calculateFinalPriceWithGST()}
                          readOnly
                          className="w-full pl-7 pr-3 py-2 border border-gray-300 bg-gray-50 rounded-lg"
                        />
                      </div>
                      <div className="mt-1">
                        <span className="text-xs text-gray-500">
                          {priceMode === 'fixed' ? 'Offer Price + GST' : 'Discounted Price + GST'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Input Fields Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Input Fields</h2>
                <p className="text-sm text-gray-500 mt-1">Custom fields for customer input</p>
              </div>
              <button
                type="button"
                onClick={() => document.getElementById('new-input-field-form').scrollIntoView()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium bg-primary hover:opacity-90"
              >
                <Plus className="w-4 h-4" />
                Add Field
              </button>
            </div>

            {/* Existing Input Fields */}
            {inputFields.length > 0 ? (
              <div className="space-y-4 mb-6">
                {inputFields.map((field, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-900">{field.label}</span>
                        <span className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-800">
                          {field.type}
                        </span>
                        {field.required && (
                          <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-800">
                            Required
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeInputField(index)}
                        className="p-1 hover:bg-red-50 rounded transition-colors text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Label</label>
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) => updateInputField(index, 'label', e.target.value)}
                          className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Type</label>
                        <select
                          value={field.type}
                          onChange={(e) => updateInputField(index, 'type', e.target.value)}
                          className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          <option value="text">Text</option>
                          <option value="number">Number</option>
                          <option value="email">Email</option>
                          <option value="tel">Phone</option>
                          <option value="date">Date</option>
                          <option value="textarea">Textarea</option>
                          <option value="select">Dropdown</option>
                          <option value="checkbox">Checkbox</option>
                          <option value="radio">Radio</option>
                          <option value="file">File Upload</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Placeholder</label>
                        <input
                          type="text"
                          value={field.placeholder || ''}
                          onChange={(e) => updateInputField(index, 'placeholder', e.target.value)}
                          className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      
                      <div className="flex items-center">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={(e) => updateInputField(index, 'required', e.target.checked)}
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <span className="text-xs text-gray-700">Required</span>
                        </label>
                      </div>
                      
                      {(field.type === 'select' || field.type === 'checkbox' || field.type === 'radio') && field.options && (
                        <div className="md:col-span-2">
                          <label className="block text-xs text-gray-500 mb-1">
                            Options (comma separated)
                          </label>
                          <input
                            type="text"
                            value={field.options.join(', ')}
                            onChange={(e) => updateInputField(index, 'options', 
                              e.target.value.split(',').map(opt => opt.trim()).filter(opt => opt)
                            )}
                            className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="Option 1, Option 2, Option 3"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Layers className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No input fields configured</p>
              </div>
            )}

            {/* Add New Input Field Form */}
            <div id="new-input-field-form" className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Add New Input Field</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Label *</label>
                  <input
                    type="text"
                    value={newInputField.label}
                    onChange={(e) => setNewInputField({...newInputField, label: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="e.g., Company Name"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Type</label>
                  <select
                    value={newInputField.type}
                    onChange={(e) => {
                      const newType = e.target.value;
                      const isOptionType = ['select', 'radio', 'checkbox'].includes(newType);
                      setNewInputField({ 
                        ...newInputField, 
                        type: newType,
                        options: isOptionType ? ['Option 1', 'Option 2'] : []
                      });
                    }}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="text">Text</option>
                    <option value="number">Number</option>
                    <option value="email">Email</option>
                    <option value="tel">Phone</option>
                    <option value="date">Date</option>
                    <option value="textarea">Textarea</option>
                    <option value="select">Dropdown</option>
                    <option value="checkbox">Checkbox</option>
                    <option value="radio">Radio</option>
                    <option value="file">File Upload</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Placeholder</label>
                  <input
                    type="text"
                    value={newInputField.placeholder}
                    onChange={(e) => setNewInputField({...newInputField, placeholder: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="e.g., Enter your company name"
                  />
                </div>
                
                <div className="flex items-center">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newInputField.required}
                      onChange={(e) => setNewInputField({...newInputField, required: e.target.checked})}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-xs text-gray-700">Required</span>
                  </label>
                </div>
                
                {(newInputField.type === 'select' || newInputField.type === 'checkbox' || newInputField.type === 'radio') && (
                  <div className="md:col-span-2">
                    <label className="block text-xs text-gray-500 mb-1">
                      Options (comma separated)
                    </label>
                    <input
                      type="text"
                      value={newInputField.options.join(', ')}
                      onChange={(e) => setNewInputField({
                        ...newInputField, 
                        options: e.target.value.split(',').map(opt => opt.trim()).filter(opt => opt)
                      })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Option 1, Option 2, Option 3"
                    />
                  </div>
                )}
              </div>
              
              <button
                type="button"
                onClick={addInputField}
                className="mt-4 px-4 py-2 rounded-lg text-white bg-primary hover:bg-primary/90 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Input Field
              </button>
            </div>
          </div>

          {/* Track Steps Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Tracking Steps</h2>
                <p className="text-sm text-gray-500 mt-1">Service process workflow</p>
              </div>
              <button
                type="button"
                onClick={() => document.getElementById('new-track-step-form').scrollIntoView()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium bg-primary hover:opacity-90"
              >
                <Plus className="w-4 h-4" />
                Add Step
              </button>
            </div>

            {/* Existing Track Steps */}
            {trackSteps.length > 0 ? (
              <div className="space-y-4 mb-6">
                {trackSteps.sort((a, b) => a.order - b.order).map((step, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">
                          {step.order}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{step.title}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTrackStep(index)}
                        className="p-1 hover:bg-red-50 rounded transition-colors text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Title</label>
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => updateTrackStep(index, 'title', e.target.value)}
                          className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">Description</label>
                        <textarea
                          value={step.description}
                          onChange={(e) => updateTrackStep(index, 'description', e.target.value)}
                          rows={2}
                          className="w-full px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <List className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">No tracking steps configured</p>
              </div>
            )}

            {/* Add New Track Step Form */}
            <div id="new-track-step-form" className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Add New Step</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Title *</label>
                  <input
                    type="text"
                    value={newTrackStep.title}
                    onChange={(e) => setNewTrackStep({...newTrackStep, title: e.target.value})}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="e.g., Document Verification"
                  />
                </div>
                
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Description</label>
                  <textarea
                    value={newTrackStep.description}
                    onChange={(e) => setNewTrackStep({...newTrackStep, description: e.target.value})}
                    rows={2}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="e.g., Our team will verify your documents"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Order: <span className="font-medium">{newTrackStep.order}</span>
                  </span>
                  <button
                    type="button"
                    onClick={addTrackStep}
                    className="px-4 py-2 rounded-lg text-white bg-primary hover:bg-primary/90 transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Step
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              Service ID: <span className="font-mono text-gray-700">{service.serviceId}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate(`/service/view/${serviceId}`)}
                className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 rounded-lg text-white bg-primary hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving Changes...' : 'Save All Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Crop Modal */}
      {showCropModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Crop Image
              </h3>
              <button
                onClick={handleCancelCrop}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="relative w-full h-96 mb-4">
              <Cropper
                image={basicInfo.photoUrl}
                crop={crop}
                zoom={zoom}
                aspect={4 / 3}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                cropShape="rect"
                showGrid={true}
                style={{
                  containerStyle: {
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    backgroundColor: '#f3f4f6'
                  }
                }}
              />
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zoom
                </label>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.1"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1x</span>
                  <span>2x</span>
                  <span>3x</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={handleCropComplete}
                disabled={uploadingImage}
                className="flex-1 py-3 rounded-lg text-white text-sm font-medium hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed bg-primary"
              >
                {uploadingImage ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </span>
                ) : (
                  'Apply Crop'
                )}
              </button>
              <button
                onClick={handleCancelCrop}
                className="px-6 py-3 rounded-lg border border-gray-300 text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}