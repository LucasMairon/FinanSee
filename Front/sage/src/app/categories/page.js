"use client";
import React from "react";

// Libs
import { toast } from "react-hot-toast";

// Components
import NavBarMenu from "@/components/NavBarMenu";
import { CategoryModal } from "@/app/categories/CategoriesModal";
import { DeletCateroryModal } from "@/app/categories/DeletCateroryModal";

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
    stroke="#000000"
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
    stroke="#E41414"
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

  const handleChangeCategory = (data) => {
    try {
      console.log("CRIANDO categoria:", data);

      if (data?.type === "create") {
        toast.success("Categoria criada com sucesso!");
      }
      if (data?.type === "edit") {
        toast.success("Categoria editada com sucesso!");
      }
    } catch (error) {
      console.log("Erro ao criar categoria:", error);
      toast.error("Erro ao criar categoria. Tente novamente.");
      return;
    }
  };

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
            <CategoryModal type={"create"} onSubmit={handleChangeCategory}>
              <NewCategoryButton>+ Nova Categoria</NewCategoryButton>
            </CategoryModal>
          </HeaderActions>
        </Header>

        <CategoriesGrid>
          {categoriesData.map((category, index) => (
            <CategoryCard key={index}>
              <CardActions>
                <CategoryModal
                  type={"edit"}
                  nameProp={category.title}
                  descriptionProp={category.description}
                  onSubmit={handleChangeCategory}
                >
                  <IconButton>
                    <EditIcon />
                  </IconButton>
                </CategoryModal>
                <DeletCateroryModal>
                  <IconButton>
                    <DeleteIcon />
                  </IconButton>
                </DeletCateroryModal>
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
