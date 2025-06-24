import styled, { createGlobalStyle } from "styled-components";
import {
  backgroundDark,
  backgroundWhite,
  greenClear,
} from "../../assets/colors";

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Inter', sans-serif; // Sugestão de fonte limpa
    background-color: #f8f9fa;
    color: #343a40;
  }
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
`;

export const DashboardContainer = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
`;

export const SidebarContainer = styled.aside`
  width: 280px;
  background-color: #1a7e6b;
  color: white;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  height: 100vh;
  box-sizing: border-box;
`;

export const Logo = styled.h1`
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0 0 2rem 0;
  display: flex;
  align-items: center;
`;

export const SearchBar = styled.div`
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;

  input {
    background: transparent;
    border: none;
    color: white;
    outline: none;
    width: 100%;
    &::placeholder {
      color: rgba(255, 255, 255, 0.8);
    }
  }
`;

export const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
`;

export const NavItem = styled.li`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  background-color: ${(props) =>
    props.active ? "rgba(255, 255, 255, 0.2)" : "transparent"};

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

export const ThemeToggle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  margin-top: 2rem;

  .switch {
    position: relative;
    display: inline-block;
    width: 40px;
    height: 20px;

    input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.2);
      transition: 0.4s;
      border-radius: 34px;

      &:before {
        position: absolute;
        content: "";
        height: 14px;
        width: 14px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: 0.4s;
        border-radius: 50%;
      }
    }

    input:checked + .slider {
      background-color: #80c572;
    }

    input:checked + .slider:before {
      transform: translateX(20px);
    }
  }
`;

export const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  margin-top: 1rem;

  .avatar {
    background-color: #e67e22;
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-weight: bold;
  }

  .user-info {
    flex-grow: 1;
  }
`;

export const MainContentContainer = styled.main`
  flex: 1;
  padding: 2rem 3rem;
  overflow-y: auto;
`;

export const Header = styled.header`
  margin-bottom: 2rem;
  h2 {
    font-size: 2rem;
    margin: 0;
  }
  p {
    color: #6c757d;
    margin: 0.25rem 0 0;
  }
`;

export const SummaryCardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

export const Card = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

export const CardTitle = styled.h3`
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
  margin: 0 0 1rem 0;
`;

export const CardValue = styled.p`
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
`;

export const CardFooter = styled.div`
  font-size: 0.8rem;
  color: #6c757d;
  margin-top: 1rem;
  .change {
    color: ${(props) => (props.positive ? "#28a745" : "#dc3545")};
    font-weight: 500;
    margin-right: 0.5rem;
  }
`;

export const ChartContainer = styled(Card)`
  margin-bottom: 2rem;

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .chart-info h3 {
    margin: 0;
  }
  .chart-info p {
    margin: 0.25rem 0 0;
    font-size: 0.8rem;
    color: #6c757d;
  }

  .chart-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .legend {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }
  .legend-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
  }
  .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }

  .chart-placeholder {
    height: 250px;
    display: grid;
    place-items: center;
    background-color: #f8f9fa;
    border-radius: 8px;
    color: #6c757d;
    font-style: italic;
  }
`;

export const TransactionsContainer = styled(Card)`
  .transactions-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  .transactions-info h3 {
    margin: 0;
  }
  .transactions-info p {
    margin: 0.25rem 0 0;
    font-size: 0.8rem;
    color: #6c757d;
  }

  .transactions-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .transaction-search {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border: 1px solid #dee2e6;
    border-radius: 8px;
    input {
      border: none;
      outline: none;
    }
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  th,
  td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #f1f1f1;
    vertical-align: middle;
  }

  th {
    font-size: 0.8rem;
    font-weight: 500;
    color: #6c757d;
    text-transform: uppercase;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }
`;

export const TransactionRow = styled.tr`
  .name-cell {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-weight: 500;
  }

  .icon-wrapper {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background-color: ${(props) =>
      props.isIncome ? "rgba(230, 126, 34, 0.1)" : "rgba(231, 76, 60, 0.1)"};
    color: ${(props) => (props.isIncome ? "#e67e22" : "#e74c3c")};
  }

  .value {
    font-weight: 500;
    color: ${(props) => (props.isIncome ? "#28a745" : "#dc3545")};
  }
`;

export const StatusPill = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  background-color: ${(props) =>
    props.type === "Receita"
      ? "rgba(40, 167, 69, 0.1)"
      : "rgba(220, 53, 69, 0.1)"};
  color: ${(props) => (props.type === "Receita" ? "#28a745" : "#dc3545")};
`;

export const Container = styled.div`
  background-color: ${backgroundWhite};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 40px;
`;

export const Content = styled.div`
  flex: 1;
  align-self: center;
  max-width: 500px;
  width: 100%;
  flex-direction: column;
  display: flex;
  gap: 10px;
  margin-top: 50px;
`;

export const Title = styled.a`
  color: ${backgroundDark};
  font-size: 25px;
  font-family: var(--font-roboto);
  font-weight: 600;
  text-align: center;
`;
