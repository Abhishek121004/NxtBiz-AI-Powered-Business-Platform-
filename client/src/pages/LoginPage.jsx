import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api, getApiErrorMessage } from '../lib/api.js';
import { useAuthStore } from '../stores/authStore.js';
import { AuthShell } from '../ui/AuthShell.jsx';

export function LoginPage() {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const [form, setForm] = useState({ email: 'admin@nxtbiz.local', password: 'Admin12345' });

  async function submit(event) {
    event.preventDefault();
    try {
      const { data } = await api.post('/auth/login', form);
      setSession(data);
      toast.success('Signed in to NxtBiz');
      navigate('/');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Unable to sign in'));
    }
  }

  return (
    <AuthShell title="Secure operator login">
      <form className="space-y-4" onSubmit={submit}>
        <input className="input w-full" required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="Email" />
        <input className="input w-full" required minLength={8} type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Password" />
        <button className="btn-primary w-full">Log in</button>
        <Link className="block text-center text-sm text-mint" to="/register">
          Register operator
        </Link>
      </form>
    </AuthShell>
  );
}
