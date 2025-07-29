import React from "react";

// Utils
import { moneyMask } from "@/validators/mask";

// Styles
import { Container, StyledLabel, StyledInput } from "./styles";

const InputFormMoney = ({ label, placeholder, value, onChange }) => {
  const handleChange = (e) => {
    const masked = moneyMask(e.target.value);
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

export default InputFormMoney;
