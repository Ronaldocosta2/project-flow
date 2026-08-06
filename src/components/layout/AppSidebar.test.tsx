import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { ThemeProvider } from '@/components/theme-provider';
import AppSidebar from './AppSidebar';

describe('AppSidebar', () => {
  it('expõe Alocações na rota existente de equipe', () => {
    render(
      <ThemeProvider defaultTheme="light" storageKey="sidebar-test-theme">
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppSidebar />
        </MemoryRouter>
      </ThemeProvider>,
    );

    expect(screen.getByRole('link', { name: 'Alocações' })).toHaveAttribute('href', '/team');
    expect(screen.queryByRole('link', { name: 'Equipe' })).not.toBeInTheDocument();
  });
});
