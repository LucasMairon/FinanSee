// Styles
import { Wrapper, Row, Tagline } from "./styles";
import Image from "next/image";

export default function LeftPanel() {
  return (
    <Wrapper>
      <Image src="/Logo.svg" alt="Logo" width={400} height={300} />
      <Row>
        <Tagline>
          <h2>Gerencie seus Gastos</h2>
          <p>Clareza, controle e consciência financeira.</p>
        </Tagline>
        <Image
          src="/BrazucaSitting.svg"
          alt="Ilustração"
          width={300}
          height={400}
        />
      </Row>
    </Wrapper>
  );
}
