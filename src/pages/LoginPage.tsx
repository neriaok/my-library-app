import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface FakeUser {
  username: string;
  name: string;
  email: string;
}

const LoginPage: React.FC = () => {
  const { login, isLoading, user } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [availableUsers, setAvailableUsers] = useState<FakeUser[]>([]);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((r) => r.json())
      .then((users: FakeUser[]) => setAvailableUsers(users.slice(0, 5)));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    const success = await login(username, password);
    if (success) {
      navigate('/');
    } else {
      setError('Invalid username or password. Password must be at least 3 characters.');
    }
  };

  const fillUser = (u: FakeUser) => {
    setUsername(u.username);
    setPassword('password123');
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="bg-circle c1" />
        <div className="bg-circle c2" />
        <div className="bg-circle c3" />
      </div>

      <div className="login-container">
        <div className="login-header">
          <div className="login-logo">📚</div>
          <h1>Welcome Back</h1>
          <p>Sign in to access your personal library</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-wrap">
              <span className="input-icon">👤</span>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                autoComplete="username"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrap">
              <span className="input-icon">🔒</span>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>
          </div>

          {error && <div className="form-error">{error}</div>}

          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? (
              <span className="spinner-inline" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="login-hint">
          <button
            className="hint-toggle"
            onClick={() => setShowHint(!showHint)}
          >
            {showHint ? '▲ Hide' : '▼ Show'} demo accounts
          </button>

          {showHint && (
            <div className="hint-users">
              <p className="hint-note">Click a user to fill credentials (password: any 3+ chars)</p>
              {availableUsers.map((u) => (
                <button
                  key={u.username}
                  className="hint-user-btn"
                  onClick={() => fillUser(u)}
                >
                  <strong>{u.username}</strong>
                  <span>{u.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
