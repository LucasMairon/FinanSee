import React from "react";

// Utils
import { dateMask } from "@/validators/mask";

// Styles
import { Container, StyledLabel, StyledInput } from "./styles";

const InputFormDate = ({ label, placeholder, value, onChange, error }) => {
  const handleChange = (e) => {
    const masked = dateMask(e.target.value);
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
        maxLength={10}
      />
    </Container>
  );
};

export default InputFormDate;
