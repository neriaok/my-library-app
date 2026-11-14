import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import wishlistReducer, { WISHLIST_STORAGE_KEY } from '../features/wishlist/wishlistSlice';
import { booksApi } from '../features/books/booksApi';
import { usersApi } from '../features/auth/usersApi';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    wishlist: wishlistReducer,
    [booksApi.reducerPath]: booksApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
  },
  middleware: (getDefault) => getDefault().concat(booksApi.middleware, usersApi.middleware),
});

let lastWishlists = store.getState().wishlist.byUser;
store.subscribe(() => {
  const { byUser } = store.getState().wishlist;
  if (byUser !== lastWishlists) {
    lastWishlists = byUser;
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(byUser));
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
