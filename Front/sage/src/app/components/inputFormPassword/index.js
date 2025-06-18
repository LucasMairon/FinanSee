import React from "react";

import { Container, StyledLabel, StyledInput } from "./styles";

const InputFormPassword = ({ label, placeholder, value, onChange }) => {
  return (
    <Container>
      <StyledLabel>{label}</StyledLabel>
      <StyledInput
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        type="password"
      />
    </Container>
  );
};

export default InputFormPassword;
