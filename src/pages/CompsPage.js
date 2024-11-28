import React from 'react';
import './CompsPage.css';

const CompsPage = ({ property, valueEstimate }) => {
  if (!property || !valueEstimate) {
    return <div>Loading...</div>;
  }

  const comps = valueEstimate.comps || []; // Ensure comps is always an array

  return (
    <div className="comps-page">
      <h2>Comparative Market Analysis</h2>
      <div className="property-details">
        <h3>Property Details</h3>
        <p>Address: {property.formattedAddress}</p>
        <p>Bedrooms: {property.bedrooms}</p>
        <p>Bathrooms: {property.bathrooms}</p>
        <p>Square Footage: {property.squareFootage}</p>
        <p>Year Built: {property.yearBuilt}</p>
      </div>
      <div className="value-estimate">
        <h3>Value Estimate</h3>
        <p>Estimated Value: ${valueEstimate.estimatedValue}</p>
        <h4>Comparable Properties:</h4>
        <ul>
          {comps.map((comp, index) => (
            <li key={index}>
              {comp.address}: ${comp.price.toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CompsPage;
