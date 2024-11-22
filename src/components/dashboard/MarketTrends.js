// src/components/dashboard/MarketTrends.js

import React from 'react';

function MarketTrends({ marketData }) {
  return (
    <section>
      <h3>Housing Insights</h3>
      <p>{marketData}</p>
      {/* You can further break this down into sub-sections or visualizations */}
    </section>
  );
}

export default MarketTrends;