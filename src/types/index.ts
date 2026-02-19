export interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    publishedDate?: string;
    pageCount?: number;
    categories?: string[];
    averageRating?: number;
  };
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export interface WishListContextType {
  wishList: Book[];
  addBook: (book: Book) => void;
  removeBook: (bookId: string) => void;
  isInWishList: (bookId: string) => boolean;
}
