import React, { useState } from "react";

// Libs
import { redirect } from "next/navigation";

// Components
import InputForm from "../inputForm";

// Styles
import {
  FormWrapper,
  Header,
  SignIn,
  SignUp,
  Content,
  RowInput,
  SpaceForm,
  SignUpButton,
} from "./styles";

export default function SignUpForm() {
  const [name, setName] = useState("");
  const [emailSignUp, setEmailSignUp] = useState("");
  const [document, setDocument] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [incomeFixed, setIncomeFixed] = useState("");
  const [passwordSignUp, setPasswordSignUp] = useState("");
  const [confPasswordSignUp, setConfPasswordSignUp] = useState("");

  const [stepFinal, setStepFinal] = useState(false);

  console.log(stepFinal, "AQUI");

  const nextStep = () => {
    setStepFinal(true);
  };

  return (
    <FormWrapper>
      <Header>
        <SignIn onClick={() => redirect("/login")}>Login</SignIn>
        <SignUp>Cadastre-se</SignUp>
      </Header>
      {!stepFinal ? (
        <Content>
          <InputForm
            label="Nome"
            placeholder="informe seu nome"
            value={name || ""}
            onChange={(e) => setName(e.target.value)}
          />
          <RowInput>
            <InputForm
              label="E-mail"
              placeholder="informe seu e-mail"
              value={emailSignUp || ""}
              onChange={(e) => setEmailSignUp(e.target.value)}
            />
            <SpaceForm />
            <InputForm
              label="CPF"
              placeholder="informe seu cpf"
              value={document || ""}
              onChange={(e) => setDocument(e.target.value)}
            />
          </RowInput>
          <RowInput>
            <InputForm
              label="Telefone"
              placeholder="informe seu telefone"
              value={phone || ""}
              onChange={(e) => setPhone(e.target.value)}
            />
            <SpaceForm />
            <InputForm
              label="Data de nascimento"
              placeholder="informe sua data de nascimento"
              value={birthDate || ""}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </RowInput>

          <SignUpButton onClick={() => nextStep()}>Prosseguir</SignUpButton>
        </Content>
      ) : (
        <Content>
          <InputForm
            label="Renda Fixa"
            placeholder="informe sua renda"
            value={incomeFixed || ""}
            onChange={(e) => setIncomeFixed(e.target.value)}
          />
          <InputForm
            label="Senha"
            placeholder="crie uma senha"
            value={passwordSignUp || ""}
            onChange={(e) => setPasswordSignUp(e.target.value)}
          />
          <InputForm
            label="Confirma senha"
            placeholder="confirme sua senha"
            value={confPasswordSignUp || ""}
            onChange={(e) => setConfPasswordSignUp(e.target.value)}
          />

          <SignUpButton>Cadastrar</SignUpButton>
        </Content>
      )}
    </FormWrapper>
  );
}
