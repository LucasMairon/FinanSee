import styled from "styled-components";

import { backgroundWhite } from "../assets/colors";

export const Container = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
`;

export const RightPanel = styled.div`
  flex: 1;
  background-color: ${backgroundWhite};
  display: flex;
  flex-direction: column;
  padding: 1rem;
`;

export const RightPanelContent = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  align-content: flex-start;
`;

export const ButtonMode = styled.button`
  background-color: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
`;
