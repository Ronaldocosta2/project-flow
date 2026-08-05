import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import DeliveryForecastChart from './DeliveryForecastChart';
import PortfolioProgressChart from './PortfolioProgressChart';
import RiskMapChart from './RiskMapChart';
import WorkloadChart from './WorkloadChart';

vi.stubGlobal('ResizeObserver', class {
  observe() {}
  unobserve() {}
  disconnect() {}
});
vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
  width: 800,
  height: 300,
  top: 0,
  right: 800,
  bottom: 300,
  left: 0,
  x: 0,
  y: 0,
  toJSON: () => ({}),
});

describe('dashboard charts', () => {
  it.each([
    [<PortfolioProgressChart data={[]} />, 'Sem dados de progresso para o período selecionado.'],
    [<DeliveryForecastChart data={[]} onProjectSelect={vi.fn()} />, 'Sem previsões para o período selecionado.'],
    [<RiskMapChart data={[]} onProjectSelect={vi.fn()} />, 'Sem riscos para o período selecionado.'],
    [<WorkloadChart data={[]} onMemberSelect={vi.fn()} />, 'Sem carga de trabalho para o período selecionado.'],
  ])('shows an explicit empty state', (chart, message) => {
    render(chart);

    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('selects a forecast project from the accessible project control', () => {
    const onProjectSelect = vi.fn();
    render(
      <DeliveryForecastChart
        data={[{
          projectId: '1',
          projectName: 'ProjectFlow MVP',
          endDate: '2026-03-30',
          predictedEndDate: '2026-04-11',
          delayDays: 12,
          status: 'at_risk',
          owner: 'Ana Silva',
        }]}
        onProjectSelect={onProjectSelect}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /selecionar projectflow mvp/i }));

    expect(onProjectSelect).toHaveBeenCalledWith('1');
  });

  it('exposes each risk point as a keyboard control', () => {
    render(
      <RiskMapChart
        data={[{
          projectId: '1',
          projectName: 'ProjectFlow MVP',
          owner: 'Ana Silva',
          progress: 52,
          riskScore: 72,
          openTasks: 4,
          status: 'at_risk',
        }]}
        onProjectSelect={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: /projectflow mvp, risco 72%/i })).toBeInTheDocument();
  });

  it('selects a member from the accessible workload control', () => {
    const onMemberSelect = vi.fn();
    render(
      <WorkloadChart
        data={[{ memberId: '4', memberName: 'Pedro Oliveira', score: 7 }]}
        onMemberSelect={onMemberSelect}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /selecionar pedro oliveira/i }));

    expect(onMemberSelect).toHaveBeenCalledWith('4');
  });
});
