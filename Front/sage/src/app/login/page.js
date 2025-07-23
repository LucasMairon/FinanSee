"use client";
import React from "react";

// Components
import LoginForm from "../../components/loginForm";
import LeftPanel from "../../components/leftPanel";

import { Container, RightPanel, RightPanelContent } from "./styles";

export default function Login() {
  return (
    <Container>
      <LeftPanel />
      <RightPanel>
        <RightPanelContent>
          <LoginForm />
        </RightPanelContent>
      </RightPanel>
    </Container>
  );
}
