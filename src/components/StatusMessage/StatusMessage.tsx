import type { FC, ReactNode } from 'react';
import styles from './StatusMessage.module.css';

interface StatusMessageProps {
  mark: string;
  title: string;
  children?: ReactNode;
  isLoading?: boolean;
}

const StatusMessage: FC<StatusMessageProps> = ({ mark, title, children, isLoading = false }) => (
  <div className={styles.status}>
    <span className={isLoading ? `${styles.mark} ${styles.pulse}` : styles.mark}>{mark}</span>
    <p className={styles.title}>{title}</p>
    {children}
  </div>
);

export default StatusMessage;
