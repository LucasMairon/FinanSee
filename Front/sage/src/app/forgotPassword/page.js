"use client";
import React, { useState } from "react";

// Libs
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

// Components
import InputForm from "../../components/inputForm";

// Context
import { useAuth } from "@/hooks/context";

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
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState("");

  const onPressForgotPassword = () => {
    if (!email) {
      toast.error("Por favor, preencha o campo de email");
      return;
    }

    const validEmail = isValidEmail(email);

    if (!validEmail) {
      toast.error("Email inválido");
      return;
    }

    if (validEmail) {
      forgotPassword(email);
      setEmail("");
    }
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
          />
        </Form>
        <ResetPasswordButton onClick={() => onPressForgotPassword()}>
          Receber email
        </ResetPasswordButton>
      </Content>
    </Container>
  );
}
