"use client";

import React from "react";
import Image from "next/image";

// Supondo que o NavBarMenu esteja em /components/NavBarMenu
import NavBarMenu from "@/components/NavBarMenu";

// Importando os componentes estilizados
import {
  PageContainer,
  MainContent,
  Header,
  HeaderInfo,
  Title,
  Subtitle,
  HeaderActions,
  SearchInput,
  NewCategoryButton,
  CategoriesGrid,
  CategoryCard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardActions,
  IconButton,
} from "./styles";

// Mock data para as categorias
const categoriesData = [
  {
    title: "Moradia",
    description:
      "Despesas relacionadas à habitação, como aluguel, prestação do financiamento, condomínio, IPTU, contas de água, luz, gás, manutenção, reparos e reformas.",
  },
  { title: "Moradia", description: "..." },
  { title: "Moradia", description: "..." },
  { title: "Moradia", description: "..." },
  { title: "Moradia", description: "..." },
  { title: "Moradia", description: "..." },
  { title: "Moradia", description: "..." },
  { title: "Moradia", description: "..." },
  { title: "Moradia", description: "..." },
];

// Ícones como componentes React para facilitar o uso
const EditIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const DeleteIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const CategoriesPage = () => {
  categoriesData[1].description = categoriesData[0].description;
  categoriesData[2].description = categoriesData[0].description;
  categoriesData[3].description = categoriesData[0].description;
  categoriesData[4].description = categoriesData[0].description;
  categoriesData[5].description = categoriesData[0].description;
  categoriesData[6].description = categoriesData[0].description;
  categoriesData[7].description = categoriesData[0].description;
  categoriesData[8].description = categoriesData[0].description;

  return (
    <PageContainer>
      <NavBarMenu active="categories" />

      <MainContent>
        <Header>
          <HeaderInfo>
            <Title>Categorias</Title>
            <Subtitle>Gerencie e analise suas categorias</Subtitle>
          </HeaderInfo>
          <HeaderActions>
            <SearchInput placeholder="Pesquisar categoria..." />
            <NewCategoryButton>+ Nova Categoria</NewCategoryButton>
          </HeaderActions>
        </Header>

        <CategoriesGrid>
          {categoriesData.map((category, index) => (
            <CategoryCard key={index}>
              <CardActions>
                <IconButton aria-label="Editar categoria">
                  <EditIcon />
                </IconButton>
                <IconButton aria-label="Excluir categoria">
                  <DeleteIcon />
                </IconButton>
              </CardActions>
              <CardHeader>Categoria</CardHeader>
              <CardTitle>{category.title}</CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CategoryCard>
          ))}
        </CategoriesGrid>
      </MainContent>
    </PageContainer>
  );
};

export default CategoriesPage;
