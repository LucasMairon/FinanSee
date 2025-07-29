"use client";
import React, { useState } from "react";

// Components
import LeftPanel from "../../components/leftPanel";
import SignUpForm from "../../components/SignUpForm";

import { Container, RightPanel, RightPanelContent } from "./styles";

export default function SignUp() {
  const [stepFinal, setStepFinal] = useState(false);

  return (
    <Container>
      <LeftPanel />
      <RightPanel>
        <RightPanelContent>
          <SignUpForm stepFinal={stepFinal} setStepFinal={setStepFinal} />
        </RightPanelContent>
      </RightPanel>
    </Container>
  );
}
