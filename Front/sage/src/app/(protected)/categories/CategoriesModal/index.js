"use client";
import React, { useEffect, useState } from "react";

// Libs
import * as Dialog from "@radix-ui/react-dialog";
import { toast } from "react-hot-toast";

// Styles
import {
  Overlay,
  Content,
  Title,
  Form,
  Label,
  Input,
  Textarea,
  ButtonGroup,
  ConfirmButton,
  CancelButton,
} from "./styles";

export const CategoryModal = ({
  children,
  type = "create",
  onSubmit,
  nameProp,
  descriptionProp,
  idProp,
}) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    setName(nameProp || "");
    setDescription(descriptionProp || "");
  }, [nameProp, descriptionProp]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!name || !description) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    if (onSubmit) {
      onSubmit({ name, description, type, id: idProp });
    }

    setOpen(false);
  };

  const handleOpenChange = (isOpen) => {
    if (!isOpen) {
      setName("");
      setDescription("");
    }
    setOpen(isOpen);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Overlay />
        <Content>
          <Title>
            {type === "create" ? "Criar categoria" : "Editar categoria"}
          </Title>

          <Form onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite aqui o nome"
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Digite aqui uma descrição"
              />
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
