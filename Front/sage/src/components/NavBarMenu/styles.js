// styles.js
"use client";

import styled from "styled-components";

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

// --- Barra Lateral (Sidebar) ---
export const Sidebar = styled.aside`
  width: 250px;
  background-color: ${colors.primary};
  color: ${colors.white};
  padding: 24px;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    flex-wrap: wrap;
  }
`;

export const NavMenu = styled.nav`
  flex-grow: 1;

  @media (max-width: 768px) {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 10px;
  }
`;

export const NavItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 10px;
  border-radius: 8px;
  margin-bottom: 8px;
  text-decoration: none;
  color: ${colors.white};
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover,
  &.active {
    background-color: rgba(255, 255, 255, 0.1);
  }

  span {
    margin-left: 12px;
  }

  @media (max-width: 768px) {
    margin-bottom: 0;
    padding: 8px 12px;
    font-size: 0.85rem;
  }
`;

export const UserProfile = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #f0f0f0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: ${colors.primary};
  }

  .userInfo {
    margin-left: 12px;
    flex-grow: 1;
  }

  .logoutIcon {
    cursor: pointer;
  }

  @media (max-width: 768px) {
    width: 100%;
    margin-top: 10px;
    padding-top: 10px;
    border-top: none;
    justify-content: space-between;
  }
`;
