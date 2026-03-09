import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://ats-env.eba-9hjpmsgu.us-east-1.elasticbeanstalk.comapi/admin';

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  bg: '#f8fafc',
  white: '#ffffff',
  border: '#e2e8f0',
  borderHover: '#cbd5e1',
  text: '#0f172a',
  textMd: '#334155',
  textSm: '#64748b',
  textXs: '#94a3b8',
  blue: '#2563eb',
  blueLt: '#eff6ff',
  blueBd: '#bfdbfe',
  green: '#16a34a',
  greenLt: '#f0fdf4',
  greenBd: '#bbf7d0',
  red: '#dc2626',
  redLt: '#fef2f2',
  redBd: '#fecaca',
  yellow: '#d97706',
  yellowLt: '#fffbeb',
  yellowBd: '#fde68a',
  purple: '#7c3aed',
  purpleLt: '#f5f3ff',
  purpleBd: '#ddd6fe',
  indigo: '#4f46e5',
  indigoLt: '#eef2ff',
  indigoBd: '#c7d2fe',
  gray100: '#f1f5f9',
  gray200: '#e2e8f0',
  gray300: '#cbd5e1',
  shadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
  shadowMd: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
  shadowLg: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)',
};

const s = {
  page: { padding: '32px 24px', maxWidth: 1280, margin: '80px auto 0 80px', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: C.bg, minHeight: '100vh' },
  row: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 },
  col: { display: 'flex', flexDirection: 'column', gap: 4 },
  flex: { display: 'flex', alignItems: 'center', gap: 8 },
  grid4: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 24 },
  card: { background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, boxShadow: C.shadow, overflow: 'hidden' },
  cardPad: { padding: '24px' },
  h1: { fontSize: 22, fontWeight: 700, color: C.text, margin: 0 },
  h3: { fontSize: 13, fontWeight: 600, color: C.textMd, margin: 0 },
  p: { fontSize: 13, color: C.textSm, margin: 0 },
  pxs: { fontSize: 11, color: C.textXs, margin: 0 },
  btnBase: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer', border: '1px solid', transition: 'all 0.15s ease' },
  btnGhost: { background: C.white, borderColor: C.border, color: C.textMd },
  btnBlue: { background: C.blue, borderColor: C.blue, color: '#fff' },
  btnRed: { background: C.red, borderColor: C.red, color: '#fff' },
  btnYellow: { background: C.yellow, borderColor: C.yellow, color: '#fff' },
  btnPurple: { background: C.purple, borderColor: C.purple, color: '#fff' },
  input: { width: '100%', padding: '8px 12px', border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, color: C.text, background: C.white, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 0.15s' },
  label: { fontSize: 13, fontWeight: 500, color: C.textMd, marginBottom: 4, display: 'block' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: C.textXs, textTransform: 'uppercase', letterSpacing: '0.05em', background: C.gray100, borderBottom: `1px solid ${C.border}`, whiteSpace: 'nowrap' },
  td: { padding: '14px 16px', fontSize: 13, color: C.textMd, borderBottom: `1px solid ${C.gray100}`, verticalAlign: 'middle' },
  badge: { display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600, border: '1px solid' },
};

const Icon = ({ d, size = 16, color = 'currentColor' }) => (
  <svg width={size} height={size} fill="none" stroke={color} viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
);

const ICONS = {
  building: ["M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"],
  check: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  shield: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z",
  users: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
  refresh: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
  download: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4",
  search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  eye: ["M15 12a3 3 0 11-6 0 3 3 0 016 0z", "M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"],
  edit: "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z",
  chat: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
  addUser: ["M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"],
  trash: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16",
  close: "M6 18L18 6M6 6l12 12",
  cal: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  clock: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  person: ["M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"],
  save: "M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4",
  paperclip: "M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13",
  upload: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12",
  xCircle: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
  fileDoc: ["M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"],
  work: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  money: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  book: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253",
  warn: "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  x: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
};

const Btn = ({ children, onClick, variant = 'ghost', disabled, style: extra = {}, size = 'md' }) => {
  const [hover, setHover] = useState(false);
  const pad = size === 'sm' ? '6px 12px' : '8px 16px';
  const base = { ...s.btnBase, padding: pad, opacity: disabled ? 0.5 : 1, cursor: disabled ? 'not-allowed' : 'pointer' };
  const variants = {
    ghost: { ...s.btnGhost, background: hover ? C.gray100 : C.white },
    blue: { ...s.btnBlue, background: hover ? '#1d4ed8' : C.blue },
    red: { ...s.btnRed, background: hover ? '#b91c1c' : C.red },
    yellow: { ...s.btnYellow, background: hover ? '#b45309' : C.yellow },
    purple: { ...s.btnPurple, background: hover ? '#6d28d9' : C.purple },
  };
  return (
    <button onClick={disabled ? undefined : onClick} disabled={disabled}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ ...base, ...variants[variant], ...extra }}>
      {children}
    </button>
  );
};

const Input = ({ label, required, ...props }) => {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && <label style={s.label}>{label}{required && <span style={{ color: C.red }}> *</span>}</label>}
      <input {...props} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{ ...s.input, borderColor: focus ? C.blue : C.border, boxShadow: focus ? `0 0 0 3px ${C.blueLt}` : 'none', ...props.style }} />
    </div>
  );
};

const Select = ({ label, required, children, ...props }) => {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && <label style={s.label}>{label}{required && <span style={{ color: C.red }}> *</span>}</label>}
      <select {...props} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{ ...s.input, appearance: 'none', WebkitAppearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2364748b' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: 36, borderColor: focus ? C.blue : C.border, boxShadow: focus ? `0 0 0 3px ${C.blueLt}` : 'none' }}>
        {children}
      </select>
    </div>
  );
};

const Textarea = ({ label, ...props }) => {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && <label style={s.label}>{label}</label>}
      <textarea {...props} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{ ...s.input, resize: 'vertical', borderColor: focus ? C.blue : C.border, boxShadow: focus ? `0 0 0 3px ${C.blueLt}` : 'none', fontFamily: 'inherit', ...props.style }} />
    </div>
  );
};

const Badge = ({ children, color = 'gray' }) => {
  const colors = {
    green: { background: C.greenLt, color: C.green, borderColor: C.greenBd },
    blue: { background: C.blueLt, color: C.blue, borderColor: C.blueBd },
    red: { background: C.redLt, color: C.red, borderColor: C.redBd },
    yellow: { background: C.yellowLt, color: C.yellow, borderColor: C.yellowBd },
    purple: { background: C.purpleLt, color: C.purple, borderColor: C.purpleBd },
    gray: { background: C.gray100, color: C.textSm, borderColor: C.border },
    indigo: { background: C.indigoLt, color: C.indigo, borderColor: C.indigoBd },
  };
  return <span style={{ ...s.badge, ...colors[color] }}>{children}</span>;
};

