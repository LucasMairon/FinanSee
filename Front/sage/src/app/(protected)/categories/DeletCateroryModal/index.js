"use client";
import React, { useState } from "react";

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

export const DeletCateroryModal = ({ children, onSubmmit, idProp }) => {
  const [open, setOpen] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (onSubmmit) {
      onSubmmit(idProp);
      setOpen(false);
    }
  };
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Overlay />
        <Content>
          <Title>Deletar categoria</Title>

          <Label>
            Deseja mesmo realizar esta operação? Ela é irreversível!
          </Label>

          <Form onSubmit={handleSubmit}>
            <ButtonGroup>
              <CancelButton type="button" onClick={() => setOpen(false)}>
                Cancelar
              </CancelButton>
              <ConfirmButton type="submit">Confirmar</ConfirmButton>
            </ButtonGroup>
          </Form>
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
