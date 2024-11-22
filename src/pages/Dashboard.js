// src/pages/Dashboard.js

import React, { useContext } from 'react';
import { PropertyContext } from '../context/PropertyContext';
import PropertyOverview from '../components/dashboard/PropertyOverview';
import ValuationInsights from '../components/dashboard/ValuationInsights';
// import RentalOverview from '../components/dashboard/RentalOverview';
// import MarketInsights from '../components/dashboard/MarketInsights';
// import InvestmentInsights from '../components/dashboard/InvestmentInsights';
// import PopulationInsights from '../components/dashboard/PopulationInsights';
import './Dashboard.css';

function Dashboard() {
  const {
    propertyData,
    valuationData,
    rentalData,
    marketData,
    investmentData,
    populationData,
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

  return (
    <div className="dashboard">
      <h2>Property Report</h2>

      {/* Property Overview */}
      <PropertyOverview property={propertyData} />

      {/* Valuation Insights */}
      <ValuationInsights valueEstimate={valuationData} />
      {/* Add other components as they are created */}
    </div>
  );
}

export default Dashboard;