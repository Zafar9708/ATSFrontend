import React from "react";
import "./CTA.css";

const CTA = () => {
  return (
<section className="cta">
  <div className="cta-content">

    <h2 className="chat chat-1">
      👋 Start Hiring Smarter with HireOnBoard
    </h2>

    <p className="cta-subtitle chat chat-2">
      Post jobs, track candidates, and streamline your recruitment process —
      all in one powerful platform built for modern hiring.
    </p>

    <div className="cta-features">
      <span className="chat chat-3">✔ Easy Job Posting & Management</span>
      <span className="chat chat-4">✔ Smart Candidate Tracking</span>
      <span className="chat chat-5">✔ Data-Driven Hiring Insights</span>
    </div>

    <div className="cta-buttons chat chat-7">
      <button className="btn-primary">Get Started Free</button>
      <button className="btn-secondary">View Demo</button>
    </div>

    <p className="cta-note chat chat-8">
      No credit card required · Start managing your hiring today
    </p>

  </div>
</section>
  );
};

export default CTA;
