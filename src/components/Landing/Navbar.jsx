import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Left */}
      <div className="nav-left">
        <img src="/images/logo.png" alt="TeamForge Logo" className="logo-img" />
     
      </div>



      {/* Right */}
      <div className="nav-right">
        <Link to="/login" className="login-btn"> Vendor</Link>
        <Link to="/login" className="signup-btn"> Employer Login</Link>
      </div>
    </nav>
  );
};

export default Navbar;
