import React, { useState } from "react";

// Libs
import Image from "next/image";

// Styles
import { Container, StyledLabel, StyledInput, ButtonEye } from "./styles";

const InputFormPassword = ({ label, placeholder, value, onChange, error }) => {
  const [visible, setVisible] = useState(false);
  return (
    <Container>
      <StyledLabel $error={error}>{label}</StyledLabel>
      <StyledInput
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        type={visible ? "text" : "password"}
        $error={error}
      />
      <ButtonEye onClick={() => setVisible(!visible)}>
        {visible ? (
          <Image src="/eye-on.svg" alt="Logo" width={20} height={20} />
        ) : (
          <Image src="/eye-off.svg" alt="Logo" width={20} height={20} />
        )}
      </ButtonEye>
    </Container>
  );
};

export default InputFormPassword;
