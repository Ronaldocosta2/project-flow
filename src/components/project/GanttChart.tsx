import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Task } from '@/data/mockData';

interface GanttChartProps {
  tasks: Task[];
  startDate?: string;
  endDate?: string;
}

const GanttChart = ({ tasks, startDate, endDate }: GanttChartProps) => {
  const { chartStart, chartEnd, totalDays, months } = useMemo(() => {
    const allDates = tasks.flatMap(t => [
      new Date(t.startDate),
      new Date(t.endDate),
      t.originalEndDate ? new Date(t.originalEndDate) : new Date(t.endDate),
      t.predictedEndDate ? new Date(t.predictedEndDate) : new Date(t.endDate)
    ]);
    const s = startDate ? new Date(startDate) : new Date(Math.min(...allDates.map(d => d.getTime())));
    const e = endDate ? new Date(endDate) : new Date(Math.max(...allDates.map(d => d.getTime())));

    // Add padding
    s.setDate(s.getDate() - 3);
    e.setDate(e.getDate() + 3);

    const total = Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));

    // Generate month labels
    const monthsList: { label: string; offset: number; width: number }[] = [];
    const curr = new Date(s);
    curr.setDate(1);
    while (curr <= e) {
      const monthStart = Math.max(0, Math.ceil((curr.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)));
      const nextMonth = new Date(curr);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      const monthEnd = Math.min(total, Math.ceil((nextMonth.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)));
      monthsList.push({
        label: curr.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
        offset: monthStart,
        width: monthEnd - monthStart,
      });
      curr.setMonth(curr.getMonth() + 1);
    }

    return { chartStart: s, chartEnd: e, totalDays: total, months: monthsList };
  }, [tasks, startDate, endDate]);

  const getBarPosition = (taskStart: string, taskEnd: string) => {
    const s = new Date(taskStart);
    const e = new Date(taskEnd);
    const left = Math.max(0, (s.getTime() - chartStart.getTime()) / (1000 * 60 * 60 * 24));
    const width = (e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24);
    return {
      left: `${(left / totalDays) * 100}%`,
      width: `${(width / totalDays) * 100}%`,
    };
  };

  const getMarkerPosition = (dateStr: string) => {
    const d = new Date(dateStr);
    const left = Math.max(0, (d.getTime() - chartStart.getTime()) / (1000 * 60 * 60 * 24));
    return `${(left / totalDays) * 100}%`;
  };

  const todayOffset = useMemo(() => {
    const today = new Date();
    const offset = (today.getTime() - chartStart.getTime()) / (1000 * 60 * 60 * 24);
    if (offset < 0 || offset > totalDays) return null;
    return `${(offset / totalDays) * 100}%`;
  }, [chartStart, totalDays]);

  const statusColors: Record<string, string> = {
    done: 'bg-success/70',
    in_progress: 'bg-primary',
    in_review: 'bg-warning',
    todo: 'bg-muted-foreground/40',
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* Month headers */}
      <div className="relative flex border-b border-border bg-secondary/30">
        {months.map((m, i) => (
          <div
            key={i}
            className="shrink-0 border-r border-border px-3 py-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
            style={{ width: `${(m.width / totalDays) * 100}%` }}
          >
            {m.label}
          </div>
        ))}
      </div>

      {/* Rows */}
      <div className="relative">
        {/* Today line */}
        {todayOffset && (
          <div
            className="absolute top-0 bottom-0 w-px bg-primary/50 z-10"
            style={{ left: todayOffset }}
          >
            <div className="absolute -top-0 left-1/2 -translate-x-1/2 rounded-b bg-primary px-1.5 py-0.5 text-[8px] font-bold text-primary-foreground">
              HOJE
            </div>
          </div>
        )}

        {tasks.map((task, i) => {
          const pos = getBarPosition(task.startDate, task.endDate);
          return (
            <div key={task.id} className="group relative flex items-center border-b border-border/50 hover:bg-secondary/20 transition-colors" style={{ height: 44 }}>
              {/* Task label */}
              <div className="absolute left-3 z-10 flex items-center gap-2 pointer-events-none">
                <span className="text-xs font-medium text-foreground truncate max-w-[140px] lg:max-w-[200px]">
                  {task.title}
                </span>
              </div>

              {/* Bar */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className={cn('absolute h-6 rounded-md origin-left', statusColors[task.status])}
                style={{ left: pos.left, width: pos.width }}
              >
                {/* Progress fill */}
                {task.progress > 0 && task.progress < 100 && (
                  <div
                    className="absolute inset-y-0 left-0 rounded-l-md bg-foreground/10"
                    style={{ width: `${task.progress}%` }}
                  />
                )}
              </motion.div>

              {/* Original End Date Marker */}
              {task.originalEndDate && task.originalEndDate !== task.endDate && (
                <div
                  className="absolute z-20 h-8 w-[2px] bg-destructive/80 -translate-y-1"
                  style={{ left: getMarkerPosition(task.originalEndDate) }}
                  title={`Prazo Original: ${new Date(task.originalEndDate).toLocaleDateString('pt-BR')}`}
                >
                  <div className="absolute -top-3 -left-1.5 h-3 w-3 rotate-45 border-t-2 border-l-2 border-destructive/80 bg-background" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GanttChart;
