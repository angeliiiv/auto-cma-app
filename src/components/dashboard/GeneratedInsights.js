// src/components/dashboard/GeneratedInsights.js

import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { AiOutlineRobot, AiOutlineHome, AiOutlineDollar } from 'react-icons/ai';
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
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  }

  @media (min-width: 768px) {
    flex: 1 1 calc(50% - 20px);
  }

  @media (min-width: 1024px) {
    flex: 1 1 calc(33.333% - 20px);
  }
`;

const InsightHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;

  svg {
    margin-right: 8px;
    color: #006064;
  }

  h3 {
    margin: 0;
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
  max-height: ${({ $expanded }) => ($expanded ? 'none' : '200px')};
  overflow: hidden;
  position: relative;
  transition: max-height 0.3s ease;

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

  /* Add a fade-out effect */
  &:after {
    content: '';
    display: ${({ $expanded }) => ($expanded ? 'none' : 'block')};
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    background: linear-gradient(to top, #f9f9f9, rgba(249, 249, 249, 0));
  }
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: #0066cc;
  cursor: pointer;
  padding: 0;
  font-size: 14px;
  margin-top: 10px;

  &:hover {
    text-decoration: underline;
  }

  &:focus {
    outline: 2px solid #006064;
    outline-offset: 2px;
  }
`;

// Helper Function to Convert Keys to Titles
const formatTitle = (key) => {
  // Remove 'Insights' suffix if present
  const titleKey = key.replace(/Insights$/, '');
  // Replace camelCase and underscores with spaces, then capitalize each word
  return titleKey
    .replace(/([A-Z])/g, ' $1') // Insert space before capital letters
    .replace(/_/g, ' ') // Replace underscores with spaces
    .replace(/\b\w/g, char => char.toUpperCase()) // Capitalize first letter of each word
    .trim();
};

// Icon Mapping
const insightIcons = {
  fixAndFlipInsights: <AiOutlineDollar size={20} />,
  buyAndHoldInsights: <AiOutlineHome size={20} />,
  // Add more mappings as needed
};

// Component

const GeneratedInsights = ({ insights }) => {
  const [expandedInsights, setExpandedInsights] = useState({});

  // Convert the insights object into an array for easier iteration
  const insightsArray = Object.entries(insights).map(([key, content]) => ({
    id: key,
    title: formatTitle(key.replace(/Insights$/, '')),
    content: content,
  }));

  const toggleExpand = (id) => {
    setExpandedInsights(prevState => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const filteredInsights = insightsArray; // No filtering since search bar is removed

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
        {filteredInsights.length > 0 ? (
          filteredInsights.map((insight) => (
            <InsightCard key={insight.id}>
              <InsightHeader>
                {insightIcons[insight.id] || <AiOutlineRobot size={20} />}
                <InsightTitle>{insight.title} Insights</InsightTitle>
              </InsightHeader>
              <InsightContent
                id={`insight-content-${insight.id}`}
                $expanded={expandedInsights[insight.id]}
              >
                <ReactMarkdown rehypePlugins={[rehypeSanitize]}>
                  {insight.content}
                </ReactMarkdown>
              </InsightContent>
              {insight.content.length > 300 && ( // Optional: show toggle only if content is long
                <ToggleButton
                  onClick={() => toggleExpand(insight.id)}
                  aria-expanded={expandedInsights[insight.id] ? 'true' : 'false'}
                  aria-controls={`insight-content-${insight.id}`}
                >
                  {expandedInsights[insight.id] ? 'Show Less' : 'Show More'}
                </ToggleButton>
              )}
            </InsightCard>
          ))
        ) : (
          <p>No insights available.</p>
        )}
      </InsightsContainer>
    </Container>
  );
};

GeneratedInsights.propTypes = {
  insights: PropTypes.objectOf(
    PropTypes.string
  ).isRequired,
};

export default GeneratedInsights;