// EmployeeModal.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { Plus, Users, X, Upload, ChevronDown, Eye, EyeOff, Loader2 } from 'lucide-react';
import { FaUsers } from 'react-icons/fa';
import axiosInstance from '@src/providers/axiosInstance';
import Cropper from 'react-easy-crop';

/* ErrorPopup (kept UI from your original) */
const ErrorPopup = ({ isOpen, onClose, errorMessage }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
      <div className="bg-white w-[360px] md:w-[460px] rounded-2xl shadow-2xl transform transition-all relative">
        <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1 text-white">
              <h3 className="font-semibold text-lg">Error</h3>
            </div>
          </div>
        </div>

        <div className="lg:px-6 px-3 py-4 lg:py-8 text-center">
          <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <X className="w-10 h-10 text-red-600" />
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-2">Operation Failed</h2>
          <p className="text-gray-700 mb-4 px-4">{errorMessage || 'An unexpected error occurred.'}</p>
        </div>

        <button
          onClick={onClose}
          className="absolute -top-20 md:right-[50%]  text-white/80 hover:text-white bg-white/30 p-3 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

/* SuccessPopup (kept UI from your original, added custom message for edit) */
const SuccessPopup = ({ isOpen, onClose, employeeData, departmentData, mode = 'add' }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 z-[60]  flex items-center justify-center p-4">
      <div className="bg-white  w-[360px] md:w-[460px] rounded-2xl shadow-2xl  transform transition-all">
        <div className="btn-primary px-6 py-4 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden">
              {employeeData?.photoUrl ? (
                <img src={employeeData.photoUrl} alt={employeeData.name} className="w-full h-full object-cover" />
              ) : (
                <Users className="w-6 h-6 text-indigo-600" />
              )}
            </div>
            <div className="flex-1 text-white">
              <h3 className="font-semibold text-lg">{employeeData?.name}</h3>
              <p className="text-sm text-indigo-100">{employeeData?.role} | {employeeData?.designation}</p>
            </div>
            {departmentData && (
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: departmentData.labelColor }} />
                <span className="text-white text-xs font-medium">{departmentData.label}</span>
              </div>
            )}
          </div>
        </div>

        <div className="lg:px-6 px-3   py-4 lg:py-8 text-center">
          <div className="w-24 h-24   mx-auto mb-4 flex items-center justify-center ">
            <img src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/Frame%202147225819.png?updatedAt=1765182959006" alt="" />
          </div>

          {mode === 'add' ? (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-2">'{employeeData?.name} | {employeeData?.employeeId}'</h2>
              <p className="text-gray-700 mb-1">has been added to the '{departmentData?.label}' team.</p>
              <p className="text-sm text-gray-500">You can now view this employee under the assigned department.</p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Edited successfully</h2>
              <p className="text-gray-700 mb-1">Employee '{employeeData?.name}'  updated.</p>
              <p className="text-sm text-gray-500">Changes have been saved to the employee record.</p>
            </>
          )}
        </div>

        <button
          onClick={onClose}
          className="absolute lg:top-20 top-36 md:right-[50%]  right-[45%] text-white/80 hover:text-white bg-white/30 p-3  rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const EmployeeModal = ({
  isOpen,
  onClose,
  initialData = null,
  onEmployeeAdded,
  onEmployeeUpdated,
  departmentPage = 1,
  departmentLimit = 10
}) => {
  const emptyForm = {
    department: '',
    status: 'Active',
    role: 'Staff',
    name: '',
    employeeId: '',
    email: '',
    mobile: '',
    designation: '',
    photoUrl: '',
    password: '',
    photoFile: null
  };

  const [formData, setFormData] = useState(emptyForm);
  const [departments, setDepartments] = useState([]);
  const [totalDepartments, setTotalDepartments] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [successMode, setSuccessMode] = useState('add');
  const containerRef = useRef(null);

  // Image cropper states
  const [showCropModal, setShowCropModal] = useState(false);
  const [originalImage, setOriginalImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [cropLoading, setCropLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Image size constants
  const IMAGE_SIZE = { width: 200, height: 200 };
  const aspectRatio = IMAGE_SIZE.width / IMAGE_SIZE.height;

  // Normalize department list from API (paginated)
  async function fetchDepartments(page = departmentPage, limit = departmentLimit) {
    setLoading(true);
    try {
      const url = `https://insightsconsult-backend.onrender.com/department?page=${encodeURIComponent(page)}&limit=${encodeURIComponent(limit)}`;
      const res = await axios.get(url);
      const json = res.data;

      let raw = [];
      if (Array.isArray(json)) {
        raw = json;
      } else if (Array.isArray(json?.data)) {
        raw = json.data;
      } else if (Array.isArray(json?.departments)) {
        raw = json.departments;
      } else if (Array.isArray(json?.data?.data)) {
        raw = json.data.data;
      } else {
        const arrayField = Object.values(json).find(v => Array.isArray(v));
        if (Array.isArray(arrayField)) raw = arrayField;
      }

      const normalized = raw.map((d, i) => ({
        id: d._id ?? d.departmentId ?? d.id ?? String(i),
        label: d.label ?? d.name ?? d.title ?? d.departmentCode ?? 'Unnamed Dept',
        labelColor: d.labelColor ?? d.color ?? '#D1D5DB',
        raw: d
      }));

      setDepartments(normalized);

      const total =
        json?.meta?.total ??
        json?.total ??
        json?.data?.meta?.total ??
        json?.data?.total ??
        null;
      setTotalDepartments(typeof total === 'number' ? total : null);

      // If add-mode and no department set yet, default to first
      if (!initialData && normalized.length > 0 && (!formData.department || formData.department === '')) {
        setFormData(prev => ({ ...prev, department: normalized[0].id }));
      }
    } catch (err) {
      console.error('fetchDepartments error', err);
      setDepartments([]);
      setTotalDepartments(null);
    } finally {
      setLoading(false);
    }
  }

  // When modal opens, fetch departments (using the paginated endpoint)
  useEffect(() => {
    if (isOpen) fetchDepartments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, departmentPage, departmentLimit]);

  // Populate or reset form when modal opens or initialData changes
  useEffect(() => {
    if (isOpen && initialData) {
      const incomingRole = initialData.role ? (String(initialData.role).toLowerCase().includes('admin') ? 'Admin' : 'Staff') : 'Staff';
      setFormData({
        department: initialData.departmentId ?? initialData.department ?? '',
        status: (initialData.status ?? 'ACTIVE').charAt(0) + (initialData.status ?? 'ACTIVE').slice(1).toLowerCase(),
        role: incomingRole,
        name: initialData.name ?? '',
        employeeId: initialData.employeeId ?? initialData.empId ?? '',
        email: initialData.email ?? '',
        mobile: initialData.mobileNumber ?? initialData.mobile ?? initialData.phone ?? '',
        designation: initialData.designation ?? '',
        photoUrl: initialData.photoUrl ?? '',
        password: '',
        photoFile: null
      });
      setShowError(false);
      setErrorMessage('');
      return;
    }

    if (isOpen && !initialData) {
      setFormData(prev => ({
        ...emptyForm,
        department: departments[0]?.id ?? ''
      }));
      setShowError(false);
      setErrorMessage('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, initialData, departments]);

  // close dropdown if clicking outside
  useEffect(() => {
    const onClick = (e) => { if (containerRef.current && !containerRef.current.contains(e.target)) setOpenDropdown(false); };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const getSelectedDepartment = () => departments.find(d => d.id === formData.department) ?? null;
  const handleSelect = (id) => { setFormData(prev => ({ ...prev, department: id })); setOpenDropdown(false); };

  // ==================== IMAGE CROPPER FUNCTIONS ====================
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Please select a valid image file (JPEG, JPG, or PNG)');
      setShowError(true);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image size should be less than 5MB');
      setShowError(true);
      return;
    }

    const reader = new FileReader();
    reader.onloadstart = () => {
      setCropLoading(true);
    };
    reader.onloadend = () => {
      setOriginalImage(reader.result);
      setShowCropModal(true);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCropLoading(false);
    };
    reader.onerror = () => {
      setErrorMessage('Error reading image file');
      setCropLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = IMAGE_SIZE.width;
    canvas.height = IMAGE_SIZE.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      IMAGE_SIZE.width,
      IMAGE_SIZE.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 0.95);
    });
  };

  const applyCrop = async () => {
    try {
      if (!originalImage || !croppedAreaPixels) return;

      setCropLoading(true);
      const croppedBlob = await getCroppedImg(originalImage, croppedAreaPixels);
      const croppedFile = new File([croppedBlob], `employee-photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
      
      // Create a temporary object URL for preview only
      const tempUrl = URL.createObjectURL(croppedBlob);
      
      setFormData(prev => ({
        ...prev,
        photoUrl: tempUrl, // Temporary blob URL for preview
        photoFile: croppedFile
      }));
      
      setShowCropModal(false);
    } catch (error) {
      console.error('Error cropping image:', error);
      setErrorMessage('Error cropping image. Please try again.');
      setShowError(true);
    } finally {
      setCropLoading(false);
    }
  };

  const removePhoto = () => {
    if (formData.photoUrl && formData.photoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(formData.photoUrl);
    }
    setFormData(prev => ({
      ...prev,
      photoUrl: '',
      photoFile: null
    }));
  };

  // API helpers - UPDATED to use FormData
  async function postEmployee(formDataPayload) {
    try {
      const res = await axiosInstance.post('/employee', formDataPayload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return { ok: true, status: res.status, body: res.data };
    } catch (err) {
      const resp = err.response;
      return { ok: false, status: resp?.status ?? 500, body: resp?.data ?? { error: err.message } };
    }
  }

  async function putEmployee(id, formDataPayload) {
    try {
      const res = await axiosInstance.put(`/employee/${id}`, formDataPayload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return { ok: true, status: res.status, body: res.data };
    } catch (err) {
      const resp = err.response;
      return { ok: false, status: resp?.status ?? 500, body: resp?.data ?? { error: err.message } };
    }
  }

  const validateRequired = () => {
    if (!formData.name || !formData.email || !formData.mobile || !formData.designation) {
      setErrorMessage('Please fill required fields: Name, Email, Mobile, Designation');
      setShowError(true);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateRequired()) return;

    setSubmitting(true);
    setErrorMessage('');
    setShowError(false);

    const selected = getSelectedDepartment();

    const departmentId =
      selected?.raw?.departmentId ??
      selected?.raw?._id ??
      selected?.id ??
      null;

    if (!departmentId) {
      setErrorMessage('Please select a valid department');
      setShowError(true);
      setSubmitting(false);
      return;
    }

    try {
      // Create FormData object to send all data including file
      const formDataPayload = new FormData();

      // Add text fields
      formDataPayload.append('name', formData.name);
      formDataPayload.append('email', formData.email);
      formDataPayload.append('mobileNumber', formData.mobile);
      formDataPayload.append('designation', formData.designation);
      formDataPayload.append('departmentId', departmentId);
      formDataPayload.append('role', (formData.role ?? 'Staff').toUpperCase());
      formDataPayload.append('status', (formData.status ?? 'Active').toUpperCase());

      // Add optional employee ID if provided
      if (formData.employeeId) {
        formDataPayload.append('employeeId', formData.employeeId);
      }

      // Add password if provided
      if (formData.password) {
        formDataPayload.append('password', formData.password);
      } else if (!initialData) {
        // Password required for new employees
        setErrorMessage('Password is required for new employees');
        setShowError(true);
        setSubmitting(false);
        return;
      }

      // Add photo file if exists
      if (formData.photoFile) {
        formDataPayload.append('photoUrl', formData.photoFile);
      } else if (formData.photoUrl && !formData.photoUrl.startsWith('blob:')) {
        // If editing and photoUrl is already a real URL (not blob), send it as string
        formDataPayload.append('photoUrl', formData.photoUrl);
      }

      // // Log what we're sending (for debugging)
      // console.log('FormData being sent:');
      // for (let [key, value] of formDataPayload.entries()) {
      //   console.log(key, value);
      // }

      // UPDATE CASE
      if (initialData && (initialData._id || initialData.employeeId)) {
        const idToUse = initialData._id ?? initialData.employeeId;
        const res = await putEmployee(idToUse, formDataPayload);

        if (res.ok) {
          setSuccessMode('update');
          setSuccessData({ 
            employee: { 
              ...formData, 
              mobileNumber: formData.mobile, // Convert mobile to mobileNumber for display
              departmentId 
            }, 
            department: selected 
          });
          setShowSuccess(true);
          return;
        } else {
          setErrorMessage(
            res.body?.message ??
            res.body?.error ??
            `Failed to update employee (status ${res.status})`
          );
          setShowError(true);
        }
      }

      // CREATE CASE
      else {
        const res = await postEmployee(formDataPayload);

        if (res.ok) {
          setSuccessMode('add');
          setSuccessData({ 
            employee: { 
              ...formData, 
              mobileNumber: formData.mobile, // Convert mobile to mobileNumber for display
              departmentId 
            }, 
            department: selected 
          });
          setShowSuccess(true);
          return;
        } else {
          setErrorMessage(
            res.body?.message ??
            res.body?.error ??
            `Failed to add employee (status ${res.status})`
          );
          setShowError(true);
        }
      }
    } catch (err) {
      console.error('submit error', err);
      setErrorMessage(err.message || 'Network error. Please try again.');
      setShowError(true);
    } finally {
      setSubmitting(false);
    }
  };

  function handleSuccessClose() {
    // Clean up blob URLs
    if (formData.photoUrl && formData.photoUrl.startsWith('blob:')) {
      URL.revokeObjectURL(formData.photoUrl);
    }
    
    if (successMode === 'add') {
      if (onEmployeeAdded) onEmployeeAdded(successData?.employee);
    } else {
      if (onEmployeeUpdated) onEmployeeUpdated(successData?.employee);
    }
    setShowSuccess(false);
    setSuccessData(null);
    onClose();
  }

  function handleErrorClose() {
    setShowError(false);
    setErrorMessage('');
  }

  function renderHeader() {
    const mode = initialData ? 'Edit Employee' : 'Add New Employee';
    return (
      <div className="p-6 btn-primary flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-opacity-20 rounded-full flex items-center justify-center">
            <FaUsers className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-semibold">{mode}</h2>
        </div>
        <button onClick={onClose} className="hover:bg-white/10 rounded-full p-1 transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
    );
  }

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 bg-opacity-50 z-50 flex justify-end">
        <div className={`bg-white shadow-xl w-full max-w-md h-full overflow-y-auto transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          {renderHeader()}

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Photo Upload Section with Cropper */}
            <div className="flex flex-col items-center">
              <div className="relative w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-3 o">
                {formData.photoUrl ? (
                  <>
                    <img src={formData.photoUrl} alt={formData.name} className="w-full h-full object-cover rounded-full" />
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      disabled={cropLoading || submitting}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <Users className="w-10 h-10 text-gray-400" />
                )}
              </div>
              
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="employee-photo-upload"
                disabled={cropLoading || submitting}
              />
              
              <label 
                htmlFor="employee-photo-upload"
                className={`flex items-center gap-2 btn-primary text-white rounded-lg text-sm hover:from-indigo-700 hover:to-indigo-800 transition-all cursor-pointer px-4 py-2 ${(cropLoading || submitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {cropLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Upload Photo
                  </>
                )}
              </label>
              <p className="text-xs text-gray-500 mt-2">
                Image will be cropped to {IMAGE_SIZE.width}×{IMAGE_SIZE.height}px
              </p>
            </div>

            {/* Department select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Department</label>
              <div ref={containerRef} className="relative">
                <select value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className="hidden" aria-hidden>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                </select>

                <button
                  type="button"
                  onClick={() => setOpenDropdown(s => !s)}
                  aria-haspopup="listbox"
                  aria-expanded={openDropdown}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white flex items-center justify-between gap-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={loading}
                >
                  <div className="flex items-center gap-3">
                    {getSelectedDepartment() ? (
                      <>
                        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: getSelectedDepartment().labelColor }} />
                        <span className="text-sm text-black">{getSelectedDepartment().label}</span>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">{loading ? 'Loading...' : 'Choose department'}</span>
                    )}
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {openDropdown && (
                  <ul role="listbox" tabIndex={-1} className="absolute z-50 mt-2 w-full max-h-60 overflow-auto bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                    {loading ? (
                      <li className="px-4 py-2 text-sm text-gray-500">Loading departments...</li>
                    ) : departments.length === 0 ? (
                      <li className="px-4 py-2 text-sm text-gray-500">No departments available</li>
                    ) : departments.map(dept => {
                      const selected = dept.id === formData.department;
                      return (
                        <li
                          key={dept.id}
                          role="option"
                          aria-selected={selected}
                          onClick={() => handleSelect(dept.id)}
                          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelect(dept.id); }}
                          tabIndex={0}
                          className={`flex items-center gap-3 px-4 py-2 cursor-pointer text-sm ${selected ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}
                        >
                          <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: dept.labelColor }} />
                          <span className="flex-1 text-left">{dept.label}</span>
                          {selected && <span className="text-xs text-indigo-600">Selected</span>}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employee Status</label>
              <div className="relative">
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
            </div>

            {/* Role select (Admin / Staff) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <div className="relative">
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option>Staff</option>
                  <option>Admin</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employee Name <span className="text-red-500">*</span></label>
              <input type="text" placeholder="Rahul A" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employee ID</label>
              <input type="text" placeholder="EMP012 (optional)" value={formData.employeeId} onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              <p className="text-xs text-gray-500 mt-1">If left blank, the server may generate one.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address <span className="text-red-500">*</span></label>
              <input type="email" placeholder="rahul@companyname.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number <span className="text-red-500">*</span></label>
              <input type="tel" placeholder="9874521266" value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Designation <span className="text-red-500">*</span></label>
              <input type="text" placeholder="Associate Manager" value={formData.designation} onChange={(e) => setFormData({ ...formData, designation: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password {initialData ? <span className="text-xs text-gray-500"> (leave blank to keep current)</span> : <span className="text-red-500">*</span>}</label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={initialData ? "Enter new password to change" : "Enter password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5 text-gray-600" /> : <Eye className="w-5 h-5 text-gray-600" />}
                </button>
              </div>
            </div>

            {showError && (
              <div className="text-sm text-red-600">{errorMessage}</div>
            )}

            <div className="flex gap-3 pt-4">
              <button type="submit" disabled={submitting || cropLoading} className="flex-1 btn-primary text-white rounded-lg font-medium disabled:opacity-60">
                {submitting ? (initialData ? 'Updating...' : 'Adding...') : (initialData ? 'Update Employee' : 'Add Employee')}
              </button>
              <button type="button" onClick={onClose} disabled={submitting || cropLoading} className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-60">Cancel</button>
            </div>
          </form>
        </div>
      </div>

      {/* Crop Modal */}
      {showCropModal && (
        <div className="fixed inset-0 bg-black/60 z-[999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Crop Employee Photo</h2>
                <button
                  onClick={() => setShowCropModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  disabled={cropLoading}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Crop your image (Aspect Ratio: {IMAGE_SIZE.width}×{IMAGE_SIZE.height}px)
                </label>
              </div>

              <div className="relative mb-6 bg-gray-100 rounded-lg overflow-hidden"
                style={{ height: '300px', width: '100%' }}>
                <Cropper
                  image={originalImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={aspectRatio}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  cropShape="rect"
                  showGrid={true}
                  objectFit="contain"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zoom: {Math.round(zoom * 100)}%
                </label>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  disabled={cropLoading}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowCropModal(false)}
                  className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={cropLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={applyCrop}
                  disabled={cropLoading}
                  className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 flex items-center gap-2"
                >
                  {cropLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Cropping...
                    </>
                  ) : (
                    'Crop & Save'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success & Error popups */}
      {showSuccess && successData && (
        <SuccessPopup
          isOpen={showSuccess}
          onClose={handleSuccessClose}
          employeeData={successData.employee}
          departmentData={successData.department}
          mode={successMode}
        />
      )}

      {showError && (
        <ErrorPopup isOpen={showError} onClose={handleErrorClose} errorMessage={errorMessage} />
      )}
    </>
  );
};

export default EmployeeModal;