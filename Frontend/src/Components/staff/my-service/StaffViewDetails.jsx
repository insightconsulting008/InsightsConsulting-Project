import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from "@src/providers/axiosInstance";
import {
  ArrowLeft, Package, Calendar, Clock, CheckCircle, AlertCircle,
  User, File, Image, FileText, FileSpreadsheet, FileArchive,
  FileAudio, FileVideo, Download, Eye, Copy, Printer,
  ExternalLink, DollarSign, Hash, Layers, RefreshCw,
  MessageSquare, HelpCircle, AlertTriangle, Info, Shield,
  Phone, Mail, Building, CreditCard, ChevronRight, ChevronDown,
  ChevronUp, X, Filter, Search, Users, BarChart, TrendingUp,
  Settings, List, Star, Bell, Heart, Check, XCircle, PlayCircle,
  Save, Edit, Trash2, Send, AlertOctagon,
  FileUp, FileClock, FileCheck, FileX, Plus, RotateCcw,
  ChevronLeft, MoreHorizontal, Lock, Upload, Type,
} from 'lucide-react';

// ─── STAFF ID (replace with auth context) ──────────────────────────────────────
const STAFF_ID = 'cmleq58jn0009h71d0o4xaer6';

// ─── DOC STATUS CONFIG ─────────────────────────────────────────────────────────
const DOC_STATUS_CONFIG = {
  PENDING: {
    bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800',
    badge: 'bg-amber-100 text-amber-700', icon: FileClock, iconColor: 'text-amber-500',
    label: 'Awaiting Upload',
  },
  FOR_REVIEW: {
    bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800',
    badge: 'bg-blue-100 text-blue-700', icon: FileUp, iconColor: 'text-blue-500',
    label: 'Uploaded – Review',
  },
  VERIFIED: {
    bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800',
    badge: 'bg-emerald-100 text-emerald-700', icon: FileCheck, iconColor: 'text-emerald-500',
    label: 'Verified',
  },
  REJECTED: {
    bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-800',
    badge: 'bg-rose-100 text-rose-700', icon: FileX, iconColor: 'text-rose-500',
    label: 'Rejected',
  },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

const getStatusConfig = (status) => {
  switch (status) {
    case 'ASSIGNED':   return { color: 'bg-blue-100 text-blue-800 border-blue-200',   icon: <CheckCircle className="w-5 h-5" />, label: 'Assigned' };
    case 'PROCESSING': return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: <RefreshCw className="w-5 h-5" />,   label: 'In Progress' };
    case 'COMPLETED':  return { color: 'bg-green-100 text-green-800 border-green-200',  icon: <CheckCircle className="w-5 h-5" />, label: 'Completed' };
    case 'PENDING':    return { color: 'bg-gray-100 text-gray-800 border-gray-200',     icon: <Clock className="w-5 h-5" />,       label: 'Pending' };
    case 'ERROR':      return { color: 'bg-red-100 text-red-800 border-red-200',        icon: <AlertCircle className="w-5 h-5" />, label: 'Error/Rejected' };
    default:           return { color: 'bg-gray-100 text-gray-800 border-gray-200',     icon: <AlertCircle className="w-5 h-5" />, label: status };
  }
};

const getTrackStepStatusConfig = (status) => {
  switch (status) {
    case 'COMPLETED':  return { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', icon: <CheckCircle className="w-4 h-4 text-emerald-500" />, badge: 'bg-emerald-100 text-emerald-700' };
    case 'PROCESSING': return { bg: 'bg-blue-50',    border: 'border-blue-200',    text: 'text-blue-800',    icon: <PlayCircle  className="w-4 h-4 text-blue-500" />,    badge: 'bg-blue-100 text-blue-700' };
    case 'PENDING':    return { bg: 'bg-gray-50',    border: 'border-gray-200',    text: 'text-gray-700',    icon: <Clock       className="w-4 h-4 text-gray-400" />,    badge: 'bg-gray-100 text-gray-600' };
    case 'ERROR':      return { bg: 'bg-rose-50',    border: 'border-rose-200',    text: 'text-rose-800',    icon: <XCircle     className="w-4 h-4 text-rose-500" />,    badge: 'bg-rose-100 text-rose-700' };
    default:           return { bg: 'bg-gray-50',    border: 'border-gray-200',    text: 'text-gray-700',    icon: <AlertCircle className="w-4 h-4 text-gray-400" />,    badge: 'bg-gray-100 text-gray-600' };
  }
};

const getFileIcon = (url) => {
  if (!url) return <File className="w-4 h-4" />;
  const ext = url.split('.').pop().toLowerCase();
  if (['jpg','jpeg','png','gif','bmp','svg','webp'].includes(ext)) return <Image className="w-4 h-4 text-rose-500" />;
  if (ext === 'pdf') return <FileText className="w-4 h-4 text-red-500" />;
  if (['doc','docx'].includes(ext)) return <FileText className="w-4 h-4 text-blue-500" />;
  if (['xls','xlsx'].includes(ext)) return <FileSpreadsheet className="w-4 h-4 text-green-500" />;
  if (['zip','rar','7z'].includes(ext)) return <FileArchive className="w-4 h-4 text-yellow-500" />;
  if (['mp3','wav','ogg'].includes(ext)) return <FileAudio className="w-4 h-4 text-purple-500" />;
  if (['mp4','avi','mov','mkv'].includes(ext)) return <FileVideo className="w-4 h-4 text-indigo-500" />;
  return <File className="w-4 h-4 text-gray-500" />;
};

const downloadFile = async (url, filename) => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  } catch {
    alert('Failed to download file.');
  }
};

