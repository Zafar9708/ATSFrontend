import React, { useEffect } from "react";
import {
  CheckSquare,
  BarChart3,
  Users,
  LayoutDashboard
} from "lucide-react";
import "./Feature.css";

const Features = () => {
  useEffect(() => {
    const cards = document.querySelectorAll(".feature-card");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.2 }
    );

    cards.forEach((card) => observer.observe(card));
  }, []);

  return (
    <section className="features">
    <h2>Everything You Need to Streamline Hiring</h2>

      <div className="feature-grid">
        <div className="feature-card">
          <CheckSquare className="feature-icon" />
         <h3>Job Management</h3>
<p>Create job postings, manage applications, and track candidates easily.</p>
        </div>

        <div className="feature-card">
          <BarChart3 className="feature-icon" />
        <h3>Candidate Tracking</h3>
<p>Track applicants through every stage of the hiring process.</p>
        </div>

        <div className="feature-card">
          <Users className="feature-icon" />
         <h3>Smart Hiring</h3>
<p>Manage job openings and organize candidates in one place.</p>
        </div>

        <div className="feature-card">
          <LayoutDashboard className="feature-icon" />
          <h3>Recruitment Management</h3>
<p>Streamline job postings, applications, and candidate evaluations.</p>
        </div>
      </div>
        
    </section>

  );
};

export default Features;
