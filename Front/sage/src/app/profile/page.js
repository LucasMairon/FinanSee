"use client";
import React from "react";

// Libs
import Head from "next/head";
import { FiLock } from "react-icons/fi";

// Components
import NavBarMenu from "@/components/NavBarMenu";

// Styles
import {
  Actions,
  Avatar,
  Button,
  Container,
  DetailInfo,
  DetailLabel,
  DetailValue,
  Greeting,
  Header,
  Initials,
  MainContent,
  ProfileDetails,
  ProfileHeader,
  Subtitle,
  Title,
  UserInfo,
  UserName,
  DetailItem as DetailItemStyled,
} from "./styles";

// Dados do usuário (mock)
const userData = {
  name: "José Maria da Silva",
  email: "josemaria@email.com",
  phone: "(83) 94002-8922",
  cpf: "585.000.168-99",
  monthlyIncome: "R$ 4.000,00",
  birthDate: "01/04/2001",
  initials: "JM",
};

// Componente para renderizar cada item da lista de detalhes
// Agora ele usa o componente de estilo renomeado 'DetailItemStyled' e não chama a si mesmo.
const DetailItem = ({ label, value }) => (
  <DetailItemStyled>
    <DetailInfo>
      <DetailLabel>{label}</DetailLabel>
      <DetailValue>{value}</DetailValue>
    </DetailInfo>
    <FiLock color="#6b7280" size={20} />
  </DetailItemStyled>
);

export default function Profile() {
  return (
    <Container>
      {/* --- BARRA LATERAL --- */}
      <NavBarMenu active={"profile"} />

      {/* --- CONTEÚDO PRINCIPAL --- */}
      <Head>
        <title>Meu Perfil</title>
        {/* As fontes que você comentou foram mantidas assim. */}
        {/* <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin="true"
          /> */}
      </Head>
      <MainContent>
        <Header>
          <Title>Meu Perfil</Title>
          <Subtitle>Visualize e gerencie suas informações pessoais</Subtitle>
        </Header>

        <ProfileHeader>
          <Avatar>
            <Initials>{userData.initials}</Initials>
          </Avatar>
          <UserInfo>
            <UserName>{userData.name}</UserName>
            <Greeting>Olá, Bom dia!</Greeting>
          </UserInfo>
          <Actions>
            <Button>Alterar senha</Button>
            <Button variant="primary">Editar perfil</Button>
            <Button variant="danger">Deletar conta</Button>
          </Actions>
        </ProfileHeader>

        <ProfileDetails>
          <DetailItem label="Nome" value={userData.name} />
          <DetailItem label="E-mail" value={userData.email} />
          <DetailItem label="Telefone" value={userData.phone} />
          <DetailItem label="CPF" value={userData.cpf} />
          <DetailItem label="Renda mensal" value={userData.monthlyIncome} />
          <DetailItem label="Data de nascimento" value={userData.birthDate} />
        </ProfileDetails>
      </MainContent>
    </Container>
  );
}
