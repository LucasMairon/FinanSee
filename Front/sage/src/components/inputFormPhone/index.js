import React from "react";

// Utils
import { phoneMask } from "@/validators/mask";

// Styles
import { Container, StyledLabel, StyledInput } from "./styles";

const InputFormPhone = ({ label, placeholder, value, onChange, error }) => {
  const handleChange = (e) => {
    const masked = phoneMask(e.target.value);
    onChange({ target: { value: masked } });
  };

  return (
    <Container>
      <StyledLabel $errorLabelMessage={error}>{label}</StyledLabel>
      <StyledInput
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        $errorLabelMessage={error}
      />
    </Container>
  );
};

export default InputFormPhone;
