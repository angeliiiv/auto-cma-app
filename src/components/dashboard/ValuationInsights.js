// src/components/dashboard/ValuationInsights.js

import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { FiInfo, FiEdit, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import Modal from 'react-modal';

// Ensure the modal is attached to the app root for accessibility
Modal.setAppElement('#root');

// --------------------- Styled Components ---------------------

// Container for the entire component
const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  padding: 20px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
`;

// Wrapper for the four metric cards
const CardsWrapper = styled.div`
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: space-between;

  @media (max-width: 1024px) {
    justify-content: center;
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

// Generic Card styled-component for uniformity
const Card = styled.div`
  background: ${(props) => props.bgColor || '#f8f9fa'};
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  flex: 1 1 220px; /* Ensures all cards have the same width */
  min-width: 220px;
  margin-bottom: 20px;
  position: relative; /* For positioning icons */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

// Styled-component for the Estimated Profit Card with dynamic glow
const EstimatedProfitCard = styled(Card)`
  box-shadow: ${(props) =>
    props.profit >= 0
      ? '0 0 15px rgba(46, 125, 50, 0.6)' // Green glow for positive profit
      : '0 0 15px rgba(211, 47, 47, 0.6)'}; // Red glow for negative profit

  transition: box-shadow 0.3s ease;
`;

// Wrapper for titles using relative positioning
const TitleWrapper = styled.div`
  position: relative; /* To position the edit icon absolutely within */
  padding: 10px 0; /* Add some padding if necessary */
`;

// Edit Icon styled-component positioned absolutely
const EditIconStyled = styled(FiEdit)`
  position: absolute;
  top: 0;
  right: 0;
  color: #007bff;
  cursor: pointer;
  transition: color 0.3s ease;
  font-size: 18px;

  &:hover {
    color: #0056b3;
  }
`;

// Define SectionHeader styled-component
const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0 10px 0;
`;

// Title styled-component
const Title = styled.h3`
  font-size: 18px;
  color: #555555;
  margin: 0;
`;

// Tooltip container
const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
  margin-top: 10px;
`;

// Info Icon styled-component
const InfoIconStyled = styled(FiInfo)`
  color: #007bff;
  cursor: pointer;
  transition: color 0.3s ease;
  font-size: 18px;
`;

// Tooltip styled-component
const Tooltip = styled.div`
  visibility: hidden;
  width: 220px;
  background-color: #333333;
  color: #ffffff;
  text-align: left;
  border-radius: 8px;
  padding: 10px;
  position: absolute;
  z-index: 10;
  top: 125%; /* Position above the icon */
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s ease, visibility 0.3s ease;

  /* Arrow */
  &::after {
    content: '';
    position: absolute;
    bottom: -6px; /* Arrow below the tooltip */
    left: 50%;
    transform: translateX(-50%);
    border-width: 6px;
    border-style: solid;
    border-color: #333333 transparent transparent transparent;
  }

  /* Show the tooltip when hovering over the TooltipContainer */
  ${TooltipContainer}:hover & {
    visibility: visible;
    opacity: 1;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    width: 180px;
    padding: 8px;
    margin-left: -90px;
  }
`;

// Value styled-components
const ARVValue = styled.p`
  font-size: 28px;
  color: #333333;
  margin: 10px 0;
  font-weight: bold;
`;

const Range = styled.p`
  font-size: 14px;
  color: #777777;
  margin-top: 8px;
`;

const ProfitValue = styled.p`
  font-size: 28px;
  color: ${(props) => (props.profit >= 0 ? '#2e7d32' : '#d32f2f')}; /* Green or Red */
  margin: 10px 0;
  font-weight: bold;
  transition: color 0.3s ease;
`;

const ProfitRange = styled.p`
  font-size: 14px;
  color: #777777;
  margin-top: 8px;
`;

// Toggle Button styled-component
const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  transition: color 0.3s ease;

  &:hover {
    color: #0056b3;
  }

  /* Ensure the button is focusable */
  &:focus {
    outline: none;
  }

  /* Icon rotation when active */
  svg {
    margin-left: 5px;
    transition: transform 0.3s ease;
    transform: ${(props) => (props.collapsed ? 'rotate(0deg)' : 'rotate(180deg)')};
  }
`;

// Modal content styled-components
const ModalContent = styled.div`
  padding: 20px;
`;

const ModalTitle = styled.h2`
  margin-top: 0;
  color: #333333;
`;

const CostInput = styled.div`
  margin-bottom: 15px;
`;

const CostLabel = styled.label`
  display: block;
  font-size: 14px;
  color: #555555;
  margin-bottom: 5px;
`;

// CostField is crucial and must be defined
const CostField = styled.input`
  width: 100%;
  padding: 8px 10px;
  font-size: 14px;
  border: 1px solid #cccccc;
  border-radius: 4px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

// Tooltip for Input Fields
const InputTooltipContainer = styled.div`
  position: relative;
  display: inline-block;
  margin-left: 8px;
`;

const InputInfoIcon = styled(FiInfo)`
  color: #007bff;
  cursor: pointer;
  transition: color 0.3s ease;
  font-size: 18px;
`;

const InputTooltipBox = styled.div`
  visibility: hidden;
  width: 220px;
  background-color: #333333;
  color: #ffffff;
  text-align: left;
  border-radius: 8px;
  padding: 10px;
  position: absolute;
  z-index: 20;
  top: 50%;
  left: 110%;
  transform: translateY(-50%);
  opacity: 0;
  transition: opacity 0.3s ease, visibility 0.3s ease;

  /* Arrow */
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    right: 100%; /* To the left of the tooltip */
    transform: translateY(-50%);
    border-width: 6px;
    border-style: solid;
    border-color: transparent #333333 transparent transparent;
  }

  /* Show the tooltip when hovering over the InputTooltipContainer */
  ${InputTooltipContainer}:hover &,
  ${InputTooltipContainer}:focus-within & {
    visibility: visible;
    opacity: 1;
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    width: 200px;
    left: 100%;
  }
`;

// Error Message styled-component
const ErrorMessage = styled.p`
  color: #d32f2f; /* Red color for errors */
  font-size: 14px;
  margin-top: 8px;
`;

// Styled Components for Sales Comparables Table Section
const Section = styled.section`
  width: 100%;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
`;

const Th = styled.th`
  text-align: left;
  padding: 12px;
  background-color: #f0f0f0;
  color: #333333;
  font-weight: 500;
  cursor: pointer; /* Indicate that the header is clickable for sorting */

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 14px;
  }
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e0e0e0;
  color: #555555;

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 14px;
  }
