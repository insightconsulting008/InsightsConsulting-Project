// AddDepartmentModal.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { X, Check } from 'lucide-react';
import { BiSolidPencil } from 'react-icons/bi';

/* ================= SUCCESS POPUP ================= */
const SuccessPopup = ({ isOpen, onClose, departmentName, departmentCode, mode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-2xl shadow-2xl w-[350px] md:w-[450px] relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute -top-20 right-[45%] bg-gray-700 hover:bg-gray-800 text-white rounded-full p-3 shadow-lg"
        >
          <X size={20} />
        </button>

        <div className="text-center px-6 pb-6">
          <div className="flex justify-center py-3">
            <img
              src="https://ik.imagekit.io/vqdzxla6k/insights%20consultancy%20/Frame%202147225819.png"
              className="w-20"
              alt=""
            />
          </div>

          <h2 className="text-lg font-bold text-gray-800 mb-2">
            '{departmentName} | {departmentCode}'
          </h2>

          <p className="text-gray-700 font-medium mb-1">
            Department {mode === 'edit' ? 'updated' : 'created'} successfully
          </p>

          <p className="text-gray-500 text-sm">
            You can now add employees under this team.
          </p>
        </div>
      </div>
    </div>
  );
};

/* ================= MAIN MODAL ================= */
const presetColors = ['#EF4444', '#10B981', '#3B82F6'];

const AddDepartmentModal = ({ open, onClose, onSubmit, onUpdate, initialData = null }) => {
  const [deptName, setDeptName] = useState('');
  const [deptCode, setDeptCode] = useState('');
  const [selectedColor, setSelectedColor] = useState('#6366F1');
  const [customColor, setCustomColor] = useState('#000000');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [createdDepartment, setCreatedDepartment] = useState(null);
  const [lastMode, setLastMode] = useState('add');

  const isEditMode = Boolean(initialData && Object.keys(initialData).length);

  /* ===== PREFILL FORM ===== */
  useEffect(() => {
    if (!open) return;

    if (isEditMode) {
      setDeptName(initialData.name || initialData.departmentName || '');
      setDeptCode(initialData.departmentCode || initialData.code || '');
      setSelectedColor(initialData.labelColor || '#6366F1');
    } else {
      setDeptName('');
      setDeptCode('');
      setSelectedColor('#6366F1');
    }

    setError('');
    setShowSuccessPopup(false);
    setCreatedDepartment(null);
  }, [open, initialData, isEditMode]);

  if (!open && !showSuccessPopup) return null;

  /* ===== NORMALIZE API RESPONSE ===== */
  const normalize = (apiData, fallback) => {
    const d = apiData?.data ?? apiData ?? {};
    return {
      departmentId: d.departmentId || d._id || d.id || fallback?.departmentId,
      name: d.name || fallback?.name,
      departmentCode: d.departmentCode || d.code || fallback?.departmentCode,
      labelColor: d.labelColor || fallback?.labelColor,
    };
  };

  /* ===== SUBMIT HANDLER ===== */
  const handleSubmit = async () => {
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
    setError('');

    try {
      if (isEditMode) {
        setLastMode('edit');
        const id = initialData.departmentId || initialData._id || initialData.id;

        const res = await axios.put(
          `https://insightsconsult-backend.onrender.com/department/${id}`,
          payload,
          { headers: { 'Content-Type': 'application/json' } }
        );

        const normalized = normalize(res.data, { ...payload, departmentId: id });
        setCreatedDepartment(normalized);
         onUpdate?.();
        setShowSuccessPopup(true);
        

       
      } else {
        setLastMode('add');
        const res = await axios.post(
          'https://insightsconsult-backend.onrender.com/department',
          payload,
          { headers: { 'Content-Type': 'application/json' } }
        );

        const normalized = normalize(res.data, payload);
        setCreatedDepartment(normalized);
          
        setShowSuccessPopup(true);
     
      
        

       
      
        
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  /* ===== CLOSE SUCCESS ===== */
const handleCloseSuccess = async () => {
  setShowSuccessPopup(false);
  setCreatedDepartment(null);

  if (lastMode === 'edit') {
    await onUpdate?.();
  } else {
    await onSubmit?.();
  }

  onClose?.(); // close modal LAST
};



  return (
    <>
      {/* ===== FORM MODAL ===== */}
      {open && !showSuccessPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[360px] md:w-[470px] p-5 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold">
              {isEditMode ? 'Edit Department' : 'Add New Department'}
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              {isEditMode
                ? 'Modify the department details and save changes.'
                : 'Set up a new department to manage your employees.'}
            </p>

            <input
              className="w-full border-b mt-5 p-1 outline-none"
              placeholder="GST Auditing"
              value={deptName}
              onChange={(e) => setDeptName(e.target.value)}
            />

            <input
              className="w-full border-b mt-4 p-1 outline-none"
              placeholder="D01"
              value={deptCode}
              onChange={(e) => setDeptCode(e.target.value)}
            />

            {/* COLOR PICKER */}
            <div className="flex justify-between items-center mt-5">
              <p className="text-sm font-medium">Label Colour</p>

              <div className="flex gap-3 items-center">
                {presetColors.map((c) => (
                  <div
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className="w-5 h-5 rounded-full cursor-pointer flex items-center justify-center"
                    style={{ backgroundColor: c }}
                  >
                    {selectedColor === c && <Check size={14} className="text-white" />}
                  </div>
                ))}

                <div className="relative">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: customColor }}
                  >
                    <BiSolidPencil className="text-white text-xs" />
                  </div>

                  <input
                    type="color"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    value={customColor}
                    onChange={(e) => {
                      setCustomColor(e.target.value);
                      setSelectedColor(e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mt-3">{error}</p>}

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={onClose} className="px-4 py-2 text-gray-600">
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary px-5 py-2 rounded-md disabled:opacity-60"
              >
                {loading ? 'Saving...' : isEditMode ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== SUCCESS POPUP ===== */}
      {createdDepartment && (
        <SuccessPopup
          isOpen={showSuccessPopup}
          onClose={handleCloseSuccess}
          departmentName={createdDepartment.name}
          departmentCode={createdDepartment.departmentCode}
          onSubmit
          mode={lastMode}
        />
      )}
    </>
  );
};

export default AddDepartmentModal;
