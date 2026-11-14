import { useState, type FC } from 'react';
import { Link } from 'react-router-dom';
import type { Book } from '../../types';
import { useWishlist } from '../../hooks/useWishlist';
import Shelf from '../../components/Shelf';
import BookDetail from '../../components/BookDetail';
import StatusMessage from '../../components/StatusMessage';
import AddBookForm from '../../components/AddBookForm';
import styles from './WishlistPage.module.css';

const WishlistPage: FC = () => {
  const { wishlist, addBook } = useWishlist();
  const [openBook, setOpenBook] = useState<Book | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleAddBook = (book: Book) => {
    addBook(book);
    setIsFormOpen(false);
  };

  return (
    <>
      <div className={styles.toolbar}>
        <p className={styles.count}>
          {wishlist.length} {wishlist.length === 1 ? 'book' : 'books'} saved <span lang="ja">/ 欲しい本</span>
        </p>
        <button type="button" className={styles.add} onClick={() => setIsFormOpen(true)}>
          + Add manually
        </button>
      </div>

      {wishlist.length === 0 ? (
        <StatusMessage kanji="空" title="Your wish list is empty">
          <Link to="/" className={styles.cta}>
            Browse the shelf →
          </Link>
        </StatusMessage>
      ) : (
        <Shelf key={wishlist.length} books={wishlist} onOpenBook={setOpenBook} />
      )}

      {openBook && <BookDetail book={openBook} onClose={() => setOpenBook(null)} />}
      {isFormOpen && <AddBookForm onSubmit={handleAddBook} onCancel={() => setIsFormOpen(false)} />}
    </>
  );
};

export default WishlistPage;
