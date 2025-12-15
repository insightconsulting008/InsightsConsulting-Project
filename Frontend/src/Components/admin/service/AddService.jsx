import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  Plus,
  Trash2,
  ArrowLeft,
  Edit2,
  X,
  Check,
  MoreVertical,
  CheckSquare,
  Square,
  ArrowUp,
  ArrowDown,
  Percent,
} from 'lucide-react';

const API_BASE = 'https://insightsconsult-backend.onrender.com';
const PRIMARY = '#6869AC';

export default function AddService() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [masterFields, setMasterFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Modal states
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(null);
  const [showMasterFieldsModal, setShowMasterFieldsModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');

  // Dropdown states
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(null);
  const [showSubcategoryDropdown, setShowSubcategoryDropdown] = useState(null);

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

  // Track individual option inputs for each custom field
  const [customFieldNewOptions, setCustomFieldNewOptions] = useState({});

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

  const [editingStep, setEditingStep] = useState(null);

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

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return;
    try {
      const response = await fetch(`${API_BASE}/category`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryName: newCategoryName }),
      });
      const data = await response.json();
      if (data.success) {
        fetchCategories();
        setNewCategoryName('');
        setShowCategoryModal(false);
      }
    } catch (err) {
      setError('Failed to add category');
    }
  };

  const handleEditCategory = async (categoryId) => {
    if (!newCategoryName.trim()) return;
    try {
      const response = await fetch(`${API_BASE}/category/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryName: newCategoryName }),
      });
      const data = await response.json();
      if (data.success) {
        fetchCategories();
        setShowEditModal(null);
        setEditId(null);
        setNewCategoryName('');
        setShowCategoryDropdown(null);
      }
    } catch (err) {
      setError('Failed to edit category');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await fetch(`${API_BASE}/category/${categoryId}`, { method: 'DELETE' });
      fetchCategories();
      fetchSubcategories();
      setShowCategoryDropdown(null);
      if (basicInfo.categoryId === categoryId) {
        setBasicInfo((prev) => ({ ...prev, categoryId: '', subCategoryId: '' }));
      }
    } catch (err) {
      setError('Failed to delete category');
    }
  };

  const handleAddSubcategory = async () => {
    if (!newSubcategoryName.trim() || !basicInfo.categoryId) return;
    try {
      const response = await fetch(`${API_BASE}/subcategory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          categoryId: basicInfo.categoryId,
          subCategoryName: newSubcategoryName,
        }),
      });
      const data = await response.json();
      if (data.success) {
        fetchSubcategories();
        setNewSubcategoryName('');
        setShowSubcategoryModal(false);
      }
    } catch (err) {
      setError('Failed to add subcategory');
    }
  };

  const handleEditSubcategory = async (subCategoryId) => {
    if (!newSubcategoryName.trim()) return;
    try {
      const response = await fetch(`${API_BASE}/subcategory/${subCategoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subCategoryName: newSubcategoryName,
          categoryId: basicInfo.categoryId,
        }),
      });
      const data = await response.json();
      if (data.success) {
        fetchSubcategories();
        setShowEditModal(null);
        setEditId(null);
        setNewSubcategoryName('');
        setShowSubcategoryDropdown(null);
      }
    } catch (err) {
      setError('Failed to edit subcategory');
    }
  };

  const handleDeleteSubcategory = async (subCategoryId) => {
    if (!window.confirm('Are you sure you want to delete this subcategory?')) return;
    try {
      await fetch(`${API_BASE}/subcategory/${subCategoryId}`, { method: 'DELETE' });
      fetchSubcategories();
      setShowSubcategoryDropdown(null);
      if (basicInfo.subCategoryId === subCategoryId) {
        setBasicInfo((prev) => ({ ...prev, subCategoryId: '' }));
      }
    } catch (err) {
      setError('Failed to delete subcategory');
    }
  };

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

  const addTrackStep = () => {
    const newOrder = trackSteps.length + 1;
    setTrackSteps((prev) => [
      ...prev,
      { title: '', order: newOrder, description: '' },
    ]);
  };

  const removeTrackStep = (index) => {
    const updated = trackSteps.filter((_, i) => i !== index);
    updated.forEach((step, i) => (step.order = i + 1));
    setTrackSteps(updated);
  };

  const updateTrackStep = (index, field, value) => {
    const updated = [...trackSteps];
    updated[index][field] = value;
    setTrackSteps(updated);
  };

  const moveTrackStep = (index, direction) => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === trackSteps.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : direction === 'down' ? index + 1 : index;
    const updated = [...trackSteps];
    
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    
    updated.forEach((step, i) => {
      step.order = i + 1;
    });
    
    setTrackSteps(updated);
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
    setCustomFieldNewOptions({});
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
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
  
    try {
      // ✅ AUTO ADD LAST CUSTOM FIELD IF USER FORGOT TO CLICK "ADD"
      let finalCustomFields = [...customFields];
  
      if (newCustomField.label.trim()) {
        const pendingField = {
          label: newCustomField.label.trim(),
          type: newCustomField.type,
          placeholder:
            newCustomField.placeholder ||
            `Enter ${newCustomField.label.toLowerCase()}`,
          required: newCustomField.required,
        };
  
        if (
          ['select', 'radio', 'checkbox'].includes(newCustomField.type)
        ) {
          pendingField.options = newCustomField.options.filter(
            (o) => o && o.trim() !== ''
          );
        }
  
        finalCustomFields.push(pendingField);
      }
  
      // ✅ BASIC VALIDATION
      if (
        !basicInfo.categoryId ||
        !basicInfo.subCategoryId ||
        !basicInfo.name ||
        !basicInfo.description ||
        !basicInfo.individualPrice ||
        !basicInfo.offerPrice
      ) {
        throw new Error('Please fill all required fields');
      }
  
      // ✅ CREATE SERVICE
      const serviceRes = await fetch(`${API_BASE}/service`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: basicInfo.name,
          description: basicInfo.description,
          individualPrice: basicInfo.individualPrice,
          offerPrice: basicInfo.offerPrice,
          employeeId: basicInfo.employeeId,
          subCategoryId: basicInfo.subCategoryId,
        }),
      });
  
      const serviceData = await serviceRes.json();
      if (!serviceData.success) throw new Error('Service creation failed');
  
      const serviceId = serviceData.service.serviceId;
  
      // ✅ BUILD INPUT FIELDS PAYLOAD
      const fieldsPayload = [];
  
      // CUSTOM FIELDS
      finalCustomFields.forEach((field) => {
        const obj = {
        //   isCustom: true,
          label: field.label,
          type: field.type,
          placeholder: field.placeholder || '',
          required: field.required || false,
        };
  
        if (
          ['select', 'radio', 'checkbox'].includes(field.type) &&
          field.options?.length
        ) {
          obj.options = field.options;
        }
  
        fieldsPayload.push(obj);
      });
  
      selectedMasterFields.forEach((field) => {
        const masterField = masterFields.find(f => f.masterFieldId === field.masterFieldId);
        const fieldData = {
          masterFieldId: field.masterFieldId,
          required: field.required || false,
        };
        
        // Include options if the master field has them
        if (masterField?.options && masterField.options.length > 0) {
          fieldData.options = masterField.options;
        }
        
        fieldsPayload.push(fieldData);
      });
  
      console.log('FINAL FIELDS COUNT:', fieldsPayload.length);
      console.log(fieldsPayload);
  
      // ✅ SAVE INPUT FIELDS
      if (fieldsPayload.length) {
        const inputRes = await fetch(
          `${API_BASE}/service/${serviceId}/input-fields`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fields: fieldsPayload }),
          }
        );
  
        const inputData = await inputRes.json();
        if (!inputData.success)
          throw new Error('Input fields creation failed');
      }
  
      // ✅ TRACK STEPS
      if (trackSteps.length) {
        await fetch(`${API_BASE}/service/${serviceId}/track-steps`, {
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
      }
  
      alert('Service created successfully!');
      resetForm();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  const openEditModal = (type, id, name) => {
    setShowEditModal(type);
    setEditId(id);
    if (type === 'category') {
      setNewCategoryName(name);
      setShowCategoryDropdown(null);
    } else {
      setNewSubcategoryName(name);
      setShowSubcategoryDropdown(null);
    }
  };

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

  const handlePriceModeChange = (mode) => {
    setPriceMode(mode);
    if (mode === 'fixed') {
      setDiscountPercentage('');
    } else {
      setBasicInfo(prev => ({ ...prev, offerPrice: '' }));
    }
  };

  const calculateDiscountPercentage = () => {
    const individualPrice = parseFloat(basicInfo.individualPrice);
    const offerPrice = parseFloat(basicInfo.offerPrice);
    
    if (!isNaN(individualPrice) && !isNaN(offerPrice) && individualPrice > 0) {
      const discount = ((individualPrice - offerPrice) / individualPrice) * 100;
      return Math.round(discount);
    }
    return 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                Service Onboarding
              </h1>
              <p className="text-sm text-gray-500">
                Create a new service, define inputs, and configure process steps.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div
                className="px-6 py-4"
                style={{ backgroundColor: PRIMARY, color: 'white' }}
              >
                <h2 className="font-semibold">Basic Info</h2>
                <p className="text-xs sm:text-sm text-violet-100 mt-1">
                  Select category, subcategory and add core details for this service.
                </p>
              </div>
              <div className="p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Category Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-800">
                      Select Category
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <select
                          value={basicInfo.categoryId}
                          onChange={(e) =>
                            setBasicInfo((prev) => ({
                              ...prev,
                              categoryId: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none bg-white pr-10 text-sm focus:outline-none focus:border-[#6869AC] focus:ring-1 focus:ring-[#6869AC]"
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
                      <button
                        onClick={() => setShowCategoryModal(true)}
                        className="px-3 py-2 rounded-lg text-white hover:opacity-90"
                        style={{ backgroundColor: PRIMARY }}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {basicInfo.categoryId && (
                      <div className="mt-2 relative">
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs sm:text-sm border border-gray-200">
                          <span className="truncate">
                            {
                              categories.find(
                                (c) =>
                                  c.categoryId === basicInfo.categoryId
                              )?.categoryName
                            }
                          </span>
                          <div className="relative">
                            <button
                              onClick={() =>
                                setShowCategoryDropdown(
                                  showCategoryDropdown ===
                                    basicInfo.categoryId
                                    ? null
                                    : basicInfo.categoryId
                                )
                              }
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {showCategoryDropdown ===
                              basicInfo.categoryId && (
                              <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-20 text-sm">
                                <button
                                  onClick={() => {
                                    const cat = categories.find(
                                      (c) =>
                                        c.categoryId ===
                                        basicInfo.categoryId
                                    );
                                    if (cat)
                                      openEditModal(
                                        'category',
                                        cat.categoryId,
                                        cat.categoryName
                                      );
                                  }}
                                  className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2"
                                >
                                  <Edit2 className="w-3 h-3" />
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteCategory(
                                      basicInfo.categoryId
                                    )
                                  }
                                  className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Subcategory Selection */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-800">
                      Select Sub Category
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <select
                          value={basicInfo.subCategoryId}
                          onChange={(e) =>
                            setBasicInfo((prev) => ({
                              ...prev,
                              subCategoryId: e.target.value,
                            }))
                          }
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none bg-white pr-10 text-sm focus:outline-none focus:border-[#6869AC] focus:ring-1 focus:ring-[#6869AC]"
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
                      <button
                        onClick={() => setShowSubcategoryModal(true)}
                        disabled={!basicInfo.categoryId}
                        className="px-3 py-2 rounded-lg text-white hover:opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed"
                        style={{ backgroundColor: PRIMARY }}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {basicInfo.subCategoryId && (
                      <div className="mt-2 relative">
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs sm:text-sm border border-gray-200">
                          <span className="truncate">
                            {
                              filteredSubcategories.find(
                                (s) =>
                                  s.subCategoryId ===
                                  basicInfo.subCategoryId
                              )?.subCategoryName
                            }
                          </span>
                          <div className="relative">
                            <button
                              onClick={() =>
                                setShowSubcategoryDropdown(
                                  showSubcategoryDropdown ===
                                    basicInfo.subCategoryId
                                    ? null
                                    : basicInfo.subCategoryId
                                )
                              }
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {showSubcategoryDropdown ===
                              basicInfo.subCategoryId && (
                              <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-20 text-sm">
                                <button
                                  onClick={() => {
                                    const sub =
                                      filteredSubcategories.find(
                                        (s) =>
                                          s.subCategoryId ===
                                          basicInfo.subCategoryId
                                      );
                                    if (sub)
                                      openEditModal(
                                        'subcategory',
                                        sub.subCategoryId,
                                        sub.subCategoryName
                                      );
                                  }}
                                  className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center gap-2"
                                >
                                  <Edit2 className="w-3 h-3" />
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteSubcategory(
                                      basicInfo.subCategoryId
                                    )
                                  }
                                  className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#6869AC] focus:ring-1 focus:ring-[#6869AC]"
                    />
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg h-24 resize-none text-sm focus:outline-none focus:border-[#6869AC] focus:ring-1 focus:ring-[#6869AC]"
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-800">
                        Pricing
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePriceModeChange('fixed')}
                          className={`px-3 py-1.5 text-xs rounded-lg ${priceMode === 'fixed' ? 'bg-[#6869AC] text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                          Fixed Price
                        </button>
                        <button
                          onClick={() => handlePriceModeChange('percentage')}
                          className={`px-3 py-1.5 text-xs rounded-lg ${priceMode === 'percentage' ? 'bg-[#6869AC] text-white' : 'bg-gray-200 text-gray-700'}`}
                        >
                          Discount %
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-gray-800">
                          Individual Price
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                            ₹
                          </span>
                          <input
                            type="number"
                            value={basicInfo.individualPrice}
                            onChange={(e) =>
                              setBasicInfo((prev) => ({
                                ...prev,
                                individualPrice: e.target.value,
                              }))
                            }
                            placeholder="1099"
                            className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#6869AC] focus:ring-1 focus:ring-[#6869AC]"
                          />
                        </div>
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
                                onChange={(e) => setDiscountPercentage(e.target.value)}
                                placeholder="35"
                                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#6869AC] focus:ring-1 focus:ring-[#6869AC]"
                              />
                            </>
                          ) : (
                            <>
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                                ₹
                              </span>
                              <input
                                type="number"
                                value={basicInfo.offerPrice}
                                onChange={(e) =>
                                  setBasicInfo((prev) => ({
                                    ...prev,
                                    offerPrice: e.target.value,
                                  }))
                                }
                                placeholder="700"
                                className="w-full pl-7 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#6869AC] focus:ring-1 focus:ring-[#6869AC]"
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
                              Offer Price: ₹{basicInfo.offerPrice}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dataset Setup */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div
                className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                style={{ backgroundColor: PRIMARY, color: 'white' }}
              >
                <div>
                  <h2 className="font-semibold">Dataset Setup</h2>
                  <p className="text-xs sm:text-sm text-violet-100 mt-1">
                    Select from pre-defined fields or create custom input fields.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowMasterFieldsModal(true)}
                    className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs sm:text-sm bg-white text-[#6869AC] border border-[#6869AC] hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Select Pre-defined Fields
                  </button>
                </div>
              </div>
              
              {/* Selected Master Fields */}
              {selectedMasterFields.length > 0 && (
                <div className="p-4 sm:p-6 border-b border-gray-200">
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
                              onClick={() => toggleMasterField(field)}
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
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-800">Custom Fields</h3>
                  {/* <span className="text-xs text-gray-500">
                    {customFields.length} field{customFields.length !== 1 ? 's' : ''} added
                  </span> */}
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
                      className="px-4 py-2 text-sm text-white rounded hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      style={{ backgroundColor: PRIMARY }}
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
            </div>

            {/* Configure Checklist */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div
                className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                style={{ backgroundColor: PRIMARY, color: 'white' }}
              >
                <div>
                  <h2 className="font-semibold">Configure Checklist</h2>
                  <p className="text-xs sm:text-sm text-violet-100 mt-1">
                    Define all steps required to complete the service process.
                  </p>
                </div>
                <button
                  onClick={addTrackStep}
                  className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs sm:text-sm bg-white text-[#6869AC] border border-[#6869AC] hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Step
                </button>
              </div>
              <div className="p-4 sm:p-6 space-y-4">
                {trackSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    {editingStep === idx ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) =>
                            updateTrackStep(idx, 'title', e.target.value)
                          }
                          placeholder="Step title"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium focus:outline-none focus:border-[#6869AC] focus:ring-1 focus:ring-[#6869AC]"
                        />
                        <textarea
                          value={step.description}
                          onChange={(e) =>
                            updateTrackStep(
                              idx,
                              'description',
                              e.target.value
                            )
                          }
                          placeholder="Step description"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-[#6869AC] focus:ring-1 focus:ring-[#6869AC]"
                          rows={2}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingStep(null)}
                            className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-xs sm:text-sm text-white hover:opacity-90"
                            style={{ backgroundColor: PRIMARY }}
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Save
                          </button>
                          <button
                            onClick={() => setEditingStep(null)}
                            className="px-3 py-1.5 rounded-lg text-xs sm:text-sm bg-gray-200 text-gray-700 hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                        <div
                          className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full text-white font-semibold flex-shrink-0"
                          style={{ backgroundColor: PRIMARY }}
                        >
                          {step.order}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                            {step.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 mt-1">
                            {step.description}
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <div className="flex gap-2">
                            <button
                              onClick={() => moveTrackStep(idx, 'up')}
                              disabled={idx === 0}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Move up"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => moveTrackStep(idx, 'down')}
                              disabled={idx === trackSteps.length - 1}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Move down"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingStep(idx)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeTrackStep(idx)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-white text-sm sm:text-base hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed"
              style={{ backgroundColor: PRIMARY }}
            >
              {loading ? 'Creating Service...' : 'Save & Continue'}
            </button>
          </div>
        </div>
      </div>

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Add New Category
              </h3>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 text-sm focus:outline-none focus:border-[#6869AC] focus:ring-1 focus:ring-[#6869AC]"
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleAddCategory}
                className="flex-1 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90"
                style={{ backgroundColor: PRIMARY }}
              >
                Add Category
              </button>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subcategory Modal */}
      {showSubcategoryModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Add New Subcategory
              </h3>
              <button
                onClick={() => setShowSubcategoryModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium mb-1 text-gray-700">
                Selected Category
              </label>
              <div className="px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-800">
                {categories.find(
                  (c) => c.categoryId === basicInfo.categoryId
                )?.categoryName || 'No category selected'}
              </div>
            </div>
            <input
              type="text"
              value={newSubcategoryName}
              onChange={(e) => setNewSubcategoryName(e.target.value)}
              placeholder="Subcategory name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 text-sm focus:outline-none focus:border-[#6869AC] focus:ring-1 focus:ring-[#6869AC]"
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleAddSubcategory}
                disabled={!basicInfo.categoryId}
                className="flex-1 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed"
                style={{ backgroundColor: PRIMARY }}
              >
                Add Subcategory
              </button>
              <button
                onClick={() => setShowSubcategoryModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
                className="flex-1 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90"
                style={{ backgroundColor: PRIMARY }}
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

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Edit{' '}
                {showEditModal === 'category' ? 'Category' : 'Subcategory'}
              </h3>
              <button
                onClick={() => {
                  setShowEditModal(null);
                  setEditId(null);
                }}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {showEditModal === 'subcategory' && (
              <div className="mb-4">
                <label className="block text-xs font-medium mb-1 text-gray-700">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={basicInfo.categoryId}
                    onChange={(e) =>
                      setBasicInfo((prev) => ({
                        ...prev,
                        categoryId: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none bg-white pr-10 text-sm focus:outline-none focus:border-[#6869AC] focus:ring-1 focus:ring-[#6869AC]"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.categoryId} value={cat.categoryId}>
                        {cat.categoryName}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            )}

            <input
              type="text"
              value={
                showEditModal === 'category'
                  ? newCategoryName
                  : newSubcategoryName
              }
              onChange={(e) =>
                showEditModal === 'category'
                  ? setNewCategoryName(e.target.value)
                  : setNewSubcategoryName(e.target.value)
              }
              placeholder={
                showEditModal === 'category'
                  ? 'Category name'
                  : 'Subcategory name'
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 text-sm focus:outline-none focus:border-[#6869AC] focus:ring-1 focus:ring-[#6869AC]"
            />

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() =>
                  showEditModal === 'category'
                    ? handleEditCategory(editId)
                    : handleEditSubcategory(editId)
                }
                disabled={showEditModal === 'subcategory' && !basicInfo.categoryId}
                className="flex-1 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed"
                style={{ backgroundColor: PRIMARY }}
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setShowEditModal(null);
                  setEditId(null);
                }}
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
}