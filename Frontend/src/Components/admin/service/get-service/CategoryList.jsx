// CategoryList.jsx
import React, { useState } from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  Edit2,
  Trash2,
  Plus,
  ChevronDown,
  ChevronRight,
  Loader2,
  X,
} from 'lucide-react';
import axiosInstance from '@src/providers/axiosInstance';

export default function CategoryList({ categories = [], subcategories = [], services = [], loading, onRefresh }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  // Modal states
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [showAddSubcategoryModal, setShowAddSubcategoryModal] = useState(false);
  const [showEditSubcategoryModal, setShowEditSubcategoryModal] = useState(false);
  const [showDeleteSubcategoryModal, setShowDeleteSubcategoryModal] = useState(false);

  // Form states
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editCategoryName, setEditCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [editSubcategoryName, setEditSubcategoryName] = useState('');

  // Selected items
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedCategoryForSubcategory, setSelectedCategoryForSubcategory] = useState(null);

  // CREATE Category
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      alert('Please enter category name');
      return;
    }

    try {
      setActionLoading(true);
      const response = await axiosInstance.post('/category', {
        categoryName: newCategoryName,
      });

      if (response.data.success) {
        // Call parent refresh to update data
        onRefresh();
        setShowAddCategoryModal(false);
        setNewCategoryName('');
        alert('Category created successfully!');
      }
    } catch (err) {
      console.error('Error creating category:', err);
      alert(err.response?.data?.message || 'Error creating category');
    } finally {
      setActionLoading(false);
    }
  };

  // EDIT Category
  const handleEditCategory = async () => {
    if (!editCategoryName.trim()) {
      alert('Please enter category name');
      return;
    }

    try {
      setActionLoading(true);
      await axiosInstance.put(
        `/category/${selectedCategory.categoryId}`,
        {
          categoryName: editCategoryName,
        }
      );

      // Call parent refresh to update data
      onRefresh();
      
      setShowEditCategoryModal(false);
      setEditCategoryName('');
      setSelectedCategory(null);
      alert('Category updated successfully!');
    } catch (err) {
      console.error('Error updating category:', err);
      alert(err.response?.data?.message || 'Error updating category');
    } finally {
      setActionLoading(false);
    }
  };

  // DELETE Category
  const handleDeleteCategory = async () => {
    try {
      setActionLoading(true);
      await axiosInstance.delete(
        `/category/${selectedCategory.categoryId}`
      );

      // Call parent refresh to update data
      onRefresh();
      
      setShowDeleteCategoryModal(false);
      setSelectedCategory(null);
      alert('Category deleted successfully!');
    } catch (err) {
      console.error('Error deleting category:', err);
      alert(err.response?.data?.message || 'Error deleting category');
    } finally {
      setActionLoading(false);
    }
  };

  // CREATE Subcategory
  const handleCreateSubcategory = async () => {
    if (!newSubcategoryName.trim()) {
      alert('Please enter subcategory name');
      return;
    }

    try {
      setActionLoading(true);
      const response = await axiosInstance.post('/subcategory', {
        categoryId: selectedCategoryForSubcategory.categoryId,
        subCategoryName: newSubcategoryName,
      });

      if (response.data.success) {
        // Call parent refresh to update data
        onRefresh();
        setShowAddSubcategoryModal(false);
        setNewSubcategoryName('');
        setSelectedCategoryForSubcategory(null);
        alert('Subcategory created successfully!');
      }
    } catch (err) {
      console.error('Error creating subcategory:', err);
      alert(err.response?.data?.message || 'Error creating subcategory');
    } finally {
      setActionLoading(false);
    }
  };

  // EDIT Subcategory
  const handleEditSubcategory = async () => {
    if (!editSubcategoryName.trim()) {
      alert('Please enter subcategory name');
      return;
    }

    try {
      setActionLoading(true);
      await axiosInstance.put(
        `/subcategory/${selectedSubcategory.subCategoryId}`,
        {
          subCategoryName: editSubcategoryName,
        }
      );

      // Call parent refresh to update data
      onRefresh();
      
      setShowEditSubcategoryModal(false);
      setEditSubcategoryName('');
      setSelectedSubcategory(null);
      alert('Subcategory updated successfully!');
    } catch (err) {
      console.error('Error updating subcategory:', err);
      alert(err.response?.data?.message || 'Error updating subcategory');
    } finally {
      setActionLoading(false);
    }
  };

  // DELETE Subcategory
  const handleDeleteSubcategory = async () => {
    try {
      setActionLoading(true);
      await axiosInstance.delete(
        `/subcategory/${selectedSubcategory.subCategoryId}`
      );

      // Call parent refresh to update data
      onRefresh();
      
      setShowDeleteSubcategoryModal(false);
      setSelectedSubcategory(null);
      alert('Subcategory deleted successfully!');
    } catch (err) {
      console.error('Error deleting subcategory:', err);
      alert(err.response?.data?.message || 'Error deleting subcategory');
    } finally {
      setActionLoading(false);
    }
  };

  // Helper functions
  const filteredCategories = (categories || []).filter((cat) =>
    cat?.categoryName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat?.categoryId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredSubcategories = (subcategories || []).filter((sub) =>
    sub?.subCategoryName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub?.subCategoryId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sub?.categoryId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSubcategoriesForCategory = (categoryId) => {
    return filteredSubcategories.filter((sub) => sub.categoryId === categoryId);
  };

  const getSubcategoryCount = (categoryId) => {
    return subcategories.filter((sub) => sub.categoryId === categoryId).length;
  };

  const getServiceCountForCategory = (categoryId) => {
    const catSubcategories = subcategories.filter(sub => sub.categoryId === categoryId);
    const subcategoryIds = catSubcategories.map(sub => sub.subCategoryId);
    return services.filter(service => subcategoryIds.includes(service.subCategoryId)).length;
  };

  const getServiceCountForSubcategory = (subcategoryId) => {
    return services.filter(service => service.subCategoryId === subcategoryId).length;
  };

  const toggleCategoryExpansion = (categoryId) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleCategorySelection = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedCategories.length === filteredCategories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(filteredCategories.map((cat) => cat.categoryId));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Open modal functions
  const openEditCategoryModal = (category) => {
    setSelectedCategory(category);
    setEditCategoryName(category.categoryName);
    setShowEditCategoryModal(true);
  };

  const openDeleteCategoryModal = (category) => {
    setSelectedCategory(category);
    setShowDeleteCategoryModal(true);
  };

  const openEditSubcategoryModal = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setEditSubcategoryName(subcategory.subCategoryName);
    setShowEditSubcategoryModal(true);
  };

  const openDeleteSubcategoryModal = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setShowDeleteSubcategoryModal(true);
  };

  const openAddSubcategoryModal = (category) => {
    setSelectedCategoryForSubcategory(category);
    setShowAddSubcategoryModal(true);
  };

  // Close modal functions
  const closeAllModals = () => {
    setShowAddCategoryModal(false);
    setShowEditCategoryModal(false);
    setShowDeleteCategoryModal(false);
    setShowAddSubcategoryModal(false);
    setShowEditSubcategoryModal(false);
    setShowDeleteSubcategoryModal(false);
    setNewCategoryName('');
    setEditCategoryName('');
    setNewSubcategoryName('');
    setEditSubcategoryName('');
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setSelectedCategoryForSubcategory(null);
  };

  // Loading and error states remain the same...
  if (loading) {
    return (
      <div className="bg-bright rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-3 text-primary" />
            <p className="text-light text-sm">Loading categories...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-bright rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-4xl mb-3">⚠️</div>
          <h3 className="text-lg font-semibold text-dark mb-2">Error loading data</h3>
          <p className="text-light text-sm mb-4">{error}</p>
          <button
            onClick={onRefresh}
            className="px-4 py-2 rounded-lg text-bright text-sm bg-primary hover:opacity-90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-bright rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-dark">Category List</h2>
              <p className="text-sm text-light mt-1">
                Manage categories and subcategories for your services
              </p>
            </div>
            <button
              onClick={() => setShowAddCategoryModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-bright text-sm font-medium bg-primary hover:opacity-90 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              Add Category
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light" />
              <input
                type="text"
                placeholder="Search categories, subcategories, or IDs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-dark hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg text-sm text-dark hover:bg-gray-50">
              <ArrowUpDown className="w-4 h-4" />
              Sort
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredCategories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-20 h-20 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-10 h-10 text-primary text-opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-dark mb-2">No Data found</h3>
              <p className="text-light text-sm text-center">
                {searchQuery
                  ? 'No categories match your search criteria'
                  : 'It looks like there are no Category added yet'}
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                      checked={
                        filteredCategories.length > 0 &&
                        selectedCategories.length === filteredCategories.length
                      }
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-light">
                    Category Name
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-light">
                    Category ID
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-light">
                    Sub Categories
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-light">
                    Services Under This Category
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-light">
                    Last Update
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-light">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => {
                  const categorySubcategories = getSubcategoriesForCategory(category.categoryId);
                  const subcategoryCount = getSubcategoryCount(category.categoryId);
                  const serviceCount = getServiceCountForCategory(category.categoryId);
                  const isExpanded = expandedCategories.includes(category.categoryId);
                  const isSelected = selectedCategories.includes(category.categoryId);

                  return (
                    <React.Fragment key={category.categoryId}>
                      <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-primary focus:ring-primary"
                            checked={isSelected}
                            onChange={() => toggleCategorySelection(category.categoryId)}
                          />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleCategoryExpansion(category.categoryId)}
                              className="p-1 hover:bg-gray-200 rounded transition-colors"
                              disabled={subcategoryCount === 0}
                            >
                              {subcategoryCount > 0 ? (
                                isExpanded ? (
                                  <ChevronDown className="w-4 h-4 text-light" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-light" />
                                )
                              ) : (
                                <div className="w-4 h-4" />
                              )}
                            </button>
                            <span className="text-sm font-medium text-dark">
                              {category.categoryName}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <code className="text-xs text-light bg-gray-100 px-2 py-1 rounded">
                            {category.categoryId}
                          </code>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 bg-primary bg-opacity-20 text-textbright text-xs font-medium rounded-full">
                            {subcategoryCount}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-light">{serviceCount}</span>
                        </td>
                        <td className="py-3 px-4 text-sm text-light">
                          {formatDate(category.updatedAt || category.createdAt)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => openEditCategoryModal(category)}
                              className="p-1.5 hover:bg-gray-100 rounded transition-colors group"
                            >
                              <Edit2 className="w-4 h-4 text-light group-hover:text-primary" />
                            </button>
                            <button 
                              onClick={() => openDeleteCategoryModal(category)}
                              className="p-1.5 hover:bg-red-50 rounded transition-colors group"
                            >
                              <Trash2 className="w-4 h-4 text-light group-hover:text-red-600" />
                            </button>
                            <button
                              onClick={() => openAddSubcategoryModal(category)}
                              className="px-2.5 py-1 text-xs font-medium rounded hover:opacity-90 transition-opacity bg-primary bg-opacity-10 text-textbright"
                            >
                              + Sub
                            </button>
                          </div>
                        </td>
                      </tr>

                      {isExpanded &&
                        categorySubcategories.map((subcategory) => {
                          const subServiceCount = getServiceCountForSubcategory(subcategory.subCategoryId);
                          return (
                            <tr
                              key={subcategory.subCategoryId}
                              className="bg-primary bg-opacity-5 hover:bg-primary hover:bg-opacity-10 transition-colors"
                            >
                              <td className="py-2.5 px-4"></td>
                              <td className="py-2.5 px-4 pl-12">
                                <div className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                  <span className="text-sm text-dark">
                                    {subcategory.subCategoryName}
                                  </span>
                                </div>
                              </td>
                              <td className="py-2.5 px-4">
                                <code className="text-xs text-light">{subcategory.subCategoryId}</code>
                              </td>
                              <td className="py-2.5 px-4">
                                <span className="text-xs text-light italic">Subcategory</span>
                              </td>
                              <td className="py-2.5 px-4">
                                <span className="text-sm text-light">{subServiceCount}</span>
                              </td>
                              <td className="py-2.5 px-4 text-sm text-light">
                                {formatDate(subcategory.updatedAt || subcategory.createdAt)}
                              </td>
                              <td className="py-2.5 px-4">
                                <div className="flex items-center gap-2">
                                  <button 
                                    onClick={() => openEditSubcategoryModal(subcategory)}
                                    className="p-1.5 hover:bg-gray-100 rounded transition-colors group"
                                  >
                                    <Edit2 className="w-3.5 h-3.5 text-light group-hover:text-primary" />
                                  </button>
                                  <button 
                                    onClick={() => openDeleteSubcategoryModal(subcategory)}
                                    className="p-1.5 hover:bg-red-50 rounded transition-colors group"
                                  >
                                    <Trash2 className="w-3.5 h-3.5 text-light group-hover:text-red-600" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {filteredCategories.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between text-sm">
              <div className="text-light">
                Showing <span className="font-medium text-dark">{filteredCategories.length}</span> of{' '}
                <span className="font-medium text-dark">{categories.length}</span> categories
              </div>
              {selectedCategories.length > 0 && (
                <div className="text-light">
                  <span className="font-medium text-dark">{selectedCategories.length}</span> selected
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Category Modal */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-bright rounded-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-dark">Add New Category</h3>
                <button onClick={closeAllModals} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-5 h-5 text-light" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-dark mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter category name"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={closeAllModals}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-dark hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCategory}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2 rounded-lg text-bright bg-primary hover:opacity-90 transition-opacity"
                >
                  {actionLoading ? 'Creating...' : 'Create Category'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {showEditCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-bright rounded-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-dark">Edit Category</h3>
                <button onClick={closeAllModals} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-5 h-5 text-light" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-dark mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={editCategoryName}
                  onChange={(e) => setEditCategoryName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter category name"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={closeAllModals}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-dark hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditCategory}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2 rounded-lg text-bright bg-primary hover:opacity-90 transition-opacity"
                >
                  {actionLoading ? 'Updating...' : 'Update Category'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Category Modal */}
      {showDeleteCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-bright rounded-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-dark">Delete Category</h3>
                <button onClick={closeAllModals} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-5 h-5 text-light" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-light mb-6">
                Are you sure you want to delete "<strong className="text-dark">{selectedCategory?.categoryName}</strong>"?
                This will also delete all subcategories under this category.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={closeAllModals}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-dark hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteCategory}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2 rounded-lg text-bright bg-red-600 hover:bg-red-700"
                >
                  {actionLoading ? 'Deleting...' : 'Delete Category'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Subcategory Modal */}
      {showAddSubcategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-bright rounded-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-dark">Add Subcategory</h3>
                <button onClick={closeAllModals} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-5 h-5 text-light" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-dark mb-2">
                  Category
                </label>
                <div className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                  <span className="text-dark">{selectedCategoryForSubcategory?.categoryName}</span>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-dark mb-2">
                  Subcategory Name
                </label>
                <input
                  type="text"
                  value={newSubcategoryName}
                  onChange={(e) => setNewSubcategoryName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter subcategory name"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={closeAllModals}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-dark hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateSubcategory}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2 rounded-lg text-bright bg-primary hover:opacity-90 transition-opacity"
                >
                  {actionLoading ? 'Creating...' : 'Create Subcategory'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Subcategory Modal */}
      {showEditSubcategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-bright rounded-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-dark">Edit Subcategory</h3>
                <button onClick={closeAllModals} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-5 h-5 text-light" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-dark mb-2">
                  Subcategory Name
                </label>
                <input
                  type="text"
                  value={editSubcategoryName}
                  onChange={(e) => setEditSubcategoryName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-dark focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter subcategory name"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={closeAllModals}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-dark hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSubcategory}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2 rounded-lg text-bright bg-primary hover:opacity-90 transition-opacity"
                >
                  {actionLoading ? 'Updating...' : 'Update Subcategory'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Subcategory Modal */}
      {showDeleteSubcategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-bright rounded-xl w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-dark">Delete Subcategory</h3>
                <button onClick={closeAllModals} className="p-1 hover:bg-gray-100 rounded">
                  <X className="w-5 h-5 text-light" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-light mb-6">
                Are you sure you want to delete "<strong className="text-dark">{selectedSubcategory?.subCategoryName}</strong>"?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={closeAllModals}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-dark hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteSubcategory}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2 rounded-lg text-bright bg-red-600 hover:bg-red-700"
                >
                  {actionLoading ? 'Deleting...' : 'Delete Subcategory'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}