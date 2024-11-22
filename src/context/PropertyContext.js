// src/context/PropertyContext.js

import React, { createContext, useState, useEffect } from 'react';
import { USE_MOCK_DATA } from '../config';
import mockData from '../mockData/mockData.json';

export const PropertyContext = createContext({
  formData: null,
  setFormData: () => {},
  propertyData: null,
  setPropertyData: () => {},
  valuationData: null,
  setValuationData: () => {},
  rentalData: null,
  setRentalData: () => {},
  marketData: null,
  setMarketData: () => {},
  investmentData: null,
  setInvestmentData: () => {},
  populationData: null,
  setPopulationData: () => {},
  loading: false,
  setLoading: () => {},
  error: null,
  setError: () => {},
});

export const PropertyProvider = ({ children }) => {
  // State variables for form data and API results
  const [formData, setFormData] = useState(null);
  const [propertyData, setPropertyData] = useState(null);
  const [valuationData, setValuationData] = useState(null);
  const [rentalData, setRentalData] = useState(null);
  const [marketData, setMarketData] = useState(null);
  const [investmentData, setInvestmentData] = useState(null);
  const [populationData, setPopulationData] = useState(null);

  // State variables for loading and error handling
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Effect to load mock data or wait for formData
  useEffect(() => {
    if (USE_MOCK_DATA) {
      try {
        console.log('Loading mock data');
        setPropertyData(mockData.propertyDetails?.fullDetails);
        setValuationData(mockData.propertyDetails?.valueEstimate);
        setRentalData(mockData.propertyDetails?.rentEstimate);
        setMarketData(mockData.insights?.housingInsights);
        setInvestmentData(mockData.insights?.investmentInsights);
        setPopulationData(mockData.insights?.populationInsights);
        setLoading(false);
      } catch (err) {
        console.error('Error loading mock data:', err);
        setError('Failed to load mock data.');
        setLoading(false);
      }
    }
    // Do not fetch live data here; it will be triggered in LoadingPage.js
  }, []);

  const contextValue = {
    formData,
    setFormData,
    propertyData,
    setPropertyData,
    valuationData,
    setValuationData,
    rentalData,
    setRentalData,
    marketData,
    setMarketData,
    investmentData,
    setInvestmentData,
    populationData,
    setPopulationData,
    loading,
    setLoading,
    error,
    setError,
  };

  return (
    <PropertyContext.Provider value={contextValue}>
      {children}
    </PropertyContext.Provider>
  );
};