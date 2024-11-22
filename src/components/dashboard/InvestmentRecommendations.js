// src/components/dashboard/InvestmentRecommendations.js

import React from 'react';

function InvestmentRecommendations({ investmentData }) {
  return (
    <section>
      <h3>Investment Insights</h3>
      <p>{investmentData}</p>
      {/* Add more investment insights as needed */}
    </section>
  );
}

export default InvestmentRecommendations;