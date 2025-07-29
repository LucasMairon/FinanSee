"use client";
import React, { useEffect, useState } from "react";

// Libs
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Context
import { useAuth } from "@/hooks/context";

// Components
import NavBarMenu from "@/components/NavBarMenu";
import { NewOutlayModal } from "@/app/(protected)/outlay/NewOutlayModal";

// Validators
import { moneyMask } from "@/validators/mask";
import { formatDate } from "@/validators";

// Styles
import {
  PageWrapper,
  Container,
  Actions,
  Button,
  Card,
  CardFooter,
  CardTitle,
  CardValue,
  CategoryTag,
  ChartWrapper,
  FilterActions,
  Header,
  Input,
  SectionContainer,
  SectionHeader,
  SectionTitle,
  Select,
  StatusBadge,
  Subtitle,
  SummaryContainer,
  Table,
  TableWrapper,
  Title,
  ButtonDownload,
  GlobalTooltipStyle,
  ActionIcon,
} from "./styles";

const ExportIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 15L12 3M12 15L8 11M12 15L16 11"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const AlertIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    const startDate = formatDate(data.start_date, "dd/MMM");
    const endDate = formatDate(data.end_date, "dd/MMM");
    const dateLabel = `${startDate} - ${endDate}`;

    const valueLabel = `R$ ${data?.total_expense
      ?.toFixed(2)
      .replace(".", ",")}`;

    return (
      <div className="custom-tooltip">
        <p className="label-date">{dateLabel}</p>
        <p className="label-value">{valueLabel}</p>
      </div>
    );
  }

  return null;
};

