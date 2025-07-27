import styled from "styled-components";

export const Wrapper = styled.div`
  background-color: #24b36b;
  flex: 1;
  padding: 1rem;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const Tagline = styled.div`
  margin-right: -5rem;
  font-weight: 600;

  h2 {
    font-size: 2.4rem;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1.5rem;
  }
`;
