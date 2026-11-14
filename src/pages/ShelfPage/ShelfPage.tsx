import { useState, type FC } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';
import type { Book } from '../../types';
import { useSearchBooksQuery } from '../../features/books/booksApi';
import Shelf from '../../components/Shelf';
import BookDetail from '../../components/BookDetail';
import StatusMessage from '../../components/StatusMessage';

const DEFAULT_QUERY = 'subject:fiction classics';

const getErrorMessage = (error: FetchBaseQueryError | SerializedError): string => {
  const status = 'status' in error ? error.status : null;
  if (status === 429) return 'Google Books rate limit reached (429) — check the API key';
  if (status === 400 || status === 403) return `Google Books rejected the request (${status}) — check the API key`;
  if (status === 'FETCH_ERROR') return 'Could not reach Google Books — check your connection';
  return `Could not load books${status ? ` (${status})` : ''} — try again in a moment`;
};

const ShelfPage: FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q')?.trim() || DEFAULT_QUERY;
  const { data: books, isFetching, error } = useSearchBooksQuery(query);
  const [openBook, setOpenBook] = useState<Book | null>(null);

  if (isFetching) return <StatusMessage mark="Reading…" title="Pulling books from the archive" isLoading />;
  if (error) return <StatusMessage mark="Offline" title={getErrorMessage(error)} />;
  if (!books || books.length === 0) return <StatusMessage mark="Empty" title={`Nothing on the shelf for “${query}”`} />;

  return (
    <>
      <Shelf key={query} books={books} onOpenBook={setOpenBook} />
      {openBook && <BookDetail book={openBook} onClose={() => setOpenBook(null)} />}
    </>
  );
};

export default ShelfPage;