const Avatar = ({ color, size = 40, children }) => (
  <div style={{ width: size, height: size, borderRadius: 10, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
    {children}
  </div>
);

const Spinner = ({ size = 20, color = C.blue }) => (
  <div style={{ width: size, height: size, borderRadius: '50%', border: `2px solid ${color}30`, borderTopColor: color, animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />
);

const SectionTitle = ({ icon, children }) => (
  <div style={{ ...s.flex, gap: 6, marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${C.border}` }}>
    <Icon d={ICONS[icon]} color={C.textXs} />
    <span style={{ fontSize: 12, fontWeight: 700, color: C.textSm, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{children}</span>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div style={{ marginBottom: 12 }}>
    <div style={{ fontSize: 11, color: C.textXs, marginBottom: 2, fontWeight: 500 }}>{label}</div>
    <div style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>{value || '—'}</div>
  </div>
);

const IconBtn = ({ iconKey, label, color, bg, onClick }) => {
  const [hover, setHover] = useState(false);
  return (
    <button onClick={onClick} title={label}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: hover ? bg : 'transparent', transition: 'background 0.15s', color }}>
      <Icon d={ICONS[iconKey]} size={15} color={color} />
    </button>
  );
};

const Modal = ({ isOpen, onClose, title, children, width = 640 }) => {
  if (!isOpen) return null;
  return (
    <>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, animation: 'fadeIn 0.15s ease' }}>
        <div onClick={e => e.stopPropagation()} style={{ background: C.white, borderRadius: 16, width: '100%', maxWidth: width, maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', animation: 'slideUp 0.2s ease' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: 0 }}>{title}</h3>
            <button onClick={onClose} style={{ width: 28, height: 28, borderRadius: 6, border: 'none', background: C.gray100, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon d={ICONS.close} size={14} color={C.textSm} />
            </button>
          </div>
          <div style={{ overflowY: 'auto', flex: 1 }}>{children}</div>
        </div>
      </div>
    </>
  );
};

const StatCard = ({ title, value, iconKey, color, subtext }) => {
  const scheme = {
    blue:   { bg: C.blueLt,   border: C.blueBd,   icon: C.blue,   text: C.blue },
    green:  { bg: C.greenLt,  border: C.greenBd,  icon: C.green,  text: C.green },
    purple: { bg: C.purpleLt, border: C.purpleBd, icon: C.purple, text: C.purple },
    indigo: { bg: C.indigoLt, border: C.indigoBd, icon: C.indigo, text: C.indigo },
  }[color] || { bg: C.blueLt, border: C.blueBd, icon: C.blue, text: C.blue };

  return (
    <div style={{ background: scheme.bg, border: `1px solid ${scheme.border}`, borderRadius: 12, padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <div>
        <div style={{ fontSize: 12, color: C.textSm, marginBottom: 6, fontWeight: 500 }}>{title}</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: C.text, lineHeight: 1 }}>{value}</div>
        {subtext && <div style={{ fontSize: 11, color: C.textXs, marginTop: 4 }}>{subtext}</div>}
      </div>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon d={ICONS[iconKey]} size={22} color={scheme.icon} />
      </div>
    </div>
  );
};

const AdminVendorsPage = () => {
  const [activeTab, setActiveTab] = useState('vendors');
  const [vendors, setVendors] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);
  const [snackbar, setSnackbar] = useState({ show: false, message: '', type: 'success' });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isExporting, setIsExporting] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [rowHover, setRowHover] = useState(null);

  const [vendorForm, setVendorForm] = useState({ firstName:'',lastName:'',email:'',phone:'',designation:'',companyName:'',companyEmail:'',companyPhone:'',companyAddress:'',industry:'',isActive:true,verified:true });
  const [candidateForm, setCandidateForm] = useState({ firstName:'',lastName:'',email:'',phone:'',vendorId:'',vendorName:'',jobTitle:'',experience:'',skills:'',currentCTC:'',expectedCTC:'',currency:'USD',currentLocation:'',education:'',notes:'',resumeFile:null,resumeFileName:'' });
  const [resumeDragOver, setResumeDragOver] = useState(false);

  // Bulk upload states
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkFile, setBulkFile] = useState(null);
  const [bulkFileName, setBulkFileName] = useState('');
  const [bulkDragOver, setBulkDragOver] = useState(false);
  const [bulkParsed, setBulkParsed] = useState([]);
  const [bulkErrors, setBulkErrors] = useState([]);
  const [bulkUploading, setBulkUploading] = useState(false);
  const [bulkProgress, setBulkProgress] = useState({ done: 0, total: 0, failed: 0 });

  const INDUSTRIES = ['Information Technology','Healthcare','Finance','Education','Retail','Manufacturing','Construction','Telecommunications','Transportation and Logistics','Marketing and Advertising','Legal Services','Human Resources / Staffing','Real Estate','Media and Entertainment','Government','Non-Profit','Energy and Utilities','Hospitality','Agriculture','Aerospace and Defense','E-commerce','Pharmaceuticals','Automotive','Insurance','Consulting','Other'];

  const BULK_HEADERS = ['firstName','lastName','email','phone','vendorId','vendorName','jobTitle','experience','skills','currentCTC','expectedCTC','currency','currentLocation','education','notes'];
  const BULK_SAMPLE = [
    ['John','Doe','john@example.com','1234567890','','Tech Solutions Inc','Software Engineer','5 years','React, Node.js','80000','100000','USD','New York','Bachelor of Engineering','Good candidate'],
    ['Jane','Smith','jane@example.com','9876543210','','Acme Corp','Frontend Developer','3 years','Vue.js, CSS','60000','80000','INR','Mumbai','B.Tech Computer Science','Strong portfolio'],
  ];

  const getAuthHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/vendors`, getAuthHeaders());
      if (res.data.success) {
        setVendors(res.data.vendors);
        setPagination({ page: res.data.currentPage || 1, totalPages: res.data.totalPages || 1, total: res.data.total || res.data.vendors.length });
      }
    } catch (e) { showNotification(e.response?.data?.message || 'Failed to fetch vendors', 'error'); }
    finally { setLoading(false); }
  };

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://ats-env.eba-9hjpmsgu.us-east-1.elasticbeanstalk.comapi/vendor-candidates', getAuthHeaders());
      if (res.data.success) setCandidates(res.data.data || []);
    } catch (e) { showNotification(e.response?.data?.message || 'Failed to fetch candidates', 'error'); }
    finally { setLoading(false); }
  };

  useEffect(() => { activeTab === 'vendors' ? fetchVendors() : fetchCandidates(); }, [activeTab]);

  const showNotification = (message, type = 'success') => {
    setSnackbar({ show: true, message, type });
    setTimeout(() => setSnackbar({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleEditVendor = (vendor) => {
    setSelectedVendor(vendor);
    setVendorForm({ firstName:vendor.firstName||'',lastName:vendor.lastName||'',email:vendor.email||'',phone:vendor.phone||'',designation:vendor.designation||'',companyName:vendor.companyName||'',companyEmail:vendor.companyEmail||'',companyPhone:vendor.companyPhone||'',companyAddress:vendor.companyAddress||'',industry:vendor.industry||'',isActive:vendor.isActive!==undefined?vendor.isActive:true,verified:vendor.verified!==undefined?vendor.verified:true });
    setShowEditModal(true);
  };

  const handleSaveVendor = async () => {
    if (!vendorForm.firstName?.trim()) return showNotification('First name is required', 'error');
    if (!vendorForm.lastName?.trim()) return showNotification('Last name is required', 'error');
    if (!vendorForm.email?.trim()) return showNotification('Email is required', 'error');
    if (!vendorForm.companyName?.trim()) return showNotification('Company name is required', 'error');
    setLoading(true);
    try {
      await axios.patch(`${API_BASE_URL}/vendors/${selectedVendor._id}`, vendorForm, getAuthHeaders());
      showNotification('Vendor updated successfully');
      setShowEditModal(false); fetchVendors();
    } catch (e) { showNotification(e.response?.data?.message || 'Failed to save vendor', 'error'); }
    finally { setLoading(false); }
  };

  const handleDeleteVendor = async () => {
    if (!selectedVendor) return;
    setLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/vendors/${selectedVendor._id}`, getAuthHeaders());
      showNotification('Vendor deleted successfully');
      setShowDeleteModal(false); fetchVendors();
    } catch (e) { showNotification(e.response?.data?.message || 'Failed to delete vendor', 'error'); }
    finally { setLoading(false); }
  };

  const handleSaveCandidate = async () => {
    if (!candidateForm.firstName?.trim()) return showNotification('First name is required', 'error');
    if (!candidateForm.lastName?.trim()) return showNotification('Last name is required', 'error');
    if (!candidateForm.email?.trim()) return showNotification('Email is required', 'error');
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(candidateForm).forEach(([key, val]) => {
        if (key === 'resumeFile') { if (val) formData.append('resume', val); }
        else if (key !== 'resumeFileName') formData.append(key, val ?? '');
      });
      await axios.post('http://ats-env.eba-9hjpmsgu.us-east-1.elasticbeanstalk.comapi/vendor-candidates/submit', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'multipart/form-data' }
      });
      const vendorName = candidateForm.vendorName || 'this vendor';
      showNotification(`Candidate successfully added for ${vendorName}`);
      setShowAddCandidateModal(false);
      fetchCandidates();
    } catch (e) { showNotification(e.response?.data?.message || 'Failed to add candidate', 'error'); }
    finally { setLoading(false); }
  };

  // ====== TEMPLATE DOWNLOAD ======
  const downloadTemplate = async (type) => {
    try {
      const response = await axios({
        url: `http://ats-env.eba-9hjpmsgu.us-east-1.elasticbeanstalk.comapi/vendor-candidates/template/download`,
        method: 'GET',
        responseType: 'blob',
        headers: getAuthHeaders().headers
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = type === 'csv' ? 'candidates_template.csv' : 'candidates_template.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      showNotification('Template downloaded successfully');
    } catch (error) {
      console.error('Download error:', error);
      showNotification('Failed to download template', 'error');
    }
  };

  // ====== BULK UPLOAD FUNCTIONS ======
  const parseBulkFile = (file) => {
    if (!file) return;
    const allowed = ['text/csv','application/vnd.ms-excel','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','text/plain'];
    if (!allowed.some(t => file.type.includes(t.split('/')[1])) && !file.name.match(/\.(csv|xls|xlsx|txt)$/i)) {
      return showNotification('Only CSV or Excel files are allowed', 'error');
    }
    setBulkFile(file);
    setBulkFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.trim().split('\n').map(l => l.replace(/\r/g, ''));
      const headers = lines[0].split(',').map(h => h.replace(/"/g,'').trim().toLowerCase());
      const rows = [];
      const errs = [];
      lines.slice(1).forEach((line, idx) => {
        if (!line.trim()) return;
        const vals = line.match(/(".*?"|[^,]+|(?<=,)(?=,)|(?<=,)$|^(?=,))/g) || line.split(',');
        const clean = vals.map(v => v.replace(/^"|"$/g,'').trim());
        const row = {};
        headers.forEach((h, i) => { row[h] = clean[i] || ''; });
        if (!row.firstname && !row.firstName) { errs.push(`Row ${idx+2}: Missing firstName`); return; }
        if (!row.email) { errs.push(`Row ${idx+2}: Missing email`); return; }
        rows.push({
          firstName: row.firstname || row.firstName || '',
          lastName: row.lastname || row.lastName || '',
          email: row.email || '',
          phone: row.phone || '',
          vendorId: row.vendorid || row.vendorId || '',
          vendorName: row.vendorname || row.vendorName || '',
          jobTitle: row.jobtitle || row.jobTitle || '',
          experience: row.experience || '',
          skills: row.skills || '',
          currentCTC: row.currentctc || row.currentCTC || '',
          expectedCTC: row.expectedctc || row.expectedCTC || '',
          currency: row.currency || 'USD',
          currentLocation: row.currentlocation || row.currentLocation || '',
          education: row.education || '',
          notes: row.notes || '',
        });
      });
      setBulkParsed(rows);
      setBulkErrors(errs);
    };
    reader.readAsText(file);
  };

  const handleBulkUpload = async () => {
    if (!bulkFile) {
      showNotification('Please select a file first', 'error');
      return;
    }

    setBulkUploading(true);
    setBulkProgress({ done: 0, total: bulkParsed.length, failed: 0 });

    const formData = new FormData();
    formData.append('file', bulkFile);

    try {
      const response = await axios.post(
        'http://ats-env.eba-9hjpmsgu.us-east-1.elasticbeanstalk.comapi/vendor-candidates/bulk-upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (response.data.success) {
        const { successful, failed } = response.data.data.summary;
        showNotification(
          `✅ ${successful} candidates added${failed ? `, ${failed} failed` : ''}`,
          failed ? 'error' : 'success'
        );
        
        if (activeTab === 'candidates') {
          fetchCandidates();
        }
        
        setShowBulkModal(false);
        resetBulkModal();
      }
    } catch (error) {
      console.error('Bulk upload error:', error);
      showNotification(
        error.response?.data?.error || 'Bulk upload failed',
        'error'
      );
    } finally {
      setBulkUploading(false);
    }
  };

  const resetBulkModal = () => { 
    setBulkFile(null); 
    setBulkFileName(''); 
    setBulkParsed([]); 
    setBulkErrors([]); 
    setBulkProgress({ done:0, total:0, failed:0 }); 
  };

  const handleSendWhatsApp = (vendor) => {
    const phone = vendor.phone || vendor.companyPhone;
    if (!phone) return showNotification('No phone number available', 'error');
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}`, '_blank');
  };

  const handleExportData = async () => {
    setIsExporting(true);
    try {
      const data = activeTab === 'vendors' ? vendors : candidates;
      const headers = activeTab === 'vendors' ? ['Name','Email','Phone','Company','Industry','Status'] : ['Name','Email','Phone','Vendor','Job Title','Experience'];
      const csvContent = [headers.join(','), ...data.map(item => activeTab === 'vendors'
        ? [`${item.firstName||''} ${item.lastName||''}`, item.email||'', item.phone||'', item.companyName||'', item.industry||'', item.isActive?'Active':'Inactive'].join(',')
        : [`${item.firstName||''} ${item.lastName||''}`, item.email||'', item.mobile||'', item.vendorName||'', item.jobTitle||'', item.experience||''].join(',')
      )].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `${activeTab}_export_${new Date().toISOString().split('T')[0]}.csv`; a.click();
      window.URL.revokeObjectURL(url);
      showNotification('Data exported successfully');
    } catch { showNotification('Failed to export data', 'error'); }
    finally { setIsExporting(false); }
  };

  const filteredVendors = vendors.filter(v => {
    const q = searchTerm.toLowerCase();
    return (!q || `${v.firstName} ${v.lastName}`.toLowerCase().includes(q) || (v.companyName||'').toLowerCase().includes(q) || (v.email||'').toLowerCase().includes(q))
      && (selectedIndustry === 'all' || v.industry === selectedIndustry)
      && (selectedStatus === 'all' || (selectedStatus === 'active' ? v.isActive : !v.isActive));
  });

  const handleResumeFile = (file) => {
    if (!file) return;
    const allowed = ['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 5 * 1024 * 1024;
    if (!allowed.includes(file.type)) return showNotification('Only PDF, DOC, DOCX files are allowed', 'error');
    if (file.size > maxSize) return showNotification('File size must be under 5MB', 'error');
    setCandidateForm(prev => ({ ...prev, resumeFile: file, resumeFileName: file.name }));
  };

  const handleAddCandidate = (vendor = null) => {
    if (vendor) setSelectedVendor(vendor);
    setCandidateForm({ firstName:'',lastName:'',email:'',phone:'',vendorId:vendor?._id||selectedVendor?._id||'',vendorName:vendor?.companyName||selectedVendor?.companyName||'',jobTitle:'',experience:'',skills:'',currentCTC:'',expectedCTC:'',currency:'USD',currentLocation:'',education:'',notes:'',resumeFile:null,resumeFileName:'' });
    setShowAddCandidateModal(true);
  };

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px) } to { opacity: 1; transform: translateY(0) } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(-8px) } to { opacity: 1; transform: translateY(0) } }
        * { box-sizing: border-box; }
        body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
      `}</style>

      <div style={s.page}>

        {/* Header */}
        <div style={{ ...s.row, marginBottom: 24 }}>
          <div>
            <h1 style={s.h1}>Vendor Management</h1>
            <p style={{ ...s.p, marginTop: 4 }}>Manage vendors, their candidates, and bench list</p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <Btn variant="ghost" onClick={() => activeTab === 'vendors' ? fetchVendors() : fetchCandidates()}>
              <Icon d={ICONS.refresh} size={15} /> Refresh
            </Btn>
            <Btn variant="ghost" onClick={handleExportData} disabled={isExporting}>
              <Icon d={ICONS.download} size={15} /> {isExporting ? 'Exporting…' : 'Export CSV'}
            </Btn>
            {activeTab === 'candidates' && (
              <>
                <Btn variant="ghost" onClick={() => { resetBulkModal(); setShowBulkModal(true); }}>
                  <Icon d={ICONS.upload} size={15} /> Bulk Upload
                </Btn>
                <Btn variant="purple" onClick={() => handleAddCandidate()}>
                  <Icon d={ICONS.addUser} size={15} color="#fff" /> Add to Bench
                </Btn>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div style={s.grid4}>
          <StatCard title="Total Vendors" value={vendors.length} iconKey="building" color="blue" subtext="Registered vendors" />
          <StatCard title="Active Vendors" value={vendors.filter(v => v.isActive).length} iconKey="check" color="green" subtext={`${Math.round((vendors.filter(v=>v.isActive).length/Math.max(vendors.length,1))*100)}% of total`} />
          <StatCard title="Verified Vendors" value={vendors.filter(v => v.verified).length} iconKey="shield" color="purple" subtext="Email verified" />
          <StatCard title="Total Candidates" value={candidates.length} iconKey="users" color="indigo" subtext="From vendor submissions" />
        </div>

        {/* Tab + Filters Panel */}
        <div style={{ ...s.card, marginBottom: 20 }}>
          <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}` }}>
            {[['vendors','Vendors'],['candidates','Candidates & Bench']].map(([key, label]) => (
              <button key={key} onClick={() => setActiveTab(key)} style={{ padding: '12px 24px', fontSize: 13, fontWeight: 600, cursor: 'pointer', border: 'none', background: 'none', color: activeTab === key ? C.blue : C.textSm, borderBottom: `2px solid ${activeTab === key ? C.blue : 'transparent'}`, transition: 'all 0.15s', marginBottom: -1 }}>
                {label}
                {key === 'vendors' && vendors.length > 0 && <span style={{ marginLeft: 6, background: C.blueLt, color: C.blue, fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 99 }}>{vendors.length}</span>}
                {key === 'candidates' && candidates.length > 0 && <span style={{ marginLeft: 6, background: C.indigoLt, color: C.indigo, fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 99 }}>{candidates.length}</span>}
              </button>
            ))}
          </div>

          <div style={{ padding: '14px 16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10, alignItems: 'end' }}>
            <div style={{ position: 'relative', gridColumn: activeTab === 'vendors' ? 'span 2' : 'span 4' }}>
              <div style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                <Icon d={ICONS.search} size={15} color={C.textXs} />
              </div>
              <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                placeholder={`Search ${activeTab}…`}
                style={{ ...s.input, paddingLeft: 34 }} />
            </div>

            {activeTab === 'vendors' && (
              <>
                <Select value={selectedIndustry} onChange={e => setSelectedIndustry(e.target.value)}>
                  <option value="all">All Industries</option>
                  {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                </Select>
                <Select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Select>
              </>
            )}

            {searchTerm || selectedIndustry !== 'all' || selectedStatus !== 'all' ? (
              <Btn variant="ghost" size="sm" onClick={() => { setSearchTerm(''); setSelectedIndustry('all'); setSelectedStatus('all'); }}>
                <Icon d={ICONS.close} size={13} /> Clear
              </Btn>
            ) : null}
          </div>
        </div>

        {/* Vendors Table */}
        {activeTab === 'vendors' && (
          <div style={s.card}>
            <div style={{ overflowX: 'auto' }}>
              <table style={s.table}>
                <thead>
                  <tr>
                    {['Vendor / Company','Contact Person','Contact Info','Industry','Status','Joined','Actions'].map(h => (
                      <th key={h} style={{ ...s.th, textAlign: h === 'Actions' ? 'center' : 'left' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={7} style={{ ...s.td, textAlign: 'center', padding: 48 }}><div style={{ display: 'flex', justifyContent: 'center' }}><Spinner size={28} /></div></td></tr>
                  ) : filteredVendors.length > 0 ? filteredVendors.map(vendor => (
                    <tr key={vendor._id} onClick={() => { setSelectedVendor(vendor); setShowViewModal(true); }}
                      onMouseEnter={() => setRowHover(vendor._id)} onMouseLeave={() => setRowHover(null)}
                      style={{ cursor: 'pointer', background: rowHover === vendor._id ? '#f8fafc' : C.white, transition: 'background 0.1s' }}>
                      <td style={s.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <Avatar color={C.blue}><Icon d={ICONS.building} size={16} color="#fff" /></Avatar>
                          <div>
                            <div style={{ fontWeight: 600, color: C.text, fontSize: 13 }}>{vendor.companyName}</div>
                            <div style={{ fontSize: 11, color: C.textXs }}>#{vendor._id?.slice(-6)}</div>
                          </div>
                        </div>
                      </td>
                      <td style={s.td}>
                        <div style={{ fontWeight: 500, color: C.text, fontSize: 13 }}>{vendor.firstName} {vendor.lastName}</div>
                        <div style={{ fontSize: 11, color: C.textXs }}>{vendor.designation || 'N/A'}</div>
                      </td>
                      <td style={s.td}>
                        <div style={{ fontSize: 13, color: C.text }}>{vendor.email}</div>
                        <div style={{ fontSize: 11, color: C.textXs }}>{vendor.phone || 'No phone'}</div>
                      </td>
                      <td style={s.td}><Badge color="gray">{vendor.industry || 'N/A'}</Badge></td>
                      <td style={s.td}>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          <Badge color={vendor.isActive ? 'green' : 'gray'}>{vendor.isActive ? 'Active' : 'Inactive'}</Badge>
                          {vendor.verified && <Badge color="blue">Verified</Badge>}
                        </div>
                      </td>
                      <td style={s.td}>
                        <div style={{ ...s.flex, gap: 5 }}>
                          <Icon d={ICONS.cal} size={13} color={C.textXs} />
                          <span style={{ fontSize: 12 }}>{new Date(vendor.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td style={{ ...s.td, textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                          <IconBtn iconKey="eye" label="View" color={C.blue} bg={C.blueLt} onClick={() => { setSelectedVendor(vendor); setShowViewModal(true); }} />
                          <IconBtn iconKey="edit" label="Edit" color={C.yellow} bg={C.yellowLt} onClick={() => handleEditVendor(vendor)} />
                          <IconBtn iconKey="chat" label="WhatsApp" color={C.green} bg={C.greenLt} onClick={() => handleSendWhatsApp(vendor)} />
                          <IconBtn iconKey="addUser" label="Add to Bench" color={C.purple} bg={C.purpleLt} onClick={() => handleAddCandidate(vendor)} />
                          <IconBtn iconKey="trash" label="Delete" color={C.red} bg={C.redLt} onClick={() => { setSelectedVendor(vendor); setShowDeleteModal(true); }} />
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={7} style={{ ...s.td, textAlign: 'center', padding: 60 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                          <Icon d={ICONS.building} size={36} color={C.gray300} />
                          <div style={{ fontSize: 15, fontWeight: 600, color: C.textMd }}>No vendors found</div>
                          <div style={{ fontSize: 13, color: C.textXs }}>{searchTerm ? 'Try adjusting your search filters' : 'No vendors available'}</div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {pagination.totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '14px 16px', borderTop: `1px solid ${C.border}` }}>
                <Btn variant="ghost" size="sm" disabled={pagination.page === 1} onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}>← Previous</Btn>
                <span style={{ fontSize: 13, color: C.textSm }}>Page {pagination.page} of {pagination.totalPages}</span>
                <Btn variant="ghost" size="sm" disabled={pagination.page === pagination.totalPages} onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}>Next →</Btn>
              </div>
            )}
          </div>
        )}

        {/* Candidates Table - FIXED with resume and mobile */}
        {activeTab === 'candidates' && (
          <div style={s.card}>
            <div style={{ overflowX: 'auto' }}>
              <table style={s.table}>
                <thead>
                  <tr>
                    {['Candidate','Vendor','Mobile','Skills','Experience','CTC','Status','Resume','Submitted'].map(h => (
                      <th key={h} style={s.th}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan={9} style={{ ...s.td, textAlign: 'center', padding: 48 }}><div style={{ display: 'flex', justifyContent: 'center' }}><Spinner size={28} /></div></td></tr>
                  ) : candidates.length > 0 ? candidates.map(c => {
                    const skillList = Array.isArray(c.skills)
                      ? c.skills
                      : (c.skills ? String(c.skills).split(',').map(s => s.trim()).filter(Boolean) : []);
                    const vName = c.vendorId?.companyName || c.vendorName || '—';
                    const vEmail = c.vendorId?.email || c.vendorEmail || '';
                    return (
                    <tr key={c._id} onMouseEnter={() => setRowHover(c._id)} onMouseLeave={() => setRowHover(null)}
                      style={{ background: rowHover === c._id ? '#f8fafc' : C.white, transition: 'background 0.1s' }}>
                      <td style={s.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <Avatar color={C.purple}><Icon d={ICONS.person} size={16} color="#fff" /></Avatar>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: 13, color: C.text }}>{c.firstName} {c.lastName}</div>
                            <div style={{ fontSize: 11, color: C.textXs }}>{c.email}</div>
                            {c.education && <div style={{ fontSize: 11, color: C.textXs, marginTop: 1 }}>{c.education}</div>}
                          </div>
                        </div>
                      </td>
                      <td style={s.td}>
                        <div style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{vName}</div>
                        {vEmail && <div style={{ fontSize: 11, color: C.textXs }}>{vEmail}</div>}
                      </td>
                      {/* FIXED: Changed from phone to mobile */}
                      <td style={s.td}><span style={{ fontSize: 13 }}>{c.mobile || '—'}</span></td>
                      <td style={s.td}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, maxWidth: 180 }}>
                          {skillList.length > 0
                            ? skillList.slice(0, 3).map((sk, i) => (
                                <span key={i} style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 99, background: C.indigoLt, color: C.indigo, border: `1px solid ${C.indigoBd}`, whiteSpace: 'nowrap' }}>{sk}</span>
                              ))
                            : <span style={{ fontSize: 12, color: C.textXs }}>—</span>}
                          {skillList.length > 3 && (
                            <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 99, background: C.gray100, color: C.textXs, border: `1px solid ${C.border}` }}>+{skillList.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td style={s.td}>
                        <span style={{ fontSize: 13 }}>{c.experience != null && c.experience !== '' ? `${c.experience} yr${c.experience == 1 ? '' : 's'}` : '—'}</span>
                      </td>
                      <td style={s.td}>
                        <div style={{ fontSize: 12 }}>
                          {c.currentCTC ? <div><span style={{ color: C.textXs }}>Cur: </span>{(c.currentCTC / 100000).toFixed(1)}L {c.currency || ''}</div> : null}
                          {c.expectedCTC ? <div><span style={{ color: C.textXs }}>Exp: </span>{(c.expectedCTC / 100000).toFixed(1)}L {c.currency || ''}</div> : null}
                          {!c.currentCTC && !c.expectedCTC && <span style={{ color: C.textXs }}>—</span>}
                        </div>
                      </td>
                      <td style={s.td}>
                        <Badge color={
                          c.status === 'approved' ? 'green' :
                          c.status === 'rejected' ? 'red' :
                          c.status === 'reviewed' ? 'blue' :
                          c.status === 'shortlisted' ? 'indigo' :
                          'yellow'
                        }>
                          {c.status ? c.status.charAt(0).toUpperCase() + c.status.slice(1) : 'Pending'}
                        </Badge>
                      </td>
                      {/* FIXED: Resume from c.resume.url instead of c.resumeUrl */}
                      <td style={s.td}>
                        {c.resume && c.resume.url ? (
                          <a href={c.resume.url} target="_blank" rel="noreferrer"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 600, color: C.blue, textDecoration: 'none', padding: '4px 10px', borderRadius: 8, background: C.blueLt, border: `1px solid ${C.blueBd}` }}
                            title={c.resume.originalName || 'View Resume'}>
                            <Icon d={ICONS.fileDoc} size={13} color={C.blue} /> View
                          </a>
                        ) : (
                          <span style={{ fontSize: 12, color: C.textXs }}>—</span>
                        )}
                      </td>
                      <td style={s.td}>
                        <div style={{ ...s.flex, gap: 5 }}>
                          <Icon d={ICONS.cal} size={13} color={C.textXs} />
                          <span style={{ fontSize: 12 }}>{new Date(c.submittedAt || c.createdAt || Date.now()).toLocaleDateString()}</span>
                        </div>
                        {c.notes && c.notes !== 'NA' && (
                          <div style={{ fontSize: 11, color: C.textXs, marginTop: 3, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={c.notes}>
                            📝 {c.notes}
                          </div>
                        )}
                      </td>
                    </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan={9} style={{ ...s.td, textAlign: 'center', padding: 60 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                          <Icon d={ICONS.users} size={36} color={C.gray300} />
                          <div style={{ fontSize: 15, fontWeight: 600, color: C.textMd }}>No candidates in bench</div>
                          <div style={{ fontSize: 13, color: C.textXs }}>Add candidates from the vendors tab</div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* View Vendor Modal */}
        <Modal isOpen={showViewModal} onClose={() => setShowViewModal(false)} title="Vendor Details" width={720}>
          {selectedVendor && (
            <div style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', background: C.blueLt, borderRadius: 12, marginBottom: 20, border: `1px solid ${C.blueBd}` }}>
                <div style={{ width: 52, height: 52, borderRadius: 12, background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon d={ICONS.building} size={24} color="#fff" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>{selectedVendor.companyName}</div>
                  <div style={{ fontSize: 13, color: C.textSm, marginTop: 2 }}>{selectedVendor.firstName} {selectedVendor.lastName} · {selectedVendor.designation || 'N/A'}</div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Badge color={selectedVendor.isActive ? 'green' : 'gray'}>{selectedVendor.isActive ? 'Active' : 'Inactive'}</Badge>
                  {selectedVendor.verified && <Badge color="blue">Verified</Badge>}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div>
                  <SectionTitle icon="building">Company Information</SectionTitle>
                  <InfoRow label="Company Name" value={selectedVendor.companyName} />
                  <InfoRow label="Industry" value={selectedVendor.industry} />
                  <InfoRow label="Company Email" value={selectedVendor.companyEmail || selectedVendor.email} />
                  <InfoRow label="Company Phone" value={selectedVendor.companyPhone || selectedVendor.phone} />
                  <InfoRow label="Address" value={selectedVendor.companyAddress} />
                </div>
                <div>
                  <SectionTitle icon="person">Contact Person</SectionTitle>
                  <InfoRow label="Full Name" value={`${selectedVendor.firstName} ${selectedVendor.lastName}`} />
                  <InfoRow label="Designation" value={selectedVendor.designation} />
                  <InfoRow label="Email" value={selectedVendor.email} />
                  <InfoRow label="Phone" value={selectedVendor.phone} />
                </div>
              </div>

              <div style={{ marginTop: 20 }}>
                <SectionTitle icon="cal">Account Timeline</SectionTitle>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[
                    { icon: 'cal', label: 'Joined Date', value: new Date(selectedVendor.createdAt).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }) },
                    { icon: 'clock', label: 'Last Updated', value: new Date(selectedVendor.updatedAt).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }) },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', border: `1px solid ${C.border}`, borderRadius: 10 }}>
                      <Icon d={ICONS[item.icon]} size={16} color={C.textXs} />
                      <div><div style={{ fontSize: 11, color: C.textXs }}>{item.label}</div><div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{item.value}</div></div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedVendor.requiresPasswordReset && (
                <div style={{ marginTop: 14, padding: '12px 14px', background: C.yellowLt, border: `1px solid ${C.yellowBd}`, borderRadius: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.yellow }}>⚠ Password reset required</div>
                  {selectedVendor.passwordResetExpires && <div style={{ fontSize: 11, color: C.yellow, marginTop: 2 }}>Expires: {new Date(selectedVendor.passwordResetExpires).toLocaleString()}</div>}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 16, marginTop: 16, borderTop: `1px solid ${C.border}` }}>
                <Btn variant="ghost" onClick={() => handleSendWhatsApp(selectedVendor)}><Icon d={ICONS.chat} size={14} color={C.green} /> WhatsApp</Btn>
                <Btn variant="ghost" onClick={() => { setShowViewModal(false); handleAddCandidate(); }}><Icon d={ICONS.addUser} size={14} color={C.purple} /> Add to Bench</Btn>
                <Btn variant="ghost" onClick={() => { setShowViewModal(false); handleEditVendor(selectedVendor); }}><Icon d={ICONS.edit} size={14} color={C.yellow} /> Edit</Btn>
                <Btn variant="ghost" onClick={() => setShowViewModal(false)}>Close</Btn>
              </div>
            </div>
          )}
        </Modal>

        {/* Edit Vendor Modal */}
        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Vendor" width={680}>
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Input label="First Name" required value={vendorForm.firstName} onChange={e => setVendorForm({...vendorForm, firstName:e.target.value})} placeholder="John" />
              <Input label="Last Name" required value={vendorForm.lastName} onChange={e => setVendorForm({...vendorForm, lastName:e.target.value})} placeholder="Doe" />
              <Input label="Email" required type="email" value={vendorForm.email} onChange={e => setVendorForm({...vendorForm, email:e.target.value})} placeholder="john@example.com" />
              <Input label="Phone" value={vendorForm.phone} onChange={e => setVendorForm({...vendorForm, phone:e.target.value})} placeholder="+1 234 567 8900" />
              <Input label="Designation" value={vendorForm.designation} onChange={e => setVendorForm({...vendorForm, designation:e.target.value})} placeholder="CEO" />
              <Input label="Company Name" required value={vendorForm.companyName} onChange={e => setVendorForm({...vendorForm, companyName:e.target.value})} placeholder="Acme Corp" />
              <Input label="Company Email" type="email" value={vendorForm.companyEmail} onChange={e => setVendorForm({...vendorForm, companyEmail:e.target.value})} placeholder="info@acme.com" />
              <Input label="Company Phone" value={vendorForm.companyPhone} onChange={e => setVendorForm({...vendorForm, companyPhone:e.target.value})} placeholder="+1 800 000 0000" />
              <div style={{ gridColumn: 'span 2' }}>
                <Select label="Industry" value={vendorForm.industry} onChange={e => setVendorForm({...vendorForm, industry:e.target.value})}>
                  <option value="">Select Industry</option>
                  {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                </Select>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <Textarea label="Company Address" rows={2} value={vendorForm.companyAddress} onChange={e => setVendorForm({...vendorForm, companyAddress:e.target.value})} placeholder="123 Main St, City, State 00000" />
              </div>
              <div style={{ gridColumn: 'span 2', display: 'flex', gap: 24 }}>
                {[['isActive','Active'],['verified','Verified']].map(([key, label]) => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', userSelect: 'none' }}>
                    <input type="checkbox" checked={vendorForm[key]} onChange={e => setVendorForm({...vendorForm, [key]:e.target.checked})}
                      style={{ width: 16, height: 16, accentColor: C.yellow }} />
                    <span style={{ fontSize: 13, fontWeight: 500, color: C.textMd }}>{label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
              <Btn variant="ghost" onClick={() => setShowEditModal(false)}>Cancel</Btn>
              <Btn variant="yellow" onClick={handleSaveVendor} disabled={loading}>
                {loading ? <><Spinner size={14} color="#fff" /> Saving…</> : <><Icon d={ICONS.save} size={14} color="#fff" /> Update Vendor</>}
              </Btn>
            </div>
          </div>
        </Modal>

        {/* Add Candidate Modal */}
        <Modal isOpen={showAddCandidateModal} onClose={() => setShowAddCandidateModal(false)} title="Add Candidate to Bench" width={700}>
          <div style={{ padding: 24 }}>
            {selectedVendor && (
              <div style={{ marginBottom: 16, padding: '10px 14px', background: C.purpleLt, border: `1px solid ${C.purpleBd}`, borderRadius: 10 }}>
                <span style={{ fontSize: 13, color: C.purple }}><strong>Vendor:</strong> {selectedVendor.companyName}</span>
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

              <div style={{ gridColumn: 'span 2' }}><SectionTitle icon="paperclip">Resume / CV</SectionTitle></div>
              <div style={{ gridColumn: 'span 2' }}>
                <input id="resumeInput" type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }}
                  onChange={e => handleResumeFile(e.target.files?.[0])} />
                {!candidateForm.resumeFileName ? (
                  <div
                    onDragOver={e => { e.preventDefault(); setResumeDragOver(true); }}
                    onDragLeave={() => setResumeDragOver(false)}
                    onDrop={e => { e.preventDefault(); setResumeDragOver(false); handleResumeFile(e.dataTransfer.files?.[0]); }}
                    onClick={() => document.getElementById('resumeInput').click()}
                    style={{ border: `2px dashed ${resumeDragOver ? C.purple : C.border}`, borderRadius: 12, padding: '28px 20px', textAlign: 'center', cursor: 'pointer', background: resumeDragOver ? C.purpleLt : C.gray100, transition: 'all 0.2s' }}
                  >
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: resumeDragOver ? C.purpleBd : C.gray200, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                      <Icon d={ICONS.upload} size={20} color={resumeDragOver ? C.purple : C.textXs} />
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: resumeDragOver ? C.purple : C.textMd, marginBottom: 4 }}>
                      {resumeDragOver ? 'Drop to upload' : 'Drag & drop or click to upload'}
                    </div>
                    <div style={{ fontSize: 12, color: C.textXs }}>Supports PDF, DOC, DOCX · Max 5MB</div>
                    <div style={{ marginTop: 14 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: C.white, border: `1px solid ${C.border}`, color: C.textMd, cursor: 'pointer' }}>
                        <Icon d={ICONS.paperclip} size={13} color={C.textSm} /> Browse File
                      </span>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', border: `1px solid ${C.purpleBd}`, borderRadius: 12, background: C.purpleLt }}>
                    <div style={{ width: 42, height: 42, borderRadius: 10, background: C.purple, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon d={ICONS.fileDoc} size={20} color="#fff" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{candidateForm.resumeFileName}</div>
                      <div style={{ fontSize: 11, color: C.textXs, marginTop: 2 }}>
                        {candidateForm.resumeFile ? (candidateForm.resumeFile.size / 1024 < 1024 ? `${(candidateForm.resumeFile.size / 1024).toFixed(1)} KB` : `${(candidateForm.resumeFile.size / (1024*1024)).toFixed(2)} MB`) : ''} · Ready to upload
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      <button onClick={() => document.getElementById('resumeInput').click()} title="Replace file"
                        style={{ padding: '6px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600, border: `1px solid ${C.purpleBd}`, background: C.white, color: C.purple, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                        <Icon d={ICONS.upload} size={12} color={C.purple} /> Replace
                      </button>
                      <button onClick={() => setCandidateForm(prev => ({ ...prev, resumeFile: null, resumeFileName: '' }))} title="Remove file"
                        style={{ padding: '6px 10px', borderRadius: 8, border: `1px solid ${C.redBd}`, background: C.white, color: C.red, cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <Icon d={ICONS.xCircle} size={14} color={C.red} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ gridColumn: 'span 2', marginTop: 4 }}><SectionTitle icon="person">Personal Information</SectionTitle></div>
              <Input label="First Name" required value={candidateForm.firstName} onChange={e => setCandidateForm({...candidateForm,firstName:e.target.value})} placeholder="John" />
              <Input label="Last Name" required value={candidateForm.lastName} onChange={e => setCandidateForm({...candidateForm,lastName:e.target.value})} placeholder="Doe" />
              <Input label="Email" required type="email" value={candidateForm.email} onChange={e => setCandidateForm({...candidateForm,email:e.target.value})} placeholder="john.doe@example.com" />
              <Input label="Phone" type="tel" value={candidateForm.phone} onChange={e => setCandidateForm({...candidateForm,phone:e.target.value})} placeholder="+1 234 567 8900" />

              <div style={{ gridColumn: 'span 2', marginTop: 4 }}><SectionTitle icon="work">Professional Information</SectionTitle></div>
              <Select label="Vendor" value={candidateForm.vendorId} onChange={e => { const v = vendors.find(x=>x._id===e.target.value); setCandidateForm({...candidateForm,vendorId:e.target.value,vendorName:v?.companyName||''}); }}>
                <option value="">Select Vendor</option>
                {vendors.map(v => <option key={v._id} value={v._id}>{v.companyName}</option>)}
              </Select>
              <Input label="Job Title" value={candidateForm.jobTitle} onChange={e => setCandidateForm({...candidateForm,jobTitle:e.target.value})} placeholder="Senior Software Engineer" />
              <Input label="Experience" value={candidateForm.experience} onChange={e => setCandidateForm({...candidateForm,experience:e.target.value})} placeholder="5 years" />
              <Input label="Skills" value={candidateForm.skills} onChange={e => setCandidateForm({...candidateForm,skills:e.target.value})} placeholder="React, Node.js, MongoDB" />

              <div style={{ gridColumn: 'span 2', marginTop: 4 }}><SectionTitle icon="money">Compensation Details</SectionTitle></div>
              <Input label="Current CTC" type="number" value={candidateForm.currentCTC} onChange={e => setCandidateForm({...candidateForm,currentCTC:e.target.value})} placeholder="120000" />
              <Input label="Expected CTC" type="number" value={candidateForm.expectedCTC} onChange={e => setCandidateForm({...candidateForm,expectedCTC:e.target.value})} placeholder="150000" />
              <Select label="Currency" value={candidateForm.currency} onChange={e => setCandidateForm({...candidateForm,currency:e.target.value})}>
                <option value="USD">USD ($)</option>
                <option value="INR">INR (₹)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </Select>

              <div style={{ gridColumn: 'span 2', marginTop: 4 }}><SectionTitle icon="book">Additional Information</SectionTitle></div>
              <Input label="Current Location" value={candidateForm.currentLocation} onChange={e => setCandidateForm({...candidateForm,currentLocation:e.target.value})} placeholder="New York, NY" />
              <Input label="Education" value={candidateForm.education} onChange={e => setCandidateForm({...candidateForm,education:e.target.value})} placeholder="B.Tech in Computer Science" />
              <div style={{ gridColumn: 'span 2' }}>
                <Textarea label="Additional Notes" rows={3} value={candidateForm.notes} onChange={e => setCandidateForm({...candidateForm,notes:e.target.value})} placeholder="Any additional information…" />
              </div>

            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 14, marginTop: 8, borderTop: `1px solid ${C.border}` }}>
              <Btn variant="ghost" onClick={() => setShowAddCandidateModal(false)}>Cancel</Btn>
              <Btn variant="purple" onClick={handleSaveCandidate} disabled={loading}>
                {loading ? <><Spinner size={14} color="#fff" /> Adding…</> : <><Icon d={ICONS.save} size={14} color="#fff" /> Add to Bench</>}
              </Btn>
            </div>
          </div>
        </Modal>

        {/* Delete Modal */}
        <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} title="Delete Vendor" width={440}>
          <div style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: C.redLt, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon d={ICONS.trash} size={22} color={C.red} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: C.text }}>{selectedVendor?.companyName}</div>
                <div style={{ fontSize: 12, color: C.textXs }}>{selectedVendor?.firstName} {selectedVendor?.lastName}</div>
              </div>
            </div>
            <div style={{ padding: '12px 14px', background: C.redLt, border: `1px solid ${C.redBd}`, borderRadius: 10, marginBottom: 14 }}>
              <div style={{ fontSize: 13, color: C.red, fontWeight: 500 }}>⚠ This action cannot be undone.</div>
              <div style={{ fontSize: 12, color: '#ef4444', marginTop: 4 }}>All associated data will be permanently deleted.</div>
            </div>
            <p style={{ fontSize: 13, color: C.textMd, marginBottom: 20 }}>Are you sure you want to delete this vendor?</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
              <Btn variant="ghost" onClick={() => setShowDeleteModal(false)}>Cancel</Btn>
              <Btn variant="red" onClick={handleDeleteVendor} disabled={loading}>
                {loading ? <><Spinner size={14} color="#fff" /> Deleting…</> : <><Icon d={ICONS.trash} size={14} color="#fff" /> Delete Vendor</>}
              </Btn>
            </div>
          </div>
        </Modal>

        {/* Bulk Upload Modal */}
        <Modal isOpen={showBulkModal} onClose={() => { setShowBulkModal(false); resetBulkModal(); }} title="Bulk Add Candidates to Bench" width={760}>
          <div style={{ padding: 24 }}>

            {/* Step 1 — Download Template */}
            <div style={{ marginBottom: 20, padding: '16px 18px', background: C.blueLt, border: `1px solid ${C.blueBd}`, borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: C.blue, marginBottom: 3 }}>Step 1 — Download Template</div>
                  <div style={{ fontSize: 12, color: C.textSm }}>Download the template, fill in candidate data, then upload the file below.</div>
                  <div style={{ fontSize: 11, color: C.textXs, marginTop: 4 }}>Required columns: <strong>firstName, lastName, email</strong> · Optional: all other fields</div>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <button onClick={() => downloadTemplate('csv')}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, border: `1px solid ${C.blueBd}`, background: C.white, color: C.blue, cursor: 'pointer' }}>
                    <Icon d={ICONS.download} size={14} color={C.blue} /> CSV Template
                  </button>
                  <button onClick={() => downloadTemplate('excel')}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, border: `1px solid ${C.greenBd}`, background: C.white, color: C.green, cursor: 'pointer' }}>
                    <Icon d={ICONS.download} size={14} color={C.green} /> Excel Template
                  </button>
                </div>
              </div>
            </div>

            {/* Template column reference */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.textSm, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Template Columns</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {BULK_HEADERS.map(h => (
                  <span key={h} style={{ fontSize: 11, padding: '3px 9px', borderRadius: 6, background: ['firstName','lastName','email'].includes(h) ? C.purpleLt : C.gray100, color: ['firstName','lastName','email'].includes(h) ? C.purple : C.textSm, border: `1px solid ${['firstName','lastName','email'].includes(h) ? C.purpleBd : C.border}`, fontWeight: 600 }}>
                    {h}{['firstName','lastName','email'].includes(h) ? ' *' : ''}
                  </span>
                ))}
              </div>
            </div>

            {/* Step 2 — Upload File */}
            <div style={{ fontSize: 13, fontWeight: 700, color: C.textMd, marginBottom: 10 }}>Step 2 — Upload Filled File</div>
            <input id="bulkFileInput" type="file" accept=".csv,.xls,.xlsx,.txt" style={{ display: 'none' }}
              onChange={e => parseBulkFile(e.target.files?.[0])} />

            {!bulkFileName ? (
              <div
                onDragOver={e => { e.preventDefault(); setBulkDragOver(true); }}
                onDragLeave={() => setBulkDragOver(false)}
                onDrop={e => { e.preventDefault(); setBulkDragOver(false); parseBulkFile(e.dataTransfer.files?.[0]); }}
                onClick={() => document.getElementById('bulkFileInput').click()}
                style={{ border: `2px dashed ${bulkDragOver ? C.blue : C.border}`, borderRadius: 12, padding: '32px 20px', textAlign: 'center', cursor: 'pointer', background: bulkDragOver ? C.blueLt : C.gray100, transition: 'all 0.2s', marginBottom: 16 }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, background: bulkDragOver ? C.blueBd : C.gray200, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                  <Icon d={ICONS.upload} size={22} color={bulkDragOver ? C.blue : C.textXs} />
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: bulkDragOver ? C.blue : C.textMd, marginBottom: 4 }}>
                  {bulkDragOver ? 'Drop CSV or Excel file here' : 'Drag & drop your filled template here'}
                </div>
                <div style={{ fontSize: 12, color: C.textXs }}>Supports CSV, XLS, XLSX · No size limit</div>
                <div style={{ marginTop: 14 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600, background: C.white, border: `1px solid ${C.border}`, color: C.textMd, cursor: 'pointer' }}>
                    <Icon d={ICONS.paperclip} size={13} color={C.textSm} /> Browse File
                  </span>
                </div>
              </div>
            ) : (
              /* File loaded — show summary */
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', border: `1px solid ${C.blueBd}`, borderRadius: 10, background: C.blueLt, marginBottom: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 8, background: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon d={ICONS.fileDoc} size={18} color="#fff" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{bulkFileName}</div>
                    <div style={{ fontSize: 11, color: C.textSm, marginTop: 2 }}>
                      {bulkParsed.length > 0 && <span style={{ color: C.green, fontWeight: 600 }}>✓ {bulkParsed.length} valid rows</span>}
                      {bulkErrors.length > 0 && <span style={{ color: C.red, fontWeight: 600, marginLeft: 8 }}>⚠ {bulkErrors.length} errors</span>}
                    </div>
                  </div>
                  <button onClick={() => { setBulkFile(null); setBulkFileName(''); setBulkParsed([]); setBulkErrors([]); }}
                    style={{ padding: '5px 10px', borderRadius: 7, border: `1px solid ${C.redBd}`, background: C.white, color: C.red, cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Icon d={ICONS.xCircle} size={13} color={C.red} /> Remove
                  </button>
                </div>

                {/* Parse errors */}
                {bulkErrors.length > 0 && (
                  <div style={{ padding: '10px 14px', background: C.redLt, border: `1px solid ${C.redBd}`, borderRadius: 10, marginBottom: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.red, marginBottom: 6 }}>⚠ Rows skipped due to errors:</div>
                    {bulkErrors.map((e, i) => <div key={i} style={{ fontSize: 11, color: C.red, marginBottom: 2 }}>• {e}</div>)}
                  </div>
                )}

                {/* Preview table */}
                {bulkParsed.length > 0 && (
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.textSm, marginBottom: 8 }}>Preview ({Math.min(bulkParsed.length, 5)} of {bulkParsed.length} rows shown)</div>
                    <div style={{ overflowX: 'auto', borderRadius: 10, border: `1px solid ${C.border}` }}>
                      <table style={{ ...s.table, fontSize: 12 }}>
                        <thead>
                          <tr>
                            {['#','First Name','Last Name','Email','Phone','Job Title','Experience','Skills','CTC'].map(h => (
                              <th key={h} style={{ ...s.th, fontSize: 10, padding: '8px 12px' }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {bulkParsed.slice(0, 5).map((row, i) => (
                            <tr key={i}>
                              <td style={{ ...s.td, padding: '8px 12px', color: C.textXs }}>{i+1}</td>
                              <td style={{ ...s.td, padding: '8px 12px', fontWeight: 600 }}>{row.firstName}</td>
                              <td style={{ ...s.td, padding: '8px 12px' }}>{row.lastName}</td>
                              <td style={{ ...s.td, padding: '8px 12px' }}>{row.email}</td>
                              <td style={{ ...s.td, padding: '8px 12px' }}>{row.phone || '—'}</td>
                              <td style={{ ...s.td, padding: '8px 12px' }}>{row.jobTitle || '—'}</td>
                              <td style={{ ...s.td, padding: '8px 12px' }}>{row.experience || '—'}</td>
                              <td style={{ ...s.td, padding: '8px 12px' }}>{row.skills || '—'}</td>
                              <td style={{ ...s.td, padding: '8px 12px' }}>{row.currentCTC ? `${row.currentCTC} ${row.currency}` : '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Upload progress */}
            {bulkUploading && (
              <div style={{ marginBottom: 16, padding: '14px 16px', background: C.indigoLt, border: `1px solid ${C.indigoBd}`, borderRadius: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.indigo }}>Uploading candidates…</span>
                  <span style={{ fontSize: 12, color: C.indigo }}>{bulkProgress.done} / {bulkProgress.total}</span>
                </div>
                <div style={{ height: 6, background: C.indigoBd, borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: C.indigo, borderRadius: 99, width: `${(bulkProgress.done / bulkProgress.total) * 100}%`, transition: 'width 0.3s' }} />
                </div>
                {bulkProgress.failed > 0 && <div style={{ fontSize: 11, color: C.red, marginTop: 5 }}>⚠ {bulkProgress.failed} row(s) failed</div>}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
              <Btn variant="ghost" onClick={() => { setShowBulkModal(false); resetBulkModal(); }}>Cancel</Btn>
              <Btn variant="blue" onClick={handleBulkUpload} disabled={bulkUploading || !bulkParsed.length}>
                {bulkUploading
                  ? <><Spinner size={14} color="#fff" /> Uploading {bulkProgress.done}/{bulkProgress.total}…</>
                  : <><Icon d={ICONS.upload} size={14} color="#fff" /> Upload {bulkParsed.length > 0 ? `${bulkParsed.length} Candidates` : 'Candidates'}</>}
              </Btn>
            </div>
          </div>
        </Modal>

        {/* Snackbar */}
        {snackbar.show && (
          <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', borderRadius: 12, boxShadow: C.shadowLg, animation: 'slideIn 0.25s ease', ...(snackbar.type === 'success' ? { background: C.greenLt, border: `1px solid ${C.greenBd}`, color: C.green } : { background: C.redLt, border: `1px solid ${C.redBd}`, color: C.red }) }}>
            <Icon d={snackbar.type === 'success' ? ICONS.check : ICONS.warn} size={18} color={snackbar.type === 'success' ? C.green : C.red} />
            <span style={{ fontSize: 13, fontWeight: 600 }}>{snackbar.message}</span>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminVendorsPage;