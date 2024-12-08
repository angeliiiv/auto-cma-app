// src/components/dashboard/MarketStatistics.js

import React, { useMemo } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';

// Styled Components
const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  padding: 20px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  overflow: visible;
`;

const Section = styled.div`
  margin-bottom: 60px;
`;

const SectionTitle = styled.h2`
  margin-bottom: 20px;
  color: #333333;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const Card = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 15px;
  text-align: center;
`;

const Title = styled.h4`
  font-size: 14px;
  color: #555555;
  margin-bottom: 8px;
`;

const Value = styled.p`
  font-size: 20px;
  color: #333333;
  font-weight: bold;
`;

const ChartSection = styled.section`
  margin-bottom: 40px;
`;

// Color Palette
const colors = ['#8884d8', '#82ca9d'];

// Reusable SummaryCards Component
const SummaryCards = React.memo(({ metrics }) => (
  <SummaryGrid>
    {metrics.map((metric) => (
      <Card key={metric.title}>
        <Title>{metric.title}</Title>
        <Value>{metric.value}</Value>
      </Card>
    ))}
  </SummaryGrid>
));

SummaryCards.propTypes = {
  metrics: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ).isRequired,
};

// Reusable TrendChart Component
const TrendChart = React.memo(({ data, dataKeys, title, colors }) => (
  <ChartSection aria-label={title}>
    <h3>{title}</h3>
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip
          formatter={(value) =>
            value !== null && value !== undefined ? `$${value.toLocaleString()}` : 'N/A'
          }
          aria-label={`Tooltip for ${title}`}
        />
        <Legend />
        {dataKeys.map((key, index) => (
          <Line
            key={key}
            type="monotone"
            dataKey={key}
            stroke={colors[index % colors.length]}
            name={key}
            connectNulls
            strokeWidth={2}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  </ChartSection>
));

TrendChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  dataKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  title: PropTypes.string.isRequired,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
};

// Main MarketStatistics Component
const MarketStatistics = ({ marketData, propertyType }) => {
  const { saleData = {}, rentalData = {} } = marketData;

  // Transform sale history data to extract average price over time
  const saleHistoryData = useMemo(() => {
    if (!saleData.history) return [];

    return Object.values(saleData.history)
      .map((monthData) => {
        const formattedMonth = new Date(monthData.date).toLocaleString('default', {
          month: 'short',
          year: 'numeric',
        });
        return {
          month: formattedMonth,
          averagePrice: monthData.averagePrice || null,
        };
      })
      .sort((a, b) => new Date(a.month) - new Date(b.month));
  }, [saleData.history]);

  // Transform rental history data to extract average rent over time
  const rentalHistoryData = useMemo(() => {
    if (!rentalData.history) return [];

    return Object.values(rentalData.history)
      .map((monthData) => {
        const formattedMonth = new Date(monthData.date).toLocaleString('default', {
          month: 'short',
          year: 'numeric',
        });
        return {
          month: formattedMonth,
          averageRent: monthData.averageRent || null,
        };
      })
      .sort((a, b) => new Date(a.month) - new Date(b.month));
  }, [rentalData.history]);

  // Define Metrics for Sales
  const saleMetrics = useMemo(
    () => [
      {
        title: 'Average Price',
        value: saleData.averagePrice
          ? `$${saleData.averagePrice.toLocaleString()}`
          : 'N/A',
      },
      {
        title: 'Median Price',
        value: saleData.medianPrice
          ? `$${saleData.medianPrice.toLocaleString()}`
          : 'N/A',
      },
      {
        title: 'Avg Price/Sq Ft',
        value: saleData.averagePricePerSquareFoot
          ? `$${saleData.averagePricePerSquareFoot.toFixed(2)}`
          : 'N/A',
      },
      {
        title: 'Avg Days on Market',
        value: saleData.averageDaysOnMarket
          ? `${saleData.averageDaysOnMarket.toFixed(1)}`
          : 'N/A',
      },
      {
        title: 'Total Listings',
        value: saleData.totalListings !== undefined ? saleData.totalListings : 'N/A',
      },
      {
        title: 'New Listings',
        value: saleData.newListings !== undefined ? saleData.newListings : 'N/A',
      },
    ],
    [saleData]
  );

  // Define Metrics for Rentals
  const rentalMetrics = useMemo(
    () => [
      {
        title: 'Average Rent',
        value: rentalData.averageRent
          ? `$${rentalData.averageRent.toLocaleString()}`
          : 'N/A',
      },
      {
        title: 'Median Rent',
        value: rentalData.medianRent
          ? `$${rentalData.medianRent.toLocaleString()}`
          : 'N/A',
      },
      {
        title: 'Avg Rent/Sq Ft',
        value: rentalData.averageRentPerSquareFoot
          ? `$${rentalData.averageRentPerSquareFoot.toFixed(2)}`
          : 'N/A',
      },
      {
        title: 'Avg Days on Market',
        value: rentalData.averageDaysOnMarket
          ? `${rentalData.averageDaysOnMarket.toFixed(1)}`
          : 'N/A',
      },
      {
        title: 'Total Listings',
        value: rentalData.totalListings !== undefined ? rentalData.totalListings : 'N/A',
      },
      {
        title: 'New Listings',
        value: rentalData.newListings !== undefined ? rentalData.newListings : 'N/A',
      },
    ],
    [rentalData]
  );

  return (
    <Container>
      <h1>
        Market Statistics
      </h1>

      {/* Sales Data Section */}
      <Section>
        <SectionTitle>Sales Data</SectionTitle>
        <SummaryCards metrics={saleMetrics} />
        {saleHistoryData.length > 0 ? (
          <TrendChart
            data={saleHistoryData}
            dataKeys={['averagePrice']}
            title="Monthly Average Price Trends"
            colors={[colors[0]]}
          />
        ) : (
          <p>No sales history data available.</p>
        )}
      </Section>

      {/* Rental Data Section */}
      <Section>
        <SectionTitle>Rental Data</SectionTitle>
        <SummaryCards metrics={rentalMetrics} />
        {rentalHistoryData.length > 0 ? (
          <TrendChart
            data={rentalHistoryData}
            dataKeys={['averageRent']}
            title="Monthly Average Rent Trends"
            colors={[colors[1]]}
          />
        ) : (
          <p>No rental history data available.</p>
        )}
      </Section>
    </Container>
  );
};

// Enhanced PropTypes Definitions
MarketStatistics.propTypes = {
  marketData: PropTypes.shape({
    saleData: PropTypes.shape({
      averagePrice: PropTypes.number,
      medianPrice: PropTypes.number,
      minPrice: PropTypes.number,
      maxPrice: PropTypes.number,
      averagePricePerSquareFoot: PropTypes.number,
      medianPricePerSquareFoot: PropTypes.number,
      minPricePerSquareFoot: PropTypes.number,
      maxPricePerSquareFoot: PropTypes.number,
      averageDaysOnMarket: PropTypes.number,
      medianDaysOnMarket: PropTypes.number,
      minDaysOnMarket: PropTypes.number,
      maxDaysOnMarket: PropTypes.number,
      newListings: PropTypes.number,
      totalListings: PropTypes.number,
      history: PropTypes.objectOf(
        PropTypes.shape({
          date: PropTypes.string.isRequired,
          averagePrice: PropTypes.number,
          medianPrice: PropTypes.number,
          minPrice: PropTypes.number,
          maxPrice: PropTypes.number,
          totalListings: PropTypes.number,
        })
      ),
    }),
    rentalData: PropTypes.shape({
      averageRent: PropTypes.number,
      medianRent: PropTypes.number,
      minRent: PropTypes.number,
      maxRent: PropTypes.number,
      averageRentPerSquareFoot: PropTypes.number,
      medianRentPerSquareFoot: PropTypes.number,
      averageDaysOnMarket: PropTypes.number,
      totalListings: PropTypes.number,
      newListings: PropTypes.number,
      history: PropTypes.objectOf(
        PropTypes.shape({
          date: PropTypes.string.isRequired,
          averageRent: PropTypes.number,
          totalListings: PropTypes.number,
        })
      ),
    }),
  }).isRequired,
  propertyType: PropTypes.string.isRequired,
};

export default MarketStatistics;