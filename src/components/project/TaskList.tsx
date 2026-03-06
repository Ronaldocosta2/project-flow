import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Task, getTaskStatusLabel, getTaskStatusColor, getPriorityColor, getPriorityLabel } from '@/data/mockData';

const TaskList = ({ tasks }: { tasks: Task[] }) => {
  return (
    <div className="space-y-2">
      {tasks.map((task, i) => (
        <motion.div
          key={task.id}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
          className="group flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/20"
        >
          {/* Progress circle */}
          <div className="relative h-9 w-9 shrink-0">
            <svg className="h-9 w-9 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="14" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="14" fill="none"
                stroke={task.progress === 100 ? 'hsl(var(--success))' : 'hsl(var(--primary))'}
                strokeWidth="3"
                strokeDasharray={`${task.progress * 0.88} 88`}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-foreground">
              {task.progress}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{task.description}</p>
          </div>

          {/* Assignee */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-[10px] font-medium text-secondary-foreground">
              {task.assignee.avatar}
            </div>
            <span className="text-xs text-muted-foreground">{task.assignee.name.split(' ')[0]}</span>
          </div>

          {/* Priority */}
          <span className={cn('hidden md:inline-flex shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium', getPriorityColor(task.priority))}>
            {getPriorityLabel(task.priority)}
          </span>

          {/* Status */}
          <span className={cn('shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium', getTaskStatusColor(task.status))}>
            {getTaskStatusLabel(task.status)}
          </span>

          {/* Dates */}
          <span className="hidden lg:block shrink-0 text-xs text-muted-foreground w-20 text-right">
            {new Date(task.endDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

export default TaskList;
