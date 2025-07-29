"use client";

import styled from "styled-components";

const colors = {
  primary: "#28a745",
  background: "#f8f9fa",
  white: "#ffffff",
  textPrimary: "#212529",
  textSecondary: "#6c757d",
  border: "#dee2e6",
  income: "#28a745",
  expense: "#dc3545",
  lightGreen: "rgba(40, 167, 69, 0.1)",
  lightRed: "rgba(220, 53, 69, 0.1)",
};

export const Container = styled.div`
  display: flex;
  background-color: ${colors.background};
  min-height: 100vh;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const MainContent = styled.main`
  flex-grow: 1;
  padding: 40px;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const Header = styled.header`
  h1 {
    font-size: 1.8rem;
    color: ${colors.textPrimary};
    margin: 0;
  }
  p {
    font-size: 0.9rem;
    color: ${colors.textSecondary};
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 1.5rem;
    }
    p {
      font-size: 0.8rem;
    }
  }
`;

export const SummaryContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-top: 30px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div`
  background-color: ${colors.white};
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: ${colors.textSecondary};
    font-size: 0.9rem;
  }

  .percentage {
    color: ${colors.income};
    font-weight: bold;
  }

  .value {
    font-size: 2.2rem;
    font-weight: bold;
    color: ${colors.textPrimary};
    margin: 10px 0;
  }

  .last-update {
    font-size: 0.8rem;
    color: ${colors.textSecondary};
  }

  @media (max-width: 768px) {
    padding: 16px;

    .value {
      font-size: 1.8rem;
    }

    .card-header {
      font-size: 0.8rem;
    }
  }
`;

export const ChartContainer = styled(Card)`
  margin-top: 30px;
  padding-bottom: 30px;

  span {
    color: ${colors.textPrimary};
  }

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 10px;

    .title-section h3 {
      margin: 0;
      font-size: 1.2rem;
      color: ${colors.textPrimary};
    }
    .title-section p {
      margin: 0;
      font-size: 0.8rem;
      color: ${colors.textSecondary};
    }

    .legend {
      display: flex;
      gap: 20px;
      font-size: 0.9rem;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .legend-color {
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }

    .legend-income {
      background-color: ${colors.income};
    }
    .legend-expense {
      background-color: ${colors.expense};
    }
  }

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const TransactionsContainer = styled(Card)`
  margin-top: 30px;

  .transactions-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 10px;
  }

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

export const TransactionTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 16px 8px;
    text-align: left;
    border-bottom: 1px solid ${colors.border};
    font-size: 0.9rem;
    color: ${colors.textPrimary};
  }

  th {
    color: ${colors.textSecondary};
    font-weight: 500;
  }

  @media (max-width: 768px) {
    th,
    td {
      padding: 12px 4px;
      font-size: 0.8rem;
    }
  }

  @media (max-width: 500px) {
    display: block;

    thead {
      display: none;
    }

    tbody {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    tr {
      display: block;
      background: ${colors.white};
      border-radius: 8px;
      padding: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    td {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
    }

    td::before {
      content: attr(data-label);
      font-weight: bold;
      margin-right: 8px;
      color: ${colors.textSecondary};
    }
  }
`;

export const TransactionRow = styled.tr`
  .value-income {
    color: ${colors.income};
    font-weight: bold;
  }
  .value-expense {
    color: ${colors.expense};
    font-weight: bold;
  }
`;

export const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  color: ${(props) =>
    props.type === "income" ? colors.income : colors.expense};
  background-color: ${(props) =>
    props.type === "income" ? colors.lightGreen : colors.lightRed};
`;
