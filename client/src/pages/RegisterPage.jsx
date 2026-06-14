import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../lib/api.js';
import { useAuthStore } from '../stores/authStore.js';
import { AuthShell } from '../ui/AuthShell.jsx';

export function RegisterPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Employee' });

  async function submit(event) {
    event.preventDefault();
    const { data } = await api.post('/auth/register', form);
    setSession(data);
    toast.success('NxtBiz account created');
    navigate('/');
  }

  return (
    <AuthShell title="Create an operator account">
      <form className="space-y-4" onSubmit={submit}>
        <input className="input w-full" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Name" />
        <input className="input w-full" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="Email" />
        <input className="input w-full" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Password" />
        <select className="input w-full" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}>
          <option>Employee</option>
          <option>Manager</option>
          <option>Viewer</option>
          <option>Admin</option>
        </select>
        <button className="btn-primary w-full">Register</button>
        <Link className="block text-center text-sm text-mint" to="/login">
          Back to login
        </Link>
      </form>
    </AuthShell>
  );
}
