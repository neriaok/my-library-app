import { useCallback, useEffect, useRef, useState, type CSSProperties, type FC } from 'react';
import clsx from 'clsx';
import type { Book } from '../../types';
import { useElementWidth } from '../../hooks/useElementWidth';
import { getAuthors, getCategory, getYear } from '../../utils/bookUtils';
import Tape from '../Tape';
import Timeline from '../Timeline';
import styles from './Shelf.module.css';

interface ShelfProps {
  books: Book[];
  onOpenBook: (book: Book) => void;
}

const BASE = { coverWidth: 168, height: 250, spineWidth: 36, gap: 3, radius: 760 };
const MAX_ANGLE = 1.35; // radians — tapes beyond this fade out
const WHEEL_STEP = 60;
const DRAG_STEP = 46;

const Shelf: FC<ShelfProps> = ({ books, onOpenBook }) => {
  const [activeIndex, setActiveIndex] = useState(() => Math.floor(books.length / 2));
  const [isMounted, setIsMounted] = useState(false);
  const { ref: stageRef, width: stageWidth } = useElementWidth<HTMLDivElement>();
  const wheelAccumulator = useRef(0);
  const drag = useRef<{ startX: number; moved: boolean } | null>(null);

  const scale = stageWidth ? Math.min(1, Math.max(0.55, stageWidth / 1150)) : 1;
  const coverWidth = BASE.coverWidth * scale;
  const height = BASE.height * scale;
  const spineWidth = BASE.spineWidth * scale;
  const gap = BASE.gap * scale;
  const radius = stageWidth ? Math.max(300, Math.min(BASE.radius, stageWidth * 0.53)) : BASE.radius;

  const go = useCallback(
    (index: number) => setActiveIndex(Math.max(0, Math.min(books.length - 1, index))),
    [books.length],
  );

  useEffect(() => {
    const id = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT') return;
      if (e.key === 'ArrowRight') go(activeIndex + 1);
      if (e.key === 'ArrowLeft') go(activeIndex - 1);
      if (e.key === 'Enter' && books[activeIndex]) onOpenBook(books[activeIndex]);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [activeIndex, books, go, onOpenBook]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      wheelAccumulator.current += Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(wheelAccumulator.current) >= WHEEL_STEP) {
        const steps = Math.trunc(wheelAccumulator.current / WHEEL_STEP);
        wheelAccumulator.current -= steps * WHEEL_STEP;
        setActiveIndex((current) => Math.max(0, Math.min(books.length - 1, current + steps)));
      }
    };
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [books.length, stageRef]);

  const handlePointerDown = (e: React.PointerEvent) => {
    drag.current = { startX: e.clientX, moved: false };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const delta = drag.current.startX - e.clientX;
    if (Math.abs(delta) >= DRAG_STEP) {
      const steps = Math.trunc(delta / DRAG_STEP);
      drag.current = { startX: drag.current.startX - steps * DRAG_STEP, moved: true };
      setActiveIndex((current) => Math.max(0, Math.min(books.length - 1, current + steps)));
    }
  };

  const handlePointerUp = () => {
    setTimeout(() => {
      drag.current = null;
    }, 0);
  };

  const handleTapeClick = (index: number) => {
    if (drag.current?.moved) return;
    if (index === activeIndex) onOpenBook(books[index]);
    else go(index);
  };

  const getTapeStyle = (index: number): CSSProperties => {
    const offset = index - activeIndex;
    const distance = Math.abs(offset);
    const arc = offset === 0 ? 0 : coverWidth / 2 + gap * 6 + (distance - 1) * (spineWidth + gap) + spineWidth / 2;
    const theta = (Math.sign(offset) * arc) / radius;
    const x = radius * Math.sin(theta);
    const z = radius * (Math.cos(theta) - 1);
    const isActive = offset === 0;
    const turn = isActive ? 0 : 90;
    const lift = isActive ? 70 * scale : 0;
    const hidden = Math.abs(theta) > MAX_ANGLE;
    const intro = isMounted ? '' : ` translateY(${60 * scale}px)`;

    return {
      transform: `translate3d(${x}px, 0, ${z + lift}px) rotateY(${theta * 0.45}rad) rotateY(${turn}deg) scale(${isActive ? 1.16 : 1})${intro}`,
      // Opacity on a preserve-3d element flattens it, so the fade is applied to the faces via a CSS variable.
      ['--tape-opacity' as string]: hidden || !isMounted ? 0 : 1,
      zIndex: 1000 - distance,
      transitionDelay: isMounted ? '0ms' : `${distance * 25}ms`,
      pointerEvents: hidden ? 'none' : 'auto',
    };
  };

  const active = books[activeIndex];
  const year = active ? getYear(active) : null;

  return (
    <section className={styles.shelf}>
      <div className={styles.body}>
        <div
          ref={stageRef}
          className={styles.stage}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <div className={styles.camera} style={{ height: height * 1.5 }}>
            <div className={styles.world}>
              {books.map((book, index) => (
                <button
                  key={book.id}
                  type="button"
                  className={clsx(styles.slot, index === activeIndex && styles.activeSlot)}
                  style={getTapeStyle(index)}
                  onClick={() => handleTapeClick(index)}
                  aria-label={book.volumeInfo.title}
                >
                  <Tape book={book} width={coverWidth} height={height} depth={spineWidth} className={styles.tape} />
                </button>
              ))}
            </div>
            <div className={styles.floorShadow} />
          </div>
        </div>

        {active && (
          <div className={styles.caption}>
            <button
              type="button"
              className={styles.arrow}
              onClick={() => go(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label="Previous book"
            >
              ←
            </button>
            <div key={active.id} className={styles.captionText}>
              <button type="button" className={styles.title} onClick={() => onOpenBook(active)}>
                {active.volumeInfo.title}
              </button>
              <p className={styles.authors}>{getAuthors(active)}</p>
              <p className={styles.meta}>
                {year ?? '—'} <span className={styles.dash}>—</span> {getCategory(active)}
                <span className={styles.dash}>·</span>
                {String(activeIndex + 1).padStart(2, '0')} / {String(books.length).padStart(2, '0')}
              </p>
            </div>
            <button
              type="button"
              className={styles.arrow}
              onClick={() => go(activeIndex + 1)}
              disabled={activeIndex === books.length - 1}
              aria-label="Next book"
            >
              →
            </button>
          </div>
        )}
      </div>

      <Timeline books={books} activeIndex={activeIndex} onSelect={go} />
    </section>
  );
};

export default Shelf;
