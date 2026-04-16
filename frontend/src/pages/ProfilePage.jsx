import { useState } from 'react';
import { updateProfileApi } from '../api/userApi';
import useAuth from '../hooks/useAuth';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      const payload = {};
      if (name.trim()) payload.name = name.trim();
      if (password.trim()) payload.password = password;

      const updated = await updateProfileApi(payload);
      setUser(updated);
      setPassword('');
      setMessage('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <form className="card form" onSubmit={onSubmit}>
      <h3>My Profile</h3>
      <p className="muted">Update your personal information and password.</p>

      <label htmlFor="name">Name</label>
      <input id="name" value={name} onChange={(e) => setName(e.target.value)} />

      <label htmlFor="email">Email</label>
      <input id="email" value={user?.email || ''} disabled />

      <label htmlFor="username">Username</label>
      <input id="username" value={user?.username || ''} disabled />

      <label htmlFor="password">New Password</label>
      <input
        id="password"
        type="password"
        placeholder="Leave blank to keep current password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      <button className="btn" type="submit">
        Save changes
      </button>
    </form>
  );
}
