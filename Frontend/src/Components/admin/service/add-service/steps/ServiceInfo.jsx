import React, { useState } from 'react';
import { useService } from '../ServiceContext';
import { Plus, Edit2, Trash2, MoreVertical, ChevronDown, X } from 'lucide-react';

export default function ServiceInfo() {
  const {
    basicInfo,
    setBasicInfo,
    categories,
    subcategories,
    filteredSubcategories,
    fetchCategories,
    fetchSubcategories,
    API_BASE,
    setError
  } = useService();

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSubcategoryModal, setShowSubcategoryModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(null);
  const [showSubcategoryDropdown, setShowSubcategoryDropdown] = useState(null);
  const [editId, setEditId] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Service Information</h2>
        <p className="text-sm text-gray-600">Fill in the basic details about your service.</p>
      </div>

      <div className="space-y-4">
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
                className="px-3 py-2 rounded-lg text-white hover:opacity-90 bg-[#6869AC]"
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
                className="px-3 py-2 rounded-lg text-white hover:opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed bg-[#6869AC]"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg h-32 resize-none text-sm focus:outline-none focus:border-[#6869AC] focus:ring-1 focus:ring-[#6869AC]"
          />
        </div>
      </div>

      {/* Modals */}
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
            <div className="flex gap-2">
              <button
                onClick={handleAddCategory}
                className="flex-1 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 bg-[#6869AC]"
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
            <div className="flex gap-2">
              <button
                onClick={handleAddSubcategory}
                disabled={!basicInfo.categoryId}
                className="flex-1 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed bg-[#6869AC]"
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

            <div className="flex gap-2">
              <button
                onClick={() =>
                  showEditModal === 'category'
                    ? handleEditCategory(editId)
                    : handleEditSubcategory(editId)
                }
                disabled={showEditModal === 'subcategory' && !basicInfo.categoryId}
                className="flex-1 py-2 rounded-lg text-white text-sm font-medium hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed bg-[#6869AC]"
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