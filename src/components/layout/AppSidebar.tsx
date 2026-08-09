import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, Users, Settings, Zap, Moon, Sun, PieChart, LifeBuoy, ChevronRight } from 'lucide-react';
import { TimelineIcon } from '@/components/icons/TimelineIcon';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/theme-provider';
import { useAuth } from '@/contexts/AuthContext';
import { projects } from '@/data/mockData';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/projects', icon: FolderKanban, label: 'Projetos Globais' },
  { to: '/timeline', icon: TimelineIcon, label: 'Timeline' },
  { to: '/team', icon: Users, label: 'Alocações' },
  { to: '/tickets', icon: LifeBuoy, label: 'Tickets Globais' },
  { to: '/financial-report', icon: PieChart, label: 'Relatório Financeiro' },
  { to: '/settings', icon: Settings, label: 'Configurações' },
];

const AppSidebar = () => {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { currentUser } = useAuth();

  // Filtrar os projetos que o usuário logado faz parte (Espaços)
  const userSpaces = projects.filter(p => p.members.some(m => m.id === currentUser.id));

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-16 flex-col items-center border-r border-border bg-sidebar py-6 lg:w-56 overflow-y-auto">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-2 px-4 w-full">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shrink-0">
          <Zap className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="hidden text-sm font-bold tracking-tight text-foreground lg:block truncate">
          Athena
        </span>
      </div>

      {/* Seus Espaços (Jira-like) */}
      <div className="w-full px-2 lg:px-3 mb-6">
        <p className="hidden lg:block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
          Seus Espaços
        </p>
        <div className="flex flex-col gap-1">
          {userSpaces.map(space => {
            const isActive = location.pathname.startsWith(`/projects/${space.id}`);
            return (
              <NavLink
                key={space.id}
                to={`/projects/${space.id}`}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  'justify-center lg:justify-start',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-primary/20 text-primary">
                  <span className="text-[10px] font-bold">{space.name.substring(0, 2).toUpperCase()}</span>
                </div>
                <span className="hidden lg:block truncate flex-1">{space.name}</span>
                {isActive && <ChevronRight className="hidden lg:block h-4 w-4 shrink-0" />}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Nav Principal */}
      <div className="w-full px-2 lg:px-3 mb-6">
        <p className="hidden lg:block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
          Visão Geral
        </p>
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                aria-label={item.label}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  'justify-center lg:justify-start',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="hidden lg:block truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Bottom */}
      <div className="mt-auto px-3 w-full flex flex-col gap-3">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="flex items-center justify-center lg:justify-start gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground w-full"
        >
          {theme === "dark" ? <Sun className="h-4 w-4 shrink-0" /> : <Moon className="h-4 w-4 shrink-0" />}
          <span className="hidden lg:block">Alternar Tema</span>
        </button>

        <div className="hidden rounded-lg border border-border bg-card p-3 lg:block w-full">
          <p className="text-xs font-medium text-foreground truncate">{currentUser.name}</p>
          <p className="mt-1 text-xs text-muted-foreground truncate">{currentUser.role}</p>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
