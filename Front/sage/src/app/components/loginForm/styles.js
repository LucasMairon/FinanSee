import styled from "styled-components";

import { backgroundDark } from "@/app/assets/colors";

export const FormWrapper = styled.form`
  width: 350px;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

export const Content = styled.div`
  display: flex;
  gap: 1rem;

  h2 {
    font-size: 1.8rem;
    font-family: var(--font-roboto);
    font-weight: 600;
    color: ${backgroundDark};
    border-bottom: 2px solid #24b36b;
  }

  span {
    font-size: 1.8rem;
    font-family: var(--font-roboto);
    font-weight: 600;
    color: #787878;
    cursor: pointer;
  }
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;

  label {
    font-size: 0.9rem;
    color: #333;
    font-family: var(--font-roboto);
    font-weight: 400;
  }

  input {
    padding: 0.6rem;
    border: 1px solid #888;
    border-radius: 4px;
    font-size: 1rem;
    font-family: var(--font-roboto);
    font-weight: 400;
  }
`;

export const ForgotPassword = styled.a`
  color: #24b36b;
  font-size: 0.85rem;
  text-decoration: underline;
  font-family: var(--font-roboto);
  font-weight: 400;
`;

export const LoginButton = styled.button`
  background-color: #24b36b;
  color: white;
  padding: 0.8rem;
  border: none;
  border-radius: 4px;
  font-family: var(--font-roboto);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
`;
