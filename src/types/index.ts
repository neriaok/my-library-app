export interface BookImageLinks {
  thumbnail?: string;
  smallThumbnail?: string;
}

export interface IndustryIdentifier {
  type: 'ISBN_10' | 'ISBN_13' | 'ISSN' | 'OTHER';
  identifier: string;
}

export interface BookVolumeInfo {
  title: string;
  subtitle?: string;
  authors?: string[];
  publisher?: string;
  description?: string;
  imageLinks?: BookImageLinks;
  publishedDate?: string;
  pageCount?: number;
  categories?: string[];
  averageRating?: number;
  ratingsCount?: number;
  industryIdentifiers?: IndustryIdentifier[];
  previewLink?: string;
  infoLink?: string;
}

export interface Book {
  id: string;
  volumeInfo: BookVolumeInfo;
}

export interface GoogleBooksResponse {
  totalItems: number;
  items?: Book[];
}

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  avatar?: string;
}
