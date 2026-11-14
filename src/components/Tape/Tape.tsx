import { useState, type CSSProperties, type FC } from 'react';
import clsx from 'clsx';
import type { Book } from '../../types';
import { getAuthors, getCoverSources, getSpineTheme, getYear } from '../../utils/bookUtils';
import styles from './Tape.module.css';

interface TapeProps {
  book: Book;
  width: number;
  height: number;
  depth: number;
  className?: string;
  style?: CSSProperties;
}

/** A book rendered as a 3D box: cover on the front, spine on the left side. */
const Tape: FC<TapeProps> = ({ book, width, height, depth, className, style }) => {
  const theme = getSpineTheme(book);
  const coverSources = getCoverSources(book, width > 200 ? 'L' : 'M');
  const [coverIndex, setCoverIndex] = useState(0);
  const coverSrc = coverSources[coverIndex];
  const { title } = book.volumeInfo;
  const year = getYear(book);

  const handleCoverError = () => setCoverIndex((index) => index + 1);

  const vars = {
    '--w': `${width}px`,
    '--h': `${height}px`,
    '--d': `${depth}px`,
    '--spine-bg': theme.background,
    '--spine-fg': theme.color,
    '--spine-accent': theme.accent,
    ...style,
  } as CSSProperties;

  const showImage = Boolean(coverSrc);

  return (
    <div className={clsx(styles.tape, className)} style={vars}>
      <div className={clsx(styles.face, styles.cover)}>
        {showImage ? (
          <img src={coverSrc} alt={title} className={styles.coverImage} onError={handleCoverError} draggable={false} />
        ) : (
          <div className={styles.generatedCover}>
            <span className={styles.generatedInitial}>{title.charAt(0)}</span>
            <span className={styles.generatedTitle}>{title}</span>
            <span className={styles.generatedAuthor}>{getAuthors(book)}</span>
          </div>
        )}
        <span className={styles.gloss} />
        <span className={styles.badge}>Book</span>
      </div>

      <div className={clsx(styles.face, styles.spine)}>
        <span className={styles.spineMark} />
        <span className={styles.spineTitle}>{title}</span>
        <span className={styles.spineBadge}>{year ? String(year).slice(-2) : '—'}</span>
      </div>

      <div className={clsx(styles.face, styles.pages)} />
      <div className={clsx(styles.face, styles.back)} />
      <div className={clsx(styles.face, styles.top)} />
    </div>
  );
};

export default Tape;
