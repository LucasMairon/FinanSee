import styled from "styled-components";

import { backgroundDark } from "@/app/assets/colors";

export const FormWrapper = styled.form`
  width: 350px;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

export const Header = styled.div`
  display: flex;
  gap: 1rem;
`;

export const Content = styled.div``;

export const SignIn = styled.span`
  font-size: 1.8rem;
  font-family: var(--font-roboto);
  font-weight: 600;
  color: #787878;
  border-bottom: none;
  cursor: pointer;
`;

export const SignUp = styled.span`
  font-size: 1.8rem;
  font-family: var(--font-roboto);
  font-weight: 600;
  color: ${backgroundDark};
  border-bottom: 2px solid #24b36b;
`;

export const SignUpButton = styled.button`
  background-color: #24b36b;
  color: white;
  padding: 0.8rem;
  border: none;
  border-radius: 20px;
  font-family: var(--font-roboto);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  width: 100%;
  margin-top: 15px;
`;

export const RowInput = styled.div`
  display: flex;
  flex-direction: row;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const SpaceForm = styled.div`
  width: 15px;

  @media (max-width: 768px) {
    width: 0;
  }
`;
