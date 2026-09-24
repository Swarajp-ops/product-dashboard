import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { addProduct, deleteProduct, getCategories, getProducts, updateProduct } from '../api/productApi';
import Loading from '../components/Loading';
import ErrorState from '../components/ErrorState';
import Pagination from '../components/Pagination';
import ProductForm from '../components/ProductForm';

const validPage = (value) => Math.max(1, Number.isFinite(Number(value)) ? Number(value) : 1);
const validLimit = (value) => [10, 20, 50].includes(Number(value)) ? Number(value) : 10;

export default function Products() {
  const [params, setParams] = useSearchParams();
  const page = validPage(params.get('page'));
  const limit = validLimit(params.get('limit'));
  const search = params.get('search') || '';
  const category = params.get('category') || '';
  const sort = params.get('sort') || '';
  const [searchInput, setSearchInput] = useState(search);
  const [state, setState] = useState({ products: [], total: 0, loading: true, error: '' });
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);
  const requestId = useRef(0);

  const updateParams = (changes) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([key, value]) => value ? next.set(key, value) : next.delete(key));
    setParams(next);
  };

  useEffect(() => {
    const timer = setTimeout(() => updateParams({ search: searchInput.trim(), page: 1 }), 450);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const load = useCallback(async () => {
    const currentRequest = ++requestId.current;
    setState((s) => ({ ...s, loading: true, error: '' }));
    try {
      const sortParts = sort.split('-');
      const { data } = await getProducts({ page, limit, search, category, sortBy: sortParts[0], order: sortParts[1] });
      if (currentRequest === requestId.current) setState({ products: data.products, total: data.total, loading: false, error: '' });
    } catch (err) {
      if (currentRequest === requestId.current) setState((s) => ({ ...s, loading: false, error: err.message }));
    }
  }, [page, limit, search, category, sort]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { getCategories().then(({ data }) => setCategories(data.map((x) => typeof x === 'string' ? x : x.slug))).catch(() => {}); }, []);

  const visible = useMemo(() => state.products, [state.products]);

  const save = async (payload) => {
    if (editing?.id) await updateProduct(editing.id, payload); else await addProduct(payload);
    setEditing(null); load();
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await deleteProduct(id);
    setState((s) => ({ ...s, products: s.products.filter((p) => p.id !== id), total: Math.max(0, s.total - 1) }));
  };

  return <main className="mx-auto max-w-7xl p-4 md:p-8">
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-3xl font-bold">Products</h1><p className="text-slate-500">Manage your product catalog</p></div><button onClick={() => setEditing({})} className="rounded bg-indigo-600 px-4 py-2 text-white">Add product</button></div>
    <div className="mb-4 grid gap-3 rounded-xl bg-white p-4 md:grid-cols-4"><input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search products…" className="rounded border p-3" /><select value={category} onChange={(e) => updateParams({ category: e.target.value, page: 1 })} className="rounded border p-3"><option value="">All categories</option>{categories.map((c) => <option key={c}>{c}</option>)}</select><select value={sort} onChange={(e) => updateParams({ sort: e.target.value, page: 1 })} className="rounded border p-3"><option value="">Sort by</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="rating-desc">Rating: high to low</option><option value="title-asc">Title: A–Z</option></select><select value={limit} onChange={(e) => updateParams({ limit: e.target.value, page: 1 })} className="rounded border p-3"><option value="10">10 per page</option><option value="20">20 per page</option><option value="50">50 per page</option></select></div>
    {editing && <ProductForm product={editing} onSave={save} onCancel={() => setEditing(null)} />}
    {state.loading ? <Loading /> : state.error ? <ErrorState message={state.error} onRetry={load} /> : !visible.length ? <div className="rounded-xl bg-white p-12 text-center text-slate-500">No products found.</div> : <><div className="hidden overflow-hidden rounded-xl bg-white shadow md:block"><table className="w-full text-left"><thead className="bg-slate-50 text-sm"><tr><th className="p-4">Product</th><th>Category</th><th>Price</th><th>Rating</th><th>Stock</th><th>Actions</th></tr></thead><tbody>{visible.map((p) => <tr key={p.id} className="border-t"><td className="flex items-center gap-3 p-4"><img src={p.thumbnail} className="h-12 w-12 rounded object-cover" /><a className="font-medium hover:text-indigo-600" href={`/products/${p.id}`}>{p.title}</a></td><td>{p.category}</td><td>${p.price}</td><td>★ {p.rating}</td><td>{p.stock}</td><td><button onClick={() => setEditing(p)} className="mr-2 text-indigo-600">Edit</button><button onClick={() => remove(p.id)} className="text-red-600">Delete</button></td></tr>)}</tbody></table><Pagination page={page} total={state.total} limit={limit} onPageChange={(n) => updateParams({ page: n })} /></div><div className="space-y-3 md:hidden">{visible.map((p) => <article key={p.id} className="rounded-xl bg-white p-4 shadow"><div className="flex gap-3"><img src={p.thumbnail} className="h-20 w-20 rounded object-cover" /><div><a href={`/products/${p.id}`} className="font-semibold">{p.title}</a><p className="text-sm text-slate-500">{p.category}</p><p>${p.price} · ★ {p.rating}</p><p className="text-sm">Stock: {p.stock}</p></div></div><div className="mt-3 flex gap-3 text-sm"><button onClick={() => setEditing(p)} className="text-indigo-600">Edit</button><button onClick={() => remove(p.id)} className="text-red-600">Delete</button></div></article>)}<Pagination page={page} total={state.total} limit={limit} onPageChange={(n) => updateParams({ page: n })} /></div></>}
  </main>;
}