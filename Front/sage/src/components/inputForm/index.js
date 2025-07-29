import React from "react";

import { Container, StyledLabel, StyledInput } from "./styles";

const InputForm = ({ label, placeholder, value, onChange, error }) => {
  return (
    <Container>
      <StyledLabel $error={error}>{label}</StyledLabel>
      <StyledInput
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        $error={error}
      />
    </Container>
  );
};

export default InputForm;
