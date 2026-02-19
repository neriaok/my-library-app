import React, { useState } from 'react';
import { useWishList } from '../context/WishListContext';
import { useAuth } from '../context/AuthContext';
import BookCard from '../components/BookCard';
import { Link } from 'react-router-dom';
import { Book } from '../types';

const WishListPage: React.FC = () => {
  const { wishList, addBook } = useWishList();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    author: '',
    description: '',
    publishedDate: '',
    pageCount: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.author) {
      setError('Title and author are required');
      return;
    }

    const newBook: Book = {
      id: `manual_${Date.now()}`,
      volumeInfo: {
        title: form.title,
        authors: [form.author],
        description: form.description || undefined,
        publishedDate: form.publishedDate || undefined,
        pageCount: form.pageCount ? parseInt(form.pageCount) : undefined,
      },
    };

    addBook(newBook);
    setForm({ title: '', author: '', description: '', publishedDate: '', pageCount: '' });
    setError('');
    setShowForm(false);
  };

  return (
    <div className="page wishlist-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">My Wish List</h1>
          {user && (
            <p className="page-subtitle">
              {user.name}'s personal collection · {wishList.length} book{wishList.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        <button
          className="btn btn-add"
          style={{ width: 'auto', padding: '0.6rem 1.2rem' }}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '✕ Cancel' : '+ Add Book Manually'}
        </button>
      </div>

      {showForm && (
        <form className="manual-book-form" onSubmit={handleSubmit}>
          <h3>Add Book Manually</h3>

          <div className="form-row">
            <div className="form-group">
              <label>Title *</label>
              <input name="title" value={form.title} onChange={handleChange} placeholder="Book title" />
            </div>
            <div className="form-group">
              <label>Author *</label>
              <input name="author" value={form.author} onChange={handleChange} placeholder="Author name" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Published Year</label>
              <input name="publishedDate" value={form.publishedDate} onChange={handleChange} placeholder="2024" />
            </div>
            <div className="form-group">
              <label>Page Count</label>
              <input name="pageCount" type="number" value={form.pageCount} onChange={handleChange} placeholder="300" />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Short description..." rows={3} />
          </div>

          {error && <div className="form-error">{error}</div>}

          <button type="submit" className="btn btn-add" style={{ width: 'auto', padding: '0.6rem 1.5rem' }}>
            ✓ Add to List
          </button>
        </form>
      )}

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