import { useMemo, type FC } from 'react';
import type { Book } from '../../types';
import { getYear } from '../../utils/bookUtils';
import styles from './Timeline.module.css';

interface TimelineProps {
  books: Book[];
  activeIndex: number;
  onSelect: (index: number) => void;
}

const MAX_TICKS = 7;
const NICE_STEPS = [10, 20, 25, 50, 100, 200];

const Timeline: FC<TimelineProps> = ({ books, activeIndex, onSelect }) => {
  const years = useMemo(() => books.map(getYear), [books]);

  const range = useMemo(() => {
    const known = years.filter((y): y is number => y !== null);
    if (known.length === 0) return null;
    const min = Math.floor(Math.min(...known) / 10) * 10;
    const max = Math.ceil((Math.max(...known) + 1) / 10) * 10;
    return { min, max: max === min ? min + 10 : max };
  }, [years]);

  // Books without a year fall back to their position in the list.
  const toPercent = (index: number): number => {
    const year = years[index];
    if (range && year !== null) return ((year - range.min) / (range.max - range.min)) * 100;
    return books.length > 1 ? (index / (books.length - 1)) * 100 : 50;
  };

  const ticks = useMemo(() => {
    if (!range) return [];
    const span = range.max - range.min;
    const step = NICE_STEPS.find((s) => span / s <= MAX_TICKS - 1) ?? 500;
    const first = Math.ceil(range.min / step) * step;
    const result: number[] = [];
    for (let year = first; year <= range.max; year += step) result.push(year);
    return result;
  }, [range]);

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = ((e.clientX - rect.left) / rect.width) * 100;
    let closest = 0;
    books.forEach((_, index) => {
      if (Math.abs(toPercent(index) - percent) < Math.abs(toPercent(closest) - percent)) closest = index;
    });
    onSelect(closest);
  };

  return (
    <div className={styles.timeline}>
      <div className={styles.track} onClick={handleTrackClick}>
        <div className={styles.line} />
        {books.map((book, index) => (
          <span key={book.id} className={styles.mark} style={{ left: `${toPercent(index)}%` }} />
        ))}
        {ticks.map((tick) => (
          <span
            key={tick}
            className={styles.tick}
            style={{ left: `${range ? ((tick - range.min) / (range.max - range.min)) * 100 : 0}%` }}
          >
            {tick}
          </span>
        ))}
        <span className={styles.cursor} style={{ left: `${toPercent(activeIndex)}%` }} />
      </div>
      <div className={styles.footer}>
        <span>© {new Date().getFullYear()} Neria Okbi · All rights reserved</span>
        <span className={styles.hint}>Scroll · Drag · ← →</span>
      </div>
    </div>
  );
};

export default Timeline;
