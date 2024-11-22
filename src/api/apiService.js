// src/api/apiService.js

import { startProcessing } from './startProcessing';
import { retrieveInsights } from './retrieveInsights';

const fetchPropertyData = async (addressData) => {
  try {
    const requestId = await startProcessing(addressData);
    console.log('Received requestId:', requestId);
    const insightsData = await retrieveInsights(requestId);
    console.log('Retrieved insightsData:', insightsData);

    // Extract the required data from insightsData
    return {
      property: insightsData.propertyDetails?.fullDetails || null,
      valueEstimate: insightsData.propertyDetails?.valueEstimate || null,
      rentEstimate: insightsData.rentEstimate || null,
      marketStatistics: insightsData.marketStatistics || null,
      populationInsights: insightsData.insights?.populationInsights || null,
      housingInsights: insightsData.insights?.housingInsights || null,
      investmentInsights: insightsData.insights?.investmentInsights || null,
    };
  } catch (error) {
    console.error('Error fetching property data:', error);
    throw error; // Propagate the error to be handled in LoadingPage.js
  }
};

export default fetchPropertyData;