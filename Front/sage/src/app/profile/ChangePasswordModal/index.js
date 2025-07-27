"use client";
import React, { useState } from "react";

// Libs
import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { toast } from "react-hot-toast";
import _ from "lodash";

// Styles
import {
  Overlay,
  Content,
  Title,
  Form,
  Label,
  Input,
  ButtonGroup,
  ConfirmButton,
  CancelButton,
  ButtonEye,
  ButtonEye2,
  ButtonEye3,
} from "./styles";

export const ChangePasswordModal = ({ children, onSubmit }) => {
  const [open, setOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confNewPassword, setConfNewPassword] = useState("");

  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [visible3, setVisible3] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!currentPassword || !newPassword || !confNewPassword) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    if (_.isEqual(newPassword, currentPassword)) {
      toast.error("A nova senha não pode ser igual à senha atual.");
      return;
    }

    if (!_.isEqual(newPassword, confNewPassword)) {
      toast.error("A nova senha, e a confirmação da senha devem ser igual.");
      return;
    }

    if (onSubmit) {
      onSubmit({
        currentPassword,
        newPassword,
        confNewPassword,
      });
      setOpen(false);
    }
  };

  const handleOpenChange = (isOpen) => {
    if (!isOpen) {
      setCurrentPassword("");
      setNewPassword("");
      setConfNewPassword("");
    }
    setOpen(isOpen);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Overlay />
        <Content>
          <Title>Alterar senha</Title>

          <Form onSubmit={handleSubmit} noValidate>
            <div>
              <Label htmlFor="currentPassword">Senha atual</Label>
              <Input
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Digite sua senha atual"
                type={visible ? "none" : "password"}
              />
              <ButtonEye onClick={() => setVisible(!visible)}>
                {visible ? (
                  <Image src="/eye-on.svg" alt="Logo" width={20} height={20} />
                ) : (
                  <Image src="/eye-off.svg" alt="Logo" width={20} height={20} />
                )}
              </ButtonEye>
            </div>

            <div>
              <Label htmlFor="newPassword">Nova senha</Label>
              <Input
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Digite sua nova senha"
                type={visible2 ? "none" : "password"}
              />
              <ButtonEye2 onClick={() => setVisible2(!visible2)}>
                {visible2 ? (
                  <Image src="/eye-on.svg" alt="Logo" width={20} height={20} />
                ) : (
                  <Image src="/eye-off.svg" alt="Logo" width={20} height={20} />
                )}
              </ButtonEye2>
            </div>

            <div>
              <Label htmlFor="confNewPassword">Confirme sua nova senha</Label>
              <Input
                id="confNewPassword"
                value={confNewPassword}
                onChange={(e) => setConfNewPassword(e.target.value)}
                placeholder="Confirme sua nova senha"
                type={visible3 ? "none" : "password"}
              />
              <ButtonEye3 onClick={() => setVisible3(!visible3)}>
                {visible3 ? (
                  <Image src="/eye-on.svg" alt="Logo" width={20} height={20} />
                ) : (
                  <Image src="/eye-off.svg" alt="Logo" width={20} height={20} />
                )}
              </ButtonEye3>
            </div>

            <ButtonGroup>
              <CancelButton
                type="button"
                onClick={() => handleOpenChange(false)}
              >
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
