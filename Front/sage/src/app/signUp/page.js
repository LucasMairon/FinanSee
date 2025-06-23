"use client";
import React, { useState } from "react";
// Libs
import Image from "next/image";

// Components
import LeftPanel from "../../components/leftPanel";
import SignUpForm from "../../components/SignUpForm";

import {
  Container,
  RightPanel,
  Header,
  RightPanelContent,
  ButtonMode,
} from "./styles";

export default function SignUp() {
  const [darkMode, setDarkMode] = useState(false);
  const [stepFinal, setStepFinal] = useState(false);

  const switchMode = () => {
    setDarkMode(!darkMode);
  };
  return (
    <Container>
      <LeftPanel />
      <RightPanel>
        <Header>
          <ButtonMode
            className="transition-opacity active:opacity-50 hover:opacity-80"
            onClick={switchMode}
          >
            {darkMode ? (
              <Image src="/Logo_dark.svg" alt="Logo" width={50} height={50} />
            ) : (
              <Image src="/Logo_light.svg" alt="Logo" width={50} height={50} />
            )}
          </ButtonMode>
          <Image src="/Logo_green.svg" alt="Logo" width={120} height={70} />
        </Header>
        <RightPanelContent>
          <SignUpForm stepFinal={stepFinal} setStepFinal={setStepFinal} />
        </RightPanelContent>
      </RightPanel>
    </Container>
  );
}
