# 📚 Personal Library Tracker

A full-featured personal library web app built with **React + TypeScript**.

## Features

- 🔐 **Login with JSONPlaceholder users** — real user data, fake authentication
- 🔍 **Search books** via Google Books API with debounced input
- ❤️ **Wish List** — add/remove books, persisted per-user in localStorage
- 📖 **Book Detail modal** — description, rating, page count
- 👤 **User avatar + status indicator** in navbar
- 🌙 **Dark luxury UI** — responsive on all screens
- ⚡ **Routing** — protected routes with React Router v6

## Tech Stack

- React 18 + TypeScript
- React Router v6
- Context API for state management (Auth + WishList)
- Google Books API
- JSONPlaceholder for fake users
- CSS (no UI framework — hand-crafted design)

## Getting Started

```bash
cd library-app
npm install
npm start
```

App runs at `http://localhost:3000`

## Demo Login

Visit the app → you'll be redirected to `/login`.

Click **"Show demo accounts"** to see available usernames from JSONPlaceholder.  
Pick any user and click it to fill the form. Use **any password of 3+ characters**.

Example:
- Username: `Bret`
- Password: `password123`

## Project Structure

```
src/
├── types/         # TypeScript interfaces (Book, User, Context types)
├── context/       # AuthContext + WishListContext
├── hooks/         # useDebounce
├── components/    # Navbar, BookCard, ProtectedRoute
├── pages/         # LoginPage, SearchPage, WishListPage
├── App.tsx        # Router setup
└── styles.css     # Global styles
```

## Bonus Features Implemented

- ✅ Debouncing on search input (500ms)
- ✅ Loading spinner during API fetch
- ✅ Book Detail modal with full description
- ✅ Responsive mobile design
