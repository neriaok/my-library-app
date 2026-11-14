import { useState, type FC } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Book } from '../../types';
import { useSearchBooksQuery } from '../../features/books/booksApi';
import Shelf from '../../components/Shelf';
import BookDetail from '../../components/BookDetail';
import StatusMessage from '../../components/StatusMessage';

const DEFAULT_QUERY = 'subject:fiction classics';

const ShelfPage: FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q')?.trim() || DEFAULT_QUERY;
  const { data: books, isFetching, isError } = useSearchBooksQuery(query);
  const [openBook, setOpenBook] = useState<Book | null>(null);

  if (isFetching) return <StatusMessage kanji="本" title="Pulling books from the archive…" isLoading />;
  if (isError) return <StatusMessage kanji="無" title="Could not reach Google Books — try again in a moment" />;
  if (!books || books.length === 0) return <StatusMessage kanji="空" title={`Nothing on the shelf for “${query}”`} />;

  return (
    <>
      <Shelf key={query} books={books} onOpenBook={setOpenBook} />
      {openBook && <BookDetail book={openBook} onClose={() => setOpenBook(null)} />}
    </>
  );
};

export default ShelfPage;
