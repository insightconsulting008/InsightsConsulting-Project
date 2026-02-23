import React, { useEffect, useState, useCallback, useRef } from 'react';
import axiosInstance from '@src/providers/axiosInstance';
import {
  Clock, Calendar, FileText, CheckCircle, X, Search, Filter,
  ChevronRight as ChevronRightIcon, Play, Check, Package,
  Users, TrendingUp, Eye, BarChart, Target, Award,
  Zap, Layers, Headphones, MessageSquare, Phone, HelpCircle,
  FileBarChart, CalendarClock, DollarSign, ShieldCheck, Sparkles,
  Upload, AlertCircle as AlertCircleIcon, File, MoreHorizontal,
  ChevronLeft, RefreshCw, XCircle, PlayCircle, AlertTriangle,
  Lock, Unlock, ChevronDown, ChevronUp, RotateCcw,
} from 'lucide-react';

// ─── PRIMARY COLOR CONFIGURATION ──────────────────────────────────────────────
const primary = {
  bg: "bg-primary",
  text: "text-primary",
  hover: "hover:bg-primary-dark",
  light: "bg-primary-50",
  border: "border-primary",
  ring: "ring-primary/20",
  gradient: "from-primary to-primary-dark",
  bgLight: "bg-primary-100",
  bgVeryLight: "bg-primary-50",
  textLight: "text-primary-600",
  borderLight: "border-primary-200"
};

// ─── STATUS CONFIG (matches staff side: PROCESSING, COMPLETED, PENDING, ERROR) ─
const STATUS_COLORS = {
  // User-facing statuses
  NOT_STARTED: {
    bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200',
    icon: Clock, iconColor: 'text-amber-600', label: 'Not Started',
    progressDot: 'bg-amber-400',
  },
  IN_PROGRESS: {
    bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200',
    icon: TrendingUp, iconColor: 'text-blue-600', label: 'In Progress',
    progressDot: 'bg-blue-400',
  },
  COMPLETED: {
    bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200',
    icon: CheckCircle, iconColor: 'text-emerald-600', label: 'Completed',
    progressDot: 'bg-emerald-400',
  },
  CANCELLED: {
    bg: 'bg-rose-50', text: 'text-rose-800', border: 'border-rose-200',
    icon: X, iconColor: 'text-rose-600', label: 'Cancelled',
    progressDot: 'bg-rose-400',
  },
  ON_HOLD: {
    bg: 'bg-orange-50', text: 'text-orange-800', border: 'border-orange-200',
    icon: AlertTriangle, iconColor: 'text-orange-600', label: 'On Hold',
    progressDot: 'bg-orange-400',
  },
};

// Track step statuses — synced with staff ViewDetails page
const STEP_STATUS_CONFIG = {
  COMPLETED: {
    bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800',
    badge: 'bg-emerald-100 text-emerald-700', dotColor: 'bg-emerald-500',
    icon: CheckCircle, iconColor: 'text-emerald-500', label: 'Completed',
  },
  PROCESSING: {
    bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800',
    badge: 'bg-blue-100 text-blue-700', dotColor: 'bg-blue-500',
    icon: PlayCircle, iconColor: 'text-blue-500', label: 'In Progress',
  },
  PENDING: {
    bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-700',
    badge: 'bg-gray-100 text-gray-600', dotColor: 'bg-gray-300',
    icon: Clock, iconColor: 'text-gray-400', label: 'Pending',
  },
  ERROR: {
    bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-800',
    badge: 'bg-rose-100 text-rose-700', dotColor: 'bg-rose-500',
    icon: XCircle, iconColor: 'text-rose-500', label: 'Action Needed',
  },
  // Legacy fallbacks
  IN_PROGRESS: {
    bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800',
    badge: 'bg-blue-100 text-blue-700', dotColor: 'bg-blue-500',
    icon: PlayCircle, iconColor: 'text-blue-500', label: 'In Progress',
  },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const formatDate = (ds) =>
  ds ? new Date(ds).toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'short',
    year: 'numeric', hour: '2-digit', minute: '2-digit',
  }) : 'N/A';

const formatDateShort = (ds) =>
  ds ? new Date(ds).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  }) : 'N/A';

const formatPrice = (p) => parseInt(p || 0).toLocaleString('en-IN');

const getProgress = (status) =>
  ({ NOT_STARTED: 5, IN_PROGRESS: 50, COMPLETED: 100, ON_HOLD: 30, CANCELLED: 0 }[status] ?? 0);

// ─── PURE PRESENTATIONAL ──────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cfg = STATUS_COLORS[status] || {
    bg: 'bg-gray-50', text: 'text-gray-800', border: 'border-gray-200',
    icon: Package, iconColor: 'text-gray-600', label: status,
  };
  const Icon = cfg.icon;
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${cfg.border} ${cfg.bg}`}>
      <Icon size={13} className={cfg.iconColor} />
      <span className={`text-xs font-semibold ${cfg.text}`}>{cfg.label}</span>
    </div>
  );
};

const ServiceTypeBadge = ({ type }) => {
  const map = {
    ONE_TIME: { label: 'One Time', cls: 'bg-slate-50 text-slate-700 border-slate-200', Icon: Zap },
    RECURRING: { label: 'Subscription', cls: 'bg-violet-50 text-violet-700 border-violet-200', Icon: Calendar },
  };
  const { label, cls, Icon } = map[type] || { label: type || '—', cls: 'bg-gray-50 text-gray-700 border-gray-200', Icon: Package };
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium ${cls}`}>
      <Icon size={12} />{label}
    </div>
  );
};

const StatsCard = ({ title, value, Icon, colorBg, colorText, desc }) => (
  <div className="group bg-white border border-gray-100 rounded-xl p-5 hover:shadow-lg transition-all hover:-translate-y-0.5">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-0.5">{title}</p>
        <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        {desc && <p className="text-xs text-gray-400 mt-1">{desc}</p>}
      </div>
      <div className={`p-3 rounded-xl ${colorBg} group-hover:scale-105 transition-transform`}>
        <Icon className={colorText} size={24} />
      </div>
    </div>
  </div>
);

