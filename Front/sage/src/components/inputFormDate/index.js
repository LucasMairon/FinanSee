import React from "react";

// Utils
import { dateMask } from "@/validators/mask";

// Styles
import { Container, StyledLabel, StyledInput } from "./styles";

const InputFormDate = ({ label, placeholder, value, onChange }) => {
  const handleChange = (e) => {
    const masked = dateMask(e.target.value);
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
        maxLength={10}
      />
    </Container>
  );
};

export default InputFormDate;
