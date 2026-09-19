import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getTestimonials } from '../../../services/settingsService';
import { createTestimonial, updateTestimonial, deleteTestimonial, uploadImage } from '../../../services/adminService';
import { useToast, useConfirm, useDragReorder } from '../../../components/admin/ui';
import styles from '../Services/Services.module.css';

const EMPTY = { quote: '', author: '', role: '', screenshotUrl: '', videoUrl: '', sortOrder: 0, isPublished: true };

const AdminTestimonials = () => {
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [f, setF] = useState(EMPTY);
  const [uploading, setUploading] = useState(false);

  const { data: items, isLoading } = useQuery({ queryKey: ['testimonials'], queryFn: getTestimonials });

  const inval = (msg) => {
    qc.invalidateQueries({ queryKey: ['testimonials'] });
    if (msg) toast.success(msg);
    setOpen(false);
    setEditing(null);
  };
  const createM = useMutation({ mutationFn: createTestimonial, onSuccess: () => inval('Rəy əlavə olundu'), onError: () => toast.error('Xəta baş verdi') });
  const updateM = useMutation({ mutationFn: ({ id, data }) => updateTestimonial(id, data), onSuccess: () => inval('Yadda saxlanıldı'), onError: () => toast.error('Xəta baş verdi') });
  const deleteM = useMutation({ mutationFn: deleteTestimonial, onSuccess: () => { qc.invalidateQueries({ queryKey: ['testimonials'] }); toast.success('Silindi'); }, onError: () => toast.error('Silinmədi') });

  const persistOrder = async (next) => {
    qc.setQueryData(['testimonials'], next);
    try {
      await Promise.all(next.map((it, i) => (it.sortOrder === i ? null : updateTestimonial(it.id, { sortOrder: i }))).filter(Boolean));
      toast.success('Sıra yeniləndi');
    } catch { toast.error('Sıra yenilənmədi'); }
    finally { qc.invalidateQueries({ queryKey: ['testimonials'] }); }
  };
  const dnd = useDragReorder(items || [], persistOrder);

  const openAdd = () => { setEditing(null); setF({ ...EMPTY, sortOrder: items?.length || 0 }); setOpen(true); };
  const openEdit = (t) => {
    setEditing(t);
    setF({
      quote: t.quote || '',
      author: t.author || '',
      role: t.role || '',
      screenshotUrl: t.screenshotUrl || '',
      videoUrl: t.videoUrl || '',
      sortOrder: t.sortOrder ?? 0,
      isPublished: t.isPublished ?? true,
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

  const handleScreenshotUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadImage(file);
      setF((p) => ({ ...p, screenshotUrl: res.url }));
      toast.success('Skrinşot yükləndi');
    } catch {
      toast.error('Skrinşot yüklənmədi');
    } finally {
      setUploading(false);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    const payload = { ...f, sortOrder: Number(f.sortOrder) || 0 };
    if (editing) updateM.mutate({ id: editing.id, data: payload });
    else createM.mutate(payload);
  };

  if (isLoading) return <p className={styles.loading}>Yüklənir...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Rəylər</h2>
          <p className={styles.subtitle}>Ana səhifədəki müştəri rəyləri. Kartları sürükləyərək sırala.</p>
        </div>
        <button onClick={openAdd} className={styles.addBtn}>➕ Yeni Rəy</button>
      </div>

      <div className={styles.grid}>
        {items?.map((t, i) => (
          <div
            key={t.id}
            className={styles.card}
            {...dnd.row(i)}
            style={{ cursor: 'grab', opacity: dnd.dragging === i ? 0.4 : 1, outline: dnd.over === i && dnd.dragging !== i ? '2px dashed #e5544b' : 'none', outlineOffset: 2 }}
          >
            <div className={styles.cardHeader}>
              <span className={styles.serviceIcon}>💬</span>
              <div className={styles.actions}>
                <button onClick={() => openEdit(t)} className={styles.editBtn}>✏️ Redaktə</button>
                <button onClick={async () => { if (await confirm({ body: 'Bu rəy silinsin?' })) deleteM.mutate(t.id); }} className={styles.deleteBtn}>🗑️ Sil</button>
              </div>
            </div>
            {t.screenshotUrl && <img src={t.screenshotUrl} alt="" style={{ width: '100%', borderRadius: 8, marginBottom: 8 }} />}
            <p className={styles.serviceDesc}>"{t.quote}"</p>
            <h3 className={styles.serviceTitle}>{t.author}</h3>
            <p className={styles.serviceDesc}>{t.role}</p>
            {t.videoUrl && <p className={styles.serviceDesc}>🎥 Video rəy əlavə olunub</p>}
          </div>
        ))}
      </div>

      {open && (
        <div className={styles.modalOverlay} onClick={() => setOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>{editing ? 'Rəyi Redaktə Et' : 'Yeni Rəy'}</h3>
            <form onSubmit={submit} className={styles.form}>
              <div className={styles.inputGroup}><label className={styles.label}>Rəy mətni</label><textarea name="quote" value={f.quote} onChange={ch} className={styles.textarea} rows={4} required /></div>
              <div className={styles.inputGroup}><label className={styles.label}>Müəllif</label><input name="author" value={f.author} onChange={ch} className={styles.input} required /></div>
              <div className={styles.inputGroup}><label className={styles.label}>Rol / brend</label><input name="role" value={f.role} onChange={ch} className={styles.input} /></div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Skrinşot (WhatsApp təşəkkürü və s.)</label>
                <input type="file" accept="image/*" onChange={handleScreenshotUpload} disabled={uploading} />
                {f.screenshotUrl && <img src={f.screenshotUrl} alt="" style={{ maxWidth: 160, marginTop: 8, borderRadius: 8 }} />}
              </div>
              <div className={styles.inputGroup}><label className={styles.label}>Video rəy linki (istəyə bağlı)</label><input name="videoUrl" value={f.videoUrl} onChange={ch} className={styles.input} placeholder="https://..." /></div>
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

export default AdminTestimonials;
