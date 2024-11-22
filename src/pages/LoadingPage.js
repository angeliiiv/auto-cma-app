// src/pages/LoadingPage.js

import React, { useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { PropertyContext } from '../context/PropertyContext';
import fetchPropertyData from '../api/apiService';
import { USE_MOCK_DATA } from '../config';
import mockData from '../mockData/mockData.json';
import './LoadingPage.css'; // Optional: For styling

function LoadingPage() {
  const {
    formData,
    setPropertyData,
    setValuationData,
    setRentalData,
    setMarketData,
    setInvestmentData,
    setPopulationData,
    setLoading,
    setError,
  } = useContext(PropertyContext);

  const navigate = useNavigate();
  const hasFetched = useRef(false); // Ref to prevent multiple fetches

  useEffect(() => {
    const fetchData = async () => {
      if (hasFetched.current) {
        console.log('fetchData has already been called. Skipping.');
        return;
      }
      hasFetched.current = true;

      if (!formData) {
        console.error('No form data found');
        setError('Please go back and enter an address.');
        return;
      }

      try {
        if (USE_MOCK_DATA) {
          console.log('Using mock data');
          setLoading(true);
          setPropertyData(mockData.propertyDetails);
          setValuationData(mockData.propertyDetails?.valueEstimate);
          setRentalData(mockData.propertyDetails?.rentEstimate);
          setMarketData(mockData.insights?.housingInsights);
          setInvestmentData(mockData.insights?.investmentInsights);
          setPopulationData(mockData.insights?.populationInsights);
          navigate('/dashboard');
        } else {
          console.log('Fetching live data');
          setLoading(true);
          const data = await fetchPropertyData(formData);
          console.log('Data fetched successfully:', data);

          if (!data.property) {
            throw new Error('Property data is missing in the response.');
          }

          setPropertyData(data.property);
          setValuationData(data.valueEstimate);
          setRentalData(data.rentalEstimate);
          setMarketData(data.housingInsights);
          setInvestmentData(data.investmentInsights);
          setPopulationData(data.populationInsights);
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('Error fetching property data:', err);
        setError('Failed to load property data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [
    formData,
    navigate,
    setPropertyData,
    setValuationData,
    setRentalData,
    setMarketData,
    setInvestmentData,
    setPopulationData,
    setLoading,
    setError,
    USE_MOCK_DATA,
  ]);

  return (
    <div className="loading-page">
      <div className="spinner"></div> {/* Spinner for visual feedback */}
      <h2>Processing your request...</h2>
      <p>Please wait while we retrieve your property data.</p>
    </div>
  );
}

export default LoadingPage;