import { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  Bell,
  Bot,
  Building2,
  ChartNoAxesCombined,
  FileText,
  Inbox,
  LogOut,
  Menu,
  Moon,
  Receipt,
  Settings,
  Sun,
  Ticket,
  Users,
  Workflow
} from 'lucide-react';
import { api } from '../lib/api.js';
import { useAuthStore } from '../stores/authStore.js';

const navItems = [
  { to: '/', label: 'Dashboard', icon: ChartNoAxesCombined },
  { to: '/users', label: 'Users', icon: Users },
  { to: '/customers', label: 'Customers', icon: Building2 },
  { to: '/emails', label: 'Emails', icon: Inbox },
  { to: '/meetings', label: 'Meetings', icon: Bell },
  { to: '/invoices', label: 'Invoices', icon: Receipt },
  { to: '/tickets', label: 'Tickets', icon: Ticket },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/crm', label: 'CRM', icon: Workflow },
  { to: '/workflows', label: 'Workflows', icon: Workflow },
  { to: '/ai-control', label: 'AI Control', icon: Bot },
  { to: '/settings', label: 'Settings', icon: Settings }
];

export function AppLayout() {
  const user = useAuthStore((state) => state.user);
  const clearSession = useAuthStore((state) => state.clearSession);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [dark, setDark] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const notifications = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => (await api.get('/notifications')).data
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', { withCredentials: true });
    const events = ['new_email', 'new_ticket', 'invoice_created', 'meeting_created', 'agent_completed', 'workflow_executed'];
    events.forEach((event) => {
      socket.on(event, () => {
        toast.success(event.replaceAll('_', ' '));
        queryClient.invalidateQueries();
      });
    });
    return () => socket.disconnect();
  }, [queryClient]);

  async function logout() {
    await api.post('/auth/logout').catch(() => null);
    clearSession();
    navigate('/login');
  }

  const unread = notifications.data?.filter((item) => !item.read).length || 0;

  return (
    <div className="flex min-h-screen bg-stone-100 text-ink dark:bg-stone-900 dark:text-stone-100">
      <aside className="hidden w-64 border-r border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-950 lg:block">
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-mint text-lg font-black text-white">N</div>
          <div>
            <div className="font-semibold">NxtBiz</div>
            <div className="text-xs text-stone-500">Operations Console</div>
          </div>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                    isActive ? 'bg-emerald-50 text-mint dark:bg-emerald-950' : 'text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800'
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>
      {mobileOpen ? (
        <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setMobileOpen(false)}>
          <aside className="h-full w-72 border-r border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-950" onClick={(event) => event.stopPropagation()}>
            <div className="mb-6 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-md bg-mint text-lg font-black text-white">N</div>
              <div>
                <div className="font-semibold">NxtBiz</div>
                <div className="text-xs text-stone-500">Operations Console</div>
              </div>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
                        isActive ? 'bg-emerald-50 text-mint dark:bg-emerald-950' : 'text-stone-600 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800'
                      }`
                    }
                  >
                    <Icon size={18} />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>
          </aside>
        </div>
      ) : null}

      <main className="min-w-0 flex-1">
        <header className="flex h-16 items-center justify-between border-b border-stone-200 bg-white px-5 dark:border-stone-800 dark:bg-stone-950">
          <div className="flex items-center gap-3">
            <button className="btn h-10 w-10 border border-stone-200 p-0 dark:border-stone-800 lg:hidden" onClick={() => setMobileOpen(true)} title="Open navigation">
              <Menu size={18} />
            </button>
            <div>
              <div className="text-sm font-semibold">{user?.name}</div>
              <div className="text-xs text-stone-500">{user?.role}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 items-center gap-2 rounded-md border border-stone-200 px-3 text-sm dark:border-stone-800">
              <Bell size={16} />
              {unread}
            </div>
            <button className="btn border border-stone-200 dark:border-stone-800" onClick={() => setDark((value) => !value)} title="Toggle dark mode">
              {dark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="btn border border-stone-200 dark:border-stone-800" onClick={logout} title="Log out">
              <LogOut size={18} />
            </button>
          </div>
        </header>
        <div className="p-5">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
