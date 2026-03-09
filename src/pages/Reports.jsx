import React from "react";

const ReportsPage = () => {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "80vh",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      background: "#f8fafc",
      textAlign: "center",
      padding: "24px",
      marginLeft:400
    }}>
      {/* Icon */}
      <div style={{
        width: 72,
        height: 72,
        borderRadius: 18,
        background: "#eff6ff",
        border: "1px solid #dbeafe",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 24,
      }}>
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none"
          stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
          <line x1="2" y1="20" x2="22" y2="20" />
        </svg>
      </div>

      {/* Badge */}
      <div style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: "#fffbeb",
        border: "1px solid #fde68a",
        color: "#b45309",
        fontSize: 11.5,
        fontWeight: 700,
        padding: "4px 12px",
        borderRadius: 20,
        marginBottom: 16,
        textTransform: "uppercase",
        letterSpacing: "0.5px",
      }}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        Coming Soon
      </div>

      {/* Heading */}
      <h1 style={{
        fontSize: 26,
        fontWeight: 800,
        color: "#0f172a",
        letterSpacing: "-0.4px",
        margin: "0 0 10px",
      }}>
        Reports Page
      </h1>

      {/* Subtext */}
      <p style={{
        fontSize: 15,
        color: "#64748b",
        fontWeight: 500,
        maxWidth: 380,
        lineHeight: 1.6,
        margin: "0 0 28px",
      }}>
        We're working on the Reports page. It will be available soon.
      </p>

      {/* Divider with dots */}
      <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: "50%",
            background: i === 0 ? "#2563eb" : i === 1 ? "#93c5fd" : "#dbeafe",
          }} />
        ))}
      </div>

      {/* Footer note */}
      <p style={{
        fontSize: 12.5,
        color: "#94a3b8",
        fontWeight: 500,
      }}>
        Check back later — we'll notify you when it's ready.
      </p>
    </div>
  );
};

export default ReportsPage;