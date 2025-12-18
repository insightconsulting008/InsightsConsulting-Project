import React, { useState } from 'react';
import { useService } from '../ServiceContext';
import { Plus, Trash2, X, CheckSquare, Square } from 'lucide-react';

export default function DatasetSetup() {
  const {
    selectedMasterFields,
    setSelectedMasterFields,
    customFields,
    setCustomFields,
    newCustomField,
    setNewCustomField,
    masterFields,
    setError
  } = useService();

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
          <p className="text-sm text-gray-600">Select from pre-defined fields or create custom input fields.</p>
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
}