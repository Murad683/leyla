import React, { useEffect, useRef } from 'react';
import styles from './Modal.module.css';
import { CloseIcon } from '../../../assets/icons';

const Modal = ({ isOpen, onClose, title, children, className = '' }) => {
  const overlayRef = useRef(null);
  useEffect(() => {
    const handleEscape = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) { document.addEventListener('keydown', handleEscape); document.body.style.overflow = 'hidden'; }
    return () => { document.removeEventListener('keydown', handleEscape); document.body.style.overflow = 'auto'; };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={(e) => { if (e.target === overlayRef.current) onClose(); }} ref={overlayRef} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className={`${styles.modal} ${className}`}>
        <div className={styles.header}>
          {title && <h3 id="modal-title" className={styles.title}>{title}</h3>}
          <button onClick={onClose} className={styles.closeBtn} aria-label="Close modal"><CloseIcon /></button>
        </div>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  );
};
export default Modal;
