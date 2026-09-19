import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminLeadMagnet, updateLeadMagnet, uploadImage } from '../../../services/adminService';
import { useToast } from '../../../components/admin/ui';
import styles from '../Settings/Settings.module.css';

const EMPTY = { title: '', description: '', fileUrl: '', isActive: true };

const AdminLeadMagnet = () => {
  const qc = useQueryClient();
  const toast = useToast();
  const [f, setF] = useState(EMPTY);
  const [uploading, setUploading] = useState(false);

  const { data, isLoading } = useQuery({ queryKey: ['admin', 'leadMagnet'], queryFn: getAdminLeadMagnet });

  useEffect(() => {
    if (data) setF({ title: data.title || '', description: data.description || '', fileUrl: data.fileUrl || '', isActive: data.isActive ?? true });
  }, [data]);

  const updateM = useMutation({
    mutationFn: updateLeadMagnet,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'leadMagnet'] });
      qc.invalidateQueries({ queryKey: ['leadMagnet'] });
      toast.success('Yadda saxlanıldı');
    },
    onError: () => toast.error('Xəta baş verdi'),
  });

  const ch = (e) => {
    const { name, value, type, checked } = e.target;
    setF((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadImage(file);
      setF((p) => ({ ...p, fileUrl: res.url }));
      toast.success('Fayl yükləndi');
    } catch {
      toast.error('Fayl yüklənmədi');
    } finally {
      setUploading(false);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    updateM.mutate(f);
  };

  if (isLoading) return <p className={styles.loading}>Yüklənir...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Lead Magnet</h2>
          <p className={styles.subtitle}>Pulsuz yüklənə bilən material (PDF, checklist və s.) — "Pulsuz Öyrənmə" bölməsində göstərilir.</p>
        </div>
      </div>

      <form onSubmit={submit} className={styles.form}>
        <div className={styles.card}>
          <div className={styles.grid}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Başlıq</label>
              <input type="text" name="title" value={f.title} onChange={ch} className={styles.input} placeholder="Məs: Pulsuz Başlanğıc Checklist-i" />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Təsvir</label>
              <textarea name="description" value={f.description} onChange={ch} className={styles.textarea} rows={3} />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Fayl (PDF)</label>
              <div className={styles.uploadBtnWrapper}>
                <button type="button" className={styles.uploadBtn}>
                  {uploading ? 'Yüklənir...' : '📁 Fayl Seç'}
                </button>
                <input type="file" accept="application/pdf" onChange={handleFileUpload} className={styles.fileInput} disabled={uploading} />
              </div>
              {f.fileUrl && <span className={styles.helpText}>Yüklənib: <a href={f.fileUrl} target="_blank" rel="noreferrer">faylı gör</a></span>}
            </div>
            <label className={styles.label} style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="checkbox" name="isActive" checked={f.isActive} onChange={ch} /> Saytda göstərilsin
            </label>
          </div>
        </div>

        <button type="submit" className={styles.submitBtn} disabled={updateM.isPending}>
          {updateM.isPending ? 'Saxlanılır...' : '💾 Yadda Saxla'}
        </button>
      </form>
    </div>
  );
};

export default AdminLeadMagnet;
