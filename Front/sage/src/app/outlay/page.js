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
import Image from "next/image";

// Components
import NavBarMenu from "@/components/NavBarMenu";

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
} from "./styles";

// --- DADOS MOCADOS ---
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
// --- FIM DOS DADOS MOCADOS ---

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
            <Button $primary>+ Nova Despesa</Button>
            <Button>+ Nova Categoria</Button>
          </Actions>
        </Header>

        {/* Seção de cartões de resumo */}
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

        {/* Seção do gráfico de evolução */}
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

        {/* Seção da tabela de despesas */}
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
                    <td>{expense.nome}</td>
                    <td>
                      <CategoryTag category={expense.categoria}>
                        {expense.categoria}
                      </CategoryTag>
                    </td>
                    <td>{expense.descricao}</td>
                    <td>{expense.data}</td>
                    <td>- R${expense.valor.toFixed(2).replace(".", ",")}</td>
                    <td>
                      <StatusBadge status={expense.status}>
                        {expense.status}
                      </StatusBadge>
                    </td>
                    <td>
                      <Image
                        src="/Alert.svg"
                        alt="Logo"
                        width={20}
                        height={20}
                      />
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
