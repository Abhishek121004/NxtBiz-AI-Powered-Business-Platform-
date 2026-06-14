import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api.js';
import { DataTable } from '../ui/DataTable.jsx';

export function CustomerDetailPage() {
  const { id } = useParams();
  const customer = useQuery({
    queryKey: ['customer-360', id],
    queryFn: async () => (await api.get(`/customers/${id}/360`)).data
  });

  if (customer.isLoading) return <div className="panel rounded-lg p-8">Loading customer...</div>;

  const data = customer.data || {};
  const record = data.customer;
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">{record?.name || 'Customer 360'}</h1>
        <p className="text-sm text-stone-500">{record?.company}</p>
      </div>
      <section className="grid gap-4 md:grid-cols-3">
        <Info label="Email" value={record?.email} />
        <Info label="Phone" value={record?.phone} />
        <Info label="Health Score" value={record?.healthScore} />
      </section>
      <section className="panel rounded-lg p-5">
        <h2 className="mb-2 font-semibold">Notes</h2>
        <p className="text-sm text-stone-600 dark:text-stone-300">{record?.notes || 'No notes captured.'}</p>
      </section>
      <CustomerSection title="CRM Activity" rows={data.crm} />
      <CustomerSection title="Emails" rows={data.emails} />
      <CustomerSection title="Meetings" rows={data.meetings} />
      <CustomerSection title="Invoices" rows={data.invoices} />
      <CustomerSection title="Tickets" rows={data.tickets} />
      <CustomerSection title="Memory" rows={data.memory} />
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="panel rounded-lg p-4">
      <div className="text-sm text-stone-500">{label}</div>
      <div className="mt-1 font-semibold">{value || '-'}</div>
    </div>
  );
}

function CustomerSection({ title, rows = [] }) {
  return (
    <section className="space-y-3">
      <h2 className="font-semibold">{title}</h2>
      <DataTable rows={rows} />
    </section>
  );
}
