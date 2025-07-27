"use client";
import React from "react";

// Libs
import * as Dialog from "@radix-ui/react-dialog";

// Styles
import {
  Overlay,
  Content,
  Title,
  Form,
  Label,
  ButtonGroup,
  ConfirmButton,
  CancelButton,
} from "./styles";

export const DeletCateroryModal = ({ children }) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Overlay />
        <Content>
          <Title>Deletar categoria</Title>

          <Label>
            Deseja mesmo realizar esta operação? Ela é irreversível!
          </Label>

          <Form>
            <ButtonGroup>
              <Dialog.Close asChild>
                <CancelButton type="button">Cancelar</CancelButton>
              </Dialog.Close>
              <ConfirmButton type="submit">Confirmar</ConfirmButton>
            </ButtonGroup>
          </Form>
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
