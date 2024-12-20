import React, { useState, useEffect } from "react";

const LocationAccess = () => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [error, setError] = useState(null);
  const [permissionAsked, setPermissionAsked] = useState(false);

  const getAddressFromCoordinates = async (lat, lng) => {
    const apiKey = 'e1e6fd9434364606ae2c1e9f92555ee5'; // Replace with your OpenCage API key
    console.log(apiKey)
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat},${lng}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      if (data.results && data.results.length > 0) {
        const formattedAddress = data.results[0]?.formatted;
        setAddress(formattedAddress || "Address not found");
      } else {
        setError("Failed to fetch address");
      }
    } catch (err) {
      setError("Error fetching address");
      console.error(err);
    }
  };

  const askForLocation = () => {
    console.log("Location permission requested");
    setPermissionAsked(true); // User has triggered location request
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          setError(null);
          getAddressFromCoordinates(latitude, longitude);
        },
        (err) => {
          setError(err.message);
          setLocation(null);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  useEffect(askForLocation, []);
  console.log(location);
  console.log(address);

  return (
    <div>
      <h1 style={{ color: "black" }}>User Location Access - </h1>
      {!permissionAsked ? (
        <button onClick={askForLocation}>Allow Location Access</button>
      ) : location ? (
        <p style={{ color: "black" }}>
          Latitude: {location.lat}, Longitude: {location.lng}
          {address && <p>Address: {address}</p>}
        </p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <p>Waiting for permission...</p>
      )}
    </div>
  );
};

export default LocationAccess;
