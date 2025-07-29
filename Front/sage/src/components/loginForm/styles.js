import styled from "styled-components";

import { backgroundDark } from "@/assets/colors";

export const FormWrapper = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  @media (max-width: 768px) {
    width: 100%;
    display: auto;
  }
`;

export const Header = styled.div`
  display: flex;
  gap: 1rem;
`;

export const SignIn = styled.span`
  font-size: 1.8rem;
  font-family: var(--font-roboto);
  font-weight: 600;
  color: ${backgroundDark};
  border-bottom: 2px solid #24b36b;
`;

export const SignUp = styled.span`
  font-size: 1.8rem;
  font-family: var(--font-roboto);
  font-weight: 600;
  color: #787878;
  border-bottom: none;
  cursor: pointer;
`;

export const ForgotPassword = styled.a`
  color: #24b36b;
  font-size: 0.85rem;
  text-decoration: underline;
  font-family: var(--font-roboto);
  font-weight: 400;
  margin-top: -0.5rem;
  margin-bottom: 2rem;
  cursor: pointer;
`;

export const LoginButton = styled.button`
  background-color: #24b36b;
  color: white;
  padding: 0.8rem;
  border: none;
  border-radius: 20px;
  font-family: var(--font-roboto);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
`;

export const ButtonLoginContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SpaceVertical = styled.div`
  display: flex;
`;
