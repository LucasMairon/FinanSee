"use client";
import React from "react";

// Libs
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Components
import NavBarMenu from "@/components/NavBarMenu";

// Context
import { useAuth } from "@/hooks/context";

// Validators
import { formatCurrency } from "@/validators";

// Styles
import {
  Card,
  ChartContainer,
  Container,
  Header,
  MainContent,
  StatusBadge,
  SummaryContainer,
  TransactionRow,
  TransactionsContainer,
  TransactionTable,
} from "./styles";

const chartData = [
  { name: "Jan", Receita: 4000, Despesa: 2400 },
  { name: "Fev", Receita: 3000, Despesa: 3398 },
  { name: "Mar", Receita: 2000, Despesa: 1800 },
  { name: "Abr", Receita: 3780, Despesa: 2908 },
  { name: "Mai", Receita: 4890, Despesa: 3800 },
  { name: "Jun", Receita: 2390, Despesa: 3800 },
  { name: "Jul", Receita: 3490, Despesa: 2300 },
  { name: "Ago", Receita: 2490, Despesa: 2800 },
  { name: "Set", Receita: 3490, Despesa: 1900 },
  { name: "Out", Receita: 3490, Despesa: 2500 },
  { name: "Nov", Receita: 2800, Despesa: 3100 },
  { name: "Dez", Receita: 3200, Despesa: 1800 },
];

const transactionsData = [
  {
    name: "Freelancer",
    date: "Dom, 20 Abr 2025",
    value: 500.0,
    type: "income",
  },
  { name: "Almoço", date: "Sáb, 19 Abr 2025", value: -17.8, type: "expense" },
  {
    name: "Gasolina",
    date: "Sáb, 19 Abr 2025",
    value: -80.09,
    type: "expense",
  },
  { name: "Padaria", date: "Sáb, 19 Abr 2025", value: -10.55, type: "expense" },
  { name: "Spotify", date: "Sáb, 19 Abr 2025", value: -19.0, type: "expense" },
];

export default function Dashboard() {
  const { userData } = useAuth();

  const getFirstSecondNameSelector = (name) => {
    const nameSplit = name?.split(" ");
    if (nameSplit) {
      if (nameSplit?.length > 1) {
        return `${nameSplit[0]}`;
      }

      return nameSplit[0];
    }

    return "";
  };

  return (
    <Container>
      <NavBarMenu active={"dashboard"} />

      <MainContent>
        <Header>
          <h1>Bem vindo, {getFirstSecondNameSelector(userData?.name)}!</h1>
          <p>Aqui está um resumo da sua situação financeira atual</p>
        </Header>

        <SummaryContainer>
          <Card>
            <div className="card-header">
              <span>RECEITA MENSAL</span>
              <span className="percentage">+2.39%</span>
            </div>
            <div className="value">R$ 4.401,60</div>
            <div className="last-update">Última atualização: 05/04/2025</div>
          </Card>
          <Card>
            <div className="card-header">
              <span>SALDO ATUAL</span>
              <span className="percentage">+1.39%</span>
            </div>
            <div className="value">R$ 2.345,80</div>
            <div className="last-update">Última atualização: 17hrs</div>
          </Card>
          <Card>
            <div className="card-header">
              <span>DESPESA ATUAL</span>
              <span className="percentage">+1.28%</span>
            </div>
            <div className="value">R$ 2.055,80</div>
            <div className="last-update">Última atualização: 17hrs</div>
          </Card>
        </SummaryContainer>

        <ChartContainer>
          <div className="chart-header">
            <div className="title-section">
              <h3>Evolução Financeira</h3>
              <p>Última atualização: 23/04/2025</p>
            </div>
            <div className="legend">
              <div className="legend-item">
                <div className="legend-color legend-income"></div>
                <span>Receita</span>
              </div>
              <div className="legend-item">
                <div className="legend-color legend-expense"></div>
                <span>Despesa</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis
                tickFormatter={(value) => `${value / 1000}K`}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                cursor={{ fill: "rgba(230, 230, 230, 0.5)" }}
                contentStyle={{
                  borderRadius: "8px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <Bar dataKey="Receita" fill="#28a745" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Despesa" fill="#dc3545" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <TransactionsContainer>
          <div className="transactions-header">
            <h3>Transações Recentes</h3>
          </div>
          <TransactionTable>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Data</th>
                <th>Valor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactionsData.map((trans, index) => (
                <TransactionRow key={index}>
                  <td>{trans.name}</td>
                  <td>{trans.date}</td>
                  <td
                    className={
                      trans.type === "income" ? "value-income" : "value-expense"
                    }
                  >
                    {trans.type === "income"
                      ? `+${formatCurrency(trans.value)}`
                      : formatCurrency(trans.value)}
                  </td>
                  <td>
                    <StatusBadge type={trans.type}>
                      {trans.type === "income" ? "Receita" : "Despesa"}
                    </StatusBadge>
                  </td>
                </TransactionRow>
              ))}
            </tbody>
          </TransactionTable>
        </TransactionsContainer>
      </MainContent>
    </Container>
  );
}
