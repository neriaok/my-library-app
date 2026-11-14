import { useState, type FC, type FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { useGetUsersQuery } from '../../features/auth/usersApi';
import { loggedIn } from '../../features/auth/authSlice';
import KanjiBackdrop from '../../components/KanjiBackdrop';
import styles from './LoginPage.module.css';

const LoginPage: FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { data: users, isLoading: isLoadingUsers, isError } = useGetUsersQuery();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username || !password) {
      setError('Please fill in both fields');
      return;
    }
    const found = users?.find((u) => u.username.toLowerCase() === username.toLowerCase());
    if (!found || password.length < 3) {
      setError('Unknown username, or password shorter than 3 characters');
      return;
    }
    dispatch(loggedIn({ ...found, avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${found.username}` }));
    navigate('/');
  };

  const handleDemoPick = (demoUsername: string) => {
    setUsername(demoUsername);
    setPassword('password123');
    setError('');
  };

  return (
    <div className={styles.page}>
      <KanjiBackdrop left="図書館" right="へようこそ" />

      <div className={styles.layout}>
        <div className={styles.intro}>
          <p className={styles.eyebrow}>
            Personal archive <span lang="ja">/ 個人の書庫</span>
          </p>
          <h1 className={styles.title}>
            Every book
            <br />
            you meant to read.
          </h1>
          <p className={styles.lead}>
            A shelf of millions of titles from Google Books — browse it like a collection, keep the ones you want.
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.field}>
            Username
            <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
          </label>
          <label className={styles.field}>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submit} disabled={isLoadingUsers}>
            {isLoadingUsers ? 'Opening the archive…' : 'Enter the library →'}
          </button>

          <div className={styles.demo}>
            <p className={styles.demoLabel}>Demo readers — any password, 3+ characters</p>
            {isError && <p className={styles.error}>Could not load demo users</p>}
            <div className={styles.demoList}>
              {users?.slice(0, 5).map((u) => (
                <button
                  key={u.id}
                  type="button"
                  className={clsx(styles.demoUser, username === u.username && styles.demoUserActive)}
                  onClick={() => handleDemoPick(u.username)}
                >
                  {u.username}
                </button>
              ))}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
