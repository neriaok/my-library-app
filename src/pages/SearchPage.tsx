import React, { useState, useCallback } from 'react';
import { Book } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import BookCard from '../components/BookCard';

const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');

  const debouncedQuery = useDebounce(query, 500);

  React.useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }
    fetchBooks(debouncedQuery);
  }, [debouncedQuery]);

  const fetchBooks = useCallback(async (searchTerm: string) => {
    setIsLoading(true);
    setError('');
    setHasSearched(true);
    try {
      const res = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchTerm)}&maxResults=20`
      );
      const data = await res.json();
      setResults(data.items || []);
    } catch {
      setError('Failed to fetch books. Please try again.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="page search-page">
      <div className="search-hero">
        <h1 className="page-title">Discover Books</h1>
        <p className="page-subtitle">Search millions of titles from Google Books</p>
        <div className="search-bar-wrap">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-bar"
            placeholder="Search by title, author, or keyword..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          {query && (
            <button className="search-clear" onClick={() => setQuery('')}>✕</button>
          )}
        </div>
      </div>

      <div className="search-results">
        {isLoading && (
          <div className="loading-state">
            <div className="spinner" />
            <p>Searching...</p>
          </div>
        )}

        {error && <div className="error-state">{error}</div>}

        {!isLoading && hasSearched && results.length === 0 && !error && (
          <div className="empty-state">
            <span>📭</span>
            <p>No books found for "{query}"</p>
          </div>
        )}

        {!isLoading && !hasSearched && (
          <div className="empty-state">
            <span>📖</span>
            <p>Start typing to search for books</p>
          </div>
        )}

        {!isLoading && results.length > 0 && (
          <>
            <p className="results-count">{results.length} results found</p>
            <div className="books-grid">
              {results.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
