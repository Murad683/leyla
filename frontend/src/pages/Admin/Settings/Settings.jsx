import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminSettings, updateAdminSettings, uploadImage } from '../../../services/adminService';
import styles from './Settings.module.css';

const Settings = () => {
  const queryClient = useQueryClient();
  
  const { data: settingsData, isLoading } = useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: getAdminSettings
  });

  const [settings, setSettings] = useState({
    metaTitle: '',
    metaDescription: '',
    phone: '',
    email: '',
    address: '',
    logoUrl: '',
    facebookUrl: '',
    instagramUrl: '',
    linkedinUrl: '',
    twitterUrl: ''
  });

  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (settingsData) {
      setSettings(settingsData);
    }
  }, [settingsData]);

  const updateMutation = useMutation({
    mutationFn: updateAdminSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] });
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      setSuccessMsg('Nizamlamalar uğurla yadda saxlanıldı!');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    try {
      const res = await uploadImage(file);
      setSettings(prev => ({ ...prev, logoUrl: res.url }));
    } catch (error) {
      alert('Şəkil yüklənməsində xəta baş verdi');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(settings);
  };

  if (isLoading) return <p className={styles.loading}>Yüklənir...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Ümumi Parametrlər</h2>
          <p className={styles.subtitle}>Saytınızın qlobal SEO nizamlamaları, logo və əlaqə məlumatları.</p>
        </div>
      </div>

      {successMsg && <div className={styles.successAlert}>{successMsg}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* SEO Grid */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>SEO Parametrləri</h3>
          <div className={styles.grid}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Meta Başlıq (Title)</label>
              <input
                type="text"
                name="metaTitle"
                value={settings.metaTitle || ''}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Meta Açıqlama (Description)</label>
              <textarea
                name="metaDescription"
                value={settings.metaDescription || ''}
                onChange={handleChange}
                className={styles.textarea}
                rows={3}
                required
              />
            </div>
          </div>
        </div>

        {/* Visuals */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Brend Visuals</h3>
          <div className={styles.logoGrid}>
            <div className={styles.logoPreviewWrapper}>
              <label className={styles.label}>Cari Logo</label>
              <div className={styles.logoBox}>
                {settings.logoUrl ? (
                  <img src={settings.logoUrl} alt="Logo" className={styles.logoImage} />
                ) : (
                  <span className={styles.noLogo}>Logo Yoxdur</span>
                )}
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Yeni Logo Yüklə</label>
              <div className={styles.uploadBtnWrapper}>
                <button type="button" className={styles.uploadBtn}>
                  {uploading ? 'Yüklənir...' : '📁 Fayl Seç'}
                </button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className={styles.fileInput}
                  disabled={uploading}
                />
              </div>
              <span className={styles.helpText}>Ölçü limitləri: max 5MB. Tövsiyə olunan format: PNG/SVG.</span>
            </div>
          </div>
        </div>

        {/* Contacts Grid */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Əlaqə Məlumatları</h3>
          <div className={styles.grid2}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Telefon Nömrəsi</label>
              <input
                type="text"
                name="phone"
                value={settings.phone || ''}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>E-poçt Ünvanı</label>
              <input
                type="email"
                name="email"
                value={settings.email || ''}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroupFull}>
              <label className={styles.label}>Ünvan</label>
              <input
                type="text"
                name="address"
                value={settings.address || ''}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
          </div>
        </div>

        {/* Social Networks */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Sosial Şəbəkələr</h3>
          <div className={styles.grid2}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>LinkedIn Linki</label>
              <input
                type="url"
                name="linkedinUrl"
                value={settings.linkedinUrl || ''}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Instagram Linki</label>
              <input
                type="url"
                name="instagramUrl"
                value={settings.instagramUrl || ''}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Facebook Linki</label>
              <input
                type="url"
                name="facebookUrl"
                value={settings.facebookUrl || ''}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>X (Twitter) Linki</label>
              <input
                type="url"
                name="twitterUrl"
                value={settings.twitterUrl || ''}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? 'Saxlanılır...' : '💾 Nizamlamaları Yadda Saxla'}
        </button>
      </form>
    </div>
  );
};

export default Settings;
