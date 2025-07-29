import React from "react";

// Utils
import { phoneMask } from "@/validators/mask";

// Styles
import { Container, StyledLabel, StyledInput } from "./styles";

const InputFormPhone = ({ label, placeholder, value, onChange }) => {
  const handleChange = (e) => {
    const masked = phoneMask(e.target.value);
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
      />
    </Container>
  );
};

export default InputFormPhone;
