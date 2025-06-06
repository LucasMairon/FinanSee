import styled from "styled-components";

import { backgroundWhite } from "@/app/assets/colors";

export const Container = styled.div`
  position: relative;
  margin: 10px 0;
  width: 100%;
  background-color: transparent;
`;

export const StyledLabel = styled.label`
  position: absolute;
  top: -10px;
  left: 12px;
  background-color: ${backgroundWhite};
  padding: 0 6px;
  font-size: 14px;
  color: #4c4c4c;
  font-family: var(--font-roboto);
  font-weight: 400;
  z-index: 1;
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 16px 12px;
  font-size: 16px;
  border: 2px solid #4c4c4c;
  background-color: transparent;
  font-family: var(--font-roboto);
  color: #4c4c4c;
  font-weight: 400;
  border-radius: 6px;
  outline: none;
  height: 3.1rem;

  ::placeholder {
    color: #4c4c4c;
    font-size: 16px;
    font-family: var(--font-roboto);
    font-weight: 400;
  }
`;
