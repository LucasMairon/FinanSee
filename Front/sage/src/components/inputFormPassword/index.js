import React, { useState } from "react";

// Libs
import Image from "next/image";

// Styles
import { Container, StyledLabel, StyledInput, ButtonEye } from "./styles";

const InputFormPassword = ({ label, placeholder, value, onChange }) => {
  const [visible, setVisible] = useState(false);
  return (
    <Container suppressHydrationWarning>
      <StyledLabel suppressHydrationWarning>{label}</StyledLabel>
      <StyledInput
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        type={visible ? "text" : "password"}
        suppressHydrationWarning
      />
      <ButtonEye suppressHydrationWarning onClick={() => setVisible(!visible)}>
        {visible ? (
          <Image
            suppressHydrationWarning
            src="/eye-on.svg"
            alt="Logo"
            width={20}
            height={20}
          />
        ) : (
          <Image
            suppressHydrationWarning
            src="/eye-off.svg"
            alt="Logo"
            width={20}
            height={20}
          />
        )}
      </ButtonEye>
    </Container>
  );
};

export default InputFormPassword;
