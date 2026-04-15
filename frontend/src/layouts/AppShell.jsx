import { Link, NavLink, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function AppShell() {
  const { user, logout } = useAuth();

  return (
    <div className="layout">
      <aside className="sidebar">
        <Link to="/dashboard" className="brand">
          UMS
        </Link>
        <nav>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/profile">Profile</NavLink>
          {(user?.role === 'ADMIN' || user?.role === 'MANAGER') && (
            <NavLink to="/users">Users</NavLink>
          )}
        </nav>
        <button className="btn btn-outline" onClick={logout} type="button">
          Logout
        </button>
      </aside>

      <main className="content">
        <header className="topbar">
          <div>
            <h1>User Management System</h1>
            <p>
              Logged in as {user?.name} ({user?.role})
            </p>
          </div>
        </header>
        <section>
          <Outlet />
        </section>
      </main>
    </div>
  );
}
