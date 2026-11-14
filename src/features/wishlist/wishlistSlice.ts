import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Book } from '../../types';

export const WISHLIST_STORAGE_KEY = 'library_wishlists';

interface WishlistState {
  byUser: Record<string, Book[]>;
}

const loadWishlists = (): Record<string, Book[]> => {
  try {
    const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return saved ? (JSON.parse(saved) as Record<string, Book[]>) : {};
  } catch {
    return {};
  }
};

const initialState: WishlistState = { byUser: loadWishlists() };

interface WishlistPayload {
  userId: number;
  book: Book;
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    bookAdded: (state, action: PayloadAction<WishlistPayload>) => {
      const { userId, book } = action.payload;
      const list = state.byUser[userId] ?? [];
      if (!list.some((b) => b.id === book.id)) {
        state.byUser[userId] = [...list, book];
      }
    },
    bookRemoved: (state, action: PayloadAction<{ userId: number; bookId: string }>) => {
      const { userId, bookId } = action.payload;
      state.byUser[userId] = (state.byUser[userId] ?? []).filter((b) => b.id !== bookId);
    },
  },
});

export const { bookAdded, bookRemoved } = wishlistSlice.actions;
export default wishlistSlice.reducer;
