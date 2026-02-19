import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book, WishListContextType } from '../types';
import { useAuth } from './AuthContext';

const WishListContext = createContext<WishListContextType | undefined>(undefined);

export const WishListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishList, setWishList] = useState<Book[]>([]);
  const { user } = useAuth();

  const storageKey = user ? `wishlist_${user.id}` : 'wishlist_guest';

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setWishList(JSON.parse(saved));
    } else {
      setWishList([]);
    }
  }, [storageKey]);

  const addBook = (book: Book) => {
    setWishList((prev) => {
      const updated = [...prev, book];
      localStorage.setItem(storageKey, JSON.stringify(updated));
      return updated;
    });
  };

  const removeBook = (bookId: string) => {
    setWishList((prev) => {
      const updated = prev.filter((b) => b.id !== bookId);
      localStorage.setItem(storageKey, JSON.stringify(updated));
      return updated;
    });
  };

  const isInWishList = (bookId: string): boolean => {
    return wishList.some((b) => b.id === bookId);
  };

  return (
    <WishListContext.Provider value={{ wishList, addBook, removeBook, isInWishList }}>
      {children}
    </WishListContext.Provider>
  );
};

export const useWishList = (): WishListContextType => {
  const context = useContext(WishListContext);
  if (!context) throw new Error('useWishList must be used within WishListProvider');
  return context;
};
