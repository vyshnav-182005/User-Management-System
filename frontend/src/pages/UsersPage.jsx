import { useEffect, useMemo, useState } from 'react';
import {
  createUserApi,
  deleteUserApi,
  listUsersApi,
  updateUserApi,
} from '../api/userApi';
import useAuth from '../hooks/useAuth';

const initialForm = {
  name: '',
  email: '',
  username: '',
  password: '',
  role: 'USER',
  status: 'ACTIVE',
};

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const canCreate = useMemo(() => currentUser?.role === 'ADMIN', [currentUser]);

  const fetchUsers = async () => {
    try {
      const data = await listUsersApi({ page, limit, search, role, status });
      setUsers(data.users);
      setTotalPages(data.pagination.totalPages || 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const onFilter = async (event) => {
    event.preventDefault();
    setPage(1);
    await fetchUsers();
  };

  const onEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      email: item.email,
      username: item.username,
      password: '',
      role: item.role,
      status: item.status,
    });
  };

  const resetForm = () => {
    setEditingId('');
    setForm(initialForm);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      const payload = { ...form };
      if (!payload.password) {
        delete payload.password;
      }

      if (editingId) {
        await updateUserApi(editingId, payload);
        setMessage('User updated');
      } else {
        await createUserApi(payload);
        setMessage('User created');
      }

      resetForm();
      await fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this user?')) {
      return;
    }

    try {
      await deleteUserApi(id);
      setMessage('User deleted');
      await fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  return (
    <div className="stack">
      <form className="card filters" onSubmit={onFilter}>
        <h3>User Filters</h3>
        <input
          placeholder="Search by name/email/username"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="">All roles</option>
          <option value="ADMIN">ADMIN</option>
          <option value="MANAGER">MANAGER</option>
          <option value="USER">USER</option>
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
        <button className="btn" type="submit">
          Apply
        </button>
      </form>

      {(canCreate || editingId) && (
        <form className="card form" onSubmit={onSubmit}>
          <h3>{editingId ? 'Edit User' : 'Create User'}</h3>
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            required
          />
          <input
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
            required
          />
          <input
            type="password"
            placeholder={editingId ? 'New password (optional)' : 'Password'}
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            required={!editingId}
          />
          <select
            value={form.role}
            onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
          >
            <option value="USER">USER</option>
            <option value="MANAGER">MANAGER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          <select
            value={form.status}
            onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
          <div className="row">
            <button className="btn" type="submit">
              {editingId ? 'Update' : 'Create'}
            </button>
            {editingId && (
              <button className="btn btn-outline" type="button" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      <div className="card">
        <h3>Users</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Username</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.username}</td>
                  <td>{item.role}</td>
                  <td>{item.status}</td>
                  <td className="row">
                    <button
                      className="btn btn-small"
                      type="button"
                      onClick={() => onEdit(item)}
                    >
                      Edit
                    </button>
                    {currentUser?.role === 'ADMIN' && (
                      <button
                        className="btn btn-danger btn-small"
                        type="button"
                        onClick={() => onDelete(item.id)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="row pagination">
          <button
            className="btn btn-small"
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </button>
          <span>
            Page {page} / {totalPages}
          </span>
          <button
            className="btn btn-small"
            type="button"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
