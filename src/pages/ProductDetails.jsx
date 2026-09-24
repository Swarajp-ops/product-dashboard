import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProduct } from '../api/productApi';
import Loading from '../components/Loading';

export default function ProductDetails() {
  const { id } = useParams();
  const [state, setState] = useState({ loading: true, product: null, error: '' });
  useEffect(() => { getProduct(id).then(({ data }) => setState({ loading: false, product: data, error: '' })).catch((err) => setState({ loading: false, product: null, error: err.message })); }, [id]);
  if (state.loading) return <Loading />;
  if (!state.product || state.error) return <main className="mx-auto max-w-3xl p-8 text-center"><h1 className="text-3xl font-bold">Product not found</h1><Link to="/products" className="mt-4 inline-block text-indigo-600">Back to products</Link></main>;
  const p = state.product;
  return <main className="mx-auto max-w-5xl p-4 md:p-8"><Link to="/products" className="text-indigo-600">← Back</Link><div className="mt-5 grid gap-8 rounded-2xl bg-white p-6 shadow md:grid-cols-2"><div><img src={p.images?.[0] || p.thumbnail} className="h-80 w-full rounded-xl object-contain" />{p.images?.length > 1 && <div className="mt-3 flex gap-2">{p.images.map((image) => <img key={image} src={image} className="h-16 w-16 rounded object-cover" />)}</div>}</div><div><p className="text-sm uppercase text-indigo-600">{p.category}</p><h1 className="mt-2 text-3xl font-bold">{p.title}</h1><p className="mt-4 text-slate-600">{p.description}</p><p className="mt-6 text-2xl font-bold">${p.price}</p><p className="mt-2">★ {p.rating} · {p.stock} in stock</p><h2 className="mt-8 text-xl font-semibold">Reviews</h2><div className="mt-3 space-y-3">{p.reviews?.length ? p.reviews.map((r, i) => <div key={i} className="rounded border p-3"><p>★ {r.rating} — {r.reviewerName}</p><p className="text-slate-600">{r.comment}</p></div>) : <p className="text-slate-500">No reviews available.</p>}</div></div></div></main>;
}