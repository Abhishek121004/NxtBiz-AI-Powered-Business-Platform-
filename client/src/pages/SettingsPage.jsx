import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { CheckCheck, RefreshCw } from 'lucide-react';
import { api } from '../lib/api.js';
import { DataTable } from '../ui/DataTable.jsx';

export function SettingsPage() {
  const queryClient = useQueryClient();
  const notifications = useQuery({ queryKey: ['/notifications'], queryFn: async () => (await api.get('/notifications')).data });
  const markRead = useMutation({
    mutationFn: async (id) => (await api.put(`/notifications/${id}`, { read: true })).data,
    onSuccess: () => {
      toast.success('Notification marked read');
      queryClient.invalidateQueries();
    }
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Runtime Settings</h1>
          <p className="text-sm text-stone-500">Notifications and runtime feedback from NxtBiz services.</p>
        </div>
        <button className="btn border border-stone-200 dark:border-stone-800" onClick={() => notifications.refetch()} title="Refresh">
          <RefreshCw size={18} />
        </button>
      </div>
      <section className="grid gap-2 md:grid-cols-3">
        {(notifications.data || []).filter((item) => !item.read).map((item) => (
          <button className="btn justify-start border border-stone-200 dark:border-stone-800" key={item._id} onClick={() => markRead.mutate(item._id)}>
            <CheckCheck size={16} />
            {item.title}
          </button>
        ))}
      </section>
      <DataTable rows={notifications.data || []} />
    </div>
  );
}
