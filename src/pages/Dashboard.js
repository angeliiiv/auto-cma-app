// src/pages/Dashboard.js

import React, { useContext } from 'react';
import { PropertyContext } from '../context/PropertyContext';
import PropertyOverview from '../components/dashboard/PropertyOverview';
import ValuationInsights from '../components/dashboard/ValuationInsights';
import RentalOverview from '../components/dashboard/RentalOverview';
import MarketStatistics from '../components/dashboard/MarketStatistics';
import GeneratedInsights from '../components/dashboard/GeneratedInsights'; // Import
import styled from 'styled-components';
import './Dashboard.css';

const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column; 
  padding: 20px;
  gap: 40px;              
  width: 100%;
  max-width: 1200px;    
  margin: 0 auto;       
  box-sizing: border-box;
  min-height: 100vh;    

`;

function Dashboard() {
  const {
    propertyData,
    valuationData,
    rentalData,
    marketData,
    insights,
    loading,
    error,
  } = useContext(PropertyContext); // Consume PropertyContext

  if (loading) {
    return <div>Loading...</div>; // Simple loading state
  }

  if (error) {
    return <div>Error: {error}</div>; // Simple error state
  }
  if (!propertyData) {
    return <div>No data available</div>;
  }

  const targetPropertyType = propertyData.propertyType; // e.g., "Single Family"

  return (
    <DashboardContainer>
        <PropertyOverview property={propertyData} />
        <ValuationInsights valuationData={valuationData} />
        <RentalOverview rentalData={rentalData} /> 
        <MarketStatistics marketData={marketData} propertyType={targetPropertyType} />
        <GeneratedInsights insights={insights} />
    </DashboardContainer>
  );
}

export default Dashboard;