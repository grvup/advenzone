// Navbar.js
import React from 'react';
import './Navbar.css';
import { FaSearch, FaMapMarkerAlt, FaEdit, FaUser , FaChevronDown } from 'react-icons/fa';
import logo from "../media/new-logo.svg";

function Navbar() {
  return (
    <nav className="navbar">
      {/* Logo and Title */}
      <div className="logo">
        <img src={logo} alt="Logo" className="logo-image" />
        <span>Advenzone</span>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input type="text" placeholder="Search 'Camping'" />
        <FaSearch className="search-icon" />
      </div>

      {/* Nav Links */}
      <div className="nav-links">
        
            <div className="location">
            <FaMapMarkerAlt className="icon" />
            <span>North Goa </span>
            <FaChevronDown className='icon-down'/>

            </div>
            <div className="blogs">
            <FaEdit className="icon" />
            <span>Blogs</span>
            </div>
            <div className="profile">
            <FaUser className="icon" />
            <span>Profile</span>
            </div>

        {/* </div> */}
      </div>
    </nav>
  );
}

export default Navbar;
