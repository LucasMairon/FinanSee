import React, { useState } from "react";

// Libs
import { useRouter } from "next/navigation";

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
  SpaceVertical,
} from "./styles";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <FormWrapper>
      <Header>
        <SignIn>Login</SignIn>
        <SignUp onClick={() => router.push("/signUp")}>Cadastre-se</SignUp>
      </Header>
      <SpaceVertical />
      <InputForm
        label="Email"
        placeholder="Ex:email@email.com"
        value={email || ""}
        onChange={(e) => setEmail(e.target.value)}
      />
      <SpaceVertical />
      <InputFormPassword
        label="Senha"
        placeholder="Sua senha aqui"
        value={password || ""}
        onChange={(e) => setPassword(e.target.value)}
      />

      <ButtonLoginContainer>
        <ForgotPassword onClick={() => router.push("/forgotPassword")}>
          Esqueceu sua senha?
        </ForgotPassword>

        <LoginButton>Fazer Login</LoginButton>
      </ButtonLoginContainer>
    </FormWrapper>
  );
}
