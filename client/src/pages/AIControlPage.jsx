import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Bot, Play } from 'lucide-react';
import { api } from '../lib/api.js';
import { DataTable } from '../ui/DataTable.jsx';

export function AIControlPage() {
  const queryClient = useQueryClient();
  const agents = useQuery({ queryKey: ['/agents'], queryFn: async () => (await api.get('/agents')).data });
  const executions = useQuery({ queryKey: ['/agents/executions'], queryFn: async () => (await api.get('/agents/executions')).data });
  const runAgent = useMutation({
    mutationFn: async () => (await api.post('/agents/run', { intent: 'general_inquiry', source: 'manual' })).data,
    onSuccess: () => {
      toast.success('Agent orchestration started');
      queryClient.invalidateQueries();
    }
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">AI Control Center</h1>
          <p className="text-sm text-stone-500">Inspect agent status and execution history.</p>
        </div>
        <button className="btn-primary" onClick={() => runAgent.mutate()} disabled={runAgent.isPending}>
          <Play size={18} />
          Run
        </button>
      </div>
      <section className="grid gap-4 md:grid-cols-2">
        {(agents.data || []).map((agent) => (
          <div className="panel rounded-lg p-4" key={agent.agentId}>
            <div className="flex items-center gap-3">
              <Bot className="text-mint" size={20} />
              <div>
                <div className="font-semibold">{agent.agentId}</div>
                <div className="text-sm text-stone-500">{agent.status}</div>
              </div>
            </div>
          </div>
        ))}
      </section>
      <DataTable rows={executions.data || []} />
    </div>
  );
}
