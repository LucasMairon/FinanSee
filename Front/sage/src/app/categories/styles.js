"use client";

import styled from "styled-components";

const colors = {
  primaryGreen: "#28a745",
  background: "#f8f9fa",
  white: "#ffffff",
  textPrimary: "#212529",
  textSecondary: "#6c757d",
  border: "#dee2e6",
};

export const PageContainer = styled.div`
  display: flex;
  background-color: ${colors.background};
  min-height: 100vh;

  /* --- Adição para Responsividade --- */
  @media (max-width: 768px) {
    /* Em telas pequenas, o menu vai para cima e o conteúdo para baixo */
    flex-direction: column;
  }
`;

export const MainContent = styled.main`
  flex-grow: 1;
  padding: 40px;

  /* --- Adição para Responsividade --- */
  @media (max-width: 768px) {
    /* Reduz o espaçamento interno em telas menores */
    padding: 20px;
  }
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  flex-wrap: wrap; // Permite que os itens quebrem a linha se não couberem
  gap: 20px;

  /* --- Adição para Responsividade --- */
  @media (max-width: 768px) {
    /* Empilha o título e as ações verticalmente */
    flex-direction: column;
    /* Alinha tudo à esquerda */
    align-items: flex-start;
    gap: 24px;
    margin-bottom: 30px;
  }
`;

export const HeaderInfo = styled.div``;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0;

  /* --- Adição para Responsividade --- */
  @media (max-width: 768px) {
    font-size: 1.75rem; /* Título um pouco menor no mobile */
  }
`;

export const Subtitle = styled.p`
  font-size: 1rem;
  color: ${colors.textSecondary};
  margin: 4px 0 0;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  /* --- Adição para Responsividade --- */
  @media (max-width: 768px) {
    /* Faz a busca e o botão ocuparem toda a largura e se empilharem */
    flex-direction: column;
    width: 100%;
    align-items: stretch; /* Faz os itens internos esticarem */
  }
`;

export const SearchInput = styled.input`
  padding: 10px 15px;
  border: 1px solid ${colors.border};
  border-radius: 8px;
  font-size: 0.9rem;
  min-width: 220px;
  background-color: ${colors.primaryGreen};
  color: #ffffff;
  &:focus {
    outline: none;
    border-color: ${colors.primaryGreen};
    box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.2);
  }
  &::placeholder {
    color: #ffffff;
  }

  @media (max-width: 768px) {
    min-width: auto; /* Remove a largura mínima no mobile */
    width: 100%;
  }
`;

export const NewCategoryButton = styled.button`
  background-color: ${colors.primaryGreen};
  color: ${colors.white};
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap; // Evita que o texto quebre

  &:hover {
    background-color: #218838;
  }

  /* --- Adição para Responsividade --- */
  @media (max-width: 768px) {
    width: 100%;
  }
`;

export const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;

  /* --- Adição para Responsividade --- */
  @media (max-width: 768px) {
    /* Força uma única coluna no mobile para melhor leitura */
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const CategoryCard = styled.div`
  background-color: ${colors.white};
  border: 1px solid ${colors.border};
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: relative;
  display: flex;
  flex-direction: column;
`;

export const CardActions = styled.div`
  position: absolute;
  top: 24px;
  right: 24px;
  display: flex;
  gap: 12px;
  color: ${colors.textSecondary};
`;

export const IconButton = styled.button`
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  color: inherit;

  &:hover {
    color: ${colors.textPrimary};
  }
`;

export const CardHeader = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${colors.textSecondary};
  text-transform: uppercase;
  margin-bottom: 8px;
`;

export const CardTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0 0 12px;
`;

export const CardDescription = styled.p`
  font-size: 0.9rem;
  color: ${colors.textSecondary};
  line-height: 1.5;
  margin: 0;
`;
