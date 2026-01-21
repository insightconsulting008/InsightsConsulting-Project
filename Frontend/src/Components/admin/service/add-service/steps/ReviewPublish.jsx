import React from 'react';
import { useService } from '../ServiceContext';
import { Edit2, CheckCircle } from 'lucide-react';
import {useNavigate } from 'react-router-dom';

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
    newCustomField,
    loading,
    setLoading,
    error,
    setError,
    API_BASE,
    resetForm,
    goToPreviousStep,
    goToStep,
    submissionStatus,
    setSubmissionStatus,
    showSuccessPopup,
    setShowSuccessPopup,
  } = useService();

  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');
    setSubmissionStatus('loading');
    setLoading(true);
  
    try {
      console.log('Starting service creation...');
      
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
if (!basicInfo.photoFile) validationErrors.push('Service image is required');

if (basicInfo.serviceType === 'RECURRING') {
  if (!basicInfo.frequency) validationErrors.push('Frequency is required');
  if (!basicInfo.duration) validationErrors.push('Duration value is required'); // FIXED: changed from 'duration' to 'durationValue'
  if (!basicInfo.durationUnit) validationErrors.push('Duration unit is required');
}

if (validationErrors.length > 0) {
  throw new Error('Please fix the following errors: ' + validationErrors.join(', '));
}
      // STEP 1: Create FormData and append service data and image file
      console.log('Creating FormData for service creation...');
      
      const formData = new FormData();
      
      // Append all service data as strings
      formData.append('name', basicInfo.name.trim());
      formData.append('description', basicInfo.description.trim());
      formData.append('serviceType', basicInfo.serviceType);
      formData.append('documentsRequired', basicInfo.documentsRequired.toString());
      formData.append('individualPrice', parseFloat(basicInfo.individualPrice).toString());
      formData.append('offerPrice', parseFloat(basicInfo.offerPrice).toString());
      formData.append('isGstApplicable', basicInfo.isGstApplicable.toString());
      formData.append('gstPercentage', basicInfo.isGstApplicable ? parseFloat(basicInfo.gstPercentage).toString() : '0');
      formData.append('finalIndividualPrice', parseFloat(basicInfo.finalIndividualPrice || basicInfo.offerPrice).toString());
      formData.append('employeeId', basicInfo.employeeId);
      formData.append('subCategoryId', basicInfo.subCategoryId);
      
      // Add recurring fields if applicable
      if (basicInfo.serviceType === 'RECURRING') {
        formData.append('frequency', basicInfo.frequency);
        formData.append('duration', parseInt(basicInfo.duration).toString());
        formData.append('durationUnit', basicInfo.durationUnit);
      }
  
      // Append image file with the correct field name 'photoUrl'
      if (basicInfo.photoFile) {
        formData.append('photoUrl', basicInfo.photoFile, basicInfo.photoFile.name);
        console.log('Appending image file as photoUrl:', basicInfo.photoFile.name, basicInfo.photoFile);
      } else {
        console.warn('No image file found');
        throw new Error('Service image is required');
      }
  
      // Log FormData contents for debugging
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
  
      console.log('Creating service with FormData...');
  
      // Send FormData directly
      const serviceRes = await fetch(`${API_BASE}/service`, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header for FormData, let browser set it with boundary
      });
  
      console.log('Response status:', serviceRes.status);
      console.log('Response headers:', serviceRes.headers);
      
      // Try to get the response text first to see what we're getting
      const responseText = await serviceRes.text();
      console.log('Response text (first 500 chars):', responseText.substring(0, 500));
      
      let serviceResponse;
      try {
        serviceResponse = JSON.parse(responseText);
        console.log('Service creation response:', serviceResponse);
      } catch (jsonErr) {
        console.error('Failed to parse service response as JSON:', jsonErr);
        console.error('Full response:', responseText);
        throw new Error(`Server error (${serviceRes.status}): ${responseText.substring(0, 200)}...`);
      }
      
      if (!serviceResponse.success) {
        const errorMsg = serviceResponse.error || serviceResponse.message || 'Service creation failed';
        console.error('Service creation failed:', errorMsg);
        throw new Error(errorMsg);
      }
  
      const serviceId = serviceResponse.service?.serviceId || serviceResponse.data?.serviceId;
      
      if (!serviceId) {
        console.error('No service ID returned:', serviceResponse);
        throw new Error('Service ID not returned from server. Response: ' + JSON.stringify(serviceResponse));
      }
  
      console.log('Service created with ID:', serviceId);
  
      // STEP 2: Save input fields (optional)
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
  
        console.log('Saving input fields:', fieldsPayload);
        
        try {
          const inputRes = await fetch(
            `${API_BASE}/service/${serviceId}/input-fields`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ fields: fieldsPayload }),
            }
          );
  
          const inputData = await inputRes.json();
          console.log('Input fields response:', inputData);
          
          if (!inputData.success) {
            console.warn('Input fields creation had issues:', inputData);
          }
        } catch (inputErr) {
          console.warn('Failed to save input fields:', inputErr);
          // Continue anyway - input fields are optional
        }
      }
  
      // STEP 3: Save track steps (optional)
      if (trackSteps.length > 0) {
        console.log('Saving track steps:', trackSteps);
        
        try {
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
          console.log('Track steps response:', trackStepsData);
          
          if (!trackStepsData.success) {
            console.warn('Track steps creation had issues:', trackStepsData);
          }
        } catch (trackErr) {
          console.warn('Failed to save track steps:', trackErr);
          // Continue anyway - track steps are optional
        }
      }
  
      setSubmissionStatus('success');
      setShowSuccessPopup(true);
      console.log('Service published successfully!');
      
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message || 'Failed to create service. Please try again.');
      setSubmissionStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnother = () => {
    resetForm();
    setShowSuccessPopup(false);
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
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Review & Publish</h2>
          <p className="text-sm text-gray-600">Review all information before publishing your service.</p>
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
          {basicInfo.photoFile && basicInfo.photoUrl && (
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">Service Image</p>
              <img 
                src={basicInfo.photoUrl} 
                alt="Service" 
                className="w-full max-w-xs h-48 object-cover rounded-lg border border-gray-200"
              />
              <p className="text-xs text-gray-500 mt-1">
                {basicInfo.photoFile ? '✓ Image ready for upload' : '⚠ Please upload an image'}
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
            <br />
            <span className="text-xs">Check console for more details</span>
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
                Publishing...
              </span>
            ) : 'Publish Service'}
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
                Service Published Successfully!
              </h3>
              <p className="text-gray-600 mb-6">
                Your service has been created and is now live. You can create another service or view your service list.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleCreateAnother}
                  className="flex-1 py-3 rounded-lg font-semibold text-[#6869AC] text-sm sm:text-base hover:bg-[#6869AC] hover:text-white border border-[#6869AC] transition-colors"
                >
                  Create Another Service
                </button>
                <button
                  onClick={() => {
                    resetForm();
                    setShowSuccessPopup(false);
                    navigate('/service-hub')
                    // You can navigate to service list page here if needed
                  }}
                  className="flex-1 py-3 rounded-lg font-semibold text-white text-sm sm:text-base bg-[#6869AC] hover:opacity-90"
                >
                  View Service List
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}