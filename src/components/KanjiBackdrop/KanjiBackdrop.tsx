import type { FC } from 'react';
import styles from './KanjiBackdrop.module.css';

interface KanjiBackdropProps {
  left?: string;
  right?: string;
}

const KanjiBackdrop: FC<KanjiBackdropProps> = ({ left = '読書', right = 'の記憶' }) => (
  <div className={styles.backdrop} aria-hidden="true">
    <span className={styles.left}>{left}</span>
    <span className={styles.right}>{right}</span>
  </div>
);

export default KanjiBackdrop;
