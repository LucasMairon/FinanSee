"use client";
import React, { useState } from "react";

// Libs
import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { toast } from "react-hot-toast";

// Context
import { useAuth } from "@/hooks/context";

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
  Input,
  ButtonEye,
} from "./styles";

export const DeletAccount = ({ children, onSubmit }) => {
  const { deleteAccount } = useAuth();

  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [visible, setVisible] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!currentPassword) {
      toast.error("Campo senha é obrigátorio.");

      return;
    }

    if (onSubmit) {
      onSubmit(currentPassword);
      setOpen(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Overlay />
        <Content>
          <Title>Deletar conta</Title>

          <Label>
            Deseja mesmo realizar esta operação? Ela é irreversível!
          </Label>

          <Form onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="currentPassword">Senha atual</Label>
              <Input
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Digite sua senha atual"
                type={visible ? "none" : "password"}
              />
              <ButtonEye type="button" onClick={() => setVisible(!visible)}>
                {visible ? (
                  <Image src="/eye-on.svg" alt="Logo" width={20} height={20} />
                ) : (
                  <Image src="/eye-off.svg" alt="Logo" width={20} height={20} />
                )}
              </ButtonEye>
            </div>
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
