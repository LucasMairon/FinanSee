import React, { useEffect, useState } from "react";

// Libs
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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
  const [password, setPassword] = useState("Teste@123");

  const onPressLogin = () => {
    if (!email && !password) {
      toast.error("Por favor, preencha os campos de email e senha");
      return;
    }

    const validEmail = isValidEmail(email);

    if (!validEmail) {
      toast.error("Email inválido");
      return;
    }

    if (validEmail && password) {
      fetchLogin(email, password);
    }
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

        <LoginButton onClick={() => onPressLogin()}>Fazer Login</LoginButton>
      </ButtonLoginContainer>
    </FormWrapper>
  );
}
