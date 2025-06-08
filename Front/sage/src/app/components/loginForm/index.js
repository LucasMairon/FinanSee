import React, { useState } from "react";
// Components
import InputForm from "../../components/inputForm";

// Styles
import {
  FormWrapper,
  Content,
  InputGroup,
  ForgotPassword,
  LoginButton,
} from "./styles";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <FormWrapper>
      <Content>
        <h2>Login</h2>
        <span>Cadastre-se</span>
      </Content>

      <InputForm
        label="Email"
        placeholder="Ex:email@email.com"
        value={email || ""}
        onChange={(e) => setEmail(e.target.value)}
      />

      <InputForm
        label="Senha"
        placeholder="Sua senha aqui"
        value={password || ""}
        onChange={(e) => setPassword(e.target.value)}
      />
      <ForgotPassword href="#">Esqueceu sua senha?</ForgotPassword>

      <LoginButton>Fazer Login</LoginButton>
    </FormWrapper>
  );
}
