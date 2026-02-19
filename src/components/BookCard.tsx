import React, { useState } from 'react';
import { Book } from '../types';
import { useWishList } from '../context/WishListContext';

interface BookCardProps {
  book: Book;
  showRemove?: boolean;
}

const BookCard: React.FC<BookCardProps> = ({ book, showRemove = false }) => {
  const { addBook, removeBook, isInWishList } = useWishList();
  const [showModal, setShowModal] = useState(false);
  const inWishList = isInWishList(book.id);

  const { title, authors, imageLinks, description, publishedDate, pageCount, averageRating } =
    book.volumeInfo;

  const thumbnail =
    imageLinks?.thumbnail ||
    imageLinks?.smallThumbnail ||
    `https://via.placeholder.com/128x192/1a1a2e/6c3fe0?text=No+Cover`;

  return (
    <>
      <div className="book-card" onClick={() => setShowModal(true)}>
        <div className="book-cover-wrap">
          <img
            src={thumbnail}
            alt={title}
            className="book-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://via.placeholder.com/128x192/1a1a2e/6c3fe0?text=No+Cover`;
            }}
          />
          <div className="book-overlay">
            <span className="view-details">View Details</span>
          </div>
        </div>
        <div className="book-info">
          <h3 className="book-title">{title}</h3>
          <p className="book-authors">{authors?.join(', ') || 'Unknown Author'}</p>
          {averageRating && (
            <div className="book-rating">
              {'★'.repeat(Math.round(averageRating))}{'☆'.repeat(5 - Math.round(averageRating))}
              <span>{averageRating}</span>
            </div>
          )}
          <div className="book-actions" onClick={(e) => e.stopPropagation()}>
            {showRemove ? (
              <button
                className="btn btn-remove"
                onClick={() => removeBook(book.id)}
              >
                🗑 Remove
              </button>
            ) : (
              <button
                className={`btn ${inWishList ? 'btn-added' : 'btn-add'}`}
                onClick={() => !inWishList && addBook(book)}
                disabled={inWishList}
              >
                {inWishList ? '✓ In List' : '+ Wish List'}
              </button>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            <div className="modal-content">
              <img
                src={thumbnail}
                alt={title}
                className="modal-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://via.placeholder.com/200x300/1a1a2e/6c3fe0?text=No+Cover`;
                }}
              />
              <div className="modal-details">
                <h2>{title}</h2>
                <p className="modal-authors">{authors?.join(', ') || 'Unknown Author'}</p>
                {publishedDate && <p className="modal-meta">📅 {publishedDate}</p>}
                {pageCount && <p className="modal-meta">📖 {pageCount} pages</p>}
                {averageRating && (
                  <p className="modal-meta">⭐ {averageRating} / 5</p>
                )}
                <p className="modal-description">
                  {description
                    ? description.replace(/<[^>]+>/g, '').slice(0, 400) + '...'
                    : 'No description available.'}
                </p>
                {!showRemove && (
                  <button
                    className={`btn ${inWishList ? 'btn-added' : 'btn-add'}`}
                    onClick={() => !inWishList && addBook(book)}
                    disabled={inWishList}
                  >
                    {inWishList ? '✓ Already in Wish List' : '+ Add to Wish List'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookCard;
