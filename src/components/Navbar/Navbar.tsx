import { useEffect, useState, type FC } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { useDebounce } from '../../hooks/useDebounce';
import { useWishlist } from '../../hooks/useWishlist';
import { loggedOut } from '../../features/auth/authSlice';
import styles from './Navbar.module.css';

const Navbar: FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { wishlist } = useWishlist();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const debouncedQuery = useDebounce(query, 600);

  useEffect(() => {
    const current = searchParams.get('q') ?? '';
    if (debouncedQuery.trim() === current) return;
    navigate(debouncedQuery.trim() ? `/?q=${encodeURIComponent(debouncedQuery.trim())}` : '/');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  const handleLogout = () => {
    dispatch(loggedOut());
    navigate('/login');
  };

  const linkClass = ({ isActive }: { isActive: boolean }) => clsx(styles.link, isActive && styles.active);

  return (
    <header className={styles.navbar}>
      <NavLink to="/" className={styles.brand}>
        Library <span className={styles.brandSub}>Archive</span>
      </NavLink>

      <label className={styles.search}>
        <span className={styles.searchIcon} aria-hidden="true">
          ⌕
        </span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the archive…"
          aria-label="Search books"
        />
      </label>

      <nav className={styles.links}>
        <NavLink to="/" end className={linkClass}>
          Shelf
        </NavLink>
        <NavLink to="/wishlist" className={linkClass}>
          Wish list <sup className={styles.count}>{wishlist.length}</sup>
        </NavLink>
        {user && (
          <div className={styles.user}>
            <img
              src={user.avatar}
              alt={user.name}
              className={styles.avatar}
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=1f47c4&color=fff`;
              }}
            />
            <span className={styles.userName}>
              {user.name}
              <small>@{user.username}</small>
            </span>
            <button type="button" className={styles.logout} onClick={handleLogout}>
              Sign out
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
