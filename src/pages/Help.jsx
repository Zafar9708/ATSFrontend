import React, { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --blue:      #2563eb;
  --blue-dk:   #1d4ed8;
  --blue-lt:   #eff6ff;
  --blue-mid:  #dbeafe;
  --slate-900: #0f172a;
  --slate-800: #1e293b;
  --slate-700: #334155;
  --slate-600: #475569;
  --slate-400: #94a3b8;
  --slate-300: #cbd5e1;
  --slate-200: #e2e8f0;
  --slate-100: #f1f5f9;
  --slate-50:  #f8fafc;
  --white:     #ffffff;
  --green:     #059669;
  --green-lt:  #ecfdf5;
  --amber:     #d97706;
  --amber-lt:  #fffbeb;
  --red:       #dc2626;
  --red-lt:    #fef2f2;
  --violet:    #7c3aed;
  --violet-lt: #f5f3ff;
}

.hp {
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  background: #f0f2f5;
  min-height: 100vh;
  color: var(--slate-900);
  margin-left: 80px;
}
@media (max-width: 900px) { .hp { margin-left: 0; } }

/* ── TOP BAR ── */
.hp-topbar {
  background: var(--white);
  border-bottom: 1px solid var(--slate-200);
  padding: 0 16px;
  height: 58px;
  display: flex; align-items: center; justify-content: space-between;
  position: sticky; top: 0; z-index: 100;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.hp-topbar-title {
  font-size: 15px; font-weight: 800; color: var(--slate-900);
  display: flex; align-items: center; gap: 10px;
}
.hp-topbar-icon {
  width: 30px; height: 30px; border-radius: 8px;
  background: var(--blue-lt); border: 1px solid var(--blue-mid);
  display: flex; align-items: center; justify-content: center;
}

/* ── BODY ── */
.hp-body { padding: 20px 16px 80px; }
@media (max-width: 600px) { .hp-body { padding: 14px 12px 60px; } }

/* ── HERO SEARCH ── */
.hp-hero {
  background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #3b82f6 100%);
  border-radius: 16px;
  padding: 40px 36px;
  margin-bottom: 28px;
  position: relative;
  overflow: hidden;
}
.hp-hero::before {
  content: '';
  position: absolute; inset: 0;
  background: radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 60%);
}
.hp-hero::after {
  content: '';
  position: absolute; right: -40px; top: -40px;
  width: 200px; height: 200px;
  border-radius: 50%;
  background: rgba(255,255,255,0.04);
}
@media (max-width: 600px) { .hp-hero { padding: 28px 20px; } }

.hp-hero-label {
  display: inline-flex; align-items: center; gap: 6px;
  background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2);
  color: #fff; font-size: 11.5px; font-weight: 700;
  padding: 4px 12px; border-radius: 20px;
  margin-bottom: 14px; text-transform: uppercase; letter-spacing: 0.5px;
}
.hp-hero-title {
  font-size: clamp(22px, 3vw, 30px); font-weight: 800;
  color: #fff; margin-bottom: 8px; letter-spacing: -0.4px; line-height: 1.2;
}
.hp-hero-sub {
  font-size: 14px; color: rgba(255,255,255,0.7);
  margin-bottom: 24px; font-weight: 500;
}
.hp-search-box {
  display: flex; align-items: center; gap: 0;
  background: var(--white); border-radius: 10px;
  overflow: hidden; max-width: 560px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  position: relative; z-index: 1;
}
.hp-search-input {
  flex: 1; border: none; outline: none;
  padding: 13px 16px; font-family: inherit;
  font-size: 14px; color: var(--slate-900);
  background: transparent;
}
.hp-search-input::placeholder { color: var(--slate-400); }
.hp-search-btn {
  background: var(--blue); color: #fff;
  border: none; padding: 0 20px; height: 100%;
  font-family: inherit; font-size: 13px; font-weight: 700;
  cursor: pointer; display: flex; align-items: center; gap: 6px;
  transition: background .15s; white-space: nowrap;
  min-height: 48px;
}
.hp-search-btn:hover { background: var(--blue-dk); }

/* search results dropdown */
.hp-search-results {
  position: absolute; top: calc(100% + 8px); left: 0; right: 0;
  background: var(--white); border: 1.5px solid var(--slate-200);
  border-radius: 10px; z-index: 200;
  box-shadow: 0 8px 30px rgba(0,0,0,0.12);
  overflow: hidden; max-height: 280px; overflow-y: auto;
}
.hp-sr-item {
  padding: 12px 16px; cursor: pointer;
  border-bottom: 1px solid var(--slate-100);
  transition: background .1s;
  display: flex; align-items: flex-start; gap: 10px;
}
.hp-sr-item:last-child { border-bottom: none; }
.hp-sr-item:hover { background: var(--blue-lt); }
.hp-sr-q { font-size: 13.5px; font-weight: 600; color: var(--slate-900); }
.hp-sr-cat { font-size: 11px; color: var(--slate-400); margin-top: 2px; }
.hp-sr-empty { padding: 24px; text-align: center; color: var(--slate-400); font-size: 13px; }

