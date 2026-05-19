import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getContactsList, markContactRead } from '../../../services/adminService';
import { getBlogPosts } from '../../../services/blogService';
import { getPortfolioItems } from '../../../services/portfolioService';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const queryClient = useQueryClient();

  const { data: contacts, isLoading: contactsLoading } = useQuery({
    queryKey: ['admin', 'contacts'],
    queryFn: getContactsList
  });

  const { data: blogData } = useQuery({
    queryKey: ['blog', 'list'],
    queryFn: () => getBlogPosts({ limit: 100 })
  });

  const { data: portfolioData } = useQuery({
    queryKey: ['portfolio', 'list'],
    queryFn: () => getPortfolioItems()
  });

  const markAsReadMutation = useMutation({
    mutationFn: markContactRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'contacts'] });
    }
  });

  const contactsList = contacts || [];
  const unreadCount = contactsList.filter(c => !c.isRead).length;
  const blogCount = blogData?.posts?.length || 0;
  const portfolioCount = portfolioData?.items?.length || 0;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Məlumat Paneli</h2>
      <p className={styles.subtitle}>Sisteminizin cari vəziyyəti və ən son bildirişlər.</p>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.card}>
          <div className={styles.cardIcon}>✉️</div>
          <div>
            <h4 className={styles.cardValue}>{unreadCount}</h4>
            <p className={styles.cardLabel}>Oxunmamış Mesajlar</p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardIcon}>✍️</div>
          <div>
            <h4 className={styles.cardValue}>{blogCount}</h4>
            <p className={styles.cardLabel}>Blog Yazıları</p>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardIcon}>🎨</div>
          <div>
            <h4 className={styles.cardValue}>{portfolioCount}</h4>
            <p className={styles.cardLabel}>Portfolio Layihələri</p>
          </div>
        </div>
      </div>

      {/* Inbox Section */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Əlaqə Mesajları (Gələnlər)</h3>
        
        {contactsLoading ? (
          <p className={styles.loading}>Yüklənir...</p>
        ) : contactsList.length === 0 ? (
          <div className={styles.emptyInbox}>Heç bir mesaj tapılmadı.</div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Ad, Soyad</th>
                  <th>E-poçt / Telefon</th>
                  <th>Mövzu</th>
                  <th>Mesaj</th>
                  <th>Tarix</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {contactsList.map((contact) => (
                  <tr key={contact.id} className={!contact.isRead ? styles.unreadRow : ''}>
                    <td>
                      <div className={styles.nameCol}>
                        {!contact.isRead && <span className={styles.unreadDot}></span>}
                        <strong>{contact.name}</strong>
                      </div>
                    </td>
                    <td>
                      <div className={styles.contactDetails}>
                        <span>{contact.email}</span>
                        <span className={styles.phoneText}>{contact.phone}</span>
                      </div>
                    </td>
                    <td>{contact.subject}</td>
                    <td className={styles.messageCol}>{contact.message}</td>
                    <td className={styles.dateCol}>
                      {new Date(contact.createdAt).toLocaleDateString('az-AZ', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td>
                      {!contact.isRead ? (
                        <button
                          onClick={() => markAsReadMutation.mutate(contact.id)}
                          className={styles.actionBtn}
                        >
                          Oxundu et
                        </button>
                      ) : (
                        <span className={styles.readBadge}>Oxunub</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
