import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminHome, updateAdminHome } from '../../../services/adminService';
import { useToast } from '../../../components/admin/ui';
import styles from '../Settings/Settings.module.css';

function Section({ title, children, open = false }) {
  return (
    <details className={styles.card} open={open}>
      <summary className={styles.cardTitle} style={{ cursor: 'pointer', listStyle: 'revert' }}>
        {title}
      </summary>
      <div style={{ marginTop: 14 }}>{children}</div>
    </details>
  );
}

const EMPTY = {
  introEyebrow: '', introStatement: '', introAccent: '',
  introParagraphs: [], introTags: [],
  numbersEyebrow: '', stats: [],
  processEyebrow: '', processHeadline: '', processSteps: [],
  coursesEyebrow: '', coursesHeadline: '', courseHow: [], courseFaq: [],
  quotesEyebrow: '',
};

const toLines = (arr) => (Array.isArray(arr) ? arr.join('\n') : '');
const fromLines = (s) => String(s || '').split('\n').map((x) => x.trim()).filter(Boolean);
const toCsv = (arr) => (Array.isArray(arr) ? arr.join(', ') : '');
const fromCsv = (s) => String(s || '').split(',').map((x) => x.trim()).filter(Boolean);

function Repeater({ label, rows, cols, onChange }) {
  const set = (i, key, val) => {
    const next = rows.map((r, ri) => (ri === i ? { ...r, [key]: val } : r));
    onChange(next);
  };
  const add = () => onChange([...rows, Object.fromEntries(cols.map((c) => [c.key, '']))]);
  const del = (i) => onChange(rows.filter((_, ri) => ri !== i));
  return (
    <div className={styles.card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 className={styles.cardTitle}>{label}</h3>
        <button type="button" onClick={add} className={styles.uploadBtn}>+ Sətir</button>
      </div>
      {rows.map((row, i) => (
        <div key={i} className={styles.grid2} style={{ borderTop: '1px solid #eee', paddingTop: 12, marginTop: 12 }}>
          {cols.map((c) => (
            <div className={styles.inputGroup} key={c.key}>
              <label className={styles.label}>{c.label}</label>
              {c.textarea ? (
                <textarea className={styles.textarea} rows={2} value={row[c.key] || ''} onChange={(e) => set(i, c.key, e.target.value)} />
              ) : (
                <input className={styles.input} value={row[c.key] || ''} onChange={(e) => set(i, c.key, e.target.value)} />
              )}
            </div>
          ))}
          <button type="button" onClick={() => del(i)} className={styles.label} style={{ color: '#c0392b', cursor: 'pointer', textAlign: 'left' }}>Sil ✕</button>
        </div>
      ))}
    </div>
  );
}

const AdminHome = () => {
  const qc = useQueryClient();
  const toast = useToast();
  const { data, isLoading } = useQuery({ queryKey: ['admin', 'home'], queryFn: getAdminHome });
  const [f, setF] = useState(EMPTY);

  useEffect(() => {
    if (data) setF({ ...EMPTY, ...data, _introParagraphs: undefined, _introTags: undefined });
  }, [data]);

  const mut = useMutation({
    mutationFn: updateAdminHome,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'home'] });
      qc.invalidateQueries({ queryKey: ['home'] });
      toast.success('Yadda saxlanıldı');
    },
    onError: () => toast.error('Xəta baş verdi'),
  });

  const ch = (name) => (e) => setF((p) => ({ ...p, [name]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    mut.mutate({
      ...f,
      introParagraphs: fromLines(f._introParagraphs ?? toLines(f.introParagraphs)),
      introTags: fromCsv(f._introTags ?? toCsv(f.introTags)),
      stats: (f.stats || []).filter((s) => s.label || s.value),
      processSteps: (f.processSteps || []).filter((s) => s.title || s.text)
        .map((s) => ({ ...s, tags: Array.isArray(s.tags) ? s.tags : fromCsv(s.tags) })),
      courseHow: (f.courseHow || []).filter((h) => h.t || h.d),
      courseFaq: (f.courseFaq || []).filter((q) => q.q || q.a),
    });
  };

  if (isLoading) return <p className={styles.loading}>Yüklənir...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Ana səhifə mətnləri</h2>
          <p className={styles.subtitle}>Yanaşma bölməsi, rəqəmlər, iş prosesi və kurs bölməsinin köməkçi mətnləri.</p>
        </div>
      </div>

      <form onSubmit={submit} className={styles.form}>
        <Section title="Yanaşma (Intro)" open>
          <div className={styles.grid2}>
            <div className={styles.inputGroup}><label className={styles.label}>Etiket</label><input className={styles.input} value={f.introEyebrow || ''} onChange={ch('introEyebrow')} /></div>
            <div className={styles.inputGroup}><label className={styles.label}>Vurğu sözü</label><input className={styles.input} value={f.introAccent || ''} onChange={ch('introAccent')} /></div>
          </div>
          <div className={styles.inputGroup}><label className={styles.label}>Bəyanat (böyük cümlə)</label><textarea className={styles.textarea} rows={2} value={f.introStatement || ''} onChange={ch('introStatement')} /></div>
          <div className={styles.inputGroup}><label className={styles.label}>Paraqraflar (hər sətir — ayrı paraqraf)</label><textarea className={styles.textarea} rows={4} value={f._introParagraphs ?? toLines(f.introParagraphs)} onChange={ch('_introParagraphs')} /></div>
          <div className={styles.inputGroup}><label className={styles.label}>Teqlər (vergüllə)</label><input className={styles.input} value={f._introTags ?? toCsv(f.introTags)} onChange={ch('_introTags')} /></div>
        </Section>

        <Section title="Rəqəmlər">
          <div className={styles.inputGroup}><label className={styles.label}>Etiket</label><input className={styles.input} value={f.numbersEyebrow || ''} onChange={ch('numbersEyebrow')} /></div>
          <Repeater label="Statistika" rows={f.stats || []} onChange={(v) => setF((p) => ({ ...p, stats: v }))}
            cols={[{ key: 'value', label: 'Rəqəm (məs. 16)' }, { key: 'suffix', label: 'Şəkilçi (məs. K+)' }, { key: 'label', label: 'Ad' }]} />
        </Section>

        <Section title="İş prosesi">
          <div className={styles.grid2}>
            <div className={styles.inputGroup}><label className={styles.label}>Etiket</label><input className={styles.input} value={f.processEyebrow || ''} onChange={ch('processEyebrow')} /></div>
            <div className={styles.inputGroup}><label className={styles.label}>Başlıq</label><input className={styles.input} value={f.processHeadline || ''} onChange={ch('processHeadline')} /></div>
          </div>
          <Repeater label="Mərhələlər" rows={(f.processSteps || []).map((s) => ({ ...s, tags: Array.isArray(s.tags) ? s.tags.join(', ') : s.tags }))} onChange={(v) => setF((p) => ({ ...p, processSteps: v }))}
            cols={[{ key: 'title', label: 'Başlıq' }, { key: 'text', label: 'Mətn', textarea: true }, { key: 'tags', label: 'Teqlər (vergüllə)' }]} />
        </Section>

        <Section title="Kurslar bölməsi + «Kurslar» səhifəsi köməkçi mətnləri">
          <div className={styles.grid2}>
            <div className={styles.inputGroup}><label className={styles.label}>Etiket</label><input className={styles.input} value={f.coursesEyebrow || ''} onChange={ch('coursesEyebrow')} /></div>
            <div className={styles.inputGroup}><label className={styles.label}>Başlıq</label><input className={styles.input} value={f.coursesHeadline || ''} onChange={ch('coursesHeadline')} /></div>
          </div>
          <Repeater label="Kurs — «Necə keçir»" rows={f.courseHow || []} onChange={(v) => setF((p) => ({ ...p, courseHow: v }))}
            cols={[{ key: 't', label: 'Başlıq' }, { key: 'd', label: 'Mətn', textarea: true }]} />
          <Repeater label="Kurs — Suallar (FAQ)" rows={f.courseFaq || []} onChange={(v) => setF((p) => ({ ...p, courseFaq: v }))}
            cols={[{ key: 'q', label: 'Sual' }, { key: 'a', label: 'Cavab', textarea: true }]} />
        </Section>

        <Section title="Rəylər bölməsi">
          <div className={styles.inputGroup}><label className={styles.label}>Etiket</label><input className={styles.input} value={f.quotesEyebrow || ''} onChange={ch('quotesEyebrow')} /></div>
        </Section>

        <button type="submit" className={styles.submitBtn} disabled={mut.isPending}>
          {mut.isPending ? 'Saxlanılır...' : '💾 Yadda Saxla'}
        </button>
      </form>
    </div>
  );
};

export default AdminHome;
