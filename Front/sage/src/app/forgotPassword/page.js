"use client";
import React, { useState } from "react";

// Libs
import { useRouter } from "next/navigation";

// Components
import InputForm from "../../components/inputForm";

// Utils
import { isValidEmail } from "@/validators";

// Styles
import {
  ButtonBack,
  Container,
  Content,
  Form,
  Header,
  SubTitle,
  Title,
  ResetPasswordButton,
} from "./styles";

export default function ForgotPassword() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [errorEmail, setErrorEmail] = useState(false);

  const onPressForgotPassword = () => {
    const validEmail = isValidEmail(email);

    setErrorEmail(!validEmail);

    if (validEmail) console.log("Tudo certo no reset de senha.");
  };

  return (
    <Container>
      <Header>
        <ButtonBack
          onClick={() => router.push("/login")}
        >{`< voltar`}</ButtonBack>
      </Header>

      <Content>
        <Title>Redefinir senha</Title>
        <SubTitle>
          Insira o e-mail cadastrado no sistema para receber o código de
          redefinição de senha
        </SubTitle>
        <Form>
          <InputForm
            label="Email"
            placeholder="Ex:email@email.com"
            value={email || ""}
            onChange={(e) => setEmail(e.target.value)}
            error={errorEmail}
          />
        </Form>
        <ResetPasswordButton onClick={() => onPressForgotPassword()}>
          Receber email
        </ResetPasswordButton>
      </Content>
    </Container>
  );
}