`;

const Tr = styled.tr`
  &:hover {
    background-color: #fafafa;
  }
`;

// --------------------- Main Component ---------------------

const ValuationInsights = ({ valuationData, repairEstimates }) => {
  // State to control the visibility of the comparables table
  const [isTableCollapsed, setIsTableCollapsed] = useState(false);

  // States for additional costs
  const [closingCosts, setClosingCosts] = useState(0);
  const [sellingCosts, setSellingCosts] = useState(0);
  const [holdingPeriod, setHoldingPeriod] = useState(6); // in months
  const [monthlyHoldingCost, setMonthlyHoldingCost] = useState(500); // per month
  const [totalHoldingCosts, setTotalHoldingCosts] = useState(
    holdingPeriod * monthlyHoldingCost
  ); // holdingPeriod * monthlyHoldingCost

  // State for Estimated Profit
  const [profitData, setProfitData] = useState({ profit: 0 });

  // State for error messages
  const [error, setError] = useState('');

  // State to control the Additional Costs modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for repair cost (initialized with prop value)
  const [repairCost, setRepairCost] = useState(
    repairEstimates?.['Fix and Flip']?.estimatedCost?.repairCost || 0
  );

  // State for repair cost range (kept as per data)
  const { repairCostLow, repairCostHigh } =
    repairEstimates?.['Fix and Flip']?.estimatedCost || {};

  // State to control the Repair Estimate modal visibility
  const [isRepairModalOpen, setIsRepairModalOpen] = useState(false);

  // State for error messages in repair estimate modal
  const [repairError, setRepairError] = useState('');

  // State for MAO percentage
  const [maoPercentage, setMaoPercentage] = useState(70); // Default is 70%

  // State to control the MAO modal visibility
  const [isMaoModalOpen, setIsMaoModalOpen] = useState(false);

  // State for error messages in MAO modal
  const [maoError, setMaoError] = useState('');

  // Destructure necessary data from props
  const { price, priceRangeLow, priceRangeHigh, comparables } = valuationData;

  // Memoize MAO calculation based on user-defined percentage
  const maoDataMemo = useMemo(() => {
    const maoValue = Math.round(price * (maoPercentage / 100) - repairCost);
    return {
      value: maoValue,
    };
  }, [price, maoPercentage, repairCost]);

  // Calculate MAO Low and High (±10%)
  const maoDataLowMemo = useMemo(() => {
    return Math.round(maoDataMemo.value * 0.9);
  }, [maoDataMemo.value]);

  const maoDataHighMemo = useMemo(() => {
    return Math.round(maoDataMemo.value * 1.1);
  }, [maoDataMemo.value]);

  // Set default additional costs based on ARV
  useEffect(() => {
    const defaultClosing = Math.round(price * 0.03); // 3% of ARV
    const defaultSelling = Math.round(price * 0.05); // 5% of ARV
    setClosingCosts(defaultClosing);
    setSellingCosts(defaultSelling);
  }, [price]);

  // Recalculate Total Holding Costs whenever holding period or monthly cost changes
  useEffect(() => {
    setTotalHoldingCosts(holdingPeriod * monthlyHoldingCost);
  }, [holdingPeriod, monthlyHoldingCost]);

  // Recalculate Profit whenever relevant data changes
  useEffect(() => {
    const calculateProfit = () => {
      // Estimated Profit = ARV - (Repair Estimate + MAO + Other Costs)
      const profit =
        price -
        (repairCost +
          maoDataMemo.value +
          closingCosts +
          sellingCosts +
          totalHoldingCosts);
      return {
        profit: profit, // Allow negative values
      };
    };

    const newProfit = calculateProfit();
    setProfitData(newProfit);

    // Optional: Display error if desired (Removed as per user request)
    /*
    if (profit < 0) {
      setError(
        'Warning: Your estimated costs exceed the ARV, resulting in a loss.'
      );
    } else {
      setError('');
    }
    */
    setError(''); // Clear any existing errors
  }, [
    price,
    repairCost,
    maoDataMemo.value,
    closingCosts,
    sellingCosts,
    totalHoldingCosts,
  ]);

  // Handlers for Additional Costs Modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Handler for Save Button with Validation
  const handleSave = () => {
    // Basic validation to prevent negative numbers
    if (
      closingCosts < 0 ||
      sellingCosts < 0 ||
      holdingPeriod < 0 ||
      monthlyHoldingCost < 0
    ) {
      setError('Please enter valid non-negative numbers.');
      return;
    }

    // If validation passes, clear errors and close modal
    setError('');
    closeModal();
  };

  // Handlers for Repair Estimate Modal
  const openRepairModal = () => setIsRepairModalOpen(true);
  const closeRepairModal = () => setIsRepairModalOpen(false);

  const handleSaveRepairEstimate = () => {
    // Basic validation to prevent negative numbers
    if (repairCost < 0) {
      setRepairError('Please enter a valid non-negative number.');
      return;
    }

    // If validation passes, clear errors and close modal
    setRepairError('');
    closeRepairModal();
  };

  // Handlers for MAO Modal
  const openMaoModal = () => setIsMaoModalOpen(true);
  const closeMaoModal = () => setIsMaoModalOpen(false);

  const handleSaveMaoPercentage = () => {
    // Validation: Percentage should be between 1 and 100
    if (maoPercentage <= 0 || maoPercentage > 100) {
      setMaoError('Please enter a valid percentage between 1 and 100.');
      return;
    }

    // If validation passes, clear errors and close modal
    setMaoError('');
    closeMaoModal();
  };

  return (
    <Container>
      <CardsWrapper>
        {/* After Repair Value Card */}
        <Card>
          <TitleWrapper>
            <Title>After Repair Value</Title>
          </TitleWrapper>
          <ARVValue>${price.toLocaleString()}</ARVValue>
          <Range>${priceRangeLow.toLocaleString()} - ${priceRangeHigh.toLocaleString()}</Range>
          <TooltipContainer>
            <InfoIconStyled
              aria-label="After Repair Value Explanation"
              role="tooltip"
              tabIndex="0"
            >
              <FiInfo />
            </InfoIconStyled>
            <Tooltip role="tooltip" aria-hidden="true">
              <strong>After Repair Value (ARV) Calculation:</strong>
              <br />
              ARV represents the estimated value of the property after all repairs
              and renovations are completed.
            </Tooltip>
          </TooltipContainer>
        </Card>

        {/* Repair Estimate Card */}
        <Card>
          <TitleWrapper>
            <Title>Repair Estimate</Title>
            <EditIconStyled
              aria-label="Edit Repair Estimate"
              onClick={openRepairModal}
            >
              <FiEdit />
            </EditIconStyled>
          </TitleWrapper>
          <ARVValue>${repairCost.toLocaleString()}</ARVValue>
          <Range>${repairCostLow.toLocaleString()} - ${repairCostHigh.toLocaleString()}</Range>
          <TooltipContainer>
            <InfoIconStyled
              aria-label="Repair Estimate Explanation"
              role="tooltip"
              tabIndex="0"
            >
              <FiInfo />
            </InfoIconStyled>
            <Tooltip role="tooltip" aria-hidden="true">
              <strong>Repair Estimate:</strong>
              <br />
              Estimated costs required to repair and renovate the property to achieve the ARV.
            </Tooltip>
          </TooltipContainer>
        </Card>

        {/* Max Allowable Offer Card */}
        <Card>
          <TitleWrapper>
            <Title>Max Allowable Offer</Title>
            <EditIconStyled
              aria-label="Edit MAO Percentage"
              onClick={openMaoModal}
            >
              <FiEdit />
            </EditIconStyled>
          </TitleWrapper>
          <ARVValue>${maoDataMemo.value.toLocaleString()}</ARVValue>
          <Range>${maoDataLowMemo.toLocaleString()} - ${maoDataHighMemo.toLocaleString()}</Range>
          <TooltipContainer>
            <InfoIconStyled
              aria-label="MAO Calculation Explanation"
              role="tooltip"
              tabIndex="0"
            >
              <FiInfo />
            </InfoIconStyled>
            <Tooltip role="tooltip" aria-hidden="true">
              <strong>MAO Calculation:</strong>
              <br />
              MAO = {maoPercentage}% of ARV - Repair Cost.
              <br />
              Range: ±10% of MAO.
            </Tooltip>
          </TooltipContainer>
        </Card>

        {/* Estimated Profit Card */}
        <EstimatedProfitCard profit={profitData.profit}>
          <TitleWrapper>
            <Title>Estimated Profit</Title>
            <EditIconStyled
              aria-label="Edit Estimated Profit"
              onClick={openModal}
            >
              <FiEdit />
            </EditIconStyled>
          </TitleWrapper>
          <ProfitValue profit={profitData.profit}>
            ${profitData.profit.toLocaleString()}
          </ProfitValue>
          <ProfitRange>Estimated Profit from the Deal</ProfitRange>
          {/* Removed error message related to negative profit */}
          <TooltipContainer>
            <InfoIconStyled
              aria-label="Estimated Profit Explanation"
              role="tooltip"
              tabIndex="0"
            >
              <FiInfo />
            </InfoIconStyled>
            <Tooltip role="tooltip" aria-hidden="true">
              <strong>Estimated Profit:</strong>
              <br />
              Estimated profit from the deal after accounting for all costs.
            </Tooltip>
          </TooltipContainer>
        </EstimatedProfitCard>
      </CardsWrapper>

      {/* Modal for Additional Costs */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Edit Additional Costs"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
          },
          content: {
            maxWidth: '500px',
            margin: 'auto',
            borderRadius: '12px',
            padding: '20px',
          },
        }}
      >
        <ModalContent>
          <ModalTitle>Edit Additional Costs</ModalTitle>

          {/* Closing Costs Input */}
          <CostInput>
            <CostLabel htmlFor="closingCosts">Closing Costs ($):</CostLabel>
            <InputTooltipContainer>
              <InputInfoIcon aria-label="Closing Costs Explanation" role="tooltip" tabIndex="0">
                <FiInfo />
              </InputInfoIcon>
              <InputTooltipBox role="tooltip" aria-hidden="true">
                <strong>Closing Costs:</strong>
                <br />
                These are the fees and expenses you incur when purchasing the property, typically around 3% of the After Repair Value (ARV). They include appraisal fees, title insurance, and other transaction-related costs.
              </InputTooltipBox>
            </InputTooltipContainer>
            <CostField
              type="number"
              id="closingCosts"
              value={closingCosts}
              onChange={(e) => setClosingCosts(Number(e.target.value))}
              placeholder={`3% of ARV (${(price * 0.03).toLocaleString()})`}
              min="0"
            />
          </CostInput>

          {/* Selling Costs Input */}
          <CostInput>
            <CostLabel htmlFor="sellingCosts">Selling Costs ($):</CostLabel>
            <InputTooltipContainer>
              <InputInfoIcon aria-label="Selling Costs Explanation" role="tooltip" tabIndex="0">
                <FiInfo />
              </InputInfoIcon>
              <InputTooltipBox role="tooltip" aria-hidden="true">
                <strong>Selling Costs:</strong>
                <br />
                These are expenses related to selling the property, typically around 5% of the ARV. They include agent commissions, marketing fees, and closing costs on the sale.
              </InputTooltipBox>
            </InputTooltipContainer>
            <CostField
              type="number"
              id="sellingCosts"
              value={sellingCosts}
              onChange={(e) => setSellingCosts(Number(e.target.value))}
              placeholder={`5% of ARV (${(price * 0.05).toLocaleString()})`}
              min="0"
            />
          </CostInput>

          {/* Holding Period Input */}
          <CostInput>
            <CostLabel htmlFor="holdingPeriod">Holding Period (months):</CostLabel>
            <InputTooltipContainer>
              <InputInfoIcon aria-label="Holding Period Explanation" role="tooltip" tabIndex="0">
                <FiInfo />
              </InputInfoIcon>
              <InputTooltipBox role="tooltip" aria-hidden="true">
                <strong>Holding Period:</strong>
                <br />
                The number of months you expect to hold the property before selling it. This affects the total holding costs, including utilities, maintenance, and property taxes.
              </InputTooltipBox>
            </InputTooltipContainer>
            <CostField
              type="number"
              id="holdingPeriod"
              value={holdingPeriod}
              onChange={(e) => setHoldingPeriod(Number(e.target.value))}
              placeholder="e.g., 6"
              min="0"
            />
          </CostInput>

          {/* Monthly Holding Cost Input */}
          <CostInput>
            <CostLabel htmlFor="monthlyHoldingCost">Monthly Holding Cost ($):</CostLabel>
            <InputTooltipContainer>
              <InputInfoIcon aria-label="Monthly Holding Cost Explanation" role="tooltip" tabIndex="0">
                <FiInfo />
              </InputInfoIcon>
              <InputTooltipBox role="tooltip" aria-hidden="true">
                <strong>Monthly Holding Cost:</strong>
                <br />
                The average monthly expenses incurred while holding the property. This typically includes utilities, insurance, maintenance, and property taxes. An example default value is $500 per month.
              </InputTooltipBox>
            </InputTooltipContainer>
            <CostField
              type="number"
              id="monthlyHoldingCost"
              value={monthlyHoldingCost}
              onChange={(e) => setMonthlyHoldingCost(Number(e.target.value))}
              placeholder="e.g., 500"
              min="0"
            />
          </CostInput>

          {/* Save Button */}
          <button
            onClick={handleSave}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Save
          </button>

          {/* Display Error Message if Any */}
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </ModalContent>
      </Modal>

      {/* Modal for Editing Repair Estimates */}
      <Modal
        isOpen={isRepairModalOpen}
        onRequestClose={closeRepairModal}
        contentLabel="Edit Repair Estimate"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
          },
          content: {
            maxWidth: '400px',
            margin: 'auto',
            borderRadius: '12px',
            padding: '20px',
          },
        }}
      >
        <ModalContent>
          <ModalTitle>Edit Repair Estimate</ModalTitle>

          {/* Repair Cost Input */}
          <CostInput>
            <CostLabel htmlFor="repairCost">Repair Cost ($):</CostLabel>
            <InputTooltipContainer>
              <InputInfoIcon aria-label="Repair Cost Explanation" role="tooltip" tabIndex="0">
                <FiInfo />
              </InputInfoIcon>
              <InputTooltipBox role="tooltip" aria-hidden="true">
                <strong>Repair Cost:</strong>
                <br />
                The total estimated cost to repair and renovate the property.
              </InputTooltipBox>
            </InputTooltipContainer>
            <CostField
              type="number"
              id="repairCost"
              value={repairCost}
              onChange={(e) => setRepairCost(Number(e.target.value))}
              placeholder={`Enter repair cost`}
              min="0"
            />
          </CostInput>

          {/* Save Button */}
          <button
            onClick={handleSaveRepairEstimate}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Save
          </button>

          {/* Display Error Message if Any */}
          {repairError && <ErrorMessage>{repairError}</ErrorMessage>}
        </ModalContent>
      </Modal>

      {/* Modal for Editing MAO Percentage */}
      <Modal
        isOpen={isMaoModalOpen}
        onRequestClose={closeMaoModal}
        contentLabel="Edit MAO Percentage"
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000,
          },
          content: {
            maxWidth: '400px',
            margin: 'auto',
            borderRadius: '12px',
            padding: '20px',
          },
        }}
      >
        <ModalContent>
          <ModalTitle>Edit MAO Percentage</ModalTitle>

          {/* MAO Percentage Input */}
          <CostInput>
            <CostLabel htmlFor="maoPercentage">MAO Percentage (%):</CostLabel>
            <InputTooltipContainer>
              <InputInfoIcon aria-label="MAO Percentage Explanation" role="tooltip" tabIndex="0">
                <FiInfo />
              </InputInfoIcon>
              <InputTooltipBox role="tooltip" aria-hidden="true">
                <strong>MAO Percentage:</strong>
                <br />
                The percentage of the ARV used to calculate the Max Allowable Offer (MAO). For example, 70% means MAO = 70% of ARV - Repair Cost.
              </InputTooltipBox>
            </InputTooltipContainer>
            <CostField
              type="number"
              id="maoPercentage"
              value={maoPercentage}
              onChange={(e) => setMaoPercentage(Number(e.target.value))}
              placeholder="e.g., 70"
              min="1"
              max="100"
            />
          </CostInput>

          {/* Save Button */}
          <button
            onClick={handleSaveMaoPercentage}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Save
          </button>

          {/* Display Error Message if Any */}
          {maoError && <ErrorMessage>{maoError}</ErrorMessage>}
        </ModalContent>
      </Modal>

      {/* Sales Comparables Table Section */}
      <Section>
        <SectionHeader>
          <Title>Sales Comparables</Title>
          <ToggleButton
            onClick={() => setIsTableCollapsed(!isTableCollapsed)}
            collapsed={isTableCollapsed}
            aria-label={isTableCollapsed ? 'Show Sales Comparables' : 'Hide Sales Comparables'}
          >
            {isTableCollapsed ? 'Show' : 'Hide'}
            {isTableCollapsed ? <FiChevronDown /> : <FiChevronUp />}
          </ToggleButton>
        </SectionHeader>
        {!isTableCollapsed && (
          <Table>
            <thead>
              <tr>
                <Th>Address</Th>
                <Th>Price</Th>
                <Th>Sq Ft</Th>
                <Th>Beds/Baths</Th>
                <Th>Year Built</Th>
                <Th>Days on Market</Th>
                <Th>Distance (mi)</Th>
                <Th>Correlation</Th>
              </tr>
            </thead>
            <tbody>
              {comparables.map((comp) => (
                <Tr key={comp.id}>
                  <Td>{comp.formattedAddress}</Td>
                  <Td>${comp.price.toLocaleString()}</Td>
                  <Td>{comp.squareFootage}</Td>
                  <Td>
                    {comp.bedrooms}/{comp.bathrooms}
                  </Td>
                  <Td>{comp.yearBuilt}</Td>
                  <Td>{comp.daysOnMarket}</Td>
                  <Td>{comp.distance.toFixed(2)}</Td>
                  <Td>{(comp.correlation * 100).toFixed(1)}%</Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        )}
      </Section>
    </Container>
  );
};

// --------------------- PropTypes Definitions ---------------------

ValuationInsights.propTypes = {
  valuationData: PropTypes.shape({
    price: PropTypes.number.isRequired,
    priceRangeLow: PropTypes.number.isRequired,
    priceRangeHigh: PropTypes.number.isRequired,
    comparables: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        formattedAddress: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        squareFootage: PropTypes.number.isRequired,
        bedrooms: PropTypes.number.isRequired,
        bathrooms: PropTypes.number.isRequired,
        yearBuilt: PropTypes.number.isRequired,
        daysOnMarket: PropTypes.number.isRequired,
        distance: PropTypes.number.isRequired,
        correlation: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
  repairEstimates: PropTypes.shape({
    'Fix and Flip': PropTypes.shape({
      estimatedCost: PropTypes.shape({
        repairCost: PropTypes.number.isRequired,
        repairCostLow: PropTypes.number.isRequired,
        repairCostHigh: PropTypes.number.isRequired,
      }).isRequired,
    }).isRequired,
  }).isRequired,
};

// --------------------- Export Component ---------------------

export default ValuationInsights;