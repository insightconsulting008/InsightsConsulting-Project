// AddDepartmentModal.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { X, Plus, Check } from 'lucide-react';
import { BiSolidPencil } from 'react-icons/bi';

// Success Popup Component
const SuccessPopup = ({ isOpen, onClose, onAddEmployee, departmentName, departmentCode, mode = 'add' }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-2xl shadow-2xl w-[350px] md:w-[450px] relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute -top-20 right-[45%] bg-gray-700 hover:bg-gray-800 text-white rounded-full p-3 shadow-lg transition-colors"
          aria-label="Close success"
        >
          <X size={20} />
        </button>

        <div className="text-center ">
          <div className="flex justify-center py-2">
            <img src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/Frame%202147225819.png" className="w-20" alt="" />
          </div>

          <h2 className="text-base lg:text-xl font-bold text-gray-800 mb-3">
            '{departmentName} | {departmentCode}'
          </h2>

          <p className="text-gray-700 font-medium mb-2 text-sm lg:text-base">
            Department has been {mode === 'edit' ? 'updated' : 'created'} successfully
          </p>

          <p className="text-gray-500 text-sm lg:text-base mb-8">You can now add employees under this team.</p>

          {/* <button onClick={onAddEmployee} className="w-full btn-primary rounded-b-2xl">
            Add Employee
          </button> */}
        </div>
      </div>
    </div>
  );
};

const presetColors = ['#EF4444', '#10B981', '#3B82F6'];

