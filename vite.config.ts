import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Also expose REACT_APP_* so the env vars set for the old CRA build (e.g. on Vercel) keep working.
  envPrefix: ['VITE_', 'REACT_APP_'],
});
