import React, { useEffect, useState } from "react";

// Libs
import { useRouter } from "next/navigation";
import _ from "lodash";
import { toast } from "react-hot-toast";

// Context
import { useAuth } from "@/hooks/context";

// Components
import InputForm from "../inputForm";
import InputFormPassword from "../inputFormPassword";
import InputFormCpf from "../inputFormCpf";
import InputFormPhone from "../inputFormPhone";
import InputFormDate from "../inputFormDate";
import InputFormMoney from "../inputFormMoney";

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

  const { fetchUserCreate, userCreate, cleanState } = useAuth();

  const [name, setName] = useState("");
  const [emailSignUp, setEmailSignUp] = useState("");
  const [document, setDocument] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [incomeFixed, setIncomeFixed] = useState("");
  const [passwordSignUp, setPasswordSignUp] = useState("");
  const [confPasswordSignUp, setConfPasswordSignUp] = useState("");

  const nextStep = () => {
    if (!name || !emailSignUp || !document || !phone || !birthDate) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }
    const validEmail = isValidEmail(emailSignUp);

    if (!validEmail) {
      toast.error("Email inválido");
      return;
    }
    const validDocument = checkCPF(document);

    if (!validDocument) {
      toast.error("CPF inválido");
      return;
    }
    const validPhone = isValidPhone(phone);

    if (!validPhone) {
      toast.error("Telefone inválido");
      return;
    }
    const validBirthDate = validateBirthDate(birthDate);

    if (!validBirthDate) {
      toast.error("Data de nascimento inválida");
      return;
    }

    if (name && validDocument && validEmail && validPhone && validBirthDate) {
      setStepFinal(true);
    }
  };

  const onPressFinishSignUp = () => {
    if (!incomeFixed || !passwordSignUp || !confPasswordSignUp) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    const validPassword = _.isEqual(passwordSignUp, confPasswordSignUp);
    if (!validPassword) {
      toast.error("As senhas não coincidem");
      return;
    }

    if (incomeFixed && validPassword) {
      fetchUserCreate(
        name,
        document,
        emailSignUp,
        birthDate,
        phone,
        incomeFixed,
        passwordSignUp
      );
    }
  };

  useEffect(() => {
    return () => cleanState();
  }, []);

  useEffect(() => {
    if (userCreate) {
      router?.push("/login");
    }
  }, [userCreate, router]);

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
          />
          <SpaceVertical />
          <RowInput>
            <InputForm
              label="E-mail"
              placeholder="informe seu e-mail"
              value={emailSignUp || ""}
              onChange={(e) => setEmailSignUp(e.target.value)}
            />
            <InputFormCpf
              label="CPF"
              placeholder="informe seu cpf"
              value={document || ""}
              onChange={(e) => setDocument(e.target.value)}
            />
          </RowInput>
          <SpaceVertical />
          <RowInput>
            <InputFormPhone
              label="Telefone"
              placeholder="informe seu telefone"
              value={phone || ""}
              onChange={(e) => setPhone(e.target.value)}
            />
            <InputFormDate
              label="Data de nascimento"
              placeholder="informe sua data de nascimento"
              value={birthDate || ""}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </RowInput>
          <SpaceVertical />

          <SignUpButton type="button" onClick={() => nextStep()}>
            Prosseguir
          </SignUpButton>
        </Content>
      ) : (
        <Content>
          <InputFormMoney
            label="Renda Fixa"
            placeholder="informe sua renda"
            value={incomeFixed || ""}
            onChange={(e) => setIncomeFixed(e.target.value)}
          />
          <SpaceVertical />
          <InputFormPassword
            label="Senha"
            placeholder="crie uma senha"
            value={passwordSignUp || ""}
            onChange={(e) => setPasswordSignUp(e.target.value)}
          />
          <SpaceVertical />
          <InputFormPassword
            label="Confirma senha"
            placeholder="confirme sua senha"
            value={confPasswordSignUp || ""}
            onChange={(e) => setConfPasswordSignUp(e.target.value)}
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
