// AddCategoryCombined.jsx
import React, { useEffect, useState } from 'react';
import { Plus, X, Briefcase, CheckSquare } from 'lucide-react';

export default function AddCategoryCombined({
  open,
  onOpenChange,
  editData = null,      // pass an object to open in edit mode and prefill
  onCreate = () => {},  // called with formData on create
  onUpdate = () => {}   // called with formData on update
}) {
  const isControlled = typeof open === 'boolean' && typeof onOpenChange === 'function';
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = isControlled ? open : internalOpen;
  const setIsOpen = (v) => {
    if (isControlled) return onOpenChange(v);
    return setInternalOpen(v);
  };

  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const emptyForm = {
    categoryName: '',
    licenseRegistration: '',
    categoryId: '',
    categoryDescription: '',
    subCategory: '',
    subCategoryId: ''
  };

  const [formData, setFormData] = useState(emptyForm);

  // determine mode from editData
  const isEditMode = Boolean(editData && Object.keys(editData).length);

  // If editData prop changes, prefill the form and open the panel
  useEffect(() => {
    if (isEditMode) {
      setFormData({
        categoryName: editData.categoryName || '',
        licenseRegistration: editData.licenseRegistration || '',
        categoryId: editData.categoryId || '',
        categoryDescription: editData.categoryDescription || '',
        subCategory: editData.subCategory || '',
        subCategoryId: editData.subCategoryId || ''
      });
      setIsOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editData]);

  // reset form when closed (only when panel becomes closed)
  useEffect(() => {
    if (!isOpen) {
      setFormData(emptyForm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleChange = (e) =>
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));

  const validateRequired = () => {
    return (
      formData.categoryName.trim() &&
      formData.categoryId.trim() &&
      formData.categoryDescription.trim() &&
      formData.subCategory.trim()
    );
  };

  const handleSubmit = () => {
    if (!validateRequired()) {
      alert('Please fill all required fields (marked with *).');
      return;
    }

    // call appropriate callback
    if (isEditMode) {
      onUpdate({ ...formData });
      setSubmittedData({ ...formData });
    } else {
      onCreate({ ...formData });
      setSubmittedData({ ...formData });
    }

    setIsOpen(false);
    setIsSuccessOpen(true);
  };

  const closeSuccess = () => {
    setIsSuccessOpen(false);
    setSubmittedData(null);
  };

  return (
    <>
      {/* Card (still usable standalone) */}
      <div className="bg-white rounded-lg border border-gray-200 p-3 max-w-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs font-semibold text-gray-800">Service Category</h3>
          <button
            className="text-gray-600 hover:text-gray-800"
            aria-label="new category"
            onClick={() => setIsOpen(true)}
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg text-xs text-center">
          <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-sm">
            <div className="w-10 h-10 rounded-full border-4 border-blue-500 border-t-red-500 border-r-yellow-500 border-b-green-500" />
          </div>

          <h4 className="text-gray-800 text-xs font-semibold ">Build your Service Category</h4>
          <p className="text-gray-500 text-sm mb-6">
            There are no service category listed. Create one to start onboarding service.
          </p>

          <button
            onClick={() => setIsOpen(true)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Add Category
          </button>
        </div>
      </div>

      {/* Overlay for form */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-in Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        onClick={(e) => e.stopPropagation()}
        aria-hidden={!isOpen}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="bg-indigo-600 text-white p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              {isEditMode ? <Briefcase className="text-indigo-600" size={24} /> : <Plus className="text-indigo-600" size={24} />}
            </div>
            <h2 className="text-lg font-semibold">{isEditMode ? 'Edit Category' : 'Add Category'}</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="ml-auto text-white hover:bg-indigo-700 p-1 rounded"
              aria-label="close form"
            >
              <X size={24} />
            </button>
          </div>

          {/* Form */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  name="categoryName"
                  value={formData.categoryName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., GST License"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License & Registration
                </label>
                <input
                  type="text"
                  name="licenseRegistration"
                  value={formData.licenseRegistration}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category ID *
                </label>
                <input
                  type="text"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., CT02"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category Description *
                </label>
                <textarea
                  name="categoryDescription"
                  value={formData.categoryDescription}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Describe the category..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sub Category *
                </label>
                <input
                  type="text"
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., SC 1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sub Category ID (As Per Document)
                </label>
                <input
                  type="text"
                  name="subCategoryId"
                  value={formData.subCategoryId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g., D-GST100"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
              >
                {isEditMode ? 'Update Category' : 'Add Category'}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 px-4 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {isSuccessOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={closeSuccess} />

          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all">
            {/* Header banner */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 -mx-6 -mt-6 p-4 rounded-t-lg mb-6">
              <div className="flex items-center gap-3 text-white">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <Briefcase className="text-indigo-600" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold">
                    {submittedData?.licenseRegistration || 'License & Registration'}
                  </h3>
                  <p className="text-sm opacity-90">
                    {submittedData?.subCategory || 'SC 1'} | {submittedData?.categoryId || 'CT02'}
                  </p>
                </div>
                <div className="ml-auto bg-white text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full">
                  Category ID | {submittedData?.categoryId || 'CT02'}
                </div>
              </div>
            </div>

            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
                <CheckSquare className="text-white" size={40} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                '{submittedData?.categoryName || 'GST License'}'
              </h3>
              <p className="text-gray-600">
                Category has been {isEditMode ? 'updated' : 'created'} successfully
              </p>
            </div>

            <p className="text-sm text-gray-500 text-center mb-4">
              You can view this category details under category database
            </p>

            <button
              onClick={closeSuccess}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
