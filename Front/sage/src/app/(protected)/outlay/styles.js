import styled, { css, createGlobalStyle } from "styled-components";

const colors = {
  background: "#f9fafb",
  textPrimary: "#111827",
  textSecondary: "#374151",
  textMuted: "#6b7280",
  textLight: "#9ca3af",
  border: "#e5e7eb",
  borderLight: "#d1d5db",
  white: "#ffffff",
  primary: "#34b361",
  primaryHover: "#059669",
  blueFocus: "#bfdbfe",
};

export const PageWrapper = styled.div`
  display: flex;
  background-color: ${colors.background};
  min-height: 100vh;
  font-family: "Inter", sans-serif;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

export const Container = styled.main`
  flex-grow: 1;
  padding: 2rem;
  color: ${colors.textSecondary};

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 0.9rem;
  color: ${colors.textMuted};
  margin-top: 0.25rem;
`;

export const Actions = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;

export const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  background-color: ${colors.primary};
  color: ${colors.white};
  border: none;
  white-space: nowrap;

  &:hover {
    background-color: ${colors.primaryHover};
  }
`;

export const ButtonDownload = styled(Button)`
  background-color: ${colors.white};
  color: ${colors.textSecondary};
  border: 1px solid ${colors.borderLight};
  padding: 0.65rem;

  &:hover {
    background-color: ${colors.background};
  }
`;

export const SummaryContainer = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

export const Card = styled.div`
  background-color: ${colors.white};
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid ${colors.border};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

export const CardTitle = styled.h3`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${colors.textMuted};
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CardValue = styled.p`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0 0 0.5rem 0;

  @media (max-width: 768px) {
    font-size: 1.6rem;
  }
`;

export const CardFooter = styled.p`
  font-size: 0.8rem;
  color: ${colors.textLight};
  margin: 0;
`;

export const SectionContainer = styled.section`
  background-color: ${colors.white};
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid ${colors.border};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0;
`;

export const FilterActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
    align-items: stretch;
  }
`;

export const Input = styled.input`
  padding: 0.6rem 1rem;
  border: 1px solid ${colors.borderLight};
  border-radius: 0.5rem;
  background-color: ${colors.white};
  font-size: 0.9rem;
  color: #282828;
  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 2px ${colors.blueFocus};
  }
`;

export const Select = styled.select`
  padding: 0.6rem 1rem;
  border: 1px solid ${colors.borderLight};
  border-radius: 0.5rem;
  background-color: ${colors.white};
  font-size: 0.9rem;
  color: #282828;
  cursor: pointer;
  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }
`;

export const ChartWrapper = styled.div`
  width: 100%;
  height: 250px;
`;

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;

  th,
  td {
    padding: 1rem;
    border-bottom: 1px solid ${colors.border};
    vertical-align: middle;
  }

  th {
    font-size: 0.8rem;
    font-weight: 600;
    color: ${colors.textMuted};
    text-transform: uppercase;
  }

  td {
    font-size: 0.9rem;
    color: ${colors.textSecondary};
  }

  tbody tr:hover {
    background-color: ${colors.background};
  }

  @media (max-width: 768px) {
    thead {
      display: none;
    }

    table,
    tbody,
    tr,
    td {
      display: block;
      width: 100%;
    }

    tr {
      margin-bottom: 1rem;
      border: 1px solid ${colors.border};
      border-radius: 0.5rem;
      padding: 0.5rem;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
    }

    td {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0.5rem;
      text-align: right;
      border-bottom: 1px solid ${colors.background};
    }

    tr td:last-child {
      border-bottom: none;
    }

    td::before {
      content: attr(data-label);
      font-weight: 600;
      color: ${colors.textMuted};
      text-align: left;
      padding-right: 1rem;
    }
  }
`;

export const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-weight: 500;
  font-size: 0.8rem;
  white-space: nowrap;

  ${({ status }) =>
    status === "P" &&
    css`
      background-color: #d1fae5;
      color: #065f46;
    `}
  ${({ status }) =>
    status === "AP" &&
    css`
      background-color: #fee2e2;
      color: #991b1b;
    `}
`;

export const CategoryTag = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.8rem;
  background-color: #f3f4f6;
  color: #4b5563;
`;

// Estilo injetado globalmente para o tooltip do gráfico
export const GlobalTooltipStyle = createGlobalStyle`
  .custom-tooltip {
    background-color: #FF4F4F;
    padding: 10px 15px;
    border-radius: 8px;
    color: white;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    text-align: left;
    opacity: 0.9;
  }

  .custom-tooltip .label-date {
    margin: 0;
    font-size: 0.9rem;
    font-weight: 600;
  }

  .custom-tooltip .label-value {
    margin: 4px 0 0 0;
    font-size: 0.85rem;
    font-weight: bold;
  }
`;

export const ActionIcon = styled.td`
  padding: 1rem;
  border-bottom: 1px solid ${colors.border};
  vertical-align: middle;
  cursor: pointer;
`;
