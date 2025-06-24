import React from "react";

// Utils
import { moneyMask } from "@/validators/mask";

// Styles
import { Container, StyledLabel, StyledInput } from "./styles";

const InputFormMoney = ({ label, placeholder, value, onChange, error }) => {
  const handleChange = (e) => {
    const masked = moneyMask(e.target.value);
    onChange({ target: { value: masked } });
  };
  return (
    <Container>
      <StyledLabel $error={error}>{label}</StyledLabel>
      <StyledInput
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        $error={error}
      />
    </Container>
  );
};

export default InputFormMoney;
