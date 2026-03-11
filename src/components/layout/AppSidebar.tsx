import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, GanttChart, Users, Settings, Zap, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme-provider';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/projects', icon: FolderKanban, label: 'Projetos' },
  { to: '/timeline', icon: GanttChart, label: 'Cronograma' },
  { to: '/team', icon: Users, label: 'Equipe' },
  { to: '/settings', icon: Settings, label: 'Configurações' },
];

const AppSidebar = () => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-16 flex-col items-center border-r border-border bg-sidebar py-6 lg:w-56">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-2 px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Zap className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="hidden text-sm font-bold tracking-tight text-foreground lg:block">
          ProjectFlow
        </span>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 px-2 lg:w-full lg:px-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to || 
            (item.to !== '/' && location.pathname.startsWith(item.to));
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                'justify-center lg:justify-start',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="hidden lg:block">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="mt-auto px-3 w-full flex flex-col gap-3">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex items-center justify-center lg:justify-start gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          {theme === "dark" ? <Sun className="h-4 w-4 shrink-0" /> : <Moon className="h-4 w-4 shrink-0" />}
          <span className="hidden lg:block">Alternar Tema</span>
        </button>

        <div className="hidden rounded-lg border border-border bg-card p-3 lg:block">
          <p className="text-xs font-medium text-foreground">Análise Preditiva</p>
          <p className="mt-1 text-xs text-muted-foreground">2 projetos em risco</p>
          <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
            <div className="h-1.5 rounded-full bg-warning" style={{ width: '65%' }} />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
