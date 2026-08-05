import type { Project, ProjectHistoryPoint, TaskPriority } from '@/data/mockData';

export type DashboardPeriod = 30 | 60 | 90;

export interface DashboardSelection {
  projectId: string;
  period: DashboardPeriod;
  referenceDate: string;
}

export interface ExecutiveMetrics {
  totalProjects: number;
  atRiskProjects: number;
  averageProgress: number;
  averageRiskScore: number;
  onTimeProjects: number;
  completedTasks: number;
  totalTasks: number;
}

export interface PortfolioProgressPoint {
  date: string;
  planned: number;
  actual: number;
}

export interface DeliveryForecast {
  projectId: string;
  projectName: string;
  endDate: string;
  predictedEndDate: string;
  delayDays: number;
  riskScore: number;
  status: Project['status'];
  owner: Project['owner'];
}

export interface RiskPoint {
  projectId: string;
  projectName: string;
  openTasks: number;
  progress: number;
  riskScore: number;
  predictedEndDate: string;
  status: Project['status'];
  owner: Project['owner'];
}

export interface WorkloadPoint {
  memberId: string;
  memberName: string;
  score: number;
  lowTasks: number;
  mediumTasks: number;
  highTasks: number;
  criticalTasks: number;
}

const priorityWeight: Record<TaskPriority, number> = {
  low: 1,
  medium: 2,
  high: 3,
  critical: 4,
};

const priorityCountKey = {
  low: 'lowTasks',
  medium: 'mediumTasks',
  high: 'highTasks',
  critical: 'criticalTasks',
} as const satisfies Record<TaskPriority, keyof WorkloadPoint>;

export const differenceInCalendarDays = (end: string, start: string) =>
  Math.round((Date.parse(`${end}T00:00:00Z`) - Date.parse(`${start}T00:00:00Z`)) / 86_400_000);

export function filterDashboardData(
  projects: Project[],
  history: ProjectHistoryPoint[],
  selection: DashboardSelection,
) {
  const start = new Date(`${selection.referenceDate}T00:00:00Z`);
  start.setUTCDate(start.getUTCDate() - selection.period);

  const filteredProjects = selection.projectId === 'all'
    ? projects
    : projects.filter(project => project.id === selection.projectId);
  const projectIds = new Set(filteredProjects.map(project => project.id));

  return {
    projects: filteredProjects,
    history: history.filter(point => projectIds.has(point.projectId) && Date.parse(point.date) >= start.getTime()),
  };
}

export function calculateExecutiveMetrics(projects: Project[]): ExecutiveMetrics {
  const tasks = projects.flatMap(project => project.tasks);
  const totalProjects = projects.length;

  return {
    totalProjects,
    atRiskProjects: projects.filter(project => project.riskScore > 50).length,
    averageProgress: totalProjects === 0 ? 0 : projects.reduce((sum, project) => sum + project.progress, 0) / totalProjects,
    averageRiskScore: totalProjects === 0 ? 0 : projects.reduce((sum, project) => sum + project.riskScore, 0) / totalProjects,
    onTimeProjects: projects.filter(project => project.predictedEndDate <= project.endDate).length,
    completedTasks: tasks.filter(task => task.status === 'done').length,
    totalTasks: tasks.length,
  };
}

export function buildPortfolioProgress(
  projects: Project[],
  history: ProjectHistoryPoint[],
): PortfolioProgressPoint[] {
  const projectIds = new Set(projects.map(project => project.id));
  const pointsByDate = new Map<string, ProjectHistoryPoint[]>();

  history.filter(point => projectIds.has(point.projectId)).forEach(point => {
    pointsByDate.set(point.date, [...(pointsByDate.get(point.date) ?? []), point]);
  });

  return [...pointsByDate.entries()]
    .map(([date, points]) => ({
      date,
      planned: Math.round((points.reduce((sum, point) => sum + point.planned, 0) / points.length) * 10) / 10,
      actual: Math.round((points.reduce((sum, point) => sum + point.actual, 0) / points.length) * 10) / 10,
    }))
    .sort((first, second) => first.date.localeCompare(second.date));
}

export function buildDeliveryForecast(projects: Project[]): DeliveryForecast[] {
  return projects
    .map(project => ({
      projectId: project.id,
      projectName: project.name,
      endDate: project.endDate,
      predictedEndDate: project.predictedEndDate,
      delayDays: differenceInCalendarDays(project.predictedEndDate, project.endDate),
      riskScore: project.riskScore,
      status: project.status,
      owner: project.owner,
    }))
    .sort((first, second) => second.delayDays - first.delayDays);
}

export function buildRiskMap(projects: Project[]): RiskPoint[] {
  return projects.map(project => ({
    projectId: project.id,
    projectName: project.name,
    openTasks: project.tasks.filter(task => task.status !== 'done').length,
    progress: project.progress,
    riskScore: project.riskScore,
    predictedEndDate: project.predictedEndDate,
    status: project.status,
    owner: project.owner,
  }));
}

export function buildWorkload(projects: Project[]): WorkloadPoint[] {
  const workloadByMember = new Map<string, WorkloadPoint>();

  projects.flatMap(project => project.tasks)
    .filter(task => task.status !== 'done')
    .forEach(task => {
      const current = workloadByMember.get(task.assignee.id) ?? {
        memberId: task.assignee.id,
        memberName: task.assignee.name,
        score: 0,
        lowTasks: 0,
        mediumTasks: 0,
        highTasks: 0,
        criticalTasks: 0,
      };
      const countKey = priorityCountKey[task.priority];
      workloadByMember.set(task.assignee.id, {
        ...current,
        score: current.score + priorityWeight[task.priority],
        [countKey]: current[countKey] + 1,
      });
    });

  return [...workloadByMember.values()].sort((first, second) => second.score - first.score);
}
