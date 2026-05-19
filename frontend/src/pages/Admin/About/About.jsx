import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminAbout, updateAdminAbout, uploadImage } from '../../../services/adminService';
import styles from './About.module.css';

const About = () => {
  const queryClient = useQueryClient();

  const { data: aboutData, isLoading } = useQuery({
    queryKey: ['admin', 'about'],
    queryFn: getAdminAbout
  });

  const [about, setAbout] = useState({
    story: '',
    experienceYears: 8,
    mainImage: ''
  });

  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (aboutData) {
      setAbout(aboutData);
    }
  }, [aboutData]);

  const updateMutation = useMutation({
    mutationFn: updateAdminAbout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'about'] });
      queryClient.invalidateQueries({ queryKey: ['about'] });
      setSuccessMsg('Haqqımızda bölməsi uğurla yeniləndi!');
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAbout(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    try {
      const res = await uploadImage(file);
      setAbout(prev => ({ ...prev, mainImage: res.url }));
    } catch (error) {
      alert('Şəkil yüklənməsində xəta baş verdi');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateMutation.mutate({
      story: about.story,
      experienceYears: parseInt(about.experienceYears),
      mainImage: about.mainImage
    });
  };

  if (isLoading) return <p className={styles.loading}>Yüklənir...</p>;

  return (
    <div className={styles.container}>
      <div>
        <h2 className={styles.title}>Haqqımızda Bölməsi</h2>
        <p className={styles.subtitle}>Şirkət hekayəsi, iş təcrübəsi (il olaraq) və əsas nümayiş şəkli.</p>
      </div>

      {successMsg && <div className={styles.successAlert}>{successMsg}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Story details */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Hekayəmiz və Təcrübə</h3>
          <div className={styles.grid}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Təcrübə Müddəti (İl ilə)</label>
              <input
                type="number"
                name="experienceYears"
                value={about.experienceYears || ''}
                onChange={handleChange}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Şirkət Hekayəsi (Story)</label>
              <textarea
                name="story"
                value={about.story || ''}
                onChange={handleChange}
                className={styles.textarea}
                rows={8}
                required
              />
            </div>
          </div>
        </div>

        {/* Story main image */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Haqqımızda Şəkli</h3>
          <div className={styles.mediaGrid}>
            <div className={styles.imagePreviewWrapper}>
              <label className={styles.label}>Cari Şəkil</label>
              <div className={styles.imageBox}>
                {about.mainImage ? (
                  <img src={about.mainImage} alt="About Section Cover" className={styles.previewImg} />
                ) : (
                  <span className={styles.noImg}>Şəkil Yoxdur</span>
                )}
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Yeni Şəkil Yüklə</label>
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
              <span className={styles.helpText}>Tövsiyə olunan nisbət: 4:3. Maksimum ölçü: 5MB.</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? 'Saxlanılır...' : '💾 Məlumatları Yadda Saxla'}
        </button>
      </form>
    </div>
  );
};

export default About;
