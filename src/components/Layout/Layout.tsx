import type { FC } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar';
import WordBackdrop from '../WordBackdrop';
import styles from './Layout.module.css';

const Layout: FC = () => (
  <div className={styles.layout}>
    <WordBackdrop />
    <Navbar />
    <main className={styles.main}>
      <Outlet />
    </main>
  </div>
);

export default Layout;
