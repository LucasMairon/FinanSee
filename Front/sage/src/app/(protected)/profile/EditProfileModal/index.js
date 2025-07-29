"use client";
import React, { useEffect, useState } from "react";

// Libs
import * as Dialog from "@radix-ui/react-dialog";
import { toast } from "react-hot-toast";

// Validators
import { phoneMask, moneyMask } from "../../../../validators/mask";
import { isValidEmail, isValidPhone } from "../../../../validators";

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
} from "./styles";

export const EditProfileModal = ({
  children,
  emailProp,
  phoneProp,
  moneyProp,
  onSubmit,
  dataOfBirthProp,
  nameProp,
  cpfProp,
}) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [money, setMoney] = useState("");

  useEffect(() => {
    if (open) {
      setEmail(emailProp || "");

      const cleanPhone = (phoneProp || "").replace(/\D/g, "");
      setPhone(phoneMask(cleanPhone));

      const cleanMoney = (moneyProp || "").replace(/\D/g, "");
      const maskedMoney = moneyMask(cleanMoney);
      setMoney(maskedMoney ? `R$ ${maskedMoney}` : "");
    }
  }, [open, emailProp, phoneProp, moneyProp]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!email || !phone || !money) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Formato de e-mail inválido.");
      return;
    }

    if (!isValidPhone(phone)) {
      toast.error("Formato de telefone inválido.");
      return;
    }

    if (onSubmit) {
      const submissionData = {
        email,
        phone: phone.replace(/\D/g, ""),
        money: money.replace(/[R$\s.]/g, "").replace(",", "."),
        date_of_birth: dataOfBirthProp,
        name: nameProp,
        cpf: cpfProp?.replace(/\.|-/g, ""),
      };
      onSubmit(submissionData);
      setOpen(false);
    }
  };

  const handleOpenChange = (isOpen) => {
    if (!isOpen) {
      setEmail("");
      setPhone("");
      setMoney("");
    }
    setOpen(isOpen);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Overlay />
        <Content>
          <Form onSubmit={handleSubmit} noValidate>
            <Title>Editar perfil</Title>

            <div>
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite aqui o e-mail"
              />
            </div>

            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(phoneMask(e.target.value))}
                placeholder="(99) 99999-9999"
              />
            </div>

            <div>
              <Label htmlFor="money">Renda mensal</Label>
              <Input
                id="money"
                value={money}
                onChange={(e) => {
                  const maskedValue = moneyMask(e.target.value);
                  setMoney(maskedValue ? `R$ ${maskedValue}` : "");
                }}
                placeholder="R$ 1.234,56"
              />
            </div>

            <ButtonGroup>
              <CancelButton
                type="button"
                onClick={() => handleOpenChange(false)}
              >
                Cancelar
              </CancelButton>
              <ConfirmButton type="submit">Atualizar</ConfirmButton>
            </ButtonGroup>
          </Form>
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
