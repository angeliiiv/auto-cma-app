// src/pages/AddressInputForm.js

import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PropertyContext } from '../context/PropertyContext'; // Import PropertyContext
import './AddressInputForm.css'; // Optional: For styling

function AddressInputForm() {
  const { setFormData } = useContext(PropertyContext); // Destructure setFormData from context
  const navigate = useNavigate();
  
  const [localFormData, setLocalFormData] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
  });

  const [error, setError] = useState(null); // Local error state for form validation

 // Debug log to verify context
 useEffect(() => {
  console.log('AddressInputForm - setFormData:', setFormData);
  }, [setFormData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const { street, city, state, zip } = localFormData;

    // Simple validation
    if (!street || !city || !state || !zip) {
      setError('Please fill in all fields.');
      return;
    }

    // Clear any previous errors
    setError(null);

    // Update formData in context
    setFormData(localFormData);

    // Navigate to LoadingPage
    navigate('/loading');
  };

  return (
    <div className="address-input-form">
      <h2>Enter Property Address</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="street">Street:</label>
          <input 
            type="text" 
            id="street" 
            name="street" 
            value={localFormData.street} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div>
          <label htmlFor="city">City:</label>
          <input 
            type="text" 
            id="city" 
            name="city" 
            value={localFormData.city} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div>
          <label htmlFor="state">State:</label>
          <input 
            type="text" 
            id="state" 
            name="state" 
            value={localFormData.state} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div>
          <label htmlFor="zip">ZIP Code:</label>
          <input 
            type="text" 
            id="zip" 
            name="zip" 
            value={localFormData.zip} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        {error && <p className="error-message">{error}</p>} {/* Display form validation errors */}
        
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default AddressInputForm;