const AddDepartmentModal = ({ open, onClose, onSubmit, onUpdate, initialData = null }) => {
  const [deptName, setDeptName] = useState('');
  const [deptCode, setDeptCode] = useState('');
  const [selectedColor, setSelectedColor] = useState('#6366F1');
  const [loading, setLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [createdDepartment, setCreatedDepartment] = useState(null);
  const [error, setError] = useState('');
  const [customColor, setCustomColor] = useState('#000000');

  // NEW: remember whether last operation was 'add' or 'edit'
  const [lastMode, setLastMode] = useState('add');

  const isEditMode = Boolean(initialData && Object.keys(initialData).length);

  // Prefill fields when modal opens or when initialData changes
  useEffect(() => {
    if (open) {
      if (isEditMode) {
        setDeptName(initialData.name || initialData.departmentName || '');
        setDeptCode(initialData.departmentCode || initialData.code || initialData.departmentCode || '');
        setSelectedColor(initialData.labelColor || '#6366F1');
        setError('');
        setShowSuccessPopup(false);
        setCreatedDepartment(null);
      } else {
        // create mode reset
        setDeptName('');
        setDeptCode('');
        setSelectedColor('#6366F1');
        setError('');
        setShowSuccessPopup(false);
        setCreatedDepartment(null);
      }
    }
  }, [open, initialData, isEditMode]);

  if (!open && !showSuccessPopup) return null;

  const normalizeApiCreated = (apiPayload, fallback) => {
    const createdFromApi = apiPayload?.data ?? apiPayload ?? {};
    const normalized = {
      departmentId: createdFromApi?.departmentId || createdFromApi?.id || createdFromApi?._id || fallback?.departmentId || `tmp-${Date.now()}`,
      name: createdFromApi?.name || createdFromApi?.departmentName || fallback?.name || '',
      departmentCode: createdFromApi?.departmentCode || createdFromApi?.code || fallback?.departmentCode || fallback?.code || '',
      labelColor: createdFromApi?.labelColor || fallback?.labelColor || '',
      ...createdFromApi,
    };
    return normalized;
  };

  const handleSubmit = async () => {
    setError('');
    if (!deptName.trim() || !deptCode.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    const payload = {
      name: deptName.trim(),
      departmentCode: deptCode.trim(),
      labelColor: selectedColor,
    };

    setLoading(true);
    try {
      // set lastMode immediately so popup shows correct text
      setLastMode(isEditMode ? 'edit' : 'add');

      if (isEditMode) {
        // Determine id to use
        const idToUse = initialData.departmentId || initialData._id || initialData.id;
        if (!idToUse) {
          throw new Error('Could not determine department id for update.');
        }

        const url = `https://insightsconsult-backend.onrender.com/department/${idToUse}`;
        const res = await axios.put(url, payload, { headers: { 'Content-Type': 'application/json' } });

        const normalized = normalizeApiCreated(res?.data, { ...payload, departmentId: idToUse });

        setCreatedDepartment({ name: normalized.name, code: normalized.departmentCode });
        setShowSuccessPopup(true);

        if (typeof onUpdate === 'function') {
          try {
            onUpdate(normalized);
          } catch (err) {
            console.warn('onUpdate callback threw:', err);
          }
        }
      } else {
        // Create new department
        const res = await axios.post('https://insightsconsult-backend.onrender.com/department', payload, {
          headers: { 'Content-Type': 'application/json' },
        });

        const normalized = normalizeApiCreated(res?.data, payload);

        setCreatedDepartment({ name: normalized.name, code: normalized.departmentCode });
        setShowSuccessPopup(true);

        if (typeof onSubmit === 'function') {
          try {
            onSubmit(normalized);
          } catch (err) {
            console.warn('onSubmit callback threw:', err);
          }
        }
      }
    } catch (err) {
      console.error('Error saving department:', err);
      const msg = err?.response?.data?.message || err?.message || 'Something went wrong. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccessPopup(false);
    setCreatedDepartment(null);
    setDeptName('');
    setDeptCode('');
    setSelectedColor('#6366F1');
    setLastMode('add'); // reset
    if (typeof onClose === 'function') onClose();
  };

  const handleAddEmployee = () => {
    setShowSuccessPopup(false);
    setCreatedDepartment(null);
    setDeptName('');
    setDeptCode('');
    setSelectedColor('#6366F1');
    setLastMode('add'); // reset
    if (typeof onClose === 'function') onClose();
    // Open Add Employee flow if needed (parent should handle routing/modal)
  };

  return (
    <>
      {/* Modal (main) */}
      {open && !showSuccessPopup && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white w-[360px] md:w-[470px] p-4 rounded-xl shadow-lg relative">
            <h2 className="text-xl font-semibold">{isEditMode ? 'Edit Department' : 'Add New Department'}</h2>
            <p className="text-gray-500 text-sm mt-1">
              {isEditMode ? 'Modify the department details and save changes.' : 'Set up a new department to manage your employees effectively.'}
            </p>

            {/* Name */}
            <div className="mt-4">
              <input
                type="text"
                placeholder="GST Auditing"
                value={deptName}
                onChange={(e) => setDeptName(e.target.value)}
                className="w-full border-b border-gray-300 p-1 outline-none focus:border-indigo-500"
              />
            </div>

            {/* Code */}
            <div className="mt-4">
              <input
                type="text"
                placeholder="D01"
                value={deptCode}
                onChange={(e) => setDeptCode(e.target.value)}
                className="w-full border-b border-gray-300 p-1 outline-none focus:border-indigo-500"
              />
            </div>

            {/* Label Colors */}
            <div className="mt-5 flex items-center justify-between">
              <p className="text-sm font-medium">Label Colour</p>

              <div className="flex gap-3 mt-2 items-center">
                {presetColors.map((color, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedColor(color)}
                    className="w-5 h-5 rounded-full cursor-pointer flex items-center justify-center"
                    style={{ backgroundColor: color }}
                    role="button"
                    aria-label={`choose color ${color}`}
                  >
                    {selectedColor === color && <Check size={14} className="text-white" strokeWidth={3} />}
                  </div>
                ))}

                <div className="relative">
                  <div
                    className="w-5 h-5 rounded-full cursor-pointer flex items-center justify-center"
                    style={{ backgroundColor: customColor === '#000000' ? '#f3f4f6' : customColor }}
                    role="button"
                    aria-label="Custom color"
                  >
                    <BiSolidPencil className="text-xs" style={{ color: customColor === '#000000' ? '#9ca3af' : '#ffffff' }} />
                  </div>

                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => {
                      setCustomColor(e.target.value);
                      setSelectedColor(e.target.value);
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-5 h-5"
                    aria-label="Choose custom color"
                  />
                </div>
              </div>
            </div>

            {/* Error */}
            {error && <div className="text-sm text-red-500 mt-3">{error}</div>}

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-6">
              <button onClick={() => (typeof onClose === 'function' ? onClose() : null)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg" disabled={loading}>
                Cancel
              </button>

              <button onClick={handleSubmit} className="px-5 btn-primary rounded-md py-2 disabled:opacity-60 flex items-center gap-2" disabled={loading}>
                {loading ? (isEditMode ? 'Updating...' : 'Adding...') : (isEditMode ? 'Update' : 'Add')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Popup */}
      {createdDepartment && (
        <SuccessPopup
          isOpen={showSuccessPopup}
          onClose={handleCloseSuccess}
          departmentName={createdDepartment.name}
          departmentCode={createdDepartment.code}
          mode={lastMode} // use lastMode to decide 'edit' vs 'add'
        />
      )}
    </>
  );
};

export default AddDepartmentModal;
