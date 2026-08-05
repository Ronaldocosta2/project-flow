import { useMemo, useState } from 'react';
import DashboardFilters from '@/components/dashboard/DashboardFilters';
import DeliveryForecastChart from '@/components/dashboard/DeliveryForecastChart';
import ExecutiveMetricsGrid from '@/components/dashboard/ExecutiveMetrics';
import PortfolioProgressChart from '@/components/dashboard/PortfolioProgressChart';
import RiskMapChart from '@/components/dashboard/RiskMapChart';
import WorkloadChart from '@/components/dashboard/WorkloadChart';
import AppLayout from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { projectHistory, projects, teamMembers } from '@/data/mockData';
import {
  buildDeliveryForecast,
  buildPortfolioProgress,
  buildRiskMap,
  buildWorkload,
  calculateExecutiveMetrics,
  filterDashboardData,
  type DashboardPeriod,
} from '@/lib/dashboardMetrics';

const Index = () => {
  const [projectId, setProjectId] = useState('all');
  const [period, setPeriod] = useState<DashboardPeriod>(90);
  const [memberId, setMemberId] = useState<string | null>(null);

  const dashboard = useMemo(() => {
    const referenceDate = projects.reduce(
      (latest, project) => project.updatedAt > latest ? project.updatedAt : latest,
      projects[0]?.updatedAt ?? '',
    );
    const filtered = filterDashboardData(projects, projectHistory, { projectId, period, referenceDate });

    return {
      metrics: calculateExecutiveMetrics(filtered.projects),
      progress: buildPortfolioProgress(filtered.projects, filtered.history),
      forecast: buildDeliveryForecast(filtered.projects),
      risk: buildRiskMap(filtered.projects),
      workload: buildWorkload(filtered.projects),
      memberName: teamMembers.find(member => member.id === memberId)?.name ?? null,
    };
  }, [memberId, period, projectId]);

  const clearSelection = () => {
    setProjectId('all');
    setMemberId(null);
  };

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
              projects={projects}
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
              <PortfolioProgressChart data={dashboard.progress} />
            </CardContent>
          </Card>
          <Card className="min-w-0">
            <CardHeader>
              <CardTitle className="text-base">Previsão de entrega</CardTitle>
            </CardHeader>
            <CardContent>
              <DeliveryForecastChart data={dashboard.forecast} onProjectSelect={setProjectId} />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <Card className={`min-w-0 ${memberId ? 'border-primary/50' : ''}`} data-highlighted-member={memberId ?? undefined}>
            <CardHeader>
              <CardTitle className="text-base">Mapa de risco</CardTitle>
            </CardHeader>
            <CardContent>
              <RiskMapChart data={dashboard.risk} onProjectSelect={setProjectId} />
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
              <WorkloadChart data={dashboard.workload} onMemberSelect={setMemberId} />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
