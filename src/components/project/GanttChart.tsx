import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Task, getTaskStatusLabel } from '@/data/mockData';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Calendar, Clock, AlertCircle } from 'lucide-react';

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
    <TooltipProvider delayDuration={100}>
      <div className="rounded-xl border border-white/10 bg-card/40 backdrop-blur-md shadow-2xl relative flex flex-col overflow-hidden">

        {/* Header Row */}
        <div className="flex border-b border-white/10 bg-secondary/30 backdrop-blur-sm sticky top-0 z-40">
          {/* Label Column Header */}
          <div className="w-[180px] lg:w-[240px] shrink-0 border-r border-white/10 p-3 flex items-center bg-card/40 backdrop-blur-md z-50">
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Tarefa</span>
          </div>

          {/* Months Timeline Header */}
          <div className="flex-1 overflow-hidden relative">
            <div className="flex relative">
              {months.map((m, i) => (
                <div
                  key={i}
                  className="shrink-0 border-r border-white/10 px-3 py-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
                  style={{ width: `${(m.width / totalDays) * 100}%` }}
                >
                  {m.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Content Rows */}
        <div className="relative flex flex-col flex-1">
          {tasks.map((task, i) => {
            const pos = getBarPosition(task.startDate, task.endDate);
            return (
              <div key={task.id} className="group relative flex border-b border-white/5 hover:bg-secondary/20 transition-colors" style={{ height: 48 }}>

                {/* 1. Sticky Label Column */}
                <div className="w-[180px] lg:w-[240px] shrink-0 p-3 flex items-center border-r border-white/10 bg-card/20 backdrop-blur-sm z-30 group-hover:bg-secondary/40 transition-colors">
                  <div className="flex items-center gap-2 truncate">
                    <span className={cn('w-2 h-2 rounded-full shrink-0', statusColors[task.status])} />
                    <span className="text-xs font-medium text-foreground truncate" title={task.title}>
                      {task.title}
                    </span>
                  </div>
                </div>

                {/* 2. Scrollable Timeline Area */}
                <div className="flex-1 relative overflow-hidden">

                  {/* Today line (repeated per row for alignment, or could be global absolute) */}
                  {todayOffset && i === 0 && (
                    <div
                      className="absolute top-0 bottom-[-1000px] w-px bg-primary/50 z-10 pointer-events-none"
                      style={{ left: todayOffset }}
                    >
                      <div className="absolute -top-0 left-1/2 -translate-x-1/2 rounded-b bg-primary px-1.5 py-0.5 text-[8px] font-bold text-primary-foreground">
                        HOJE
                      </div>
                    </div>
                  )}

                  <div className="absolute inset-y-0 left-0 right-0 py-2.5">
                    {/* Bar */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <motion.div
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: i * 0.05, duration: 0.4 }}
                          className={cn('absolute h-full rounded-md origin-left cursor-pointer hover:ring-2 hover:ring-white/20 hover:ring-offset-1 hover:ring-offset-transparent transition-all z-20', statusColors[task.status])}
                          style={{ left: pos.left, width: pos.width }}
                        >
                          {/* Progress fill */}
                          {task.progress > 0 && task.progress < 100 && (
                            <div
                              className="absolute inset-y-0 left-0 rounded-l-md bg-foreground/15"
                              style={{ width: `${task.progress}%` }}
                            />
                          )}
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-background/95 backdrop-blur-xl border-white/10 shadow-2xl max-w-xs pointer-events-none p-3 z-[100]">
                        <div className="space-y-2">
                          <p className="font-semibold text-sm text-foreground">{task.title}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span className={cn('w-2 h-2 rounded-full', statusColors[task.status])} />
                            {getTaskStatusLabel(task.status)}
                          </div>

                          <div className="bg-secondary/50 rounded-md p-2 space-y-1.5 mt-2">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-muted-foreground flex items-center gap-1.5"><Calendar className="w-3 h-3" /> Início</span>
                              <span className="font-medium text-foreground">{new Date(task.startDate).toLocaleDateString('pt-BR')}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-muted-foreground flex items-center gap-1.5"><Clock className="w-3 h-3" /> Previsto</span>
                              <span className="font-medium text-warning">{new Date(task.predictedEndDate || task.endDate).toLocaleDateString('pt-BR')}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-muted-foreground flex items-center gap-1.5">Progresso</span>
                              <span className="font-medium text-foreground">{task.progress}%</span>
                            </div>
                            {task.originalEndDate && task.originalEndDate !== task.endDate && (
                              <div className="flex justify-between items-center text-xs pt-1.5 mt-1.5 border-t border-white/10">
                                <span className="text-destructive flex items-center gap-1.5"><AlertCircle className="w-3 h-3" /> Original</span>
                                <span className="font-medium text-muted-foreground line-through">{new Date(task.originalEndDate).toLocaleDateString('pt-BR')}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </TooltipContent>
                    </Tooltip>

                    {/* Original End Date Marker */}
                    {task.originalEndDate && task.originalEndDate !== task.endDate && (
                      <div
                        className="absolute top-1/2 -translate-y-1/2 z-10 h-[120%] w-[2px] bg-destructive/60"
                        style={{ left: getMarkerPosition(task.originalEndDate) }}
                      >
                        <div className="absolute -top-1 -left-1 h-2.5 w-2.5 rotate-45 border-t-2 border-l-2 border-destructive/60 bg-background" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default GanttChart;
