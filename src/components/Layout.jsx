import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const logout = () => { signOut(); navigate('/login', { replace: true }); };

  return (
    <div className="min-h-screen">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
          <Link to="/products" className="text-xl font-bold">Product Admin</Link>
          <div className="flex items-center gap-4 text-sm"><span>{user?.username}</span><button onClick={logout} className="rounded bg-slate-900 px-3 py-2 text-white">Logout</button></div>
        </div>
      </header>
      <Outlet />
    </div>
  );
}