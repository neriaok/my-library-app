import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishList } from '../context/WishListContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { wishList } = useWishList();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">📚</span>
        <span className="brand-text">LibraryTracker</span>
      </div>

      <div className="navbar-links">
        <Link
          to="/"
          className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
        >
          🔍 Search
        </Link>
        <Link
          to="/wishlist"
          className={`nav-link ${location.pathname === '/wishlist' ? 'active' : ''}`}
        >
          ❤️ Wish List
          {wishList.length > 0 && (
            <span className="badge">{wishList.length}</span>
          )}
        </Link>
      </div>

      <div className="navbar-user">
        {user ? (
          <div className="user-info">
            <div className="user-avatar-wrap">
              <img
                src={user.avatar}
                alt={user.name}
                className="user-avatar"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6c3fe0&color=fff`;
                }}
              />
              <div className="user-status-dot" />
            </div>
            <div className="user-details">
              <span className="user-name">{user.name}</span>
              <span className="user-tag">@{user.username}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        ) : (
          <Link to="/login" className="login-cta">
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
