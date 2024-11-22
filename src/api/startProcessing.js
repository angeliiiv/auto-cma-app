// src/api/startProcessing.js

export const startProcessing = async (addressData) => {
  const apiGatewayBaseUrl = 'https://rvipetjm5g.execute-api.us-east-2.amazonaws.com';
  const startProcessingUrl = `${apiGatewayBaseUrl}/fetch_mvp_data_2`;

  try {
    const response = await fetch(startProcessingUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(addressData),
    });

    if (!response.ok) {
      const errorDetails = await response.text();
      console.error(`Start processing failed with status ${response.status}: ${errorDetails}`);
      throw new Error(`Start processing failed with status ${response.status}`);
    }

    const data = await response.json();
    if (!data?.requestId) {
      throw new Error('No requestId received from the start processing response');
    }

    console.log('Received requestId:', data.requestId);
    return data.requestId;
  } catch (error) {
    console.error('Error starting processing:', error.message || error);
    throw error;
  }
};