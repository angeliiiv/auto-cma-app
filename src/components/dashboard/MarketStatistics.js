// src/components/dashboard/MarketStatistics.js

import React from 'react';
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

const colors = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff7300',
  '#387908',
  '#a4de6c',
  '#d0ed57',
  '#8dd1e1',
  '#ffc0cb',
  '#d88884',
]; // Define a color palette

const MarketStatistics = ({ marketData, propertyType }) => {
  const { saleData = {}, rentalData = {} } = marketData;
  const { dataByBedrooms: saleBedrooms = [], history: saleHistory = {} } = saleData;
  const { dataByBedrooms: rentalBedrooms = [], history: rentalHistory = {} } = rentalData;
  console.log('Sales Data:', saleData);
  console.log('Rental Data:', rentalData);

  // Extract unique bedroom counts from saleData.dataByBedrooms and rentalData.dataByBedrooms
  const uniqueSaleBedrooms = [
    ...new Set(saleBedrooms.map((bd) => bd.bedrooms)),
  ].sort((a, b) => a - b);

  const uniqueRentalBedrooms = [
    ...new Set(rentalBedrooms.map((bd) => bd.bedrooms)),
  ].sort((a, b) => a - b);

  // Transform saleHistoryData to include averagePrice per bedroom
  const saleHistoryData = Object.entries(saleHistory).map(
    ([monthKey, monthData]) => {
      const formattedMonth = new Date(monthData.date).toLocaleString('default', {
        month: 'short',
        year: 'numeric',
      });
      const dataPoint = { month: formattedMonth };

      // Populate averagePrice for each bedroom count
      monthData.dataByBedrooms.forEach((bd) => {
        dataPoint[`Bedroom ${bd.bedrooms}`] = bd.averagePrice;
      });

      // Ensure all bedrooms are represented, even if data is missing
      uniqueSaleBedrooms.forEach((bedroom) => {
        if (!dataPoint[`Bedroom ${bedroom}`]) {
          dataPoint[`Bedroom ${bedroom}`] = null; // or 0
        }
      });

      return dataPoint;
    }
  );

  // Transform rentalHistoryData to include averageRent per bedroom
  const rentalHistoryData = Object.entries(rentalHistory).map(
    ([monthKey, monthData]) => {
      const formattedMonth = new Date(monthData.date).toLocaleString('default', {
        month: 'short',
        year: 'numeric',
      });
      const dataPoint = { month: formattedMonth };

      // Populate averageRent for each bedroom count
      monthData.dataByBedrooms.forEach((bd) => {
        dataPoint[`Bedroom ${bd.bedrooms}`] = bd.averageRent;
      });

      // Ensure all bedrooms are represented, even if data is missing
      uniqueRentalBedrooms.forEach((bedroom) => {
        if (!dataPoint[`Bedroom ${bedroom}`]) {
          dataPoint[`Bedroom ${bedroom}`] = null; // or 0
        }
      });

      return dataPoint;
    }
  );

  return (
    <Container>
      {/* Sales Data Section */}
      <Section>
        <SectionTitle>Sales Data</SectionTitle>

        {/* Sales Summary Cards */}
        <SummaryGrid>
          <Card>
            <Title>Average Price</Title>
            <Value>${saleData.averagePrice?.toLocaleString() || 'N/A'}</Value>
          </Card>
          <Card>
            <Title>Median Price</Title>
            <Value>${saleData.medianPrice?.toLocaleString() || 'N/A'}</Value>
          </Card>
          <Card>
            <Title>Min Price</Title>
            <Value>${saleData.minPrice?.toLocaleString() || 'N/A'}</Value>
          </Card>
          <Card>
            <Title>Max Price</Title>
            <Value>${saleData.maxPrice?.toLocaleString() || 'N/A'}</Value>
          </Card>
          <Card>
            <Title>Avg Price/Sq Ft</Title>
            <Value>${saleData.averagePricePerSquareFoot?.toFixed(2) || 'N/A'}</Value>
          </Card>
          <Card>
            <Title>Median Price/Sq Ft</Title>
            <Value>${saleData.medianPricePerSquareFoot?.toFixed(2) || 'N/A'}</Value>
          </Card>
          <Card>
            <Title>Avg Days on Market</Title>
            <Value>{saleData.averageDaysOnMarket?.toFixed(1) || 'N/A'}</Value>
          </Card>
          <Card>
            <Title>Total Listings</Title>
            <Value>{saleData.totalListings ?? 'N/A'}</Value>
          </Card>
          <Card>
            <Title>New Listings</Title>
            <Value>{saleData.newListings ?? 'N/A'}</Value>
          </Card>
        </SummaryGrid>

        {/* Monthly Average Price Trends by Bedrooms */}
        <ChartSection>
          <h3>Monthly Average Price Trends by Bedrooms</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={saleHistoryData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => (value ? `$${value.toLocaleString()}` : 'N/A')} />
              <Legend />
              {uniqueSaleBedrooms.map((bedroom, index) => (
                <Line
                  key={`Bedroom ${bedroom}`}
                  type="monotone"
                  dataKey={`Bedroom ${bedroom}`}
                  stroke={colors[index % colors.length]}
                  name={`Bedroom ${bedroom}`}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartSection>
      </Section>

      {/* Rental Data Section */}
      <Section>
        <SectionTitle>Rental Data</SectionTitle>

        {/* Rental Summary Cards */}
        <SummaryGrid>
          <Card>
            <Title>Average Rent</Title>
            <Value>${rentalData.averageRent?.toLocaleString() || 'N/A'}</Value>
          </Card>
          <Card>
            <Title>Median Rent</Title>
            <Value>${rentalData.medianRent?.toLocaleString() || 'N/A'}</Value>
          </Card>
          <Card>
            <Title>Min Rent</Title>
            <Value>${rentalData.minRent?.toLocaleString() || 'N/A'}</Value>
          </Card>
          <Card>
            <Title>Max Rent</Title>
            <Value>${rentalData.maxRent?.toLocaleString() || 'N/A'}</Value>
          </Card>
          <Card>
            <Title>Avg Rent/Sq Ft</Title>
            <Value>${rentalData.averageRentPerSquareFoot?.toFixed(2) || 'N/A'}</Value>
          </Card>
          <Card>
            <Title>Median Rent/Sq Ft</Title>
            <Value>${rentalData.medianRentPerSquareFoot?.toFixed(2) || 'N/A'}</Value>
          </Card>
          <Card>
            <Title>Avg Days on Market</Title>
            <Value>{rentalData.averageDaysOnMarket?.toFixed(1) || 'N/A'}</Value>
          </Card>
          <Card>
            <Title>Total Listings</Title>
            <Value>{rentalData.totalListings ?? 'N/A'}</Value>
          </Card>
          <Card>
            <Title>New Listings</Title>
            <Value>{rentalData.newListings ?? 'N/A'}</Value>
          </Card>
        </SummaryGrid>

        {/* Monthly Average Rent Trends by Bedrooms */}
        <ChartSection>
          <h3>Monthly Average Rent Trends by Bedrooms</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={rentalHistoryData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => (value ? `$${value.toLocaleString()}` : 'N/A')} />
              <Legend />
              {uniqueRentalBedrooms.map((bedroom, index) => (
                <Line
                  key={`Bedroom ${bedroom}`}
                  type="monotone"
                  dataKey={`Bedroom ${bedroom}`}
                  stroke={colors[index % colors.length]}
                  name={`Bedroom ${bedroom}`}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartSection>
      </Section>
    </Container>
  );
};

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
      averageSquareFootage: PropTypes.number,
      medianSquareFootage: PropTypes.number,
      minSquareFootage: PropTypes.number,
      maxSquareFootage: PropTypes.number,
      averageDaysOnMarket: PropTypes.number,
      medianDaysOnMarket: PropTypes.number,
      minDaysOnMarket: PropTypes.number,
      maxDaysOnMarket: PropTypes.number,
      newListings: PropTypes.number,
      totalListings: PropTypes.number,
      dataByPropertyType: PropTypes.arrayOf(
        PropTypes.shape({
          propertyType: PropTypes.string.isRequired,
          averagePrice: PropTypes.number,
          medianPrice: PropTypes.number,
          minPrice: PropTypes.number,
          maxPrice: PropTypes.number,
          averagePricePerSquareFoot: PropTypes.number,
          medianPricePerSquareFoot: PropTypes.number,
          minPricePerSquareFoot: PropTypes.number,
          maxPricePerSquareFoot: PropTypes.number,
          averageSquareFootage: PropTypes.number,
          medianSquareFootage: PropTypes.number,
          minSquareFootage: PropTypes.number,
          maxSquareFootage: PropTypes.number,
          averageDaysOnMarket: PropTypes.number,
          medianDaysOnMarket: PropTypes.number,
          minDaysOnMarket: PropTypes.number,
          maxDaysOnMarket: PropTypes.number,
          newListings: PropTypes.number,
          totalListings: PropTypes.number,
        })
      ),
      dataByBedrooms: PropTypes.arrayOf(
        PropTypes.shape({
          bedrooms: PropTypes.number.isRequired,
          averagePrice: PropTypes.number.isRequired,
          medianPrice: PropTypes.number.isRequired,
          minPrice: PropTypes.number.isRequired,
          maxPrice: PropTypes.number.isRequired,
          averagePricePerSquareFoot: PropTypes.number,
          medianPricePerSquareFoot: PropTypes.number,
          minPricePerSquareFoot: PropTypes.number,
          maxPricePerSquareFoot: PropTypes.number,
          averageSquareFootage: PropTypes.number,
          medianSquareFootage: PropTypes.number,
          minSquareFootage: PropTypes.number,
          maxSquareFootage: PropTypes.number,
          averageDaysOnMarket: PropTypes.number,
          medianDaysOnMarket: PropTypes.number,
          minDaysOnMarket: PropTypes.number,
          maxDaysOnMarket: PropTypes.number,
          newListings: PropTypes.number,
          totalListings: PropTypes.number,
        })
      ),
      history: PropTypes.objectOf(
        PropTypes.shape({
          date: PropTypes.string.isRequired,
          averagePrice: PropTypes.number,
          minPrice: PropTypes.number,
          maxPrice: PropTypes.number,
          totalListings: PropTypes.number,
          dataByBedrooms: PropTypes.arrayOf(
            PropTypes.shape({
              bedrooms: PropTypes.number.isRequired,
              averagePrice: PropTypes.number.isRequired,
              totalListings: PropTypes.number.isRequired,
            })
          ),
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
      dataByBedrooms: PropTypes.arrayOf(
        PropTypes.shape({
          bedrooms: PropTypes.number.isRequired,
          averageRent: PropTypes.number.isRequired,
          totalListings: PropTypes.number.isRequired,
        })
      ),
      history: PropTypes.objectOf(
        PropTypes.shape({
          date: PropTypes.string.isRequired,
          averageRent: PropTypes.number,
          totalListings: PropTypes.number,
          dataByBedrooms: PropTypes.arrayOf(
            PropTypes.shape({
              bedrooms: PropTypes.number.isRequired,
              averageRent: PropTypes.number.isRequired,
              totalListings: PropTypes.number.isRequired,
            })
          ),
        })
      ),
    }),
  }).isRequired,
  propertyType: PropTypes.string.isRequired,
};

export default MarketStatistics;