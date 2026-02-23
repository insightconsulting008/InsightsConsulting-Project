import React, { createContext, useState, useContext, useEffect } from 'react';
import axiosInstance from '@src/providers/axiosInstance';

const ServiceContext = createContext();

export const useService = () => useContext(ServiceContext);

const API_BASE = 'https://insightsconsult-backend.onrender.com';

export const ServiceProvider = ({ children }) => {
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
    categoryId: '',
    subCategoryId: '',
    name: '',
    description: '',
    individualPrice: '',
    offerPrice: '',
    employeeId: 'cmlepw8cr0003h71dg0yb2ybj',
    serviceType: 'ONE_TIME',
    frequency: '',
    duration: '',
    durationUnit: '',
    documentsRequired: true,
    isGstApplicable: true,
    gstPercentage: 18,
    finalIndividualPrice: '',
    photoFile: null, // Store the File object directly
    photoUrl: '', // For preview (blob URL)
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

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
    fetchMasterFields();
  }, []);

  useEffect(() => {
    if (basicInfo.categoryId) {
      const filtered = subcategories.filter(
        (sub) => sub.categoryId === basicInfo.categoryId
      );
      setFilteredSubcategories(filtered);
      setBasicInfo((prev) => ({ ...prev, subCategoryId: '' }));
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
        // Image validation
      if (!basicInfo.photoFile) {
        errors.photoUrl = 'Service image is required';
      } else if (basicInfo.photoFile.size > 10 * 1024 * 512) { // 10MB check
        errors.photoUrl = 'Image size should be less than 10MB';
      }
        
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

  const uploadImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const blobUrl = URL.createObjectURL(file);
        
        resolve({
          file: file, // Return the File object directly
          blobUrl: blobUrl,
          fileName: file.name,
          fileType: file.type
        });
      };
      
      reader.onerror = (error) => {
        reject(error);
      };
      
      reader.readAsDataURL(file); // Still needed for preview
    });
  };

  const resetForm = () => {
    // Revoke blob URL if exists
    if (basicInfo.photoUrl && basicInfo.photoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(basicInfo.photoUrl);
    }
    
    setBasicInfo({
      categoryId: '',
      subCategoryId: '',
      name: '',
      description: '',
      individualPrice: '',
      offerPrice: '',
      employeeId: 'cmje6g8ot0002tzykf1av49fy',
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
    });
    setPriceMode('fixed');
    setDiscountPercentage('');
    setSelectedMasterFields([]);
    setCustomFields([]);
    setNewCustomField({
      label: '',
      type: 'text',
      placeholder: '',
      required: false,
      options: [],
    });
    setTrackSteps([
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
    setCurrentStep(1);
    setStepErrors({});
    setSubmissionStatus('idle');
    setShowSuccessPopup(false);
  };

  const value = {
    currentStep,
    setCurrentStep,
    categories,
    subcategories,
    filteredSubcategories,
    masterFields,
    loading,
    setLoading,
    error,
    setError,
    stepErrors,
    setStepErrors,
    validateCurrentStep,
    basicInfo,
    setBasicInfo,
    priceMode,
    setPriceMode,
    discountPercentage,
    setDiscountPercentage,
    selectedMasterFields,
    setSelectedMasterFields,
    customFields,
    setCustomFields,
    newCustomField,
    setNewCustomField,
    trackSteps,
    setTrackSteps,
    resetForm,
    fetchCategories,
    fetchSubcategories,
    fetchMasterFields,
    uploadImage,
    API_BASE,
    submissionStatus,
    setSubmissionStatus,
    showSuccessPopup,
    setShowSuccessPopup,
    goToStep,
    goToPreviousStep,
    goToNextStep,
  };

  return (
    <ServiceContext.Provider value={value}>
      {children}
    </ServiceContext.Provider>
  );
};