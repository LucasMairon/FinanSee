"use client";
import styled, { css } from "styled-components";

// --- ESTILOS DO LAYOUT DA PÁGINA ---
export const PageWrapper = styled.div`
  display: flex;
  background-color: #f9fafb; /* Cor de fundo para toda a área visível */
  min-height: 100vh;
`;

// Container principal para o conteúdo da página (à direita do menu)
// O nome foi mantido como 'Container' para corresponder à sua importação.
export const Container = styled.main`
  flex-grow: 1; /* Garante que o conteúdo ocupe o espaço restante */
  padding: 2rem;
  font-family: "Inter", sans-serif;
  color: #374151; /* gray-700 */
`;

// --- ESTILOS DO CONTEÚDO DA PÁGINA DE DESPESAS ---

// Mapeamento de cores para as categorias
const categoryColors = {
  Lazer: "#E0F2FE",
  Outros: "#F3E8FF",
  Alimentação: "#FEF3C7",
  Transporte: "#E0E7FF",
  Moradia: "#D1FAE5",
  Saúde: "#FFE4E6",
  Educação: "#FEE2E2",
  default: "#F3F4F6",
};

const categoryTextColors = {
  Lazer: "#0284C7",
  Outros: "#9333EA",
  Alimentação: "#D97706",
  Transporte: "#4F46E5",
  Moradia: "#059669",
  Saúde: "#DB2777",
  Educação: "#DC2626",
  default: "#4B5563",
};

// Cabeçalho com Título e Botões de Ação
export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
`;

export const Subtitle = styled.p`
  font-size: 0.9rem;
  color: #6b7280;
  margin-top: 0.25rem;
`;

export const Actions = styled.div`
  display: flex;
  gap: 1rem;
`;

// Botões
export const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  ${(props) =>
    props.primary
      ? css`
          background-color: #34b361;
          color: white;
          border: none;
          &:hover {
            background-color: #059669;
          }
        `
      : css`
          background-color: white;
          color: #374151;
          border: 1px solid #d1d5db;
          &:hover {
            background-color: #f9fafb;
          }
        `}
`;

// Container para os cartões de resumo
export const SummaryContainer = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

// Estilo para cada cartão individual
export const Card = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

export const CardTitle = styled.h3`
  font-size: 0.8rem;
  font-weight: 600;
  color: #6b7280;
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CardValue = styled.p`
  font-size: 1.8rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem 0;
`;

export const CardFooter = styled.p`
  font-size: 0.8rem;
  color: #9ca3af;
  margin: 0;
`;

export const CardTrendUp = styled.span`
  color: #34b361;
  font-size: 0.75rem;
`;

// Container genérico para as seções de Gráfico e Tabela
export const SectionContainer = styled.section`
  background-color: white;
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

export const SectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  color: #111827;
  margin: 0;
`;

export const FilterActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

// Estilos para inputs e selects
export const Input = styled.input`
  padding: 0.6rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: white;
  font-size: 0.9rem;
  color: #282828;
  &:focus {
    outline: none;
    border-color: #34b361;
    box-shadow: 0 0 0 2px #bfdbfe;
  }
`;

export const Select = styled.select`
  padding: 0.6rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: white;
  font-size: 0.9rem;
  color: #282828;
  cursor: pointer;
  &:focus {
    outline: none;
    border-color: #34b361;
  }

  option {
    color: #282828;
  }
`;

// Estilos para o gráfico
export const ChartWrapper = styled.div`
  width: 100%;
  height: 200px;
`;

export const Legend = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #6b7280;
`;

export const LegendColorBox = styled.div`
  width: 12px;
  height: 12px;
  background-color: #ff4f4f;
  border-radius: 6px;
`;

// Estilos para a tabela
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
    border-bottom: 1px solid #e5e7eb;
    vertical-align: middle;
  }

  th {
    font-size: 0.8rem;
    font-weight: 600;
    color: #6b7280;
    text-transform: uppercase;
  }

  td {
    font-size: 0.9rem;
    color: #374151;
  }

  tbody tr:hover {
    background-color: #f9fafb;
  }
`;

// Badge de Status (Pago, A pagar)
export const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-weight: 500;
  font-size: 0.8rem;

  ${({ status }) =>
    status === "Pago" &&
    css`
      background-color: #d1fae5;
      color: #065f46;
    `}

  ${({ status }) =>
    status === "A pagar" &&
    css`
      background-color: #fee2e2;
      color: #991b1b;
    `}
`;

// Tag de Categoria
export const CategoryTag = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.8rem;
  background-color: ${({ category }) =>
    categoryColors[category] || categoryColors["default"]};
  color: ${({ category }) =>
    categoryTextColors[category] || categoryTextColors["default"]};
`;
