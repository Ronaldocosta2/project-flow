import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, type ChartConfig } from '@/components/ui/chart';
import type { WorkloadPoint } from '@/lib/dashboardMetrics';

const chartConfig = {
  score: { label: 'Pontuação total', color: 'hsl(var(--primary))' },
  warning: { label: 'Quartil superior', color: 'hsl(var(--warning))' },
} satisfies ChartConfig;

interface WorkloadDatum extends WorkloadPoint {
  lowTasks?: number;
  mediumTasks?: number;
  highTasks?: number;
  criticalTasks?: number;
}

interface WorkloadChartProps {
  data: WorkloadDatum[];
  onMemberSelect: (memberId: string) => void;
}

interface TooltipEntry<T> {
  payload?: T;
}

function WorkloadTooltip({ active, payload }: { active?: boolean; payload?: readonly TooltipEntry<WorkloadDatum>[] }) {
  const workload = payload?.[0]?.payload;
  if (!active || !workload) return null;

  return (
    <div className="grid gap-1 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs text-foreground shadow-xl">
      <strong>{workload.memberName}</strong>
      <span>Pontuação total: {workload.score}</span>
      <span>Tarefas baixas: {workload.lowTasks ?? '—'}</span>
      <span>Tarefas médias: {workload.mediumTasks ?? '—'}</span>
      <span>Tarefas altas: {workload.highTasks ?? '—'}</span>
      <span>Tarefas críticas: {workload.criticalTasks ?? '—'}</span>
    </div>
  );
}

export default function WorkloadChart({ data, onMemberSelect }: WorkloadChartProps) {
  if (data.length === 0) {
    return <p className="flex min-h-64 items-center justify-center text-sm text-muted-foreground">Sem carga de trabalho para o período selecionado.</p>;
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const warningCount = Math.max(1, Math.ceil(data.length / 4));
  const warningMembers = new Set(
    [...data].sort((first, second) => second.score - first.score).slice(0, warningCount).map(item => item.memberId),
  );

  return (
    <>
      <ChartContainer
        config={chartConfig}
        className="h-72 w-full aspect-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        role="img"
        aria-label="Carga de trabalho por responsável"
        tabIndex={0}
      >
        <BarChart data={data} layout="vertical" accessibilityLayer margin={{ left: 8, right: 16 }}>
          <CartesianGrid horizontal={false} />
          <XAxis type="number" dataKey="score" tickLine={false} axisLine={false} />
          <YAxis type="category" dataKey="memberName" width={120} tickLine={false} axisLine={false} />
          <ChartTooltip cursor={false} content={<WorkloadTooltip />} />
          <Bar
            dataKey="score"
            radius={4}
            cursor="pointer"
            isAnimationActive={!reduceMotion}
            onClick={workload => onMemberSelect(workload.memberId)}
          >
            {data.map(item => (
              <Cell
                key={item.memberId}
                fill={warningMembers.has(item.memberId) ? 'var(--color-warning)' : 'var(--color-score)'}
              />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
      <div className="sr-only focus-within:not-sr-only">
        {data.map(item => (
          <button
            key={item.memberId}
            type="button"
            className="rounded px-2 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => onMemberSelect(item.memberId)}
          >
            Selecionar {item.memberName}, pontuação {item.score}
          </button>
        ))}
      </div>
    </>
  );
}
