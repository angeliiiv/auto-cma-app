// src/components/dashboard/GeneratedInsights.js

import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { AiOutlineRobot } from 'react-icons/ai'; // AI Icon from React Icons
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';

// Styled Components

const Container = styled.div`
  width: 100%;
  padding: 20px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  overflow: visible;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  h2 {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    font-weight: 600;
    font-size: 24px;
    color: #333333;
  }
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  background-color: #e0f7fa;
  color: #006064;
  border-radius: 12px;
  padding: 4px 8px;
  font-size: 12px;
  margin-left: 10px;

  svg {
    margin-right: 4px;
  }
`;

const InsightsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  /* Responsive adjustments */
  @media (min-width: 768px) {
    flex-direction: row;
    flex-wrap: wrap;
  }
`;

const InsightCard = styled.div`
  flex: 1 1 100%;
  background: #f9f9f9;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  box-sizing: border-box;

  @media (min-width: 768px) {
    flex: 1 1 calc(50% - 20px);
  }

  @media (min-width: 1024px) {
    flex: 1 1 calc(33.333% - 20px);
  }
`;

const InsightTitle = styled.h3`
  font-size: 22px; /* Increased font size */
  font-weight: 700; /* Bolder weight */
  color: #333333;
  margin-bottom: 15px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
`;

const InsightContent = styled.div`
  font-size: 16px;
  line-height: 1.6; /* Improved line spacing */
  color: #555555;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;

  /* Styling for markdown elements */
  h3 {
    font-size: 18px;
    margin-top: 20px;
  }

  ul {
    list-style-type: disc;
    padding-left: 25px;
    margin-bottom: 15px;
  }

  ol {
    list-style-type: decimal;
    padding-left: 25px;
    margin-bottom: 15px;
  }

  strong {
    font-weight: bold;
  }

  blockquote {
    border-left: 4px solid #ccc;
    padding-left: 16px;
    color: #666;
    font-style: italic;
    margin: 20px 0;
  }

  a {
    color: #0066cc;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;

// Helper Function to Convert Keys to Titles
const formatTitle = (key) => {
  // Replace camelCase with spaces and capitalize each word
  const result = key
    .replace(/([A-Z])/g, ' $1') // Insert space before capital letters
    .replace(/_/g, ' ') // Replace underscores with spaces
    .replace(/\b\w/g, char => char.toUpperCase()) // Capitalize first letter of each word
    .trim();
  return result;
};

// Component

const GeneratedInsights = ({ insights }) => {
  console.log('Generated Insights:', insights);

  if (!insights || typeof insights !== 'object') {
    console.warn('GeneratedInsights: insights prop is undefined or not an object.');
    return (
      <Container>
        <SectionHeader>
          <h2>Generated Insights</h2>
          <Badge aria-label="AI Generated Insights">
            <AiOutlineRobot size={16} />
            AI Powered
          </Badge>
        </SectionHeader>
        <p>No insights available at the moment.</p>
      </Container>
    );
  }

  // Convert the insights object into an array for easier iteration
  const insightsArray = Object.entries(insights).map(([key, content]) => ({
    id: key,
    title: formatTitle(key.replace(/Insights$/, '')), // Remove 'Insights' suffix and format
    content,
  }));

  return (
    <Container>
      <SectionHeader>
        <h2>Generated Insights</h2>
        <Badge aria-label="AI Generated Insights">
          <AiOutlineRobot size={16} />
          AI Powered
        </Badge>
      </SectionHeader>
      <InsightsContainer>
        {insightsArray.map((insight) => (
          <InsightCard key={insight.id}>
            <InsightTitle>{insight.title} Insights</InsightTitle>
            <InsightContent>
              <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
                {insight.content}
              </ReactMarkdown>
            </InsightContent>
          </InsightCard>
        ))}
      </InsightsContainer>
    </Container>
  );
};

GeneratedInsights.propTypes = {
  insights: PropTypes.shape({
    populationInsights: PropTypes.string.isRequired,
    housingInsights: PropTypes.string.isRequired,
    investmentInsights: PropTypes.string.isRequired,
    // Add other insight categories if present
  }).isRequired,
};

export default GeneratedInsights;