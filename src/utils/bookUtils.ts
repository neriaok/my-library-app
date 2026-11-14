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

/** Google Books thumbnails are tiny — ask for a larger render, keep the original as fallback. */
export const getCoverUrls = (book: Book): { large: string; fallback: string } | null => {
  const links = book.volumeInfo.imageLinks;
  const original = links?.thumbnail ?? links?.smallThumbnail;
  if (!original) return null;
  const fallback = toHttps(original);
  if (fallback.startsWith('data:')) return { large: fallback, fallback };
  const large = fallback.replace('&edge=curl', '').replace(/&zoom=\d/, '') + '&fife=w600-h900';
  return { large, fallback };
};
