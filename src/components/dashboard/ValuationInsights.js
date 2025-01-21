// src/components/dashboard/ValuationInsights.js

import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { FiInfo, FiEdit, FiChevronUp, FiChevronDown, FiCheck } from 'react-icons/fi';
import Modal from 'react-modal';

// --------------------- Styled Components ---------------------

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  padding: 20px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
`;

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

const Card = styled.div`
  background: ${(props) => props.bgColor || '#f8f9fa'};
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  flex: 1 1 220px;
  min-width: 220px;
  margin-bottom: 20px;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const EstimatedProfitCard = styled(Card)`
  box-shadow: ${(props) =>
    props.profit >= 0
      ? '0 0 15px rgba(46, 125, 50, 0.6)' // Green glow
      : '0 0 15px rgba(211, 47, 47, 0.6)'}; // Red glow
  transition: box-shadow 0.3s ease;
`;

const TitleWrapper = styled.div`
  position: relative;
  padding: 10px 0;
`;

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

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0 10px 0;
`;

const Title = styled.h3`
  font-size: 18px;
  color: #555555;
  margin: 0;
`;

// Tooltip
const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
  margin-top: 10px;
`;

const InfoIconStyled = styled(FiInfo)`
  color: #007bff;
  cursor: pointer;
  transition: color 0.3s ease;
  font-size: 18px;
`;

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
  top: 125%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.3s ease, visibility 0.3s ease;

  &::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    border-width: 6px;
    border-style: solid;
    border-color: #333333 transparent transparent transparent;
  }

  ${TooltipContainer}:hover & {
    visibility: visible;
    opacity: 1;
  }

  @media (max-width: 768px) {
    width: 180px;
    padding: 8px;
  }
`;

// ARV/Profit text
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
  color: ${(props) => (props.profit >= 0 ? '#2e7d32' : '#d32f2f')};
  margin: 10px 0;
  font-weight: bold;
  transition: color 0.3s ease;
`;

const ProfitRange = styled.p`
  font-size: 14px;
  color: #777777;
  margin-top: 8px;
`;

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
  &:focus {
    outline: none;
  }

  svg {
    margin-left: 5px;
    transition: transform 0.3s ease;
    transform: ${(props) => (props.collapsed ? 'rotate(0deg)' : 'rotate(180deg)')};
  }
`;

// Modals
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

const ErrorMessage = styled.p`
  color: #d32f2f;
  font-size: 14px;
  margin-top: 8px;
`;

// Table section
const Section = styled.section`
  width: 100%;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
`;

// KEY: minimal visual approach: subtle left border if selected
const Tr = styled.tr`
  border-left: ${(props) =>
    props.isSelected ? '4px solid #007bff' : '4px solid transparent'};

  &:hover {
    background-color: #fafafa;
  }
`;

const Th = styled.th`
  text-align: left;
  padding: 12px;
  background-color: #f0f0f0;
  color: #333333;
  font-weight: 500;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #e0e0e0;
  color: #555555;
  vertical-align: middle;
`;


// A small container to hold Address & optional check icon
const AddressContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px; /* space between check icon and text */
`;

const CheckIconStyled = styled(FiCheck)`
  color: #007bff;
  font-size: 16px;
  flex-shrink: 0;
`;

// --------------------- Main Component ---------------------

Modal.setAppElement('#root');

