// src/pages/LoadingPage.js

import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { PropertyContext } from '../context/PropertyContext';
import './LoadingPage.css'; // Optional: For styling

function LoadingPage() {
  const { valuationData, loading, error } = useContext(PropertyContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && valuationData) {
      navigate('/dashboard');
    }
  }, [loading, valuationData, navigate]);

  if (loading) {
    return (
      <div className="loading-page">
        <div className="spinner"></div>
        <h2>Processing your request...</h2>
        <p>Please wait while we retrieve your property data.</p>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return <div>Initializing...</div>;
}

export default LoadingPage;