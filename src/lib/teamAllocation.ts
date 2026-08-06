import type { Project, Task, TaskStatus, TeamMember } from '@/data/mockData';

export interface TeamAllocationFilters {
  search: string;
  projectId: string;
  taskStatus: TaskStatus | 'all';
}

export interface ProjectActivityGroup {
  project: Project;
  tasks: Task[];
}

export interface TeamAllocation {
  member: TeamMember;
  activeProjects: Project[];
  visibleTasks: Task[];
  openTasks: Task[];
  nextDelivery?: string;
  groups: ProjectActivityGroup[];
}

export function formatAllocationDate(value?: string): string {
  if (!value) return 'Data não informada';

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return 'Data não informada';

  const [year, month, day] = match.slice(1).map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day
    ? 'Data não informada'
    : new Intl.DateTimeFormat('pt-BR').format(date);
}

export function formatNextDelivery(openTaskCount: number, value?: string): string {
  return openTaskCount === 0 ? 'Sem entrega pendente' : formatAllocationDate(value);
}

export function buildTeamAllocations(
  members: TeamMember[],
  projects: Project[],
  filters: TeamAllocationFilters,
): TeamAllocation[] {
  const projectById = new Map(projects.map(project => [project.id, project]));
  const tasks = projects.flatMap(project => project.tasks);
  const term = filters.search.trim().toLowerCase();
  const requiresTaskMatch = filters.projectId !== 'all' || filters.taskStatus !== 'all';

  return members.map(member => {
    const assignedTasks = tasks.filter(task =>
      task.assignee.id === member.id && projectById.has(task.projectId),
    );
    const visibleTasks = assignedTasks.filter(task =>
      (filters.projectId === 'all' || task.projectId === filters.projectId) &&
      (filters.taskStatus === 'all' || task.status === filters.taskStatus),
    );
    const openTasks = visibleTasks.filter(task => task.status !== 'done');
    const groups = [...new Set(visibleTasks.map(task => task.projectId))]
      .map(projectId => ({
        project: projectById.get(projectId),
        tasks: visibleTasks.filter(task => task.projectId === projectId),
      }))
      .filter((group): group is ProjectActivityGroup => Boolean(group.project));

    return {
      member,
      activeProjects: projects.filter(project =>
        project.status !== 'completed' &&
        (project.members.some(person => person.id === member.id) ||
          assignedTasks.some(task => task.projectId === project.id)),
      ),
      visibleTasks,
      openTasks,
      nextDelivery: openTasks.map(task => task.endDate).sort()[0],
      groups,
    };
  }).filter(allocation => {
    const matchesSearch = !term || [
      allocation.member.name,
      allocation.member.role,
      allocation.member.email,
    ].some(value => value.toLowerCase().includes(term));

    return matchesSearch && (!requiresTaskMatch || allocation.visibleTasks.length > 0);
  });
}