const ValuationInsights = ({ valuationData, repairEstimates, property }) => {
  // Basic toggles
  const [isTableCollapsed, setIsTableCollapsed] = useState(false);
  const [editComparables, setEditComparables] = useState(false);

  // Additional cost states
  const [closingCosts, setClosingCosts] = useState(0);
  const [sellingCosts, setSellingCosts] = useState(0);
  const [holdingPeriod, setHoldingPeriod] = useState(6);
  const [monthlyHoldingCost, setMonthlyHoldingCost] = useState(500);
  const [totalHoldingCosts, setTotalHoldingCosts] = useState(
    holdingPeriod * monthlyHoldingCost
  );
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Repair cost states
  const [repairCost, setRepairCost] = useState(
    repairEstimates?.['Fix and Flip']?.estimatedCost?.repairCost || 0
  );
  const { repairCostLow, repairCostHigh } =
    repairEstimates?.['Fix and Flip']?.estimatedCost || {};
  const [isRepairModalOpen, setIsRepairModalOpen] = useState(false);
  const [repairError, setRepairError] = useState('');

  // MAO states
  const [maoPercentage, setMaoPercentage] = useState(70);
  const [isMaoModalOpen, setIsMaoModalOpen] = useState(false);
  const [maoError, setMaoError] = useState('');

  // Profit data
  const [profitData, setProfitData] = useState({ profit: 0 });

  // Destructure from props
  const { price, priceRangeLow, priceRangeHigh, comparables } = valuationData;
  const subjectSqFt = property?.squareFootage || 0;

  // Default: all comps selected
  const [selectedCompIds, setSelectedCompIds] = useState(
    comparables.map((comp) => comp.id)
  );

  // Toggle comp selection
  const handleCompToggle = (compId) => {
    setSelectedCompIds((prev) =>
      prev.includes(compId)
        ? prev.filter((id) => id !== compId)
        : [...prev, compId]
    );
  };

  // Weighted ARV Calculation
  const dynamicArv = useMemo(() => {
    if (selectedCompIds.length === 0) return 0;
    if (selectedCompIds.length === comparables.length) return price;

    let totalWeightedPPSF = 0;
    let totalCorrelation = 0;
    const selectedComps = comparables.filter((c) => selectedCompIds.includes(c.id));

    selectedComps.forEach((c) => {
      if (c.squareFootage && c.price && c.correlation) {
        totalWeightedPPSF += (c.price / c.squareFootage) * c.correlation;
        totalCorrelation += c.correlation;
      }
    });

    if (totalCorrelation === 0) return 0;
    const weightedPPSF = totalWeightedPPSF / totalCorrelation;
    return Math.round(weightedPPSF * subjectSqFt);
  }, [selectedCompIds, comparables, price, subjectSqFt]);

  // Additional Costs & Profit
  useEffect(() => {
    setClosingCosts(Math.round(price * 0.03));
    setSellingCosts(Math.round(price * 0.05));
  }, [price]);

  useEffect(() => {
    setTotalHoldingCosts(holdingPeriod * monthlyHoldingCost);
  }, [holdingPeriod, monthlyHoldingCost]);

  useEffect(() => {
    const calculateProfit = () => {
      const estimatedMao = Math.round(dynamicArv * (maoPercentage / 100) - repairCost);
      const totalCosts =
        repairCost +
        (estimatedMao > 0 ? estimatedMao : 0) +
        closingCosts +
        sellingCosts +
        totalHoldingCosts;
      return { profit: dynamicArv - totalCosts };
    };
    setProfitData(calculateProfit());
    setError('');
  }, [
    dynamicArv,
    repairCost,
    maoPercentage,
    closingCosts,
    sellingCosts,
    totalHoldingCosts,
  ]);

  // MAO Calculation
  const maoDataMemo = useMemo(() => {
    const maoValue = Math.round(price * (maoPercentage / 100) - repairCost);
    return { value: maoValue };
  }, [price, maoPercentage, repairCost]);

  const maoDataLowMemo = useMemo(
    () => Math.round(maoDataMemo.value * 0.9),
    [maoDataMemo.value]
  );
  const maoDataHighMemo = useMemo(
    () => Math.round(maoDataMemo.value * 1.1),
    [maoDataMemo.value]
  );

  // Modals
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSave = () => {
    if (
      closingCosts < 0 ||
      sellingCosts < 0 ||
      holdingPeriod < 0 ||
      monthlyHoldingCost < 0
    ) {
      setError('Please enter valid non-negative numbers.');
      return;
    }
    setError('');
    closeModal();
  };

  // Repair Estimate
  const openRepairModal = () => setIsRepairModalOpen(true);
  const closeRepairModal = () => setIsRepairModalOpen(false);

  const handleSaveRepairEstimate = () => {
    if (repairCost < 0) {
      setRepairError('Please enter a valid non-negative number.');
      return;
    }
    setRepairError('');
    closeRepairModal();
  };

  // MAO
  const openMaoModal = () => setIsMaoModalOpen(true);
  const closeMaoModal = () => setIsMaoModalOpen(false);

  const handleSaveMaoPercentage = () => {
    if (maoPercentage <= 0 || maoPercentage > 100) {
      setMaoError('Please enter a valid percentage between 1 and 100.');
      return;
    }
    setMaoError('');
    closeMaoModal();
  };

  // --------------------- Render ---------------------
  return (
    <Container>
      <CardsWrapper>
        {/* After Repair Value Card */}
        <Card>
          <TitleWrapper>
            <Title>After Repair Value</Title>
          </TitleWrapper>

          {selectedCompIds.length === 0 ? (
            <ARVValue style={{ color: 'red' }}>$0 (No Comps Selected)</ARVValue>
          ) : (
            <ARVValue>${dynamicArv.toLocaleString()}</ARVValue>
          )}

          <Range>
            Range: ${priceRangeLow.toLocaleString()} - ${priceRangeHigh.toLocaleString()}
          </Range>

          <TooltipContainer>
            <InfoIconStyled tabIndex="0">
              <FiInfo />
            </InfoIconStyled>
            <Tooltip>
              <strong>After Repair Value:</strong>
              <br />
              Calculated from selected comps, weighted by correlation.
            </Tooltip>
          </TooltipContainer>
        </Card>

        {/* Repair Estimate Card */}
        <Card>
          <TitleWrapper>
            <Title>Repair Estimate</Title>
            <EditIconStyled onClick={openRepairModal}>
              <FiEdit />
            </EditIconStyled>
          </TitleWrapper>
          <ARVValue>${repairCost.toLocaleString()}</ARVValue>
          <Range>
            ${repairCostLow?.toLocaleString()} - ${repairCostHigh?.toLocaleString()}
          </Range>
          <TooltipContainer>
            <InfoIconStyled tabIndex="0">
              <FiInfo />
            </InfoIconStyled>
            <Tooltip>
              <strong>Repair Estimate:</strong>
              <br />
              Cost to fix and renovate the property.
            </Tooltip>
          </TooltipContainer>
        </Card>

        {/* Max Allowable Offer Card */}
        <Card>
          <TitleWrapper>
            <Title>Max Allowable Offer</Title>
            <EditIconStyled onClick={openMaoModal}>
              <FiEdit />
            </EditIconStyled>
          </TitleWrapper>
          <ARVValue>${maoDataMemo.value.toLocaleString()}</ARVValue>
          <Range>
            ${maoDataLowMemo.toLocaleString()} - ${maoDataHighMemo.toLocaleString()}
          </Range>
          <TooltipContainer>
            <InfoIconStyled tabIndex="0">
              <FiInfo />
            </InfoIconStyled>
            <Tooltip>
              <strong>MAO Calculation:</strong>
              <br />
              {maoPercentage}% of ARV - Repair Cost.
            </Tooltip>
          </TooltipContainer>
        </Card>

        {/* Estimated Profit Card */}
        <EstimatedProfitCard profit={profitData.profit}>
          <TitleWrapper>
            <Title>Estimated Profit</Title>
            <EditIconStyled onClick={openModal}>
              <FiEdit />
            </EditIconStyled>
          </TitleWrapper>
          <ProfitValue profit={profitData.profit}>
            ${profitData.profit.toLocaleString()}
          </ProfitValue>
          <ProfitRange>Estimated Profit</ProfitRange>
          <TooltipContainer>
            <InfoIconStyled tabIndex="0">
              <FiInfo />
            </InfoIconStyled>
            <Tooltip>
              <strong>Estimated Profit:</strong>
              <br />
              ARV minus repair, closing, holding, and MAO costs.
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

          {/* Closing Costs */}
          <CostInput>
            <CostLabel htmlFor="closingCosts">Closing Costs ($):</CostLabel>
            <CostField
              type="number"
              id="closingCosts"
              value={closingCosts}
              onChange={(e) => setClosingCosts(Number(e.target.value))}
              placeholder="Closing Costs"
              min="0"
            />
          </CostInput>

          {/* Selling Costs */}
          <CostInput>
            <CostLabel htmlFor="sellingCosts">Selling Costs ($):</CostLabel>
            <CostField
              type="number"
              id="sellingCosts"
              value={sellingCosts}
              onChange={(e) => setSellingCosts(Number(e.target.value))}
              placeholder="Selling Costs"
              min="0"
            />
          </CostInput>

          {/* Holding Period */}
          <CostInput>
            <CostLabel htmlFor="holdingPeriod">Holding Period (months):</CostLabel>
            <CostField
              type="number"
              id="holdingPeriod"
              value={holdingPeriod}
              onChange={(e) => setHoldingPeriod(Number(e.target.value))}
              placeholder="e.g., 6"
              min="0"
            />
          </CostInput>

          {/* Monthly Holding Cost */}
          <CostInput>
            <CostLabel htmlFor="monthlyHoldingCost">Monthly Holding Cost ($):</CostLabel>
            <CostField
              type="number"
              id="monthlyHoldingCost"
              value={monthlyHoldingCost}
              onChange={(e) => setMonthlyHoldingCost(Number(e.target.value))}
              placeholder="500"
              min="0"
            />
          </CostInput>

          <button
            onClick={handleSave}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Save
          </button>

          {error && <ErrorMessage>{error}</ErrorMessage>}
        </ModalContent>
      </Modal>

      {/* Modal for Repair Estimates */}
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
          <CostInput>
            <CostLabel htmlFor="repairCost">Repair Cost ($):</CostLabel>
            <CostField
              type="number"
              id="repairCost"
              value={repairCost}
              onChange={(e) => setRepairCost(Number(e.target.value))}
              placeholder="Enter repair cost"
              min="0"
            />
          </CostInput>

          <button
            onClick={handleSaveRepairEstimate}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Save
          </button>
          {repairError && <ErrorMessage>{repairError}</ErrorMessage>}
        </ModalContent>
      </Modal>

      {/* Modal for MAO Percentage */}
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
          <CostInput>
            <CostLabel htmlFor="maoPercentage">MAO Percentage (%):</CostLabel>
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

          <button
            onClick={handleSaveMaoPercentage}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Save
          </button>
          {maoError && <ErrorMessage>{maoError}</ErrorMessage>}
        </ModalContent>
      </Modal>

      {/* Sales Comparables Table */}
      <Section>
        <SectionHeader>
          <Title>Sales Comparables</Title>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button
              onClick={() => setEditComparables(!editComparables)}
              style={{
                backgroundColor: editComparables ? '#d9534f' : '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                padding: '6px 12px',
                cursor: 'pointer',
              }}
            >
              {editComparables ? 'Done' : 'Edit Comparables'}
            </button>

            <ToggleButton
              onClick={() => setIsTableCollapsed(!isTableCollapsed)}
              collapsed={isTableCollapsed}
            >
              {isTableCollapsed ? 'Show' : 'Hide'}
              {isTableCollapsed ? <FiChevronDown /> : <FiChevronUp />}
            </ToggleButton>
          </div>
        </SectionHeader>

        {!isTableCollapsed && (
          <Table>
            <thead>
              <tr>
                {/* Only show "Select" column if editing */}
                {editComparables && <Th>Select</Th>}
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
              {comparables.map((comp) => {
                const isSelected = selectedCompIds.includes(comp.id);
                return (
                  <Tr key={comp.id} isSelected={isSelected}>
                    {editComparables && (
                      <Td>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleCompToggle(comp.id)}
                        />
                      </Td>
                    )}
                    <Td>
                      <AddressContainer>
                        {/* If selected, show a minimal check icon */}
                        {isSelected && !editComparables && (
                          <CheckIconStyled />
                        )}
                        {comp.formattedAddress}
                      </AddressContainer>
                    </Td>
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
                );
              })}
            </tbody>
          </Table>
        )}
      </Section>
    </Container>
  );
};

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
  property: PropTypes.shape({
    squareFootage: PropTypes.number,
  }).isRequired,
};

export default ValuationInsights;
