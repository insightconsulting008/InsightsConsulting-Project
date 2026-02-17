// ServiceDatabase.jsx
import React, { useState, useEffect } from 'react';
import {
  Search,
  Loader2,
  X,
  Plus,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const API_BASE_URL = 'https://insightsconsult-backend.onrender.com';
const PRIMARY = '#6869AC';

export default function GetServive() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('service');

  // category + subcategory state
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);
  const [categorySelection, setCategorySelection] = useState([]); // for category download
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [subcategoryLoading, setSubcategoryLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState([]);

  // services state
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [servicesError, setServicesError] = useState(null);

  // selection state for service download
  const [selectedServiceIds, setSelectedServiceIds] = useState([]);

  // Modals
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddSubcategoryModal, setShowAddSubcategoryModal] = useState(false);
  const [showEditSubcategoryModal, setShowEditSubcategoryModal] =
    useState(false);
  const [showDeleteSubcategoryModal, setShowDeleteSubcategoryModal] =
    useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [editName, setEditName] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [selectedCategoryForSubcategory, setSelectedCategoryForSubcategory] =
    useState(null);
  const [editSubcategoryName, setEditSubcategoryName] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
    fetchServices();
  }, []);

  useEffect(() => {
    filterCategories();
    filterSubcategories();
    filterServices();
  }, [searchQuery, categories, subcategories, services]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/category`);
      if (response.data.success) {
        setCategories(response.data.categories);
        setFilteredCategories(response.data.categories);
      } else {
        setError('Failed to fetch categories');
      }
    } catch (err) {
      setError('Error connecting to server');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubcategories = async () => {
    try {
      setSubcategoryLoading(true);
      const response = await axios.get(`${API_BASE_URL}/subcategory`);
      if (response.data.success) {
        setSubcategories(response.data.subcategories);
        setFilteredSubcategories(response.data.subcategories);
      }
    } catch (err) {
      console.error('Error fetching subcategories:', err);
    } finally {
      setSubcategoryLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      setServicesLoading(true);
      setServicesError(null);
      const response = await axios.get(`${API_BASE_URL}/service`);
      if (response.data.success) {
        setServices(response.data.services);
        setFilteredServices(response.data.services);
      } else {
        setServicesError('Failed to fetch services');
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      setServicesError('Error connecting to server');
    } finally {
      setServicesLoading(false);
    }
  };

  const filterCategories = () => {
    if (!searchQuery.trim()) {
      setFilteredCategories(categories);
      return;
    }
    const q = searchQuery.toLowerCase();
    const filtered = categories.filter(
      (cat) =>
        cat.categoryName.toLowerCase().includes(q) ||
        cat.categoryId.toLowerCase().includes(q)
    );
    setFilteredCategories(filtered);
  };

  const filterSubcategories = () => {
    if (!searchQuery.trim()) {
      setFilteredSubcategories(subcategories);
      return;
    }
    const q = searchQuery.toLowerCase();
    const filtered = subcategories.filter(
      (sub) =>
        sub.subCategoryName.toLowerCase().includes(q) ||
        sub.subCategoryId.toLowerCase().includes(q) ||
        sub.categoryId.toLowerCase().includes(q)
    );
    setFilteredSubcategories(filtered);
  };

  const filterServices = () => {
    if (!searchQuery.trim()) {
      setFilteredServices(services);
      return;
    }
    const q = searchQuery.toLowerCase();
    const filtered = services.filter(
      (srv) =>
        srv.name.toLowerCase().includes(q) ||
        srv.description.toLowerCase().includes(q) ||
        srv.serviceId.toLowerCase().includes(q) ||
        srv.subCategoryId.toLowerCase().includes(q)
    );
    setFilteredServices(filtered);
    setSelectedServiceIds((prev) =>
      prev.filter((id) => filtered.some((s) => s.serviceId === id))
    );
  };

  const toggleCategoryExpansion = (categoryId) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const getSubcategoriesForCategory = (categoryId) =>
    filteredSubcategories.filter((sub) => sub.categoryId === categoryId);

  const getSubcategoryCountForCategory = (categoryId) =>
    filteredSubcategories.filter((sub) => sub.categoryId === categoryId).length;

  // category handlers
  const handleEditClick = (category) => {
    setSelectedCategory(category);
    setEditName(category.categoryName || '');
    setShowEditModal(true);
  };

  const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const handleAddSubcategoryClick = (category) => {
    setSelectedCategoryForSubcategory(category);
    setNewSubcategoryName('');
    setShowAddSubcategoryModal(true);
  };

  const handleEditSubcategoryClick = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setEditSubcategoryName(subcategory.subCategoryName || '');
    setShowEditSubcategoryModal(true);
  };

  const handleDeleteSubcategoryClick = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setShowDeleteSubcategoryModal(true);
  };

  const handleAddSubmit = async () => {
    if (!newCategoryName.trim()) {
      alert('Category name cannot be empty');
      return;
    }

    try {
      setActionLoading(true);
      const response = await axios.post(`${API_BASE_URL}/category`, {
        categoryName: newCategoryName,
      });
      if (response.data.success) {
        await fetchCategories();
        setShowAddModal(false);
        setNewCategoryName('');
      }
    } catch (err) {
      console.error('Error adding category:', err);
      alert('Failed to add category. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditSubmit = async () => {
    if (!editName.trim()) {
      alert('Category name cannot be empty');
      return;
    }

    try {
      setActionLoading(true);
      await axios.put(
        `${API_BASE_URL}/category/${selectedCategory.categoryId}`,
        {
          categoryName: editName,
        }
      );

      const updatedCategories = categories.map((cat) =>
        cat.categoryId === selectedCategory.categoryId
          ? {
              ...cat,
              categoryName: editName,
              updatedAt: new Date().toISOString(),
            }
          : cat
      );
      setCategories(updatedCategories);
      setShowEditModal(false);
      setSelectedCategory(null);
      setEditName('');
    } catch (err) {
      console.error('Error updating category:', err);
      alert('Failed to update category. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      setActionLoading(true);
      await axios.delete(
        `${API_BASE_URL}/category/${selectedCategory.categoryId}`
      );

      const updatedCategories = categories.filter(
        (cat) => cat.categoryId !== selectedCategory.categoryId
      );
      setCategories(updatedCategories);

      const updatedSubcategories = subcategories.filter(
        (sub) => sub.categoryId !== selectedCategory.categoryId
      );
      setSubcategories(updatedSubcategories);

      setShowDeleteModal(false);
      setSelectedCategory(null);
    } catch (err) {
      console.error('Error deleting category:', err);
      alert('Failed to delete category. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddSubcategorySubmit = async () => {
    if (!newSubcategoryName.trim()) {
      alert('Subcategory name cannot be empty');
      return;
    }

    if (!selectedCategoryForSubcategory) {
      alert('No category selected');
      return;
    }

    try {
      setActionLoading(true);
      const response = await axios.post(`${API_BASE_URL}/subcategory`, {
        categoryId: selectedCategoryForSubcategory.categoryId,
        subCategoryName: newSubcategoryName,
      });

      if (response.data.success) {
        await fetchSubcategories();
        setShowAddSubcategoryModal(false);
        setNewSubcategoryName('');
        setSelectedCategoryForSubcategory(null);

        if (
          !expandedCategories.includes(
            selectedCategoryForSubcategory.categoryId
          )
        ) {
          setExpandedCategories((prev) => [
            ...prev,
            selectedCategoryForSubcategory.categoryId,
          ]);
        }
      }
    } catch (err) {
      console.error('Error adding subcategory:', err);
      alert('Failed to add subcategory. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditSubcategorySubmit = async () => {
    if (!editSubcategoryName.trim()) {
      alert('Subcategory name cannot be empty');
      return;
    }

    try {
      setActionLoading(true);
      await axios.put(
        `${API_BASE_URL}/subcategory/${selectedSubcategory.subCategoryId}`,
        {
          subCategoryName: editSubcategoryName,
        }
      );

      const updatedSubcategories = subcategories.map((sub) =>
        sub.subCategoryId === selectedSubcategory.subCategoryId
          ? {
              ...sub,
              subCategoryName: editSubcategoryName,
              updatedAt: new Date().toISOString(),
            }
          : sub
      );
      setSubcategories(updatedSubcategories);
      setShowEditSubcategoryModal(false);
      setSelectedSubcategory(null);
      setEditSubcategoryName('');
    } catch (err) {
      console.error('Error updating subcategory:', err);
      alert('Failed to update subcategory. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSubcategorySubmit = async () => {
    try {
      setActionLoading(true);
      await axios.delete(
        `${API_BASE_URL}/subcategory/${selectedSubcategory.subCategoryId}`
      );

      const updatedSubcategories = subcategories.filter(
        (sub) => sub.subCategoryId !== selectedSubcategory.subCategoryId
      );
      setSubcategories(updatedSubcategories);
      setShowDeleteSubcategoryModal(false);
      setSelectedSubcategory(null);
    } catch (err) {
      console.error('Error deleting subcategory:', err);
      alert('Failed to delete subcategory. Please try again.');
    } finally {
      setActionLoading(false);
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

  const handleServiceView = (service) => {
    navigate(`/view-service/${service.serviceId}`);
  };

  // service selection
  const handleToggleSelectAllServices = () => {
    if (
      filteredServices.length > 0 &&
      selectedServiceIds.length === filteredServices.length
    ) {
      setSelectedServiceIds([]);
    } else {
      setSelectedServiceIds(filteredServices.map((s) => s.serviceId));
    }
  };

  const handleToggleServiceSelection = (serviceId) => {
    setSelectedServiceIds((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  // category selection
  const toggleCategoryCheckbox = (categoryId) => {
    setCategorySelection((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleSelectAllCategories = () => {
    if (
      filteredCategories.length > 0 &&
      categorySelection.length === filteredCategories.length
    ) {
      setCategorySelection([]);
    } else {
      setCategorySelection(filteredCategories.map((c) => c.categoryId));
    }
  };

  // download SERVICES as PDF
  const handleDownloadSelectedServices = () => {
    if (selectedServiceIds.length === 0) {
      alert('Select at least one service to download');
      return;
    }
    const selectedServices = filteredServices.filter((service) =>
      selectedServiceIds.includes(service.serviceId)
    );

    const doc = new jsPDF({ orientation: 'landscape' });
    doc.setFontSize(16);
    doc.text('Service Export', 14, 18);

    const columns = [
      'Service Name',
      'Service ID',
      'Price',
      'Subcategory ID',
      'Last Update',
    ];
    const rows = selectedServices.map((s) => [
      s.name,
      s.serviceId,
      s.individualPrice,
      s.subCategoryId,
      formatDate(s.updatedAt || s.createdAt),
    ]);

    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 24,
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: {
        fillColor: [104, 105, 172],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: { fillColor: [245, 245, 250] },
    });

    doc.save(`services-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // download CATEGORIES + SUBCATEGORIES as PDF
  const handleDownloadCategories = () => {
    if (categorySelection.length === 0) {
      alert('Select at least one category to download');
      return;
    }

    const selectedCats = filteredCategories.filter((cat) =>
      categorySelection.includes(cat.categoryId)
    );

    const doc = new jsPDF({ orientation: 'portrait' });
    doc.setFontSize(16);
    doc.text('Categories & Subcategories', 14, 18);

    const columns = ['Category', 'Category ID', 'Subcategory', 'Subcategory ID'];
    const body = [];

    selectedCats.forEach((cat) => {
      const catSubs = filteredSubcategories.filter(
        (s) => s.categoryId === cat.categoryId
      );
      if (catSubs.length === 0) {
        body.push([cat.categoryName, cat.categoryId, '-', '-']);
      } else {
        catSubs.forEach((sub, index) => {
          body.push([
            index === 0 ? cat.categoryName : '',
            index === 0 ? cat.categoryId : '',
            sub.subCategoryName,
            sub.subCategoryId,
          ]);
        });
      }
    });

    doc.autoTable({
      head: [columns],
      body,
      startY: 24,
      styles: { fontSize: 9, cellPadding: 2 },
      headStyles: {
        fillColor: [104, 105, 172],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: { fillColor: [245, 245, 250] },
    });

    doc.save(`categories-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const renderCategoryTable = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 pt-4 pb-2">
        <div>
          <h2 className="text-sm font-semibold text-gray-700">
            Categories & Subcategories
          </h2>
          <p className="text-xs text-gray-500">
            Select categories and export them as a PDF report.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleDownloadCategories}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-white disabled:opacity-60"
            style={{ backgroundColor: PRIMARY }}
            disabled={categorySelection.length === 0}
          >
            Download PDF
          </button>
          <button
            onClick={handleAddClick}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-white"
            style={{ backgroundColor: PRIMARY }}
          >
            <Plus className="w-3 h-3" />
            Add Category
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left w-10">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  checked={
                    filteredCategories.length > 0 &&
                    categorySelection.length === filteredCategories.length
                  }
                  onChange={toggleSelectAllCategories}
                />
              </th>
              <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-700">
                Category
              </th>
              <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-700">
                Category ID
              </th>
              <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-700">
                Subcategories
              </th>
              <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-700 hidden md:table-cell">
                Services
              </th>
              <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-700">
                Last Update
              </th>
              <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="px-6 py-24 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Loader2
                      className="w-8 h-8 animate-spin"
                      style={{ color: PRIMARY }}
                    />
                    <p className="text-gray-600 text-sm">
                      Loading categories...
                    </p>
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="7" className="px-6 py-24 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="text-4xl">⚠️</div>
                    <p className="text-gray-900 font-semibold">
                      Error loading data
                    </p>
                    <p className="text-gray-600 text-sm mb-2">{error}</p>
                    <button
                      onClick={fetchCategories}
                      className="px-4 py-2 text-sm rounded-lg text-white"
                      style={{ backgroundColor: PRIMARY }}
                    >
                      Retry
                    </button>
                  </div>
                </td>
              </tr>
            ) : filteredCategories.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-24 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="text-4xl">📋</div>
                    <p className="text-gray-900 font-semibold">
                      No categories found
                    </p>
                    <p className="text-gray-600 text-sm">
                      {searchQuery
                        ? 'No categories match your search'
                        : 'Add your first category to get started.'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredCategories.map((category) => {
                const categorySubcategories = getSubcategoriesForCategory(
                  category.categoryId
                );
                const subcategoryCount =
                  getSubcategoryCountForCategory(category.categoryId);
                const isExpanded = expandedCategories.includes(
                  category.categoryId
                );
                const isChecked = categorySelection.includes(
                  category.categoryId
                );

                return (
                  <React.Fragment key={category.categoryId}>
                    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-4 sm:px-6 py-3">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300"
                          checked={isChecked}
                          onChange={() =>
                            toggleCategoryCheckbox(category.categoryId)
                          }
                        />
                      </td>
                      <td className="px-4 sm:px-6 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              toggleCategoryExpansion(category.categoryId)
                            }
                            className="p-1 rounded hover:bg-gray-200"
                            disabled={subcategoryCount === 0}
                          >
                            {subcategoryCount > 0 ? (
                              isExpanded ? (
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-gray-500" />
                              )
                            ) : null}
                          </button>
                          <span className="font-medium text-gray-900">
                            {category.categoryName}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 text-gray-600 font-mono text-xs">
                        {category.categoryId}
                      </td>
                      <td className="px-4 sm:px-6 py-3">
                        <span className="text-gray-700 text-sm">
                          {subcategoryCount}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3 text-gray-500 text-sm hidden md:table-cell">
                        -
                      </td>
                      <td className="px-4 sm:px-6 py-3 text-gray-600 text-sm">
                        {formatDate(category.updatedAt)}
                      </td>
                      <td className="px-4 sm:px-6 py-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => handleEditClick(category)}
                            className="px-2.5 py-1 text-xs rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(category)}
                            className="px-2.5 py-1 text-xs rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() =>
                              handleAddSubcategoryClick(category)
                            }
                            className="px-2.5 py-1 text-xs rounded-lg"
                            style={{
                              backgroundColor: '#F1F2FF',
                              color: PRIMARY,
                            }}
                          >
                            + Subcategory
                          </button>
                        </div>
                      </td>
                    </tr>

                    {isExpanded &&
                      categorySubcategories.length > 0 &&
                      categorySubcategories.map((subcategory) => (
                        <tr
                          key={subcategory.subCategoryId}
                          className="bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <td className="px-4 sm:px-6 py-2" />
                          <td className="px-4 sm:px-6 py-2 pl-10">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: PRIMARY }}
                              />
                              <span className="text-gray-800 text-sm">
                                {subcategory.subCategoryName}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-2 text-gray-500 font-mono text-xs">
                            {subcategory.subCategoryId}
                          </td>
                          <td className="px-4 sm:px-6 py-2 text-gray-500 text-sm">
                            Subcategory
                          </td>
                          <td className="px-4 sm:px-6 py-2 text-gray-500 text-sm hidden md:table-cell">
                            -
                          </td>
                          <td className="px-4 sm:px-6 py-2 text-gray-500 text-sm">
                            {formatDate(subcategory.updatedAt)}
                          </td>
                          <td className="px-4 sm:px-6 py-2">
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() =>
                                  handleEditSubcategoryClick(subcategory)
                                }
                                className="px-2.5 py-1 text-xs rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteSubcategoryClick(subcategory)
                                }
                                className="px-2.5 py-1 text-xs rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderServiceTable = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 pt-4 pb-2">
        <div>
          <h2 className="text-sm font-semibold text-gray-800">All Services</h2>
          <p className="text-xs text-gray-500">
            Select services to export them as a PDF report.
          </p>
        </div>
        <button
          onClick={handleDownloadSelectedServices}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-white disabled:opacity-60"
          style={{ backgroundColor: PRIMARY }}
          disabled={selectedServiceIds.length === 0}
        >
          Download PDF
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 sm:px-6 py-3 text-left w-10">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  checked={
                    filteredServices.length > 0 &&
                    selectedServiceIds.length === filteredServices.length
                  }
                  onChange={handleToggleSelectAllServices}
                />
              </th>
              <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-700">
                Service
              </th>
              <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-700 hidden md:table-cell">
                Service ID
              </th>
              <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-700 hidden lg:table-cell">
                Description
              </th>
              <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-700">
                Price
              </th>
              <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-700 hidden md:table-cell">
                Subcategory ID
              </th>
              <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-700">
                Updated
              </th>
              <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {servicesLoading ? (
              <tr>
                <td colSpan="8" className="px-6 py-24 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Loader2
                      className="w-8 h-8 animate-spin"
                      style={{ color: PRIMARY }}
                    />
                    <p className="text-gray-600 text-sm">
                      Loading services...
                    </p>
                  </div>
                </td>
              </tr>
            ) : servicesError ? (
              <tr>
                <td colSpan="8" className="px-6 py-24 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="text-4xl">⚠️</div>
                    <p className="text-gray-900 font-semibold">
                      Error loading services
                    </p>
                    <p className="text-gray-600 text-sm mb-2">
                      {servicesError}
                    </p>
                    <button
                      onClick={fetchServices}
                      className="px-4 py-2 text-sm rounded-lg text-white"
                      style={{ backgroundColor: PRIMARY }}
                    >
                      Retry
                    </button>
                  </div>
                </td>
              </tr>
            ) : filteredServices.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-24 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="text-4xl">📋</div>
                    <p className="text-gray-900 font-semibold">
                      No services found
                    </p>
                    <p className="text-gray-600 text-sm">
                      {searchQuery
                        ? 'No services match your search'
                        : 'Onboard a new service to get started.'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredServices.map((service) => (
                <tr
                  key={service.serviceId}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 sm:px-6 py-3">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      checked={selectedServiceIds.includes(service.serviceId)}
                      onChange={() =>
                        handleToggleServiceSelection(service.serviceId)
                      }
                    />
                  </td>
                  <td className="px-4 sm:px-6 py-3">
                    <div className="flex flex-col">
                      <span className="text-gray-900 font-medium">
                        {service.name}
                      </span>
                      <span className="text-xs text-gray-500 md:hidden">
                        {service.serviceId}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-3 text-gray-600 font-mono text-xs hidden md:table-cell">
                    {service.serviceId}
                  </td>
                  <td className="px-4 sm:px-6 py-3 text-gray-600 text-xs max-w-xs truncate hidden lg:table-cell">
                    {service.description}
                  </td>
                  <td className="px-4 sm:px-6 py-3 text-gray-900 text-sm">
                    ₹{service.individualPrice}
                  </td>
                  <td className="px-4 sm:px-6 py-3 text-gray-600 font-mono text-xs hidden md:table-cell">
                    {service.subCategoryId}
                  </td>
                  <td className="px-4 sm:px-6 py-3 text-gray-600 text-xs">
                    {formatDate(service.updatedAt || service.createdAt)}
                  </td>
                  <td className="px-4 sm:px-6 py-3">
                    <button
                      onClick={() => handleServiceView(service)}
                      className="px-3 py-1.5 text-xs rounded-lg text-white"
                      style={{ backgroundColor: PRIMARY }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderTable = () => {
    if (activeTab === 'category') return renderCategoryTable();
    if (activeTab === 'service') return renderServiceTable();
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Service Database
            </h1>
            <p className="text-gray-600 text-sm sm:text-base mt-1">
              Manage services, categories, and export data as PDF.
            </p>
          </div>
          <div>
          <button
            onClick={() => navigate('/add-service')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-white shadow-sm hover:shadow-md transition-shadow"
            style={{ backgroundColor: PRIMARY }}
          >
            <Plus className="w-5 h-5" />
            Onboard New Service
          </button>
          </div>
        </div>

        <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 shadow-sm">
          <button
            onClick={() => setActiveTab('service')}
            className={`px-4 sm:px-6 py-1.5 sm:py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'service'
                ? 'text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            style={
              activeTab === 'service'
                ? { backgroundColor: PRIMARY }
                : { backgroundColor: 'transparent' }
            }
          >
            Service List
          </button>
          <button
            onClick={() => setActiveTab('category')}
            className={`px-4 sm:px-6 py-1.5 sm:py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'category'
                ? 'text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            style={
              activeTab === 'category'
                ? { backgroundColor: PRIMARY }
                : { backgroundColor: 'transparent' }
            }
          >
            Category List
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={
                activeTab === 'service'
                  ? 'Search services by name, ID or subcategory...'
                  : 'Search categories or subcategories...'
              }
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#6869AC]"
            />
          </div>
        </div>

        {renderTable()}
      </div>

      {/* Modals: same as before, but all input values use || '' to avoid controlled/uncontrolled warnings */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Edit Category
              </h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedCategory(null);
                  setEditName('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Category Name
              </label>
              <input
                type="text"
                value={editName || ''}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6869AC]"
                placeholder="Enter category name"
              />
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedCategory(null);
                  setEditName('');
                }}
                disabled={actionLoading}
                className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                disabled={actionLoading}
                className="px-4 py-2 text-sm text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
                style={{ backgroundColor: PRIMARY }}
              >
                {actionLoading && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {actionLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Category
              </h3>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedCategory(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 text-sm text-gray-700 space-y-2">
              <p>
                Are you sure you want to delete the category{' '}
                <span className="font-semibold text-gray-900">
                  "{selectedCategory?.categoryName}"
                </span>
                ?
              </p>
              <p>This will also remove all associated subcategories.</p>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedCategory(null);
                }}
                disabled={actionLoading}
                className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSubmit}
                disabled={actionLoading}
                className="px-4 py-2 text-sm text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
                style={{ backgroundColor: '#EF4444' }}
              >
                {actionLoading && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {actionLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Add New Category
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewCategoryName('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Category Name
              </label>
              <input
                type="text"
                value={newCategoryName || ''}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6869AC]"
                placeholder="Enter category name"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddSubmit();
                }}
              />
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewCategoryName('');
                }}
                disabled={actionLoading}
                className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSubmit}
                disabled={actionLoading}
                className="px-4 py-2 text-sm text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
                style={{ backgroundColor: PRIMARY }}
              >
                {actionLoading && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {actionLoading ? 'Adding...' : 'Add Category'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddSubcategoryModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Add New Subcategory
              </h3>
              <button
                onClick={() => {
                  setShowAddSubcategoryModal(false);
                  setNewSubcategoryName('');
                  setSelectedCategoryForSubcategory(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <div className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-900">
                  {selectedCategoryForSubcategory?.categoryName || 'Not set'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subcategory Name
                </label>
                <input
                  type="text"
                  value={newSubcategoryName || ''}
                  onChange={(e) => setNewSubcategoryName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6869AC]"
                  placeholder="Enter subcategory name"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddSubcategorySubmit();
                  }}
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowAddSubcategoryModal(false);
                  setNewSubcategoryName('');
                  setSelectedCategoryForSubcategory(null);
                }}
                disabled={actionLoading}
                className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSubcategorySubmit}
                disabled={actionLoading}
                className="px-4 py-2 text-sm text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
                style={{ backgroundColor: PRIMARY }}
              >
                {actionLoading && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {actionLoading ? 'Adding...' : 'Add Subcategory'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditSubcategoryModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Edit Subcategory
              </h3>
              <button
                onClick={() => {
                  setShowEditSubcategoryModal(false);
                  setSelectedSubcategory(null);
                  setEditSubcategoryName('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <div className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-900">
                  {categories.find(
                    (c) => c.categoryId === selectedSubcategory?.categoryId
                  )?.categoryName || selectedSubcategory?.categoryId}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subcategory Name
                </label>
                <input
                  type="text"
                  value={editSubcategoryName || ''}
                  onChange={(e) => setEditSubcategoryName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6869AC]"
                  placeholder="Enter subcategory name"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowEditSubcategoryModal(false);
                  setSelectedSubcategory(null);
                  setEditSubcategoryName('');
                }}
                disabled={actionLoading}
                className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubcategorySubmit}
                disabled={actionLoading}
                className="px-4 py-2 text-sm text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
                style={{ backgroundColor: PRIMARY }}
              >
                {actionLoading && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {actionLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteSubcategoryModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Subcategory
              </h3>
              <button
                onClick={() => {
                  setShowDeleteSubcategoryModal(false);
                  setSelectedSubcategory(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 text-sm text-gray-700 space-y-2">
              <p>
                Are you sure you want to delete the subcategory{' '}
                <span className="font-semibold text-gray-900">
                  "{selectedSubcategory?.subCategoryName}"
                </span>
                ?
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowDeleteSubcategoryModal(false);
                  setSelectedSubcategory(null);
                }}
                disabled={actionLoading}
                className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteSubcategorySubmit}
                disabled={actionLoading}
                className="px-4 py-2 text-sm text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
                style={{ backgroundColor: '#EF4444' }}
              >
                {actionLoading && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {actionLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

