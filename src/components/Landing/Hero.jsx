import React from "react";
import "./Hero.css";
import  { useEffect, useState } from "react";

const words = ["Hire", "Track", "Onboard"];

const Hero = () => {
 const [wordIndex, setWordIndex] = useState(0);
  const [letterIndex, setLetterIndex] = useState(0);
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    const currentWord = words[wordIndex];

    if (letterIndex < currentWord.length) {
      const timer = setTimeout(() => {
        setTypedText((prev) => prev + currentWord[letterIndex]);
        setLetterIndex(letterIndex + 1);
      }, 120); // ⌨️ typing speed (ms)

      return () => clearTimeout(timer);
    } else {
      // pause when full word is typed
      const pause = setTimeout(() => {
        setTypedText("");
        setLetterIndex(0);
        setWordIndex((prev) => (prev + 1) % words.length);
      }, 1500); // ⏸ pause after word

      return () => clearTimeout(pause);
    }
  }, [letterIndex, wordIndex]);

  return (
   <section className="hero">
  <div className="hero-left">
    <span className="hero-badge">🚀 HireOnBoard  Made Simple</span>
<h1>
  One Platform to{" "}
  <span className="typing-word">{typedText}</span>{" "} <br />
  Work Faster
</h1>

    <p className="hero-desc">
   HireOnBoard is a smart recruitment platform designed to help companies manage hiring, track candidates, and streamline the recruitment process efficiently — all in one place.
    </p>

   <ul className="hero-points">
  <li>✔ Post jobs and manage applications easily</li>
  <li>✔ Track candidates through every hiring stage</li>
  <li>✔ Smart dashboards for faster hiring decisions</li>
</ul>

    <div className="hero-buttons">
      <button className="btn-primary">Start Free</button>
      <button className="btn-secondary">Watch Demo</button>
    </div>

    <div className="hero-stats">
     <div><strong>10K+</strong><span>Applications Processed</span></div>
<div><strong>500+</strong><span>Active Recruiters</span></div>
    </div>
  </div>

  <div className="hero-right">
    <div className="video-card">
     <video
  src="/images/v1.mp4"
  autoPlay
  loop
  muted
  playsInline

/>
   
    </div>
 
  </div>
</section>

  );
};

export default Hero;
