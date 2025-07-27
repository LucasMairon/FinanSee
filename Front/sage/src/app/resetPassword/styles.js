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
  font-weight: 600;
  text-align: center;
`;

export const SubTitle = styled.b`
  color: #696969;
  font-size: 20px;
  font-weight: 400;
  text-align: center;
`;

export const Form = styled.form`
  margin-top: 30px;
  display: flex;
  gap: 20px;
  flex-direction: column;
`;

export const ResetPasswordButton = styled.button`
  background-color: #24b36b;
  color: white;
  padding: 0.8rem;
  border: none;
  border-radius: 20px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
  margin-top: 15px;
`;
