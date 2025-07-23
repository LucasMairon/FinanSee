"use client";
import React from "react";

// Libs
import { FiLock } from "react-icons/fi";
import { toast } from "react-hot-toast";

// Components
import NavBarMenu from "@/components/NavBarMenu";
import { ChangePasswordModal } from "@/app/profile/ChangePasswordModal";
import { EditProfileModal } from "./EditProfileModal";
import { DeletAccount } from "@/app/profile/DeletAccount";

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
  const handleChangePassword = (data) => {
    console.log("Dados para enviar para a API:", data);

    try {
      toast.success("Senha alterada com sucesso!");
    } catch (error) {
      console.log("Erro ao alterar senha:", error);
      toast.error("Não foi possível alterar a senha.");
    }
  };

  const handleProfileUpdate = async (data) => {
    console.log("Dados para enviar para a API:", data);

    try {
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      console.log("Erro ao atualizar perfil:", error);
      toast.error("Não foi possível atualizar o perfil.");
    }
  };

  const handleDeleteAccount = () => {
    console.log("Conta deletada com sucesso!");
    try {
      toast.success("Conta deletada com sucesso!");
    } catch (error) {
      console.log("Erro ao deletar conta:", error);
      toast.error("Não foi possível deletar a conta.");
      return;
    }
  };

  return (
    <Container>
      <NavBarMenu active={"profile"} />
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
            <ChangePasswordModal onSubmit={handleChangePassword}>
              <Button>Alterar senha</Button>
            </ChangePasswordModal>
            <EditProfileModal
              emailProp={userData.email}
              phoneProp={userData.phone}
              moneyProp={userData.monthlyIncome}
              onSubmit={handleProfileUpdate}
            >
              <Button variant="primary">Editar perfil</Button>
            </EditProfileModal>
            <DeletAccount onSubmit={handleDeleteAccount}>
              <Button variant="danger">Deletar conta</Button>
            </DeletAccount>
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
