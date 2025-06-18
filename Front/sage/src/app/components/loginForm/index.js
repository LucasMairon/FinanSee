import React, { useState } from "react";

// Libs
import { redirect } from "next/navigation";

// Components
import InputForm from "../inputForm";
import InputFormPassword from "../inputFormPassword";

// Styles
import {
  FormWrapper,
  Header,
  ForgotPassword,
  LoginButton,
  SignIn,
  SignUp,
  ButtonLoginContainer,
} from "./styles";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <FormWrapper>
      <Header>
        <SignIn>Login</SignIn>
        <SignUp onClick={() => redirect("/signUp")}>Cadastre-se</SignUp>
      </Header>
      <InputForm
        label="Email"
        placeholder="Ex:email@email.com"
        value={email || ""}
        onChange={(e) => setEmail(e.target.value)}
      />
      <InputFormPassword
        label="Senha"
        placeholder="Sua senha aqui"
        value={password || ""}
        onChange={(e) => setPassword(e.target.value)}
      />

      <ButtonLoginContainer>
        <ForgotPassword href="#">Esqueceu sua senha?</ForgotPassword>

        <LoginButton>Fazer Login</LoginButton>
      </ButtonLoginContainer>
    </FormWrapper>
  );
}
