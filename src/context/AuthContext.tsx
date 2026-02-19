import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('library_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Fetch users from JSONPlaceholder
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const users: User[] = await response.json();

      // Find user by username (fake password check - any non-empty password works)
      const foundUser = users.find(
        (u) => u.username.toLowerCase() === username.toLowerCase()
      );

      if (foundUser && password.length >= 3) {
        // Generate avatar using UI Avatars
        const userWithAvatar = {
          ...foundUser,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${foundUser.username}`,
        };
        setUser(userWithAvatar);
        localStorage.setItem('library_user', JSON.stringify(userWithAvatar));
        setIsLoading(false);
        return true;
      }
      setIsLoading(false);
      return false;
    } catch (error) {
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('library_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
