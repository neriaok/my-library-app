import React from 'react';
import { useWishList } from '../context/WishListContext';
import { useAuth } from '../context/AuthContext';
import BookCard from '../components/BookCard';
import { Link } from 'react-router-dom';

const WishListPage: React.FC = () => {
  const { wishList } = useWishList();
  const { user } = useAuth();

  return (
    <div className="page wishlist-page">
      <div className="page-header">
        <h1 className="page-title">My Wish List</h1>
        {user && (
          <p className="page-subtitle">
            {user.name}'s personal collection · {wishList.length} book{wishList.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {wishList.length === 0 ? (
        <div className="empty-state">
          <span>💔</span>
          <p>Your wish list is empty</p>
          <Link to="/" className="btn btn-add" style={{ display: 'inline-block', marginTop: '1rem' }}>
            Search for books
          </Link>
        </div>
      ) : (
        <div className="books-grid">
          {wishList.map((book) => (
            <BookCard key={book.id} book={book} showRemove={true} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishListPage;
