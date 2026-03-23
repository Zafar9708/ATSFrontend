import { useState, useEffect } from "react";
 
// ─── Pipeline Data ────────────────────────────────────────────────────────────
const DEFAULT_STAGES = [
  { stage: "Applied",   count: 320, color: "#2563EB" },
  { stage: "Screening", count: 185, color: "#1D4ED8" },
  { stage: "Interview", count: 98,  color: "#0369A1" },
  { stage: "Technical", count: 54,  color: "#0891B2" },
  { stage: "Offer",     count: 28,  color: "#059669" },
  { stage: "Hired",     count: 15,  color: "#16A34A" },
];
 
// ─── Recruiter Data ───────────────────────────────────────────────────────────
const DEFAULT_WEEKS = [
  { label: "This Week", recruiters: [
    { name: "Priya Sharma",  dept: "Tech",    hires: 12, prev: 9  },
    { name: "Arjun Mehta",   dept: "Design",  hires: 9,  prev: 11 },
    { name: "Neha Kapoor",   dept: "Finance", hires: 8,  prev: 6  },
    { name: "Rahul Singh",   dept: "Tech",    hires: 7,  prev: 7  },
    { name: "Sunita Patel",  dept: "HR",      hires: 6,  prev: 4  },
    { name: "Vikram Joshi",  dept: "Sales",   hires: 5,  prev: 8  },
    { name: "Ananya Reddy",  dept: "Tech",    hires: 4,  prev: 3  },
    { name: "Deepak Nair",   dept: "Ops",     hires: 3,  prev: 5  },
  ]},
  { label: "Last Week", recruiters: [
    { name: "Arjun Mehta",   dept: "Design",  hires: 11, prev: 8  },
    { name: "Priya Sharma",  dept: "Tech",    hires: 9,  prev: 7  },
    { name: "Vikram Joshi",  dept: "Sales",   hires: 8,  prev: 6  },
    { name: "Rahul Singh",   dept: "Tech",    hires: 7,  prev: 5  },
    { name: "Neha Kapoor",   dept: "Finance", hires: 6,  prev: 9  },
    { name: "Deepak Nair",   dept: "Ops",     hires: 5,  prev: 3  },
    { name: "Ananya Reddy",  dept: "Tech",    hires: 3,  prev: 4  },
    { name: "Sunita Patel",  dept: "HR",      hires: 4,  prev: 6  },
  ]},
  { label: "Week -2", recruiters: [
    { name: "Vikram Joshi",  dept: "Sales",   hires: 10, prev: 7  },
    { name: "Priya Sharma",  dept: "Tech",    hires: 9,  prev: 8  },
    { name: "Neha Kapoor",   dept: "Finance", hires: 9,  prev: 5  },
    { name: "Arjun Mehta",   dept: "Design",  hires: 8,  prev: 9  },
    { name: "Sunita Patel",  dept: "HR",      hires: 6,  prev: 4  },
    { name: "Rahul Singh",   dept: "Tech",    hires: 5,  prev: 6  },
    { name: "Deepak Nair",   dept: "Ops",     hires: 3,  prev: 4  },
    { name: "Ananya Reddy",  dept: "Tech",    hires: 4,  prev: 3  },
  ]},
  { label: "Week -3", recruiters: [
    { name: "Neha Kapoor",   dept: "Finance", hires: 11, prev: 6  },
    { name: "Priya Sharma",  dept: "Tech",    hires: 10, prev: 9  },
    { name: "Arjun Mehta",   dept: "Design",  hires: 9,  prev: 7  },
    { name: "Deepak Nair",   dept: "Ops",     hires: 7,  prev: 4  },
    { name: "Rahul Singh",   dept: "Tech",    hires: 6,  prev: 8  },
    { name: "Vikram Joshi",  dept: "Sales",   hires: 5,  prev: 7  },
    { name: "Sunita Patel",  dept: "HR",      hires: 4,  prev: 3  },
    { name: "Ananya Reddy",  dept: "Tech",    hires: 3,  prev: 2  },
  ]},
];
 
const AVATARS = [
  { bg: "#dbeafe", txt: "#1D4ED8" }, { bg: "#dcfce7", txt: "#15803d" },
  { bg: "#fce7f3", txt: "#9d174d" }, { bg: "#fef3c7", txt: "#92400e" },
  { bg: "#ede9fe", txt: "#6d28d9" }, { bg: "#fee2e2", txt: "#b91c1c" },
  { bg: "#e0f2fe", txt: "#0369a1" }, { bg: "#f0fdf4", txt: "#166534" },
];
 
