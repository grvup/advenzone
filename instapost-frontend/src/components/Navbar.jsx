import { React, useEffect, useState } from 'react';
import './Navbar.css';
import { FaSearch, FaMapMarkerAlt, FaEdit, FaUser, FaChevronDown } from 'react-icons/fa';
import logo from "../media/new-logo.svg";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const [locations, setLocations] = useState([]); // State to store locations from API
  const [selectedLocation, setSelectedLocation] = useState("Select Location"); // State for the selected location
  const [loading, setLoading] = useState(false); // State for loading status
  const [error, setError] = useState(null); // State for errors
  const [showDropdown, setShowDropdown] = useState(false); // State to toggle dropdown
  const navigate = useNavigate();

  // Fetch locations on component mount
  useEffect(() => {
    const getLocation = async () => {
      setLoading(true); // Start loading
      try {
        const response = await axios.get(`http://localhost:5000/api/locations`);
        setLocations(response.data); // Set locations data
        setError(null); // Clear any previous errors
      } catch (err) {
        setError('Failed to fetch locations'); // Set error message
        setLocations([]); // Reset locations on error
        console.error(err);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    getLocation(); // Fetch locations
  }, []);

  // Function to handle location selection
  const handleLocationSelect = async (id, name) => {
    const formattedName = name.replace(/\s+/g, '-');
    setSelectedLocation(name); // Update the selected location in the navbar
    setShowDropdown(false); // Close dropdown after selection
    navigate(`/location/${id}/${formattedName}`);
  };

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
        {/* Locations Dropdown */}
        <div 
          className="location"
          onMouseEnter={() => setShowDropdown(true)} 
          onMouseLeave={() => setShowDropdown(false)}
        >
          <FaMapMarkerAlt className="icon" />
          <span>{selectedLocation}</span>
          <FaChevronDown className="icon-down" />
          {showDropdown && (
            <ul className="dropdown-menu">
              {loading && <li>Loading...</li>}
              {error && <li>{error}</li>}
              {!loading && !error && locations.map((location) => (
                <li 
                  key={location.id} 
                  className="dropdown-item" 
                  onClick={() => handleLocationSelect(location.id, location.locationname)}
                >
                  {location.locationname} {/* Replace 'name' with the actual field in your location data */}
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Blogs Link */}
        <div className="blogs">
          <FaEdit className="icon" />
          <span>Blogs</span>
        </div>

        {/* Profile Link */}
        <div className="profile">
          <FaUser className="icon" />
          <span>Profile</span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
