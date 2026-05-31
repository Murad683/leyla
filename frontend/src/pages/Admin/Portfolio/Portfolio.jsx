import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPortfolioItems } from '../../../services/portfolioService';
import { createPortfolioItem, updatePortfolioItem, deletePortfolioItem, uploadImage } from '../../../services/adminService';
import styles from './Portfolio.module.css';

const Portfolio = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Rəqəmsal Marketinq',
    client: '',
    year: '2026',
    role: 'Strategiya & İcra',
    duration: '3 ay',
    thumbnail: '',
    summary: '',
    challenge: '',
    solution: '',
    results: [{ metric: '', value: '' }],
    sections: [{ heading: '', body: '' }],
    isPublished: true,
    featured: false
  });

  const { data: portfolioData, isLoading } = useQuery({
    queryKey: ['portfolio', 'list'],
    queryFn: getPortfolioItems
  });

  const createMutation = useMutation({
    mutationFn: createPortfolioItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      closeModal();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updatePortfolioItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
      closeModal();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deletePortfolioItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
    }
  });

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Rəqəmsal Marketinq',
      client: '',
      year: '2026',
      role: 'Strategiya & İcra',
      duration: '3 ay',
      thumbnail: '',
      summary: '',
      challenge: '',
      solution: '',
      results: [{ metric: '', value: '' }],
      sections: [{ heading: '', body: '' }],
      isPublished: true,
      featured: false
    });
    setModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      slug: item.slug,
      category: item.category,
      client: item.client,
      year: item.year,
      role: item.role,
      duration: item.duration,
      thumbnail: item.thumbnail,
      summary: item.summary,
      challenge: item.challenge,
      solution: item.solution,
      results: Array.isArray(item.results) ? item.results : [{ metric: '', value: '' }],
      sections: Array.isArray(item.sections) ? item.sections : [{ heading: '', body: '' }],
      isPublished: item.isPublished,
      featured: item.featured
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTitleChange = (e) => {
    const val = e.target.value;
    const slugVal = val.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    
    setFormData(prev => ({
      ...prev,
      title: val,
      slug: editingItem ? prev.slug : slugVal
    }));
  };

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    try {
      const res = await uploadImage(file);
      setFormData(prev => ({ ...prev, thumbnail: res.url }));
    } catch (error) {
      alert('Şəkil yüklənməsində xəta baş verdi');
    } finally {
      setUploading(false);
    }
  };

  // Results array actions
  const handleResultChange = (index, field, value) => {
    const newResults = [...formData.results];
    newResults[index][field] = value;
    setFormData(prev => ({ ...prev, results: newResults }));
  };

  const addResult = () => {
    setFormData(prev => ({
      ...prev,
      results: [...prev.results, { metric: '', value: '' }]
    }));
  };

  const removeResult = (index) => {
    const newResults = formData.results.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, results: newResults }));
  };

  // Sections array actions
  const handleSectionChange = (index, field, value) => {
    const newSections = [...formData.sections];
    newSections[index][field] = value;
    setFormData(prev => ({ ...prev, sections: newSections }));
  };

  const addSection = () => {
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, { heading: '', body: '' }]
    }));
  };

  const removeSection = (index) => {
    const newSections = formData.sections.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, sections: newSections }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Bu layihəni silmək istədiyinizdən əminsiniz?')) {
      deleteMutation.mutate(id);
    }
  };

  const items = portfolioData?.items || [];

  if (isLoading) return <p className={styles.loading}>Yüklənir...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Portfolio Meneceri</h2>
          <p className={styles.subtitle}>Saytınızdakı keys-stadiləri, müştəri layihələrini və uğur hekayələrini idarə edin.</p>
        </div>
        <button onClick={openAddModal} className={styles.addBtn}>
          🎨 Yeni Layihə
        </button>
      </div>

      {/* Table list */}
      <div className={styles.card}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Şəkil</th>
                <th>Layihə Adı</th>
                <th>Kateqoriya</th>
                <th>Müştəri</th>
                <th>Status</th>
                <th>Xüsusiyyət</th>
                <th>Tarix</th>
                <th>Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className={styles.thumbnailBox}>
                      {item.thumbnail ? (
                        <img src={item.thumbnail} alt={item.title} className={styles.thumbnail} />
                      ) : (
                        <span className={styles.noThumbnail}>Şəkil yoxdur</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <strong>{item.title}</strong>
                    <br />
                    <span className={styles.slugText}>/{item.slug}</span>
                  </td>
                  <td>{item.category}</td>
                  <td>{item.client}</td>
                  <td>
                    {item.isPublished ? (
                      <span className={styles.publishedBadge}>Dərc edilib</span>
                    ) : (
                      <span className={styles.draftBadge}>Qaralama</span>
                    )}
                  </td>
                  <td>
                    {item.featured ? (
                      <span className={styles.featuredBadge}>Seçilmiş ⭐</span>
                    ) : (
                      <span className={styles.normalBadge}>Standart</span>
                    )}
                  </td>
                  <td>
                    {new Date(item.createdAt).toLocaleDateString('az-AZ')}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button onClick={() => openEditModal(item)} className={styles.editBtn}>✏️ Redaktə</button>
                      <button onClick={() => handleDelete(item.id)} className={styles.deleteBtn}>🗑️ Sil</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>
              {editingItem ? 'Layihəni Redaktə Et' : 'Yeni Layihə Yarat'}
            </h3>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Layihə Adı</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Slug (URL üçün)</label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.inputGroup3}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Kateqoriya</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="Rəqəmsal Marketinq">Rəqəmsal Marketinq</option>
                    <option value="Brend Strategiyası">Brend Strategiyası</option>
                    <option value="Sosial Media">Sosial Media</option>
                    <option value="SEO və Artım">SEO və Artım</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Müştəri (Client)</label>
                  <input
                    type="text"
                    name="client"
                    value={formData.client}
                    onChange={handleChange}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>İl (Year)</label>
                  <input
                    type="text"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className={styles.input}
                    required
                  />
                </div>
              </div>

              <div className={styles.inputGroup2}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Rol (Role)</label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className={styles.input}
                    required
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Müddət (Duration)</label>
                  <input
                    type="text"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className={styles.input}
                    required
                  />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Qısa Xülasə (Summary)</label>
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  className={styles.textarea}
                  rows={2}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Problem (Challenge)</label>
                <textarea
                  name="challenge"
                  value={formData.challenge}
                  onChange={handleChange}
                  className={styles.textarea}
                  rows={2}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Həll Yolu (Solution)</label>
                <textarea
                  name="solution"
                  value={formData.solution}
                  onChange={handleChange}
                  className={styles.textarea}
                  rows={2}
                  required
                />
              </div>

              {/* Dynamic Results */}
              <div className={styles.arraySection}>
                <div className={styles.arrayHeader}>
                  <label className={styles.label}>Nəticələr (Results)</label>
                  <button type="button" onClick={addResult} className={styles.arrayAddBtn}>
                    + Əlavə Et
                  </button>
                </div>
                {formData.results.map((res, index) => (
                  <div key={index} className={styles.arrayRow}>
                    <input
                      type="text"
                      placeholder="Məs: Satış Artımı"
                      value={res.metric}
                      onChange={(e) => handleResultChange(index, 'metric', e.target.value)}
                      className={styles.input}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Məs: +150%"
                      value={res.value}
                      onChange={(e) => handleResultChange(index, 'value', e.target.value)}
                      className={styles.input}
                      required
                    />
                    {formData.results.length > 1 && (
                      <button type="button" onClick={() => removeResult(index)} className={styles.arrayRemoveBtn}>
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Dynamic Extra Sections */}
              <div className={styles.arraySection}>
                <div className={styles.arrayHeader}>
                  <label className={styles.label}>Əlavə Bölmələr (Extra Sections)</label>
                  <button type="button" onClick={addSection} className={styles.arrayAddBtn}>
                    + Əlavə Et
                  </button>
                </div>
                {formData.sections.map((sec, index) => (
                  <div key={index} className={styles.arrayCard}>
                    <div className={styles.arrayCardHeader}>
                      <span>Bölmə {index + 1}</span>
                      {formData.sections.length > 1 && (
                        <button type="button" onClick={() => removeSection(index)} className={styles.arrayRemoveBtn}>
                          Sil ✕
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Başlıq"
                      value={sec.heading}
                      onChange={(e) => handleSectionChange(index, 'heading', e.target.value)}
                      className={styles.input}
                      required
                    />
                    <textarea
                      placeholder="Məzmun"
                      value={sec.body}
                      onChange={(e) => handleSectionChange(index, 'body', e.target.value)}
                      className={styles.textarea}
                      rows={3}
                      required
                    />
                  </div>
                ))}
              </div>

              {/* Upload thumbnail */}
              <div className={styles.imageGrid}>
                <div className={styles.thumbnailPreviewBox}>
                  {formData.thumbnail ? (
                    <img src={formData.thumbnail} alt="Preview" className={styles.previewThumbnail} />
                  ) : (
                    <span className={styles.noPreview}>Önizləmə yoxdur</span>
                  )}
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Layihə Şəkli Yüklə</label>
                  <div className={styles.uploadBtnWrapper}>
                    <button type="button" className={styles.uploadBtn}>
                      {uploading ? 'Yüklənir...' : '📁 Şəkil Seç'}
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className={styles.fileInput}
                      disabled={uploading}
                    />
                  </div>
                </div>
              </div>

              {/* Switches */}
              <div className={styles.switches}>
                <label className={styles.switchLabel}>
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleChange}
                  />
                  <span>Dərc Edilsin</span>
                </label>

                <label className={styles.switchLabel}>
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                  />
                  <span>Seçilmiş Layihə ⭐</span>
                </label>
              </div>

              <div className={styles.modalActions}>
                <button type="button" onClick={closeModal} className={styles.cancelBtn}>
                  Ləğv Et
                </button>
                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending ? 'Saxlanılır...' : 'Yadda Saxla'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
