import React, { useEffect } from "react";
import {
  GraduationCap,
  Users,
  Briefcase,
  Rocket
} from "lucide-react";
import "./UseCases.css";

const UseCases = () => {
  useEffect(() => {
    const cards = document.querySelectorAll(".usecase-card");

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
<section className="usecases">
  <h2>Who Is HireOnBoard For?</h2>
  <p className="usecases-subtitle">
    HireOnBoard is built for recruiters and organizations that want a
    faster, smarter, and more organized hiring process.
  </p>

  <div className="usecase-grid">
    <div className="usecase-card">
      <GraduationCap className="usecase-icon" />
      <h3>Campus Recruiters</h3>
      <p>
        Manage campus hiring drives, track student applications, and
        organize recruitment processes efficiently.
      </p>
    </div>

    <div className="usecase-card">
      <Users className="usecase-icon" />
      <h3>HR Teams</h3>
      <p>
        Manage job postings, review applications, collaborate with hiring
        managers, and streamline the recruitment process.
      </p>
    </div>

    <div className="usecase-card">
      <Briefcase className="usecase-icon" />
      <h3>Recruitment Agencies</h3>
      <p>
        Track multiple clients, manage candidate pipelines, and speed up
        placements with an organized hiring workflow.
      </p>
    </div>

    <div className="usecase-card">
      <Rocket className="usecase-icon" />
      <h3>Growing Companies</h3>
      <p>
        Scale your hiring process with structured candidate tracking,
        faster evaluations, and smarter recruitment decisions.
      </p>
    </div>
  </div>
</section>
  );
};

export default UseCases;
