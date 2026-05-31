import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getBlogPosts } from '../../../services/blogService';
import { createBlogPost, updateBlogPost, deleteBlogPost, uploadImage } from '../../../services/adminService';
import styles from './Blog.module.css';

const Blog = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    category: 'Marketinq',
    readTime: '5 dəqiqə',
    thumbnail: '',
    isPublished: true,
    featured: false
  });

  const { data: blogData, isLoading } = useQuery({
    queryKey: ['blog', 'list'],
    queryFn: () => getBlogPosts({ limit: 100 })
  });

  const createMutation = useMutation({
    mutationFn: createBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog'] });
      closeModal();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateBlogPost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog'] });
      closeModal();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteBlogPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog'] });
    }
  });

  const openAddModal = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      slug: '',
      summary: '',
      content: '',
      category: 'Marketinq',
      readTime: '5 dəqiqə',
      thumbnail: '',
      isPublished: true,
      featured: false
    });
    setModalOpen(true);
  };

  const openEditModal = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      summary: post.summary,
      content: post.content,
      category: post.category,
      readTime: post.readTime,
      thumbnail: post.thumbnail,
      isPublished: post.isPublished,
      featured: post.featured
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingPost(null);
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
      slug: editingPost ? prev.slug : slugVal
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPost) {
      updateMutation.mutate({ id: editingPost.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Bu məqaləni silmək istədiyinizdən əminsiniz?')) {
      deleteMutation.mutate(id);
    }
  };

  const posts = blogData?.posts || [];

  if (isLoading) return <p className={styles.loading}>Yüklənir...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Bloq Meneceri</h2>
          <p className={styles.subtitle}>Saytınızdakı bloq yazılarını, məqalələri və xəbərləri idarə edin.</p>
        </div>
        <button onClick={openAddModal} className={styles.addBtn}>
          ✍️ Yeni Məqalə
        </button>
      </div>

      {/* Table list */}
      <div className={styles.card}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Şəkil</th>
                <th>Başlıq</th>
                <th>Kateqoriya</th>
                <th>Oxuma Müddəti</th>
                <th>Status</th>
                <th>Xüsusiyyət</th>
                <th>Tarix</th>
                <th>Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <div className={styles.thumbnailBox}>
                      {post.thumbnail ? (
                        <img src={post.thumbnail} alt={post.title} className={styles.thumbnail} />
                      ) : (
                        <span className={styles.noThumbnail}>Şəkil yoxdur</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <strong>{post.title}</strong>
                    <br />
                    <span className={styles.slugText}>/{post.slug}</span>
                  </td>
                  <td>{post.category}</td>
                  <td>{post.readTime}</td>
                  <td>
                    {post.isPublished ? (
                      <span className={styles.publishedBadge}>Dərc edilib</span>
                    ) : (
                      <span className={styles.draftBadge}>Qaralama</span>
                    )}
                  </td>
                  <td>
                    {post.featured ? (
                      <span className={styles.featuredBadge}>Seçilmiş ⭐</span>
                    ) : (
                      <span className={styles.normalBadge}>Standart</span>
                    )}
                  </td>
                  <td>
                    {new Date(post.createdAt).toLocaleDateString('az-AZ')}
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button onClick={() => openEditModal(post)} className={styles.editBtn}>✏️ Redaktə</button>
                      <button onClick={() => handleDelete(post.id)} className={styles.deleteBtn}>🗑️ Sil</button>
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
              {editingPost ? 'Məqaləni Redaktə Et' : 'Yeni Məqalə Yaz'}
            </h3>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Məqalə Başlığı</label>
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

              <div className={styles.inputGroup2}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Kateqoriya</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className={styles.select}
                  >
                    <option value="Marketinq">Marketinq</option>
                    <option value="Dizayn">Dizayn</option>
                    <option value="Texnologiya">Texnologiya</option>
                    <option value="Strategiya">Strategiya</option>
                  </select>
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Oxuma Müddəti</label>
                  <input
                    type="text"
                    name="readTime"
                    value={formData.readTime}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder="5 dəqiqə"
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
                <label className={styles.label}>Əsas Məzmun (Content)</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  className={styles.textarea}
                  rows={6}
                  required
                />
              </div>

              {/* Upload image */}
              <div className={styles.imageGrid}>
                <div className={styles.thumbnailPreviewBox}>
                  {formData.thumbnail ? (
                    <img src={formData.thumbnail} alt="Preview" className={styles.previewThumbnail} />
                  ) : (
                    <span className={styles.noPreview}>Önizləmə yoxdur</span>
                  )}
                </div>

                <div className={styles.inputGroup}>
                  <label className={styles.label}>Kaver Şəkli Yüklə</label>
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
                  <span>Seçilmiş Məqalə ⭐</span>
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

export default Blog;
