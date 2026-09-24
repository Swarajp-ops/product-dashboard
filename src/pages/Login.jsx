import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/authApi';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [form, setForm] = useState({ username: 'emilys', password: 'emilyspass' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (loading) return;
    setError('');
    setLoading(true);
    try {
      const { data } = await login({ ...form, expiresInMins: 30 });
      signIn(data);
      navigate('/products', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow">
        <h1 className="mb-2 text-3xl font-bold">Product Admin</h1>
        <p className="mb-6 text-slate-500">Sign in to manage products.</p>
        {error && <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <label className="mb-4 block text-sm font-medium">Username
          <input className="mt-1 w-full rounded border p-3" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
        </label>
        <label className="mb-6 block text-sm font-medium">Password
          <input type="password" className="mt-1 w-full rounded border p-3" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
        </label>
        <button disabled={loading} className="w-full rounded bg-indigo-600 p-3 font-semibold text-white hover:bg-indigo-700">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </main>
  );
}