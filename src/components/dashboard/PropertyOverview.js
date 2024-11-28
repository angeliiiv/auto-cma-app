// src/components/dashboard/PropertyOverview.js

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const OverviewContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  padding: 20px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
`;

const Photo = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;

  @media (min-width: 768px) {
    width: 40%;
    height: 100%;
  }
`;

const Details = styled.div`
  padding: 20px;
`;

const DetailItem = styled.p`
  margin: 8px 0;
  color: #555555;
`;

const PropertyOverview = ({ property }) => {
  console.log('Property data:', property); // Debugging line
  const { formattedAddress, bedrooms, bathrooms, squareFootage, yearBuilt, photoUrl } = property;

  return (
    <OverviewContainer>
      <Photo src={photoUrl || 'https://via.placeholder.com/600x400'} alt="Property" />
      <Details>
        <h3>Property Overview</h3>
        <DetailItem><strong>Address:</strong> {formattedAddress}</DetailItem>
        <DetailItem><strong>Bedrooms:</strong> {bedrooms}</DetailItem>
        <DetailItem><strong>Bathrooms:</strong> {bathrooms}</DetailItem>
        <DetailItem><strong>SQFT:</strong> {squareFootage}</DetailItem>
        <DetailItem><strong>Year Built:</strong> {yearBuilt}</DetailItem>
      </Details>
    </OverviewContainer>
  );
};

PropertyOverview.propTypes = {
  property: PropTypes.shape({
    formattedAddress: PropTypes.string.isRequired,
    bedrooms: PropTypes.number.isRequired,
    bathrooms: PropTypes.number.isRequired,
    squareFootage: PropTypes.number.isRequired,
    yearBuilt: PropTypes.number.isRequired,
    photoUrl: PropTypes.string, // Optional
  }).isRequired,
};

export default PropertyOverview;