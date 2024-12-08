// src/components/dashboard/PropertyOverview.js

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

// Importing React Icons from Font Awesome
import { FaMapMarkerAlt, FaBed, FaBath, FaRulerCombined, FaCalendarAlt } from 'react-icons/fa';

const OverviewContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  padding: 20px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  
  @media (min-width: 768px) {
    flex-direction: row;
  }
`;

const PhotoWrapper = styled.div`
  flex: 1;
  margin-bottom: 20px;

  @media (min-width: 768px) {
    margin-bottom: 0;
    margin-right: 20px;
  }
`;

const Photo = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 12px;
`;

const Details = styled.div`
  flex: 1;
  padding: 10px;
`;

const DetailItem = styled.div`
  margin: 12px 0;
  display: flex;
  align-items: center;
  transition: background-color 0.3s ease;
  padding: 8px;
  border-radius: 8px;

  &:hover {
    background-color: #f9f9f9;
  }

  & > svg {
    margin-right: 10px;
    color: #555555;
    min-width: 24px;
    min-height: 24px;
  }
`;

const DetailText = styled.p`
  margin: 0;
  color: #555555;
  font-size: 16px;
`;

const Header = styled.h3`
  margin-bottom: 20px;
  color: #333333;
  font-size: 24px;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
`;

const PropertyOverview = ({ property }) => {
  const { formattedAddress, bedrooms, bathrooms, squareFootage, yearBuilt, photoUrl } = property;

  return (
    <OverviewContainer>
      <PhotoWrapper>
        <Photo src={photoUrl || 'https://via.placeholder.com/600x400'} alt="Property" />
      </PhotoWrapper>
      <Details>
        <Header>Property Overview</Header>
        <DetailItem>
          <FaMapMarkerAlt size={24} />
          <DetailText><strong>Address:</strong> {formattedAddress}</DetailText>
        </DetailItem>
        <DetailItem>
          <FaBed size={24} />
          <DetailText><strong>Bedrooms:</strong> {bedrooms}</DetailText>
        </DetailItem>
        <DetailItem>
          <FaBath size={24} />
          <DetailText><strong>Bathrooms:</strong> {bathrooms}</DetailText>
        </DetailItem>
        <DetailItem>
          <FaRulerCombined size={24} />
          <DetailText><strong>SQFT:</strong> {squareFootage}</DetailText>
        </DetailItem>
        <DetailItem>
          <FaCalendarAlt size={24} />
          <DetailText><strong>Year Built:</strong> {yearBuilt}</DetailText>
        </DetailItem>
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