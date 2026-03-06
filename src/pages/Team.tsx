import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { teamMembers, projects } from '@/data/mockData';

const Team = () => {
  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Equipe</h1>
        <p className="mt-1 text-sm text-muted-foreground">{teamMembers.length} membros</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member, i) => {
          const memberProjects = projects.filter(p => p.members.some(m => m.id === member.id));
          const memberTasks = projects.flatMap(p => p.tasks).filter(t => t.assignee.id === member.id);
          const doneTasks = memberTasks.filter(t => t.status === 'done');

          return (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl border border-border bg-card p-5"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {member.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-lg bg-secondary p-2">
                  <p className="text-lg font-bold text-foreground">{memberProjects.length}</p>
                  <p className="text-[10px] text-muted-foreground">Projetos</p>
                </div>
                <div className="rounded-lg bg-secondary p-2">
                  <p className="text-lg font-bold text-foreground">{memberTasks.length}</p>
                  <p className="text-[10px] text-muted-foreground">Tarefas</p>
                </div>
                <div className="rounded-lg bg-secondary p-2">
                  <p className="text-lg font-bold text-foreground">{doneTasks.length}</p>
                  <p className="text-[10px] text-muted-foreground">Concluídas</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </AppLayout>
  );
};

export default Team;
