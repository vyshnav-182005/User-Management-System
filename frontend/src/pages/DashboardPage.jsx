import useAuth from '../hooks/useAuth';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="stack">
      <article className="card">
        <h3>Overview</h3>
        <p className="muted">
          Welcome back, <strong>{user?.name}</strong>. You are signed in with a{' '}
          <strong>{user?.role}</strong> account.
        </p>
      </article>

      <div className="grid">
      <article className="card">
        <h3>Role</h3>
        <p>{user?.role}</p>
      </article>

      <article className="card">
        <h3>Status</h3>
        <p>{user?.status}</p>
      </article>

      <article className="card">
        <h3>Account</h3>
        <p>{user?.email}</p>
      </article>
      </div>
    </div>
  );
}
