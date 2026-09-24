import { useState } from 'react';

export default function ProductForm({ product, onSave, onCancel }) {
  const [form, setForm] = useState({ title: product.title || '', price: product.price ?? '', stock: product.stock ?? '', category: product.category || '', description: product.description || '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (saving) return;
    if (!form.title.trim() || Number(form.price) < 0 || Number(form.stock) < 0) return setError('Enter a title and valid non-negative price and stock.');
    setSaving(true); setError('');
    try { await onSave({ ...form, price: Number(form.price), stock: Number(form.stock) }); } catch (err) { setError(err.message); } finally { setSaving(false); }
  };

  return <form onSubmit={submit} className="mb-6 rounded-xl bg-white p-5 shadow"><h2 className="mb-4 text-xl font-semibold">{product.id ? 'Edit product' : 'Add product'}</h2>{error && <p className="mb-3 text-red-600">{error}</p>}<div className="grid gap-3 md:grid-cols-2"><input className="rounded border p-3" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /><input className="rounded border p-3" type="number" min="0" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /><input className="rounded border p-3" type="number" min="0" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} /><input className="rounded border p-3" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /><textarea className="rounded border p-3 md:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div><div className="mt-4 flex gap-3"><button disabled={saving} className="rounded bg-indigo-600 px-4 py-2 text-white">{saving ? 'Saving…' : 'Save'}</button><button type="button" onClick={onCancel} className="rounded border px-4 py-2">Cancel</button></div></form>;
}