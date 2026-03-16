import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PieChart, DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

const FinancialReport = () => {
  return (
    <AppLayout>
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Relatório Financeiro</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Visão geral financeira de projetos e despesas
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Placeholder cards for financial overview */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 45.231,89</div>
            <p className="text-xs text-muted-foreground">
              +20.1% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Despesas</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 12.054,00</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingDown className="h-3 w-3 text-emerald-500" />
              <span className="text-emerald-500">4%</span> em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 33.177,89</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="text-emerald-500">+12.5%</span> em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              Positivo
              <Badge variant="default" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 shadow-none border-0">Saudável</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Fluxo de caixa dentro do esperado
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Placeholder for future charts or detailed tables */}
      <div className="mt-8 rounded-xl border border-border bg-card p-6 flex flex-col items-center justify-center min-h-[300px] text-center">
        <div className="mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
          <PieChart className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-medium text-foreground">Gráficos Detalhados</h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-md">
          Esta área está reservada para visualizações detalhadas do fluxo de caixa, despesas por projeto e projeções financeiras.
        </p>
      </div>
    </AppLayout>
  );
};

export default FinancialReport;
