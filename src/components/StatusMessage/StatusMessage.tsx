import type { FC, ReactNode } from 'react';
import styles from './StatusMessage.module.css';

interface StatusMessageProps {
  kanji: string;
  title: string;
  children?: ReactNode;
  isLoading?: boolean;
}

const StatusMessage: FC<StatusMessageProps> = ({ kanji, title, children, isLoading = false }) => (
  <div className={styles.status}>
    <span className={isLoading ? `${styles.kanji} ${styles.pulse}` : styles.kanji} lang="ja">
      {kanji}
    </span>
    <p className={styles.title}>{title}</p>
    {children}
  </div>
);

export default StatusMessage;
