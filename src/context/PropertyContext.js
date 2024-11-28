// src/context/PropertyContext.js

import React, { createContext, useState, useEffect } from 'react';
import { USE_MOCK_DATA } from '../config';
import mockData from '../mockData/mockData.json';
import fetchPropertyData from '../api/apiService';

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
  insights: null, // Renamed from aiData
  setInsights: () => {}, // Renamed from setAiData
  loading: false,
  setLoading: () => {},
  error: null,
  setError: () => {},
});

export const PropertyProvider = ({ children }) => {
  const [formData, setFormData] = useState(null);
  const [propertyData, setPropertyData] = useState(null);
  const [valuationData, setValuationData] = useState(null);
  const [rentalData, setRentalData] = useState(null);
  const [marketData, setMarketData] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        let insightsData;
        if (USE_MOCK_DATA) {
          console.log('Loading mock data');
          insightsData = mockData;
        } else if (formData) {
          console.log('Loading live data');
          insightsData = await fetchPropertyData(formData);
        }

        if (insightsData) {
          console.log(insightsData)
          setPropertyData(insightsData.propertyDetails?.fullDetails);
          setValuationData(insightsData.propertyDetails?.valueEstimate);
          setRentalData(insightsData.propertyDetails?.rentEstimate);
          setMarketData(insightsData.propertyDetails?.marketStatistics);
          setInsights(insightsData.insights);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data.');
        setLoading(false);
      }
    };

    loadData();
  }, [USE_MOCK_DATA, formData]);

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
    insights,
    setInsights, 
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