const Outlay = () => {
  const {
    getCategories,
    categories,
    getOutlays,
    createOutlay,
    outlays,
    outlayForms,
    getOutlayForms,
    editOutlay,
  } = useAuth();

  const [outlayFilter, setOutlayFilter] = useState([]);

  const [searchOutlay, setSearchOutlay] = useState("");
  const [filterCategories, setFilterCategories] = useState({});

  const filterOutlaySearch = (list, search) => {
    if (!search || typeof search !== "string") {
      return list;
    }

    const normalizedText = search.toLowerCase();

    return list?.filter((item) => {
      const name = (item.name || "").toLowerCase();
      const description = (item.description || "").toLowerCase();

      return (
        name.includes(normalizedText) || description.includes(normalizedText)
      );
    });
  };

  const filterOutlayCategories = (list, category) => {
    if (category === "Todas as categorias" || !category) {
      return list;
    }

    return list?.filter((item) => {
      if (item?.categories[0]?.id) {
        return item?.categories[0]?.id === category;
      }
    });
  };

  useEffect(() => {
    getOutlays();
    getOutlayForms();
    getCategories();
  }, []);

  useEffect(() => {
    if (outlays) {
      setOutlayFilter(outlays);
    }
  }, [outlays]);

  useEffect(() => {
    const outlayAux = filterOutlaySearch(outlays, searchOutlay);
    setOutlayFilter(outlayAux);
  }, [searchOutlay]);

  useEffect(() => {
    const outlayAux = filterOutlayCategories(outlays, filterCategories);
    setOutlayFilter(outlayAux);
  }, [filterCategories]);

  const handleChangeOutlay = (data) => {
    try {
      if (data?.type === "create") {
        createOutlay(
          data.name,
          data.description,
          data.value,
          data.date,
          data.category,
          data.status
        );
      }

      if (data?.type === "edit") {
        editOutlay(
          data?.id,
          data.name,
          data.description,
          data.value,
          data.date,
          data.category,
          data.status
        );
      }
    } catch (error) {
      console.error("Erro ao criar/editar despesa:", error);
      return;
    }
  };

  return (
    <>
      <GlobalTooltipStyle />
      <PageWrapper>
        <NavBarMenu active={"outlay"} />
        <Container>
          <Header>
            <div>
              <Title>Despesas</Title>
              <Subtitle>Gerencie e analise seus gastos mensais</Subtitle>
            </div>
            <Actions>
              <NewOutlayModal
                categories={categories}
                onSubmit={handleChangeOutlay}
                typeProp="create"
              >
                <Button>+ Nova Despesa</Button>
              </NewOutlayModal>
              <ButtonDownload>
                <ExportIcon />
              </ButtonDownload>
            </Actions>
          </Header>

          <SummaryContainer>
            <Card>
              <CardTitle>MAIOR CATEGORIA</CardTitle>
              <CardValue>
                {outlayForms?.category_that_appears_most?.name}
              </CardValue>
              <CardFooter>
                Última atualização: {formatDate(outlayForms?.month)}
              </CardFooter>
            </Card>
            <Card>
              <CardTitle>MÉDIA DIÁRIA</CardTitle>
              <CardValue>
                R$ {outlayForms?.daily_average?.toFixed(2).replace(".", ",")}
              </CardValue>
              <CardFooter>
                Última atualização: {formatDate(outlayForms?.month)}
              </CardFooter>
            </Card>
            <Card>
              <CardTitle>DESPESA ATUAL</CardTitle>
              <CardValue>
                R$ {outlayForms?.monthly_expense?.toFixed(2).replace(".", ",")}
              </CardValue>
              <CardFooter>
                Última atualização: {formatDate(outlayForms?.month)}
              </CardFooter>
            </Card>
          </SummaryContainer>

          <SectionContainer>
            <SectionHeader>
              <SectionTitle>EVOLUÇÃO DIÁRIA</SectionTitle>
            </SectionHeader>
            <ChartWrapper>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={outlayForms?.daily_evolution}
                  margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
                >
                  <XAxis
                    dataKey="total_expense"
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `${value / 1000}k`}
                  />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    content={<CustomTooltip />}
                  />
                  <Bar dataKey="total_expense" radius={[5, 5, 5, 5]}>
                    {outlayForms?.daily_evolution?.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={"#FF4F4F"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartWrapper>
          </SectionContainer>

          <SectionContainer>
            <SectionHeader>
              <div>
                <SectionTitle>DESPESAS</SectionTitle>
                <Subtitle>
                  Última atualização: {formatDate(outlayForms?.month)}
                </Subtitle>
              </div>
              <FilterActions>
                <Input
                  placeholder="🔍 Pesquisar despesa"
                  value={searchOutlay}
                  onChange={(e) => setSearchOutlay(e.target.value)}
                />
                <Select
                  value={filterCategories}
                  onChange={(e) => setFilterCategories(e.target.value)}
                >
                  <option>Todas as categorias</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </Select>
              </FilterActions>
            </SectionHeader>
            <TableWrapper>
              <Table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Categoria</th>
                    <th>Descrição</th>
                    <th>Data</th>
                    <th>Valor</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {outlayFilter?.map((expense) => (
                    <tr key={expense.id}>
                      <td data-label="Nome">{expense?.name}</td>
                      <td data-label="Categoria">
                        <CategoryTag>
                          {expense?.categories[0]?.name || ""}
                        </CategoryTag>
                      </td>
                      <td data-label="Descrição">{expense?.description}</td>
                      <td data-label="Data">{formatDate(expense?.date)}</td>
                      <td data-label="Valor">
                        - R${moneyMask(expense?.value)}
                      </td>
                      <td data-label="Status">
                        <StatusBadge status={expense?.status}>
                          {expense?.status == "P" ? "Pago" : "A pagar"}
                        </StatusBadge>
                      </td>
                      <NewOutlayModal
                        categories={categories}
                        onSubmit={handleChangeOutlay}
                        data={expense}
                        typeProp="view"
                      >
                        <ActionIcon>
                          <AlertIcon />
                        </ActionIcon>
                      </NewOutlayModal>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableWrapper>
          </SectionContainer>
        </Container>
      </PageWrapper>
    </>
  );
};

export default Outlay;
