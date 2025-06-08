import React from "react";

import { Container, StyledLabel, StyledInput } from "./styles";

const InputForm = ({ label, placeholder, value, onChange }) => {
  return (
    <Container>
      <StyledLabel>{label}</StyledLabel>
      <StyledInput
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </Container>
  );
};

export default InputForm;
