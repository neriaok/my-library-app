import type { FC } from 'react';
import styles from './WordBackdrop.module.css';

interface WordBackdropProps {
  left?: string;
  right?: string;
}

const WordBackdrop: FC<WordBackdropProps> = ({ left = 'Books', right = 'Memory' }) => (
  <div className={styles.backdrop} aria-hidden="true">
    <span className={styles.left}>{left}</span>
    <span className={styles.right}>{right}</span>
  </div>
);

export default WordBackdrop;
