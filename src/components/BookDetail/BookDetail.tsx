import { useEffect, type FC } from 'react';
import clsx from 'clsx';
import type { Book } from '../../types';
import { useWishlist } from '../../hooks/useWishlist';
import { getAuthors, getCategory, getYear, stripHtml } from '../../utils/bookUtils';
import Tape from '../Tape';
import WordBackdrop from '../WordBackdrop';
import styles from './BookDetail.module.css';

interface BookDetailProps {
  book: Book;
  onClose: () => void;
}

const BookDetail: FC<BookDetailProps> = ({ book, onClose }) => {
  const { isInWishlist, addBook, removeBook } = useWishlist();
  const inWishlist = isInWishlist(book.id);
  const { title, subtitle, description, pageCount, publisher, previewLink, infoLink } = book.volumeInfo;
  const year = getYear(book);
  const authors = getAuthors(book);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleWishlistClick = () => {
    if (inWishlist) removeBook(book.id);
    else addBook(book);
  };

  const meta = [year, getCategory(book), pageCount ? `${pageCount} pages` : null].filter(Boolean).join(' / ');
  const link = previewLink ?? infoLink;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-label={title}>
      <WordBackdrop left="Story" right="Pages" />

      <button type="button" className={styles.back} onClick={onClose}>
        ← Back to shelf
      </button>

      <div className={styles.layout}>
        <div className={styles.text}>
          <p className={styles.eyebrow}>{authors}</p>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          <p className={styles.meta}>{meta}</p>
          <p className={styles.description}>
            {description ? stripHtml(description) : 'No description available for this title.'}
          </p>
          <p className={styles.credit}>
            Written by {authors}
            {publisher && ` · Published by ${publisher}`}
          </p>
          <div className={styles.actions}>
            <button
              type="button"
              className={clsx(styles.button, inWishlist && styles.buttonActive)}
              onClick={handleWishlistClick}
            >
              {inWishlist ? '✓ In your wish list' : 'Add to wish list'}
            </button>
            {link && (
              <a className={styles.link} href={link} target="_blank" rel="noreferrer">
                Preview ↗
              </a>
            )}
          </div>
        </div>

        <div className={styles.visual}>
          <div className={styles.float}>
            <Tape book={book} width={300} height={450} depth={58} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
