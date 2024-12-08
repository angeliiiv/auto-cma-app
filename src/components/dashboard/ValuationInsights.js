// src/components/dashboard/ValuationInsights.js

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  padding: 20px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
`;

const ARVCard = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  margin-bottom: 20px;
`;

const Title = styled.h3`
  font-size: 18px;
  color: #555555;
  margin-bottom: 10px;
`;

const ARVValue = styled.p`
  font-size: 32px;
  color: #333333;
  margin: 0;
  font-weight: bold;
`;

const Range = styled.p`
  font-size: 16px;
  color: #777777;
  margin-top: 8px;
`;

const Section = styled.section`
  width: 100%;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px;
  background-color: #f0f0f0;
  color: #333333;
  font-weight: 500;

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 14px;
  }
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e0e0e0;
  color: #555555;

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 14px;
  }
`;

const Tr = styled.tr`
  &:hover {
    background-color: #fafafa;
  }
`;

const ValuationInsights = ({ valuationData }) => {
  console.log('Valuation data:', valuationData); // Debugging line
  const { price, priceRangeLow, priceRangeHigh, comparables } = valuationData;

  return (
    <Container>
      {/* ARV Scorecard */}
      <ARVCard>
        <Title>After Repair Value (ARV)</Title>
        <ARVValue>${price.toLocaleString()}</ARVValue>
        <Range>${priceRangeLow.toLocaleString()} - ${priceRangeHigh.toLocaleString()}</Range>
      </ARVCard>

      {/* Sales Comparables Table Section */}
      <Section>
        <Title>Sales Comparables</Title>
        <Table>
          <thead>
            <tr>
              <Th>Address</Th>
              <Th>Price</Th>
              <Th>Sq Ft</Th>
              <Th>Beds/Baths</Th>
              <Th>Year Built</Th>
              <Th>Days on Market</Th>
              <Th>Distance (mi)</Th>
              <Th>Correlation</Th>
            </tr>
          </thead>
          <tbody>
            {comparables.map((comp) => (
              <Tr key={comp.id}>
                <Td>{comp.formattedAddress}</Td>
                <Td>${comp.price.toLocaleString()}</Td>
                <Td>{comp.squareFootage}</Td>
                <Td>
                  {comp.bedrooms}/{comp.bathrooms}
                </Td>
                <Td>{comp.yearBuilt}</Td>
                <Td>{comp.daysOnMarket}</Td>
                <Td>{comp.distance.toFixed(2)}</Td>
                <Td>{(comp.correlation * 100).toFixed(1)}%</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </Section>
    </Container>
  );
};

ValuationInsights.propTypes = {
  valuationData: PropTypes.shape({
    price: PropTypes.number.isRequired,
    priceRangeLow: PropTypes.number.isRequired,
    priceRangeHigh: PropTypes.number.isRequired,
    comparables: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        formattedAddress: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        squareFootage: PropTypes.number.isRequired,
        bedrooms: PropTypes.number.isRequired,
        bathrooms: PropTypes.number.isRequired,
        yearBuilt: PropTypes.number.isRequired,
        daysOnMarket: PropTypes.number.isRequired,
        distance: PropTypes.number.isRequired,
        correlation: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
};

export default ValuationInsights;