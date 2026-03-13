import React, { useEffect } from "react";
import {
  UserPlus,
  ListChecks,
  Users,
  BarChart4
} from "lucide-react";
import "./HowItWorks.css"

const HowItWorks = () => {
  useEffect(() => {
    const steps = document.querySelectorAll(".step");

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

    steps.forEach((step) => observer.observe(step));
  }, []);

  return (
<section className="how">
        
  <h2>How HireOnBoard Works</h2>
  <p className="how-subtitle">
    A simple hiring workflow designed to help recruiters manage jobs,
    track candidates, and make faster hiring decisions.
  </p>

  <div className="steps">
    <div className="step">
      <div className="step-icon">
        <UserPlus />
      </div>
      <span className="step-number">1</span>
      <h3>Create Your Account</h3>
      <p>
        Sign up quickly and set up your hiring workspace to start managing
        job openings and candidates.
      </p>
    </div>

    <div className="step">
      <div className="step-icon">
        <ListChecks />
      </div>
      <span className="step-number">2</span>
      <h3>Post Jobs & Receive Applications</h3>
      <p>
        Create job postings and start receiving candidate applications
        in one organized dashboard.
      </p>
    </div>

    <div className="step">
      <div className="step-icon">
        <Users />
      </div>
      <span className="step-number">3</span>
      <h3>Manage & Evaluate Candidates</h3>
      <p>
        Review resumes, track candidate progress, and collaborate with
        your hiring team easily.
      </p>
    </div>

    <div className="step">
      <div className="step-icon">
        <BarChart4 />
      </div>
      <span className="step-number">4</span>
      <h3>Track Hiring Progress</h3>
      <p>
        Monitor recruitment progress with clear dashboards and insights
        to make smarter hiring decisions.
      </p>
    </div>
  </div>
</section>
  );
};

export default HowItWorks;
