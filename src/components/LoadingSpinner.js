import React from 'react';
import './LoadingSpinner.css'; // Optional: styles for your spinner

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner">
      <h2>Loading data, please wait...</h2>
      <div className="spinner"></div> {/* Add spinner styles/animation in CSS */}
    </div>
  );
};

export default LoadingSpinner;