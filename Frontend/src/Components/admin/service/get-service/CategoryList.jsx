import React, { useState } from 'react';
import { Search, Edit2, Trash2, Plus, ChevronDown, ChevronRight, X, Folder, FolderOpen } from 'lucide-react';
import axiosInstance from '@src/providers/axiosInstance';

// Toast function (same as ServiceList)
const showToast = (message, type = 'success') => {
  const toast = document.createElement('div');
  toast.className = `fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 ${
    type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
  }`;
  
  const icon = type === 'success' ? 
    '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>' :
    '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
  
  toast.innerHTML = `${icon} ${message}`;
  document.body.appendChild(toast);
  
  setTimeout(() => toast.remove(), 3000);
};

// Delete Modal (same as ServiceList)
const DeleteModal = ({ isOpen, onClose, onConfirm, itemName, type = 'category' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
            Delete {type === 'category' ? 'Category' : 'Subcategory'}?
          </h3>
          <p className="text-gray-600 text-center mb-6">
            Are you sure you want to delete "<span className="font-semibold">{itemName}</span>"? 
            This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Form Modal for Add/Edit
const FormModal = ({ isOpen, onClose, onSubmit, title, value, onChange, placeholder, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              {title.includes('Category') ? 'Category Name' : 'Subcategory Name'}
            </label>
            <input
              type="text"
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              autoFocus
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={loading || !value.trim()}
              className="flex-1 px-4 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CategoryList({ categories = [], subcategories = [], services = [], loading, onRefresh }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState([]);
  
  // Modal states
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [showEditCategoryModal, setShowEditCategoryModal] = useState(false);
  const [showAddSubcategoryModal, setShowAddSubcategoryModal] = useState(false);
  const [showEditSubcategoryModal, setShowEditSubcategoryModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Form states
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editCategoryName, setEditCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [editSubcategoryName, setEditSubcategoryName] = useState('');
  
  // Selected items
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedCategoryForSubcategory, setSelectedCategoryForSubcategory] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category?.categoryName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category?.categoryId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSubcategoriesForCategory = (categoryId) => {
    return subcategories.filter(sub => sub.categoryId === categoryId);
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
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // API handlers
  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return;

    try {
      setActionLoading(true);
      await axiosInstance.post('/category', { categoryName: newCategoryName });
      showToast('Category created successfully');
      onRefresh();
      setShowAddCategoryModal(false);
      setNewCategoryName('');
    } catch (err) {
      console.error('Error creating category:', err);
      showToast(err.response?.data?.message || 'Error creating category', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditCategory = async () => {
    if (!editCategoryName.trim() || !selectedCategory) return;

    try {
      setActionLoading(true);
      await axiosInstance.put(`/category/${selectedCategory.categoryId}`, {
        categoryName: editCategoryName
      });
      showToast('Category updated successfully');
      onRefresh();
      setShowEditCategoryModal(false);
      setSelectedCategory(null);
      setEditCategoryName('');
    } catch (err) {
      console.error('Error updating category:', err);
      showToast(err.response?.data?.message || 'Error updating category', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateSubcategory = async () => {
    if (!newSubcategoryName.trim() || !selectedCategoryForSubcategory) return;

    try {
      setActionLoading(true);
      await axiosInstance.post('/subcategory', {
        categoryId: selectedCategoryForSubcategory.categoryId,
        subCategoryName: newSubcategoryName
      });
      showToast('Subcategory created successfully');
      onRefresh();
      setShowAddSubcategoryModal(false);
      setNewSubcategoryName('');
      setSelectedCategoryForSubcategory(null);
    } catch (err) {
      console.error('Error creating subcategory:', err);
      showToast(err.response?.data?.message || 'Error creating subcategory', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditSubcategory = async () => {
    if (!editSubcategoryName.trim() || !selectedSubcategory) return;

    try {
      setActionLoading(true);
      await axiosInstance.put(`/subcategory/${selectedSubcategory.subCategoryId}`, {
        subCategoryName: editSubcategoryName
      });
      showToast('Subcategory updated successfully');
      onRefresh();
      setShowEditSubcategoryModal(false);
      setEditSubcategoryName('');
      setSelectedSubcategory(null);
    } catch (err) {
      console.error('Error updating subcategory:', err);
      showToast(err.response?.data?.message || 'Error updating subcategory', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteItem) return;

    try {
      setActionLoading(true);
      const endpoint = deleteItem.type === 'category' 
        ? `/category/${deleteItem.id}`
        : `/subcategory/${deleteItem.id}`;
      
      await axiosInstance.delete(endpoint);
      showToast(`${deleteItem.type === 'category' ? 'Category' : 'Subcategory'} deleted successfully`);
      onRefresh();
    } catch (err) {
      console.error('Error deleting:', err);
      showToast(err.response?.data?.message || 'Error deleting', 'error');
    } finally {
      setActionLoading(false);
      setShowDeleteModal(false);
      setDeleteItem(null);
    }
  };

  const handleDeleteClick = (item, type = 'category') => {
    setDeleteItem({
      id: type === 'category' ? item.categoryId : item.subCategoryId,
      name: type === 'category' ? item.categoryName : item.subCategoryName,
      type
    });
    setShowDeleteModal(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-primary border-opacity-20 border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">Loading categories...</p>
      </div>
    );
  }

  return (
    <>
      {/* Modals */}
      <FormModal
        isOpen={showAddCategoryModal}
        onClose={() => setShowAddCategoryModal(false)}
        onSubmit={handleCreateCategory}
        title="Add New Category"
        value={newCategoryName}
        onChange={(e) => setNewCategoryName(e.target.value)}
        placeholder="Enter category name"
        loading={actionLoading}
      />

      <FormModal
        isOpen={showEditCategoryModal}
        onClose={() => {
          setShowEditCategoryModal(false);
          setSelectedCategory(null);
          setEditCategoryName('');
        }}
        onSubmit={handleEditCategory}
        title="Edit Category"
        value={editCategoryName}
        onChange={(e) => setEditCategoryName(e.target.value)}
        placeholder="Enter category name"
        loading={actionLoading}
      />

      <FormModal
        isOpen={showAddSubcategoryModal}
        onClose={() => {
          setShowAddSubcategoryModal(false);
          setSelectedCategoryForSubcategory(null);
          setNewSubcategoryName('');
        }}
        onSubmit={handleCreateSubcategory}
        title="Add Subcategory"
        value={newSubcategoryName}
        onChange={(e) => setNewSubcategoryName(e.target.value)}
        placeholder="Enter subcategory name"
        loading={actionLoading}
      />

      <FormModal
        isOpen={showEditSubcategoryModal}
        onClose={() => {
          setShowEditSubcategoryModal(false);
          setSelectedSubcategory(null);
          setEditSubcategoryName('');
        }}
        onSubmit={handleEditSubcategory}
        title="Edit Subcategory"
        value={editSubcategoryName}
        onChange={(e) => setEditSubcategoryName(e.target.value)}
        placeholder="Enter subcategory name"
        loading={actionLoading}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        itemName={deleteItem?.name}
        type={deleteItem?.type}
      />

      {/* Search and Actions */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search categories or subcategories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowAddCategoryModal(true)}
            className="flex items-center gap-2 px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Category
          </button>
        </div>
        <p className="text-sm text-gray-500">
          Showing {filteredCategories.length} of {categories.length} categories
        </p>
      </div>

      {/* Categories List */}
      {filteredCategories.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8">
          <div className="flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Folder className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Categories Found</h3>
            <p className="text-gray-500 text-sm text-center mb-6">
              {searchQuery
                ? "No categories match your search criteria. Try a different search term."
                : "There are no categories available. Add your first category to get started."}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowAddCategoryModal(true)}
                className="px-4 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
              >
                Add Your First Category
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCategories.map((category) => {
            const categorySubcategories = getSubcategoriesForCategory(category.categoryId);
            const serviceCount = getServiceCountForCategory(category.categoryId);
            const isExpanded = expandedCategories.includes(category.categoryId);

            return (
              <div key={category.categoryId} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                {/* Category Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleCategoryExpansion(category.categoryId)}
                        className="p-1 hover:bg-gray-100 rounded-lg"
                        disabled={categorySubcategories.length === 0}
                      >
                        {categorySubcategories.length > 0 ? (
                          isExpanded ? (
                            <ChevronDown className="w-5 h-5 text-gray-500" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-gray-500" />
                          )
                        ) : (
                          <div className="w-5 h-5" />
                        )}
                      </button>
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <FolderOpen className="w-5 h-5 text-primary" />
                        ) : (
                          <Folder className="w-5 h-5 text-gray-400" />
                        )}
                        <div>
                          <h3 className="font-semibold text-gray-900">{category.categoryName}</h3>
                          <p className="text-xs text-gray-500">ID: {category.categoryId}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          {categorySubcategories.length} subcategories
                        </div>
                        <div className="text-xs text-gray-500">{serviceCount} services</div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setSelectedCategory(category);
                            setEditCategoryName(category.categoryName);
                            setShowEditCategoryModal(true);
                          }}
                          className="p-2 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(category, 'category')}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCategoryForSubcategory(category);
                            setShowAddSubcategoryModal(true);
                          }}
                          className="px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                        >
                          + Add Sub
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subcategories List */}
                {isExpanded && categorySubcategories.length > 0 && (
                  <div className="bg-gray-50 p-4">
                    <div className="space-y-3">
                      {categorySubcategories.map((subcategory) => {
                        const subServiceCount = getServiceCountForSubcategory(subcategory.subCategoryId);
                        return (
                          <div key={subcategory.subCategoryId} className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                                <div>
                                  <h4 className="font-medium text-gray-900">{subcategory.subCategoryName}</h4>
                                  <p className="text-xs text-gray-500">ID: {subcategory.subCategoryId}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="text-sm text-gray-600">
                                  {subServiceCount} service{subServiceCount !== 1 ? 's' : ''}
                                </div>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => {
                                      setSelectedSubcategory(subcategory);
                                      setEditSubcategoryName(subcategory.subCategoryName);
                                      setShowEditSubcategoryModal(true);
                                    }}
                                    className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteClick(subcategory, 'subcategory')}
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}