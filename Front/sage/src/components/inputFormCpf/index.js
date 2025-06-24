import React from "react";

// Utils
import { cpfMask } from "@/validators/mask";

// Styles
import { Container, StyledLabel, StyledInput } from "./styles";

const InputFormCpf = ({ label, placeholder, value, onChange, error }) => {
  const handleChange = (e) => {
    const masked = cpfMask(e.target.value);
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
        maxLength={14}
      />
    </Container>
  );
};

export default InputFormCpf;
