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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const generateCover = (): string => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 192;
    const ctx = canvas.getContext('2d')!;

    const palettes = [
      ['#1a1a2e', '#7c4dff', '#b388ff'],
      ['#0f2027', '#ea4c89', '#f7971e'],
      ['#0d0d14', '#00bcd4', '#00e676'],
      ['#1a0533', '#ff6b6b', '#ffd700'],
      ['#0a1628', '#3a86ff', '#8338ec'],
    ];
    const palette = palettes[Math.floor(Math.random() * palettes.length)];

    const grad = ctx.createLinearGradient(0, 0, 128, 192);
    grad.addColorStop(0, palette[0]);
    grad.addColorStop(1, palette[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 192);

    ctx.beginPath();
    ctx.arc(100, 40, 55, 0, Math.PI * 2);
    ctx.fillStyle = palette[2] + '33';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(20, 160, 40, 0, Math.PI * 2);
    ctx.fillStyle = palette[1] + '44';
    ctx.fill();

    ctx.strokeStyle = palette[2] + '88';
    ctx.lineWidth = 2;
    ctx.strokeRect(6, 6, 116, 180);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 13px serif';
    ctx.textAlign = 'center';
    const title = form.title || 'Book Title';
    const words = title.split(' ');
    let lines: string[] = [];
    let current = '';
    words.forEach((w) => {
      if (ctx.measureText(current + ' ' + w).width > 110) {
        lines.push(current);
        current = w;
      } else {
        current = current ? current + ' ' + w : w;
      }
    });
    lines.push(current);
    lines.slice(0, 4).forEach((line, i) => {
      ctx.fillText(line, 64, 90 + i * 16);
    });

    ctx.fillStyle = palette[2];
    ctx.font = '10px sans-serif';
    ctx.fillText(form.author || 'Author', 64, 165);

    return canvas.toDataURL('image/png');
  };

  const handleGenerateCover = () => {
    setImagePreview(generateCover());
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
        imageLinks: imagePreview
          ? { thumbnail: imagePreview, smallThumbnail: imagePreview }
          : undefined,
      },
    };

    addBook(newBook);
    setForm({ title: '', author: '', description: '', publishedDate: '', pageCount: '' });
    setImagePreview(null);
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

          <div className="form-group">
            <label>Book Cover Image</label>
            <div className="image-upload-wrap">
              <label className="image-upload-label" htmlFor="book-image">
                {imagePreview ? (
                  <img src={imagePreview} alt="preview" className="image-preview" />
                ) : (
                  <div className="image-upload-placeholder">
                    <span>📷</span>
                    <p>Click to upload cover</p>
                    <small>JPG, PNG, WEBP</small>
                  </div>
                )}
              </label>
              <input
                id="book-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <div className="image-actions">
                <button
                  type="button"
                  className="btn-generate-cover"
                  onClick={handleGenerateCover}
                >
                  🎨 Generate Random Cover
                </button>
                {imagePreview && (
                  <button
                    type="button"
                    className="image-remove-btn"
                    onClick={() => setImagePreview(null)}
                  >
                    ✕ Remove
                  </button>
                )}
              </div>
            </div>
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