/* ── QUICK ACTIONS ── */
.hp-section-title {
  font-size: 13px; font-weight: 800; color: var(--slate-500);
  text-transform: uppercase; letter-spacing: 0.6px;
  margin-bottom: 14px;
}
.hp-quick-grid {
  display: grid; grid-template-columns: repeat(4, 1fr);
  gap: 14px; margin-bottom: 28px;
}
@media (max-width: 900px)  { .hp-quick-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px)  { .hp-quick-grid { grid-template-columns: 1fr 1fr; } }

.hp-quick-card {
  background: var(--white); border: 1.5px solid var(--slate-200);
  border-radius: 12px; padding: 20px 18px;
  cursor: pointer; transition: all .18s;
  display: flex; flex-direction: column; gap: 10px;
  text-decoration: none;
}
.hp-quick-card:hover {
  border-color: var(--blue); transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(37,99,235,0.1);
}
.hp-quick-icon {
  width: 40px; height: 40px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
}
.hp-quick-label { font-size: 13.5px; font-weight: 700; color: var(--slate-800); }
.hp-quick-sub { font-size: 12px; color: var(--slate-400); font-weight: 500; }

/* ── MAIN LAYOUT ── */
.hp-layout {
  display: grid; grid-template-columns: 1fr 340px;
  gap: 20px; align-items: start;
}
@media (max-width: 1024px) { .hp-layout { grid-template-columns: 1fr; } }

/* ── CARD ── */
.hcard {
  background: var(--white); border: 1px solid var(--slate-200);
  border-radius: 12px; overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  margin-bottom: 20px;
}
.hcard-head {
  padding: 16px 20px; border-bottom: 1px solid var(--slate-100);
  display: flex; align-items: center; justify-content: space-between; gap: 10px;
}
.hcard-title {
  font-size: 14px; font-weight: 700; color: var(--slate-800);
  display: flex; align-items: center; gap: 8px;
}
.hcard-dot {
  width: 3px; height: 16px; border-radius: 2px; flex-shrink: 0;
}
.hcard-body { padding: 20px; }

/* ── CATEGORY TABS ── */
.faq-cats {
  display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 16px;
}
.faq-cat-btn {
  padding: 5px 13px; border-radius: 20px;
  font-family: inherit; font-size: 12.5px; font-weight: 600;
  cursor: pointer; border: 1.5px solid var(--slate-200);
  background: var(--white); color: var(--slate-600);
  transition: all .14s;
}
.faq-cat-btn:hover { border-color: var(--blue); color: var(--blue); }
.faq-cat-btn.active {
  background: var(--blue); color: var(--white);
  border-color: var(--blue);
}

/* ── FAQ ACCORDION ── */
.faq-item {
  border: 1px solid var(--slate-200); border-radius: 10px;
  margin-bottom: 8px; overflow: hidden;
  transition: border-color .15s, box-shadow .15s;
}
.faq-item.open { border-color: var(--blue-mid); box-shadow: 0 2px 12px rgba(37,99,235,0.08); }
.faq-q {
  width: 100%; display: flex; align-items: center; justify-content: space-between;
  gap: 12px; padding: 15px 18px;
  background: none; border: none; cursor: pointer; text-align: left;
  font-family: inherit; transition: background .12s;
}
.faq-q:hover { background: var(--slate-50); }
.faq-item.open .faq-q { background: var(--blue-lt); }
.faq-q-text { font-size: 13.5px; font-weight: 700; color: var(--slate-800); flex: 1; line-height: 1.4; }
.faq-chevron {
  width: 22px; height: 22px; border-radius: 50%;
  background: var(--slate-100); display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; transition: transform .25s, background .15s;
}
.faq-item.open .faq-chevron { transform: rotate(180deg); background: var(--blue-mid); }
.faq-a {
  max-height: 0; overflow: hidden;
  transition: max-height .3s ease, padding .3s ease;
  padding: 0 18px;
  font-size: 13.5px; color: var(--slate-600); line-height: 1.75;
}
.faq-a.open { max-height: 300px; padding: 0 18px 16px; }
.faq-a-inner { padding-top: 10px; border-top: 1px solid var(--blue-mid); }

/* no results */
.faq-none { text-align: center; padding: 32px; color: var(--slate-400); font-size: 13px; }

/* ── CONTACT FORM ── */
.cf-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
@media (max-width: 600px) { .cf-grid { grid-template-columns: 1fr; } }

