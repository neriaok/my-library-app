import { useEffect, type FC } from 'react';
import clsx from 'clsx';
import type { Book } from '../../types';
import { useWishlist } from '../../hooks/useWishlist';
import { getAuthors, getCategory, getYear, stripHtml } from '../../utils/bookUtils';
import Tape from '../Tape';
import KanjiBackdrop from '../KanjiBackdrop';
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
      <KanjiBackdrop left="本" right="物語" />

      <button type="button" className={styles.back} onClick={onClose}>
        ← Back to shelf <span lang="ja">本棚へ</span>
      </button>

      <div className={styles.layout}>
        <div className={styles.text}>
          <p className={styles.eyebrow}>
            {authors} <span lang="ja">/ 作者</span>
          </p>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          <p className={styles.meta}>{meta}</p>
          <p className={styles.description}>
            {description ? stripHtml(description) : 'No description available for this title.'}
          </p>
          <p className={styles.credit}>
            Written by {authors}
            {publisher && ` · Published by ${publisher}`} <span lang="ja">著作</span>
          </p>
          <div className={styles.actions}>
            <button
              type="button"
              className={clsx(styles.button, inWishlist && styles.buttonActive)}
              onClick={handleWishlistClick}
            >
              {inWishlist ? '✓ In your wish list' : 'Add to wish list'} <span lang="ja">/ 欲しい本</span>
            </button>
            {link && (
              <a className={styles.link} href={link} target="_blank" rel="noreferrer">
                Preview <span lang="ja">/ 試し読み</span> ↗
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
