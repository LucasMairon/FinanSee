"use client";
import React, { useEffect } from "react";

// Libs
import { FiLock } from "react-icons/fi";
import { toast } from "react-hot-toast";

// Context
import { useAuth } from "@/hooks/context";

// Components
import NavBarMenu from "@/components/NavBarMenu";
import { ChangePasswordModal } from "@/app/(protected)/profile/ChangePasswordModal";
import { EditProfileModal } from "./EditProfileModal";
import { DeletAccount } from "@/app/(protected)/profile/DeletAccount";

// Validators
import { formatDate, getInitials } from "@/validators";

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
import { cpfMask, moneyMask, phoneMask } from "@/validators/mask";

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
  const { userData, updateUser, updatePassword, getUser, deleteAccount } =
    useAuth();

  const handleChangePassword = (data) => {
    try {
      updatePassword(data?.currentPassword, data?.newPassword);
    } catch (error) {
      console.log("Erro ao alterar senha:", error);
    }
  };

  const handleProfileUpdate = async (data) => {
    try {
      updateUser(
        data?.name,
        data?.cpf,
        data?.email,
        data?.date_of_birth,
        data?.phone,
        data?.money
      );
    } catch (error) {
      console.log("Erro ao atualizar perfil:", error);
    }
  };

  const handleDeleteAccount = (currentPassword) => {
    try {
      deleteAccount(currentPassword);
    } catch (error) {
      console.log("Erro ao deletar conta:", error);
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
            <Initials>{getInitials(userData?.name)}</Initials>
          </Avatar>
          <UserInfo>
            <UserName>{userData?.name}</UserName>
            <Greeting>Olá, Bom dia!</Greeting>
          </UserInfo>
          <Actions>
            <ChangePasswordModal onSubmit={handleChangePassword}>
              <Button>Alterar senha</Button>
            </ChangePasswordModal>
            <EditProfileModal
              emailProp={userData?.email}
              phoneProp={userData?.phone_number}
              moneyProp={userData?.income}
              onSubmit={handleProfileUpdate}
              dataOfBirthProp={userData?.date_of_birth}
              nameProp={userData?.name}
              cpfProp={userData?.cpf}
            >
              <Button variant="primary">Editar perfil</Button>
            </EditProfileModal>
            <DeletAccount onSubmit={handleDeleteAccount}>
              <Button variant="danger">Deletar conta</Button>
            </DeletAccount>
          </Actions>
        </ProfileHeader>

        <ProfileDetails>
          <DetailItem label="Nome" value={userData?.name} />
          <DetailItem label="E-mail" value={userData?.email} />
          <DetailItem
            label="Telefone"
            value={phoneMask(userData?.phone_number)}
          />
          <DetailItem label="CPF" value={cpfMask(userData?.cpf)} />
          <DetailItem
            label="Renda mensal"
            value={`R$ ${moneyMask(userData?.income)}`}
          />
          <DetailItem
            label="Data de nascimento"
            value={formatDate(userData?.date_of_birth)}
          />
        </ProfileDetails>
      </MainContent>
    </Container>
  );
}
