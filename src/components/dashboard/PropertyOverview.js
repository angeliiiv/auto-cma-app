// src/components/dashboard/PropertyOverview.js

import React from 'react';
import PropTypes from 'prop-types';
import './PropertyOverview.css'; // Ensure this file exists

const PropertyOverview = ({ property }) => {
  console.log('Property data:', property); // Debugging line
  if (!property) {
    return <div>No property data available.</div>;
  }

  return (
    <section className="property-overview">
      <h3>Property Overview</h3>
      <div className="overview-content">
        <div className="overview-item">
          <strong>Address:</strong>
          <p>{property.formattedAddress}</p>
        </div>
        <div className="overview-item">
          <strong>Property Type:</strong>
          <p>{property.propertyType}</p>
        </div>
        <div className="overview-item">
          <strong>Bedrooms:</strong>
          <p>{property.bedrooms}</p>
        </div>
        <div className="overview-item">
          <strong>Bathrooms:</strong>
          <p>{property.bathrooms}</p>
        </div>
        <div className="overview-item">
          <strong>Square Footage:</strong>
          <p>{property.squareFootage} sq ft</p>
        </div>
      </div>
    </section>
  );
};

PropertyOverview.propTypes = {
  property: PropTypes.shape({
    formattedAddress: PropTypes.string.isRequired,
    propertyType: PropTypes.string.isRequired,
    bedrooms: PropTypes.number.isRequired,
    bathrooms: PropTypes.number.isRequired,
    squareFootage: PropTypes.number.isRequired,
  }).isRequired,
};

export default PropertyOverview;