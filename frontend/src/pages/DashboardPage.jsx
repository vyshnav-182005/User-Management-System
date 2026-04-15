import useAuth from '../hooks/useAuth';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="grid">
      <article className="card">
        <h3>Welcome back, {user?.name}</h3>
        <p>This is your role-aware dashboard.</p>
      </article>

      <article className="card">
        <h3>Role</h3>
        <p>{user?.role}</p>
      </article>

      <article className="card">
        <h3>Status</h3>
        <p>{user?.status}</p>
      </article>
    </div>
  );
}
