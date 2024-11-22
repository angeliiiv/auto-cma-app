// src/components/dashboard/RentalInsights.js

import React from 'react';

function RentalInsights({ rentalData }) {
  return (
    <section>
      <h3>Rental Insights</h3>
      <p>{rentalData}</p>
      {/* Add more rental insights as needed */}
    </section>
  );
}

export default RentalInsights;