// ─── Helpers ──────────────────────────────────────────────────────────────────
function buildSegments(data) {
  const total = data.reduce((s, d) => s + d.count, 0);
  let cum = -Math.PI / 2;
  return data.map((d) => {
    const pct = total === 0 ? 0 : d.count / total;
    const sa = cum, ea = cum + pct * 2 * Math.PI; cum = ea;
    return { ...d, pct, sa, ea, total };
  });
}
function polar(cx, cy, r, a) { return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }; }
function donutPath(cx, cy, or_, ir, sa, ea) {
  const s1 = polar(cx, cy, or_, sa), e1 = polar(cx, cy, or_, ea);
  const s2 = polar(cx, cy, ir, ea), e2 = polar(cx, cy, ir, sa);
  const la = ea - sa > Math.PI ? 1 : 0;
  return `M${s1.x} ${s1.y} A${or_} ${or_} 0 ${la} 1 ${e1.x} ${e1.y} L${s2.x} ${s2.y} A${ir} ${ir} 0 ${la} 0 ${e2.x} ${e2.y} Z`;
}
function initials(name) { return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase(); }
 
// ─── Donut Chart ──────────────────────────────────────────────────────────────
function DonutChart({ segments, hovered, onHover }) {
  const cx = 100, cy = 100, outerR = 88, innerR = 46;
  const total = segments.reduce((s, d) => s + d.count, 0);
  const active = hovered !== null ? segments[hovered] : null;
  return (
    <svg width={200} height={200} viewBox="0 0 200 200">
      {segments.map((seg, i) => {
        const isHov = hovered === i;
        const mid = (seg.sa + seg.ea) / 2;
        return (
          <g key={seg.stage}
            style={{ transform: isHov ? `translate(${Math.cos(mid)*5}px,${Math.sin(mid)*5}px)` : "translate(0,0)", transition: "transform 0.2s ease", cursor: "pointer" }}
            onMouseEnter={() => onHover(i)} onMouseLeave={() => onHover(null)}>
            <path d={donutPath(cx, cy, outerR, innerR, seg.sa, seg.ea)} fill={seg.color}
              stroke="#f1f5f9" strokeWidth={2}
              style={{ opacity: hovered === null || isHov ? 1 : 0.35, transition: "opacity 0.2s",
                filter: isHov ? `drop-shadow(0 3px 10px ${seg.color}66)` : "none" }} />
          </g>
        );
      })}
      {active ? (<>
        <text x={cx} y={cy-5} textAnchor="middle" fontSize={20} fontWeight={700} fill={active.color}>{Math.round(active.pct*100)}%</text>
        <text x={cx} y={cy+11} textAnchor="middle" fontSize={9} fill="#64748b">{active.stage}</text>
        <text x={cx} y={cy+26} textAnchor="middle" fontSize={11} fontWeight={600} fill="#1e3a5f">{active.count.toLocaleString()}</text>
      </>) : (<>
        <text x={cx} y={cy-5} textAnchor="middle" fontSize={22} fontWeight={700} fill="#1e3a5f">{total.toLocaleString()}</text>
        <text x={cx} y={cy+13} textAnchor="middle" fontSize={9} fill="#64748b">candidates</text>
      </>)}
    </svg>
  );
}
 