.cf-field { display: flex; flex-direction: column; gap: 5px; }
.cf-field.full { grid-column: 1 / -1; }
.cf-label { font-size: 11.5px; font-weight: 700; color: var(--slate-600); text-transform: uppercase; letter-spacing: 0.5px; }
.cf-input, .cf-textarea, .cf-select {
  width: 100%; padding: 9px 12px;
  border: 1.5px solid var(--slate-200); border-radius: 8px;
  font-family: inherit; font-size: 13.5px; color: var(--slate-900);
  background: var(--white); outline: none; transition: border-color .15s;
}
.cf-input:focus, .cf-textarea:focus, .cf-select:focus { border-color: var(--blue); }
.cf-input.err, .cf-textarea.err { border-color: var(--red); }
.cf-textarea { resize: vertical; min-height: 100px; }
.cf-err { font-size: 11.5px; color: var(--red); margin-top: 2px; }
.cf-submit {
  width: 100%; padding: 11px;
  background: var(--blue); color: var(--white);
  border: none; border-radius: 8px;
  font-family: inherit; font-size: 14px; font-weight: 700;
  cursor: pointer; transition: background .15s; margin-top: 6px;
  display: flex; align-items: center; justify-content: center; gap: 8px;
}
.cf-submit:hover { background: var(--blue-dk); }
.cf-submit:disabled { opacity: 0.7; cursor: not-allowed; }

.cf-success {
  text-align: center; padding: 28px 20px;
  display: flex; flex-direction: column; align-items: center; gap: 12px;
}
.cf-success-icon {
  width: 56px; height: 56px; border-radius: 50%;
  background: var(--green-lt); border: 2px solid #a7f3d0;
  display: flex; align-items: center; justify-content: center;
}
.cf-success-title { font-size: 16px; font-weight: 800; color: var(--slate-900); }
.cf-success-sub { font-size: 13px; color: var(--slate-500); }

