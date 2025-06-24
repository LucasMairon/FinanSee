import React, { useState } from "react";

// Libs
import { useRouter } from "next/navigation";
import _ from "lodash";

// Components
import InputForm from "../inputForm";
import InputFormPassword from "../inputFormPassword";
import InputFormCpf from "../inputFormCpf";
import InputFormPhone from "../inputFormPhone";
import InputFormDate from "../inputFormDate";

// Utils
import {
  checkCPF,
  isValidEmail,
  isValidPhone,
  validateBirthDate,
} from "@/validators";

// Styles
import {
  FormWrapper,
  Header,
  SignIn,
  SignUp,
  Content,
  RowInput,
  SignUpButton,
  SpaceVertical,
  SpaceVertical10,
} from "./styles";

export default function SignUpForm({ stepFinal, setStepFinal }) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [emailSignUp, setEmailSignUp] = useState("");
  const [document, setDocument] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [incomeFixed, setIncomeFixed] = useState("");
  const [passwordSignUp, setPasswordSignUp] = useState("");
  const [confPasswordSignUp, setConfPasswordSignUp] = useState("");

  const [errorName, setErrorName] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorDocument, setErrorDocument] = useState(false);
  const [errorPhone, setErrorPhone] = useState(false);
  const [errorBirthDate, setErrorBirthDate] = useState(false);
  const [errorIcomeFixed, setErrorIncomeFixed] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [errorConfPassword, setErrorConfPassword] = useState(false);

  const nextStep = () => {
    const validEmail = isValidEmail(emailSignUp);
    const validDocument = checkCPF(document);
    const validPhone = isValidPhone(phone);
    const validBirthDate = validateBirthDate(birthDate);

    setErrorName(!name);
    setErrorDocument(!validDocument);
    setErrorEmail(!validEmail);
    setErrorPhone(!validPhone);
    setErrorBirthDate(!validBirthDate);

    if (name && validDocument && validEmail && validPhone && validBirthDate) {
      setStepFinal(true);
    }
  };

  const onPressFinishSignUp = () => {
    const validPassword = _.isEqual(passwordSignUp, confPasswordSignUp);
    setErrorIncomeFixed(!incomeFixed);
    setErrorPassword(!validPassword);
    setErrorConfPassword(!validPassword);

    if (incomeFixed && validPassword) {
      console.log("Tudo certo no cadastro.");
    }
  };

  return (
    <FormWrapper>
      <Header>
        <SignIn onClick={() => router.push("/login")}>Login</SignIn>
        <SignUp>Cadastre-se</SignUp>
      </Header>
      <SpaceVertical10 />
      {!stepFinal ? (
        <Content>
          <InputForm
            label="Nome"
            placeholder="informe seu nome"
            value={name || ""}
            onChange={(e) => setName(e.target.value)}
            error={errorName}
          />
          <SpaceVertical />
          <RowInput>
            <InputForm
              label="E-mail"
              placeholder="informe seu e-mail"
              value={emailSignUp || ""}
              onChange={(e) => setEmailSignUp(e.target.value)}
              error={errorEmail}
            />
            <InputFormCpf
              label="CPF"
              placeholder="informe seu cpf"
              value={document || ""}
              onChange={(e) => setDocument(e.target.value)}
              error={errorDocument}
            />
          </RowInput>
          <SpaceVertical />
          <RowInput>
            <InputFormPhone
              label="Telefone"
              placeholder="informe seu telefone"
              value={phone || ""}
              onChange={(e) => setPhone(e.target.value)}
              error={errorPhone}
            />
            <InputFormDate
              label="Data de nascimento"
              placeholder="informe sua data de nascimento"
              value={birthDate || ""}
              onChange={(e) => setBirthDate(e.target.value)}
              error={errorBirthDate}
            />
          </RowInput>
          <SpaceVertical />

          <SignUpButton type="button" onClick={() => nextStep()}>
            Prosseguir
          </SignUpButton>
        </Content>
      ) : (
        <Content>
          <InputForm
            label="Renda Fixa"
            placeholder="informe sua renda"
            value={incomeFixed || ""}
            onChange={(e) => setIncomeFixed(e.target.value)}
            error={errorIcomeFixed}
          />
          <SpaceVertical />
          <InputFormPassword
            label="Senha"
            placeholder="crie uma senha"
            value={passwordSignUp || ""}
            onChange={(e) => setPasswordSignUp(e.target.value)}
            error={errorPassword}
          />
          <SpaceVertical />
          <InputFormPassword
            label="Confirma senha"
            placeholder="confirme sua senha"
            value={confPasswordSignUp || ""}
            onChange={(e) => setConfPasswordSignUp(e.target.value)}
            error={errorConfPassword}
          />
          <SpaceVertical />

          <SignUpButton onClick={() => onPressFinishSignUp()}>
            Cadastrar
          </SignUpButton>
        </Content>
      )}
    </FormWrapper>
  );
}
