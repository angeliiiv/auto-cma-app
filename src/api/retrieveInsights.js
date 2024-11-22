// src/api/retrieveInsights.js

export const retrieveInsights = async (requestId, pollInterval = 5000, maxAttempts = 12) => {
  const apiGatewayBaseUrl = 'https://rvipetjm5g.execute-api.us-east-2.amazonaws.com';
  const getInsightsUrl = `${apiGatewayBaseUrl}/getInsights`;

  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      console.log(`Polling attempt ${attempts + 1} for requestId: ${requestId}`);
      const response = await fetch(`${getInsightsUrl}?requestId=${requestId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const insightsData = await response.json();
        console.log(`Polling attempt ${attempts + 1}: Received response:`, insightsData);

        // Check if the response indicates that processing is still ongoing
        if (insightsData.message === 'Processing' && insightsData.status === 'pending') {
          console.log(`Polling attempt ${attempts + 1}: Data is still processing. Retrying in ${pollInterval / 1000} seconds...`);
        } else {
          // Data is ready; return the insights data
          console.log(`Polling attempt ${attempts + 1}: Data is ready.`);
          return insightsData;
        }
      } else if (response.status === 202) {
        console.log(`Polling attempt ${attempts + 1}: Data is still processing (Status 202).`);
      } else {
        const errorDetails = await response.text();
        throw new Error(`Error retrieving insights: ${response.status} - ${errorDetails}`);
      }
    } catch (error) {
      console.error(`Error during polling attempt ${attempts + 1}:`, error.message || error);
    }

    // Wait before the next polling attempt
    await new Promise((resolve) => setTimeout(resolve, pollInterval));
    attempts++;
  }

  throw new Error('Failed to retrieve insights within the expected time frame.');
};