/* ── LIVE CHAT ── */
.chat-window {
  background: var(--white); border: 1px solid var(--slate-200);
  border-radius: 12px; overflow: hidden;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  display: flex; flex-direction: column;
  height: 380px;
}
.chat-head {
  padding: 14px 16px; background: var(--blue);
  display: flex; align-items: center; gap: 10px;
}
.chat-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: rgba(255,255,255,0.2);
  display: flex; align-items: center; justify-content: center;
  font-size: 16px;
}
.chat-agent-name { font-size: 13.5px; font-weight: 700; color: #fff; }
.chat-status {
  font-size: 11.5px; color: rgba(255,255,255,0.75);
  display: flex; align-items: center; gap: 4px;
}
.chat-status-dot {
  width: 6px; height: 6px; border-radius: 50%; background: #4ade80;
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.chat-messages {
  flex: 1; overflow-y: auto; padding: 14px;
  display: flex; flex-direction: column; gap: 10px;
  background: #f8fafc;
}
.chat-messages::-webkit-scrollbar { width: 3px; }
.chat-messages::-webkit-scrollbar-thumb { background: var(--slate-200); border-radius: 3px; }

.chat-msg { display: flex; gap: 8px; align-items: flex-end; }
.chat-msg.user { flex-direction: row-reverse; }
.chat-msg-avatar {
  width: 28px; height: 28px; border-radius: 50%;
  flex-shrink: 0; display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700;
}
.chat-bubble {
  max-width: 76%; padding: 9px 13px;
  border-radius: 12px; font-size: 13px; line-height: 1.5;
}
.chat-msg.agent .chat-bubble {
  background: var(--white); color: var(--slate-800);
  border: 1px solid var(--slate-200);
  border-bottom-left-radius: 4px;
}
.chat-msg.user .chat-bubble {
  background: var(--blue); color: #fff;
  border-bottom-right-radius: 4px;
}
.chat-time { font-size: 10px; color: var(--slate-400); margin-top: 3px; text-align: right; }
.chat-msg.agent .chat-time { text-align: left; }

.chat-typing {
  display: flex; align-items: center; gap: 4px; padding: 6px 0;
}
.chat-typing span {
  width: 7px; height: 7px; border-radius: 50%; background: var(--slate-400);
  animation: typing 1.2s infinite;
}
.chat-typing span:nth-child(2) { animation-delay: .2s; }
.chat-typing span:nth-child(3) { animation-delay: .4s; }
@keyframes typing {
  0%, 100% { opacity: 0.3; transform: translateY(0); }
  50% { opacity: 1; transform: translateY(-3px); }
}

.chat-input-row {
  padding: 10px 12px; border-top: 1px solid var(--slate-100);
  display: flex; gap: 8px; align-items: center; background: var(--white);
}
.chat-input {
  flex: 1; border: 1.5px solid var(--slate-200); border-radius: 8px;
  padding: 8px 12px; font-family: inherit; font-size: 13px;
  color: var(--slate-900); outline: none; transition: border-color .14s;
}
.chat-input:focus { border-color: var(--blue); }
.chat-send {
  width: 36px; height: 36px; border-radius: 8px;
  background: var(--blue); color: #fff; border: none;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; flex-shrink: 0; transition: background .14s;
}
.chat-send:hover { background: var(--blue-dk); }
.chat-send:disabled { opacity: 0.5; cursor: not-allowed; }

/* ── STATUS / SYSTEM ── */
.hp-status-list { display: flex; flex-direction: column; gap: 0; }
.hp-status-row {
  display: flex; align-items: center; justify-content: space-between;
  padding: 11px 20px; border-bottom: 1px solid var(--slate-100);
}
.hp-status-row:last-child { border-bottom: none; }
.hp-status-name { font-size: 13px; font-weight: 600; color: var(--slate-700); }
.hp-status-pill {
  font-size: 11px; font-weight: 700; padding: 3px 9px; border-radius: 20px;
  display: flex; align-items: center; gap: 5px;
}
.hp-status-dot { width: 6px; height: 6px; border-radius: 50%; }

/* ── POPULAR TOPICS ── */
.topic-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 11px 20px; border-bottom: 1px solid var(--slate-100);
  cursor: pointer; transition: background .1s;
}
.topic-item:last-child { border-bottom: none; }
.topic-item:hover { background: var(--slate-50); }
.topic-left { display: flex; align-items: center; gap: 10px; }
.topic-icon {
  width: 30px; height: 30px; border-radius: 7px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.topic-name { font-size: 13px; font-weight: 600; color: var(--slate-800); }
.topic-views { font-size: 11.5px; color: var(--slate-400); margin-top: 1px; }

/* ── VERSION ── */
.hp-version {
  background: var(--white); border: 1px solid var(--slate-200);
  border-radius: 12px; padding: 16px 20px;
  display: flex; align-items: center; gap: 14px;
}
.hp-version-badge {
  font-size: 18px; font-weight: 900; color: var(--blue);
  letter-spacing: -0.5px;
}
.hp-version-label { font-size: 12px; font-weight: 700; color: var(--slate-500); text-transform: uppercase; letter-spacing: 0.5px; }
.hp-version-val { font-size: 13px; font-weight: 600; color: var(--slate-700); }

/* ── ANIMATIONS ── */
@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
.anim { animation: fadeIn .25s ease both; }
`;

/* ═══════════════════════════════════════════════════════════════
   ICONS
═══════════════════════════════════════════════════════════════ */
const Ic = ({ d, size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}>
    {d}
  </svg>
);
const I = {
  Search:   <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
  Help:     <><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
  Book:     <><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></>,
  Chat:     <><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></>,
  Video:    <><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></>,
  Mail:     <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
  Phone:    <><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></>,
  Check:    <><polyline points="20 6 9 17 4 12"/></>,
  Chevron:  <><polyline points="6 9 12 15 18 9"/></>,
  Send:     <><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>,
  Star:     <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></>,
  Shield:   <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></>,
  Refresh:  <><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></>,
  Zap:      <><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></>,
  Users:    <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></>,
  Settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></>,
  External: <><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></>,
};

/* ═══════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════ */
const FAQ_DATA = [
  { id: 1, cat: "Getting Started", q: "How do I create a new job posting?", a: "Navigate to Jobs → Create Job from the sidebar. Fill in the job title, department, description, hiring flow stages, and target hire date. You can also set salary range and priority level before publishing." },
  { id: 2, cat: "Getting Started", q: "How do I add a recruiter to my team?", a: "Go to Admin Dashboard → Recruiters section. Click 'Add Recruiter', fill in their email and details, and they'll receive a welcome email with login credentials automatically." },
  { id: 3, cat: "Candidates", q: "How do I move a candidate to the next stage?", a: "Open the candidate's profile or the job dashboard. In the candidate row, click the stage chip or the arrow icon on the right. Select the new stage from the dropdown menu. The change is saved instantly." },
  { id: 4, cat: "Candidates", q: "Can candidates reapply to the same position?", a: "Yes, if you enable 'Reapply Allowed' when creating a job. You can set a cooldown period (e.g. 30 days) before a candidate can reapply for the same role." },
  { id: 5, cat: "Candidates", q: "How is the matching score calculated?", a: "The matching score is derived from the candidate's resume analysis against the job description — skills overlap, experience level, and keyword alignment. Scores above 80% are highlighted in green." },
  { id: 6, cat: "Interviews", q: "How do I schedule an interview?", a: "From the job dashboard, click 'Schedule' in the Upcoming Interviews panel. Select the candidate, date, time, and interview type (Video, Phone, In-person). The candidate will receive an automated email invite." },
  { id: 7, cat: "Interviews", q: "What interview platforms are supported?", a: "The system supports Zoom, Google Meet, Microsoft Teams, and in-person interviews. You can also add a custom platform link when scheduling." },
  { id: 8, cat: "Vendors", q: "How do I invite a vendor?", a: "From Admin Dashboard, click 'Register Vendor'. Fill in the contact person and company details. Upon submission, login credentials are automatically emailed to the vendor." },
  { id: 9, cat: "Vendors", q: "What can vendors see after logging in?", a: "Vendors can upload candidate profiles for specific jobs they've been assigned to. They have a restricted view — they cannot see other vendors' candidates or internal recruiter notes." },
  { id: 10, cat: "Account", q: "How do I reset my password?", a: "Click 'Forgot Password' on the login page. Enter your registered email and you'll receive a reset link valid for 24 hours. For admin-managed accounts, contact your system administrator." },
  { id: 11, cat: "Account", q: "How do I update my profile information?", a: "Click your avatar in the top-right corner and select 'Profile'. You can update your name, photo, contact details, and notification preferences from there." },
  { id: 12, cat: "Reports", q: "When will Reports be available?", a: "The Reports module is currently under development. It will include hiring funnel analytics, time-to-hire metrics, recruiter performance, and exportable PDF/CSV reports. Stay tuned!" },
];

const CATEGORIES = ["All", "Getting Started", "Candidates", "Interviews", "Vendors", "Account", "Reports"];

const TOPICS = [
  { icon: "📋", bg: "#eff6ff", label: "Creating Job Postings", views: "2.4k views", id: 1 },
  { icon: "👤", bg: "#f0fdf4", label: "Managing Candidates", views: "1.8k views", id: 3 },
  { icon: "📅", bg: "#f5f3ff", label: "Scheduling Interviews", views: "1.2k views", id: 6 },
  { icon: "🏢", bg: "#fffbeb", label: "Vendor Management", views: "960 views", id: 8 },
  { icon: "🔐", bg: "#fef2f2", label: "Account & Security", views: "740 views", id: 10 },
];

const SYSTEM_STATUS = [
  { name: "Platform",         status: "Operational",    color: "#059669", bg: "#ecfdf5" },
  { name: "API Services",     status: "Operational",    color: "#059669", bg: "#ecfdf5" },
  { name: "Email Delivery",   status: "Operational",    color: "#059669", bg: "#ecfdf5" },
  { name: "File Uploads",     status: "Degraded",       color: "#d97706", bg: "#fffbeb" },
  { name: "Reports Module",   status: "Maintenance",    color: "#7c3aed", bg: "#f5f3ff" },
];

const BOT_RESPONSES = {
  default: ["Thanks for your message! Our support team typically responds within 2–4 hours during business hours.", "I've logged your query. A support agent will follow up shortly.", "Got it! If this is urgent, please use the contact form below for faster response."],
  job:     ["To create a job, go to Jobs → Create Job from the sidebar. Need more help with the job form?", "Job postings can be set as High Priority. Would you like to know how?"],
  candidate: ["Candidates can be moved between stages from the job dashboard. Want step-by-step guidance?", "The matching score is calculated from resume analysis. I can explain how it works in detail."],
  interview: ["Interviews can be scheduled from the job dashboard → Upcoming Interviews panel. Shall I walk you through it?"],
  password:  ["To reset your password, click 'Forgot Password' on the login page. Check your email for the reset link."],
  vendor:    ["Vendors can be registered from the Admin Dashboard. They get automated login credentials via email."],
  help:      ["I'm here to help! You can ask about jobs, candidates, interviews, vendors, or account settings."],
};

const getBotReply = (msg) => {
  const m = msg.toLowerCase();
  if (m.includes("job") || m.includes("posting"))      return BOT_RESPONSES.job[Math.floor(Math.random() * BOT_RESPONSES.job.length)];
  if (m.includes("candidate") || m.includes("stage"))  return BOT_RESPONSES.candidate[Math.floor(Math.random() * BOT_RESPONSES.candidate.length)];
  if (m.includes("interview") || m.includes("schedule")) return BOT_RESPONSES.interview[0];
  if (m.includes("password") || m.includes("reset") || m.includes("login")) return BOT_RESPONSES.password[0];
  if (m.includes("vendor"))                            return BOT_RESPONSES.vendor[0];
  if (m.includes("help") || m.includes("how"))        return BOT_RESPONSES.help[0];
  return BOT_RESPONSES.default[Math.floor(Math.random() * BOT_RESPONSES.default.length)];
};

const nowTime = () => new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
const HelpPage = () => {
  /* Search */
  const [query, setQuery]           = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  /* FAQ */
  const [activeCat, setActiveCat]   = useState("All");
  const [openFaq, setOpenFaq]       = useState(null);

  /* Contact form */
  const [form, setForm]             = useState({ name: "", email: "", subject: "", category: "", message: "" });
  const [formErrors, setFormErrors] = useState({});
  const [formSent, setFormSent]     = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  /* Chat */
  const [chatInput, setChatInput]   = useState("");
  const [chatMessages, setChatMessages] = useState([
    { id: 1, role: "agent", text: "👋 Hi! I'm your support assistant. Ask me anything about the platform.", time: nowTime() },
  ]);
  const [isTyping, setIsTyping]     = useState(false);
  const chatEndRef = useRef(null);

  /* Live clock */
  const [clock, setClock] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setClock(new Date()), 1000); return () => clearInterval(t); }, []);

  /* Click outside to close search */
  useEffect(() => {
    const h = (e) => { if (searchRef.current && !searchRef.current.contains(e.target)) setShowResults(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  /* Scroll chat to bottom */
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages, isTyping]);

  /* ── Live search ── */
  const handleSearch = (val) => {
    setQuery(val);
    if (!val.trim()) { setSearchResults([]); setShowResults(false); return; }
    const results = FAQ_DATA.filter(f =>
      f.q.toLowerCase().includes(val.toLowerCase()) ||
      f.a.toLowerCase().includes(val.toLowerCase()) ||
      f.cat.toLowerCase().includes(val.toLowerCase())
    );
    setSearchResults(results);
    setShowResults(true);
  };

  const pickResult = (item) => {
    setActiveCat(item.cat);
    setOpenFaq(item.id);
    setShowResults(false);
    setQuery(item.q);
    setTimeout(() => document.getElementById(`faq-${item.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 200);
  };

  /* ── FAQ filter ── */
  const visibleFaqs = FAQ_DATA.filter(f => activeCat === "All" || f.cat === activeCat);

  /* ── Contact form ── */
  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = "Name is required";
    if (!form.email.trim())   e.email   = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.subject.trim()) e.subject = "Subject is required";
    if (!form.message.trim()) e.message = "Message is required";
    return e;
  };
  const submitForm = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setFormLoading(true);
    setTimeout(() => { setFormLoading(false); setFormSent(true); }, 1600);
  };

  /* ── Chat send ── */
  const sendChat = () => {
    const text = chatInput.trim();
    if (!text) return;
    const userMsg = { id: Date.now(), role: "user", text, time: nowTime() };
    setChatMessages(m => [...m, userMsg]);
    setChatInput("");
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setChatMessages(m => [...m, { id: Date.now() + 1, role: "agent", text: getBotReply(text), time: nowTime() }]);
    }, 1200 + Math.random() * 800);
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="hp">

        {/* TOP BAR */}
        <div className="hp-topbar">
          <div className="hp-topbar-title">
            <div className="hp-topbar-icon">
              <Ic d={I.Help} size={16} color="#2563eb" />
            </div>
            Help Center
          </div>
          <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>
            {clock.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </div>
        </div>

        <div className="hp-body">

          {/* HERO */}
          <div className="hp-hero">
            <div className="hp-hero-label">
              <Ic d={I.Zap} size={11} color="#fff" /> Support Center
            </div>
            <h1 className="hp-hero-title">How can we help you?</h1>
            <p className="hp-hero-sub">Search our knowledge base or browse topics below</p>

            <div style={{ position: "relative", maxWidth: 560 }} ref={searchRef}>
              <div className="hp-search-box">
                <Ic d={I.Search} size={16} color="#94a3b8" style={{ marginLeft: 14, flexShrink: 0 }} />
                <input
                  className="hp-search-input"
                  placeholder="Search for answers…"
                  value={query}
                  onChange={e => handleSearch(e.target.value)}
                  onFocus={() => query && setShowResults(true)}
                />
                <button className="hp-search-btn">
                  <Ic d={I.Search} size={13} color="#fff" /> Search
                </button>
              </div>

              {/* Live search dropdown */}
              {showResults && (
                <div className="hp-search-results">
                  {searchResults.length > 0 ? searchResults.map(r => (
                    <div key={r.id} className="hp-sr-item" onClick={() => pickResult(r)}>
                      <Ic d={I.Book} size={14} color="#94a3b8" style={{ marginTop: 2, flexShrink: 0 }} />
                      <div>
                        <div className="hp-sr-q">{r.q}</div>
                        <div className="hp-sr-cat">{r.cat}</div>
                      </div>
                    </div>
                  )) : (
                    <div className="hp-sr-empty">No results for "{query}"</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div className="hp-section-title">Quick Actions</div>
          <div className="hp-quick-grid">
            {[
              { icon: I.Chat,     bg: "#eff6ff",  c: "#2563eb", label: "Live Chat",        sub: "Chat with support",       action: () => document.getElementById("chat-section")?.scrollIntoView({ behavior:"smooth" }) },
              { icon: I.Mail,     bg: "#f0fdf4",  c: "#059669", label: "Send a Ticket",    sub: "Get email response",      action: () => document.getElementById("contact-section")?.scrollIntoView({ behavior:"smooth" }) },
              { icon: I.Book,     bg: "#f5f3ff",  c: "#7c3aed", label: "Browse FAQs",      sub: `${FAQ_DATA.length} articles`, action: () => document.getElementById("faq-section")?.scrollIntoView({ behavior:"smooth" }) },
              { icon: I.Shield,   bg: "#fffbeb",  c: "#d97706", label: "System Status",    sub: "All systems online",      action: () => document.getElementById("status-section")?.scrollIntoView({ behavior:"smooth" }) },
            ].map((q, i) => (
              <div key={i} className="hp-quick-card" onClick={q.action}>
                <div className="hp-quick-icon" style={{ background: q.bg }}>
                  <Ic d={q.icon} size={20} color={q.c} />
                </div>
                <div>
                  <div className="hp-quick-label">{q.label}</div>
                  <div className="hp-quick-sub">{q.sub}</div>
                </div>
              </div>
            ))}
          </div>

          {/* MAIN LAYOUT */}
          <div className="hp-layout">

            {/* LEFT: FAQ + Contact Form */}
            <div>

              {/* FAQ */}
              <div className="hcard" id="faq-section">
                <div className="hcard-head">
                  <div className="hcard-title">
                    <div className="hcard-dot" style={{ background: "#2563eb" }} />
                    Frequently Asked Questions
                  </div>
                  <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>{visibleFaqs.length} articles</span>
                </div>
                <div className="hcard-body">
                  {/* Category filter */}
                  <div className="faq-cats">
                    {CATEGORIES.map(cat => (
                      <button
                        key={cat}
                        className={`faq-cat-btn${activeCat === cat ? " active" : ""}`}
                        onClick={() => { setActiveCat(cat); setOpenFaq(null); }}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Accordion */}
                  {visibleFaqs.length > 0 ? visibleFaqs.map(faq => (
                    <div
                      key={faq.id}
                      id={`faq-${faq.id}`}
                      className={`faq-item anim${openFaq === faq.id ? " open" : ""}`}
                    >
                      <button className="faq-q" onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}>
                        <span className="faq-q-text">{faq.q}</span>
                        <span className="faq-chevron">
                          <Ic d={I.Chevron} size={13} color={openFaq === faq.id ? "#2563eb" : "#94a3b8"} />
                        </span>
                      </button>
                      <div className={`faq-a${openFaq === faq.id ? " open" : ""}`}>
                        <div className="faq-a-inner">{faq.a}</div>
                      </div>
                    </div>
                  )) : (
                    <div className="faq-none">No articles in this category yet.</div>
                  )}
                </div>
              </div>

              {/* CONTACT FORM */}
              <div className="hcard" id="contact-section">
                <div className="hcard-head">
                  <div className="hcard-title">
                    <div className="hcard-dot" style={{ background: "#059669" }} />
                    Submit a Support Ticket
                  </div>
                  <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>Avg response: 2–4 hrs</span>
                </div>
                <div className="hcard-body">
                  {formSent ? (
                    <div className="cf-success anim">
                      <div className="cf-success-icon">
                        <Ic d={I.Check} size={26} color="#059669" />
                      </div>
                      <div className="cf-success-title">Ticket Submitted!</div>
                      <div className="cf-success-sub">We've received your request. Expect a reply at <strong>{form.email}</strong> within 2–4 business hours.</div>
                      <button
                        style={{ marginTop: 8, padding: "7px 20px", borderRadius: 7, background: "#f1f5f9", border: "none", fontFamily: "inherit", fontSize: 13, fontWeight: 600, cursor: "pointer", color: "#475569" }}
                        onClick={() => { setFormSent(false); setForm({ name:"", email:"", subject:"", category:"", message:"" }); }}
                      >
                        Submit Another
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={submitForm} noValidate>
                      <div className="cf-grid">
                        <div className="cf-field">
                          <label className="cf-label">Full Name</label>
                          <input className={`cf-input${formErrors.name ? " err" : ""}`} placeholder="Your name"
                            value={form.name} onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setFormErrors(fe => ({ ...fe, name: "" })); }} />
                          {formErrors.name && <span className="cf-err">{formErrors.name}</span>}
                        </div>
                        <div className="cf-field">
                          <label className="cf-label">Email Address</label>
                          <input className={`cf-input${formErrors.email ? " err" : ""}`} type="email" placeholder="you@company.com"
                            value={form.email} onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setFormErrors(fe => ({ ...fe, email: "" })); }} />
                          {formErrors.email && <span className="cf-err">{formErrors.email}</span>}
                        </div>
                        <div className="cf-field">
                          <label className="cf-label">Category</label>
                          <select className="cf-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                            <option value="">Select category…</option>
                            {CATEGORIES.filter(c => c !== "All").map(c => <option key={c}>{c}</option>)}
                          </select>
                        </div>
                        <div className="cf-field">
                          <label className="cf-label">Subject</label>
                          <input className={`cf-input${formErrors.subject ? " err" : ""}`} placeholder="Brief description"
                            value={form.subject} onChange={e => { setForm(f => ({ ...f, subject: e.target.value })); setFormErrors(fe => ({ ...fe, subject: "" })); }} />
                          {formErrors.subject && <span className="cf-err">{formErrors.subject}</span>}
                        </div>
                        <div className="cf-field full">
                          <label className="cf-label">Message</label>
                          <textarea className={`cf-textarea${formErrors.message ? " err" : ""}`} placeholder="Describe your issue in detail…"
                            value={form.message} onChange={e => { setForm(f => ({ ...f, message: e.target.value })); setFormErrors(fe => ({ ...fe, message: "" })); }} />
                          {formErrors.message && <span className="cf-err">{formErrors.message}</span>}
                        </div>
                      </div>
                      <button className="cf-submit" type="submit" disabled={formLoading}>
                        {formLoading
                          ? <><span style={{ width:14,height:14,border:"2px solid rgba(255,255,255,0.4)",borderTopColor:"#fff",borderRadius:"50%",display:"inline-block",animation:"dbs .7s linear infinite" }} /> Submitting…</>
                          : <><Ic d={I.Mail} size={14} color="#fff" /> Send Ticket</>}
                      </button>
                      <style>{`@keyframes dbs { to { transform: rotate(360deg); } }`}</style>
                    </form>
                  )}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN */}
            <div>

              {/* LIVE CHAT */}
              <div id="chat-section" style={{ marginBottom: 20 }}>
                <div className="hcard-title" style={{ marginBottom: 12, paddingLeft: 0 }}>
                  <div className="hcard-dot" style={{ background: "#7c3aed" }} />
                  Live Support Chat
                </div>
                <div className="chat-window">
                  {/* Chat header */}
                  <div className="chat-head">
                    <div className="chat-avatar">🤖</div>
                    <div>
                      <div className="chat-agent-name">Support Assistant</div>
                      <div className="chat-status">
                        <span className="chat-status-dot" /> Online now
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="chat-messages">
                    {chatMessages.map(msg => (
                      <div key={msg.id} className={`chat-msg ${msg.role} anim`}>
                        <div className="chat-msg-avatar" style={{ background: msg.role === "agent" ? "#eff6ff" : "#2563eb", color: msg.role === "agent" ? "#2563eb" : "#fff" }}>
                          {msg.role === "agent" ? "🤖" : "U"}
                        </div>
                        <div>
                          <div className="chat-bubble">{msg.text}</div>
                          <div className="chat-time">{msg.time}</div>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="chat-msg agent">
                        <div className="chat-msg-avatar" style={{ background: "#eff6ff" }}>🤖</div>
                        <div className="chat-bubble" style={{ background: "#fff", border: "1px solid #e2e8f0" }}>
                          <div className="chat-typing">
                            <span /><span /><span />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Input */}
                  <div className="chat-input-row">
                    <input
                      className="chat-input"
                      placeholder="Type a message…"
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendChat()}
                    />
                    <button className="chat-send" onClick={sendChat} disabled={!chatInput.trim()}>
                      <Ic d={I.Send} size={14} color="#fff" />
                    </button>
                  </div>
                </div>
              </div>

              {/* POPULAR TOPICS */}
              <div className="hcard" style={{ marginBottom: 20 }}>
                <div className="hcard-head">
                  <div className="hcard-title">
                    <div className="hcard-dot" style={{ background: "#d97706" }} />
                    Popular Topics
                  </div>
                </div>
                <div className="hp-status-list">
                  {TOPICS.map(t => (
                    <div key={t.id} className="topic-item" onClick={() => { setActiveCat("All"); setOpenFaq(t.id); setTimeout(() => document.getElementById(`faq-${t.id}`)?.scrollIntoView({ behavior:"smooth", block:"center" }), 100); }}>
                      <div className="topic-left">
                        <div className="topic-icon" style={{ background: t.bg }}>{t.icon}</div>
                        <div>
                          <div className="topic-name">{t.label}</div>
                          <div className="topic-views">{t.views}</div>
                        </div>
                      </div>
                      <Ic d={I.External} size={13} color="#94a3b8" />
                    </div>
                  ))}
                </div>
              </div>

              {/* SYSTEM STATUS */}
              <div className="hcard" id="status-section" style={{ marginBottom: 20 }}>
                <div className="hcard-head">
                  <div className="hcard-title">
                    <div className="hcard-dot" style={{ background: "#059669" }} />
                    System Status
                  </div>
                  <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>
                    Updated {clock.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <div className="hp-status-list">
                  {SYSTEM_STATUS.map(s => (
                    <div key={s.name} className="hp-status-row">
                      <span className="hp-status-name">{s.name}</span>
                      <span className="hp-status-pill" style={{ background: s.bg, color: s.color }}>
                        <span className="hp-status-dot" style={{ background: s.color }} />
                        {s.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* VERSION INFO */}
              <div className="hp-version">
                <div className="hp-version-badge">v2.4</div>
                <div>
                  <div className="hp-version-label">Platform Version</div>
                  <div className="hp-version-val">Hire-Onboard · Last updated Mar 2025</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HelpPage;