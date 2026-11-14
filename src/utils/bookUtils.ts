import type { Book } from '../types';

export interface SpineTheme {
  background: string;
  color: string;
  accent: string;
}

const SPINE_THEMES: SpineTheme[] = [
  { background: '#ebe5d8', color: '#161616', accent: '#a8372a' },
  { background: '#1f47c4', color: '#f5f2ea', accent: '#f5f2ea' },
  { background: '#151515', color: '#efe9dc', accent: '#c9a96a' },
  { background: '#efe9dc', color: '#1f47c4', accent: '#1f47c4' },
  { background: '#e3dccd', color: '#1b1b1b', accent: '#1b1b1b' },
  { background: '#7a1c1c', color: '#f3e8d6', accent: '#e9c98f' },
  { background: '#1b4a37', color: '#eee5d1', accent: '#d8c48f' },
  { background: '#2a2a2a', color: '#e9e2d2', accent: '#b5402f' },
  { background: '#f1ece2', color: '#2b2b2b', accent: '#1f47c4' },
];

const hash = (value: string): number => {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) {
    h = (h * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
};

export const getSpineTheme = (book: Book): SpineTheme => SPINE_THEMES[hash(book.id) % SPINE_THEMES.length];

export const getYear = (book: Book): number | null => {
  const match = book.volumeInfo.publishedDate?.match(/\d{4}/);
  return match ? Number(match[0]) : null;
};

export const getAuthors = (book: Book): string => book.volumeInfo.authors?.join(', ') ?? 'Unknown author';

export const getCategory = (book: Book): string =>
  book.volumeInfo.categories?.[0]?.split('/')[0].trim() ?? 'Literature';

export const stripHtml = (html: string): string =>
  html
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();

const toHttps = (url: string): string => url.replace(/^http:\/\//, 'https://');

/**
 * Cover candidates in order of preference. The <img> walks this list on error:
 * 1. Open Library by ISBN — large, sharp scans (`default=false` makes a missing cover return 404)
 * 2. Google Books thumbnail, then the small thumbnail
 * If all fail, the Tape draws a generated cover.
 */
export const getCoverSources = (book: Book, size: 'M' | 'L' = 'M'): string[] => {
  const { imageLinks, industryIdentifiers } = book.volumeInfo;
  const uploaded = imageLinks?.thumbnail?.startsWith('data:') ? imageLinks.thumbnail : null;
  if (uploaded) return [uploaded];

  const isbns = (industryIdentifiers ?? [])
    .filter((id) => id.type === 'ISBN_13' || id.type === 'ISBN_10')
    .sort((a) => (a.type === 'ISBN_13' ? -1 : 1))
    .map((id) => id.identifier);

  const openLibrary = isbns.map((isbn) => `https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg?default=false`);
  const google = [imageLinks?.thumbnail, imageLinks?.smallThumbnail]
    .filter((url): url is string => Boolean(url))
    .map((url) => toHttps(url).replace('&edge=curl', ''));

  return [...new Set([...openLibrary, ...google])];
};
