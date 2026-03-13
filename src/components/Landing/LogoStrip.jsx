import React from "react";
import "./LogoStrip.css";


const LogoStrip = () => {
  return (
    <section className="logo-section">
      {/* LEFT TEXT */}
      <p className="logo-title">Inspired by Industry Leaders </p>

      {/* MOVING LOGOS */}
      <div className="logo-marquee">
        <div className="logo-track">
          <img src="/images/l3.png" alt="Google" />
          <img src="/images/l6.png" alt="Microsoft" />
          <img src="/images/l4.png" alt="Amazon" />
          <img src="/images/l7.png" alt="Meta" />
          <img src="/images/l5.png" alt="GitHub" />
          <img src="/images/l1.webp" alt="Google" />
          <img src="/images/l2.png" alt="Microsoft" />
          <img src="/images/l8.png" alt="Amazon" />
          <img src="/images/l9.png" alt="Meta" />
          <img src="/images/l10.png" alt="GitHub" />
        </div>
      </div>
    </section>
  );
};

export default LogoStrip;
