"use client";
import React, { useState } from "react";

// Libs
import { useRouter } from "next/navigation";
import _ from "lodash";

// Components
import InputFormPassword from "../../components/inputFormPassword";

// Styles
import {
  Container,
  Content,
  Form,
  ResetPasswordButton,
  SubTitle,
  Title,
} from "./styles";

export default function ResetPassword() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");

  const [errorPassword, setErrorPassword] = useState(false);
  const [errorConfPassword, setErrorConfPassword] = useState(false);

  const onPressReset = () => {
    const validPassword = _.isEqual(password, confPassword);

    setErrorPassword(!validPassword);
    setErrorConfPassword(!validPassword);

    if (validPassword) {
      console.log("Tudo certo com a troca de senha");
      router.push("/login");
    }
  };

  return (
    <Container>
      <Content>
        <Title>Redefinir senha</Title>
        <SubTitle>Insira a nova senha e a confirme</SubTitle>
        <Form>
          <InputFormPassword
            label="Senha"
            placeholder="informe sua senha"
            value={password || ""}
            onChange={(e) => setPassword(e.target.value)}
            error={errorPassword}
          />
          <InputFormPassword
            label="Confirmação de senha"
            placeholder="Confirme sua senha"
            value={confPassword || ""}
            onChange={(e) => setConfPassword(e.target.value)}
            error={errorConfPassword}
          />
        </Form>
        <ResetPasswordButton onClick={() => onPressReset()}>
          Redefinir senha
        </ResetPasswordButton>
      </Content>
    </Container>
  );
}
