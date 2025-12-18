import React from 'react';
import { useService } from '../ServiceContext';

export default function ReviewPublish() {
  const {
    basicInfo,
    categories,
    filteredSubcategories,
    selectedMasterFields,
    customFields,
    trackSteps,
    priceMode,
    discountPercentage,
    masterFields,
    loading,
    error,
    setError,
    API_BASE,
    resetForm
  } = useService();

  const handleSubmit = async () => {
    setError('');
  
    try {
      // AUTO ADD LAST CUSTOM FIELD IF USER FORGOT TO CLICK "ADD"
      let finalCustomFields = [...customFields];
  
      // BASIC VALIDATION
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
  
      // CREATE SERVICE
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
  
      // BUILD INPUT FIELDS PAYLOAD
      const fieldsPayload = [];
  
      // CUSTOM FIELDS
      finalCustomFields.forEach((field) => {
        const obj = {
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
  
      // SAVE INPUT FIELDS
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
  
      // TRACK STEPS
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
    }
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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Review & Publish</h2>
        <p className="text-sm text-gray-600">Review all information before publishing your service.</p>
      </div>

      <div className="space-y-6">
        {/* Service Information Review */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Service Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Category</p>
              <p className="font-medium">{getCategoryName()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Subcategory</p>
              <p className="font-medium">{getSubcategoryName()}</p>
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
        <div className="border border-gray-200 rounded-lg p-4">
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
          </div>
        </div>

        {/* Dataset Review */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Dataset Setup</h3>
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

          {selectedMasterFields.length === 0 && customFields.length === 0 && (
            <p className="text-sm text-gray-500 italic">No fields configured</p>
          )}
        </div>

        {/* Checklist Review */}
        <div className="border border-gray-200 rounded-lg p-4">
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
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 rounded-lg font-semibold text-white text-sm sm:text-base hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed bg-[#6869AC]"
        >
          {loading ? 'Publishing Service...' : 'Publish Service'}
        </button>
      </div>
    </div>
  );
}