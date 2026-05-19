import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../../services/adminService';
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login({ email, password });
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.message || 'Yanlış e-poçt və ya şifrə');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.glowOrb1}></div>
      <div className={styles.glowOrb2}></div>
      
      <div className={styles.card}>
        <div className={styles.header}>
          <h2 className={styles.title}>LeylaDigital</h2>
          <p className={styles.subtitle}>İdarəetmə Paneli Girişi</p>
        </div>

        {error && <div className={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>E-poçt Ünvanı</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              placeholder="admin@leyladigital.com"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Şifrə</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? 'Giriş edilir...' : 'Daxil Ol'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
