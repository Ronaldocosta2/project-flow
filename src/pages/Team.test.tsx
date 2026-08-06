import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import Team from './Team';

const renderPage = () => render(
  <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <Team />
  </MemoryRouter>,
);

describe('Team allocation page', () => {
  it('mostra indicadores e todos os profissionais inicialmente', () => {
    renderPage();

    expect(screen.getByRole('heading', { name: 'Alocação da Equipe' })).toBeInTheDocument();
    expect(screen.getByText('Profissionais')).toBeInTheDocument();
    expect(screen.getAllByText('Projetos ativos')).toHaveLength(2);
    expect(screen.getAllByText('Atividades abertas')).toHaveLength(2);
    expect(screen.getByText('Atividades críticas')).toBeInTheDocument();

    const indicators = screen.getByRole('region', { name: 'Indicadores da equipe' });
    for (const [label, value] of [
      ['Profissionais', '6'],
      ['Projetos ativos', '3'],
      ['Atividades abertas', '9'],
      ['Atividades críticas', '2'],
    ]) {
      const metric = within(indicators).getByText(label).parentElement;
      expect(within(metric!).getByText(value)).toBeInTheDocument();
    }
    expect(within(indicators).getByText('a fazer, em andamento ou em revisão')).toBeInTheDocument();
    expect(screen.getAllByText('Ana Silva')).toHaveLength(2);
    expect(screen.getAllByText('Rafael Lima')).toHaveLength(2);
  });

  it('mantém cards até lg e libera a tabela completa em telas maiores', () => {
    renderPage();

    const table = screen.getByRole('table');
    expect(table).toHaveClass('hidden', 'lg:table');
    expect(table.parentElement).toHaveClass('hidden', 'overflow-x-auto', 'lg:block');
    expect(screen.getByRole('region', { name: 'Alocações em cards' })).toHaveClass('lg:hidden');
  });

  it('oculta as iniciais decorativas dos avatares da leitura assistiva', () => {
    renderPage();

    for (const initials of screen.getAllByText('CS')) {
      expect(initials).toHaveAttribute('aria-hidden', 'true');
    }
  });

  it('filtra por busca e permite limpar os filtros', () => {
    renderPage();

    fireEvent.change(screen.getByLabelText('Buscar profissional'), { target: { value: 'Julia' } });
    expect(screen.getAllByText('Julia Santos')).toHaveLength(2);
    expect(screen.queryByText('Carlos Souza')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Limpar filtros' }));
    expect(screen.getAllByText('Carlos Souza')).toHaveLength(2);
  });

  it('expande e recolhe atividades agrupadas com link para o projeto', () => {
    renderPage();

    const triggers = screen.getAllByRole('button', { name: 'Ver atividades de Carlos Souza' });
    expect(triggers).toHaveLength(2);
    expect(triggers[0]).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(triggers[0]);
    expect(screen.getAllByText('Implementar dashboard')).toHaveLength(2);
    for (const link of screen.getAllByRole('link', { name: 'ProjectFlow MVP' })) {
      expect(link).toHaveAttribute('href', '/projects/1');
    }

    const collapseTriggers = screen.getAllByRole('button', { name: 'Ocultar atividades de Carlos Souza' });
    expect(collapseTriggers[0]).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(collapseTriggers[0]);
    expect(screen.queryByText('Implementar dashboard')).not.toBeInTheDocument();
  });

  it('mostra estado vazio ao combinar projeto sem atividades concluídas', () => {
    renderPage();

    fireEvent.change(screen.getByLabelText('Projeto'), { target: { value: '4' } });
    fireEvent.change(screen.getByLabelText('Status da atividade'), { target: { value: 'done' } });

    expect(screen.getByText('Nenhuma alocação encontrada')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Limpar filtros' })).toBeInTheDocument();
  });
});
