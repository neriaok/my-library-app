import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../../types';

const STORAGE_KEY = 'library_user';

interface AuthState {
  user: User | null;
}

const loadUser = (): User | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? (JSON.parse(saved) as User) : null;
  } catch {
    return null;
  }
};

const initialState: AuthState = { user: loadUser() };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loggedIn: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(action.payload));
    },
    loggedOut: (state) => {
      state.user = null;
      localStorage.removeItem(STORAGE_KEY);
    },
  },
});

export const { loggedIn, loggedOut } = authSlice.actions;
export default authSlice.reducer;
