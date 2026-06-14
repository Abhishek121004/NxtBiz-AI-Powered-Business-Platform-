import { useQuery } from '@tanstack/react-query';
import { Activity, CircleDollarSign, HeartPulse, Ticket } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { api } from '../lib/api.js';

export function DashboardPage() {
  const dashboard = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => (await api.get('/dashboard')).data
  });

  const data = dashboard.data;
  const chartData = data
    ? Object.entries(data.health.factors).map(([name, value]) => ({ name: name.replace(/[A-Z]/g, (match) => ` ${match}`).trim(), value }))
    : [];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Executive Dashboard</h1>
        <p className="text-sm text-stone-500">Revenue, health, activity, and execution history for NxtBiz operations.</p>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        <Metric icon={HeartPulse} label="Business Health" value={data?.health.score ?? '-'} />
        <Metric icon={Activity} label="Customers" value={data?.totals.customers ?? '-'} />
        <Metric icon={Ticket} label="Open Tickets" value={data?.totals.openTickets ?? '-'} />
        <Metric icon={CircleDollarSign} label="Unread Alerts" value={data?.totals.unreadNotifications ?? '-'} />
      </section>

      <section className="panel h-96 rounded-lg p-5">
        <h2 className="mb-4 font-semibold">Health Factors</h2>
        <ResponsiveContainer width="100%" height="85%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#1f9d72" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="panel rounded-lg p-4">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-emerald-50 text-mint dark:bg-emerald-950">
        <Icon size={18} />
      </div>
      <div className="text-2xl font-semibold">{value}</div>
      <div className="text-sm text-stone-500">{label}</div>
    </div>
  );
}
