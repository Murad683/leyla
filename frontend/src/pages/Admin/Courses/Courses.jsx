import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCourses } from '../../../services/settingsService';
import { createCourse, updateCourse, deleteCourse } from '../../../services/adminService';
import styles from '../Services/Services.module.css';

const EMPTY = {
  title: '', slug: '', meta: '', format: '', description: '',
  program: '', audience: '', outcome: '', sortOrder: 0, isPublished: true,
};

const AdminCourses = () => {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [f, setF] = useState(EMPTY);

  const { data: courses, isLoading } = useQuery({ queryKey: ['courses'], queryFn: getCourses });

  const inval = () => {
    qc.invalidateQueries({ queryKey: ['courses'] });
    setOpen(false);
    setEditing(null);
  };
  const createM = useMutation({ mutationFn: createCourse, onSuccess: inval });
  const updateM = useMutation({ mutationFn: ({ id, data }) => updateCourse(id, data), onSuccess: inval });
  const deleteM = useMutation({ mutationFn: deleteCourse, onSuccess: () => qc.invalidateQueries({ queryKey: ['courses'] }) });

  const openAdd = () => {
    setEditing(null);
    setF({ ...EMPTY, sortOrder: courses?.length || 0 });
    setOpen(true);
  };
  const openEdit = (c) => {
    setEditing(c);
    setF({
      title: c.title || '', slug: c.slug || '', meta: c.meta || '', format: c.format || '',
      description: c.description || '',
      program: Array.isArray(c.program) ? c.program.join('\n') : (c.program || ''),
      audience: c.audience || '', outcome: c.outcome || '',
      sortOrder: c.sortOrder ?? 0, isPublished: c.isPublished ?? true,
    });
    setOpen(true);
  };

  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    if (open) window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open]);

  const ch = (e) => {
    const { name, value, type, checked } = e.target;
    setF((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const submit = (e) => {
    e.preventDefault();
    const payload = {
      ...f,
      sortOrder: Number(f.sortOrder) || 0,
      program: String(f.program || '').split('\n').map((x) => x.trim()).filter(Boolean),
    };
    if (editing) updateM.mutate({ id: editing.id, data: payload });
    else createM.mutate(payload);
  };

  if (isLoading) return <p className={styles.loading}>Yüklənir...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Kurslar</h2>
          <p className={styles.subtitle}>«Kurslar» səhifəsi və ana səhifədəki kurs siyahısı.</p>
        </div>
        <button onClick={openAdd} className={styles.addBtn}>➕ Yeni Kurs</button>
      </div>

      <div className={styles.grid}>
        {courses?.map((c) => (
          <div key={c.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.serviceIcon}>🎓</span>
              <div className={styles.actions}>
                <button onClick={() => openEdit(c)} className={styles.editBtn}>✏️ Redaktə</button>
                <button onClick={() => window.confirm('Silinsin?') && deleteM.mutate(c.id)} className={styles.deleteBtn}>🗑️ Sil</button>
              </div>
            </div>
            <h3 className={styles.serviceTitle}>{c.title}</h3>
            <p className={styles.serviceDesc}>{c.meta}</p>
            <p className={styles.serviceDesc}>{c.description}</p>
          </div>
        ))}
      </div>

      {open && (
        <div className={styles.modalOverlay} onClick={() => setOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>{editing ? 'Kursu Redaktə Et' : 'Yeni Kurs'}</h3>
            <form onSubmit={submit} className={styles.form}>
              <div className={styles.inputGroup}><label className={styles.label}>Ad</label><input name="title" value={f.title} onChange={ch} className={styles.input} required /></div>
              <div className={styles.inputGroup}><label className={styles.label}>Qısa format (ana səhifə — məs. «6 həftə · canlı»)</label><input name="meta" value={f.meta} onChange={ch} className={styles.input} /></div>
              <div className={styles.inputGroup}><label className={styles.label}>Tam format («Kurslar» səhifəsi)</label><input name="format" value={f.format} onChange={ch} className={styles.input} /></div>
              <div className={styles.inputGroup}><label className={styles.label}>Açıqlama</label><textarea name="description" value={f.description} onChange={ch} className={styles.textarea} rows={3} /></div>
              <div className={styles.inputGroup}><label className={styles.label}>Proqram (hər sətir — ayrı bənd)</label><textarea name="program" value={f.program} onChange={ch} className={styles.textarea} rows={5} /></div>
              <div className={styles.inputGroup}><label className={styles.label}>Kimə uyğundur</label><input name="audience" value={f.audience} onChange={ch} className={styles.input} /></div>
              <div className={styles.inputGroup}><label className={styles.label}>Nəticə</label><input name="outcome" value={f.outcome} onChange={ch} className={styles.input} /></div>
              <div className={styles.inputGroup}><label className={styles.label}>Sıra</label><input type="number" name="sortOrder" value={f.sortOrder} onChange={ch} className={styles.input} /></div>
              <label className={styles.label} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input type="checkbox" name="isPublished" checked={f.isPublished} onChange={ch} /> Dərc edilsin
              </label>
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setOpen(false)} className={styles.cancelBtn}>Ləğv Et</button>
                <button type="submit" className={styles.submitBtn} disabled={createM.isPending || updateM.isPending}>
                  {createM.isPending || updateM.isPending ? 'Saxlanılır...' : 'Yadda Saxla'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourses;
