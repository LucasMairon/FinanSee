import styled from "styled-components";

import { backgroundWhite } from "../../assets/colors";

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

  @media (max-width: 768px) {
    width: 100%;
    flex: auto;
  }
`;

export const RightPanelContent = styled.div`
  flex: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;
