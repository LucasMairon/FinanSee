// styles.js
"use client";

import styled, { css } from "styled-components";

// Cores baseadas na imagem
const colors = {
  primary: "#28a745", // Verde principal
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
  background-color: #ffffff;
  flex: 1; /* Alterado de width: 100%; para ocupar o espaço restante */
  max-width: 900px;
  border-radius: 12px;
  border: 1px solid #e5e7eb; /* Borda sutil */
  padding: 2.5rem;
  margin: 2rem; /* Adicionado um espaçamento para não colar na lateral */
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 1rem;
    max-width: 100%;
  }
`;

// Cabeçalho principal da página
export const Header = styled.header`
  margin-bottom: 2rem;
`;

export const Title = styled.h1`
  font-size: 1.875rem; /* 30px */
  font-weight: 700;
  margin: 0;
  color: #111827;
`;

export const Subtitle = styled.p`
  font-size: 1rem; /* 16px */
  color: #6b7280; /* Cinza médio */
  margin-top: 0.5rem;
`;

// Seção do cabeçalho do perfil (avatar, nome, botões)
export const ProfileHeader = styled.section`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding-bottom: 1.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

export const Avatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: #34b361; /* Verde */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const Initials = styled.span`
  font-size: 2rem;
  font-weight: 600;
  color: #ffffff;
`;

export const UserInfo = styled.div`
  flex-grow: 1;
`;

export const UserName = styled.h2`
  font-size: 1.5rem; /* 24px */
  font-weight: 600;
  margin: 0;
  color: #111827;
`;

export const Greeting = styled.p`
  font-size: 1rem;
  color: #6b7280;
  margin: 0.25rem 0 0 0;
`;

export const Actions = styled.div`
  display: flex;
  gap: 0.75rem; /* 12px */

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

// Estilização dos botões com variantes
const buttonVariants = {
  default: css`
    background-color: #ffffff;
    color: #374151;
    border: 1px solid #d1d5db;
    &:hover {
      background-color: #f9fafb;
    }
  `,
  primary: css`
    background-color: #34b361;
    color: #ffffff;
    border: 1px solid #34b361;
    &:hover {
      background-color: #2cb989;
    }
  `,
  danger: css`
    background-color: #ffffff;
    color: #ef4444; /* Vermelho */
    border: 1px solid #ef4444;
    &:hover {
      background-color: #fef2f2; /* Fundo vermelho bem claro */
    }
  `,
};

export const Button = styled.button`
  padding: 0.625rem 1rem; /* 10px 16px */
  font-size: 0.875rem; /* 14px */
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, border-color 0.2s ease-in-out;

  ${({ variant = "default" }) => buttonVariants[variant]}
`;

// Seção com os detalhes do perfil
export const ProfileDetails = styled.section`
  display: flex;
  flex-direction: column;
`;

export const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 0; /* 20px 0 */
  border-bottom: 1px solid #e5e7eb;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:first-child {
    padding-top: 0;
  }
`;

export const DetailInfo = styled.div``;

export const DetailLabel = styled.p`
  font-size: 0.875rem; /* 14px */
  font-weight: 500;
  color: #6b7280;
  margin: 0;
`;

export const DetailValue = styled.p`
  font-size: 1rem; /* 16px */
  color: #111827;
  font-weight: 500;
  margin: 0.25rem 0 0 0;
`;
