import React, { Suspense, useMemo } from 'react';
import DashboardFilters from '@/components/dashboard/DashboardFilters';
import ExecutiveMetricsGrid from '@/components/dashboard/ExecutiveMetrics';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboardStore } from '@/stores/dashboardStore';
import { useDashboardData } from '@/hooks/useDashboardData';
import { buildDeliveryForecast, buildPortfolioProgress, buildRiskMap, buildWorkload, calculateExecutiveMetrics, filterDashboardData, type DashboardPeriod } from '@/lib/dashboardMetrics';

// Lazy‑load heavy chart components
const PortfolioProgressChart = React.lazy(() => import('@/components/dashboard/PortfolioProgressChart'));
const DeliveryForecastChart = React.lazy(() => import('@/components/dashboard/DeliveryForecastChart'));
const RiskMapChart = React.lazy(() => import('@/components/dashboard/RiskMapChart'));
const WorkloadChart = React.lazy(() => import('@/components/dashboard/WorkloadChart'));

const Index = () => {
  // Global filter state via Zustand store
  const { projectId, period, memberId, setProjectId, setPeriod, setMemberId, clearSelection } = useDashboardStore();

  // Fetch raw data from API (projects, history, team members)
  const { data: apiData, isLoading, isError } = useDashboardData();

  // Compute dashboard metrics once API data is available
  const dashboard = useMemo(() => {
    if (!apiData) return null;
    const { projects, projectHistory, teamMembers } = apiData;
    const referenceDate = projects.reduce(
      (latest, project) => (project.updatedAt > latest ? project.updatedAt : latest),
      projects[0]?.updatedAt ?? ''
    );
    const filtered = filterDashboardData(projects, projectHistory, { projectId, period, referenceDate });
    return {
      metrics: calculateExecutiveMetrics(filtered.projects),
      progress: buildPortfolioProgress(filtered.projects, filtered.history),
      forecast: buildDeliveryForecast(filtered.projects),
      risk: buildRiskMap(filtered.projects),
      workload: buildWorkload(filtered.projects),
      memberName: teamMembers.find((m) => m.id === memberId)?.name ?? null,
    };
  }, [apiData, memberId, period, projectId]);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex h-64 items-center justify-center text-muted-foreground">Carregando dados do dashboard…</div>
      </AppLayout>
    );
  }

  if (isError || !dashboard) {
    return (
      <AppLayout>
        <div className="flex h-64 items-center justify-center text-destructive">Erro ao carregar o dashboard. Verifique sua conexão ou as configurações de API.</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Desempenho do portfólio</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Acompanhe evolução, previsibilidade, riscos e capacidade operacional.
            </p>
          </div>
          <div className="flex flex-col gap-2 lg:items-end">
            <DashboardFilters
              projects={apiData.projects}
              projectId={projectId}
              period={period}
              onProjectChange={setProjectId}
              onPeriodChange={setPeriod}
              onClear={clearSelection}
            />
            {projectId !== 'all' && (
              <p className="text-xs text-muted-foreground">
                <span>{dashboard.metrics.totalProjects}/{dashboard.metrics.totalProjects}</span> projeto selecionado
              </p>
            )}
          </div>
        </header>

        <ExecutiveMetricsGrid metrics={dashboard.metrics} />

        <div className="grid gap-6 xl:grid-cols-2">
          <Card className="min-w-0">
            <CardHeader>
              <CardTitle className="text-base">Evolução do portfólio</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div className="text-center py-8">Carregando gráfico…</div>}>
                <PortfolioProgressChart data={dashboard.progress} />
              </Suspense>
            </CardContent>
          </Card>
          <Card className="min-w-0">
            <CardHeader>
              <CardTitle className="text-base">Previsão de entrega</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div className="text-center py-8">Carregando gráfico…</div>}>
                <DeliveryForecastChart data={dashboard.forecast} onProjectSelect={setProjectId} />
              </Suspense>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card className={`min-w-0 ${memberId ? 'border-primary/50' : ''}`} data-highlighted-member={memberId ?? undefined}>
            <CardHeader>
              <CardTitle className="text-base">Mapa de risco</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div className="text-center py-8">Carregando gráfico…</div>}>
                <RiskMapChart data={dashboard.risk} onProjectSelect={setProjectId} />
              </Suspense>
            </CardContent>
          </Card>
          <Card className={`min-w-0 ${memberId ? 'border-primary/50' : ''}`} data-highlighted-member={memberId ?? undefined}>
            <CardHeader className="flex-row items-center justify-between gap-2">
              <CardTitle className="text-base">Carga por responsável</CardTitle>
              {dashboard.memberName && (
                <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  Destaque: {dashboard.memberName}
                </span>
              )}
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div className="text-center py-8">Carregando gráfico…</div>}>
                <WorkloadChart data={dashboard.workload} onMemberSelect={setMemberId} />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
