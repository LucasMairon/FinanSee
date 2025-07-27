import styled, { keyframes } from "styled-components";
import * as Dialog from "@radix-ui/react-dialog";

const overlayShow = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const contentShow = keyframes`
  from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
`;

export const Overlay = styled(Dialog.Overlay)`
  background-color: rgba(0, 0, 0, 0.6);
  position: fixed;
  inset: 0;
  animation: ${overlayShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);
`;

export const Content = styled(Dialog.Content)`
  background-color: white;
  border-radius: 8px;
  box-shadow: hsl(206 22% 7% / 35%) 0px 10px 38px -10px,
    hsl(206 22% 7% / 20%) 0px 10px 20px -15px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90vw;
  max-width: 450px;
  padding: 25px;
  animation: ${contentShow} 150ms cubic-bezier(0.16, 1, 0.3, 1);

  &:focus {
    outline: none;
  }
`;

export const Title = styled(Dialog.Title)`
  margin: 0;
  font-weight: 700;
  color: #333;
  font-size: 24px;
  font-weight: 600;
`;

export const Form = styled.form`
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #282828;
  margin-bottom: 4px;
  display: block;
  font-weight: 400;
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 16px;
  box-sizing: border-box;
  background-color: transparent;
  color: #000;
  font-weight: 400;

  &:focus {
    outline: none;
    border-color: #22c55e;
    box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.3);
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 16px;
  margin-top: 24px;
`;

const BaseButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  border: none;
  transition: background-color 0.2s ease-in-out;
`;

export const ConfirmButton = styled(BaseButton)`
  background-color: #34b361;
  color: white;
  font-weight: 600;

  &:hover {
    background-color: #16a34a;
  }
`;

export const CancelButton = styled(BaseButton)`
  background-color: white;
  color: #34b361;
  border: 1px solid #34b361;
  font-weight: 600;

  &:hover {
    background-color: #f9fafb;
  }
`;

export const Row = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;
