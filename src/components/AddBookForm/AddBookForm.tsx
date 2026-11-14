import { useState, type ChangeEvent, type FC, type FormEvent } from 'react';
import type { Book } from '../../types';
import styles from './AddBookForm.module.css';

interface AddBookFormProps {
  onSubmit: (book: Book) => void;
  onCancel: () => void;
}

interface FormState {
  title: string;
  author: string;
  publishedDate: string;
  pageCount: string;
  category: string;
  description: string;
}

const EMPTY_FORM: FormState = {
  title: '',
  author: '',
  publishedDate: '',
  pageCount: '',
  category: '',
  description: '',
};

const AddBookForm: FC<AddBookFormProps> = ({ onSubmit, onCancel }) => {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [cover, setCover] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setCover(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim()) {
      setError('Title and author are required');
      return;
    }
    onSubmit({
      id: `manual_${Date.now()}`,
      volumeInfo: {
        title: form.title.trim(),
        authors: [form.author.trim()],
        publishedDate: form.publishedDate || undefined,
        pageCount: form.pageCount ? Number(form.pageCount) : undefined,
        categories: form.category ? [form.category] : undefined,
        description: form.description || undefined,
        imageLinks: cover ? { thumbnail: cover } : undefined,
      },
    });
  };

  return (
    <div className={styles.backdrop} onClick={onCancel}>
      <form className={styles.form} onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
        <p className={styles.eyebrow}>New entry</p>
        <h2 className={styles.heading}>Add a book</h2>

        <div className={styles.grid}>
          <label className={styles.field}>
            Title *
            <input name="title" value={form.title} onChange={handleChange} autoFocus />
          </label>
          <label className={styles.field}>
            Author *
            <input name="author" value={form.author} onChange={handleChange} />
          </label>
          <label className={styles.field}>
            Year
            <input name="publishedDate" value={form.publishedDate} onChange={handleChange} inputMode="numeric" />
          </label>
          <label className={styles.field}>
            Pages
            <input name="pageCount" type="number" value={form.pageCount} onChange={handleChange} />
          </label>
          <label className={styles.field}>
            Category
            <input name="category" value={form.category} onChange={handleChange} />
          </label>
          <label className={styles.field}>
            Cover
            <input type="file" accept="image/*" onChange={handleCoverChange} className={styles.file} />
          </label>
          <label className={`${styles.field} ${styles.wide}`}>
            Description
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
          </label>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <button type="button" className={styles.secondary} onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className={styles.primary}>
            Add to shelf
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBookForm;
