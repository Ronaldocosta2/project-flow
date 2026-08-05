import { describe, expect, it } from 'vitest';
import { projectHistory, projects } from '@/data/mockData';
import {
  buildDeliveryForecast,
  buildPortfolioProgress,
  buildRiskMap,
  buildWorkload,
  calculateExecutiveMetrics,
  filterDashboardData,
} from './dashboardMetrics';

describe('dashboard metrics', () => {
  it('filters projects and history with one shared selection', () => {
    const result = filterDashboardData(projects, projectHistory, {
      projectId: '1', period: 90, referenceDate: '2026-03-15',
    });

    expect(result.projects.map(project => project.id)).toEqual(['1']);
    expect(result.history.every(point => point.projectId === '1')).toBe(true);
  });

  it('calculates executive totals without invented trends', () => {
    const metrics = calculateExecutiveMetrics(projects);

    expect(metrics.totalProjects).toBe(4);
    expect(metrics.atRiskProjects).toBe(2);
    expect(metrics.completedTasks).toBe(6);
    expect(metrics.totalTasks).toBe(15);
  });

  it('sorts forecasts by delay descending', () => {
    const forecast = buildDeliveryForecast(projects);

    expect(forecast[0]).toMatchObject({ projectId: '1', delayDays: 12 });
    expect(forecast[1]).toMatchObject({ projectId: '2', delayDays: 7 });
  });

  it('aggregates planned and actual progress by date', () => {
    const points = buildPortfolioProgress(projects, projectHistory);

    expect(points.at(-1)).toEqual(expect.objectContaining({ date: '2026-03-15' }));
    expect(points.every(point => point.planned >= 0 && point.actual >= 0)).toBe(true);
  });

  it('weights only open tasks in workload', () => {
    const workload = buildWorkload(projects);

    expect(workload.find(item => item.memberId === '4')).toEqual(
      expect.objectContaining({ memberName: 'Pedro Oliveira', score: 7 }),
    );
    expect(workload).toEqual([...workload].sort((a, b) => b.score - a.score));
  });

  it('maps project risk with open task volume', () => {
    expect(buildRiskMap(projects).find(item => item.projectId === '1')).toEqual(
      expect.objectContaining({ progress: 52, riskScore: 72, openTasks: 4 }),
    );
  });
});
