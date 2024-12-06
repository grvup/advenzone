import React, { useState } from 'react';

const LocationAccess= () => {
  const [location, setLocation] = useState(null)
  const [error, setError] = useState(null);
  const [permissionAsked, setPermissionAsked] = useState(false);

  const askForLocation = () => {
    setPermissionAsked(true); // User has triggered location request
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });
          setError(null);
        },
        (err) => {
          setError(err.message);
          setLocation(null);
        }
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };
  console.log(location)
  return (
    <div>
      <h1>User Location Access</h1>
      {!permissionAsked ? (
        <button onClick={askForLocation}>Allow Location Access</button>
      ) : location ? (
        <p>
          Latitude: {location.lat}, Longitude: {location.lng}
        </p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <p>Waiting for permission...</p>
      )}
    </div>
  );
};

export default LocationAccess;
