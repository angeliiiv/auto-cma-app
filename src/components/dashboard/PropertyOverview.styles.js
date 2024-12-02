// src/components/dashboard/PropertyOverview.styles.js

import styled from 'styled-components';

export const OverviewContainer = styled.div`
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  
  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const Address = styled.h2`
  font-size: 24px;
  color: #333333;
  margin: 0;
`;

export const PropertyType = styled.span`
  display: inline-block;
  background: #f0f0f0;
  color: #555555;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 14px;
  margin-top: 8px;
`;

export const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
`;

export const DetailItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const DetailLabel = styled.span`
  font-weight: 600;
  color: #555555;
`;

export const DetailValue = styled.span`
  color: #777777;
`;

export const OwnerInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const OwnerName = styled.span`
  font-weight: 600;
  color: #333333;
`;

export const MailingAddress = styled.span`
  color: #777777;
  font-size: 14px;
`;