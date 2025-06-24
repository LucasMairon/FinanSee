import styled from "styled-components";
import {
  backgroundDark,
  backgroundWhite,
  greenClear,
} from "../../assets/colors";

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
