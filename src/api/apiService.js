// src/api/apiService.js

import { startProcessing } from './startProcessing';
import { retrieveInsights } from './retrieveInsights';

const fetchPropertyData = async (addressData) => {
  try {
    const requestId = await startProcessing(addressData);
    console.log('Received requestId:', requestId);
    const insightsData = await retrieveInsights(requestId);
    console.log('Retrieved insightsData:', insightsData);

    return insightsData;
  } catch (error) {
    console.error('Error fetching property data:', error);
    throw error; // Propagate the error to be handled in PropertyContext.js
  }
};

export default fetchPropertyData;