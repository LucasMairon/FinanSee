import React from "react";

// Utils
import { cpfMask } from "@/validators/mask";

// Styles
import { Container, StyledLabel, StyledInput } from "./styles";

const InputFormCpf = ({ label, placeholder, value, onChange }) => {
  const handleChange = (e) => {
    const masked = cpfMask(e.target.value);
    onChange({ target: { value: masked } });
  };

  return (
    <Container suppressHydrationWarning>
      <StyledLabel suppressHydrationWarning>{label}</StyledLabel>
      <StyledInput
        suppressHydrationWarning
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        maxLength={14}
      />
    </Container>
  );
};

export default InputFormCpf;
