import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Plus, Users, X, Upload, ChevronDown } from 'lucide-react';
import { FaUsers } from 'react-icons/fa';

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
          className="absolute top-36 md:right-[50%] right-[45%] text-white/80 hover:text-white bg-white/30 p-3 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const SuccessPopup = ({ isOpen, onClose, employeeData, departmentData }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 z-[60]  flex items-center justify-center p-4">
      <div className="bg-white  w-[360px] md:w-[460px] rounded-2xl shadow-2xl  transform transition-all">
        <div className="btn-primary px-6 py-4 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center overflow-hidden">
              {employeeData.photoUrl ? (
                <img src={employeeData.photoUrl} alt={employeeData.name} className="w-full h-full object-cover" />
              ) : (
                <Users className="w-6 h-6 text-indigo-600" />
              )}
            </div>
            <div className="flex-1 text-white">
              <h3 className="font-semibold text-lg">{employeeData.name}</h3>
              <p className="text-sm text-indigo-100">{employeeData.employeeId} | {employeeData.designation}</p>
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

          <h2 className="text-xl font-bold text-gray-900 mb-2">'{employeeData.name} | {employeeData.employeeId}'</h2>
          <p className="text-gray-700 mb-1">has been added to the '{departmentData?.label}' team.</p>
          <p className="text-sm text-gray-500">You can now view this employee under the assigned department.</p>
        </div>

        <button
          onClick={onClose}
          className="absolute top-36 md:right-[50%]  right-[45%] text-white/80 hover:text-white bg-white/30 p-3  rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const AddEmployeeModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    department: '',
    status: 'Active',
    name: '',
    employeeId: '',
    email: '',
    mobile: '',
    designation: '',
    photoUrl: '',
    password: ''
  });

  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const containerRef = useRef(null);

  useEffect(() => { if (isOpen) fetchDepartments(); }, [isOpen]);

  useEffect(() => {
    if (departments.length > 0 && !formData.department) {
      setFormData(prev => ({ ...prev, department: departments[0].id }));
    }
  }, [departments]);

  useEffect(() => {
    const onClick = (e) => { if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  async function fetchDepartments() {
    setLoading(true);
    try {
      const res = await axios.get('https://insightsconsult-backend.onrender.com/department');
      const json = res.data;
      console.log()
      const raw = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
      const normalized = raw.map((d, i) => ({
        id: d._id ?? d.departmentId ?? d.id ?? String(i),
        label: d.label ?? d.name ?? d.title ?? d.departmentCode ?? 'Unnamed Dept',
        labelColor: d.labelColor ?? d.color ?? '#D1D5DB',
        raw: d
      }));
      setDepartments(normalized);
    } catch (err) {
      console.error('fetchDepartments error', err);
      setDepartments([]);
    } finally {
      setLoading(false);
    }
  }

  const getSelectedDepartment = () => departments.find(d => d.id === formData.department) ?? null;
  const handleSelect = (id) => { setFormData(prev => ({ ...prev, department: id })); setOpen(false); };

  async function postEmployee(payload) {
    try {
      const res = await axios.post('https://insightsconsult-backend.onrender.com/employee', payload, {
        headers: { 'Content-Type': 'application/json' }
      });
      return { ok: true, status: res.status, body: res.data };
    } catch (err) {
      const resp = err.response;
      return { ok: false, status: resp?.status ?? 500, body: resp?.data ?? { error: err.message } };
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.mobile || !formData.designation || !formData.password) {
      setErrorMessage('Please fill required fields: Name, Email, Mobile, Designation, Password');
      setShowError(true);
      return;
    }

    const selected = getSelectedDepartment();
    const departmentId = selected?.raw?.departmentId ?? selected?.raw?._id ?? selected?.id ?? null;
    if (!departmentId) {
      setErrorMessage('Please select a valid department');
      setShowError(true);
      return;
    }

    setSubmitting(true);

    const payload = {
      ...(formData.employeeId ? { employeeId: formData.employeeId } : {}),
      name: formData.name,
      email: formData.email,
      mobileNumber: formData.mobile,
      role: 'STAFF',
      designation: formData.designation,
      status: (formData.status ?? 'Active').toUpperCase(),
      photoUrl: formData.photoUrl || '',
      departmentId,
      password: formData.password
    };

    try {
      const res = await postEmployee(payload);
      if (res.ok) {
        showSuccessPopup(selected);
        return;
      }
      setErrorMessage(res.body?.message ?? res.body?.error ?? `Failed to add employee (status ${res.status})`);
      setShowError(true);
    } catch (err) {
      console.error('submit error', err);
      setErrorMessage('Network error. Please try again.');
      setShowError(true);
    } finally {
      setSubmitting(false);
    }
  };

  function showSuccessPopup(departmentData) {
    setSuccessData({ employee: { ...formData }, department: departmentData });
    setShowSuccess(true);
  }

  function handleSuccessClose() {
    setShowSuccess(false);
    resetAndClose();
  }

  function handleErrorClose() {
    setShowError(false);
    setErrorMessage('');
  }

  function resetAndClose() {
    setFormData({
      department: departments.length > 0 ? departments[0].id : '',
      status: 'Active',
      name: '',
      employeeId: '',
      email: '',
      mobile: '',
      designation: '',
      photoUrl: '',
      password: ''
    });
    onClose();
  }

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 bg-opacity-50 z-50 flex justify-end">
        <div className={`bg-white shadow-xl w-full max-w-md h-full overflow-y-auto transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className=" p-6 btn-primary flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8  bg-opacity-20 rounded-full flex items-center justify-center">
                <FaUsers className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-semibold">Adding New Employee</h2>
            </div>
            <button onClick={onClose} className="hover:bg-white/10 rounded-full p-1 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                <Users className="w-10 h-10 text-gray-400" />
              </div>
              <button type="button" className="flex items-center gap-2 btn-primary  text-white rounded-lg text-sm hover:from-indigo-700 hover:to-indigo-800 transition-all">
                <Upload className="w-4 h-4" />
                Upload Photo
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Department</label>
              <div ref={containerRef} className="relative">
                <select value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className="hidden" aria-hidden>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                </select>

                <button
                  type="button"
                  onClick={() => setOpen(s => !s)}
                  aria-haspopup="listbox"
                  aria-expanded={open}
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

                {open && (
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
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Password <span className="text-red-500">*</span></label>
              <input type="password" placeholder="Enter password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" required />
              <p className="text-xs text-gray-500 mt-1">Password is now required.</p>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="submit" disabled={submitting} className="flex-1 btn-primary text-white  rounded-lg font-medium hover:from-indigo-700 hover:to-indigo-800 transition-all disabled:opacity-60">{submitting ? 'Adding...' : 'Add Employee'}</button>
              <button type="button" onClick={onClose} disabled={submitting} className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-60">Cancel</button>
            </div>
          </form>
        </div>
      </div>

      {showSuccess && successData && (
        <SuccessPopup isOpen={showSuccess} onClose={handleSuccessClose} employeeData={successData.employee} departmentData={successData.department} />
      )}

      {showError && (
        <ErrorPopup isOpen={showError} onClose={handleErrorClose} errorMessage={errorMessage} />
      )}
    </>
  );
};

export default AddEmployeeModal;
