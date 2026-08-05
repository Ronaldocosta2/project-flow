import { CartesianGrid, Cell, Scatter, ScatterChart, XAxis, YAxis, ZAxis } from 'recharts';
import { ChartContainer, ChartTooltip, type ChartConfig } from '@/components/ui/chart';
import type { RiskPoint } from '@/lib/dashboardMetrics';

const chartConfig = {
  risk: { label: 'Risco', color: 'hsl(var(--warning))' },
  tasks: { label: 'Tarefas abertas', color: 'hsl(var(--primary))' },
} satisfies ChartConfig;

const statusColors: Record<RiskPoint['status'], string> = {
  on_track: 'hsl(var(--primary))',
  at_risk: 'hsl(var(--warning))',
  delayed: 'hsl(var(--destructive))',
  completed: 'hsl(var(--muted-foreground))',
};

interface RiskMapChartProps {
  data: RiskPoint[];
  onProjectSelect: (projectId: string) => void;
}

interface TooltipEntry<T> {
  payload?: T;
}

function RiskTooltip({ active, payload }: { active?: boolean; payload?: readonly TooltipEntry<RiskPoint>[] }) {
  const risk = payload?.[0]?.payload;
  if (!active || !risk) return null;

  return (
    <div className="grid gap-1 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs text-foreground shadow-xl">
      <strong>{risk.projectName}</strong>
      <span>Responsável: {risk.owner}</span>
      <span>Progresso: {risk.progress}%</span>
      <span>Risco: {risk.riskScore}%</span>
      <span>Tarefas abertas: {risk.openTasks}</span>
    </div>
  );
}

export default function RiskMapChart({ data, onProjectSelect }: RiskMapChartProps) {
  if (data.length === 0) {
    return <p className="flex min-h-64 items-center justify-center text-sm text-muted-foreground">Sem riscos para o período selecionado.</p>;
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <>
      <ChartContainer
        config={chartConfig}
        className="h-72 w-full aspect-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        role="img"
        aria-label="Mapa de risco por progresso dos projetos"
        tabIndex={0}
      >
        <ScatterChart accessibilityLayer margin={{ top: 12, right: 12, bottom: 8, left: 4 }}>
          <CartesianGrid />
          <XAxis type="number" dataKey="progress" name="Progresso" unit="%" domain={[0, 100]} tickLine={false} />
          <YAxis type="number" dataKey="riskScore" name="Risco" unit="%" domain={[0, 100]} tickLine={false} />
          <ZAxis type="number" dataKey="openTasks" name="Tarefas abertas" range={[80, 400]} />
          <ChartTooltip cursor={{ strokeDasharray: '3 3' }} content={<RiskTooltip />} />
          <Scatter
            data={data}
            cursor="pointer"
            isAnimationActive={!reduceMotion}
            onClick={risk => onProjectSelect(risk.projectId)}
          >
            {data.map(item => <Cell key={item.projectId} fill={statusColors[item.status]} />)}
          </Scatter>
        </ScatterChart>
      </ChartContainer>
      <div className="sr-only focus-within:not-sr-only">
        {data.map(item => (
          <button
            key={item.projectId}
            type="button"
            className="rounded px-2 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => onProjectSelect(item.projectId)}
          >
            Selecionar {item.projectName}, risco {item.riskScore}%
          </button>
        ))}
      </div>
    </>
  );
}
