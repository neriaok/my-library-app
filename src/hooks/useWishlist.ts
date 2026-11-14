import { useCallback, useMemo } from 'react';
import type { Book } from '../types';
import { bookAdded, bookRemoved } from '../features/wishlist/wishlistSlice';
import { useAppDispatch, useAppSelector } from './useAppDispatch';

const EMPTY: Book[] = [];

export const useWishlist = () => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user?.id ?? 0);
  const wishlist = useAppSelector((state) => state.wishlist.byUser[userId] ?? EMPTY);

  const ids = useMemo(() => new Set(wishlist.map((b) => b.id)), [wishlist]);

  const isInWishlist = useCallback((bookId: string) => ids.has(bookId), [ids]);
  const addBook = useCallback((book: Book) => dispatch(bookAdded({ userId, book })), [dispatch, userId]);
  const removeBook = useCallback((bookId: string) => dispatch(bookRemoved({ userId, bookId })), [dispatch, userId]);

  return { wishlist, isInWishlist, addBook, removeBook };
};
