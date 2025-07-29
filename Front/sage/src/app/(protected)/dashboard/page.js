"use client";
import React, { useEffect } from "react";

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
import { formatCurrency, formatDate } from "@/validators";

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

export default function Dashboard() {
  const {
    userData,
    outlayFormsCurrent,
    getOutlayFormsCurrent,
    outlayEvolution,
    getOutlayEvolution,
  } = useAuth();

  useEffect(() => {
    getOutlayFormsCurrent();
    getOutlayEvolution();
  }, []);

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
            </div>
            <div className="value">
              R${" "}
              {outlayFormsCurrent?.user_balance?.toFixed(2).replace(".", ",")}
            </div>
            <div className="last-update">
              Última atualização: {formatDate(outlayFormsCurrent?.month)}
            </div>
          </Card>
          <Card>
            <div className="card-header">
              <span>SALDO ATUAL</span>
            </div>
            <div className="value">
              R$ {outlayFormsCurrent?.balance?.toFixed(2).replace(".", ",")}
            </div>
            <div className="last-update">
              Última atualização: {formatDate(outlayFormsCurrent?.month)}
            </div>
          </Card>
          <Card>
            <div className="card-header">
              <span>DESPESA ATUAL</span>
            </div>
            <div className="value">
              R${" "}
              {outlayFormsCurrent?.monthly_expense
                ?.toFixed(2)
                .replace(".", ",")}
            </div>
            <div className="last-update">
              Última atualização: {formatDate(outlayFormsCurrent?.month)}
            </div>
          </Card>
        </SummaryContainer>

        <ChartContainer>
          <div className="chart-header">
            <div className="title-section">
              <h3>Evolução Financeira</h3>
              <p>Última atualização: {formatDate(outlayFormsCurrent?.month)}</p>
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
              data={outlayEvolution?.financial_evolution}
              margin={{ top: 5, right: 20, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="month_abbreviation"
                tickLine={false}
                axisLine={false}
              />
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
              <Bar
                dataKey={(entry) => entry.data.user_balance}
                fill="#28a745"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey={(entry) => entry.data.monthly_expense}
                fill="#dc3545"
                radius={[4, 4, 0, 0]}
              />
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
              {outlayFormsCurrent?.expenses?.map((trans, index) => (
                <TransactionRow key={index}>
                  <td>{trans.name}</td>
                  <td>{formatDate(trans.date)}</td>
                  <td
                    className={
                      trans.type === "income" ? "value-income" : "value-expense"
                    }
                  >
                    {trans.type === "income"
                      ? `+ R$${formatCurrency(trans.value)}`
                      : `- R$${formatCurrency(trans.value)}`}
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
