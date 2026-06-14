import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Edit, ExternalLink, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { api } from '../lib/api.js';
import { resourceConfigs } from '../config/resourceConfigs.js';
import { ResourceForm } from '../ui/ResourceForm.jsx';

function normalizeRecord(record = {}) {
  const next = { ...record };
  delete next._id;
  delete next.id;
  delete next.__v;
  delete next.createdAt;
  delete next.updatedAt;
  return next;
}

function valueLabel(value) {
  if (value == null || value === '') return '-';
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value === 'object') return value.name || value.email || value.title || value._id || JSON.stringify(value);
  return String(value);
}

export function ResourcePage({ resource }) {
  const config = resourceConfigs[resource];
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const query = useQuery({
    queryKey: [config.endpoint],
    queryFn: async () => (await api.get(config.endpoint)).data
  });
  const rows = query.data || [];
  const columns = useMemo(() => Array.from(new Set(rows.flatMap((row) => Object.keys(row).filter((key) => !['__v', 'passwordHash', 'refreshTokenHash'].includes(key))))).slice(0, 6), [rows]);

  const createRecord = useMutation({
    mutationFn: async (payload) => (await api.post(config.createEndpoint || config.endpoint, payload)).data,
    onSuccess: () => {
      toast.success(`${config.title} record created`);
      setShowForm(false);
      setForm({});
      queryClient.invalidateQueries({ queryKey: [config.endpoint] });
    }
  });

  const updateRecord = useMutation({
    mutationFn: async ({ id, payload }) => (await api.put(`${config.endpoint}/${id}`, payload)).data,
    onSuccess: () => {
      toast.success(`${config.title} record updated`);
      setEditing(null);
      setForm({});
      queryClient.invalidateQueries({ queryKey: [config.endpoint] });
    }
  });

  const deleteRecord = useMutation({
    mutationFn: async (id) => api.delete(`${config.endpoint}/${id}`),
    onSuccess: () => {
      toast.success(`${config.title} record deleted`);
      queryClient.invalidateQueries({ queryKey: [config.endpoint] });
    }
  });

  function startEdit(row) {
    setEditing(row);
    setForm(normalizeRecord(row));
    setShowForm(true);
  }

  function submit(event) {
    event.preventDefault();
    if (editing) {
      updateRecord.mutate({ id: editing._id, payload: form });
    } else {
      createRecord.mutate(form);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{config.title}</h1>
          <p className="text-sm text-stone-500">NxtBiz operational records and execution context.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn border border-stone-200 dark:border-stone-800" onClick={() => query.refetch()} title="Refresh data">
            <RefreshCw size={18} />
          </button>
          {config.fields ? (
            <button className="btn-primary" onClick={() => { setShowForm((value) => !value); setEditing(null); setForm({ active: true }); }}>
              <Plus size={18} />
              New
            </button>
          ) : null}
        </div>
      </div>
      {showForm ? (
        <ResourceForm
          config={config}
          value={form}
          onChange={setForm}
          onSubmit={submit}
          onCancel={() => { setShowForm(false); setEditing(null); setForm({}); }}
          mode={editing ? 'edit' : 'create'}
          pending={createRecord.isPending || updateRecord.isPending}
        />
      ) : null}
      {query.isLoading ? (
        <div className="panel rounded-lg p-8 text-sm text-stone-500">Loading records...</div>
      ) : rows.length ? (
        <div className="panel overflow-hidden rounded-lg">
          <table className="w-full table-fixed text-left text-sm">
            <thead className="bg-stone-50 text-xs uppercase text-stone-500 dark:bg-stone-900">
              <tr>
                {columns.map((column) => (
                  <th className="px-4 py-3 font-medium" key={column}>{column}</th>
                ))}
                <th className="w-36 px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {rows.map((row) => (
                <tr key={row._id || row.id}>
                  {columns.map((column) => (
                    <td className="truncate px-4 py-3" key={column}>{valueLabel(row[column])}</td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {config.detailBase ? (
                        <Link className="btn h-8 w-8 border border-stone-200 p-0 dark:border-stone-800" to={`${config.detailBase}/${row._id}`} title="Open detail">
                          <ExternalLink size={15} />
                        </Link>
                      ) : null}
                      {!config.readonlyRows ? (
                        <button className="btn h-8 w-8 border border-stone-200 p-0 dark:border-stone-800" onClick={() => startEdit(row)} title="Edit">
                          <Edit size={15} />
                        </button>
                      ) : null}
                      {!config.readonlyRows ? (
                        <button className="btn h-8 w-8 border border-stone-200 p-0 text-coral dark:border-stone-800" onClick={() => deleteRecord.mutate(row._id)} title="Delete">
                          <Trash2 size={15} />
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="panel rounded-lg p-8 text-center text-sm text-stone-500">No records yet.</div>
      )}
    </div>
  );
}