// ─── REQUEST / ISSUE DOCUMENT MODAL ───────────────────────────────────────────
const RequestDocumentModal = ({
  applicationId,
  onClose,
  onSuccess,
  applicationTrackStepId = null,
  periodStepId = null, // Changed from servicePeriodId to periodStepId
  stepTitle = '',
}) => {
  // ── Flow selection: REQUESTED or ISSUED
  const [flow, setFlow]             = useState('REQUESTED');
  const [documentType, setDocumentType] = useState('');
  const [remark, setRemark]         = useState('');
  const [inputType, setInputType]   = useState('FILE');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState('');

  // ── ISSUED-specific state
  const [textValue, setTextValue]   = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver]     = useState(false);
  const fileInputRef                = useRef(null);

  const commonDocTypes = [
    'PAN Card', 'Aadhaar Card', 'Passport', 'Driving Licence',
    'Bank Statement', 'Salary Slip', 'ITR', 'GST Certificate',
    'Company Registration', 'Address Proof', 'Photo ID', 'Staff Note',
    'Approval Letter', 'Other',
  ];

  // Reset issued-specific fields when flow or inputType changes
  useEffect(() => {
    setSelectedFile(null);
    setTextValue('');
    setError('');
  }, [flow, inputType]);

  const handleFileSelect = (file) => {
    if (!file) return;
    setSelectedFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleSubmit = async () => {
    if (!documentType.trim()) {
      setError('Please enter a document type.');
      return;
    }
    if (!applicationTrackStepId && !periodStepId) { // Changed validation
      setError('Document must be associated with a step or service period.');
      return;
    }

    // ISSUED flow validations
    if (flow === 'ISSUED') {
      if (inputType === 'FILE' && !selectedFile) {
        setError('Please select a file to upload.');
        return;
      }
      if (inputType === 'TEXT' && !textValue.trim()) {
        setError('Please enter the text content.');
        return;
      }
    }

    setSubmitting(true);
    setError('');

    try {
      let requestData;

      if (flow === 'REQUESTED') {
        // ── REQUESTED flow: plain JSON
        requestData = {
          flow: 'REQUESTED',
          requestedBy: STAFF_ID,
          documentType: documentType.trim(),
          inputType,
          remark: remark.trim() || undefined,
        };
        if (applicationTrackStepId) requestData.applicationTrackStepId = applicationTrackStepId;
        else if (periodStepId) requestData.periodStepId = periodStepId; // Changed to periodStepId

        const res = await axiosInstance.post('/staff/document', requestData);
        if (!res.data.success) throw new Error(res.data.message || 'Failed to create request.');

      } else {
        // ── ISSUED flow: may need multipart/form-data for FILE uploads
        if (inputType === 'FILE') {
          const formData = new FormData();
          formData.append('flow',         'ISSUED');
          formData.append('issuedBy',     STAFF_ID);
          formData.append('documentType', documentType.trim());
          formData.append('inputType',    'FILE');
          if (remark.trim()) formData.append('remark', remark.trim());
          if (applicationTrackStepId) formData.append('applicationTrackStepId', applicationTrackStepId);
          else if (periodStepId) formData.append('periodStepId', periodStepId); // Changed to periodStepId
          formData.append('file', selectedFile);

          const res = await axiosInstance.post('/staff/document', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          if (!res.data.success) throw new Error(res.data.message || 'Failed to issue document.');

        } else {
          // TEXT issued
          requestData = {
            flow:         'ISSUED',
            issuedBy:     STAFF_ID,
            documentType: documentType.trim(),
            inputType:    'TEXT',
            textValue:    textValue.trim(),
            remark:       remark.trim() || undefined,
          };
          if (applicationTrackStepId) requestData.applicationTrackStepId = applicationTrackStepId;
          else if (periodStepId) requestData.periodStepId = periodStepId; // Changed to periodStepId

          const res = await axiosInstance.post('/staff/document', requestData);
          if (!res.data.success) throw new Error(res.data.message || 'Failed to issue document.');
        }
      }

      alert(flow === 'REQUESTED' ? 'Document request sent successfully!' : 'Document issued successfully!');
      onSuccess();
      onClose();
    } catch (e) {
      console.error('Error submitting document:', e);
      setError(e.response?.data?.message || e.message || 'Operation failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              flow === 'ISSUED' ? 'bg-emerald-100' : 'bg-blue-100'
            }`}>
              {flow === 'ISSUED'
                ? <Upload className="w-5 h-5 text-emerald-600" />
                : <Plus   className="w-5 h-5 text-blue-600" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                {flow === 'ISSUED' ? 'Issue Document' : 'Request Document'}
              </h3>
              <p className="text-xs text-gray-500">
                {stepTitle ? `For: ${stepTitle}` : 'Manage document for this application'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-5">

          {/* ── Flow Selector ── */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Flow Type</label>
            <div className="grid grid-cols-2 gap-3">
              {/* REQUESTED */}
              <button
                type="button"
                onClick={() => setFlow('REQUESTED')}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-left ${
                  flow === 'REQUESTED'
                    ? 'bg-blue-50 border-blue-500 shadow-sm'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/40'
                }`}
              >
                {flow === 'REQUESTED' && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  flow === 'REQUESTED' ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Send className={`w-4 h-4 ${flow === 'REQUESTED' ? 'text-blue-600' : 'text-gray-500'}`} />
                </div>
                <div>
                  <p className={`text-sm font-semibold ${flow === 'REQUESTED' ? 'text-blue-800' : 'text-gray-700'}`}>
                    Request
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">
                    Ask the user to upload a document
                  </p>
                </div>
              </button>

              {/* ISSUED */}
              <button
                type="button"
                onClick={() => setFlow('ISSUED')}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-left ${
                  flow === 'ISSUED'
                    ? 'bg-emerald-50 border-emerald-500 shadow-sm'
                    : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/40'
                }`}
              >
                {flow === 'ISSUED' && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  flow === 'ISSUED' ? 'bg-emerald-100' : 'bg-gray-100'
                }`}>
                  <Upload className={`w-4 h-4 ${flow === 'ISSUED' ? 'text-emerald-600' : 'text-gray-500'}`} />
                </div>
                <div>
                  <p className={`text-sm font-semibold ${flow === 'ISSUED' ? 'text-emerald-800' : 'text-gray-700'}`}>
                    Issue
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">
                    Upload or provide content directly
                  </p>
                </div>
              </button>
            </div>

            {/* Flow description banner */}
            <div className={`mt-3 flex items-start gap-2 px-3 py-2 rounded-lg text-xs ${
              flow === 'ISSUED'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                : 'bg-blue-50 border border-blue-200 text-blue-700'
            }`}>
              <Info className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              {flow === 'ISSUED'
                ? 'You (staff) are directly providing the document or text content on behalf of the application.'
                : 'A notification will be sent to the applicant asking them to upload the specified document.'}
            </div>
          </div>

          {/* ── Common Doc Types ── */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Common Document Types</label>
            <div className="flex flex-wrap gap-1.5">
              {commonDocTypes.map(t => (
                <button
                  key={t}
                  onClick={() => setDocumentType(t === 'Other' ? '' : t)}
                  className={`px-2.5 py-1 text-xs rounded-full border transition-all font-medium ${
                    documentType === t
                      ? flow === 'ISSUED'
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-blue-600 text-white border-blue-600'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-blue-300 hover:text-blue-600'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* ── Document Type ── */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Document Type <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={documentType}
              onChange={e => setDocumentType(e.target.value)}
              placeholder="e.g. PAN Card, Staff Note, Approval Letter…"
              className={`w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:border-transparent ${
                flow === 'ISSUED'
                  ? 'focus:ring-emerald-500'
                  : 'focus:ring-blue-500'
              }`}
            />
          </div>

          {/* ── Input Type ── */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Input Type <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              {[
                { val: 'FILE', icon: <File className="w-4 h-4" />,     label: 'File Upload' },
                { val: 'TEXT', icon: <Type className="w-4 h-4" />,     label: 'Text Input'  },
              ].map(({ val, icon, label }) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setInputType(val)}
                  className={`flex-1 py-2.5 rounded-lg border-2 transition-all flex items-center justify-center gap-2 text-sm font-semibold ${
                    inputType === val
                      ? flow === 'ISSUED'
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-md'
                        : 'bg-blue-600 border-blue-600 text-white shadow-md'
                      : 'border-gray-300 text-gray-700 hover:border-blue-300 hover:text-blue-600'
                  }`}
                >
                  {icon} {label}
                </button>
              ))}
            </div>
          </div>

          {/* ── ISSUED: File or Text Content ── */}
          {flow === 'ISSUED' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                {inputType === 'FILE' ? 'Upload File' : 'Text Content'}{' '}
                <span className="text-red-500">*</span>
              </label>

              {inputType === 'FILE' ? (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={e => handleFileSelect(e.target.files?.[0])}
                    accept="*/*"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    className={`w-full border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all ${
                      dragOver
                        ? 'border-emerald-400 bg-emerald-50'
                        : selectedFile
                          ? 'border-emerald-300 bg-emerald-50/50'
                          : 'border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/30'
                    }`}
                  >
                    {selectedFile ? (
                      <div className="flex items-center gap-3 w-full">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          {getFileIcon(selectedFile.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{selectedFile.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(selectedFile.size)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                          className="p-1.5 hover:bg-red-100 rounded-lg transition-colors flex-shrink-0"
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                          <Upload className="w-5 h-5 text-gray-400" />
                        </div>
                        <p className="text-sm font-semibold text-gray-700">Drop file here or click to browse</p>
                        <p className="text-xs text-gray-400 mt-1">Any file type supported</p>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <textarea
                  value={textValue}
                  onChange={e => setTextValue(e.target.value)}
                  rows={4}
                  placeholder="Enter the text content to be issued (e.g. Service approved manually, reference number, notes)…"
                  className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm resize-none transition-colors"
                />
              )}
            </div>
          )}

          {/* ── Remark / Instruction ── */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              {flow === 'ISSUED' ? 'Remark' : 'Instruction / Remark'}{' '}
              <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={remark}
              onChange={e => setRemark(e.target.value)}
              rows={2}
              placeholder={
                flow === 'ISSUED'
                  ? 'e.g. Approved manually after verification…'
                  : 'e.g. Please upload a clear scanned copy…'
              }
              className={`w-full px-3.5 py-2.5 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:border-transparent ${
                flow === 'ISSUED' ? 'focus:ring-emerald-500' : 'focus:ring-blue-500'
              }`}
            />
          </div>

          {/* ── Error ── */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 pt-0 sticky bottom-0 bg-white rounded-b-2xl">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`flex-1 py-2.5 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm ${
              flow === 'ISSUED'
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {submitting ? (
              <><RefreshCw className="w-4 h-4 animate-spin" /> {flow === 'ISSUED' ? 'Issuing…' : 'Sending…'}</>
            ) : flow === 'ISSUED' ? (
              <><Upload className="w-4 h-4" /> Issue Document</>
            ) : (
              <><Send className="w-4 h-4" /> Send Request</>
            )}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── DOCUMENT REVIEW MODAL ────────────────────────────────────────────────────
const DocumentReviewModal = ({ document: doc, onClose, onSuccess, defaultStatus = '' }) => {
  const [reviewStatus, setReviewStatus] = useState(defaultStatus || doc.status);
  const [reviewRemark, setReviewRemark] = useState(doc.staffRemark || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!reviewStatus) {
      setError('Please select VERIFIED or REJECTED.');
      return;
    }
    if (reviewStatus === 'REJECTED') {
      if (!reviewRemark.trim()) {
        setError('Please provide a rejection reason.');
        return;
      }
      if (reviewRemark.trim().length < 10) {
        setError('Rejection reason must be at least 10 characters.');
        return;
      }
    }

    setSubmitting(true);
    setError('');
    try {
      const requestBody = {
        status: reviewStatus,
        ...(reviewStatus === 'REJECTED' && reviewRemark.trim() ? { remark: reviewRemark.trim() } : {}),
      };
      const response = await axiosInstance.put(`/staff/review-document/${doc.documentId}`, requestBody);
      if (response.data.success) {
        const action = reviewStatus === 'VERIFIED' ? 'verified' : 'rejected';
        alert(`Document successfully ${action}!`);
        onSuccess();
        onClose();
      } else {
        setError(response.data.message || 'Review failed.');
      }
    } catch (e) {
      console.error('Review error:', e);
      setError(e.response?.data?.message || 'Review failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Eye className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Review Document</h3>
              <p className="text-xs text-gray-500">{doc.documentType}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-xs font-semibold text-gray-700 mb-2">Document Details</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Type:</span>
                <span className="text-xs font-medium text-gray-900">{doc.documentType}</span>
              </div>
              {doc.remark && (
                <div className="flex justify-between">
                  <span className="text-xs text-gray-500">Instruction:</span>
                  <span className="text-xs font-medium text-gray-900 italic">"{doc.remark}"</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Input Type:</span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full ${
                  doc.inputType === 'FILE' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                }`}>
                  {doc.inputType === 'FILE' ? <File size={10} /> : <FileText size={10} />}
                  {doc.inputType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">Current Status:</span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full ${
                  doc.status === 'UPLOADED'   ? 'bg-blue-100 text-blue-700' :
                  doc.status === 'VERIFIED'   ? 'bg-emerald-100 text-emerald-700' :
                  doc.status === 'REJECTED'   ? 'bg-rose-100 text-rose-700' :
                                                'bg-amber-100 text-amber-700'
                }`}>
                  {doc.status}
                </span>
              </div>
            </div>

            {(doc.fileUrl || doc.textValue) && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-700 mb-2">Uploaded Content:</p>
                {doc.fileUrl ? (
                  <div className="flex items-center justify-between bg-white p-2 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2">
                      {getFileIcon(doc.fileUrl)}
                      <span className="text-xs font-medium text-gray-900 truncate max-w-[150px]">
                        {doc.fileUrl.split('/').pop()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => window.open(doc.fileUrl, '_blank')} className="p-1 hover:bg-gray-100 rounded" title="View">
                        <Eye className="w-4 h-4 text-gray-500" />
                      </button>
                      <button onClick={() => downloadFile(doc.fileUrl, doc.documentType)} className="p-1 hover:bg-gray-100 rounded" title="Download">
                        <Download className="w-4 h-4 text-blue-500" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <p className="text-xs text-gray-900 whitespace-pre-wrap">{doc.textValue}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Decision <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setReviewStatus('VERIFIED'); setReviewRemark(''); }}
                className={`flex-1 py-2.5 rounded-lg border-2 transition-all flex items-center justify-center gap-2 text-sm font-semibold ${
                  reviewStatus === 'VERIFIED'
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-md'
                    : 'border-gray-300 text-gray-700 hover:border-emerald-300 hover:text-emerald-600'
                }`}
              >
                <CheckCircle className="w-4 h-4" /> Verify
              </button>
              <button
                type="button"
                onClick={() => setReviewStatus('REJECTED')}
                className={`flex-1 py-2.5 rounded-lg border-2 transition-all flex items-center justify-center gap-2 text-sm font-semibold ${
                  reviewStatus === 'REJECTED'
                    ? 'bg-rose-500 border-rose-500 text-white shadow-md'
                    : 'border-gray-300 text-gray-700 hover:border-rose-300 hover:text-rose-600'
                }`}
              >
                <XCircle className="w-4 h-4" /> Reject
              </button>
            </div>
          </div>

          {reviewStatus === 'REJECTED' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={reviewRemark}
                onChange={e => setReviewRemark(e.target.value)}
                rows={3}
                placeholder="Explain why the document is rejected (minimum 10 characters)..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                {reviewRemark.length}/10 characters minimum
                {reviewRemark.length >= 10 && <CheckCircle className="inline ml-1 w-3 h-3 text-emerald-500" />}
              </p>
            </div>
          )}

          {reviewStatus === 'VERIFIED' && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
              <Info className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <p className="text-xs text-emerald-700">Document will be marked as verified. The applicant will be notified.</p>
            </div>
          )}

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg">
              <p className="text-xs text-rose-700 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {error}
              </p>
            </div>
          )}
        </div>

        <div className="flex gap-3 p-6 pt-0">
          <button
            onClick={handleSubmit}
            disabled={submitting || !reviewStatus}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${
              reviewStatus === 'VERIFIED' ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
              : reviewStatus === 'REJECTED' ? 'bg-rose-500 hover:bg-rose-600 text-white'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {submitting
              ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Submitting…</>
              : <><Save className="w-3.5 h-3.5" /> Submit Review</>}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── DOCUMENT MANAGEMENT SECTION ──────────────────────────────────────────────
const DocumentManagementSection = ({ applicationId, onCountChange }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedStepForRequest, setSelectedStepForRequest] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedDocForReview, setSelectedDocForReview] = useState(null);
  const [reviewDefaultStatus, setReviewDefaultStatus] = useState('');
  const [quickActionLoading, setQuickActionLoading] = useState(null);
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    setActionMessage({ type: '', text: '' });
    try {
      const res = await axiosInstance.get(`/application/${applicationId}/documents`);
      if (res.data.success) {
        const docs = res.data.documents || [];
        setDocuments(docs);
        if (onCountChange) {
          onCountChange({
            total:      docs.length,
            pending:    docs.filter(d => d.status === 'PENDING').length,
            uploaded:   docs.filter(d => d.status === 'UPLOADED').length,
            verified:   docs.filter(d => d.status === 'VERIFIED').length,
            rejected:   docs.filter(d => d.status === 'REJECTED').length,
            FOR_REVIEW: docs.filter(d => d.status === 'FOR_REVIEW').length,
          });
        }
      }
    } catch (e) {
      console.error('Error fetching documents:', e);
      setActionMessage({
        type: 'error',
        text: e.response?.data?.message || 'Failed to load documents',
      });
    } finally {
      setLoading(false);
    }
  }, [applicationId, onCountChange]);

  useEffect(() => { fetchDocuments(); }, [fetchDocuments]);

  const handleQuickVerify = async (doc) => {
    setQuickActionLoading(doc.documentId);
    setActionMessage({ type: '', text: '' });
    try {
      const res = await axiosInstance.put(`/staff/review-document/${doc.documentId}`, { status: 'VERIFIED' });
      if (res.data.success) {
        setActionMessage({ type: 'success', text: 'Document verified successfully!' });
        setDocuments(prev => prev.map(d => d.documentId === doc.documentId ? { ...d, status: 'VERIFIED', staffRemark: null } : d));
        fetchDocuments();
        setTimeout(() => setActionMessage({ type: '', text: '' }), 3000);
      } else {
        setActionMessage({ type: 'error', text: res.data.message || 'Verification failed.' });
      }
    } catch (e) {
      setActionMessage({ type: 'error', text: e.response?.data?.message || 'Verification failed.' });
    } finally {
      setQuickActionLoading(null);
    }
  };

  const openReviewModal = (doc, defaultStatus = '') => {
    setSelectedDocForReview(doc);
    setReviewDefaultStatus(defaultStatus);
    setShowReviewModal(true);
  };

  const openRequestModal = (stepInfo = null) => {
    setSelectedStepForRequest(stepInfo);
    setShowRequestModal(true);
  };

  const filteredDocs = activeFilter === 'all'
    ? documents
    : documents.filter(d => d.status === activeFilter);

  const counts = {
    all:        documents.length,
    PENDING:    documents.filter(d => d.status === 'PENDING').length,
    FOR_REVIEW: documents.filter(d => d.status === 'FOR_REVIEW').length,
    VERIFIED:   documents.filter(d => d.status === 'VERIFIED').length,
    REJECTED:   documents.filter(d => d.status === 'REJECTED').length,
  };

  const filters = [
    { key: 'all',        label: 'All',       color: 'bg-gray-100 text-gray-700',      activeColor: 'bg-gray-800 text-white' },
    { key: 'PENDING',    label: 'Awaiting',  color: 'bg-amber-50 text-amber-700',     activeColor: 'bg-amber-500 text-white' },
    { key: 'FOR_REVIEW', label: 'To Review', color: 'bg-blue-50 text-blue-700',       activeColor: 'bg-blue-600 text-white' },
    { key: 'VERIFIED',   label: 'Verified',  color: 'bg-emerald-50 text-emerald-700', activeColor: 'bg-emerald-600 text-white' },
    { key: 'REJECTED',   label: 'Rejected',  color: 'bg-rose-50 text-rose-700',       activeColor: 'bg-rose-600 text-white' },
  ];

  return (
    <>
      {showRequestModal && (
        <RequestDocumentModal
          applicationId={applicationId}
          onClose={() => { setShowRequestModal(false); setSelectedStepForRequest(null); }}
          onSuccess={fetchDocuments}
          applicationTrackStepId={selectedStepForRequest?.applicationTrackStepId}
          periodStepId={selectedStepForRequest?.periodStepId} // Changed from servicePeriodId to periodStepId
          stepTitle={selectedStepForRequest?.title}
        />
      )}

      {showReviewModal && selectedDocForReview && (
        <DocumentReviewModal
          document={selectedDocForReview}
          defaultStatus={reviewDefaultStatus}
          onClose={() => { setShowReviewModal(false); setSelectedDocForReview(null); setReviewDefaultStatus(''); }}
          onSuccess={fetchDocuments}
        />
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Document Requests</h3>
              <p className="text-sm text-gray-500">{documents.length} total</p>
            </div>
          </div>
        </div>

        {actionMessage.text && (
          <div className={`mx-6 mt-2 px-3 py-2 rounded-lg text-xs ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-rose-50 text-rose-700 border border-rose-200'
          }`}>
            {actionMessage.type === 'success'
              ? <CheckCircle className="inline mr-1 w-3 h-3" />
              : <AlertCircle className="inline mr-1 w-3 h-3" />}
            {actionMessage.text}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-gray-100 overflow-x-auto">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeFilter === f.key ? f.activeColor : f.color + ' hover:opacity-80'
              }`}
            >
              {f.label}
              {counts[f.key] > 0 && <span className="ml-1 opacity-75">({counts[f.key]})</span>}
            </button>
          ))}
        </div>

        {/* Document List */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-10 gap-3">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-gray-500 text-sm">Loading documents…</p>
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="text-center py-10">
              <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">
                {activeFilter === 'all' ? 'No document requests yet.' : `No ${activeFilter.toLowerCase()} documents.`}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDocs.map((doc) => {
                const cfg = DOC_STATUS_CONFIG[doc.status] || DOC_STATUS_CONFIG.PENDING;
                const DocIcon = cfg.icon;
                const needsReview = doc.status === 'FOR_REVIEW';
                const isQuickLoading = quickActionLoading === doc.documentId;

                return (
                  <div key={doc.documentId} className={`rounded-xl border ${cfg.border} ${cfg.bg} overflow-hidden transition-all hover:shadow-md`}>
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-white/80 border ${cfg.border}`}>
                          <DocIcon size={16} className={cfg.iconColor} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 text-sm">{doc.documentType}</p>
                              {doc.remark && (
                                <p className="text-xs text-gray-500 mt-0.5 italic">"{doc.remark}"</p>
                              )}
                              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                {doc.inputType && (
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full ${
                                    doc.inputType === 'FILE' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'
                                  }`}>
                                    {doc.inputType === 'FILE' ? <File size={10} /> : <FileText size={10} />}
                                    {doc.inputType}
                                  </span>
                                )}
                                {/* Show ISSUED badge */}
                                {doc.flow === 'ISSUED' && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-emerald-100 text-emerald-700">
                                    <Upload size={10} /> Issued by Staff
                                  </span>
                                )}
                                <span className="text-xs text-gray-400">
                                  Requested: {formatDate(doc.createdAt)}
                                </span>
                                {doc.version > 1 && (
                                  <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded font-medium text-xs">
                                    v{doc.version}
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold flex-shrink-0 ${cfg.badge}`}>
                              {cfg.label}
                            </span>
                          </div>

                          {/* File / text preview */}
                          {(doc.fileUrl || doc.textValue) && (
                            <div className="mt-3 p-3 bg-white/80 rounded-lg border border-gray-200">
                              {doc.fileUrl ? (
                                <div className="flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-2 min-w-0">
                                    {getFileIcon(doc.fileUrl)}
                                    <span className="text-sm font-medium text-gray-900 truncate">
                                      {doc.fileUrl.split('/').pop() || 'Uploaded File'}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1 flex-shrink-0">
                                    <button onClick={() => window.open(doc.fileUrl, '_blank')} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="View">
                                      <Eye className="w-3.5 h-3.5 text-gray-500" />
                                    </button>
                                    <button onClick={() => downloadFile(doc.fileUrl, doc.documentType)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors" title="Download">
                                      <Download className="w-3.5 h-3.5 text-blue-500" />
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <p className="text-xs text-gray-400 mb-1">Text Response:</p>
                                  <p className="text-sm text-gray-900 font-medium">{doc.textValue}</p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Rejection reason */}
                          {doc.status === 'REJECTED' && doc.staffRemark && (
                            <div className="mt-2 px-3 py-2 bg-rose-100 border border-rose-200 rounded-lg">
                              <p className="text-xs font-semibold text-rose-700 mb-0.5">Rejection reason:</p>
                              <p className="text-xs text-rose-600 italic">"{doc.staffRemark}"</p>
                            </div>
                          )}

                          {/* Verified strip */}
                          {doc.status === 'VERIFIED' && (
                            <div className="mt-2 flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                              <p className="text-xs text-emerald-700 font-medium">Document verified by staff</p>
                            </div>
                          )}

                          {/* Review Actions */}
                          {needsReview && (
                            <div className="mt-3 flex gap-2">
                              <button
                                onClick={() => handleQuickVerify(doc)}
                                disabled={isQuickLoading}
                                className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                              >
                                {isQuickLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                                Verify
                              </button>
                              <button
                                onClick={() => openReviewModal(doc, 'REJECTED')}
                                disabled={isQuickLoading}
                                className="flex-1 py-2 bg-rose-500 hover:bg-rose-600 disabled:opacity-60 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                              >
                                <XCircle className="w-3.5 h-3.5" /> Reject
                              </button>
                              <button
                                onClick={() => openReviewModal(doc)}
                                disabled={isQuickLoading}
                                className="px-3 py-2 border border-blue-300 text-blue-600 hover:bg-blue-50 disabled:opacity-60 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}

                          {!needsReview && doc.status !== 'VERIFIED' && doc.status !== 'REJECTED' && (
                            <div className="mt-3 flex gap-2">
                              <button
                                onClick={() => openReviewModal(doc)}
                                className="px-3 py-2 border border-gray-300 text-gray-600 hover:bg-gray-50 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                              >
                                <Eye className="w-3.5 h-3.5" /> View Details
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// ─── SINGLE TRACK STEP ────────────────────────────────────────────────────────
const TrackStepItem = ({ step, isLast, applicationId, isPeriodStep = false, onOpenDocRequest, onOpenStepUpdate }) => {
  const statusConfig = getTrackStepStatusConfig(step.status);
  const isDone  = step.status === 'COMPLETED';
  const isError = step.status === 'ERROR';

  const handleRequestDoc = () => {
    if (isPeriodStep) {
      onOpenDocRequest({ 
        title: step.title, 
        periodStepId: step.periodStepId // Changed from servicePeriodId to periodStepId
      }, true);
    } else {
      onOpenDocRequest({ 
        title: step.title, 
        applicationTrackStepId: step.applicationTrackStepId 
      }, false);
    }
  };

  return (
    <div className="flex gap-2">
      <div className="flex flex-col items-center flex-shrink-0">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
          isDone    ? 'bg-emerald-500 border-emerald-200'
          : isError ? 'bg-rose-500 border-rose-200'
          : step.status === 'PROCESSING' ? 'bg-blue-500 border-blue-200'
          : 'bg-gray-100 border-gray-200'
        }`}>
          {isDone   ? <Check   size={14} className="text-white" />
          : isError  ? <XCircle size={14} className="text-white" />
          : step.status === 'PROCESSING' ? <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          : <span className="text-xs font-bold text-gray-400">{step.order}</span>}
        </div>
        {!isLast && (
          <div className={`w-0.5 flex-1 mt-1 ${isDone ? 'bg-emerald-300' : 'bg-gray-200'}`} style={{ minHeight: 16 }} />
        )}
      </div>

      <div className={`flex-1 mb-2 rounded-lg border p-3 ${statusConfig.bg} ${statusConfig.border}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-gray-500">Step {step.order}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusConfig.badge}`}>
                {step.status}
              </span>
            </div>
            <h5 className={`text-sm font-semibold ${statusConfig.text}`}>{step.title}</h5>
            <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>

            {isError && step.remarks && (
              <div className="mt-2 px-2 py-1 bg-rose-100 border border-rose-200 rounded-lg">
                <p className="text-[10px] font-semibold text-rose-700">Action Required:</p>
                <p className="text-[10px] text-rose-600 italic">"{step.remarks}"</p>
              </div>
            )}

            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={handleRequestDoc}
                className="text-[10px] text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
              >
                <FileText size={10} /> Request Doc
              </button>
              <button
                onClick={() => onOpenStepUpdate(step, isPeriodStep)}
                className="text-[10px] text-gray-600 hover:text-gray-800 font-medium flex items-center gap-1"
              >
                <Edit size={10} /> Update Status
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── SERVICE PERIOD CARD ─────────────────────────────────────────────────────
const ServicePeriodCard = ({ period, isFirst, applicationId, onOpenDocRequest, onOpenStepUpdate }) => {
  const [expanded, setExpanded] = useState(isFirst);
  const pct = period.completionPercent || 0;

  const periodStatusMap = {
    COMPLETED: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700' },
    PROCESSING: { bg: 'bg-blue-50',   border: 'border-blue-200',    text: 'text-blue-700',    badge: 'bg-blue-100 text-blue-700' },
    PENDING:    { bg: 'bg-gray-50',   border: 'border-gray-200',    text: 'text-gray-600',    badge: 'bg-gray-100 text-gray-600' },
    ERROR:      { bg: 'bg-rose-50',   border: 'border-rose-200',    text: 'text-rose-700',    badge: 'bg-rose-100 text-rose-700' },
  };
  const pCfg = periodStatusMap[period.status] || periodStatusMap.PENDING;

  const handleRequestDocumentForPeriod = () => {
    onOpenDocRequest({
      title: period.periodLabel,
      periodStepId: period.servicePeriodId, // Changed from servicePeriodId to periodStepId
      periodLabel: period.periodLabel,
    }, true);
  };

  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${pCfg.border} ${period.isLocked ? 'opacity-70' : ''}`}>
      <button
        className={`w-full flex items-center justify-between p-3 text-left transition-colors ${pCfg.bg} hover:brightness-95`}
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
            period.isLocked ? 'bg-gray-200' : pct === 100 ? 'bg-emerald-100' : 'bg-white/70'
          }`}>
            {period.isLocked
              ? <Lock size={12} className="text-gray-500" />
              : pct === 100 ? <CheckCircle size={12} className="text-emerald-600" />
              : <Calendar size={12} className={pCfg.text} />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm text-gray-900">{period.periodLabel}</span>
              {period.isLocked && (
                <span className="px-1.5 py-0.5 text-[10px] bg-gray-200 text-gray-600 rounded-full font-medium">Locked</span>
              )}
              <span className={`px-1.5 py-0.5 text-[10px] rounded-full font-medium ${pCfg.badge}`}>
                {period.status}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs font-bold text-gray-900">{pct}%</span>
          {expanded ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
        </div>
      </button>

      {expanded && (
        <div className="p-3 bg-white border-t border-gray-100">
          {!period.isLocked && (
            <button
              onClick={handleRequestDocumentForPeriod}
              className="w-full mb-3 px-3 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-xs font-medium text-blue-700 flex items-center justify-center gap-2 transition-colors"
            >
              <Plus size={12} /> Request / Issue Document for this Period
            </button>
          )}

          {period.periodStep && period.periodStep.length > 0 && (
            <div className="space-y-1">
              {[...period.periodStep]
                .sort((a, b) => a.order - b.order)
                .map((step, i, arr) => (
                  <TrackStepItem
                    key={step.periodStepId}
                    step={{ ...step, periodStepId: step.periodStepId }}
                    isLast={i === arr.length - 1}
                    applicationId={applicationId}
                    isPeriodStep={true}
                    onOpenDocRequest={onOpenDocRequest}
                    onOpenStepUpdate={onOpenStepUpdate}
                  />
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── TRACK STEPS ─────────────────────────────────────────────────────────────
const TrackSteps = ({ application, onOpenDocRequest, onOpenStepUpdate }) => {
  if (!application) return null;

  const hasApplicationTrackSteps = application.applicationTrackStep?.length > 0;
  const hasServicePeriods        = application.servicePeriod?.length > 0;

  const appSteps = [...(application.applicationTrackStep || [])].sort((a, b) => a.order - b.order);
  const appDone  = appSteps.filter(s => s.status === 'COMPLETED').length;
  const appPct   = appSteps.length ? Math.round((appDone / appSteps.length) * 100) : 0;

  const periodDone  = (application.servicePeriod || []).filter(p => p.status === 'COMPLETED').length;
  const periodTotal = (application.servicePeriod || []).length;
  const periodPct   = periodTotal ? Math.round((periodDone / periodTotal) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-xl p-3">
        <div className="flex justify-between mb-1">
          <span className="text-xs font-semibold text-gray-700">Progress</span>
          <span className="text-xs font-bold text-blue-600">
            {hasServicePeriods ? periodPct : appPct}%
          </span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all"
            style={{ width: `${hasServicePeriods ? periodPct : appPct}%` }}
          />
        </div>
      </div>

      {hasApplicationTrackSteps && (
        <div className="space-y-1">
          <h4 className="text-xs font-semibold text-gray-500 mb-2">Application Progress Steps</h4>
          {appSteps.map((step, idx) => (
            <TrackStepItem
              key={step.applicationTrackStepId}
              step={step}
              isLast={idx === appSteps.length - 1}
              applicationId={application.applicationId}
              isPeriodStep={false}
              onOpenDocRequest={onOpenDocRequest}
              onOpenStepUpdate={onOpenStepUpdate}
            />
          ))}
        </div>
      )}

      {hasServicePeriods && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-gray-500 mb-2">Service Periods</h4>
          {[...application.servicePeriod]
            .sort((a, b) => new Date(a.startDate || 0) - new Date(b.startDate || 0))
            .map((period, i) => (
              <ServicePeriodCard
                key={period.servicePeriodId}
                period={period}
                isFirst={i === 0}
                applicationId={application.applicationId}
                onOpenDocRequest={onOpenDocRequest}
                onOpenStepUpdate={onOpenStepUpdate}
              />
            ))}
        </div>
      )}

      {!hasApplicationTrackSteps && !hasServicePeriods && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
          No tracking data available
        </div>
      )}
    </div>
  );
};

// ─── STEP UPDATE MODAL ────────────────────────────────────────────────────────
const StepUpdateModal = ({ step, isPeriodStep, onClose, onSuccess }) => {
  const [updateStatus, setUpdateStatus] = useState(step.status);
  const [remarks, setRemarks]           = useState(step.remarks || '');
  const [description, setDescription]   = useState(step.description || '');
  const [submitting, setSubmitting]     = useState(false);
  const [error, setError]               = useState('');

  const handleSubmit = async () => {
    if (!updateStatus) { setError('Please select a status'); return; }
    if (updateStatus === 'ERROR' && !remarks.trim()) { setError('Please provide remarks for ERROR status'); return; }

    setSubmitting(true);
    setError('');
    try {
      const updateData = {
        applicationTrackStepId: !isPeriodStep ? step.applicationTrackStepId : undefined,
        periodStepId:            isPeriodStep  ? step.periodStepId           : undefined,
        description: description || `Status updated to ${updateStatus}`,
        updatedBy: STAFF_ID,
        remarks: updateStatus === 'COMPLETED' ? null : remarks.trim() || null,
        status: updateStatus,
      };
      const response = await axiosInstance.put('/staff/update/step', updateData);
      if (response.data.success) {
        alert('Step status updated successfully!');
        onSuccess();
        onClose();
      } else throw new Error(response.data.message || 'Failed to update status');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update status. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Edit className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Update Step Status</h3>
              <p className="text-xs text-gray-500">{step.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              value={updateStatus}
              onChange={e => setUpdateStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              <option value="">Select Status</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="COMPLETED">Completed</option>
              <option value="ERROR">Error/Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Description <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={2}
              placeholder="Enter description..."
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm resize-none"
            />
          </div>

          {updateStatus === 'ERROR' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Remarks <span className="text-red-500">* (required for Error)</span>
              </label>
              <textarea
                value={remarks}
                onChange={e => setRemarks(e.target.value)}
                rows={3}
                placeholder="Enter reason for rejection..."
                className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-sm resize-none"
              />
            </div>
          )}

          {updateStatus === 'COMPLETED' && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <p className="text-xs text-blue-700">Remarks will be cleared for COMPLETED status.</p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
              <p className="text-sm text-rose-700">{error}</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 p-6 pt-0">
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
          >
            {submitting
              ? <><RefreshCw className="w-4 h-4 animate-spin" /> Updating…</>
              : <><Save className="w-4 h-4" /> Update Status</>}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── MAIN VIEWDETAILS COMPONENT ───────────────────────────────────────────────
export default function ViewDetails() {
  const { applicationId } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [docCounts, setDocCounts]     = useState({ total: 0, pending: 0, uploaded: 0, verified: 0, rejected: 0, FOR_REVIEW: 0 });

  const [showDocRequestModal,       setShowDocRequestModal]       = useState(false);
  const [selectedStepForDocRequest, setSelectedStepForDocRequest] = useState(null);
  const [showStepUpdateModal,       setShowStepUpdateModal]       = useState(false);
  const [selectedStepForUpdate,     setSelectedStepForUpdate]     = useState(null);
  const [selectedStepIsPeriod,      setSelectedStepIsPeriod]      = useState(false);

  useEffect(() => {
    if (applicationId) fetchApplicationDetails();
  }, [applicationId]);

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(`staff/${STAFF_ID}/application/${applicationId}`);
      if (response.data.success) setApplication(response.data.application);
      else setError('Failed to load application details');
    } catch (err) {
      console.error('Error fetching application:', err);
      setError(err.response?.data?.message || 'Failed to load application details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDocRequest = (stepOrPeriod, isPeriodStep) => {
    if (stepOrPeriod.periodStepId && !stepOrPeriod.applicationTrackStepId) {
      setSelectedStepForDocRequest({
        title: stepOrPeriod.title || stepOrPeriod.periodLabel,
        periodStepId: stepOrPeriod.periodStepId,
        periodLabel: stepOrPeriod.periodLabel,
      });
    } else {
      if (isPeriodStep) {
        setSelectedStepForDocRequest({
          title: stepOrPeriod.title,
          periodStepId: stepOrPeriod.periodStepId,
        });
      } else {
        setSelectedStepForDocRequest({
          title: stepOrPeriod.title,
          applicationTrackStepId: stepOrPeriod.applicationTrackStepId,
        });
      }
    }
    setShowDocRequestModal(true);
  };

  const handleOpenStepUpdate = (step, isPeriodStep) => {
    setSelectedStepForUpdate(step);
    setSelectedStepIsPeriod(isPeriodStep);
    setShowStepUpdateModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-3 text-sm text-gray-600">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-900 mb-1">Error</h2>
          <p className="text-sm text-gray-600 mb-4">{error || 'Application not found'}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Global Modals */}
      {showDocRequestModal && selectedStepForDocRequest && (
        <RequestDocumentModal
          applicationId={application.applicationId}
          onClose={() => { setShowDocRequestModal(false); setSelectedStepForDocRequest(null); }}
          onSuccess={fetchApplicationDetails}
          applicationTrackStepId={selectedStepForDocRequest.applicationTrackStepId}
          periodStepId={selectedStepForDocRequest.periodStepId} // Changed from servicePeriodId to periodStepId
          stepTitle={selectedStepForDocRequest.title}
        />
      )}

      {showStepUpdateModal && selectedStepForUpdate && (
        <StepUpdateModal
          step={selectedStepForUpdate}
          isPeriodStep={selectedStepIsPeriod}
          onClose={() => { setShowStepUpdateModal(false); setSelectedStepForUpdate(null); setSelectedStepIsPeriod(false); }}
          onSuccess={fetchApplicationDetails}
        />
      )}

      {/* Sticky Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                title="Go back"
              >
                <ArrowLeft className="w-4 h-4 text-gray-600" />
              </button>
              <div>
                <h1 className="text-base font-semibold text-gray-900">Application Details</h1>
                <p className="text-xs text-gray-500">ID: {application.applicationId?.slice(0, 8)}…</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {docCounts.FOR_REVIEW > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 border border-blue-200 rounded-full">
                  <Bell className="w-3 h-3 text-blue-500" />
                  <span className="text-[10px] font-medium text-blue-700">
                    {docCounts.FOR_REVIEW} to review
                  </span>
                </div>
              )}
              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium border ${getStatusConfig(application.status).color}`}>
                {getStatusConfig(application.status).icon}
                <span>{getStatusConfig(application.status).label}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Left Column */}
          <div className="lg:col-span-2 space-y-4">

            {/* Service Info */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-4">
                <h2 className="text-base font-semibold text-gray-900 mb-2">{application.service?.name}</h2>
                <p className="text-xs text-gray-600 mb-3">{application.service?.description}</p>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div><span className="text-gray-500">Service ID:</span> <span className="font-medium">{application.serviceId}</span></div>
                  <div><span className="text-gray-500">Created:</span> <span className="font-medium">{formatDate(application.createdAt)}</span></div>
                </div>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-medium ${
                    application.service?.serviceType === 'RECURRING'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {application.service?.serviceType === 'RECURRING' ? 'Recurring Service' : 'One-time Service'}
                  </span>
                </div>
              </div>
            </div>

            {/* Document Management */}
            <DocumentManagementSection
              applicationId={application.applicationId}
              onCountChange={setDocCounts}
            />

            {/* Track Steps */}
            {((application.applicationTrackStep?.length > 0) || (application.servicePeriod?.length > 0)) && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-900">Application Progress</h3>
                </div>
                <div className="p-4">
                  <TrackSteps
                    application={application}
                    onOpenDocRequest={handleOpenDocRequest}
                    onOpenStepUpdate={handleOpenStepUpdate}
                  />
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}