import React from "react";

import { Container, StyledLabel, StyledInput } from "./styles";

const InputForm = ({ label, placeholder, value, onChange }) => {
  return (
    <Container suppressHydrationWarning>
      <StyledLabel suppressHydrationWarning>{label}</StyledLabel>
      <StyledInput
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        suppressHydrationWarning
      />
    </Container>
  );
};

export default InputForm;
