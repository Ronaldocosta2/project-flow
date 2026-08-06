import { describe, expect, it } from 'vitest';
import { projects, teamMembers } from '@/data/mockData';
import { buildTeamAllocations, formatAllocationDate } from './teamAllocation';

describe('buildTeamAllocations', () => {
  it('agrega projetos, atividades abertas e próxima entrega por profissional', () => {
    const allocations = buildTeamAllocations(teamMembers, projects, {
      search: '',
      projectId: 'all',
      taskStatus: 'all',
    });
    const carlos = allocations.find(({ member }) => member.name === 'Carlos Souza');

    expect(carlos?.activeProjects.map(({ id }) => id)).toEqual(['1']);
    expect(carlos?.openTasks.map(({ id }) => id)).toEqual(['t4']);
    expect(carlos?.nextDelivery).toBe('2026-03-10');
  });

  it('mantém profissionais sem tarefas quando não há filtro de projeto ou status', () => {
    const member = { id: 'empty', name: 'Sem Tarefas', email: 'empty@test.dev', role: 'Analista', avatar: 'ST' };
    const result = buildTeamAllocations([member], projects, {
      search: '', projectId: 'all', taskStatus: 'all',
    });

    expect(result).toHaveLength(1);
    expect(result[0].visibleTasks).toEqual([]);
  });

  it('exclui uma tarefa cujo projeto não existe de toda a alocação', () => {
    const orphan = { ...projects[0].tasks[3], projectId: 'missing' };
    const source = [{ ...projects[0], tasks: [orphan] }];
    const result = buildTeamAllocations(teamMembers, source, {
      search: '', projectId: 'all', taskStatus: 'all',
    });
    const allocation = result.find(item => item.member.id === orphan.assignee.id);

    expect(allocation?.visibleTasks).toEqual([]);
    expect(allocation?.openTasks).toEqual([]);
    expect(allocation?.nextDelivery).toBeUndefined();
    expect(allocation?.groups).toEqual([]);
  });

  it('usa a menor data entre várias atividades abertas como próxima entrega', () => {
    const later = projects[0].tasks[3];
    const earlier = { ...later, id: 'earlier', endDate: '2026-02-25' };
    const source = [{ ...projects[0], tasks: [later, earlier] }];
    const result = buildTeamAllocations([later.assignee], source, {
      search: '', projectId: 'all', taskStatus: 'all',
    });

    expect(result[0].nextDelivery).toBe('2026-02-25');
  });

  it('formata datas válidas e protege datas ausentes ou inválidas', () => {
    expect(formatAllocationDate('2026-03-10')).toBe('10/03/2026');
    expect(formatAllocationDate()).toBe('Data não informada');
    expect(formatAllocationDate('invalid')).toBe('Data não informada');
    expect(formatAllocationDate('2026-02-29')).toBe('Data não informada');
  });

  it('aplica busca, projeto e status', () => {
    const bySearch = buildTeamAllocations(teamMembers, projects, {
      search: 'designer', projectId: 'all', taskStatus: 'all',
    });
    expect(bySearch.map(item => item.member.name)).toEqual(['Marina Costa']);

    const byProjectAndStatus = buildTeamAllocations(teamMembers, projects, {
      search: '', projectId: '2', taskStatus: 'in_progress',
    });
    expect(byProjectAndStatus.map(item => item.member.name)).toEqual(['Pedro Oliveira']);
    expect(byProjectAndStatus[0].groups[0].project.id).toBe('2');
  });
});
