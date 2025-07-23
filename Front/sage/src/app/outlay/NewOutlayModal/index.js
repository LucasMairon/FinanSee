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
  Input,
  ButtonGroup,
  ConfirmButton,
  CancelButton,
  Row,
} from "./styles";

export const NewOutlayModal = ({ children, title, onSubmit }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (onSubmit) {
      onSubmit({ name, description, value, date, category, status });
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Overlay />
        <Content>
          <Title>{title}</Title>

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
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Digite aqui uma descrição"
              />
            </div>

            <Row>
              <div>
                <Label htmlFor="value">Valor</Label>
                <Input
                  id="value"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="0,00"
                />
              </div>

              <div>
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="Digite aqui a data"
                />
              </div>
            </Row>

            <Row>
              <div>
                <Label htmlFor="category">Cotegoria</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Digite aqui a categoria"
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Input
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  placeholder="Digite aqui o status"
                />
              </div>
            </Row>

            <ButtonGroup>
              <Dialog.Close asChild>
                <CancelButton type="button">Cancelar</CancelButton>
              </Dialog.Close>
              <ConfirmButton type="submit">Criar</ConfirmButton>
            </ButtonGroup>
          </Form>
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
