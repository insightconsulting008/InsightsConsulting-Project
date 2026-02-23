import React, { useEffect, useState, useCallback, useRef } from 'react';
import axiosInstance from '@src/providers/axiosInstance';
import {
  Clock, Calendar, FileText, CheckCircle, X, Search, Filter,
  ChevronRight as ChevronRightIcon, Play, Check, Package,
  TrendingUp, Eye, BarChart, Zap, Layers, Headphones,
  MessageSquare, Phone, HelpCircle, DollarSign,
  Upload, AlertCircle as AlertCircleIcon, File, MoreHorizontal,
  ChevronLeft, RefreshCw, XCircle, AlertTriangle,
  Lock, ChevronDown, ChevronUp, Download,
  Image, FileSpreadsheet, FileClock, FileCheck, FileX,
  Bell, Info, Activity, Briefcase,
  CheckCircle2, MessageCircle, ClipboardList,
  IndianRupee, ShieldCheck, Paperclip, Type, ArrowRight,
  Eye as EyeIcon, FileUp, RotateCcw, CircleAlert, Star,
} from 'lucide-react';

// ─── DATA CONFIGS ──────────────────────────────────────────────────────────────
const DOC_STATUS = {
  PENDING:  { label: 'Awaiting Upload',  badge: 'bg-amber-100 text-amber-800 border-amber-300',  icon: FileClock,  iconBg: 'bg-amber-100', iconColor: 'text-amber-600', bar: 'bg-amber-400',  border: 'border-amber-200', sectionBg: 'bg-amber-50' },
  UPLOADED: { label: 'Under Review',     badge: 'bg-sky-100 text-sky-800 border-sky-300',        icon: FileUp,     iconBg: 'bg-sky-100',   iconColor: 'text-sky-600',   bar: 'bg-sky-400',    border: 'border-sky-200',   sectionBg: 'bg-sky-50'   },
  VERIFIED: { label: 'Verified ✓',       badge: 'bg-emerald-100 text-emerald-800 border-emerald-300', icon: FileCheck, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', bar: 'bg-emerald-500', border: 'border-emerald-200', sectionBg: 'bg-emerald-50' },
  REJECTED: { label: 'Rejected',         badge: 'bg-rose-100 text-rose-800 border-rose-300',     icon: FileX,      iconBg: 'bg-rose-100',  iconColor: 'text-rose-600',  bar: 'bg-rose-500',   border: 'border-rose-200',  sectionBg: 'bg-rose-50'  },
};

const SVC_STATUS = {
  NOT_STARTED: { dot: 'bg-slate-400', text: 'text-slate-700', bg: 'bg-slate-100', label: 'Not Started', Icon: Clock },
  IN_PROGRESS: { dot: 'bg-blue-500',  text: 'text-blue-700',  bg: 'bg-blue-100',  label: 'In Progress', Icon: Activity },
  COMPLETED:   { dot: 'bg-emerald-500',text:'text-emerald-700',bg: 'bg-emerald-100',label:'Completed',   Icon: CheckCircle },
  CANCELLED:   { dot: 'bg-rose-500',  text: 'text-rose-700',  bg: 'bg-rose-100',  label: 'Cancelled',   Icon: X },
  ON_HOLD:     { dot: 'bg-orange-500',text: 'text-orange-700',bg: 'bg-orange-100', label: 'On Hold',     Icon: AlertTriangle },
};

const STEP_STATUS = {
  COMPLETED:  { ring: 'bg-emerald-500 ring-2 ring-emerald-200', connLine: 'bg-emerald-200', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', label: 'Done' },
  PROCESSING: { ring: 'bg-blue-500 ring-2 ring-blue-200',       connLine: 'bg-gray-200',    badge: 'bg-blue-100 text-blue-700 border-blue-200',         label: 'In Progress' },
  IN_PROGRESS:{ ring: 'bg-blue-500 ring-2 ring-blue-200',       connLine: 'bg-gray-200',    badge: 'bg-blue-100 text-blue-700 border-blue-200',         label: 'In Progress' },
  ERROR:      { ring: 'bg-rose-500 ring-2 ring-rose-200',       connLine: 'bg-gray-200',    badge: 'bg-rose-100 text-rose-700 border-rose-200',         label: 'Action Needed' },
  PENDING:    { ring: 'bg-gray-200 border-2 border-gray-300',   connLine: 'bg-gray-100',    badge: 'bg-gray-100 text-gray-500 border-gray-200',         label: 'Pending' },
};

// ─── HELPERS ────────────────────────────────────────────────────────────────
const fmtDate  = (d, full) => !d ? '—' : new Date(d).toLocaleDateString('en-IN', full
  ? { weekday:'short', day:'numeric', month:'short', year:'numeric' }
  : { day:'numeric', month:'short', year:'numeric' });
const fmtMoney = v => `₹${parseInt(v || 0).toLocaleString('en-IN')}`;
const getFileExt = url => url?.split('.').pop()?.toLowerCase() || '';
const FileIcon = ({ url }) => {
  const ext = getFileExt(url);
  if (['jpg','jpeg','png','gif','webp','svg'].includes(ext)) return <Image size={13} className="text-rose-400" />;
  if (ext === 'pdf') return <FileText size={13} className="text-red-500" />;
  if (['doc','docx'].includes(ext)) return <FileText size={13} className="text-blue-500" />;
  if (['xls','xlsx'].includes(ext)) return <FileSpreadsheet size={13} className="text-green-500" />;
  return <File size={13} className="text-gray-400" />;
};

// ─── ATOMS ──────────────────────────────────────────────────────────────────
const SvcBadge = ({ status }) => {
  const c = SVC_STATUS[status] || SVC_STATUS.NOT_STARTED;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
};

const TypeTag = ({ type }) => type === 'RECURRING'
  ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-teal-100 text-teal-700 border border-teal-200"><RefreshCw size={9}/> Subscription</span>
  : <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-violet-100 text-violet-700 border border-violet-200"><Zap size={9}/> One-Time</span>;

const SectionHeading = ({ icon: Icon, label, count, accent }) => (
  <div className={`flex items-center gap-2 px-4 py-2.5 border-b border-gray-100 ${accent || 'bg-gray-50'}`}>
    <Icon size={13} className="text-gray-400" />
    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">{label}</span>
    {count !== undefined && <span className="ml-auto text-[11px] font-bold text-gray-400">{count}</span>}
  </div>
);

// ─── DOCUMENT UPLOAD MODAL ────────────────────────────────────────────────────
const DocUploadModal = ({ doc, onClose, onSuccess }) => {
  const [file, setFile]   = useState(null);
  const [text, setText]   = useState('');
  const [busy, setBusy]   = useState(false);
  const [err,  setErr]    = useState('');
  const isText = doc.inputType === 'TEXT';

  const submit = async () => {
    if (!isText && !file) { setErr('Please select a file'); return; }
    if (isText && !text.trim()) { setErr('Please enter a response'); return; }
    setBusy(true); setErr('');
    try {
      let r;
      if (!isText) {
        const fd = new FormData();
        fd.append('file', file);
        r = await axiosInstance.put(`/user/upload-document/${doc.documentId}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        r = await axiosInstance.put(`/user/upload-document/${doc.documentId}`, { fileUrl: null, textValue: text.trim() });
      }
      if (r.data.success) { onSuccess(); onClose(); } else setErr(r.data.message || 'Upload failed');
    } catch (e) { setErr(e.response?.data?.message || 'Upload failed. Please try again.'); }
    finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-start gap-3 p-5 border-b border-gray-100">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isText ? 'bg-teal-100' : 'bg-violet-100'}`}>
            {isText ? <Type size={18} className="text-teal-600" /> : <Paperclip size={18} className="text-violet-600" />}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 text-sm leading-tight">{doc.documentType}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{isText ? 'Type your response below' : 'Select a file to upload'}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 flex-shrink-0"><X size={16}/></button>
        </div>

        {/* Rejection reason — show prominently if re-uploading */}
        {doc.status === 'REJECTED' && doc.staffRemark && (
          <div className="mx-5 mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl">
            <p className="text-[11px] font-bold text-rose-700 flex items-center gap-1.5 mb-1"><CircleAlert size={11}/> Why it was rejected</p>
            <p className="text-xs text-rose-700 leading-relaxed">"{doc.staffRemark}"</p>
          </div>
        )}

        <div className="p-5 space-y-4">
          {!isText ? (
            <label className="cursor-pointer block">
              <input type="file" className="hidden" onChange={e => setFile(e.target.files?.[0])} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx" />
              <div className={`flex flex-col items-center gap-2 py-8 border-2 border-dashed rounded-xl transition-all ${file ? 'border-emerald-300 bg-emerald-50' : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50/30'}`}>
                {file
                  ? <><FileCheck size={32} className="text-emerald-500"/><p className="text-sm font-semibold text-emerald-700">{file.name}</p><p className="text-xs text-gray-400">{(file.size/1024).toFixed(1)} KB · Click to change</p></>
                  : <><Upload size={32} className="text-gray-300"/><p className="text-sm font-semibold text-gray-500">Tap to browse files</p><p className="text-xs text-gray-400">PDF, JPG, PNG, DOC, XLS — max 10 MB</p></>
                }
              </div>
            </label>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Your Response</label>
              <textarea rows={5} value={text} onChange={e => setText(e.target.value)}
                placeholder="Type your answer here…"
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50 focus:bg-white transition-all" />
              <p className="text-xs text-gray-300 mt-1 text-right">{text.length} chars</p>
            </div>
          )}

          {err && (
            <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl">
              <AlertCircleIcon size={13} className="text-rose-500 mt-0.5 flex-shrink-0"/><p className="text-xs text-rose-700">{err}</p>
            </div>
          )}

          <div className="flex gap-2.5">
            <button onClick={submit} disabled={busy}
              className={`flex-1 py-2.5 text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 ${doc.status === 'REJECTED' ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-gray-900 hover:bg-gray-800 text-white'}`}>
              {busy ? <><RefreshCw size={13} className="animate-spin"/> Submitting…</> : <><Upload size={13}/> Submit</>}
            </button>
            <button onClick={onClose} className="px-4 py-2.5 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── DOCUMENT CARD ─────────────────────────────────────────────────────────────
const DocCard = ({ doc, onUpload }) => {
  const cfg = DOC_STATUS[doc.status] || DOC_STATUS.PENDING;
  const DIcon = cfg.icon;
  const canAct = doc.status === 'PENDING' || doc.status === 'REJECTED';
  const isRejected = doc.status === 'REJECTED';

  return (
    <div className={`rounded-xl border ${cfg.border} overflow-hidden`}>
      {/* Row 1 — Document name + status */}
      <div className={`flex items-start gap-3 px-3.5 py-3 ${cfg.sectionBg}`}>
        <div className={`w-8 h-8 rounded-lg ${cfg.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
          <DIcon size={14} className={cfg.iconColor}/>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-900 leading-tight">{doc.documentType}</p>
              <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                {/* input type tag */}
                <span className={`inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full font-bold ${doc.inputType === 'FILE' ? 'bg-violet-100 text-violet-700' : 'bg-teal-100 text-teal-700'}`}>
                  {doc.inputType === 'FILE' ? <Paperclip size={8}/> : <Type size={8}/>} {doc.inputType}
                </span>
                {doc.version > 0 && <span className="text-[10px] px-1.5 py-0.5 bg-white/80 border border-gray-200 text-gray-500 rounded-full">v{doc.version}</span>}
              </div>
              {doc.remark && <p className="text-[11px] text-gray-500 mt-1 italic">"{doc.remark}"</p>}
            </div>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${cfg.badge}`}>{cfg.label}</span>
          </div>
        </div>
      </div>

      {/* Row 2 — Rejection reason (if any) */}
      {isRejected && doc.staffRemark && (
        <div className="px-3.5 py-3 bg-rose-50 border-t border-rose-200">
          <p className="text-[11px] font-bold text-rose-700 flex items-center gap-1 mb-0.5"><CircleAlert size={11}/> Rejected because:</p>
          <p className="text-xs text-rose-700 leading-relaxed">"{doc.staffRemark}"</p>
        </div>
      )}

      {/* Row 3 — Submitted content (file or text) */}
      {(doc.fileUrl || doc.textValue) && (
        <div className="px-3.5 py-3 bg-white border-t border-gray-100">
          {doc.fileUrl ? (
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <FileIcon url={doc.fileUrl}/>
                <span className="text-xs text-gray-600 font-medium truncate">{decodeURIComponent(doc.fileUrl.split('/').pop())}</span>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => window.open(doc.fileUrl, '_blank')} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-700 transition-colors" title="View"><EyeIcon size={13}/></button>
                <button className="p-1.5 hover:bg-gray-100 rounded-lg text-blue-400 hover:text-blue-600 transition-colors" title="Download"><Download size={13}/></button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Your submitted response</p>
              <p className="text-sm text-gray-800 leading-relaxed">{doc.textValue}</p>
            </div>
          )}
        </div>
      )}

      {/* Row 4 — Upload action */}
      {canAct && (
        <div className="px-3.5 py-3 bg-white border-t border-gray-100">
          <button onClick={() => onUpload(doc)}
            className={`w-full py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${isRejected ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-gray-900 hover:bg-gray-800 text-white'}`}>
            <Upload size={11}/>{isRejected ? '↑ Re-upload (fix rejection)' : '↑ Upload Now'}
          </button>
        </div>
      )}
    </div>
  );
};

// ─── STEP ITEM (timeline) ──────────────────────────────────────────────────────
const StepItem = ({ step, isLast, onUpload }) => {
  const [docsOpen, setDocsOpen] = useState(step.status === 'ERROR' || (step.serviceDocument || []).some(d => d.status === 'PENDING' || d.status === 'REJECTED'));
  const cfg = STEP_STATUS[step.status] || STEP_STATUS.PENDING;
  const docs = step.serviceDocument || [];
  const needsDocs = docs.filter(d => d.status === 'PENDING' || d.status === 'REJECTED').length;
  const isDone  = step.status === 'COMPLETED';
  const isError = step.status === 'ERROR';
  const isActive= step.status === 'PROCESSING' || step.status === 'IN_PROGRESS';

  return (
    <div className="flex gap-3">
      {/* Timeline column */}
      <div className="flex flex-col items-center flex-shrink-0" style={{ width: 28 }}>
        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${cfg.ring}`}>
          {isDone  && <Check size={12} className="text-white"/>}
          {isError && <X size={12} className="text-white"/>}
          {isActive && <div className="w-2 h-2 bg-white rounded-full animate-pulse"/>}
          {!isDone && !isError && !isActive && <span className="text-[10px] font-bold text-gray-400">{step.order}</span>}
        </div>
        {!isLast && <div className={`w-px flex-1 mt-1.5 min-h-[16px] ${cfg.connLine}`}/>}
      </div>

      {/* Content */}
      <div className="flex-1 pb-4 min-w-0">
        {/* Title row */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-sm text-gray-900 leading-snug">{step.title}</p>
              {needsDocs > 0 && (
                <span className="flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full">
                  <Bell size={8}/> {needsDocs}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{step.description}</p>
          </div>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${cfg.badge}`}>{cfg.label}</span>
        </div>

        {/* Error remark */}
        {isError && step.remarks && (
          <div className="mb-2 flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl">
            <CircleAlert size={13} className="text-rose-500 flex-shrink-0 mt-0.5"/>
            <div>
              <p className="text-[11px] font-bold text-rose-700">Our team flagged this:</p>
              <p className="text-xs text-rose-600 mt-0.5 leading-relaxed">"{step.remarks}"</p>
            </div>
          </div>
        )}

        {/* Documents */}
        {docs.length > 0 && (
          <div className="mt-2">
            <button onClick={() => setDocsOpen(v => !v)}
              className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
              <FileText size={11}/>
              {docs.length} document{docs.length > 1 ? 's' : ''}
              {needsDocs > 0 && !docsOpen && (
                <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold">
                  {needsDocs} need action
                </span>
              )}
              {docsOpen ? <ChevronUp size={11}/> : <ChevronDown size={11}/>}
            </button>
            {docsOpen && (
              <div className="mt-2 space-y-2">
                {docs.map(d => <DocCard key={d.documentId} doc={d} onUpload={onUpload}/>)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── PERIOD ACCORDION ────────────────────────────────────────────────────────
const PeriodRow = ({ period, isFirst, onUpload }) => {
  const [open, setOpen] = useState(isFirst && !period.isLocked);
  const pct   = period.completionPercent || 0;
  const done  = period.status === 'COMPLETED';
  const busy  = period.status === 'PROCESSING';
  const steps = [...(period.periodStep || [])].sort((a, b) => a.order - b.order);
  const periodDocs = period.serviceDocument || [];
  const needAction = periodDocs.filter(d => d.status === 'PENDING' || d.status === 'REJECTED').length
    + steps.reduce((n, s) => n + (s.serviceDocument || []).filter(d => d.status === 'PENDING' || d.status === 'REJECTED').length, 0);
  const hasError = steps.some(s => s.status === 'ERROR');

  const headerBg = period.isLocked ? 'bg-gray-50 border-gray-200'
    : done  ? 'bg-emerald-50 border-emerald-200'
    : busy  ? 'bg-blue-50 border-blue-200'
    : hasError ? 'bg-rose-50 border-rose-200'
    : 'bg-gray-50 border-gray-200';

  return (
    <div className={`rounded-xl border overflow-hidden ${period.isLocked ? 'opacity-60' : ''}`}>
      <button onClick={() => setOpen(v => !v)} className={`w-full flex items-center gap-3 px-4 py-3.5 text-left ${headerBg} transition-opacity`}>
        {/* Icon */}
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${period.isLocked ? 'bg-gray-200' : done ? 'bg-emerald-200' : busy ? 'bg-blue-200' : hasError ? 'bg-rose-200' : 'bg-gray-200'}`}>
          {period.isLocked ? <Lock size={13} className="text-gray-500"/>
            : done ? <CheckCircle2 size={13} className="text-emerald-700"/>
            : hasError ? <CircleAlert size={13} className="text-rose-600"/>
            : <Calendar size={13} className="text-blue-600"/>}
        </div>

        {/* Label */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm text-gray-900">{period.periodLabel}</span>
            {period.isLocked && <span className="text-[10px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded-full">Locked</span>}
            {hasError && !period.isLocked && <span className="text-[10px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.5 rounded-full">Needs action</span>}
            {needAction > 0 && <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5"><Bell size={8}/>{needAction} doc{needAction>1?'s':''}</span>}
          </div>
          {(period.startDate || period.endDate) && (
            <p className="text-[11px] text-gray-400 mt-0.5">{fmtDate(period.startDate)} – {fmtDate(period.endDate)}</p>
          )}
        </div>

        {/* Progress */}
        <div className="flex-shrink-0 flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-xs font-bold text-gray-700">{pct}%</p>
            <div className="w-14 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
              <div className={`h-full rounded-full transition-all ${done ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${pct}%` }}/>
            </div>
          </div>
          {open ? <ChevronUp size={14} className="text-gray-400"/> : <ChevronDown size={14} className="text-gray-400"/>}
        </div>
      </button>

      {open && (
        <div className="bg-white border-t border-gray-100 p-4">
          {period.isLocked ? (
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <Lock size={16} className="text-gray-300 flex-shrink-0"/>
              <div>
                <p className="text-sm font-semibold text-gray-500">Period not yet unlocked</p>
                <p className="text-xs text-gray-400 mt-0.5">Our team will activate this period when it's time.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Period-level docs */}
              {periodDocs.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-2">Documents for this period</p>
                  <div className="space-y-2">{periodDocs.map(d => <DocCard key={d.documentId} doc={d} onUpload={onUpload}/>)}</div>
                </div>
              )}
              {/* Steps */}
              {steps.length > 0 && (
                <div>
                  {periodDocs.length > 0 && <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-3">Steps</p>}
                  {steps.map((s, i) => <StepItem key={s.periodStepId} step={s} isLast={i===steps.length-1} onUpload={onUpload}/>)}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── TRACKING BODY ────────────────────────────────────────────────────────────
const TrackingBody = ({ app, onUpload }) => {
  if (!app) return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <ClipboardList size={32} className="text-gray-200 mb-3"/>
      <p className="text-sm font-semibold text-gray-400">No application yet</p>
      <p className="text-xs text-gray-300 mt-1">Tracking will appear once our team assigns your case.</p>
    </div>
  );

  const steps   = [...(app.applicationTrackStep || [])].sort((a, b) => a.order - b.order);
  const periods = [...(app.servicePeriod || [])].sort((a, b) => new Date(a.startDate||0) - new Date(b.startDate||0));

  // Gather ALL docs
  const allDocs = [];
  steps.forEach(s => (s.serviceDocument||[]).forEach(d => allDocs.push(d)));
  periods.forEach(p => {
    (p.serviceDocument||[]).forEach(d => allDocs.push(d));
    (p.periodStep||[]).forEach(s => (s.serviceDocument||[]).forEach(d => allDocs.push(d)));
  });
  const byStatus = { PENDING: 0, UPLOADED: 0, VERIFIED: 0, REJECTED: 0 };
  allDocs.forEach(d => { byStatus[d.status] = (byStatus[d.status]||0)+1; });
  const needAction = byStatus.PENDING + byStatus.REJECTED;

  const stepsDone = steps.filter(s => s.status === 'COMPLETED').length;
  const periodsDone = periods.filter(p => p.status === 'COMPLETED').length;
  const pct = periods.length
    ? Math.round((periodsDone / periods.length) * 100)
    : steps.length ? Math.round((stepsDone / steps.length) * 100) : 0;

  return (
    <div className="space-y-5 p-5">
      {/* Admin note */}
      {app.adminNote && (
        <div className="flex gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <MessageCircle size={15} className="text-blue-500 flex-shrink-0 mt-0.5"/>
          <div>
            <p className="text-[11px] font-bold text-blue-800 uppercase tracking-wide mb-1">Note from our team</p>
            <p className="text-sm text-blue-800 leading-relaxed">{app.adminNote}</p>
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-gray-700">Overall Progress</span>
          <span className="text-sm font-extrabold text-blue-600">{pct}%</span>
        </div>
        <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-700 ${pct===100?'bg-emerald-500':'bg-blue-500'}`} style={{ width: `${pct}%` }}/>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {periods.length
            ? `${periodsDone} of ${periods.length} periods completed`
            : `${stepsDone} of ${steps.length} steps completed`}
        </p>
      </div>

      {/* Documents summary */}
      {allDocs.length > 0 && (
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <SectionHeading icon={FileText} label="Documents" count={`${allDocs.length} total`}/>
          <div className="grid grid-cols-4 divide-x divide-gray-100">
            {[
              { key:'PENDING',  label:'Pending',   color:'text-amber-600' },
              { key:'UPLOADED', label:'In Review',  color:'text-sky-600' },
              { key:'VERIFIED', label:'Verified',   color:'text-emerald-600' },
              { key:'REJECTED', label:'Rejected',   color:'text-rose-600' },
            ].map(({key,label,color}) => (
              <div key={key} className="py-3 text-center">
                <p className={`text-xl font-extrabold ${color}`}>{byStatus[key]||0}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
          {needAction > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border-t border-amber-200 text-xs text-amber-700 font-semibold">
              <Bell size={12}/> {needAction} document{needAction>1?'s':''} waiting for your action
            </div>
          )}
        </div>
      )}

      {/* Application steps */}
      {steps.length > 0 && (
        <div>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide mb-3">Application Steps</p>
          {steps.map((s, i) => <StepItem key={s.applicationTrackStepId} step={s} isLast={i===steps.length-1} onUpload={onUpload}/>)}
        </div>
      )}

      {/* Periods */}
      {periods.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Monthly Periods</p>
            <span className="text-[10px] font-bold bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded-full">{periods.length} months</span>
          </div>
          <div className="space-y-2">
            {periods.map((p, i) => <PeriodRow key={p.servicePeriodId} period={p} isFirst={i===0} onUpload={onUpload}/>)}
          </div>
        </div>
      )}

      {/* Submitted form info */}
      {app.formData && Object.keys(app.formData).length > 0 && (
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <SectionHeading icon={ClipboardList} label="Submitted Information"/>
          <div className="divide-y divide-gray-100">
            {Object.entries(app.formData).map(([k, v]) => (
              <div key={k} className="flex items-start gap-3 px-4 py-3">
                <span className="text-xs text-gray-400 font-medium w-28 flex-shrink-0 capitalize pt-0.5">{k.replace(/_/g,' ')}</span>
                <span className="text-sm text-gray-900 font-medium flex-1">{String(v)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── SERVICE DETAIL DRAWER ────────────────────────────────────────────────────
const DRAWER_TABS = [
  { id: 'tracking', label: 'Tracking',  Icon: Activity },
  { id: 'payment',  label: 'Payment',   Icon: IndianRupee },
];

const ServiceDetailDrawer = ({ service, onClose }) => {
  const [tab, setTab] = useState('tracking');
  const [uploadDoc, setUploadDoc] = useState(null);
  if (!service) return null;

  const svc  = service.service;
  const app  = service.application;
  const isRec = svc.serviceType === 'RECURRING';
  const periods = app?.servicePeriod || [];
  const periodsDone = periods.filter(p => p.status === 'COMPLETED').length;

  // Compute total action items for badge on Tracking tab
  const allDocs = [];
  app?.applicationTrackStep?.forEach(s => (s.serviceDocument||[]).forEach(d => allDocs.push(d)));
  app?.servicePeriod?.forEach(p => {
    (p.serviceDocument||[]).forEach(d => allDocs.push(d));
    (p.periodStep||[]).forEach(s => (s.serviceDocument||[]).forEach(d => allDocs.push(d)));
  });
  const needAction = allDocs.filter(d => d.status === 'PENDING' || d.status === 'REJECTED').length;
  const hasErrors  = app?.applicationTrackStep?.some(s => s.status === 'ERROR')
    || app?.servicePeriod?.some(p => p.periodStep?.some(s => s.status === 'ERROR'));
  const totalAlerts = needAction + (hasErrors ? 1 : 0);

  const saving = parseFloat(svc.individualPrice || 0) - parseFloat(svc.offerPrice || 0);
  const gstAmt = parseFloat(svc.isGstApplicable === 'true' ? (parseFloat(svc.offerPrice||0) * parseFloat(svc.gstPercentage||0)) / 100 : 0);

  return (
    <>
      {uploadDoc && <DocUploadModal doc={uploadDoc} onClose={() => setUploadDoc(null)} onSuccess={() => window.location.reload()}/>}

      <div className="fixed inset-y-0 right-0 w-full sm:w-[580px] z-50 bg-white shadow-2xl border-l border-gray-100 flex flex-col">

        {/* ── TOP BAR ── */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 flex-shrink-0">
          <button onClick={onClose} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 font-semibold transition-colors">
            <ChevronLeft size={16}/> Back
          </button>
          <div className="flex items-center gap-2">
            {totalAlerts > 0 && (
              <span className="flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full border border-amber-200">
                <Bell size={11}/> {totalAlerts} action{totalAlerts>1?'s':''} needed
              </span>
            )}
            <button className="flex items-center gap-1.5 bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-800 transition-colors">
              <Phone size={13}/> Call Expert
            </button>
          </div>
        </div>

        {/* ── HERO IMAGE ── */}
        <div className="relative w-full bg-gray-100 overflow-hidden flex-shrink-0">
          <img
            src={svc.photoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(svc.name||'S')}&background=1e3a5f&color=fff&size=600`}
            alt={svc.name} className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent"/>
          <div className="absolute bottom-0 left-0 right-0 px-5 pb-4 pt-8">
            <div className="flex items-end justify-between gap-3">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-extrabold text-white leading-tight line-clamp-2">{svc.name}</h2>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <SvcBadge status={service.status}/>
                  <TypeTag type={svc.serviceType}/>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-2xl font-extrabold text-white">{fmtMoney(svc.finalIndividualPrice)}</p>
                <p className="text-xs text-white/50 mt-0.5">{fmtDate(service.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── ALERT STRIP ── */}
        {totalAlerts > 0 && (
          <div className="flex-shrink-0 flex items-start gap-2.5 px-5 py-3 bg-amber-50 border-b border-amber-200">
            <CircleAlert size={15} className="text-amber-600 flex-shrink-0 mt-0.5"/>
            <div>
              <p className="text-xs font-bold text-amber-800">Action required from you</p>
              <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                {needAction > 0 && `${needAction} document${needAction>1?'s':''} need to be uploaded`}
                {needAction > 0 && hasErrors && ' · '}
                {hasErrors && 'One or more steps have been flagged by our team'}
              </p>
            </div>
          </div>
        )}

        {/* ── TABS ── */}
        <div className="flex flex-shrink-0 border-b border-gray-100 bg-white">
          {DRAWER_TABS.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-semibold border-b-2 transition-all ${tab===id ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
              <Icon size={13}/>{label}
              {id === 'tracking' && totalAlerts > 0 && (
                <span className="w-4 h-4 bg-amber-500 text-white text-[9px] font-extrabold rounded-full flex items-center justify-center ml-0.5">{totalAlerts}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── SCROLLABLE CONTENT ── */}
        <div className="flex-1 overflow-y-auto">

          {/* ── TRACKING TAB ── */}
          {tab === 'tracking' && (
            <>
              {/* Subscription quick stats */}
              {isRec && periods.length > 0 && (
                <div className="grid grid-cols-3 divide-x divide-violet-200 bg-violet-50 border-b border-violet-200">
                  {[
                    { label: 'Total Months', val: periods.length, color: 'text-violet-700' },
                    { label: 'Completed',    val: periodsDone,    color: 'text-emerald-600' },
                    { label: 'Unlocked',     val: periods.filter(p=>!p.isLocked).length, color: 'text-blue-600' },
                  ].map(({ label, val, color }) => (
                    <div key={label} className="py-3 text-center">
                      <p className={`text-2xl font-extrabold ${color}`}>{val}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
              )}
              <TrackingBody app={app} onUpload={setUploadDoc}/>
            </>
          )}

          {/* ── PAYMENT TAB ── */}
          {tab === 'payment' && (
            <div className="p-5 space-y-4">
              {/* Service summary */}
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <SectionHeading icon={Briefcase} label="Service Summary"/>
                <div className="divide-y divide-gray-100">
                  {[
                    { label: 'Service', val: svc.name },
                    { label: 'Type', val: svc.serviceType === 'RECURRING' ? `Subscription · ${svc.frequency?.charAt(0)+svc.frequency?.slice(1).toLowerCase()||''}` : 'One-Time' },
                    svc.duration && { label: 'Duration', val: `${svc.duration} ${svc.durationUnit?.toLowerCase()}` },
                    { label: 'Purchased On', val: fmtDate(service.createdAt, true) },
                    { label: 'Service ID', val: `#${service.myServiceId.slice(-10).toUpperCase()}` },
                    { label: 'Status', val: <SvcBadge status={service.status}/> },
                  ].filter(Boolean).map(({ label, val }) => (
                    <div key={label} className="flex items-center gap-3 px-4 py-3">
                      <span className="text-xs text-gray-400 w-28 flex-shrink-0">{label}</span>
                      <span className="text-sm text-gray-900 font-medium flex-1">{val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing breakdown — dark card */}
              <div className="rounded-xl overflow-hidden border border-gray-800">
                <div className="px-4 py-3 bg-gray-900 flex items-center gap-2">
                  <IndianRupee size={13} className="text-gray-400"/>
                  <p className="text-xs font-bold text-gray-300 uppercase tracking-wide">Payment Breakdown</p>
                </div>
                <div className="bg-gray-900 px-4 pb-5 space-y-3">
                  <div className="flex justify-between pt-1">
                    <span className="text-sm text-gray-400">Original Price</span>
                    <span className="text-sm text-gray-400 line-through">{fmtMoney(svc.individualPrice)}</span>
                  </div>
                  {saving > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-emerald-400">Discount</span>
                      <span className="text-sm text-emerald-400 font-semibold">−{fmtMoney(saving)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-300">Offer Price</span>
                    <span className="text-sm text-white font-semibold">{fmtMoney(svc.offerPrice)}</span>
                  </div>
                  {svc.isGstApplicable === 'true' && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-400">GST ({svc.gstPercentage}%)</span>
                      <span className="text-sm text-gray-300">{fmtMoney(gstAmt)}</span>
                    </div>
                  )}
                  <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                    <span className="text-white font-bold">Total Paid</span>
                    <span className="text-2xl font-extrabold text-white">{fmtMoney(svc.finalIndividualPrice)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 pt-1">
                    <ShieldCheck size={13} className="text-emerald-400"/>
                    <span className="text-xs text-gray-500">Payment secured · {fmtDate(service.createdAt, true)}</span>
                  </div>
                </div>
              </div>

              {/* Savings callout */}
              {saving > 0 && (
                <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0"/>
                  <div>
                    <p className="text-sm font-bold text-emerald-800">You saved {fmtMoney(saving)}!</p>
                    <p className="text-xs text-emerald-600 mt-0.5">Offer applied at checkout automatically.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          
        </div>
      </div>
    </>
  );
};

// ─── INPUT FIELD ──────────────────────────────────────────────────────────────
const InputField = React.memo(({ field, formData, files, onInput, onCheck, onFile, onRemoveFile }) => {
  const { fieldId, type, label, placeholder, required, options } = field;
  if (!fieldId) return null;
  const value   = formData[fieldId] ?? '';
  const hasFile = !!files[fieldId];
  const onChange = e => onInput(fieldId, e.target.value);
  const base = "w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-[16px]";

  switch (type?.toLowerCase()) {
    case 'text': case 'email': case 'number': case 'tel':
      return <input type={type} value={value} onChange={onChange} placeholder={placeholder||`Enter ${label}`} required={required} className={base}/>;
    case 'textarea':
      return <textarea value={value} onChange={onChange} rows={4} placeholder={placeholder||`Enter ${label}`} required={required} className={base+' resize-none'}/>;
    case 'select':
      return <select value={value} onChange={onChange} required={required} className={base+' appearance-none'}><option value="">Select {label}</option>{options?.map((o,i)=><option key={i} value={o}>{o}</option>)}</select>;
    case 'radio':
      return <div className="space-y-3">{options?.map((o,i)=><label key={i} className="flex items-center gap-3 cursor-pointer"><div className="relative flex-shrink-0"><input type="radio" name={`r-${fieldId}`} value={o} checked={value===o} onChange={()=>onInput(fieldId,o)} className="sr-only peer" required={required}/><div className="w-5 h-5 border-2 border-gray-300 rounded-full peer-checked:border-blue-600 peer-checked:bg-blue-600 peer-checked:border-[5px] transition-all"/></div><span className="text-sm text-gray-700">{o}</span></label>)}</div>;
    case 'checkbox': {
      const checked = Array.isArray(value) ? value : [];
      return <div className="space-y-3">{options?.map((o,i)=>{ const on=checked.includes(o); return <label key={i} className="flex items-center gap-3 cursor-pointer"><div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all flex-shrink-0 ${on?'bg-gray-900 border-gray-900':'border-gray-300'}`} onClick={()=>onCheck(fieldId,o)}>{on&&<Check size={11} className="text-white"/>}</div><span className="text-sm text-gray-700">{o}</span></label>; })}</div>;
    }
    case 'file':
      return (
        <div className="space-y-3">
          <label className="cursor-pointer block">
            <input type="file" onChange={e=>onFile(fieldId,e.target.files?.[0])} className="hidden" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx" required={required&&!hasFile}/>
            <div className={`flex flex-col items-center justify-center py-7 border-2 border-dashed rounded-xl transition-all ${hasFile?'border-emerald-300 bg-emerald-50':'border-gray-200 hover:border-blue-400 hover:bg-blue-50/30'}`}>
              {hasFile?(<><File className="w-9 h-9 text-emerald-500 mb-1.5"/><p className="text-sm font-semibold text-emerald-700">{files[fieldId]?.name}</p><p className="text-xs text-gray-400 mt-1">Click to change</p></>):(<><Upload className="w-9 h-9 text-gray-300 mb-1.5"/><p className="text-sm font-medium text-gray-500">Click to upload file</p><p className="text-xs text-gray-400 mt-0.5">PDF, JPG, PNG, DOC, XLS</p></>)}
            </div>
          </label>
          {hasFile&&<div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl border border-gray-200"><div className="flex items-center gap-2.5 min-w-0"><div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"><File className="w-4 h-4 text-blue-600"/></div><div className="min-w-0"><p className="text-sm font-medium text-gray-900 truncate">{files[fieldId]?.name}</p><p className="text-xs text-gray-400">{files[fieldId]?.size?`${(files[fieldId].size/1024).toFixed(1)} KB`:''}</p></div></div><button type="button" onClick={()=>onRemoveFile(fieldId)} className="p-1.5 hover:bg-gray-200 rounded-lg ml-2 flex-shrink-0 text-gray-400 hover:text-gray-600"><X size={14}/></button></div>}
        </div>
      );
    case 'date':
      return <input type="date" value={value} onChange={onChange} required={required} className={base}/>;
    default:
      return <input type="text" value={value} onChange={onChange} placeholder={placeholder||`Enter ${label}`} required={required} className={base}/>;
  }
}, (p, n) => {
  const fid = p.field.fieldId;
  return p.formData[fid]===n.formData[fid] && p.files[fid]===n.files[fid] &&
    p.onInput===n.onInput && p.onCheck===n.onCheck && p.onFile===n.onFile && p.onRemoveFile===n.onRemoveFile;
});

// ─── INPUT FORM DRAWER ────────────────────────────────────────────────────────
const InputFormDrawer = ({ show, service, serviceDetails, loadingDetails, submitSuccess, submitting, submitError, formData, files, onClose, onSubmit, onInput, onCheck, onFile, onRemoveFile }) => {
  if (!show || !service) return null;
  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[540px] bg-white shadow-2xl z-[60] border-l border-gray-100 flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
        <button onClick={onClose} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors"><ChevronLeft size={16}/> Back</button>
        {!loadingDetails && !submitSuccess && service.status === 'NOT_STARTED' && (
          <button onClick={onSubmit} disabled={submitting} className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-600 transition-colors disabled:opacity-50">
            {submitting?<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Submitting…</>:<><Play size={14}/>Start Service</>}
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto">
        {loadingDetails ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="w-10 h-10 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin"/>
            <p className="text-sm text-gray-400">Loading requirements…</p>
          </div>
        ) : submitSuccess ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-10">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-5"><Check className="w-10 h-10 text-emerald-500"/></div>
            <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Submitted!</h3>
            <p className="text-gray-400 text-sm mb-8">Our team will review and get started shortly.</p>
            <button onClick={onClose} className="px-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 text-sm">Close</button>
          </div>
        ) : (
          <div className="p-5 space-y-5 pb-12">
            <div className="relative h-36 rounded-xl overflow-hidden bg-gray-100">
              <img src={service.service?.photoUrl||`https://ui-avatars.com/api/?name=${encodeURIComponent(service.service?.name||'S')}&background=1e3a5f&color=fff&size=400`} alt={service.service?.name} className="w-full h-full object-cover"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"/>
              <div className="absolute bottom-3 left-4 right-4">
                <h2 className="text-base font-bold text-white leading-tight">{service.service?.name}</h2>
                <SvcBadge status={service.status}/>
              </div>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">{service.service?.description}</p>
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <Info size={14} className="text-blue-500 flex-shrink-0 mt-0.5"/>
              <p className="text-xs text-blue-700">Fill all required (<span className="text-rose-500 font-bold">*</span>) fields to start your service.</p>
            </div>
            <div className="space-y-5">
              {serviceDetails?.inputFields?.map(field => field.fieldId && (
                <div key={field.fieldId}>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-bold text-gray-800">{field.label}{field.required&&<span className="text-rose-500 ml-1">*</span>}</label>
                    <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-400 rounded-full capitalize">{field.type}</span>
                  </div>
                  <InputField field={field} formData={formData} files={files} onInput={onInput} onCheck={onCheck} onFile={onFile} onRemoveFile={onRemoveFile}/>
                </div>
              ))}
            </div>
            {submitError&&<div className="flex items-start gap-2.5 p-4 bg-rose-50 border border-rose-200 rounded-xl"><AlertCircleIcon size={14} className="text-rose-500 flex-shrink-0 mt-0.5"/><p className="text-sm text-rose-700">{submitError}</p></div>}
            <button onClick={onSubmit} disabled={submitting} className="w-full py-3.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm">
              {submitting?<><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Submitting…</>:<><Play size={15}/>Start Service Now</>}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── SERVICE CARD ──────────────────────────────────────────────────────────────
const ServiceCard = ({ myService, onView, onStart, isTransitioning }) => {
  const svc  = myService.service;
  const app  = myService.application;
  const isRec = svc.serviceType === 'RECURRING';
  const daysAgo = Math.floor((Date.now() - new Date(myService.createdAt)) / 86400000);

  const allDocs = [];
  app?.applicationTrackStep?.forEach(s => (s.serviceDocument||[]).forEach(d => allDocs.push(d)));
  app?.servicePeriod?.forEach(p => { (p.serviceDocument||[]).forEach(d => allDocs.push(d)); (p.periodStep||[]).forEach(s => (s.serviceDocument||[]).forEach(d => allDocs.push(d))); });
  const needDocs = allDocs.filter(d => d.status === 'PENDING' || d.status === 'REJECTED').length;
  const appSteps = app?.applicationTrackStep || [];
  const stepDone = appSteps.filter(s => s.status === 'COMPLETED').length;
  const hasError = appSteps.some(s => s.status === 'ERROR') || app?.servicePeriod?.some(p => p.periodStep?.some(s => s.status === 'ERROR'));
  const periods  = app?.servicePeriod || [];
  const perDone  = periods.filter(p => p.status === 'COMPLETED').length;
  let pct = { NOT_STARTED:0, IN_PROGRESS:50, COMPLETED:100, ON_HOLD:30, CANCELLED:0 }[myService.status] ?? 0;
  if (isRec && periods.length > 0) pct = Math.round((perDone/periods.length)*100);
  else if (appSteps.length > 0) pct = Math.round((stepDone/appSteps.length)*100);

  return (
    <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-300 flex flex-col">
      <div className="relative w-full bg-gray-100 overflow-hidden flex-shrink-0">
        <img src={svc.photoUrl||`https://ui-avatars.com/api/?name=${encodeURIComponent(svc.name||'S')}&background=1e3a5f&color=fff&size=400`} alt={svc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent"/>
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
          <SvcBadge status={myService.status}/><TypeTag type={svc.serviceType}/>
        </div>
        <div className="absolute bottom-10 left-3 flex flex-col gap-1.5">
          {needDocs > 0 && <span className="flex items-center gap-1 px-2 py-1 bg-amber-500 text-white text-[11px] font-bold rounded-lg shadow"><Bell size={10}/> {needDocs} doc{needDocs>1?'s':''} needed</span>}
          {hasError && <span className="flex items-center gap-1 px-2 py-1 bg-rose-500 text-white text-[11px] font-bold rounded-lg shadow"><CircleAlert size={10}/> Action needed</span>}
        </div>
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <span className="text-white font-extrabold text-lg drop-shadow">{fmtMoney(svc.finalIndividualPrice)}</span>
          <span className="text-white/60 text-[11px]">{daysAgo===0?'Today':daysAgo===1?'Yesterday':`${daysAgo}d ago`}</span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-base leading-tight mb-1 line-clamp-1">{svc.name}</h3>
        <p className="text-gray-400 text-xs line-clamp-2 mb-4 leading-relaxed">{svc.description}</p>
        <div className="mb-4">
          <div className="flex justify-between mb-1.5">
            <span className="text-[11px] text-gray-400 font-medium">Progress</span>
            <span className="text-[11px] font-bold text-gray-700">{pct}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-500 ${pct===100?'bg-emerald-500':pct===0?'bg-gray-300':'bg-blue-500'}`} style={{ width:`${pct}%` }}/>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {isRec ? <>
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100"><p className="text-[10px] text-gray-400 mb-0.5 flex items-center gap-1"><RefreshCw size={9}/> Periods</p><p className="text-sm font-bold text-gray-900">{perDone}<span className="text-xs text-gray-400 font-normal">/{periods.length}</span></p></div>
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100"><p className="text-[10px] text-gray-400 mb-0.5 flex items-center gap-1"><Calendar size={9}/> Frequency</p><p className="text-sm font-bold text-gray-900 capitalize">{svc.frequency?.toLowerCase()||'—'}</p></div>
          </> : <>
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100"><p className="text-[10px] text-gray-400 mb-0.5 flex items-center gap-1"><BarChart size={9}/> Steps</p><p className="text-sm font-bold text-gray-900">{stepDone}<span className="text-xs text-gray-400 font-normal">/{appSteps.length}</span></p></div>
            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100"><p className="text-[10px] text-gray-400 mb-0.5 flex items-center gap-1"><Clock size={9}/> Duration</p><p className="text-sm font-bold text-gray-900 truncate">{svc.duration?`${svc.duration} ${svc.durationUnit?.toLowerCase()}`:'—'}</p></div>
          </>}
        </div>
        {allDocs.length > 0 && (
          <div className="flex items-center gap-2 mb-4 text-xs text-gray-400">
            <FileText size={11}/><span>{allDocs.length} document{allDocs.length>1?'s':''}</span>
            {needDocs>0&&<span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold">{needDocs} pending</span>}
          </div>
        )}
        <div className="flex gap-2 mt-auto">
          <button onClick={()=>onView(myService)} disabled={isTransitioning} className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50">
            <EyeIcon size={14}/> View
          </button>
          {myService.status==='NOT_STARTED'?(
            <button onClick={()=>onStart(myService)} disabled={isTransitioning} className="flex-1 bg-emerald-500 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"><Play size={14}/> Start</button>
          ):hasError?(
            <button onClick={()=>onView(myService)} disabled={isTransitioning} className="flex-1 bg-rose-500 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-rose-600 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"><CircleAlert size={14}/> Fix Issue</button>
          ):(
            <button onClick={()=>onView(myService)} disabled={isTransitioning} className="flex-1 bg-gray-900 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"><ChevronRightIcon size={14}/> Details</button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function MyService() {
  const [myServices, setMyServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState(null);
  const [showInputForm, setShowInputForm] = useState(false);
  const [selectedServiceForInput, setSelectedServiceForInput] = useState(null);
  const [serviceDetails, setServiceDetails] = useState(null);
  const [loadingServiceDetails, setLoadingServiceDetails] = useState(false);
  const [formData, setFormData] = useState({});
  const [files, setFiles]       = useState({});
  const [submitting, setSubmitting]     = useState(false);
  const [submitError, setSubmitError]   = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [fieldLabelMapping, setFieldLabelMapping] = useState({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [searchQuery, setSearchQuery]   = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredServices, setFilteredServices] = useState([]);
  const [currentPage, setCurrentPage]   = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [totalPages, setTotalPages]     = useState(1);
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0, pending: 0 });
  const filePreviewRefs = useRef({});
  const userId = 'cmjsacjjh0000tzdotm5dqv7r';

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/my-services/${userId}`);
      if (res.data.success) {
        const s = res.data.services;
        setMyServices(s);
        setStats({ total: s.length, active: s.filter(x=>x.status==='IN_PROGRESS').length, completed: s.filter(x=>x.status==='COMPLETED').length, pending: s.filter(x=>x.status==='NOT_STARTED'||x.status==='ON_HOLD').length });
      }
    } catch(e) { console.error(e); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  useEffect(() => {
    let r = myServices;
    if (searchQuery) r = r.filter(s => s.service.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.service.description.toLowerCase().includes(searchQuery.toLowerCase()));
    if (statusFilter !== 'all') r = r.filter(s => s.status === statusFilter);
    setFilteredServices(r);
    setTotalPages(Math.ceil(r.length / itemsPerPage) || 1);
    setCurrentPage(1);
  }, [searchQuery, statusFilter, myServices, itemsPerPage]);

  const paginatedServices = filteredServices.slice((currentPage-1)*itemsPerPage, currentPage*itemsPerPage);
  const getPageNumbers = () => {
    if (totalPages<=5) return Array.from({length:totalPages},(_,i)=>i+1);
    if (currentPage<=3) return [1,2,3,4,'...',totalPages];
    if (currentPage>=totalPages-2) return [1,'...',totalPages-3,totalPages-2,totalPages-1,totalPages];
    return [1,'...',currentPage-1,currentPage,currentPage+1,'...',totalPages];
  };

  const closeModal = useCallback(() => {
    Object.values(filePreviewRefs.current).forEach(u=>u&&URL.revokeObjectURL(u));
    filePreviewRefs.current = {};
    setSelectedService(null); setShowInputForm(false); setSelectedServiceForInput(null);
    setServiceDetails(null); setFormData({}); setFiles({}); setSubmitError(''); setSubmitSuccess(false); setFieldLabelMapping({});
  }, []);

  const openDetail = useCallback((s) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    if (selectedService || showInputForm) { closeModal(); setTimeout(()=>{ setSelectedService(s); setIsTransitioning(false); }, 200); }
    else { setSelectedService(s); setIsTransitioning(false); }
  }, [isTransitioning, selectedService, showInputForm, closeModal]);

  const openStart = useCallback(async (s) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    if (selectedService || showInputForm) { closeModal(); await new Promise(r=>setTimeout(r,200)); }
    setSelectedServiceForInput(s); setShowInputForm(true); setLoadingServiceDetails(true);
    setFormData({}); setFiles({}); setSubmitError(''); setSubmitSuccess(false);
    try {
      const res = await axiosInstance.get(`/service/${s.service.serviceId}`);
      if (res.data.success) {
        setServiceDetails(res.data.service);
        const init={}, mapping={};
        res.data.service.inputFields?.forEach(f=>{ if(!f.fieldId)return; mapping[f.fieldId]=f.label; init[f.fieldId]=f.type==='checkbox'?[]:f.type==='file'?null:''; });
        setFormData(init); setFieldLabelMapping(mapping);
      }
    } catch(e) { setSubmitError('Failed to load service details.'); }
    finally { setLoadingServiceDetails(false); setIsTransitioning(false); }
  }, [isTransitioning, selectedService, showInputForm, closeModal]);

  const handleInput  = useCallback((fid,v)=>setFormData(p=>({...p,[fid]:v})),[]);
  const handleCheck  = useCallback((fid,opt)=>setFormData(p=>{const c=p[fid]||[];return{...p,[fid]:c.includes(opt)?c.filter(x=>x!==opt):[...c,opt]};}),[]);
  const handleFile   = useCallback((fid,file)=>{ if(!file)return; if(filePreviewRefs.current[fid])URL.revokeObjectURL(filePreviewRefs.current[fid]); filePreviewRefs.current[fid]=URL.createObjectURL(file); setFiles(p=>({...p,[fid]:file})); setFormData(p=>({...p,[fid]:'file_uploaded'})); },[]);
  const handleRemove = useCallback((fid)=>{ if(filePreviewRefs.current[fid]){URL.revokeObjectURL(filePreviewRefs.current[fid]);delete filePreviewRefs.current[fid];} setFiles(p=>{const n={...p};delete n[fid];return n;}); setFormData(p=>({...p,[fid]:null})); },[]);

  const handleSubmit = useCallback(async()=>{
    if(!selectedServiceForInput||!serviceDetails)return;
    const missing=serviceDetails.inputFields?.filter(f=>f.required&&(!formData[f.fieldId]||(Array.isArray(formData[f.fieldId])&&!formData[f.fieldId].length))).map(f=>f.label)||[];
    if(missing.length){setSubmitError(`Required: ${missing.join(', ')}`);return;}
    setSubmitting(true);setSubmitError('');
    try{
      const fd=new FormData();
      fd.append('serviceId',serviceDetails.serviceId);
      Object.entries(formData).forEach(([fid,val])=>{const lbl=fieldLabelMapping[fid];if(!lbl||files[fid])return;if(Array.isArray(val))fd.append(lbl,JSON.stringify(val));else if(val)fd.append(lbl,val);});
      Object.entries(files).forEach(([fid,file])=>{const lbl=fieldLabelMapping[fid];if(lbl&&file)fd.append(lbl,file);});
      const res=await axiosInstance.post(`/application/start/apply/${selectedServiceForInput.myServiceId}`,fd,{headers:{'Content-Type':'multipart/form-data'}});
      if(res.data.success){setSubmitSuccess(true);setTimeout(()=>{closeModal();fetchServices();},2000);}
      else setSubmitError(res.data.message||'Submission failed');
    }catch(e){setSubmitError(e.response?.data?.message||'Submission failed. Please try again.');}
    finally{setSubmitting(false);}
  },[selectedServiceForInput,serviceDetails,formData,files,fieldLabelMapping,closeModal,fetchServices]);

  const STAT_CARDS = [
    { label:'Total',     val:stats.total,     Icon:Briefcase, color:'text-blue-600',    bg:'bg-blue-50' },
    { label:'Active',    val:stats.active,    Icon:Activity,  color:'text-emerald-600', bg:'bg-emerald-50' },
    { label:'Completed', val:stats.completed, Icon:CheckCircle,color:'text-violet-600', bg:'bg-violet-50' },
    { label:'Pending',   val:stats.pending,   Icon:Clock,     color:'text-amber-600',   bg:'bg-amber-50' },
  ];

  return (
    <div className="min-h-screen bg-gray-50/60">
      <style>{`@media(max-width:768px){input,textarea,select{font-size:16px!important}}.no-scrollbar::-webkit-scrollbar{display:none}.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>

      {(selectedService||showInputForm) && <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={closeModal}/>}
      <ServiceDetailDrawer service={selectedService} onClose={closeModal}/>
      <InputFormDrawer show={showInputForm} service={selectedServiceForInput} serviceDetails={serviceDetails} loadingDetails={loadingServiceDetails} submitSuccess={submitSuccess} submitting={submitting} submitError={submitError} formData={formData} files={files} onClose={closeModal} onSubmit={handleSubmit} onInput={handleInput} onCheck={handleCheck} onFile={handleFile} onRemoveFile={handleRemove}/>

      {/* Page header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">My Services</h1>
              <p className="text-sm text-gray-400 mt-0.5">Track and manage all your purchased services</p>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" size={14}/>
                <input type="text" placeholder="Search services…" value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} className="pl-9 pr-4 py-2.5 border border-gray-200 bg-white text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-52 transition-all outline-none"/>
              </div>
              <div className="relative group">
                <button className="px-3.5 py-2.5 border border-gray-200 bg-white rounded-xl hover:border-gray-300 flex items-center gap-1.5 text-sm font-medium text-gray-600">
                  <Filter size={13}/> Filter {statusFilter!=='all'&&<span className="w-1.5 h-1.5 bg-blue-500 rounded-full"/>}
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-1.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  <button onClick={()=>setStatusFilter('all')} className="w-full px-3.5 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center justify-between">
                    <span className="flex items-center gap-2"><Layers size={12} className="text-gray-400"/> All</span>
                    {statusFilter==='all'&&<Check size={12} className="text-blue-500"/>}
                  </button>
                  {Object.entries(SVC_STATUS).map(([s,cfg])=>{
                    const Icon=cfg.Icon;
                    return <button key={s} onClick={()=>setStatusFilter(statusFilter===s?'all':s)} className="w-full px-3.5 py-2 text-sm text-left text-gray-700 hover:bg-gray-50 flex items-center justify-between"><span className="flex items-center gap-2"><Icon size={12} className={cfg.text}/>{cfg.label}</span>{statusFilter===s&&<Check size={12} className="text-blue-500"/>}</button>;
                  })}
                </div>
              </div>
              <button onClick={fetchServices} className="p-2.5 border border-gray-200 bg-white rounded-xl text-gray-400 hover:text-gray-700 transition-all" title="Refresh"><RefreshCw size={14}/></button>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {STAT_CARDS.map(({label,val,Icon,color,bg})=>(
              <div key={label} className="bg-white border border-gray-100 rounded-xl px-4 py-3.5 flex items-center gap-3">
                <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center flex-shrink-0`}><Icon size={17} className={color}/></div>
                <div><p className="text-2xl font-extrabold text-gray-900">{val}</p><p className="text-xs text-gray-400">{label}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-1 overflow-x-auto py-2.5 no-scrollbar">
            <button onClick={()=>setStatusFilter('all')} className={`flex-shrink-0 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${statusFilter==='all'?'bg-gray-900 text-white':'text-gray-500 hover:bg-gray-100'}`}>All ({stats.total})</button>
            {Object.entries(SVC_STATUS).map(([status,cfg])=>{
              const cnt=myServices.filter(s=>s.status===status).length;
              const Icon=cfg.Icon;
              return <button key={status} onClick={()=>setStatusFilter(status)} className={`flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${statusFilter===status?'bg-gray-900 text-white':'text-gray-500 hover:bg-gray-100'}`}><Icon size={12}/> {cfg.label} ({cnt})</button>;
            })}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 gap-4">
            <div className="w-12 h-12 border-[3px] border-blue-500 border-t-transparent rounded-full animate-spin"/>
            <p className="text-sm text-gray-400">Loading your services…</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4"><Search size={26} className="text-gray-300"/></div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">No services found</h3>
            <p className="text-sm text-gray-400 mb-6">{searchQuery||statusFilter!=='all'?'Try adjusting your filters.':"You haven't purchased any services yet."}</p>
            <button onClick={()=>{setSearchQuery('');setStatusFilter('all');}} className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors">
              {searchQuery||statusFilter!=='all'?'Clear Filters':'Browse Services'}
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-400">Showing <strong className="text-gray-700">{paginatedServices.length}</strong> of <strong className="text-gray-700">{filteredServices.length}</strong></p>
              <select value={itemsPerPage} onChange={e=>setItemsPerPage(Number(e.target.value))} className="text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-600 bg-white outline-none focus:ring-2 focus:ring-blue-500">
                {[6,9,12,15].map(n=><option key={n} value={n}>Show {n}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
              {paginatedServices.map(s=><ServiceCard key={s.myServiceId} myService={s} onView={openDetail} onStart={openStart} isTransitioning={isTransitioning}/>)}
            </div>
            {filteredServices.length > itemsPerPage && (
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-400">{(currentPage-1)*itemsPerPage+1}–{Math.min(currentPage*itemsPerPage,filteredServices.length)} of {filteredServices.length}</p>
                <div className="flex items-center gap-1">
                  <button onClick={()=>setCurrentPage(p=>Math.max(1,p-1))} disabled={currentPage===1} className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"><ChevronLeft size={14}/></button>
                  {getPageNumbers().map((pn,i)=>pn==='...'?<span key={`d${i}`} className="px-2 text-gray-300"><MoreHorizontal size={13}/></span>:
                    <button key={pn} onClick={()=>{setCurrentPage(pn);window.scrollTo({top:0,behavior:'smooth'});}} className={`min-w-[34px] h-9 rounded-lg text-sm font-semibold transition-all ${currentPage===pn?'bg-gray-900 text-white':'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{pn}</button>
                  )}
                  <button onClick={()=>setCurrentPage(p=>Math.min(totalPages,p+1))} disabled={currentPage===totalPages} className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"><ChevronRightIcon size={14}/></button>
                </div>
              </div>
            )}
          </>
        )}

        {!loading && filteredServices.length > 0 && (
          <div className="mt-10 bg-gray-900 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0"><Headphones size={19} className="text-white"/></div>
              <div>
                <p className="font-bold text-white">24/7 Expert Support</p>
                <p className="text-sm text-gray-400 mt-0.5">Avg response 2 min · 98% satisfaction</p>
              </div>
            </div>
            <div className="flex gap-2.5">
              <button className="px-4 py-2 bg-white text-gray-900 rounded-xl text-sm font-bold hover:bg-gray-100 flex items-center gap-1.5"><MessageSquare size={13}/> Chat</button>
              <button className="px-4 py-2 bg-white/10 border border-white/10 text-white rounded-xl text-sm font-bold hover:bg-white/20 flex items-center gap-1.5"><HelpCircle size={13}/> Help</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}