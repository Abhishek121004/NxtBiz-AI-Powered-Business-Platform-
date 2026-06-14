import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { FileText, RefreshCw } from 'lucide-react';
import { api } from '../lib/api.js';
import { DataTable } from '../ui/DataTable.jsx';

export function ReportsPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ title: 'NxtBiz Executive Report', type: 'executive', summary: '', recommendations: 'Review customer health trends, Prioritize overdue invoices' });
  const reports = useQuery({ queryKey: ['/reports'], queryFn: async () => (await api.get('/reports')).data });
  const generate = useMutation({
    mutationFn: async () =>
      (
        await api.post('/reports/generate', {
          ...form,
          recommendations: form.recommendations.split(',').map((item) => item.trim()).filter(Boolean)
        })
      ).data,
    onSuccess: () => {
      toast.success('Report PDF generated');
      queryClient.invalidateQueries({ queryKey: ['/reports'] });
    }
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Reports</h1>
          <p className="text-sm text-stone-500">Generate weekly and executive PDFs from NxtBiz operations metrics.</p>
        </div>
        <button className="btn border border-stone-200 dark:border-stone-800" onClick={() => reports.refetch()} title="Refresh">
          <RefreshCw size={18} />
        </button>
      </div>
      <form className="panel grid gap-4 rounded-lg p-5" onSubmit={(event) => { event.preventDefault(); generate.mutate(); }}>
        <div className="grid gap-4 md:grid-cols-2">
          <input className="input" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Report title" />
          <select className="input" value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
            <option value="executive">executive</option>
            <option value="weekly">weekly</option>
            <option value="customer_health">customer_health</option>
          </select>
        </div>
        <textarea className="min-h-24 rounded-md border border-stone-300 bg-white p-3 text-sm outline-none focus:border-mint dark:border-stone-700 dark:bg-stone-900" value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} placeholder="Summary" />
        <input className="input" value={form.recommendations} onChange={(event) => setForm({ ...form, recommendations: event.target.value })} placeholder="Recommendations, comma separated" />
        <button className="btn-primary w-fit" disabled={generate.isPending}>
          <FileText size={18} />
          Generate Report
        </button>
      </form>
      <DataTable rows={reports.data || []} />
    </div>
  );
}
