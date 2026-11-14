import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Book, GoogleBooksResponse } from '../../types';

const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY || import.meta.env.REACT_APP_GOOGLE_BOOKS_API_KEY;

export const booksApi = createApi({
  reducerPath: 'booksApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://www.googleapis.com/books/v1/' }),
  endpoints: (builder) => ({
    searchBooks: builder.query<Book[], string>({
      query: (searchTerm) => ({
        url: 'volumes',
        params: {
          q: searchTerm,
          maxResults: 40,
          printType: 'books',
          ...(apiKey ? { key: apiKey } : {}),
        },
      }),
      transformResponse: (response: GoogleBooksResponse) => {
        const seen = new Set<string>();
        return (response.items ?? []).filter((book) => {
          const key = book.volumeInfo.title.toLowerCase();
          if (!book.volumeInfo.title || seen.has(key)) return false;
          seen.add(key);
          return true;
        });
      },
    }),
  }),
});

export const { useSearchBooksQuery } = booksApi;
