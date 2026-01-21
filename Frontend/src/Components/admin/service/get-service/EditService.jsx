import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Plus, Edit2, Trash2, MoreVertical, ChevronDown, X, Upload, 
  Percent, CheckCircle, CheckSquare, Square 
} from 'lucide-react';
import axiosInstance from '@src/providers/axiosInstance';
import Cropper from 'react-easy-crop';

const API_BASE = 'https://insightsconsult-backend.onrender.com';

// Helper components (copied from your create service components)
const ServiceInfo = ({ basicInfo, setBasicInfo, categories, filteredSubcategories, stepErrors, goToNextStep, goToPreviousStep, currentStep }) => {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(null);
  const [showSubcategoryDropdown, setShowSubcategoryDropdown] = useState(null);
  const [editId, setEditId] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [originalImage, setOriginalImage] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  
  const fileInputRef = useRef(null);

  const serviceTypeOptions = [
    { value: 'ONE_TIME', label: 'One Time' },
    { value: 'RECURRING', label: 'Recurring' }
  ];

  const frequencyOptions = [
    { value: 'MONTHLY', label: 'Monthly' },
    { value: 'QUARTERLY', label: 'Quarterly' },
    { value: 'YEARLY', label: 'Yearly' }
  ];

  const durationUnitOptions = [
    { value: 'MONTH', label: 'Months' },
    { value: 'YEAR', label: 'Years' }
  ];

  // Upload image function
  const uploadImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const blobUrl = URL.createObjectURL(file);
        
        resolve({
          file: file,
          blobUrl: blobUrl,
          fileName: file.name,
          fileType: file.type
        });
      };
      
      reader.onerror = (error) => {
        reject(error);
      };
      
      reader.readAsDataURL(file);
    });
  };

  // Crop completion handler
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Function to create cropped image
  const createCroppedImage = useCallback(async () => {
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
  }, [originalImage, croppedAreaPixels]);

  // Handle crop confirmation
  const handleCropComplete = async () => {
    try {
      setUploadingImage(true);
      
      const croppedFile = await createCroppedImage();
      if (!croppedFile) {
        throw new Error('Failed to create cropped image');
      }

      const imageData = await uploadImage(croppedFile);
      
      setBasicInfo(prev => ({ 
        ...prev, 
        photoUrl: imageData.blobUrl,
        photoFile: imageData.file,
        photoChanged: true
      }));
      
      setShowCropModal(false);
      setOriginalImage(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
      
    } catch (err) {
      console.error('Crop error:', err);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return;
    }

    if (file.size > 5 * 1024 * 512) {
      return;
    }

    try {
      setOriginalImage(file);
      setShowCropModal(true);
      
      const previewUrl = URL.createObjectURL(file);
      setBasicInfo(prev => ({ 
        ...prev, 
        photoUrl: previewUrl,
        photoFile: null,
        photoChanged: true
      }));
      
    } catch (err) {
      console.error('Image processing error:', err);
    }
  };

  const handleRemoveImage = () => {
    if (basicInfo.photoUrl && basicInfo.photoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(basicInfo.photoUrl);
    }
    
    setBasicInfo(prev => ({ 
      ...prev, 
      photoUrl: '',
      photoFile: null,
      photoChanged: true
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Service Information</h2>
        <p className="text-sm text-gray-600">Update the basic details about your service.</p>
      </div>

      <div className="space-y-4">
        {/* Service Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-800">
            Service Image <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-col items-center justify-center">
            {basicInfo.photoUrl && !showCropModal ? (
              <div className="relative w-full max-w-md">
                <img
                  src={basicInfo.photoUrl}
                  alt="Service preview"
                  className="w-full h-64 object-cover rounded-lg border border-gray-300"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={handleRemoveImage}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                    type="button"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={triggerFileInput}
                className={`w-full max-w-md h-64 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer ${
                  stepErrors.photoUrl ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-[#6869AC]'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingImage || showCropModal}
                />
                {uploadingImage ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6869AC]"></div>
                    <p className="mt-2 text-sm text-gray-600">Processing image...</p>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-700">Click to update service image</p>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                  </>
                )}
              </div>
            )}
            {stepErrors.photoUrl && (
              <p className="mt-1 text-sm text-red-600">{stepErrors.photoUrl}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Service Type */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-800">
              Service Type
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={basicInfo.serviceType}
                onChange={(e) =>
                  setBasicInfo((prev) => ({
                    ...prev,
                    serviceType: e.target.value,
                  }))
                }
                className={`w-full px-4 py-2 border rounded-lg appearance-none bg-white pr-10 text-sm focus:outline-none focus:ring-1 ${
                  stepErrors.serviceType 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-[#6869AC] focus:ring-[#6869AC]'
                }`}
              >
                {serviceTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {stepErrors.serviceType && (
              <p className="mt-1 text-sm text-red-600">{stepErrors.serviceType}</p>
            )}
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-800">
              Select Category
              <span className="text-red-500">*</span>
            </label>
            <div className="relative flex-1">
              <select
                value={basicInfo.categoryId}
                onChange={(e) =>
                  setBasicInfo((prev) => ({
                    ...prev,
                    categoryId: e.target.value,
                  }))
                }
                className={`w-full px-4 py-2 border rounded-lg appearance-none bg-white pr-10 text-sm focus:outline-none focus:ring-1 ${
                  stepErrors.categoryId 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-[#6869AC] focus:ring-[#6869AC]'
                }`}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option
                    key={cat.categoryId}
                    value={cat.categoryId}
                  >
                    {cat.categoryName}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {stepErrors.categoryId && (
              <p className="mt-1 text-sm text-red-600">{stepErrors.categoryId}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Subcategory Selection */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-800">
              Select Sub Category
              <span className="text-red-500">*</span>
            </label>
            <div className="relative flex-1">
              <select
                value={basicInfo.subCategoryId}
                onChange={(e) =>
                  setBasicInfo((prev) => ({
                    ...prev,
                    subCategoryId: e.target.value,
                  }))
                }
                className={`w-full px-4 py-2 border rounded-lg appearance-none bg-white pr-10 text-sm focus:outline-none focus:ring-1 ${
                  stepErrors.subCategoryId 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-[#6869AC] focus:ring-[#6869AC]'
                }`}
                disabled={!basicInfo.categoryId}
              >
                <option value="">Select subcategory</option>
                {filteredSubcategories.map((sub) => (
                  <option
                    key={sub.subCategoryId}
                    value={sub.subCategoryId}
                  >
                    {sub.subCategoryName}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            {stepErrors.subCategoryId && (
              <p className="mt-1 text-sm text-red-600">{stepErrors.subCategoryId}</p>
            )}
          </div>

          {/* Documents Required */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-800">
              Documents Required
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={basicInfo.documentsRequired}
                onChange={(e) =>
                  setBasicInfo((prev) => ({
                    ...prev,
                    documentsRequired: e.target.checked,
                  }))
                }
                className="w-4 h-4 text-[#6869AC] rounded border-gray-300 focus:ring-[#6869AC]"
              />
              <span className="ml-2 text-sm text-gray-700">
                Service requires document upload
              </span>
            </div>
          </div>
        </div>

        {/* Recurring Service Fields */}
        {basicInfo.serviceType === 'RECURRING' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
            {/* Frequency Field */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-800">
                Frequency
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={basicInfo.frequency}
                  onChange={(e) =>
                    setBasicInfo((prev) => ({
                      ...prev,
                      frequency: e.target.value,
                    }))
                  }
                  className={`w-full px-4 py-2 border rounded-lg appearance-none bg-white pr-10 text-sm focus:outline-none focus:ring-1 ${
                    stepErrors.frequency 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-[#6869AC] focus:ring-[#6869AC]'
                  }`}
                >
                  <option value="">Select frequency</option>
                  {frequencyOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {stepErrors.frequency && (
                <p className="mt-1 text-sm text-red-600">{stepErrors.frequency}</p>
              )}
            </div>

            {/* Duration Unit Field */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-800">
                Duration Unit
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={basicInfo.durationUnit}
                  onChange={(e) =>
                    setBasicInfo((prev) => ({
                      ...prev,
                      durationUnit: e.target.value,
                    }))
                  }
                  className={`w-full px-4 py-2 border rounded-lg appearance-none bg-white pr-10 text-sm focus:outline-none focus:ring-1 ${
                    stepErrors.durationUnit 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-[#6869AC] focus:ring-[#6869AC]'
                  }`}
                >
                  <option value="">Select unit</option>
                  {durationUnitOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              {stepErrors.durationUnit && (
                <p className="mt-1 text-sm text-red-600">{stepErrors.durationUnit}</p>
              )}
            </div>

            {/* Duration Value Field */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-800">
                Duration Value
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={basicInfo.duration || ''}
                onChange={(e) =>
                  setBasicInfo((prev) => ({
                    ...prev,
                    duration: e.target.value,
                  }))
                }
                placeholder="e.g., 12"
                className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 ${
                  stepErrors.duration 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-[#6869AC] focus:ring-[#6869AC]'
                }`}
              />
              {stepErrors.duration && (
                <p className="mt-1 text-sm text-red-600">{stepErrors.duration}</p>
              )}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-800">
            Service Name
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={basicInfo.name}
            onChange={(e) =>
              setBasicInfo((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
            placeholder="New GST Registration – Your Business"
            className={`w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 ${
              stepErrors.name 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-[#6869AC] focus:ring-[#6869AC]'
            }`}
          />
          {stepErrors.name && (
            <p className="mt-1 text-sm text-red-600">{stepErrors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-gray-800">
            Description
            <span className="text-red-500">*</span>
          </label>
          <textarea
            value={basicInfo.description}
            onChange={(e) =>
              setBasicInfo((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            placeholder="Register your business with GST and get your GSTIN issued to legally sell goods or services in India."
            className={`w-full px-4 py-2 border rounded-lg h-32 resize-none text-sm focus:outline-none focus:ring-1 ${
              stepErrors.description 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-[#6869AC] focus:ring-[#6869AC]'
            }`}
          />
          {stepErrors.description && (
            <p className="mt-1 text-sm text-red-600">{stepErrors.description}</p>
          )}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          onClick={goToPreviousStep}
          disabled={currentStep === 1}
          className={`px-6 py-2 rounded-lg font-medium ${
            currentStep === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          Previous
        </button>
        <button
          onClick={goToNextStep}
          className="px-6 py-2 rounded-lg font-medium bg-[#6869AC] text-white hover:opacity-90"
        >
          Next
        </button>
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
                className="flex-1 py-3 rounded-lg text-white text-sm font-medium hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed bg-[#6869AC]"
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
};

const PricingSetup = ({ basicInfo, setBasicInfo, priceMode, setPriceMode, discountPercentage, setDiscountPercentage, stepErrors, goToNextStep, goToPreviousStep }) => {
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

  const handlePriceModeChange = (mode) => {
    setPriceMode(mode);
    if (mode === 'fixed') {
      setDiscountPercentage('');
    } else {
      setBasicInfo(prev => ({ ...prev, offerPrice: '' }));
    }
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Pricing Setup</h2>
        <p className="text-sm text-gray-600">Update your pricing strategy for this service.</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-800">
            Pricing Mode
          </label>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePriceModeChange('fixed')}
              className={`px-3 py-1.5 text-xs rounded-lg ${
                priceMode === 'fixed'
                  ? 'bg-[#6869AC] text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Fixed Price
            </button>
            <button
              onClick={() => handlePriceModeChange('percentage')}
              className={`px-3 py-1.5 text-xs rounded-lg ${
                priceMode === 'percentage'
                  ? 'bg-[#6869AC] text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Discount %
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-800">
              Actual Price <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                ₹
              </span>
              <input
                type="number"
                min="1"
                value={basicInfo.individualPrice}
                onChange={(e) =>
                  setBasicInfo((prev) => ({
                    ...prev,
                    individualPrice: e.target.value,
                  }))
                }
                placeholder="1099"
                className={`w-full pl-7 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 ${
                  stepErrors.individualPrice 
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:border-[#6869AC] focus:ring-[#6869AC]'
                }`}
              />
            </div>
            {stepErrors.individualPrice && (
              <p className="mt-1 text-sm text-red-600">{stepErrors.individualPrice}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-800">
              {priceMode === 'percentage' ? 'Discount Percentage' : 'Offer Price'}
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              {priceMode === 'percentage' ? (
                <>
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    <Percent className="w-4 h-4" />
                  </span>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={discountPercentage}
                    onChange={(e) => handleDiscountPercentageChange(e.target.value)}
                    placeholder="35"
                    className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 ${
                      stepErrors.discountPercentage 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:border-[#6869AC] focus:ring-[#6869AC]'
                    }`}
                  />
                </>
              ) : (
                <>
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={basicInfo.offerPrice}
                    onChange={(e) =>
                      setBasicInfo((prev) => ({
                        ...prev,
                        offerPrice: e.target.value,
                      }))
                    }
                    placeholder="700"
                    className={`w-full pl-7 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 ${
                      stepErrors.offerPrice 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:border-[#6869AC] focus:ring-[#6869AC]'
                    }`}
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
            
            {stepErrors.discountPercentage && (
              <p className="mt-1 text-sm text-red-600">{stepErrors.discountPercentage}</p>
            )}
            {stepErrors.offerPrice && (
              <p className="mt-1 text-sm text-red-600">{stepErrors.offerPrice}</p>
            )}
          </div>
        </div>

        {/* GST Section */}
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={basicInfo.isGstApplicable}
              onChange={(e) =>
                setBasicInfo((prev) => ({
                  ...prev,
                  isGstApplicable: e.target.checked,
                }))
              }
              className="w-4 h-4 text-[#6869AC] rounded border-gray-300 focus:ring-[#6869AC]"
            />
            <span className="ml-2 text-sm font-medium text-gray-800">
              GST Applicable
            </span>
          </div>
          
          {basicInfo.isGstApplicable && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-800">
                  GST Percentage <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={basicInfo.gstPercentage}
                    onChange={(e) =>
                      setBasicInfo((prev) => ({
                        ...prev,
                        gstPercentage: e.target.value,
                      }))
                    }
                    placeholder="18"
                    className={`w-full pl-3 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-1 ${
                      stepErrors.gstPercentage 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:border-[#6869AC] focus:ring-[#6869AC]'
                    }`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    %
                  </span>
                </div>
                {stepErrors.gstPercentage && (
                  <p className="mt-1 text-sm text-red-600">{stepErrors.gstPercentage}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-800">
                  Final Price (Incl. GST)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                    ₹
                  </span>
                  <input
                    type="text"
                    value={calculateFinalPriceWithGST()}
                    readOnly
                    className="w-full pl-7 pr-3 py-2 border border-gray-300 bg-gray-50 rounded-lg text-sm"
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

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          onClick={goToPreviousStep}
          className="px-6 py-2 rounded-lg font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
        >
          Previous
        </button>
        <button
          onClick={goToNextStep}
          className="px-6 py-2 rounded-lg font-medium bg-[#6869AC] text-white hover:opacity-90"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const DatasetSetup = ({ 
  selectedMasterFields, 
  setSelectedMasterFields, 
  customFields, 
  setCustomFields,
  newCustomField,
  setNewCustomField,
  masterFields,
  stepErrors,
  goToNextStep,
  goToPreviousStep
}) => {
  const [showMasterFieldsModal, setShowMasterFieldsModal] = useState(false);
  const [customFieldNewOptions, setCustomFieldNewOptions] = useState({});

  const fieldTypeOptions = [
    { value: 'text', label: 'Text Field' },
    { value: 'email', label: 'Email Field' },
    { value: 'number', label: 'Number Field' },
    { value: 'textarea', label: 'Text Area' },
    { value: 'select', label: 'Dropdown Select' },
    { value: 'radio', label: 'Radio Buttons' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'date', label: 'Date Field' },
    { value: 'file', label: 'File Upload' },
    { value: 'password', label: 'Password' },
  ];

  const isOptionField = (type) => ['select', 'radio', 'checkbox'].includes(type);

  const toggleMasterField = (field) => {
    setSelectedMasterFields((prev) => {
      const exists = prev.find((f) => f.masterFieldId === field.masterFieldId);
      if (exists) {
        return prev.filter((f) => f.masterFieldId !== field.masterFieldId);
      } else {
        return [...prev, { masterFieldId: field.masterFieldId, required: true }];
      }
    });
  };

  const toggleMasterFieldRequired = (fieldId) => {
    setSelectedMasterFields((prev) =>
      prev.map((field) =>
        field.masterFieldId === fieldId ? { ...field, required: !field.required } : field
      )
    );
  };

  const isMasterFieldSelected = (fieldId) => {
    return selectedMasterFields.some((f) => f.masterFieldId === fieldId);
  };

  const addCustomField = () => {
    if (!newCustomField.label.trim()) {
      alert('Please enter a field label');
      return;
    }
    
    const field = {
      label: newCustomField.label.trim(),
      type: newCustomField.type,
      placeholder: newCustomField.placeholder || `Enter ${newCustomField.label.toLowerCase()}`,
      required: newCustomField.required,
    };
    
    if (['select', 'radio', 'checkbox'].includes(newCustomField.type)) {
      const validOptions = newCustomField.options.filter(opt => opt && opt.trim() !== '');
      if (validOptions.length > 0) {
        field.options = validOptions;
      }
    }
    
    setCustomFields((prev) => [...prev, field]);
    
    // Reset new custom field form
    setNewCustomField({
      label: '',
      type: 'text',
      placeholder: '',
      required: false,
      options: [],
    });
    
    // Reset any associated new option input
    setCustomFieldNewOptions(prev => ({
      ...prev,
      'new': ''
    }));
  };

  const removeCustomField = (index) => {
    setCustomFields((prev) => prev.filter((_, i) => i !== index));
    // Clean up the option input state for this field
    setCustomFieldNewOptions(prev => {
      const newState = { ...prev };
      delete newState[index];
      return newState;
    });
  };

  const updateCustomField = (index, field, value) => {
    setCustomFields((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      
      if (field === 'type' && !['select', 'radio', 'checkbox'].includes(value)) {
        delete updated[index].options;
      } else if (field === 'type' && ['select', 'radio', 'checkbox'].includes(value) && !updated[index].options) {
        updated[index].options = ['Option 1', 'Option 2'];
      }
      
      return updated;
    });
  };

  const addOptionToCustomField = (index) => {
    const newOption = customFieldNewOptions[index] || '';
    
    if (!newOption || !newOption.trim()) {
      alert('Please enter an option value');
      return;
    }
    
    setCustomFields((prev) => {
      const updated = [...prev];
      if (!updated[index].options) {
        updated[index].options = [];
      }
      updated[index].options = [...updated[index].options, newOption.trim()];
      return updated;
    });
    
    // Clear the input for this specific field
    setCustomFieldNewOptions(prev => ({
      ...prev,
      [index]: ''
    }));
  };

  const removeOptionFromCustomField = (index, optionIndex) => {
    setCustomFields(prev => {
      const updated = [...prev];
      updated[index].options = updated[index].options.filter((_, i) => i !== optionIndex);
      return updated;
    });
  };

  const addOptionToNewCustomField = () => {
    const newOption = customFieldNewOptions['new'] || '';
    
    if (!newOption || !newOption.trim()) {
      alert('Please enter an option value');
      return;
    }
    
    setNewCustomField(prev => ({
      ...prev,
      options: [...prev.options, newOption.trim()]
    }));
    
    // Clear the new option input
    setCustomFieldNewOptions(prev => ({
      ...prev,
      'new': ''
    }));
  };

  const removeOptionFromNewCustomField = (optionIndex) => {
    setNewCustomField(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== optionIndex)
    }));
  };

  const updateNewCustomFieldOption = (index, value) => {
    setNewCustomField(prev => ({
      ...prev,
      options: prev.options.map((opt, i) => i === index ? value : opt)
    }));
  };

  const updateCustomFieldOption = (fieldIndex, optionIndex, value) => {
    setCustomFields(prev => {
      const updated = [...prev];
      updated[fieldIndex].options[optionIndex] = value;
      return updated;
    });
  };

  const handleNewOptionInputChange = (fieldIndex, value) => {
    setCustomFieldNewOptions(prev => ({
      ...prev,
      [fieldIndex]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Dataset Setup</h2>
          <p className="text-sm text-gray-600">Update pre-defined fields or custom input fields.</p>
        </div>
        <button
          onClick={() => setShowMasterFieldsModal(true)}
          className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-sm bg-white text-[#6869AC] border border-[#6869AC] hover:bg-gray-50"
        >
          <Plus className="w-4 h-4 mr-1" />
          Select Pre-defined Fields
        </button>
      </div>

      {/* Selected Master Fields */}
      {selectedMasterFields.length > 0 && (
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-800 mb-3">Selected Pre-defined Fields</h3>
          <div className="space-y-2">
            {selectedMasterFields.map((field) => {
              const masterField = masterFields.find(f => f.masterFieldId === field.masterFieldId);
              return (
                <div key={field.masterFieldId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-sm">{masterField?.label || field.masterFieldId}</span>
                      <span className="text-xs px-2 py-0.5 bg-gray-200 rounded text-gray-600">
                        {masterField?.type || 'N/A'}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Required:</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${field.required ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                          {field.required ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                    {masterField?.placeholder && (
                      <p className="text-xs text-gray-500 mb-1">{masterField.placeholder}</p>
                    )}
                    {masterField?.options && masterField.options.length > 0 && (
                      <p className="text-xs text-gray-500">
                        Options: {masterField.options.join(', ')}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleMasterFieldRequired(field.masterFieldId)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        field.required ? 'bg-[#6869AC]' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          field.required ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => toggleMasterField({ masterFieldId: field.masterFieldId })}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Custom Fields */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-800">Custom Fields</h3>
        </div>

        {/* Add Custom Field Form */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            addCustomField();
          }}
          className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700">
                Field Label <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={newCustomField.label}
                onChange={(e) => {
                  setNewCustomField(prev => ({ ...prev, label: e.target.value }));
                }}
                placeholder="e.g., Company Name"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#6869AC] focus:ring-1 focus:ring-[#6869AC]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-700">
                Field Type <span className="text-red-500">*</span>
              </label>
              <select
                value={newCustomField.type}
                onChange={(e) => {
                  const newType = e.target.value;
                  const isOptionType = ['select', 'radio', 'checkbox'].includes(newType);
                  setNewCustomField(prev => ({ 
                    ...prev, 
                    type: newType,
                    options: isOptionType ? ['Option 1', 'Option 2'] : []
                  }));
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#6869AC] focus:ring-1 focus:ring-[#6869AC]"
              >
                {fieldTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-xs font-medium mb-1 text-gray-700">
              Placeholder
            </label>
            <input
              type="text"
              value={newCustomField.placeholder}
              onChange={(e) => setNewCustomField(prev => ({ ...prev, placeholder: e.target.value }))}
              placeholder="e.g., Enter your company name"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#6869AC] focus:ring-1 focus:ring-[#6869AC]"
            />
          </div>

          {isOptionField(newCustomField.type) && (
            <div className="mb-3">
              <label className="block text-xs font-medium mb-1 text-gray-700">
                Options
              </label>
              <div className="space-y-2 mb-2">
                {newCustomField.options.map((option, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateNewCustomFieldOption(idx, e.target.value)}
                      placeholder={`Option ${idx + 1}`}
                      className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#6869AC] focus:ring-1 focus:ring-[#6869AC]"
                    />
                    {newCustomField.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOptionFromNewCustomField(idx)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customFieldNewOptions['new'] || ''}
                  onChange={(e) => handleNewOptionInputChange('new', e.target.value)}
                  placeholder="Add an option"
                  className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#6869AC] focus:ring-1 focus:ring-[#6869AC]"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addOptionToNewCustomField())}
                />
                <button
                  type="button"
                  onClick={addOptionToNewCustomField}
                  className="px-3 py-1.5 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                >
                  Add Option
                </button>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={newCustomField.required}
                onChange={(e) => setNewCustomField(prev => ({ ...prev, required: e.target.checked }))}
                className="w-4 h-4 text-[#6869AC] rounded border-gray-300 focus:ring-[#6869AC]"
              />
              <span className="text-sm">Required field</span>
            </div>
            <button
              type="submit"
              disabled={!newCustomField.label.trim()}
              className="px-4 py-2 text-sm text-white rounded hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed bg-[#6869AC]"
            >
              <Plus className="w-4 h-4 inline mr-1" />
              Add Custom Field
            </button>
          </div>
        </form>

        {/* Custom Fields List */}
        {customFields.length > 0 && (
          <div className="space-y-4">
            {customFields.map((field, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{field.label}</span>
                      <span className="text-xs px-2 py-0.5 bg-gray-200 rounded text-gray-600">
                        {field.type}
                      </span>
                      {field.required && (
                        <span className="text-xs px-2 py-0.5 bg-red-100 text-red-600 rounded">
                          Required
                        </span>
                      )}
                    </div>
                    {field.placeholder && (
                      <p className="text-xs text-gray-500">Placeholder: {field.placeholder}</p>
                    )}
                    {field.options && field.options.length > 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        Options: {field.options.join(', ')}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeCustomField(index)}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">
                      Field Label
                    </label>
                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => updateCustomField(index, 'label', e.target.value)}
                      placeholder="Field label"
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#6869AC] focus:ring-1 focus:ring-[#6869AC]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1 text-gray-700">
                      Field Type
                    </label>
                    <select
                      value={field.type}
                      onChange={(e) => updateCustomField(index, 'type', e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#6869AC] focus:ring-1 focus:ring-[#6869AC]"
                    >
                      {fieldTypeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="block text-xs font-medium mb-1 text-gray-700">
                    Placeholder
                  </label>
                  <input
                    type="text"
                    value={field.placeholder || ''}
                    onChange={(e) => updateCustomField(index, 'placeholder', e.target.value)}
                    placeholder="Enter placeholder"
                    className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#6869AC] focus:ring-1 focus:ring-[#6869AC]"
                  />
                </div>

                {isOptionField(field.type) && (
                  <div className="mb-3">
                    <label className="block text-xs font-medium mb-1 text-gray-700">
                      Options
                    </label>
                    <div className="space-y-2 mb-2">
                      {field.options && field.options.map((option, optionIdx) => (
                        <div key={optionIdx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateCustomFieldOption(index, optionIdx, e.target.value)}
                            placeholder={`Option ${optionIdx + 1}`}
                            className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#6869AC] focus:ring-1 focus:ring-[#6869AC]"
                          />
                          <button
                            type="button"
                            onClick={() => removeOptionFromCustomField(index, optionIdx)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add an option"
                        value={customFieldNewOptions[index] || ''}
                        onChange={(e) => handleNewOptionInputChange(index, e.target.value)}
                        className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-[#6869AC] focus:ring-1 focus:ring-[#6869AC]"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addOptionToCustomField(index))}
                      />
                      <button
                        type="button"
                        onClick={() => addOptionToCustomField(index)}
                        className="px-3 py-1.5 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                      >
                        Add Option
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) => updateCustomField(index, 'required', e.target.checked)}
                    className="w-4 h-4 text-[#6869AC] rounded border-gray-300 focus:ring-[#6869AC]"
                  />
                  <span className="text-sm">Required field</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          onClick={goToPreviousStep}
          className="px-6 py-2 rounded-lg font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
        >
          Previous
        </button>
        <button
          onClick={goToNextStep}
          className="px-6 py-2 rounded-lg font-medium bg-[#6869AC] text-white hover:opacity-90"
        >
          Next
        </button>
      </div>

      {/* Master Fields Modal */}
      {showMasterFieldsModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Select Pre-defined Fields
              </h3>
              <button
                onClick={() => setShowMasterFieldsModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Select from pre-defined fields. You can toggle required status.
                </p>
                <span className="text-sm text-gray-500">
                  {selectedMasterFields.length} selected
                </span>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {masterFields.map((field) => {
                  const isSelected = isMasterFieldSelected(field.masterFieldId);
                  const selectedField = selectedMasterFields.find(f => f.masterFieldId === field.masterFieldId);
                  
                  return (
                    <div
                      key={field.masterFieldId}
                      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                        isSelected
                          ? 'border-[#6869AC] bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => toggleMasterField(field)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-[#6869AC]" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{field.label}</span>
                              <span className="text-xs px-2 py-0.5 bg-gray-200 rounded text-gray-600">
                                {field.type}
                              </span>
                            </div>
                            {isSelected && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">Required:</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleMasterFieldRequired(field.masterFieldId);
                                  }}
                                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                                    selectedField?.required ? 'bg-[#6869AC]' : 'bg-gray-300'
                                  }`}
                                >
                                  <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                      selectedField?.required ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                  />
                                </button>
                              </div>
                            )}
                          </div>
                          {field.placeholder && (
                            <p className="text-xs text-gray-500 mb-1">{field.placeholder}</p>
                          )}
                          {field.options && field.options.length > 0 && (
                            <p className="text-xs text-gray-500">
                              Options: {field.options.join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-200 mt-4">
              <button
                onClick={() => setShowMasterFieldsModal(false)}
                className="flex-1 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 bg-[#6869AC]"
              >
                Add Selected Fields ({selectedMasterFields.length})
              </button>
              <button
                onClick={() => setShowMasterFieldsModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ChecklistSetup = ({ trackSteps, setTrackSteps, goToNextStep, goToPreviousStep, stepErrors }) => {
  const addStep = () => {
    const newOrder = trackSteps.length + 1;
    setTrackSteps([
      ...trackSteps,
      {
        title: '',
        description: '',
        order: newOrder,
      },
    ]);
  };

  const updateStep = (index, field, value) => {
    const updatedSteps = [...trackSteps];
    updatedSteps[index][field] = value;
    setTrackSteps(updatedSteps);
  };

  const removeStep = (index) => {
    if (trackSteps.length <= 1) {
      alert('You must have at least one checklist step');
      return;
    }
    
    const updatedSteps = trackSteps.filter((_, i) => i !== index);
    // Reorder steps
    const reorderedSteps = updatedSteps.map((step, idx) => ({
      ...step,
      order: idx + 1,
    }));
    setTrackSteps(reorderedSteps);
  };

  const moveStepUp = (index) => {
    if (index === 0) return;
    
    const updatedSteps = [...trackSteps];
    const temp = updatedSteps[index];
    updatedSteps[index] = updatedSteps[index - 1];
    updatedSteps[index - 1] = temp;
    
    // Update orders
    const reorderedSteps = updatedSteps.map((step, idx) => ({
      ...step,
      order: idx + 1,
    }));
    setTrackSteps(reorderedSteps);
  };

  const moveStepDown = (index) => {
    if (index === trackSteps.length - 1) return;
    
    const updatedSteps = [...trackSteps];
    const temp = updatedSteps[index];
    updatedSteps[index] = updatedSteps[index + 1];
    updatedSteps[index + 1] = temp;
    
    // Update orders
    const reorderedSteps = updatedSteps.map((step, idx) => ({
      ...step,
      order: idx + 1,
    }));
    setTrackSteps(reorderedSteps);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Checklist Setup</h2>
        <p className="text-sm text-gray-600">Define the steps customers will follow for this service.</p>
      </div>

      <div className="space-y-4">
        {trackSteps.map((step, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#6869AC] text-white text-sm font-medium">
                  {step.order}
                </div>
                <div>
                  <h3 className="font-medium text-sm">Step {step.order}</h3>
                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => moveStepUp(index)}
                      disabled={index === 0}
                      className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Move Up
                    </button>
                    <button
                      onClick={() => moveStepDown(index)}
                      disabled={index === trackSteps.length - 1}
                      className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Move Down
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={() => removeStep(index)}
                className="p-1 text-red-500 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700">
                  Step Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={step.title}
                  onChange={(e) => updateStep(index, 'title', e.target.value)}
                  placeholder="e.g., Data & Document Intake"
                  className={`w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 ${
                    stepErrors[`step_${index}_title`] 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-[#6869AC] focus:ring-[#6869AC]'
                  }`}
                />
                {stepErrors[`step_${index}_title`] && (
                  <p className="mt-1 text-xs text-red-600">{stepErrors[`step_${index}_title`]}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium mb-1 text-gray-700">
                  Step Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={step.description}
                  onChange={(e) => updateStep(index, 'description', e.target.value)}
                  placeholder="e.g., Share your basic details and upload the necessary documents to begin"
                  className={`w-full px-3 py-2 border rounded h-20 resize-none text-sm focus:outline-none focus:ring-1 ${
                    stepErrors[`step_${index}_description`] 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-[#6869AC] focus:ring-[#6869AC]'
                  }`}
                />
                {stepErrors[`step_${index}_description`] && (
                  <p className="mt-1 text-xs text-red-600">{stepErrors[`step_${index}_description`]}</p>
                )}
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={addStep}
          className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-[#6869AC] hover:bg-gray-50"
        >
          <Plus className="w-6 h-6 text-gray-400 mb-1" />
          <span className="text-sm text-gray-600">Add Another Step</span>
        </button>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          onClick={goToPreviousStep}
          className="px-6 py-2 rounded-lg font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
        >
          Previous
        </button>
        <button
          onClick={goToNextStep}
          className="px-6 py-2 rounded-lg font-medium bg-[#6869AC] text-white hover:opacity-90"
        >
          Next
        </button>
      </div>
    </div>
  );
};

const ReviewPublish = ({ 
  basicInfo, 
  categories, 
  filteredSubcategories, 
  selectedMasterFields, 
  customFields, 
  trackSteps, 
  priceMode, 
  discountPercentage, 
  masterFields, 
  newCustomField,
  loading,
  error,
  goToPreviousStep,
  goToStep,
  submissionStatus,
  showSuccessPopup,
  serviceId,
  navigate,
  handleUpdateService
}) => {
  const handleSubmit = async () => {
    handleUpdateService();
  };

  const getCategoryName = () => {
    return categories.find(c => c.categoryId === basicInfo.categoryId)?.categoryName || 'Not selected';
  };

  const getSubcategoryName = () => {
    return filteredSubcategories.find(s => s.subCategoryId === basicInfo.subCategoryId)?.subCategoryName || 'Not selected';
  };

  const getMasterFieldName = (fieldId) => {
    return masterFields.find(f => f.masterFieldId === fieldId)?.label || fieldId;
  };

  const getServiceTypeLabel = () => {
    return basicInfo.serviceType === 'ONE_TIME' ? 'One Time' : 'Recurring';
  };

  const getFrequencyLabel = () => {
    const frequencyMap = {
      'DAILY': 'Daily',
      'WEEKLY': 'Weekly',
      'MONTHLY': 'Monthly',
      'QUARTERLY': 'Quarterly',
      'YEARLY': 'Yearly'
    };
    return frequencyMap[basicInfo.frequency] || 'Not specified';
  };

  const getDurationUnitLabel = () => {
    const unitMap = {
      'DAY': 'Days',
      'MONTH': 'Months',
      'YEAR': 'Years'
    };
    return unitMap[basicInfo.durationUnit] || 'Not specified';
  };

  const hasUnsavedCustomField = newCustomField.label && newCustomField.label.trim() !== '';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Review & Update</h2>
          <p className="text-sm text-gray-600">Review all information before updating your service.</p>
        </div>
        <button
          onClick={goToPreviousStep}
          className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
        >
          ← Back
        </button>
      </div>

      <div className="space-y-6">
        {/* Service Information Review */}
        <div className="border border-gray-200 rounded-lg p-4 relative">
          <div className="absolute top-4 right-4">
            <button
              onClick={() => goToStep(1)}
              className="flex cursor-pointer items-center gap-2 text-sm text-[#6869AC] hover:text-[#595a9c]"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          </div>
          <h3 className="font-semibold text-gray-900 mb-3">Service Information</h3>
          
          {/* Service Image Preview */}
          {basicInfo.photoUrl && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Service Image</p>
              <img 
                src={basicInfo.photoUrl} 
                alt="Service" 
                className="w-full max-w-xs h-48 object-cover rounded-lg border border-gray-200"
              />
              <p className="text-xs text-gray-500 mt-1">
                {basicInfo.photoChanged ? '✓ Image updated' : 'Original image'}
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Service Type</p>
              <p className="font-medium">{getServiceTypeLabel()}</p>
            </div>
            {basicInfo.serviceType === 'RECURRING' && (
              <>
                <div>
                  <p className="text-sm text-gray-500">Frequency</p>
                  <p className="font-medium">{getFrequencyLabel()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-medium">{basicInfo.duration} {getDurationUnitLabel()}</p>
                </div>
              </>
            )}
            <div>
              <p className="text-sm text-gray-500">Category</p>
              <p className="font-medium">{getCategoryName()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Subcategory</p>
              <p className="font-medium">{getSubcategoryName()}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Documents Required</p>
              <p className="font-medium">{basicInfo.documentsRequired ? 'Yes' : 'No'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Service Name</p>
              <p className="font-medium">{basicInfo.name || 'Not provided'}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Description</p>
              <p className="font-medium">{basicInfo.description || 'Not provided'}</p>
            </div>
          </div>
        </div>

        {/* Pricing Review */}
        <div className="border border-gray-200 rounded-lg p-4 relative">
          <div className="absolute top-4 right-4">
            <button
              onClick={() => goToStep(2)}
              className="flex items-center cursor-pointer gap-2 text-sm text-[#6869AC] hover:text-[#595a9c]"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          </div>
          <h3 className="font-semibold text-gray-900 mb-3">Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Individual Price</p>
              <p className="font-medium">₹{basicInfo.individualPrice || '0'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Offer Price</p>
              <p className="font-medium">₹{basicInfo.offerPrice || '0'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pricing Mode</p>
              <p className="font-medium capitalize">{priceMode}</p>
            </div>
            {priceMode === 'percentage' && discountPercentage && (
              <div>
                <p className="text-sm text-gray-500">Discount Percentage</p>
                <p className="font-medium">{discountPercentage}%</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">GST Applicable</p>
              <p className="font-medium">{basicInfo.isGstApplicable ? 'Yes' : 'No'}</p>
            </div>
            {basicInfo.isGstApplicable && (
              <>
                <div>
                  <p className="text-sm text-gray-500">GST Percentage</p>
                  <p className="font-medium">{basicInfo.gstPercentage}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Final Price (Incl. GST)</p>
                  <p className="font-medium">₹{basicInfo.finalIndividualPrice || '0'}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Dataset Review */}
        <div className="border border-gray-200 rounded-lg p-4 relative">
          <div className="absolute top-4 right-4">
            <button
              onClick={() => goToStep(3)}
              className="flex items-center cursor-pointer gap-2 text-sm text-[#6869AC] hover:text-[#595a9c]"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          </div>
          <h3 className="font-semibold text-gray-900 mb-3">Dataset Setup</h3>
          {hasUnsavedCustomField && (
            <div className="py-3">
              <p className="text-sm font-medium text-gray-500 mb-2">Unsaved Custom Field</p>
              <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div>
                  <span className="text-sm font-medium">{newCustomField.label}</span>
                  <span className="text-xs ml-2 text-yellow-600">({newCustomField.type})</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${newCustomField.required ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                  {newCustomField.required ? 'Required' : 'Optional'}
                </span>
              </div>
            </div>
          )}

          {selectedMasterFields.length > 0 && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Pre-defined Fields ({selectedMasterFields.length})</p>
              <div className="space-y-2">
                {selectedMasterFields.map((field, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{getMasterFieldName(field.masterFieldId)}</span>
                    <span className={`text-xs px-2 py-1 rounded ${field.required ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                      {field.required ? 'Required' : 'Optional'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {customFields.length > 0 && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Custom Fields ({customFields.length})</p>
              <div className="space-y-2">
                {customFields.map((field, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div>
                      <span className="text-sm font-medium">{field.label}</span>
                      <span className="text-xs ml-2 text-gray-500">({field.type})</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${field.required ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                      {field.required ? 'Required' : 'Optional'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedMasterFields.length === 0 && customFields.length === 0 && !hasUnsavedCustomField && (
            <p className="text-sm text-gray-500 italic">No fields configured</p>
          )}
        </div>

        {/* Checklist Review */}
        <div className="border border-gray-200 rounded-lg p-4 relative">
          <div className="absolute top-4 right-4">
            <button
              onClick={() => goToStep(4)}
              className="flex items-center cursor-pointer gap-2 text-sm text-[#6869AC] hover:text-[#595a9c]"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          </div>
          <h3 className="font-semibold text-gray-900 mb-3">Checklist Steps ({trackSteps.length})</h3>
          <div className="space-y-3">
            {trackSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#6869AC] text-white text-sm font-medium">
                  {step.order}
                </div>
                <div>
                  <p className="font-medium text-sm">{step.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={goToPreviousStep}
            disabled={loading || submissionStatus === 'loading'}
            className="flex-1 py-3 rounded-lg font-semibold text-gray-700 text-sm sm:text-base hover:bg-gray-50 border border-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            ← Back
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || submissionStatus === 'loading'}
            className="flex-1 py-3 rounded-lg font-semibold text-white text-sm sm:text-base hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed bg-[#6869AC]"
          >
            {submissionStatus === 'loading' ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </span>
            ) : 'Update Service'}
          </button>
        </div>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Service Updated Successfully!
              </h3>
              <p className="text-gray-600 mb-6">
                Your service has been updated successfully.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate(`/service/view/${serviceId}`)}
                  className="flex-1 py-3 rounded-lg font-semibold text-[#6869AC] text-sm sm:text-base hover:bg-[#6869AC] hover:text-white border border-[#6869AC] transition-colors"
                >
                  View Service
                </button>
                <button
                  onClick={() => navigate('/service-hub')}
                  className="flex-1 py-3 rounded-lg font-semibold text-white text-sm sm:text-base bg-[#6869AC] hover:opacity-90"
                >
                  Back to Services
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Main EditService Component
const EditService = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [masterFields, setMasterFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stepErrors, setStepErrors] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState('idle');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Form data
  const [basicInfo, setBasicInfo] = useState({
    serviceId: serviceId,
    categoryId: '',
    subCategoryId: '',
    name: '',
    description: '',
    individualPrice: '',
    offerPrice: '',
    employeeId: 'cmjjl771p0005g11eu3q8t2rq',
    serviceType: 'ONE_TIME',
    frequency: '',
    duration: '',
    durationUnit: '',
    documentsRequired: true,
    isGstApplicable: true,
    gstPercentage: 18,
    finalIndividualPrice: '',
    photoFile: null,
    photoUrl: '',
    photoChanged: false,
  });

  // Price mode
  const [priceMode, setPriceMode] = useState('fixed');
  const [discountPercentage, setDiscountPercentage] = useState('');

  // Selected master fields and custom fields
  const [selectedMasterFields, setSelectedMasterFields] = useState([]);
  const [customFields, setCustomFields] = useState([]);
  const [newCustomField, setNewCustomField] = useState({
    label: '',
    type: 'text',
    placeholder: '',
    required: false,
    options: [],
  });

  // Track steps
  const [trackSteps, setTrackSteps] = useState([
    {
      title: 'Data & Document Intake',
      order: 1,
      description: 'Share your basic details and upload the necessary documents to begin',
    },
    {
      title: 'Verification & Preparation',
      order: 2,
      description: 'Verification of information and application setup',
    },
    {
      title: 'Document Delivery',
      order: 3,
      description: 'Receive your official GST certificate',
    },
  ]);

  // Fetch initial data
  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
    fetchMasterFields();
    fetchServiceData();
  }, [serviceId]);

  useEffect(() => {
    if (basicInfo.categoryId) {
      const filtered = subcategories.filter(
        (sub) => sub.categoryId === basicInfo.categoryId
      );
      setFilteredSubcategories(filtered);
    } else {
      setFilteredSubcategories([]);
    }
  }, [basicInfo.categoryId, subcategories]);

  useEffect(() => {
    // Calculate offer price based on percentage mode
    if (priceMode === 'percentage' && basicInfo.individualPrice && discountPercentage) {
      const individualPrice = parseFloat(basicInfo.individualPrice);
      const percentage = parseFloat(discountPercentage);
      
      if (!isNaN(individualPrice) && !isNaN(percentage) && percentage > 0 && percentage <= 100) {
        const discountAmount = (individualPrice * percentage) / 100;
        const offerPrice = individualPrice - discountAmount;
        setBasicInfo(prev => ({
          ...prev,
          offerPrice: Math.round(offerPrice).toString()
        }));
      }
    }
    
    // Calculate final price with GST
    if (basicInfo.individualPrice && basicInfo.isGstApplicable && basicInfo.gstPercentage) {
      const individualPrice = parseFloat(basicInfo.individualPrice);
      const gstPercentage = parseFloat(basicInfo.gstPercentage);
      
      if (!isNaN(individualPrice) && !isNaN(gstPercentage) && gstPercentage >= 0) {
        const gstAmount = (individualPrice * gstPercentage) / 100;
        const finalPrice = individualPrice + gstAmount;
        setBasicInfo(prev => ({
          ...prev,
          finalIndividualPrice: Math.round(finalPrice).toString()
        }));
      }
    }
  }, [basicInfo.individualPrice, discountPercentage, priceMode, basicInfo.isGstApplicable, basicInfo.gstPercentage]);

  // Fetch service data
  const fetchServiceData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/service/${serviceId}`);
      
      if (response.data.success) {
        const service = response.data.service;
        
        // Set basic info
        setBasicInfo(prev => ({
          ...prev,
          categoryId: service.categoryId || '',
          subCategoryId: service.subCategoryId || '',
          name: service.name || '',
          description: service.description || '',
          individualPrice: service.individualPrice?.toString() || '',
          offerPrice: service.offerPrice?.toString() || '',
          serviceType: service.serviceType || 'ONE_TIME',
          frequency: service.frequency || '',
          duration: service.duration?.toString() || '',
          durationUnit: service.durationUnit || '',
          documentsRequired: service.documentsRequired || true,
          isGstApplicable: service.isGstApplicable || true,
          gstPercentage: service.gstPercentage?.toString() || '18',
          finalIndividualPrice: service.finalIndividualPrice?.toString() || '',
          photoUrl: service.photoUrl || '',
        }));

        // Set pricing mode based on existing data
        if (service.individualPrice && service.offerPrice) {
          const discount = ((parseFloat(service.individualPrice) - parseFloat(service.offerPrice)) / parseFloat(service.individualPrice)) * 100;
          if (Math.round(discount) > 0) {
            setPriceMode('percentage');
            setDiscountPercentage(Math.round(discount).toString());
          } else {
            setPriceMode('fixed');
          }
        }

        // Fetch and set input fields
        await fetchInputFields();
        
        // Fetch and set track steps
        await fetchTrackSteps();
      }
    } catch (err) {
      console.error('Error fetching service data:', err);
      setError('Failed to load service data');
    } finally {
      setLoading(false);
    }
  };

  // Fetch input fields
  const fetchInputFields = async () => {
    try {
      const response = await axiosInstance.get(`/service/${serviceId}/input-fields`);
      
      if (response.data.success) {
        const fields = response.data.fields || [];
        
        // Separate master fields and custom fields
        const master = [];
        const custom = [];
        
        fields.forEach(field => {
          if (field.masterFieldId) {
            master.push({
              masterFieldId: field.masterFieldId,
              required: field.required || false
            });
          } else {
            custom.push({
              label: field.label,
              type: field.type,
              placeholder: field.placeholder || '',
              required: field.required || false,
              options: field.options || []
            });
          }
        });
        
        setSelectedMasterFields(master);
        setCustomFields(custom);
      }
    } catch (err) {
      console.error('Error fetching input fields:', err);
    }
  };

  // Fetch track steps
  const fetchTrackSteps = async () => {
    try {
      const response = await axiosInstance.get(`/service/${serviceId}/track-steps`);
      
      if (response.data.success && response.data.steps) {
        setTrackSteps(response.data.steps.map(step => ({
          title: step.title,
          description: step.description,
          order: step.order
        })).sort((a, b) => a.order - b.order));
      }
    } catch (err) {
      console.error('Error fetching track steps:', err);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get('/category');
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Fetch subcategories
  const fetchSubcategories = async () => {
    try {
      const response = await axiosInstance.get('/subcategory');
      if (response.data.success) {
        setSubcategories(response.data.subcategories);
      }
    } catch (err) {
      console.error('Error fetching subcategories:', err);
    }
  };

  // Fetch master fields
  const fetchMasterFields = async () => {
    try {
      const response = await axiosInstance.get('/master-fields');
      if (response.data.success) {
        setMasterFields(response.data.masterFields);
      }
    } catch (err) {
      console.error('Error fetching master fields:', err);
    }
  };

  // Validate current step
  const validateCurrentStep = () => {
    const errors = {};
    
    switch (currentStep) {
      case 1:
        if (!basicInfo.serviceType) errors.serviceType = 'Service type is required';
        if (!basicInfo.categoryId) errors.categoryId = 'Category is required';
        if (!basicInfo.subCategoryId) errors.subCategoryId = 'Subcategory is required';
        if (!basicInfo.name) errors.name = 'Service name is required';
        if (!basicInfo.description) errors.description = 'Description is required';
        if (!basicInfo.photoUrl) errors.photoUrl = 'Service image is required';
        
        if (basicInfo.serviceType === 'RECURRING') {
          if (!basicInfo.frequency) errors.frequency = 'Frequency is required';
          if (!basicInfo.duration) errors.duration = 'Duration is required';
          if (!basicInfo.durationUnit) errors.durationUnit = 'Duration unit is required';
        }
        break;
        
      case 2:
        if (!basicInfo.individualPrice || parseFloat(basicInfo.individualPrice) <= 0) {
          errors.individualPrice = 'Valid individual price is required';
        }
        if (priceMode === 'fixed' && (!basicInfo.offerPrice || parseFloat(basicInfo.offerPrice) <= 0)) {
          errors.offerPrice = 'Valid offer price is required';
        }
        if (priceMode === 'percentage' && (!discountPercentage || parseFloat(discountPercentage) <= 0 || parseFloat(discountPercentage) > 100)) {
          errors.discountPercentage = 'Valid discount percentage (1-100) is required';
        }
        if (basicInfo.isGstApplicable && (!basicInfo.gstPercentage || parseFloat(basicInfo.gstPercentage) < 0)) {
          errors.gstPercentage = 'Valid GST percentage is required';
        }
        break;
        
      case 3:
        // Dataset step is optional, no validation needed
        break;
        
      case 4:
        // Validate checklist steps
        if (trackSteps.length === 0) {
          errors.trackSteps = 'At least one checklist step is required';
        } else {
          trackSteps.forEach((step, index) => {
            if (!step.title || step.title.trim() === '') {
              errors[`step_${index}_title`] = 'Step title is required';
            }
            if (!step.description || step.description.trim() === '') {
              errors[`step_${index}_description`] = 'Step description is required';
            }
          });
        }
        break;
    }
    
    setStepErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const goToStep = (stepNumber) => {
    setCurrentStep(stepNumber);
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToNextStep = () => {
    if (validateCurrentStep() && currentStep < 5) {
      setCurrentStep(currentStep + 1);
      setStepErrors({});
    }
  };

  // Handle update service
  const handleUpdateService = async () => {
    setError('');
    setSubmissionStatus('loading');
    setLoading(true);
  
    try {
      console.log('Starting service update...');
      
      // AUTO ADD LAST CUSTOM FIELD IF USER FORGOT TO CLICK "ADD"
      let finalCustomFields = [...customFields];
      
      if (newCustomField.label && newCustomField.label.trim() !== '') {
        const field = {
          label: newCustomField.label.trim(),
          type: newCustomField.type,
          placeholder: newCustomField.placeholder || `Enter ${newCustomField.label.toLowerCase()}`,
          required: newCustomField.required,
        };
        
        if (['select', 'radio', 'checkbox'].includes(newCustomField.type)) {
          const validOptions = newCustomField.options.filter(opt => opt && opt.trim() !== '');
          if (validOptions.length > 0) {
            field.options = validOptions;
          }
        }
        
        finalCustomFields.push(field);
        console.log('Added unsaved custom field:', field);
      }
  
      // BASIC VALIDATION
      const validationErrors = [];
      
      if (!basicInfo.categoryId) validationErrors.push('Category is required');
      if (!basicInfo.subCategoryId) validationErrors.push('Subcategory is required');
      if (!basicInfo.name) validationErrors.push('Service name is required');
      if (!basicInfo.description) validationErrors.push('Description is required');
      if (!basicInfo.individualPrice) validationErrors.push('Individual price is required');
      if (!basicInfo.offerPrice) validationErrors.push('Offer price is required');
      if (!basicInfo.serviceType) validationErrors.push('Service type is required');
      if (!basicInfo.photoUrl) validationErrors.push('Service image is required');
  
      if (basicInfo.serviceType === 'RECURRING') {
        if (!basicInfo.frequency) validationErrors.push('Frequency is required');
        if (!basicInfo.duration) validationErrors.push('Duration is required');
        if (!basicInfo.durationUnit) validationErrors.push('Duration unit is required');
      }
  
      if (validationErrors.length > 0) {
        throw new Error('Please fix the following errors: ' + validationErrors.join(', '));
      }
  
      // STEP 1: Update Service
      console.log('Updating service...');
      
      const serviceData = {
        name: basicInfo.name.trim(),
        description: basicInfo.description.trim(),
        serviceType: basicInfo.serviceType,
        documentsRequired: basicInfo.documentsRequired,
        individualPrice: parseFloat(basicInfo.individualPrice),
        offerPrice: parseFloat(basicInfo.offerPrice),
        isGstApplicable: basicInfo.isGstApplicable,
        gstPercentage: basicInfo.isGstApplicable ? parseFloat(basicInfo.gstPercentage) : 0,
        finalIndividualPrice: parseFloat(basicInfo.finalIndividualPrice || basicInfo.offerPrice),
        employeeId: basicInfo.employeeId,
        subCategoryId: basicInfo.subCategoryId,
      };
      
      // Add recurring fields if applicable
      if (basicInfo.serviceType === 'RECURRING') {
        serviceData.frequency = basicInfo.frequency;
        serviceData.duration = parseInt(basicInfo.duration);
        serviceData.durationUnit = basicInfo.durationUnit;
      }
  
      console.log('Service update data:', serviceData);
      
      const serviceRes = await fetch(`${API_BASE}/service/${serviceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(serviceData),
      });
  
      console.log('Response status:', serviceRes.status);
      
      const responseText = await serviceRes.text();
      console.log('Response text (first 500 chars):', responseText.substring(0, 500));
      
      let serviceResponse;
      try {
        serviceResponse = JSON.parse(responseText);
        console.log('Service update response:', serviceResponse);
      } catch (jsonErr) {
        console.error('Failed to parse service response as JSON:', jsonErr);
        throw new Error(`Server error (${serviceRes.status}): ${responseText.substring(0, 200)}...`);
      }
      
      if (!serviceResponse.success) {
        const errorMsg = serviceResponse.error || serviceResponse.message || 'Service update failed';
        console.error('Service update failed:', errorMsg);
        throw new Error(errorMsg);
      }
  
      // STEP 2: Update image if changed
      if (basicInfo.photoChanged && basicInfo.photoFile) {
        console.log('Updating service image...');
        
        const imageFormData = new FormData();
        imageFormData.append('photoUrl', basicInfo.photoFile, basicInfo.photoFile.name);
        
        try {
          const imageRes = await fetch(`${API_BASE}/service/${serviceId}/image`, {
            method: 'PUT',
            body: imageFormData,
          });
          
          const imageData = await imageRes.json();
          console.log('Image update response:', imageData);
          
          if (!imageData.success) {
            console.warn('Image update had issues:', imageData);
          }
        } catch (imageErr) {
          console.warn('Failed to update image:', imageErr);
        }
      }
  
      // STEP 3: Update input fields
      if (finalCustomFields.length > 0 || selectedMasterFields.length > 0) {
        const fieldsPayload = [];
  
        // Add custom fields
        finalCustomFields.forEach((field) => {
          const obj = {
            label: field.label,
            type: field.type,
            placeholder: field.placeholder || '',
            required: field.required || false,
          };
  
          if (['select', 'radio', 'checkbox'].includes(field.type) && field.options?.length) {
            obj.options = field.options;
          }
  
          fieldsPayload.push(obj);
        });
        
        // Add selected master fields
        selectedMasterFields.forEach((field) => {
          const masterField = masterFields.find(f => f.masterFieldId === field.masterFieldId);
          const fieldData = {
            masterFieldId: field.masterFieldId,
            required: field.required || false,
          };
          
          if (masterField?.options && masterField.options.length > 0) {
            fieldData.options = masterField.options;
          }
          
          fieldsPayload.push(fieldData);
        });
  
        console.log('Updating input fields:', fieldsPayload);
        
        try {
          // First, delete existing fields
          await fetch(`${API_BASE}/service/${serviceId}/input-fields`, {
            method: 'DELETE',
          });
          
          // Then add new ones
          const inputRes = await fetch(
            `${API_BASE}/service/${serviceId}/input-fields`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ fields: fieldsPayload }),
            }
          );
  
          const inputData = await inputRes.json();
          console.log('Input fields update response:', inputData);
          
          if (!inputData.success) {
            console.warn('Input fields update had issues:', inputData);
          }
        } catch (inputErr) {
          console.warn('Failed to update input fields:', inputErr);
        }
      }
  
      // STEP 4: Update track steps
      if (trackSteps.length > 0) {
        console.log('Updating track steps:', trackSteps);
        
        try {
          // First, delete existing steps
          await fetch(`${API_BASE}/service/${serviceId}/track-steps`, {
            method: 'DELETE',
          });
          
          // Then add new ones
          const trackStepsRes = await fetch(`${API_BASE}/service/${serviceId}/track-steps`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              steps: trackSteps.map((s) => ({
                title: s.title,
                description: s.description,
                order: s.order,
              })),
            }),
          });
  
          const trackStepsData = await trackStepsRes.json();
          console.log('Track steps update response:', trackStepsData);
          
          if (!trackStepsData.success) {
            console.warn('Track steps update had issues:', trackStepsData);
          }
        } catch (trackErr) {
          console.warn('Failed to update track steps:', trackErr);
        }
      }
  
      setSubmissionStatus('success');
      setShowSuccessPopup(true);
      console.log('Service updated successfully!');
      
    } catch (err) {
      console.error('Update error:', err);
      setError(err.message || 'Failed to update service. Please try again.');
      setSubmissionStatus('error');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !basicInfo.name) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6869AC]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Service</h1>
                <p className="text-sm text-gray-600 mt-1">Update service details and configuration</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Service ID: {serviceId}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep === step
                        ? 'bg-[#6869AC] text-white'
                        : currentStep > step
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {currentStep > step ? '✓' : step}
                  </div>
                  <div className="ml-2 text-sm font-medium">
                    {step === 1 && 'Basic Info'}
                    {step === 2 && 'Pricing'}
                    {step === 3 && 'Dataset'}
                    {step === 4 && 'Checklist'}
                    {step === 5 && 'Review'}
                  </div>
                  {step < 5 && (
                    <div
                      className={`ml-2 w-16 h-0.5 ${
                        currentStep > step ? 'bg-green-300' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            {currentStep === 1 && (
              <ServiceInfo
                basicInfo={basicInfo}
                setBasicInfo={setBasicInfo}
                categories={categories}
                filteredSubcategories={filteredSubcategories}
                stepErrors={stepErrors}
                goToNextStep={goToNextStep}
                goToPreviousStep={goToPreviousStep}
                currentStep={currentStep}
              />
            )}

            {currentStep === 2 && (
              <PricingSetup
                basicInfo={basicInfo}
                setBasicInfo={setBasicInfo}
                priceMode={priceMode}
                setPriceMode={setPriceMode}
                discountPercentage={discountPercentage}
                setDiscountPercentage={setDiscountPercentage}
                stepErrors={stepErrors}
                goToNextStep={goToNextStep}
                goToPreviousStep={goToPreviousStep}
              />
            )}

            {currentStep === 3 && (
              <DatasetSetup
                selectedMasterFields={selectedMasterFields}
                setSelectedMasterFields={setSelectedMasterFields}
                customFields={customFields}
                setCustomFields={setCustomFields}
                newCustomField={newCustomField}
                setNewCustomField={setNewCustomField}
                masterFields={masterFields}
                stepErrors={stepErrors}
                goToNextStep={goToNextStep}
                goToPreviousStep={goToPreviousStep}
              />
            )}

            {currentStep === 4 && (
              <ChecklistSetup
                trackSteps={trackSteps}
                setTrackSteps={setTrackSteps}
                goToNextStep={goToNextStep}
                goToPreviousStep={goToPreviousStep}
                stepErrors={stepErrors}
              />
            )}

            {currentStep === 5 && (
              <ReviewPublish
                basicInfo={basicInfo}
                categories={categories}
                filteredSubcategories={filteredSubcategories}
                selectedMasterFields={selectedMasterFields}
                customFields={customFields}
                trackSteps={trackSteps}
                priceMode={priceMode}
                discountPercentage={discountPercentage}
                masterFields={masterFields}
                newCustomField={newCustomField}
                loading={loading}
                error={error}
                goToPreviousStep={goToPreviousStep}
                goToStep={goToStep}
                submissionStatus={submissionStatus}
                showSuccessPopup={showSuccessPopup}
                serviceId={serviceId}
                navigate={navigate}
                handleUpdateService={handleUpdateService}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditService;