import React, { useEffect, useState } from "react";

// Libs
import { useRouter } from "next/navigation";

// Components
import InputForm from "../inputForm";
import InputFormPassword from "../inputFormPassword";

// Context
import { useAuth } from "@/hooks/context";

// Utils
import { isValidEmail } from "@/validators";

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

  const { fetchLogin, user } = useAuth();

  const [email, setEmail] = useState("xapab61445@pacfut.com");
  const [errorEmail, setErrorEmail] = useState(false);
  const [password, setPassword] = useState("Teste123@");
  const [errorPassword, setErrorPassword] = useState(false);

  const onPressLogin = () => {
    const validEmail = isValidEmail(email);
    setErrorEmail(!validEmail);
    setErrorPassword(!password);

    if (validEmail && password) {
      fetchLogin(email, password);
    }
    // router.push("/dashboard");
  };

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

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
        error={errorEmail}
      />
      <SpaceVertical />
      <InputFormPassword
        label="Senha"
        placeholder="Sua senha aqui"
        value={password || ""}
        onChange={(e) => setPassword(e.target.value)}
        error={errorPassword}
      />

      <ButtonLoginContainer>
        <ForgotPassword onClick={() => router.push("/forgotPassword")}>
          Esqueceu sua senha?
        </ForgotPassword>

        <LoginButton onClick={() => onPressLogin()}>Fazer Login</LoginButton>
      </ButtonLoginContainer>
    </FormWrapper>
  );
}