// ─── Edit Modal ───────────────────────────────────────────────────────────────
function PipelineEditModal({ stages, onSave, onClose }) {
  const [draft, setDraft] = useState(stages.map(s => ({ ...s })));
  const update = (i, field, val) => setDraft(d => d.map((s, idx) => idx === i ? { ...s, [field]: field === "count" ? Math.max(0, Number(val)||0) : val } : s));
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(15,23,42,.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:50 }}>
      <div style={{ background:"#fff",borderRadius:16,padding:24,width:390,maxHeight:"80vh",overflowY:"auto",boxShadow:"0 20px 60px rgba(30,58,95,.25)" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
          <h3 style={{ fontSize:14,fontWeight:700,color:"#1e3a5f",margin:0 }}>Edit Pipeline Data</h3>
          <button onClick={onClose} style={{ background:"#f1f5f9",border:"none",borderRadius:8,padding:"4px 9px",cursor:"pointer",fontSize:13,color:"#64748b" }}>✕</button>
        </div>
        {draft.map((s, i) => (
          <div key={i} style={{ display:"flex",gap:7,alignItems:"center",marginBottom:7 }}>
            <input type="color" value={s.color} onChange={e => update(i,"color",e.target.value)} style={{ width:30,height:30,border:"none",borderRadius:6,cursor:"pointer",padding:2,flexShrink:0 }} />
            <input value={s.stage} onChange={e => update(i,"stage",e.target.value)} style={{ flex:1,padding:"6px 9px",borderRadius:7,border:"1px solid #e2e8f0",fontSize:12,color:"#1e293b",outline:"none" }} />
            <input type="number" value={s.count} min={0} onChange={e => update(i,"count",e.target.value)} style={{ width:62,padding:"6px 7px",borderRadius:7,border:"1px solid #e2e8f0",fontSize:12,color:"#1e293b",outline:"none",textAlign:"center" }} />
            <button onClick={() => setDraft(d => d.filter((_,idx) => idx!==i))} style={{ background:"#fee2e2",border:"none",borderRadius:6,padding:"5px 7px",cursor:"pointer",color:"#dc2626",fontSize:11,width:26 }}>✕</button>
          </div>
        ))}
        <button onClick={() => setDraft(d => [...d, { stage:"New Stage",count:0,color:"#7C3AED" }])}
          style={{ width:"100%",padding:8,borderRadius:7,border:"1.5px dashed #bfdbfe",background:"#eff6ff",color:"#2563eb",fontSize:12,cursor:"pointer",marginTop:4 }}>+ Add Stage</button>
        <div style={{ display:"flex",gap:8,marginTop:16 }}>
          <button onClick={onClose} style={{ flex:1,padding:9,borderRadius:7,border:"1px solid #e2e8f0",background:"#f8fafc",color:"#64748b",cursor:"pointer",fontSize:12 }}>Cancel</button>
          <button onClick={() => onSave(draft)} style={{ flex:1,padding:9,borderRadius:7,border:"none",background:"#2563EB",color:"#fff",cursor:"pointer",fontSize:12,fontWeight:600 }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}
 
// ─── Recruiter Leaderboard ────────────────────────────────────────────────────
function RecruiterPanel({ weeks, onUpdateWeek }) {
  const [activeWeek, setActiveWeek] = useState(0);
  const [animated, setAnimated] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [recDraft, setRecDraft] = useState([]);
 
  const week = weeks[activeWeek];
  const sorted = [...week.recruiters].sort((a, b) => b.hires - a.hires);
  const totalHires = sorted.reduce((s, r) => s + r.hires, 0);
  const maxHires = sorted[0]?.hires || 1;
  const RANK_MEDALS = ["🥇","🥈","🥉"];
 
  useEffect(() => { setAnimated(false); const t = setTimeout(() => setAnimated(true), 100); return () => clearTimeout(t); }, [activeWeek]);
 
  return (
    <div style={{ background:"#fff",borderRadius:16,boxShadow:"0 2px 14px rgba(30,58,95,0.09)",overflow:"hidden" }}>
      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#1e3a5f,#1D4ED8)",padding:"16px 20px" }}>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10 }}>
          <div>
            <p style={{ fontSize:9,fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",color:"#93c5fd",margin:0,marginBottom:2 }}>Weekly Performance</p>
            <h3 style={{ fontSize:17,fontWeight:700,color:"#fff",margin:0 }}>Recruiter Leaderboard</h3>
          </div>
          <button onClick={() => { setRecDraft(week.recruiters.map(r=>({...r}))); setShowEdit(true); }}
            style={{ background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.3)",borderRadius:7,padding:"6px 12px",color:"#fff",fontSize:11,fontWeight:500,cursor:"pointer" }}>
            ✎ Edit
          </button>
        </div>
        <div style={{ display:"flex",gap:4 }}>
          {weeks.map((w, i) => (
            <button key={i} onClick={() => setActiveWeek(i)}
              style={{ padding:"5px 10px",borderRadius:6,fontSize:11,fontWeight:500,cursor:"pointer",
                border:`1px solid ${i===activeWeek?"rgba(255,255,255,.4)":"rgba(255,255,255,.2)"}`,
                background:i===activeWeek?"rgba(255,255,255,.2)":"transparent",
                color:i===activeWeek?"#fff":"rgba(255,255,255,.65)" }}>
              {w.label}
            </button>
          ))}
        </div>
      </div>
      {/* Body */}
      <div style={{ padding:"14px 16px" }}>
        {/* Summary */}
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:14 }}>
          {[{ val: totalHires, lbl:"Total Hires" },{ val: (totalHires/sorted.length).toFixed(1), lbl:"Avg / Recruiter" }].map(s => (
            <div key={s.lbl} style={{ background:"#f8fafc",borderRadius:10,padding:"10px 12px",textAlign:"center" }}>
              <div style={{ fontSize:18,fontWeight:700,color:"#1e3a5f" }}>{s.val}</div>
              <div style={{ fontSize:9,color:"#94a3b8",marginTop:2,textTransform:"uppercase",letterSpacing:".05em" }}>{s.lbl}</div>
            </div>
          ))}
        </div>
        {/* List */}
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8 }}>
          <span style={{ fontSize:11,fontWeight:700,color:"#1e3a5f",textTransform:"uppercase",letterSpacing:".06em" }}>Rankings</span>
          <span style={{ fontSize:10,color:"#94a3b8" }}>{week.label}</span>
        </div>
        {sorted.map((r, i) => {
          const av = AVATARS[i % AVATARS.length];
          const diff = r.hires - r.prev;
          const barW = Math.round((r.hires / maxHires) * 100);
          return (
            <div key={r.name} style={{ display:"flex",alignItems:"center",gap:8,padding:"8px 8px",borderRadius:10,cursor:"pointer",marginBottom:2,transition:"background .15s" }}
              onMouseEnter={e => e.currentTarget.style.background="#f1f5f9"}
              onMouseLeave={e => e.currentTarget.style.background="transparent"}>
              <div style={{ width:18,textAlign:"center",fontSize:i<3?14:11,fontWeight:700,color:i<3?"inherit":"#94a3b8",flexShrink:0 }}>{i<3?RANK_MEDALS[i]:i+1}</div>
              <div style={{ width:30,height:30,borderRadius:"50%",background:av.bg,color:av.txt,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,flexShrink:0 }}>{initials(r.name)}</div>
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ fontSize:12,fontWeight:600,color:"#1e293b",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{r.name}</div>
                <div style={{ fontSize:9,color:"#94a3b8" }}>{r.dept}</div>
              </div>
              <div style={{ flexShrink:0 }}>
                {diff > 0 ? <span style={{ background:"#dcfce7",color:"#16a34a",borderRadius:999,padding:"2px 6px",fontSize:9,fontWeight:600 }}>▲{diff}</span>
                 : diff < 0 ? <span style={{ background:"#fee2e2",color:"#dc2626",borderRadius:999,padding:"2px 6px",fontSize:9,fontWeight:600 }}>▼{Math.abs(diff)}</span>
                 : <span style={{ fontSize:9,color:"#94a3b8" }}>—</span>}
              </div>
              <div style={{ textAlign:"right",flexShrink:0 }}>
                <div style={{ fontSize:14,fontWeight:700,color:"#1e3a5f" }}>{r.hires}</div>
                <div style={{ fontSize:9,color:"#94a3b8" }}>hires</div>
              </div>
              <div style={{ width:52,flexShrink:0 }}>
                <div style={{ height:3,borderRadius:999,background:"#e2e8f0",overflow:"hidden",marginTop:2 }}>
                  <div style={{ height:"100%",borderRadius:999,background:av.txt,width:animated?`${barW}%`:"0%",transition:`width 0.8s ease ${i*0.06}s` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* Recruiter Edit Modal */}
      {showEdit && (
        <div style={{ position:"fixed",inset:0,background:"rgba(15,23,42,.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:50 }}>
          <div style={{ background:"#fff",borderRadius:16,padding:24,width:390,maxHeight:"80vh",overflowY:"auto",boxShadow:"0 20px 60px rgba(30,58,95,.25)" }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6 }}>
              <h3 style={{ fontSize:14,fontWeight:700,color:"#1e3a5f",margin:0 }}>Edit Recruiter Data</h3>
              <button onClick={() => setShowEdit(false)} style={{ background:"#f1f5f9",border:"none",borderRadius:8,padding:"4px 9px",cursor:"pointer",fontSize:13,color:"#64748b" }}>✕</button>
            </div>
            <p style={{ fontSize:11,color:"#94a3b8",marginBottom:12 }}>Editing: {week.label}</p>
            <div style={{ display:"flex",gap:6,marginBottom:6,fontSize:10,color:"#94a3b8" }}>
              <span style={{ flex:2 }}>Name</span><span style={{ flex:1 }}>Dept</span>
              <span style={{ width:62,textAlign:"center" }}>Hires</span><span style={{ width:26 }}/>
            </div>
            {recDraft.map((r, i) => (
              <div key={i} style={{ display:"flex",gap:7,alignItems:"center",marginBottom:7 }}>
                <input value={r.name} onChange={e => setRecDraft(d => d.map((x,idx) => idx===i?{...x,name:e.target.value}:x))}
                  style={{ flex:2,padding:"6px 9px",borderRadius:7,border:"1px solid #e2e8f0",fontSize:12,color:"#1e293b",outline:"none" }} />
                <input value={r.dept} onChange={e => setRecDraft(d => d.map((x,idx) => idx===i?{...x,dept:e.target.value}:x))}
                  style={{ flex:1,padding:"6px 9px",borderRadius:7,border:"1px solid #e2e8f0",fontSize:12,color:"#1e293b",outline:"none" }} />
                <input type="number" value={r.hires} min={0} onChange={e => setRecDraft(d => d.map((x,idx) => idx===i?{...x,hires:Math.max(0,parseInt(e.target.value)||0)}:x))}
                  style={{ width:62,padding:"6px 7px",borderRadius:7,border:"1px solid #e2e8f0",fontSize:12,color:"#1e293b",outline:"none",textAlign:"center" }} />
                <button onClick={() => setRecDraft(d => d.filter((_,idx) => idx!==i))} style={{ background:"#fee2e2",border:"none",borderRadius:6,padding:"5px 7px",cursor:"pointer",color:"#dc2626",fontSize:11,width:26 }}>✕</button>
              </div>
            ))}
            <button onClick={() => setRecDraft(d => [...d,{name:"New Recruiter",dept:"",hires:0,prev:0}])}
              style={{ width:"100%",padding:8,borderRadius:7,border:"1.5px dashed #bfdbfe",background:"#eff6ff",color:"#2563eb",fontSize:12,cursor:"pointer",marginTop:4 }}>+ Add Recruiter</button>
            <div style={{ display:"flex",gap:8,marginTop:16 }}>
              <button onClick={() => setShowEdit(false)} style={{ flex:1,padding:9,borderRadius:7,border:"1px solid #e2e8f0",background:"#f8fafc",color:"#64748b",cursor:"pointer",fontSize:12 }}>Cancel</button>
              <button onClick={() => { onUpdateWeek(activeWeek, recDraft); setShowEdit(false); }}
                style={{ flex:1,padding:9,borderRadius:7,border:"none",background:"#2563EB",color:"#fff",cursor:"pointer",fontSize:12,fontWeight:600 }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
 
// ─── Main Export ──────────────────────────────────────────────────────────────
export default function RecruitmentDashboard() {
  const [stages, setStages] = useState(DEFAULT_STAGES);
  const [weeks, setWeeks] = useState(DEFAULT_WEEKS);
  const [hovered, setHovered] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [animated, setAnimated] = useState(false);
 
  const segments = buildSegments(stages);
  const total = stages.reduce((s, d) => s + d.count, 0);
  const hired = stages[stages.length-1]?.count || 0;
  const applied = stages[0]?.count || total;
  const convRate = applied > 0 ? ((hired/applied)*100).toFixed(1) : "0.0";
  const topStage = stages.reduce((a,b) => a.count>b.count?a:b, stages[0]);
 
  useEffect(() => { setAnimated(false); const t = setTimeout(() => setAnimated(true), 80); return () => clearTimeout(t); }, [stages]);
 
  return (
    <div style={{ background:"#f1f5f9", padding:16, width:"100%", minHeight:"100%" }} style={{ fontFamily:"'DM Sans',system-ui,sans-serif" }}>
      {/* Two-column layout */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:14, alignItems:"start", width:"100%" }}>
 
        {/* LEFT: Pipeline Card */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div style={{ background:"linear-gradient(135deg,#2563EB,#1D4ED8)",padding:"16px 20px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
            <div>
              <p style={{ fontSize:9,fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",color:"#bfdbfe",margin:0,marginBottom:2 }}>Recruitment Analytics</p>
              <h2 style={{ fontSize:17,fontWeight:700,color:"#fff",margin:0 }}>Candidate Pipeline</h2>
            </div>
            <button onClick={() => setShowEdit(true)} style={{ background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.3)",borderRadius:7,padding:"6px 12px",color:"#fff",fontSize:11,fontWeight:500,cursor:"pointer" }}>✎ Edit Data</button>
          </div>
          {/* Strip */}
          <div style={{ background:"#1e3a5f",display:"grid",gridTemplateColumns:`repeat(${stages.length},1fr)`,gap:1 }}>
            {segments.map((seg,i) => (
              <div key={seg.stage} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
                style={{ padding:"10px 4px",textAlign:"center",cursor:"pointer",borderBottom:`3px solid ${hovered===i?seg.color:"transparent"}`,transition:"border-color .18s" }}>
                <div style={{ fontSize:15,fontWeight:700,color:hovered===i?seg.color:"#fff",transition:"color .18s" }}>{seg.count.toLocaleString()}</div>
                <div style={{ fontSize:8,color:"#93c5fd",marginTop:1,letterSpacing:".04em",textTransform:"uppercase" }}>{seg.stage}</div>
              </div>
            ))}
          </div>
          {/* Body side-by-side */}
          <div style={{ display:"flex",flexDirection:"row",alignItems:"flex-start",padding:"18px 16px" }}>
            <div style={{ flexShrink:0,width:200,display:"flex",alignItems:"center",justifyContent:"center" }}>
              <DonutChart segments={segments} hovered={hovered} onHover={setHovered} />
            </div>
            <div style={{ flex:1,minWidth:0,paddingLeft:14 }}>
              <p style={{ fontSize:11,color:"#94a3b8",marginBottom:12 }}>
                {total.toLocaleString()} total &middot; <span style={{ fontWeight:600,color:"#2563EB" }}>{convRate}%</span> hire rate
              </p>
              {segments.map((seg,i) => {
                const isHov = hovered===i;
                return (
                  <div key={seg.stage} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}
                    style={{ borderRadius:8,padding:"7px 10px",marginBottom:4,cursor:"pointer",border:`1px solid ${isHov?seg.color+"44":"transparent"}`,background:isHov?`${seg.color}12`:"transparent",transition:"all .18s" }}>
                    <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:5 }}>
                      <div style={{ display:"flex",alignItems:"center",gap:7 }}>
                        <span style={{ width:8,height:8,borderRadius:"50%",background:seg.color,display:"inline-block",flexShrink:0 }} />
                        <span style={{ fontSize:12,fontWeight:500,color:isHov?seg.color:"#334155",transition:"color .18s" }}>{seg.stage}</span>
                      </div>
                      <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                        <span style={{ fontSize:11,color:"#94a3b8" }}>{seg.count.toLocaleString()}</span>
                        <span style={{ fontSize:11,fontWeight:600,color:isHov?seg.color:"#94a3b8",minWidth:28,textAlign:"right",transition:"color .18s" }}>{Math.round(seg.pct*100)}%</span>
                      </div>
                    </div>
                    <div style={{ height:3,borderRadius:999,background:"#e2e8f0",overflow:"hidden" }}>
                      <div style={{ height:"100%",borderRadius:999,background:seg.color,width:animated?`${Math.round(seg.pct*100)}%`:"0%",transition:`width 0.85s ease ${i*0.07}s,opacity 0.18s`,opacity:hovered===null||isHov?1:0.3 }} />
                    </div>
                  </div>
                );
              })}
              <div style={{ marginTop:10,paddingTop:10,borderTop:"1px solid #f1f5f9",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                <span style={{ fontSize:11,color:"#94a3b8" }}>Hire conversion</span>
                <span style={{ fontSize:13,fontWeight:700,color:"#2563EB" }}>{convRate}%</span>
              </div>
            </div>
          </div>
          {/* Footer */}
          <div style={{ background:"#f8fafc",borderTop:"1px solid #f1f5f9",padding:"12px 20px",display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8 }}>
            {[{ val:stages.length, lbl:"stages" },{ val:topStage?.stage||"—", lbl:"top stage" },{ val:Math.round(total/(stages.length||1)).toLocaleString(), lbl:"avg/stage" }].map(s => (
              <div key={s.lbl} style={{ textAlign:"center" }}>
                <div style={{ fontSize:14,fontWeight:700,color:"#1e3a5f" }}>{s.val}</div>
                <div style={{ fontSize:9,color:"#94a3b8",marginTop:1 }}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
 
        {/* RIGHT: Recruiter Panel */}
        <RecruiterPanel weeks={weeks} onUpdateWeek={(idx, recs) => setWeeks(w => w.map((wk,i) => i===idx?{...wk,recruiters:recs}:wk))} />
      </div>
 
      {showEdit && <PipelineEditModal stages={stages} onSave={(s) => { setStages(s); setShowEdit(false); }} onClose={() => setShowEdit(false)} />}
    </div>
  );
}