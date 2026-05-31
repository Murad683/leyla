import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getServices } from '../../../services/settingsService';
import { createService, updateService, deleteService } from '../../../services/adminService';
import styles from './Services.module.css';

const Services = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon: 'QualityIcon',
    features: ''
  });

  const { data: services, isLoading } = useQuery({
    queryKey: ['services'],
    queryFn: getServices
  });

  const createMutation = useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      closeModal();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateService(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      closeModal();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    }
  });

  const openAddModal = () => {
    setEditingService(null);
    setFormData({
      title: '',
      description: '',
      icon: 'QualityIcon',
      features: ''
    });
    setModalOpen(true);
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      icon: service.icon || 'QualityIcon',
      features: Array.isArray(service.features) ? service.features.join(', ') : service.features || ''
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingService(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      features: formData.features.split(',').map(f => f.trim()).filter(Boolean)
    };

    if (editingService) {
      updateMutation.mutate({ id: editingService.id, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Bu xidməti silmək istədiyinizdən əminsiniz?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <p className={styles.loading}>Yüklənir...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Xidmətlər Meneceri</h2>
          <p className={styles.subtitle}>Saytınızda təqdim olunan rəqəmsal marketinq xidmətlərini idarə edin.</p>
        </div>
        <button onClick={openAddModal} className={styles.addBtn}>
          ➕ Yeni Xidmət
        </button>
      </div>

      {/* Grid of services */}
      <div className={styles.grid}>
        {services?.map((service) => (
          <div key={service.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.serviceIcon}>📈</span>
              <div className={styles.actions}>
                <button onClick={() => openEditModal(service)} className={styles.editBtn}>✏️ Redaktə</button>
                <button onClick={() => handleDelete(service.id)} className={styles.deleteBtn}>🗑️ Sil</button>
              </div>
            </div>
            <h3 className={styles.serviceTitle}>{service.title}</h3>
            <p className={styles.serviceDesc}>{service.description}</p>
            <div className={styles.featuresList}>
              <strong>Göstəricilər:</strong>
              <ul>
                {service.features?.map((feat, idx) => (
                  <li key={idx}>✓ {feat}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>
              {editingService ? 'Xidməti Redaktə Et' : 'Yeni Xidmət Əlavə Et'}
            </h3>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Başlıq</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Açıqlama</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className={styles.textarea}
                  rows={4}
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Üstünlüklər / Göstəricilər (vergüllə ayırın)</label>
                <input
                  type="text"
                  name="features"
                  value={formData.features}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Xidmət 1, Xidmət 2, Xidmət 3"
                  required
                />
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

export default Services;
