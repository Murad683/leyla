import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminHero, updateAdminHero, uploadImage } from '../../../services/adminService';
import styles from './Hero.module.css';

const Hero = () => {
  const queryClient = useQueryClient();

  const { data: heroData, isLoading } = useQuery({
    queryKey: ['admin', 'hero'],
    queryFn: getAdminHero
  });

  const [hero, setHero] = useState({
    badge: '',
    title: '',
    description: '',
    primaryBtnText: '',
    primaryBtnUrl: '',
    secondaryBtnText: '',
    secondaryBtnUrl: '',
    bgImage: '',
    videoUrl: ''
  });

  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (heroData) {
      setHero(heroData);
    }
  }, [heroData]);

  const updateMutation = useMutation({
    mutationFn: updateAdminHero,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'hero'] });
      queryClient.invalidateQueries({ queryKey: ['hero'] });
      setSuccessMsg('Hero bölməsi uğurla yeniləndi!');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHero(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    try {
      const res = await uploadImage(file);
      setHero(prev => ({ ...prev, bgImage: res.url }));
    } catch (error) {
      alert('Şəkil yüklənməsində xəta baş verdi');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate(hero);
  };

  if (isLoading) return <p className={styles.loading}>Yüklənir...</p>;

  return (
    <div className={styles.container}>
      <div>
        <h2 className={styles.title}>Hero Bölməsi</h2>
        <p className={styles.subtitle}>Ana səhifənin ən üst hissəsindəki başlıq, mətn, düymələr və arxa plan.</p>
      </div>

      {successMsg && <div className={styles.successAlert}>{successMsg}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Main Content Card */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Məzmun</h3>
          <div className={styles.grid}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Badge Mətni</label>
              <input
                type="text"
                name="badge"
                value={hero.badge || ''}
                onChange={handleChange}
                className={styles.input}
                placeholder="Rəqəmsal Marketinq Agentliyi"
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Əsas Başlıq (Title)</label>
              <input
                type="text"
                name="title"
                value={hero.title || ''}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Açıqlama Mətni</label>
              <textarea
                name="description"
                value={hero.description || ''}
                onChange={handleChange}
                className={styles.textarea}
                rows={4}
                required
              />
            </div>
          </div>
        </div>

        {/* Buttons Card */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Keçid Düymələri</h3>
          <div className={styles.grid2}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Birinci Düymə Mətni</label>
              <input
                type="text"
                name="primaryBtnText"
                value={hero.primaryBtnText || ''}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Birinci Düymə Linki (URL)</label>
              <input
                type="text"
                name="primaryBtnUrl"
                value={hero.primaryBtnUrl || ''}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>İkinci Düymə Mətni</label>
              <input
                type="text"
                name="secondaryBtnText"
                value={hero.secondaryBtnText || ''}
                onChange={handleChange}
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>İkinci Düymə Linki (URL)</label>
              <input
                type="text"
                name="secondaryBtnUrl"
                value={hero.secondaryBtnUrl || ''}
                onChange={handleChange}
                className={styles.input}
              />
            </div>
          </div>
        </div>

        {/* Media Card */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Media və Arxa Plan</h3>
          <div className={styles.mediaGrid}>
            <div className={styles.imagePreviewWrapper}>
              <label className={styles.label}>Cari Şəkil</label>
              <div className={styles.imageBox}>
                {hero.bgImage ? (
                  <img src={hero.bgImage} alt="Hero Background" className={styles.previewImg} />
                ) : (
                  <span className={styles.noImg}>Şəkil Yoxdur</span>
                )}
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Yeni Arxa Plan Şəkli Yüklə</label>
              <div className={styles.uploadBtnWrapper}>
                <button type="button" className={styles.uploadBtn}>
                  {uploading ? 'Yüklənir...' : '📁 Şəkil Seç'}
                </button>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className={styles.fileInput}
                  disabled={uploading}
                />
              </div>
              <span className={styles.helpText}>Tövsiyə olunan ölçü: 1920x1080 (HD). Maksimum ölçü: 5MB.</span>
            </div>

            <div className={styles.inputGroupFull}>
              <label className={styles.label}>Video Linki (YouTube / Vimeo / Direct URL)</label>
              <input
                type="text"
                name="videoUrl"
                value={hero.videoUrl || ''}
                onChange={handleChange}
                className={styles.input}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? 'Saxlanılır...' : '💾 Hero Bölməsini Yadda Saxla'}
        </button>
      </form>
    </div>
  );
};

export default Hero;
