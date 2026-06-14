import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Play, Plus, RefreshCw } from 'lucide-react';
import { api } from '../lib/api.js';
import { DataTable } from '../ui/DataTable.jsx';

export function WorkflowsPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: '', trigger: 'email.processed', condition: 'negative', action: 'create ticket and notify manager', enabled: true });
  const [payload, setPayload] = useState('{"sentiment":"negative","priority":"high","issue":"Escalated email"}');
  const workflows = useQuery({ queryKey: ['/workflows'], queryFn: async () => (await api.get('/workflows')).data });
  const createWorkflow = useMutation({
    mutationFn: async () =>
      (
        await api.post('/workflows', {
          ...form,
          steps: [
            { type: 'trigger', label: form.trigger },
            { type: 'condition', label: form.condition },
            { type: 'action', label: form.action }
          ]
        })
      ).data,
    onSuccess: () => {
      toast.success('Workflow created');
      setForm({ name: '', trigger: 'email.processed', condition: 'negative', action: 'create ticket and notify manager', enabled: true });
      queryClient.invalidateQueries({ queryKey: ['/workflows'] });
    }
  });
  const executeWorkflow = useMutation({
    mutationFn: async (id) => (await api.post(`/workflows/${id}/execute`, JSON.parse(payload))).data,
    onSuccess: () => {
      toast.success('Workflow executed');
      queryClient.invalidateQueries({ queryKey: ['/workflows'] });
    }
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Workflows</h1>
          <p className="text-sm text-stone-500">Build and execute spec-driven operational workflows.</p>
        </div>
        <button className="btn border border-stone-200 dark:border-stone-800" onClick={() => workflows.refetch()} title="Refresh">
          <RefreshCw size={18} />
        </button>
      </div>
      <form className="panel grid gap-4 rounded-lg p-5" onSubmit={(event) => { event.preventDefault(); createWorkflow.mutate(); }}>
        <div className="grid gap-4 md:grid-cols-2">
          <input className="input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Workflow name" required />
          <input className="input" value={form.trigger} onChange={(event) => setForm({ ...form, trigger: event.target.value })} placeholder="Trigger" required />
          <input className="input" value={form.condition} onChange={(event) => setForm({ ...form, condition: event.target.value })} placeholder="Condition" />
          <input className="input" value={form.action} onChange={(event) => setForm({ ...form, action: event.target.value })} placeholder="Action" required />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input className="h-5 w-5 accent-mint" type="checkbox" checked={form.enabled} onChange={(event) => setForm({ ...form, enabled: event.target.checked })} />
          Enabled
        </label>
        <button className="btn-primary w-fit" disabled={createWorkflow.isPending}>
          <Plus size={18} />
          Create Workflow
        </button>
      </form>
      <section className="panel rounded-lg p-5">
        <label>
          <span className="mb-1 block text-sm font-medium">Execution Payload</span>
          <textarea className="min-h-24 w-full rounded-md border border-stone-300 bg-white p-3 font-mono text-sm outline-none focus:border-mint dark:border-stone-700 dark:bg-stone-900" value={payload} onChange={(event) => setPayload(event.target.value)} />
        </label>
        <div className="mt-4 grid gap-2 md:grid-cols-3">
          {(workflows.data || []).map((workflow) => (
            <button className="btn border border-stone-200 dark:border-stone-800" key={workflow._id} onClick={() => executeWorkflow.mutate(workflow._id)}>
              <Play size={16} />
              {workflow.name}
            </button>
          ))}
        </div>
      </section>
      <DataTable rows={workflows.data || []} />
    </div>
  );
}
