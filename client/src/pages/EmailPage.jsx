import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Send } from 'lucide-react';
import { api } from '../lib/api.js';
import { DataTable } from '../ui/DataTable.jsx';

export function EmailPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ sender: '', subject: '', body: '' });
  const emails = useQuery({ queryKey: ['/emails'], queryFn: async () => (await api.get('/emails')).data });
  const processEmail = useMutation({
    mutationFn: async () => (await api.post('/emails/process', form)).data,
    onSuccess: () => {
      toast.success('Email processed and routed');
      setForm({ sender: '', subject: '', body: '' });
      queryClient.invalidateQueries({ queryKey: ['/emails'] });
    }
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Email Dashboard</h1>
        <p className="text-sm text-stone-500">Analyze sentiment, intent, urgency, recommendations, and trigger agents.</p>
      </div>
      <form className="panel grid gap-3 rounded-lg p-5" onSubmit={(event) => { event.preventDefault(); processEmail.mutate(); }}>
        <div className="grid gap-3 md:grid-cols-2">
          <input className="input" placeholder="Sender" value={form.sender} onChange={(event) => setForm({ ...form, sender: event.target.value })} />
          <input className="input" placeholder="Subject" value={form.subject} onChange={(event) => setForm({ ...form, subject: event.target.value })} />
        </div>
        <textarea className="min-h-28 rounded-md border border-stone-300 bg-white p-3 text-sm outline-none focus:border-mint dark:border-stone-700 dark:bg-stone-900" placeholder="Body" value={form.body} onChange={(event) => setForm({ ...form, body: event.target.value })} />
        <button className="btn-primary w-fit" disabled={processEmail.isPending}>
          <Send size={18} />
          Process
        </button>
      </form>
      <DataTable rows={emails.data || []} />
    </div>
  );
}
