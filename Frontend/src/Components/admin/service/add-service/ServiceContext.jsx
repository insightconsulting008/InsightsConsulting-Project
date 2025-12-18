import React, { createContext, useState, useContext, useEffect } from 'react';

const ServiceContext = createContext();

export const useService = () => useContext(ServiceContext);

const API_BASE = 'https://insightsconsult-backend.onrender.com';
const PRIMARY = '#6869AC';

export const ServiceProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [masterFields, setMasterFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form data
  const [basicInfo, setBasicInfo] = useState({
    categoryId: '',
    subCategoryId: '',
    name: '',
    description: '',
    individualPrice: '',
    offerPrice: '',
    employeeId: 'cmj01bjeq0004i81earzdnfi2',
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
  }, [basicInfo.individualPrice, discountPercentage, priceMode]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE}/category`);
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const response = await fetch(`${API_BASE}/subcategory`);
      const data = await response.json();
      if (data.success) {
        setSubcategories(data.subcategories);
      }
    } catch (err) {
      console.error('Error fetching subcategories:', err);
    }
  };

  const fetchMasterFields = async () => {
    try {
      const response = await fetch(`${API_BASE}/master-fields`);
      const data = await response.json();
      if (data.success) {
        setMasterFields(data.masterFields);
      }
    } catch (err) {
      console.error('Error fetching master fields:', err);
    }
  };

  const resetForm = () => {
    setBasicInfo({
      categoryId: '',
      subCategoryId: '',
      name: '',
      description: '',
      individualPrice: '',
      offerPrice: '',
      employeeId: 'cmj01bjeq0004i81earzdnfi2',
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
  };

  const value = {
    currentStep,
    setCurrentStep,
    categories,
    subcategories,
    filteredSubcategories,
    masterFields,
    loading,
    error,
    setError,
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
    API_BASE,
    PRIMARY
  };

  return (
    <ServiceContext.Provider value={value}>
      {children}
    </ServiceContext.Provider>
  );
};