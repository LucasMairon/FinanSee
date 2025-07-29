"use client";
import React, { useEffect, useState } from "react";

// Libs
import * as Dialog from "@radix-ui/react-dialog";
import { toast } from "react-hot-toast";

// Validators
import { dateMask, moneyMask } from "@/validators/mask";
import { formatDate, validateBirthDate } from "@/validators";

// Context
import { useAuth } from "@/hooks/context";

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
  Select,
  Row2,
  RowHeader,
  IconsContainer,
  IconButton,
  CancelButton2,
} from "./styles";

// Icons
const EditIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#000000"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const DeleteIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#E41414"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

export const NewOutlayModal = ({
  children,
  onSubmit,
  categories,
  typeProp,
  data,
}) => {
  const { deleteOutlay } = useAuth();

  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const [type, setType] = useState(typeProp);

  const getTitle = () => {
    switch (type) {
      case "create":
        return "Criar despesa";
      case "view":
        return "Visualizar despesa";
      case "edit":
        return "Editar despesa";
      default:
        return "Criar despesa";
    }
  };

  useEffect(() => {
    if (data) {
      setId(data?.id);
      setName(data?.name);
      setDescription(data?.description);
      setValue(moneyMask(data?.value));
      setDate(formatDate(data?.date));
      setCategory(data?.categories[0]?.id || "");
      setStatus(data?.status);
    }
  }, []);

  const handleOpenChange = (isOpen) => {
    if (!isOpen && type === "create") {
      setName("");
      setDescription("");
      setValue("");
      setDate("");
      setCategory("");
      setStatus("");
      setType("view");
    }
    setOpen(isOpen);
  };

  const handleOpenChange2 = (isOpen) => {
    setType("view");
    setOpen(isOpen);
  };

  const deleteChangeOutlay = () => {
    deleteOutlay(id);
    handleOpenChange(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!name || !description || !value || !date || !category || !status) {
      toast.error("Por favor, preencha todos os campos.");
      return;
    }

    if (!validateBirthDate(date)) {
      toast.error("Data inválida. Por favor, insira uma data válida.");
      return;
    }

    if (onSubmit) {
      onSubmit({ name, description, value, date, category, status, id, type });
      if (type === "create") handleOpenChange(false);
      if (type === "edit") handleOpenChange2(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Overlay />
        <Content>
          <RowHeader>
            <Title>{getTitle()}</Title>
            {type === "view" && (
              <IconsContainer>
                <IconButton onClick={() => setType("edit")}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => deleteChangeOutlay()}>
                  <DeleteIcon />
                </IconButton>
              </IconsContainer>
            )}
          </RowHeader>

          <Form onSubmit={handleSubmit} noValidate>
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Digite aqui o nome"
                disabled={type === "view"}
              />
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Digite aqui uma descrição"
                disabled={type === "view"}
              />
            </div>

            <Row>
              <div>
                <Label htmlFor="value">Valor</Label>
                <Input
                  id="value"
                  value={value}
                  onChange={(e) => setValue(moneyMask(e.target.value))}
                  placeholder="0,00"
                  disabled={type === "view"}
                />
              </div>

              <div>
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  value={date}
                  onChange={(e) => setDate(dateMask(e.target.value))}
                  placeholder="Digite aqui a data"
                  maxLength={10}
                  disabled={type === "view"}
                />
              </div>
            </Row>

            <Row2>
              <div>
                <Label htmlFor="category">Categoria</Label>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  id="category"
                  disabled={type === "view"}
                >
                  <option value=""></option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  id="status"
                  disabled={type === "view"}
                >
                  <option value=""></option>
                  <option value="AP">A pagar</option>
                  <option value="P">Pago</option>
                </Select>
              </div>
            </Row2>

            <ButtonGroup>
              {type === "create" && (
                <CancelButton
                  type="button"
                  onClick={() => handleOpenChange(false)}
                >
                  Cancelar
                </CancelButton>
              )}
              {type === "view" && (
                <CancelButton2
                  type="button"
                  onClick={() => handleOpenChange2(false)}
                >
                  Voltar
                </CancelButton2>
              )}
              {type === "edit" && (
                <CancelButton
                  type="button"
                  onClick={() => handleOpenChange2(false)}
                >
                  Cancelar
                </CancelButton>
              )}
              {type !== "view" && (
                <ConfirmButton type="submit">
                  {type === "create" ? "Criar" : "Atualizar"}
                </ConfirmButton>
              )}
            </ButtonGroup>
          </Form>
        </Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