// ─── INPUT FIELD ─────────────────────────────────────────────────────────────
const InputField = React.memo(({ field, formData, files, onInput, onCheck, onFile, onRemoveFile }) => {
  const { fieldId, type, label, placeholder, required, options } = field;
  if (!fieldId) return null;
  const value = formData[fieldId] ?? '';
  const hasFile = !!files[fieldId];
  const onChange = (e) => onInput(fieldId, e.target.value);

  switch (type?.toLowerCase()) {
    case 'text': case 'email': case 'number': case 'tel':
      return (
        <input type={type} value={value} onChange={onChange}
          placeholder={placeholder || `Enter ${label}`} required={required}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-[16px]" />
      );
    case 'textarea':
      return (
        <textarea value={value} onChange={onChange} rows={4}
          placeholder={placeholder || `Enter ${label}`} required={required}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none text-[16px]" />
      );
    case 'select':
      return (
        <select value={value} onChange={onChange} required={required}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none text-[16px]">
          <option value="">Select {label}</option>
          {options?.map((o, i) => <option key={i} value={o}>{o}</option>)}
        </select>
      );
    case 'radio':
      return (
        <div className="space-y-3">
          {options?.map((o, i) => (
            <label key={i} className="flex items-center gap-3 cursor-pointer group">
              <div className="relative flex-shrink-0">
                <input type="radio" name={`r-${fieldId}`} value={o} checked={value === o}
                  onChange={() => onInput(fieldId, o)} className="sr-only peer" required={required} />
                <div className="w-5 h-5 border-2 border-gray-300 rounded-full peer-checked:border-primary peer-checked:bg-primary peer-checked:border-[5px] transition-all" />
              </div>
              <span className="text-sm text-gray-700">{o}</span>
            </label>
          ))}
        </div>
      );
    case 'checkbox': {
      const checked = Array.isArray(value) ? value : [];
      return (
        <div className="space-y-3">
          {options?.map((o, i) => {
            const isChecked = checked.includes(o);
            return (
              <label key={i} className="flex items-center gap-3 cursor-pointer">
                <div className="relative flex-shrink-0">
                  <input type="checkbox" checked={isChecked} onChange={() => onCheck(fieldId, o)} className="sr-only peer" />
                  <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${isChecked ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                    {isChecked && <Check size={11} className="text-white" />}
                  </div>
                </div>
                <span className="text-sm text-gray-700">{o}</span>
              </label>
            );
          })}
        </div>
      );
    }
    case 'file':
      return (
        <div className="space-y-3">
          <label className="block">
            <input type="file" onChange={(e) => onFile(fieldId, e.target.files?.[0])}
              className="hidden" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
              required={required && !hasFile} />
            <div className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-primary hover:bg-primary-50/40 transition-colors group">
              <div className="text-center pointer-events-none">
                {hasFile ? (
                  <><File className="w-9 h-9 text-emerald-500 mx-auto mb-1.5" /><p className="text-sm text-emerald-600 font-medium">{files[fieldId]?.name}</p><p className="text-xs text-gray-400 mt-1">Click to change</p></>
                ) : (
                  <><Upload className="w-9 h-9 text-gray-400 mx-auto mb-1.5 group-hover:text-primary" /><p className="text-sm text-gray-600 group-hover:text-primary font-medium">Upload file</p><p className="text-xs text-gray-400 mt-0.5">PDF, JPG, PNG, DOC, XLS</p></>
                )}
              </div>
            </div>
          </label>
          {hasFile && (
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <File className="w-4 h-4 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-gray-900 font-medium truncate">{files[fieldId]?.name}</p>
                  <p className="text-xs text-gray-400">{files[fieldId]?.size ? `${(files[fieldId].size / 1024).toFixed(1)} KB` : ''}</p>
                </div>
              </div>
              <button type="button" onClick={() => onRemoveFile(fieldId)} className="p-1.5 hover:bg-gray-200 rounded-lg ml-2 flex-shrink-0">
                <X size={15} className="text-gray-500" />
              </button>
            </div>
          )}
          {placeholder && <p className="text-xs text-gray-500">{placeholder}</p>}
        </div>
      );
    case 'date':
      return (
        <input type="date" value={value} onChange={onChange} required={required}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary transition-all text-[16px]" />
      );
    default:
      return (
        <input type="text" value={value} onChange={onChange}
          placeholder={placeholder || `Enter ${label}`} required={required}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-[16px]" />
      );
  }
}, (prev, next) => {
  const fid = prev.field.fieldId;
  return (
    prev.formData[fid] === next.formData[fid] &&
    prev.files[fid] === next.files[fid] &&
    prev.onInput === next.onInput &&
    prev.onCheck === next.onCheck &&
    prev.onFile === next.onFile &&
    prev.onRemoveFile === next.onRemoveFile
  );
});

// ─── SINGLE TRACK STEP ────────────────────────────────────────────────────────
const TrackStepItem = ({ step, isLast }) => {
  const cfg = STEP_STATUS_CONFIG[step.status] || STEP_STATUS_CONFIG.PENDING;
  const Icon = cfg.icon;
  const isDone = step.status === 'COMPLETED';
  const isError = step.status === 'ERROR';

  return (
    <div className="flex gap-3">
      {/* Timeline */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
          isDone ? 'bg-emerald-500 border-emerald-200 shadow-emerald-100 shadow-sm'
          : isError ? 'bg-rose-500 border-rose-200'
          : step.status === 'PROCESSING' ? 'bg-primary border-primary-200'
          : 'bg-gray-100 border-gray-200'
        }`}>
          {isDone ? <Check size={15} className="text-white" />
            : isError ? <XCircle size={15} className="text-white" />
            : step.status === 'PROCESSING' ? <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
            : <span className="text-xs font-bold text-gray-400">{step.order}</span>}
        </div>
        {!isLast && (
          <div className={`w-0.5 flex-1 mt-1.5 ${isDone ? 'bg-emerald-300' : 'bg-gray-200'}`} style={{ minHeight: 20 }} />
        )}
      </div>

      {/* Content */}
      <div className={`flex-1 mb-3 rounded-xl border p-4 ${cfg.bg} ${cfg.border}`}>
        <div className="flex items-start justify-between gap-2 flex-wrap">
          <div className="flex-1 min-w-0">
            <p className={`font-semibold text-sm ${isDone ? 'text-emerald-900' : isError ? 'text-rose-900' : 'text-gray-900'}`}>
              {step.title}
            </p>
            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{step.description}</p>
            {isError && step.remarks && (
              <div className="mt-2 px-3 py-2 bg-rose-100 border border-rose-200 rounded-lg">
                <p className="text-xs font-semibold text-rose-700 mb-0.5">Reason:</p>
                <p className="text-xs text-rose-600 italic">"{step.remarks}"</p>
              </div>
            )}
            {step.updatedAt && step.updatedAt !== step.createdAt && (
              <p className="text-xs text-gray-400 mt-1.5">Updated: {formatDateShort(step.updatedAt)}</p>
            )}
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold flex-shrink-0 ${cfg.badge}`}>
            {cfg.label}
          </span>
        </div>
      </div>
    </div>
  );
};

