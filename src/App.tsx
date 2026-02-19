import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WishListProvider } from './context/WishListContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SearchPage from './pages/SearchPage';
import WishListPage from './pages/WishListPage';
import './styles.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WishListProvider>
          <div className="app">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <Navbar />
                    <main className="main-content">
                      <Routes>
                        <Route path="/" element={<SearchPage />} />
                        <Route path="/wishlist" element={<WishListPage />} />
                      </Routes>
                    </main>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </WishListProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
