import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getVideoLessons } from '../../../services/settingsService';
import { createVideoLesson, updateVideoLesson, deleteVideoLesson, uploadImage } from '../../../services/adminService';
import { useToast, useConfirm, useDragReorder } from '../../../components/admin/ui';
import styles from '../Services/Services.module.css';

const EMPTY = {
  title: '',
  badgeTag: '',
  audienceTag: '',
  description: '',
  youtubeId: '',
  thumbnailUrl: '',
  sortOrder: 0,
  isPublished: true,
};

const AdminVideoLessons = () => {
  const qc = useQueryClient();
  const toast = useToast();
  const confirm = useConfirm();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [f, setF] = useState(EMPTY);
  const [uploading, setUploading] = useState(false);

  const { data: items, isLoading } = useQuery({ queryKey: ['videoLessons'], queryFn: getVideoLessons });

  const inval = (msg) => {
    qc.invalidateQueries({ queryKey: ['videoLessons'] });
    if (msg) toast.success(msg);
    setOpen(false);
    setEditing(null);
  };
  const createM = useMutation({ mutationFn: createVideoLesson, onSuccess: () => inval('Dərs əlavə olundu'), onError: () => toast.error('Xəta baş verdi') });
  const updateM = useMutation({ mutationFn: ({ id, data }) => updateVideoLesson(id, data), onSuccess: () => inval('Yadda saxlanıldı'), onError: () => toast.error('Xəta baş verdi') });
  const deleteM = useMutation({ mutationFn: deleteVideoLesson, onSuccess: () => { qc.invalidateQueries({ queryKey: ['videoLessons'] }); toast.success('Silindi'); }, onError: () => toast.error('Silinmədi') });

  const persistOrder = async (next) => {
    qc.setQueryData(['videoLessons'], next);
    try {
      await Promise.all(next.map((it, i) => (it.sortOrder === i ? null : updateVideoLesson(it.id, { sortOrder: i }))).filter(Boolean));
      toast.success('Sıra yeniləndi');
    } catch { toast.error('Sıra yenilənmədi'); }
    finally { qc.invalidateQueries({ queryKey: ['videoLessons'] }); }
  };
  const dnd = useDragReorder(items || [], persistOrder);

  const openAdd = () => { setEditing(null); setF({ ...EMPTY, sortOrder: items?.length || 0 }); setOpen(true); };
  const openEdit = (v) => {
    setEditing(v);
    setF({
      title: v.title || '',
      badgeTag: v.badgeTag || '',
      audienceTag: v.audienceTag || '',
      description: v.description || '',
      youtubeId: v.youtubeId || '',
      thumbnailUrl: v.thumbnailUrl || '',
      sortOrder: v.sortOrder ?? 0,
      isPublished: v.isPublished ?? true,
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

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadImage(file);
      setF((p) => ({ ...p, thumbnailUrl: res.url }));
      toast.success('Şəkil yükləndi');
    } catch {
      toast.error('Şəkil yüklənmədi');
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
          <h2 className={styles.title}>Video Dərslər</h2>
          <p className={styles.subtitle}>Ana səhifədəki pulsuz YouTube dərs kartları. Kartları sürükləyərək sırala.</p>
        </div>
        <button onClick={openAdd} className={styles.addBtn}>➕ Yeni Dərs</button>
      </div>

      <div className={styles.grid}>
        {items?.map((v, i) => (
          <div
            key={v.id}
            className={styles.card}
            {...dnd.row(i)}
            style={{ cursor: 'grab', opacity: dnd.dragging === i ? 0.4 : 1, outline: dnd.over === i && dnd.dragging !== i ? '2px dashed #e5544b' : 'none', outlineOffset: 2 }}
          >
            <div className={styles.cardHeader}>
              <span className={styles.serviceIcon}>🎬</span>
              <div className={styles.actions}>
                <button onClick={() => openEdit(v)} className={styles.editBtn}>✏️ Redaktə</button>
                <button onClick={async () => { if (await confirm({ body: 'Bu dərs silinsin?' })) deleteM.mutate(v.id); }} className={styles.deleteBtn}>🗑️ Sil</button>
              </div>
            </div>
            <h3 className={styles.serviceTitle}>{v.title}</h3>
            <p className={styles.serviceDesc}>{v.badgeTag} {v.audienceTag && `· ${v.audienceTag}`}</p>
            <p className={styles.serviceDesc}>{v.description}</p>
          </div>
        ))}
      </div>

      {open && (
        <div className={styles.modalOverlay} onClick={() => setOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>{editing ? 'Dərsi Redaktə Et' : 'Yeni Dərs'}</h3>
            <form onSubmit={submit} className={styles.form}>
              <div className={styles.inputGroup}><label className={styles.label}>Başlıq</label><input name="title" value={f.title} onChange={ch} className={styles.input} required /></div>
              <div className={styles.inputGroup}><label className={styles.label}>Badge (məs. HD İzah)</label><input name="badgeTag" value={f.badgeTag} onChange={ch} className={styles.input} /></div>
              <div className={styles.inputGroup}><label className={styles.label}>Auditoriya (məs. Bütün səviyyələr üçün)</label><input name="audienceTag" value={f.audienceTag} onChange={ch} className={styles.input} /></div>
              <div className={styles.inputGroup}><label className={styles.label}>Təsvir</label><textarea name="description" value={f.description} onChange={ch} className={styles.textarea} rows={3} /></div>
              <div className={styles.inputGroup}><label className={styles.label}>YouTube Video ID (məs. dQw4w9WgXcQ)</label><input name="youtubeId" value={f.youtubeId} onChange={ch} className={styles.input} required /></div>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Üz şəkli (thumbnail)</label>
                <input type="file" accept="image/*" onChange={handleThumbnailUpload} disabled={uploading} />
                {f.thumbnailUrl && <img src={f.thumbnailUrl} alt="" style={{ maxWidth: 160, marginTop: 8, borderRadius: 8 }} />}
              </div>
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

export default AdminVideoLessons;
