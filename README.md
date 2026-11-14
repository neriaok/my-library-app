# 📚 Library — 本の記憶

A personal library built on the Google Books API, presented as a **3D curved shelf**: every result is a book box with a generated spine, the selected book turns to face you with its cover, and a year timeline runs underneath.

## Features

- **3D shelf hero** — pure CSS 3D (no WebGL). Books sit on an arc, the active one rotates out to show its cover
- **Navigation** — arrows, keyboard ← → / Enter, mouse wheel, drag/swipe, click any spine, click the timeline
- **Year timeline** — every book is plotted by publication year; the cursor follows the active book
- **Book detail view** — large floating 3D book, description, add to / remove from wish list, Google preview link
- **Search** — debounced, stored in the URL (`/?q=dune`) so results are shareable
- **Wish list** — saved per user in localStorage, shown on its own shelf, plus manual add with cover upload
- **Demo login** — JSONPlaceholder users, any password with 3+ characters
- Responsive, `prefers-reduced-motion` aware, self-hosted fonts

## Tech stack

- React 18 + TypeScript, Vite
- Redux Toolkit — `auth` and `wishlist` slices, **RTK Query** for Google Books and users
- React Router v6
- CSS Modules + `clsx`

## Structure

```
src/
├── app/store.ts                 # configureStore + wishlist persistence
├── features/
│   ├── auth/                    # authSlice, usersApi (RTK Query)
│   ├── books/booksApi.ts        # Google Books search (RTK Query)
│   └── wishlist/wishlistSlice.ts
├── components/
│   ├── Shelf/                   # 3D arc, input handling, caption
│   ├── Tape/                    # a single book as a 3D box (cover / spine / pages)
│   ├── Timeline/                # year axis
│   ├── BookDetail/              # full-screen detail view
│   └── …                        # Navbar, Layout, KanjiBackdrop, AddBookForm, StatusMessage
├── pages/                       # ShelfPage, WishlistPage, LoginPage
├── hooks/                       # typed redux hooks, useWishlist, useDebounce, useElementWidth
└── utils/bookUtils.ts           # spine themes, year/category helpers, hi-res cover URLs
```

## Getting started

```bash
npm install
npm run dev
```

Optional: copy `.env.example` to `.env` and add `VITE_GOOGLE_BOOKS_API_KEY` for a higher rate limit — the app works without one.
