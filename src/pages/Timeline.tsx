import AppLayout from '@/components/layout/AppLayout';
import GanttChart from '@/components/project/GanttChart';
import { projects } from '@/data/mockData';

const Timeline = () => {
  const allTasks = projects.filter(p => p.status !== 'completed').flatMap(p => p.tasks);

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Cronograma Geral</h1>
        <p className="mt-1 text-sm text-muted-foreground">Visão consolidada de todas as tarefas ativas</p>
      </div>

      <GanttChart />
    </AppLayout>
  );
};

export default Timeline;
