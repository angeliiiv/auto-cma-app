// src/components/dashboard/PropertyOverview.js

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { FaBed, FaBath, FaRulerCombined, FaCalendarAlt } from 'react-icons/fa';

// Container similar to ValuationInsights "Container"
const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  padding: 20px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  margin-bottom: 20px;
`;

// Wrapper for the "cards" (similar to ValuationInsights "CardsWrapper")
const CardsWrapper = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: space-between;

  @media (max-width: 1024px) {
    justify-content: center;
  }
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

// Each attribute shown as a "card" (similar to ValuationInsights "Card")
const Card = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  flex: 1 1 220px;
  min-width: 220px;
  margin-bottom: 20px;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

// Title for the "section" (optional)
const Title = styled.h3`
  font-size: 18px;
  color: #555555;
  margin: 0 0 20px;
  text-align: center;
`;

// Address span across entire container
const AddressTitle = styled.h2`
  font-size: 24px;
  color: #333333;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
`;

const IconContainer = styled.div`
  margin-bottom: 8px;
  font-size: 24px;
  color: #007bff;
`;

const CardLabel = styled.p`
  font-size: 16px;
  color: #333;
  margin: 0;
  font-weight: 500;
`;

const PropertyOverview = ({ property }) => {
  const {
    formattedAddress,
    bedrooms,
    bathrooms,
    squareFootage,
    yearBuilt,
  } = property;

  return (
    <Container>
      {/* Optional Title for the section, or remove if you only want the address */}
      {/* <Title>Property Overview</Title> */}

      {/* Address across entire container */}
      <AddressTitle>{formattedAddress}</AddressTitle>

      <CardsWrapper>
        {/* Beds */}
        <Card>
          <IconContainer>
            <FaBed />
          </IconContainer>
          <CardLabel>{bedrooms} Beds</CardLabel>
        </Card>

        {/* Baths */}
        <Card>
          <IconContainer>
            <FaBath />
          </IconContainer>
          <CardLabel>{bathrooms} Baths</CardLabel>
        </Card>

        {/* Square Footage */}
        <Card>
          <IconContainer>
            <FaRulerCombined />
          </IconContainer>
          <CardLabel>{squareFootage.toLocaleString()} sqft</CardLabel>
        </Card>

        {/* Year Built */}
        <Card>
          <IconContainer>
            <FaCalendarAlt />
          </IconContainer>
          <CardLabel>Built in {yearBuilt}</CardLabel>
        </Card>
      </CardsWrapper>
    </Container>
  );
};

PropertyOverview.propTypes = {
  property: PropTypes.shape({
    formattedAddress: PropTypes.string.isRequired,
    bedrooms: PropTypes.number.isRequired,
    bathrooms: PropTypes.number.isRequired,
    squareFootage: PropTypes.number.isRequired,
    yearBuilt: PropTypes.number.isRequired,
  }).isRequired,
};

export default PropertyOverview;
