// src/components/dashboard/ValuationInsights.js

import React from 'react';
import styled from 'styled-components';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LabelList,
} from 'recharts';

// Styled Components
const Container = styled.div`
  padding: 20px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
`;

const Section = styled.section`
  margin-bottom: 40px;
`;

const Title = styled.h2`
  font-size: 28px;
  color: #333333;
  margin-bottom: 20px;
  font-weight: 600;
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 300px;
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
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e0e0e0;
  color: #555555;
`;

const Tr = styled.tr`
  &:hover {
    background-color: #fafafa;
  }
`;

// Tooltip Customization
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #cccccc',
          padding: '10px',
          borderRadius: '8px',
        }}
      >
        <p style={{ margin: 0 }}>{`${label}: $${payload[0].value.toLocaleString()}`}</p>
      </div>
    );
  }

  return null;
};

// ValuationInsights Component
const ValuationInsights = ({ valueEstimate }) => {
  console.log('Value Insights:', valueEstimate); // Debugging line
  console.log('Value Insights:', valuationData); // Debugging line
  
  const { price, priceRangeLow, priceRangeHigh, comparables } = valueEstimate;

  // Data for the ARV Bar Chart
  const chartData = [
    { name: 'Low', value: priceRangeLow },
    { name: 'ARV', value: price },
    { name: 'High', value: priceRangeHigh },
  ];

  return (
    <Container>
      {/* ARV Bell Chart Section */}
      <Section>
        <Title>Estimated After Repair Value (ARV)</Title>
        <ChartContainer>
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#4A90E2">
                <LabelList dataKey="value" position="top" formatter={(value) => `$${value.toLocaleString()}`} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </Section>

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
                <Td>{comp.distance.toFixed(4)}</Td>
                <Td>{comp.correlation.toFixed(4)}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </Section>
    </Container>
  );
};

export default ValuationInsights;