"use client";
import React from "react";

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

// Components
import NavBarMenu from "@/components/NavBarMenu";
import { NewOutlayModal } from "@/app/outlay/NewOutlayModal";

// Styles
import {
  PageWrapper,
  Container,
  Actions,
  Button,
  Card,
  CardFooter,
  CardTitle,
  CardTrendUp,
  CardValue,
  CategoryTag,
  ChartWrapper,
  FilterActions,
  Header,
  Input,
  Legend,
  LegendColorBox,
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

const summaryData = {
  maiorCategoria: "Moradia",
  mediaDiaria: 45.8,
  despesaAtual: 2055.8,
};

const evolutionData = [
  { name: "5", value: 2800 },
  { name: "10", value: 3800, highlight: true, label: "Maio 2025\nR$150,00" },
  { name: "15", value: 2000 },
  { name: "20", value: 3100 },
  { name: "25", value: 3400 },
  { name: "30", value: 2200 },
];

const expensesData = [
  {
    id: 1,
    nome: "Netflix",
    categoria: "Lazer",
    descricao: "Fatura Netflix",
    data: "Dom, 20 Abr 2025",
    valor: 30.09,
    status: "Pago",
  },
  {
    id: 2,
    nome: "Agiota",
    categoria: "Outros",
    descricao: "Dinheiro emprestado",
    data: "Sáb, 19 Abr 2025",
    valor: 170.1,
    status: "A pagar",
  },
  {
    id: 3,
    nome: "Almoço",
    categoria: "Alimentação",
    descricao: "Delivery",
    data: "Sáb, 19 Abr 2025",
    valor: 30.09,
    status: "Pago",
  },
  {
    id: 4,
    nome: "Gasolina",
    categoria: "Transporte",
    descricao: "Completou o tanque",
    data: "Sáb, 19 Abr 2025",
    valor: 30.09,
    status: "Pago",
  },
  {
    id: 5,
    nome: "Aluguel",
    categoria: "Moradia",
    descricao: "Aluguel apto",
    data: "Sáb, 19 Abr 2025",
    valor: 750.0,
    status: "A pagar",
  },
  {
    id: 6,
    nome: "Remédio",
    categoria: "Saúde",
    descricao: "Dipirona",
    data: "Sáb, 19 Abr 2025",
    valor: 30.09,
    status: "Pago",
  },
  {
    id: 7,
    nome: "Escola",
    categoria: "Educação",
    descricao: "Fatura escola",
    data: "Sáb, 19 Abr 2025",
    valor: 30.09,
    status: "A pagar",
  },
  {
    id: 8,
    nome: "Cinema",
    categoria: "Lazer",
    descricao: "Shopping",
    data: "Sáb, 19 Abr 2025",
    valor: 30.09,
    status: "Pago",
  },
];

const Outlay = () => {
  return (
    <PageWrapper>
      <NavBarMenu active={"outlay"} />
      <Container>
        <Header>
          <div>
            <Title>Despesas</Title>
            <Subtitle>Gerencie e analise seus gastos mensais</Subtitle>
          </div>
          <Actions>
            <NewOutlayModal title="Criar Despesa">
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
            <CardValue>{summaryData.maiorCategoria}</CardValue>
            <CardFooter>Última atualização: 05/04/2025</CardFooter>
          </Card>
          <Card>
            <CardTitle>
              MÉDIA DIÁRIA <CardTrendUp>+1.28%</CardTrendUp>
            </CardTitle>
            <CardValue>
              R$ {summaryData.mediaDiaria.toFixed(2).replace(".", ",")}
            </CardValue>
            <CardFooter>Última atualização: 17hrs</CardFooter>
          </Card>
          <Card>
            <CardTitle>
              DESPESA ATUAL <CardTrendUp>+1.28%</CardTrendUp>
            </CardTitle>
            <CardValue>
              R$ {summaryData.despesaAtual.toFixed(2).replace(".", ",")}
            </CardValue>
            <CardFooter>Última atualização: 17hrs</CardFooter>
          </Card>
        </SummaryContainer>

        <SectionContainer>
          <SectionHeader>
            <SectionTitle>EVOLUÇÃO DIÁRIA</SectionTitle>
            <FilterActions>
              <Select>
                <option>Maio</option>
                <option>Junho</option>
                <option>Julho</option>
              </Select>
              <Legend>
                <LegendColorBox /> Despesa
              </Legend>
            </FilterActions>
          </SectionHeader>
          <ChartWrapper>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={evolutionData}
                margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
              >
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <Tooltip
                  cursor={{ fill: "transparent" }}
                  contentStyle={{ display: "none" }}
                />
                <Bar dataKey="value" radius={[5, 5, 5, 5]}>
                  {evolutionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.highlight ? "#FF4F4F" : "#FFC2C2"}
                    />
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
              <Subtitle>Última atualização: 17hrs</Subtitle>
            </div>
            <FilterActions>
              <Input placeholder="🔍 Pesquisar despesa" />
              <Select>
                <option>Junho 2025</option>
              </Select>
              <Select>
                <option>Todas as categorias</option>
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
                {expensesData.map((expense) => (
                  <tr key={expense.id}>
                    <td data-label="Nome">{expense.nome}</td>
                    <td data-label="Categoria">
                      <CategoryTag category={expense.categoria}>
                        {expense.categoria}
                      </CategoryTag>
                    </td>
                    <td data-label="Descrição">{expense.descricao}</td>
                    <td data-label="Data">{expense.data}</td>
                    <td data-label="Valor">
                      - R${expense.valor.toFixed(2).replace(".", ",")}
                    </td>
                    <td data-label="Status">
                      <StatusBadge status={expense.status}>
                        {expense.status}
                      </StatusBadge>
                    </td>
                    <td data-label="Ações">
                      <AlertIcon />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrapper>
        </SectionContainer>
      </Container>
    </PageWrapper>
  );
};

export default Outlay;
