import { FolderKanban, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import StatsCard from '@/components/dashboard/StatsCard';
import ProjectCard from '@/components/dashboard/ProjectCard';
import RiskAlert from '@/components/dashboard/RiskAlert';
import { projects } from '@/data/mockData';

const Index = () => {
  const totalTasks = projects.flatMap(p => p.tasks);
  const completedTasks = totalTasks.filter(t => t.status === 'done');
  const activeProjects = projects.filter(p => p.status !== 'completed');

  return (
    <AppLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Visão geral dos seus projetos e atividades</p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Projetos Ativos" value={activeProjects.length} icon={FolderKanban} trend={{ value: 12, positive: true }} delay={0} />
        <StatsCard title="Tarefas Concluídas" value={`${completedTasks.length}/${totalTasks.length}`} icon={CheckCircle} delay={1} />
        <StatsCard title="Em Risco" value={projects.filter(p => p.riskScore > 50).length} icon={AlertTriangle} delay={2} />
        <StatsCard title="Prazo Médio" value="18 dias" subtitle="até próxima entrega" icon={Clock} delay={3} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Projects */}
        <div className="lg:col-span-2">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Projetos</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} delay={i} />
            ))}
          </div>
        </div>

        {/* Risk Panel */}
        <div>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Alertas</h2>
          <RiskAlert projects={projects} />
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
