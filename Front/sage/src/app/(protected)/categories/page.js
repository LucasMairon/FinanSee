"use client";
import React, { useEffect, useState } from "react";

// Components
import NavBarMenu from "@/components/NavBarMenu";
import { CategoryModal } from "@/app/(protected)/categories/CategoriesModal";
import { DeletCateroryModal } from "@/app/(protected)/categories/DeletCateroryModal";

// Context
import { useAuth } from "@/hooks/context";

// Styles
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
  TextEmpyty,
  ContainerEmpyty,
} from "./styles";

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
  const {
    getCategories,
    categories,
    createCategory,
    editCategory,
    deleteCategory,
  } = useAuth();

  const [filterCategories, setFilterCategories] = useState([]);
  const [searchCategory, setSearchCategory] = useState("");

  const handleSearchCategories = (list, search) => {
    if (!search || typeof search !== "string") {
      return list;
    }

    const normalizedText = search.toLowerCase();

    return list?.filter((item) => {
      const name = (item.name || "").toLowerCase();

      return name.includes(normalizedText);
    });
  };

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (categories) {
      setFilterCategories(categories);
    }
  }, [categories]);

  useEffect(() => {
    const categoriesAux = handleSearchCategories(categories, searchCategory);
    setFilterCategories(categoriesAux);
  }, [searchCategory]);

  const handleChangeCategory = (data) => {
    try {
      if (data?.type === "create") {
        createCategory(data.name, data.description);
      }
      if (data?.type === "edit") {
        editCategory(data.id, data.name, data.description);
      }
    } catch (error) {
      console.log("Erro ao criar categoria:", error);
      return;
    }
  };

  const handleDeleteCategory = (id) => {
    try {
      deleteCategory(id);
    } catch (error) {
      console.log("Erro ao deletar categoria:", error);
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
            <SearchInput
              placeholder="Pesquisar categoria..."
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
            />
            <CategoryModal type={"create"} onSubmit={handleChangeCategory}>
              <NewCategoryButton>+ Nova Categoria</NewCategoryButton>
            </CategoryModal>
          </HeaderActions>
        </Header>

        <CategoriesGrid>
          {filterCategories?.length === 0 ? (
            <ContainerEmpyty>
              <TextEmpyty>
                Nenhuma categoria encontrada. Crie uma nova categoria.
              </TextEmpyty>
            </ContainerEmpyty>
          ) : (
            <>
              {filterCategories?.map((category, index) => (
                <CategoryCard key={index}>
                  <CardActions>
                    <CategoryModal
                      type={"edit"}
                      nameProp={category.name}
                      descriptionProp={category.description}
                      idProp={category.id}
                      onSubmit={handleChangeCategory}
                    >
                      <IconButton>
                        <EditIcon />
                      </IconButton>
                    </CategoryModal>
                    <DeletCateroryModal
                      idProp={category.id}
                      onSubmmit={handleDeleteCategory}
                    >
                      <IconButton>
                        <DeleteIcon />
                      </IconButton>
                    </DeletCateroryModal>
                  </CardActions>
                  <CardHeader>Categoria</CardHeader>
                  <CardTitle>{category.name}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CategoryCard>
              ))}
            </>
          )}
        </CategoriesGrid>
      </MainContent>
    </PageContainer>
  );
};

export default CategoriesPage;
