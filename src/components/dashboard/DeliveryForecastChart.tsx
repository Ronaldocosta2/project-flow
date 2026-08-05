import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltip, type ChartConfig } from '@/components/ui/chart';
import type { DeliveryForecast } from '@/lib/dashboardMetrics';

const chartConfig = {
  delay: { label: 'Atraso previsto', color: 'hsl(var(--warning))' },
} satisfies ChartConfig;

interface DeliveryForecastChartProps {
  data: DeliveryForecast[];
  onProjectSelect: (projectId: string) => void;
}

interface TooltipEntry<T> {
  payload?: T;
}

function ForecastTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: readonly TooltipEntry<DeliveryForecast>[];
}) {
  const forecast = payload?.[0]?.payload;
  if (!active || !forecast) return null;

  return (
    <div className="grid gap-1 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs text-foreground shadow-xl">
      <strong>{forecast.projectName}</strong>
      <span>{forecast.delayDays} dias de diferença</span>
      <span>Planejado: {new Date(`${forecast.endDate}T00:00:00`).toLocaleDateString('pt-BR')}</span>
      <span>Previsto: {new Date(`${forecast.predictedEndDate}T00:00:00`).toLocaleDateString('pt-BR')}</span>
    </div>
  );
}

export default function DeliveryForecastChart({ data, onProjectSelect }: DeliveryForecastChartProps) {
  if (data.length === 0) {
    return <p className="flex min-h-64 items-center justify-center text-sm text-muted-foreground">Sem previsões para o período selecionado.</p>;
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <>
      <ChartContainer
        config={chartConfig}
        className="h-72 w-full aspect-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        role="img"
        aria-label="Diferença entre as datas planejadas e previstas por projeto"
        tabIndex={0}
      >
        <BarChart data={data} layout="vertical" accessibilityLayer margin={{ left: 8, right: 16 }}>
          <CartesianGrid horizontal={false} />
          <XAxis type="number" dataKey="delayDays" tickFormatter={value => `${value} d`} tickLine={false} axisLine={false} />
          <YAxis type="category" dataKey="projectName" width={120} tickLine={false} axisLine={false} />
          <ChartTooltip cursor={false} content={<ForecastTooltip />} />
          <Bar
            dataKey="delayDays"
            fill="var(--color-delay)"
            radius={4}
            cursor="pointer"
            isAnimationActive={!reduceMotion}
            onClick={forecast => onProjectSelect(forecast.projectId)}
          />
        </BarChart>
      </ChartContainer>
      <div className="sr-only focus-within:not-sr-only">
        {data.map(item => (
          <button
            key={item.projectId}
            type="button"
            className="rounded px-2 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={() => onProjectSelect(item.projectId)}
          >
            Selecionar {item.projectName}
          </button>
        ))}
      </div>
    </>
  );
}