// ─── SERVICE PERIOD CARD (for recurring services) ─────────────────────────────
const ServicePeriodCard = ({ period, isFirst }) => {
  const [expanded, setExpanded] = useState(isFirst);
  const pct = period.completionPercent || 0;

  const periodStatusMap = {
    COMPLETED: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700' },
    PROCESSING: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700' },
    PENDING: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-600', badge: 'bg-gray-100 text-gray-600' },
  };
  const pCfg = periodStatusMap[period.status] || periodStatusMap.PENDING;

  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${pCfg.border} ${period.isLocked ? 'opacity-70' : ''}`}>
      {/* Period Header */}
      <button
        className={`w-full flex items-center justify-between p-4 text-left transition-colors ${pCfg.bg} hover:brightness-95`}
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
            period.isLocked ? 'bg-gray-200' : pct === 100 ? 'bg-emerald-100' : 'bg-white/70'
          }`}>
            {period.isLocked
              ? <Lock size={14} className="text-gray-500" />
              : pct === 100 ? <CheckCircle size={14} className="text-emerald-600" />
              : <Calendar size={14} className={pCfg.text} />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-sm text-gray-900">{period.periodLabel}</span>
              {period.isLocked && (
                <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded-full font-medium">Locked</span>
              )}
              <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${pCfg.badge}`}>
                {period.status}
              </span>
            </div>
            {(period.startDate || period.endDate) && (
              <p className="text-xs text-gray-500 mt-0.5">
                {formatDateShort(period.startDate)} – {formatDateShort(period.endDate)}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 ml-3">
          <div className="text-right hidden sm:block">
            <span className="text-sm font-bold text-gray-900">{pct}%</span>
            <div className="w-20 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
          </div>
          {expanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
        </div>
      </button>

      {/* Period Steps */}
      {expanded && period.periodStep && period.periodStep.length > 0 && (
        <div className="p-4 bg-white border-t border-gray-100">
          {/* Mobile progress */}
          <div className="flex items-center justify-between mb-3 sm:hidden">
            <span className="text-xs text-gray-500">Period Progress</span>
            <span className="text-sm font-bold text-primary">{pct}%</span>
          </div>
          <div className="sm:hidden h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pct}%` }} />
          </div>

          {period.isLocked ? (
            <div className="flex items-center gap-3 py-4 px-3 bg-gray-50 rounded-lg border border-gray-200">
              <Lock size={16} className="text-gray-400 flex-shrink-0" />
              <p className="text-sm text-gray-500">This period is locked. Steps will be available when unlocked by our team.</p>
            </div>
          ) : (
            <div className="space-y-0">
              {[...period.periodStep]
                .sort((a, b) => a.order - b.order)
                .map((step, i, arr) => (
                  <TrackStepItem
                    key={step.periodStepId || i}
                    step={step}
                    isLast={i === arr.length - 1}
                  />
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── TRACK STEPS (application track steps) ────────────────────────────────────
const TrackSteps = ({ application }) => {
  if (!application) return null;

  const hasApplicationTrackSteps = application.applicationTrackStep && application.applicationTrackStep.length > 0;
  const hasServicePeriods = application.servicePeriod && application.servicePeriod.length > 0;

  // Progress calculation for application track steps
  const appSteps = [...(application.applicationTrackStep || [])].sort((a, b) => a.order - b.order);
  const appDone = appSteps.filter(s => s.status === 'COMPLETED').length;
  const appPct = appSteps.length ? Math.round((appDone / appSteps.length) * 100) : 0;

  // Progress for periods
  const periodDone = (application.servicePeriod || []).filter(p => p.status === 'COMPLETED').length;
  const periodTotal = (application.servicePeriod || []).length;
  const periodPct = periodTotal ? Math.round((periodDone / periodTotal) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Overall Progress Bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">Application Progress</span>
          <span className="text-sm font-bold text-primary">
            {hasServicePeriods ? periodPct : appPct}%
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r ${primary.gradient} rounded-full transition-all duration-700`}
            style={{ width: `${hasServicePeriods ? periodPct : appPct}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1.5">
          {hasServicePeriods
            ? `${periodDone} of ${periodTotal} periods completed`
            : `${appDone} of ${appSteps.length} steps completed`
          }
        </p>
      </div>

      {/* Application Track Steps (One-time services) */}
      {hasApplicationTrackSteps && (
        <div>
          {appSteps.map((step, idx) => (
            <TrackStepItem key={step.applicationTrackStepId} step={step} isLast={idx === appSteps.length - 1} />
          ))}
        </div>
      )}

      {/* Service Periods (Recurring services) */}
      {hasServicePeriods && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={15} className="text-violet-600" />
            <h4 className="text-sm font-semibold text-gray-800">Subscription Periods</h4>
            <span className="px-2 py-0.5 bg-violet-100 text-violet-700 text-xs rounded-full font-medium">
              {periodTotal} periods
            </span>
          </div>
          {[...application.servicePeriod]
            .sort((a, b) => new Date(a.startDate || 0) - new Date(b.startDate || 0))
            .map((period, i) => (
              <ServicePeriodCard key={period.servicePeriodId || i} period={period} isFirst={i === 0} />
            ))}
        </div>
      )}

      {/* No tracking data yet */}
      {!hasApplicationTrackSteps && !hasServicePeriods && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700 flex items-center gap-2">
          <AlertCircleIcon size={16} className="flex-shrink-0" />
          Tracking will appear once our team starts processing your application.
        </div>
      )}

      {/* Submitted form data */}
      {application.formData && Object.keys(application.formData).length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <FileText size={15} className="text-gray-400" /> Submitted Information
          </h4>
          <div className="space-y-1.5">
            {Object.entries(application.formData).map(([k, v]) => {
              const isFileObj = v && typeof v === 'object' && v.url;
              return (
                <div key={k} className="flex gap-3 py-1.5 border-b border-gray-100 last:border-0 items-start">
                  <span className="text-xs text-gray-400 w-28 flex-shrink-0 pt-0.5 font-medium capitalize">
                    {k.replace(/_/g, ' ')}
                  </span>
                  {isFileObj ? (
                    <a href={v.url} target="_blank" rel="noopener noreferrer"
                      className="text-sm text-primary underline flex items-center gap-1 font-medium">
                      <File size={12} /> View File
                    </a>
                  ) : (
                    <span className="text-sm text-gray-900">{String(v)}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Admin note */}
      {application.adminNote && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
          <AlertCircleIcon size={17} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-amber-800 mb-0.5">Note from Our Team</p>
            <p className="text-sm text-amber-700">{application.adminNote}</p>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── SERVICE DETAIL MODAL ──────────────────────────────────────────────────────
const ServiceDetailModal = ({ selectedService, onClose }) => {
  if (!selectedService) return null;
  const svc = selectedService.service;
  const app = selectedService.application;
  const isRecurring = svc.serviceType === 'RECURRING';

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[540px] bg-white shadow-2xl z-50 border-l border-gray-200 flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white flex-shrink-0">
        <button onClick={onClose} className={`flex items-center gap-2 ${primary.text} font-medium text-sm hover:${primary.bgVeryLight} px-3 py-1.5 rounded-lg transition-colors`}>
          <X size={18} /> Close
        </button>
        <button className={`flex items-center gap-2 ${primary.bg} text-white px-4 py-2 rounded-lg text-sm font-semibold ${primary.hover} transition-colors`}>
          <Phone size={15} /> Call Expert
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
        <div className="p-6 space-y-6">
          {/* Title & Status */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{svc.name}</h2>
              <p className="text-xs text-gray-400 font-mono mt-0.5">ID: {selectedService.myServiceId}</p>
            </div>
            <StatusBadge status={selectedService.status} />
          </div>

          {/* Image */}
          <div className="rounded-xl overflow-hidden border border-gray-200 h-44 bg-gray-100">
            <img
              src={svc.photoUrl || `https://via.placeholder.com/800x352/2563eb/ffffff?text=${encodeURIComponent(svc.name?.[0] || 'S')}`}
              alt={svc.name} className="w-full h-full object-cover"
            />
          </div>

          {/* Description & Tags */}
          <div>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">{svc.description}</p>
            <div className="flex flex-wrap gap-2">
              <ServiceTypeBadge type={svc.serviceType} />
              {svc.frequency && (
                <span className="px-2.5 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded-full border border-purple-200 flex items-center gap-1">
                  <Calendar size={11} /> {svc.frequency.toLowerCase()}
                </span>
              )}
              {svc.duration && (
                <span className="px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full border border-gray-200 flex items-center gap-1">
                  <Clock size={11} /> {svc.duration} {svc.durationUnit?.toLowerCase()}
                </span>
              )}
            </div>
          </div>

          {/* Recurring service summary */}
          {isRecurring && app?.servicePeriod && app.servicePeriod.length > 0 && (
            <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calendar size={15} className="text-violet-600" />
                <h4 className="text-sm font-semibold text-violet-900">Subscription Overview</h4>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white rounded-lg p-2.5 border border-violet-100 text-center">
                  <p className="text-lg font-bold text-violet-700">{app.servicePeriod.length}</p>
                  <p className="text-xs text-gray-500">Total Periods</p>
                </div>
                <div className="bg-white rounded-lg p-2.5 border border-violet-100 text-center">
                  <p className="text-lg font-bold text-emerald-600">
                    {app.servicePeriod.filter(p => p.status === 'COMPLETED').length}
                  </p>
                  <p className="text-xs text-gray-500">Completed</p>
                </div>
                <div className="bg-white rounded-lg p-2.5 border border-violet-100 text-center">
                  <p className="text-lg font-bold text-blue-600">
                    {app.servicePeriod.filter(p => !p.isLocked).length}
                  </p>
                  <p className="text-xs text-gray-500">Active</p>
                </div>
              </div>
            </div>
          )}

          {/* Application tracking */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2 text-sm">
              <CalendarClock size={16} className="text-gray-400" />
              {isRecurring ? 'Subscription Tracking' : 'Application Tracking'}
            </h3>
            {app ? (
              <TrackSteps application={app} />
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-700">
                No application started yet.
              </div>
            )}
          </div>

          {/* Payment */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-5 text-white">
            <h3 className="font-semibold mb-4 flex items-center gap-2 text-sm">
              <DollarSign size={16} className="opacity-80" /> Payment Details
            </h3>
            <div className="space-y-2.5">
              <div className="flex justify-between text-sm">
                <span className="opacity-70">Service Price</span>
                <span className="font-semibold">₹{formatPrice(svc.offerPrice)}</span>
              </div>
              {svc.isGstApplicable === 'true' && (
                <div className="flex justify-between text-sm">
                  <span className="opacity-70">GST ({svc.gstPercentage}%)</span>
                  <span className="font-semibold">₹{formatPrice((svc.offerPrice * svc.gstPercentage) / 100)}</span>
                </div>
              )}
              <div className="border-t border-white/20 pt-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold">Total Paid</span>
                  <span className="text-xl font-extrabold">₹{formatPrice(svc.finalIndividualPrice)}</span>
                </div>
                <p className="text-xs opacity-50 mt-1.5 flex items-center gap-1">
                  <Check size={10} className="text-emerald-400" /> {formatDate(selectedService.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Meta info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-400 mb-1">Purchase Date</p>
              <p className="font-semibold text-sm text-gray-900">{formatDate(selectedService.createdAt)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="text-xs text-gray-400 mb-1">Documents</p>
              <p className={`font-semibold text-sm ${svc.documentsRequired === 'true' ? 'text-emerald-600' : 'text-gray-500'}`}>
                {svc.documentsRequired === 'true' ? 'Required' : 'Not Required'}
              </p>
            </div>
          </div>

          {/* Support */}
          <div className={`${primary.bgVeryLight} ${primary.borderLight} border rounded-xl p-5`}>
            <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2 text-sm">
              <Headphones size={16} className={primary.text} /> Need Help?
            </h3>
            <p className="text-xs text-gray-500 mb-4">Our support team is available 24/7.</p>
            <div className="space-y-2">
              <button className={`w-full ${primary.bg} text-white py-2.5 rounded-lg text-sm font-semibold ${primary.hover} transition-colors flex items-center justify-center gap-2`}>
                <MessageSquare size={15} /> Chat with Support
              </button>
              <button className="w-full border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <Phone size={15} /> Call +91-9876543210
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── INPUT FORM MODAL ──────────────────────────────────────────────────────────
const InputFormModal = ({
  showInputForm, selectedServiceForInput, serviceDetails,
  loadingServiceDetails, submitSuccess, submitting, submitError,
  formData, files, onClose, onSubmit, onInput, onCheck, onFile, onRemoveFile,
}) => {
  if (!showInputForm || !selectedServiceForInput) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[520px] bg-white shadow-2xl z-[60] border-l border-gray-200 flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-white flex-shrink-0">
        <button onClick={onClose} className={`flex items-center gap-2 ${primary.text} font-medium text-sm hover:${primary.bgVeryLight} px-3 py-1.5 rounded-lg transition-colors`}>
          <X size={18} /> Close
        </button>
        {!loadingServiceDetails && !submitSuccess && selectedServiceForInput.status === 'NOT_STARTED' && (
          <button onClick={onSubmit} disabled={submitting}
            className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50">
            {submitting
              ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting…</>
              : <><Play size={15} /> Start Service</>}
          </button>
        )}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
        {loadingServiceDetails ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className={`w-12 h-12 border-4 ${primary.border} border-t-transparent rounded-full animate-spin`} />
            <p className="text-gray-500">Loading service requirements…</p>
          </div>
        ) : submitSuccess ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-5">
              <Check className="w-10 h-10 text-emerald-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
            <p className="text-gray-500 mb-7 text-sm">Our team will review and get started shortly.</p>
            <button onClick={onClose} className={`px-6 py-3 ${primary.bg} text-white rounded-xl font-semibold ${primary.hover}`}>Close</button>
          </div>
        ) : (
          <div className="p-6 space-y-6 pb-12">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedServiceForInput.service?.name}</h2>
                <p className="text-xs text-gray-400 font-mono mt-0.5">ID: {selectedServiceForInput.myServiceId}</p>
              </div>
              <StatusBadge status={selectedServiceForInput.status} />
            </div>

            <div className="rounded-xl overflow-hidden border border-gray-200 h-40 bg-gray-100">
              <img
                src={selectedServiceForInput.service?.photoUrl || `https://via.placeholder.com/800x320/2563eb/ffffff?text=${encodeURIComponent(selectedServiceForInput.service?.name?.[0] || 'S')}`}
                alt={selectedServiceForInput.service?.name} className="w-full h-full object-cover"
              />
            </div>

            <p className="text-gray-500 text-sm leading-relaxed">{selectedServiceForInput.service?.description}</p>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
              <AlertCircleIcon size={17} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-900 mb-0.5">Required Information</p>
                <p className="text-xs text-amber-700">
                  Fill in the details below. Fields marked <span className="text-rose-500 font-bold">*</span> are required.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {serviceDetails?.inputFields?.map((field) => {
                if (!field.fieldId) return null;
                return (
                  <div key={field.fieldId} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-semibold text-gray-900">
                        {field.label}{field.required && <span className="text-rose-500 ml-1">*</span>}
                      </label>
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-400 rounded capitalize">{field.type}</span>
                    </div>
                    <InputField
                      field={field} formData={formData} files={files}
                      onInput={onInput} onCheck={onCheck} onFile={onFile} onRemoveFile={onRemoveFile}
                    />
                    {field.placeholder && field.type?.toLowerCase() !== 'file' && (
                      <p className="text-xs text-gray-400">{field.placeholder}</p>
                    )}
                  </div>
                );
              })}
            </div>

            {submitError && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex gap-3">
                <AlertCircleIcon className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-rose-700">{submitError}</p>
              </div>
            )}

            <button onClick={onSubmit} disabled={submitting}
              className={`w-full py-4 bg-gradient-to-r ${primary.gradient} text-white rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg`}>
              {submitting
                ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting…</>
                : <><Play size={18} /> Start Service Now</>}
            </button>
            <p className="text-center text-xs text-gray-400">By submitting, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
export default function MyService() {
  const [myServices, setMyServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [selectedService, setSelectedService] = useState(null);
  const [showInputForm, setShowInputForm] = useState(false);
  const [selectedServiceForInput, setSelectedServiceForInput] = useState(null);
  const [serviceDetails, setServiceDetails] = useState(null);
  const [loadingServiceDetails, setLoadingServiceDetails] = useState(false);
  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [fieldLabelMapping, setFieldLabelMapping] = useState({});
  const [isModalTransitioning, setIsModalTransitioning] = useState(false);

  // List state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredServices, setFilteredServices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ total: 0, active: 0, completed: 0, pending: 0 });

  const filePreviewRefs = useRef({});
  const userId = 'cmjsacjjh0000tzdotm5dqv7r';

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`https://insightsconsult-backend.onrender.com/my-services/${userId}`);
      if (res.data.success) {
        const s = res.data.services;
        setMyServices(s);
        setStats({
          total: s.length,
          active: s.filter(x => x.status === 'IN_PROGRESS').length,
          completed: s.filter(x => x.status === 'COMPLETED').length,
          pending: s.filter(x => x.status === 'NOT_STARTED' || x.status === 'ON_HOLD').length,
        });
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  // ── Filtering ────────────────────────────────────────────────────────────
  useEffect(() => {
    let r = myServices;
    if (searchQuery) r = r.filter(s =>
      s.service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.service.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (statusFilter !== 'all') r = r.filter(s => s.status === statusFilter);
    setFilteredServices(r);
    setTotalPages(Math.ceil(r.length / itemsPerPage) || 1);
    setCurrentPage(1);
  }, [searchQuery, statusFilter, myServices, itemsPerPage]);

  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, '...', totalPages];
    if (currentPage >= totalPages - 2) return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  const handlePageChange = (p) => {
    if (p >= 1 && p <= totalPages) {
      setCurrentPage(p);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ── Modal handlers ────────────────────────────────────────────────────────
  const handleCloseModal = useCallback(() => {
    Object.values(filePreviewRefs.current).forEach(url => url && URL.revokeObjectURL(url));
    filePreviewRefs.current = {};
    setSelectedService(null);
    setShowInputForm(false);
    setSelectedServiceForInput(null);
    setServiceDetails(null);
    setFormData({});
    setFiles({});
    setSubmitError('');
    setSubmitSuccess(false);
    setFieldLabelMapping({});
  }, []);

  const handleViewDetails = useCallback((myService) => {
    if (isModalTransitioning) return;
    setIsModalTransitioning(true);
    if (selectedService || showInputForm) {
      handleCloseModal();
      setTimeout(() => { setSelectedService(myService); setIsModalTransitioning(false); }, 250);
    } else {
      setSelectedService(myService);
      setIsModalTransitioning(false);
    }
  }, [isModalTransitioning, selectedService, showInputForm, handleCloseModal]);

  const handleGetStarted = useCallback(async (myService) => {
    if (isModalTransitioning) return;
    setIsModalTransitioning(true);
    if (selectedService || showInputForm) {
      handleCloseModal();
      await new Promise(r => setTimeout(r, 250));
    }
    setSelectedServiceForInput(myService);
    setShowInputForm(true);
    setLoadingServiceDetails(true);
    setFormData({}); setFiles({}); setSubmitError(''); setSubmitSuccess(false);

    try {
      const serviceId = myService?.service?.serviceId;
      if (!serviceId) throw new Error('No serviceId');
      const res = await axiosInstance.get(`https://insightsconsult-backend.onrender.com/service/${serviceId}`);
      if (res.data.success) {
        setServiceDetails(res.data.service);
        const init = {}; const mapping = {};
        res.data.service.inputFields?.forEach(f => {
          if (!f.fieldId) return;
          mapping[f.fieldId] = f.label;
          init[f.fieldId] = (f.type === 'checkbox' || f.type === 'multiselect') ? [] : f.type === 'file' ? null : '';
        });
        setFormData(init); setFieldLabelMapping(mapping);
      }
    } catch (e) {
      console.error(e);
      setSubmitError('Failed to load service details.');
    } finally {
      setLoadingServiceDetails(false);
      setIsModalTransitioning(false);
    }
  }, [isModalTransitioning, selectedService, showInputForm, handleCloseModal]);

  // ── Stable form handlers ──────────────────────────────────────────────────
  const handleInput = useCallback((fieldId, value) =>
    setFormData(p => ({ ...p, [fieldId]: value })), []);

  const handleCheck = useCallback((fieldId, option) =>
    setFormData(p => {
      const cur = p[fieldId] || [];
      return { ...p, [fieldId]: cur.includes(option) ? cur.filter(x => x !== option) : [...cur, option] };
    }), []);

  const handleFile = useCallback((fieldId, file) => {
    if (!file) return;
    if (filePreviewRefs.current[fieldId]) URL.revokeObjectURL(filePreviewRefs.current[fieldId]);
    filePreviewRefs.current[fieldId] = URL.createObjectURL(file);
    setFiles(p => ({ ...p, [fieldId]: file }));
    setFormData(p => ({ ...p, [fieldId]: 'file_uploaded' }));
  }, []);

  const handleRemoveFile = useCallback((fieldId) => {
    if (filePreviewRefs.current[fieldId]) {
      URL.revokeObjectURL(filePreviewRefs.current[fieldId]);
      delete filePreviewRefs.current[fieldId];
    }
    setFiles(p => { const n = { ...p }; delete n[fieldId]; return n; });
    setFormData(p => ({ ...p, [fieldId]: null }));
  }, []);

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    if (!selectedServiceForInput || !serviceDetails) return;
    const missing = serviceDetails.inputFields?.filter(f => {
      if (!f.required) return false;
      const v = formData[f.fieldId];
      return !v || (Array.isArray(v) && !v.length);
    }).map(f => f.label) || [];
    if (missing.length) { setSubmitError(`Please fill required fields: ${missing.join(', ')}`); return; }

    setSubmitting(true); setSubmitError('');
    try {
      const fd = new FormData();
      fd.append('serviceId', serviceDetails.serviceId);
      Object.entries(formData).forEach(([fid, val]) => {
        const lbl = fieldLabelMapping[fid];
        if (!lbl || files[fid]) return;
        if (Array.isArray(val)) fd.append(lbl, JSON.stringify(val));
        else if (val) fd.append(lbl, val);
      });
      Object.entries(files).forEach(([fid, file]) => {
        const lbl = fieldLabelMapping[fid];
        if (lbl && file) fd.append(lbl, file);
      });
      const res = await axiosInstance.post(
        `/application/start/apply/${selectedServiceForInput.myServiceId}`, fd,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      if (res.data.success) {
        setSubmitSuccess(true);
        setTimeout(() => { handleCloseModal(); fetchServices(); }, 2000);
      } else setSubmitError(res.data.message || 'Submission failed');
    } catch (e) {
      setSubmitError(e.response?.data?.message || 'Submission failed. Please try again.');
    } finally { setSubmitting(false); }
  }, [selectedServiceForInput, serviceDetails, formData, files, fieldLabelMapping, handleCloseModal, fetchServices]);

  // ── Get step status from application (to show on card) ────────────────────
  const getApplicationStatus = (myService) => {
    const app = myService.application;
    if (!app) return null;

    // Check for any ERROR steps — surface it prominently
    const hasError = app.applicationTrackStep?.some(s => s.status === 'ERROR') ||
      app.servicePeriod?.some(p => p.periodStep?.some(s => s.status === 'ERROR'));
    if (hasError) return 'error';

    const hasProcessing = app.applicationTrackStep?.some(s => s.status === 'PROCESSING') ||
      app.servicePeriod?.some(p => p.periodStep?.some(s => s.status === 'PROCESSING'));
    if (hasProcessing) return 'processing';

    return null;
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @media(max-width:768px){input,textarea,select{font-size:16px!important}}
        :root {
          --primary: #2563eb;
          --primary-dark: #1d4ed8;
          --primary-50: #eff6ff;
          --primary-100: #dbeafe;
          --primary-200: #bfdbfe;
        }
      `}</style>

      {/* Backdrop */}
      {(selectedService || showInputForm) && (
        <div className="fixed inset-0 bg-black/20 z-40" onClick={handleCloseModal} />
      )}

      {/* Modals */}
      <ServiceDetailModal selectedService={selectedService} onClose={handleCloseModal} />
      <InputFormModal
        showInputForm={showInputForm}
        selectedServiceForInput={selectedServiceForInput}
        serviceDetails={serviceDetails}
        loadingServiceDetails={loadingServiceDetails}
        submitSuccess={submitSuccess}
        submitting={submitting}
        submitError={submitError}
        formData={formData}
        files={files}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        onInput={handleInput}
        onCheck={handleCheck}
        onFile={handleFile}
        onRemoveFile={handleRemoveFile}
      />

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-5">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className={`p-2 ${primary.bgLight} rounded-xl`}>
                  <Package className={primary.text} size={26} />
                </div>
                My Services
              </h1>
              <p className="text-gray-400 mt-1 text-sm">Manage and track all your purchased services</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
                <input type="text" placeholder="Search services…" value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2.5 border border-gray-200 bg-gray-50 text-sm rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent w-60 focus:bg-white transition-all" />
              </div>
              <div className="relative group">
                <button className="px-4 py-2.5 border border-gray-200 bg-gray-50 rounded-xl hover:bg-white flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Filter size={16} className="text-gray-500" /> Filter
                </button>
                <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  <p className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider border-b border-gray-100">Status</p>
                  {Object.entries(STATUS_COLORS).map(([s, cfg]) => (
                    <button key={s} onClick={() => setStatusFilter(statusFilter === s ? 'all' : s)}
                      className="w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between">
                      <span className="flex items-center gap-2.5">
                        <cfg.icon size={14} className={cfg.iconColor} />{cfg.label}
                      </span>
                      {statusFilter === s && <Check size={13} className={primary.text} />}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={fetchServices}
                className="p-2.5 border border-gray-200 bg-gray-50 rounded-xl hover:bg-white text-gray-500 hover:text-primary transition-colors"
                title="Refresh"
              >
                <RefreshCw size={16} />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
            <StatsCard title="Total Services" value={stats.total} Icon={Package} colorBg={primary.bgLight} colorText={primary.text} desc="All purchased" />
            <StatsCard title="Active" value={stats.active} Icon={TrendingUp} colorBg="bg-emerald-100" colorText="text-emerald-600" desc="In progress" />
            <StatsCard title="Completed" value={stats.completed} Icon={CheckCircle} colorBg="bg-purple-100" colorText="text-purple-600" desc="Delivered" />
            <StatsCard title="Pending" value={stats.pending} Icon={Clock} colorBg="bg-amber-100" colorText="text-amber-600" desc="Awaiting action" />
          </div>

          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border flex items-center gap-1.5 ${statusFilter === 'all' ? `${primary.bg} text-white ${primary.border} shadow-sm` : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`}>
              <Layers size={14} /> All ({stats.total})
            </button>
            {Object.entries(STATUS_COLORS).map(([status, cfg]) => {
              const cnt = myServices.filter(s => s.status === status).length;
              const Icon = cfg.icon;
              return (
                <button key={status} onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border flex items-center gap-1.5 ${statusFilter === status ? `${cfg.bg} ${cfg.text} border-current shadow-sm` : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`}>
                  <Icon size={14} className={cfg.iconColor} /> {cfg.label} ({cnt})
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Grid ──────────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className={`w-14 h-14 border-4 ${primary.border} border-t-transparent rounded-full animate-spin`} />
            <p className="text-gray-500">Loading your services…</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
            <Search className="text-gray-200 mx-auto mb-5" size={52} />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No services found</h3>
            <p className="text-gray-400 mb-7 text-sm">
              {searchQuery || statusFilter !== 'all' ? 'No services match your filters.' : "You haven't purchased any services yet."}
            </p>
            <button
              onClick={() => searchQuery || statusFilter !== 'all' ? (setSearchQuery(''), setStatusFilter('all')) : window.location.href = '/services'}
              className={`px-6 py-2.5 ${primary.bg} text-white rounded-xl font-semibold ${primary.hover} text-sm mx-auto flex items-center gap-2`}>
              {searchQuery || statusFilter !== 'all'
                ? <><Filter size={15} /> Clear Filters</>
                : <><Sparkles size={15} /> Browse Services</>}
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-xl border border-gray-100">
              <p className="text-sm text-gray-500">
                Showing <strong className="text-gray-800">{paginatedServices.length}</strong> of <strong className="text-gray-800">{filteredServices.length}</strong> services
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Show:</span>
                <select value={itemsPerPage} onChange={e => setItemsPerPage(Number(e.target.value))}
                  className="border border-gray-200 bg-gray-50 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-primary">
                  {[6, 9, 12, 15].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedServices.map(myService => {
                const svc = myService.service;
                const progress = getProgress(myService.status);
                const daysAgo = Math.floor((Date.now() - new Date(myService.createdAt)) / 86400000);
                const isRecurring = svc.serviceType === 'RECURRING';
                const appStatus = getApplicationStatus(myService);
                const app = myService.application;

                // For recurring — period count
                const periodCount = app?.servicePeriod?.length || 0;
                const periodDone = app?.servicePeriod?.filter(p => p.status === 'COMPLETED').length || 0;

                // For application track steps
                const stepCount = app?.applicationTrackStep?.length || 0;
                const stepDone = app?.applicationTrackStep?.filter(s => s.status === 'COMPLETED').length || 0;

                return (
                  <div key={myService.myServiceId}
                    className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden bg-gray-100">
                      <img
                        src={svc.photoUrl || `https://via.placeholder.com/400x208/2563eb/ffffff?text=${encodeURIComponent(svc.name?.[0] || 'S')}`}
                        alt={svc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      <div className="absolute top-3 left-3"><StatusBadge status={myService.status} /></div>
                      <div className="absolute top-3 right-3"><ServiceTypeBadge type={svc.serviceType} /></div>

                      {/* Error/Processing indicator on card */}
                      {appStatus === 'error' && (
                        <div className="absolute bottom-10 right-3">
                          <span className="flex items-center gap-1 px-2 py-1 bg-rose-500 text-white text-xs font-bold rounded-lg shadow">
                            <AlertCircleIcon size={11} /> Action Needed
                          </span>
                        </div>
                      )}
                      {appStatus === 'processing' && (
                        <div className="absolute bottom-10 right-3">
                          <span className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded-lg shadow">
                            <RefreshCw size={11} className="animate-spin" /> Processing
                          </span>
                        </div>
                      )}

                      <div className="absolute bottom-3 left-3 right-3 flex justify-between">
                        <span className="text-white font-bold text-lg drop-shadow">₹{formatPrice(svc.finalIndividualPrice)}</span>
                        <span className="px-2.5 py-1 bg-white/20 backdrop-blur-sm rounded-lg text-white text-xs font-medium">
                          {daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo}d ago`}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">{svc.name}</h3>
                      <p className="text-gray-400 text-sm line-clamp-2 mb-4">{svc.description}</p>

                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-gray-400 font-medium flex items-center gap-1">
                            <TrendingUp size={11} /> Progress
                          </span>
                          <span className={`font-bold ${primary.text}`}>{progress}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full bg-gradient-to-r ${primary.gradient} rounded-full`} style={{ width: `${progress}%` }} />
                        </div>
                      </div>

                      {/* Info grid */}
                      {isRecurring ? (
                        /* Recurring service info */
                        <div className="grid grid-cols-2 gap-2 mb-5">
                          <div className="bg-violet-50 rounded-lg p-2.5 border border-violet-100">
                            <p className="text-xs text-gray-400 mb-0.5 flex items-center gap-1">
                              <Calendar size={10} className="text-violet-500" /> Periods
                            </p>
                            <p className="font-semibold text-gray-900 text-sm">
                              {periodDone}/{periodCount}
                              <span className="text-xs text-gray-400 ml-1 font-normal">done</span>
                            </p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-2.5">
                            <p className="text-xs text-gray-400 mb-0.5 flex items-center gap-1">
                              <Clock size={10} /> Frequency
                            </p>
                            <p className="font-semibold text-gray-900 text-sm capitalize">
                              {svc.frequency?.toLowerCase() || 'Recurring'}
                            </p>
                          </div>
                        </div>
                      ) : (
                        /* One-time service info */
                        <div className="grid grid-cols-2 gap-2 mb-5">
                          <div className="bg-gray-50 rounded-lg p-2.5">
                            <p className="text-xs text-gray-400 mb-0.5 flex items-center gap-1"><Clock size={10} /> Duration</p>
                            <p className="font-semibold text-gray-900 text-sm">
                              {svc.duration ? `${svc.duration} ${svc.durationUnit?.toLowerCase()}` : 'N/A'}
                            </p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-2.5">
                            <p className="text-xs text-gray-400 mb-0.5 flex items-center gap-1"><BarChart size={10} /> Steps</p>
                            <p className="font-semibold text-gray-900 text-sm">
                              {stepCount > 0 ? `${stepDone}/${stepCount} done` : 'N/A'}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Buttons */}
                      <div className="flex gap-2.5">
                        <button
                          onClick={() => handleViewDetails(myService)}
                          disabled={isModalTransitioning}
                          className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-50 flex items-center justify-center gap-1.5 disabled:opacity-50">
                          <Eye size={15} /> View
                        </button>
                        {myService.status === 'NOT_STARTED' ? (
                          <button
                            onClick={() => handleGetStarted(myService)}
                            disabled={isModalTransitioning}
                            className="flex-1 bg-emerald-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-600 flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50">
                            <Play size={15} /> Start
                          </button>
                        ) : appStatus === 'error' ? (
                          <button
                            onClick={() => handleViewDetails(myService)}
                            disabled={isModalTransitioning}
                            className="flex-1 bg-rose-500 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-rose-600 flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50">
                            <AlertCircleIcon size={15} /> View Issue
                          </button>
                        ) : (
                          <button
                            onClick={() => handleViewDetails(myService)}
                            disabled={isModalTransitioning}
                            className={`flex-1 ${primary.bg} text-white py-2.5 rounded-xl text-sm font-semibold ${primary.hover} flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50`}>
                            <ChevronRightIcon size={15} /> Details
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {filteredServices.length > itemsPerPage && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-400">
                  {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredServices.length)} of {filteredServices.length}
                </p>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}
                    className={`p-2 rounded-lg border flex items-center gap-1 text-sm ${currentPage === 1 ? 'border-gray-100 text-gray-300 cursor-not-allowed' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                    <ChevronLeft size={16} /> <span className="hidden sm:inline">Prev</span>
                  </button>
                  {getPageNumbers().map((pn, i) =>
                    pn === '...'
                      ? <span key={`d${i}`} className="px-2 text-gray-400"><MoreHorizontal size={14} /></span>
                      : <button key={pn} onClick={() => handlePageChange(pn)}
                          className={`min-w-[36px] h-9 rounded-lg text-sm font-medium ${currentPage === pn ? `${primary.bg} text-white shadow-sm` : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                          {pn}
                        </button>
                  )}
                  <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg border flex items-center gap-1 text-sm ${currentPage === totalPages ? 'border-gray-100 text-gray-300 cursor-not-allowed' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                    <span className="hidden sm:inline">Next</span> <ChevronRightIcon size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Support banner */}
        {!loading && filteredServices.length > 0 && (
          <div className={`mt-14 bg-gradient-to-r ${primary.gradient} rounded-2xl p-8 text-white`}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 rounded-xl flex-shrink-0"><Users size={26} /></div>
                <div>
                  <h3 className="text-xl font-bold mb-1">Premium Support Available 24/7</h3>
                  <p className="text-blue-100 text-sm">Get instant help via chat, phone, or email.</p>
                  <div className="flex gap-5 mt-3 text-sm text-blue-200">
                    <span className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" /> Avg: <strong className="text-white">2 min</strong>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-blue-300 rounded-full" /> Satisfaction: <strong className="text-white">98%</strong>
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <button className="px-5 py-2.5 bg-white text-primary rounded-xl font-semibold hover:bg-blue-50 text-sm flex items-center gap-2">
                  <MessageSquare size={15} /> Chat Now
                </button>
                <button className="px-5 py-2.5 bg-white/10 border border-white/30 text-white rounded-xl font-semibold hover:bg-white/20 text-sm flex items-center gap-2">
                  <HelpCircle size={15} /> Help Center
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}